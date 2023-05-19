<template>
	<div>
		<ZyroDropdown
			v-model="selectedOption"
			v-qa="'linksettingsmodal-inputdropdown-page'"
			:options="dropdownValues"
			:label="$t('builder.editButton.linkSettings.label')"
			@update:model-value="handleSelect"
		/>

		<LinkSettingsFileDownload
			v-if="isSelectedDownload"
			:href="href"
			@update:target="$emit('update:target', $event)"
			@update:href="$emit('update:href', $event)"
		/>

		<template v-else>
			<div v-if="isSelectedAnchoredSection">
				<ZyroSelect
					class="link-settings__anchored-section-datalist"
					:options="anchoredSections"
					:model-value="selectedAnchoredSection"
					:placeholder="anchoredSectionDropdownPlaceholder"
					:filterable="false"
					:searchable="false"
					:disabled="!anchoredSections.length"
					@update:model-value="handleAnchoredSectionSelect"
				>
					<template
						v-if="!!selectedAnchoredSection"
						#selected-option="selectedOptionProps"
					>
						<i18n-t
							tag="span"
							keypath="builder.editButton.linkSettings.anchorInPage"
							class="anchored-section__search-value"
						>
							<span class="anchor-id">{{ selectedOptionProps.option.anchorId }}</span>
							<span>{{ selectedOptionProps.option.pageName }}</span>
						</i18n-t>
					</template>

					<template #option="optionProps">
						<span>{{ optionProps.option.anchorId }}</span>
						<br>
						<i18n-t
							tag="span"
							keypath="builder.editButton.linkSettings.anchorWithPageSuffix"
							class="anchored-section__option-page-name"
						>
							{{ optionProps.option.pageName }}
						</i18n-t>
					</template>
				</ZyroSelect>
				<p class="link-settings__anchored-section-hint">
					{{ $t('builder.editButton.linkSettings.anchoredSectionDropdownHint') }}
				</p>
			</div>

			<ZyroFieldInput
				v-if="isSelectedExternal"
				:id="`${elementId}-link`"
				v-qa="'new-link-url-input-field'"
				:model-value="href || ''"
				input-data-qa="linksettingsmodal-input"
				placeholder="https://www.example.com"
				:message="$t('builder.linkSettingsIndicativeLabel')"
				@input-blur="handleHrefBlur"
			/>

			<ZyroFieldToggle
				:id="`${elementId}-toggle-openinnewtab`"
				v-qa="'linksettingsmodal-inputtoggle-openinnewtab'"
				:model-value="target === '_blank'"
				:label="$t('builder.editButton.linkSettings.toggleFieldLabel')"
				@update:model-value="toggleOpenNewTab"
			/>

			<ZyroFieldToggle
				v-if="isSelectedExternal || isSelectedAnchoredSection"
				:id="`${elementId}-toggle-relnofollow`"
				v-qa="'linksettingsmodal-inputtoggle-relnofollow'"
				:model-value="rel === 'nofollow'"
				:label="$t('builder.editButton.linkSettings.toggleRelNoFollowFieldLabel')"
				:message="$t('builder.editButton.linkSettings.toggleRelNoFollowFieldDescription')"
				@update:model-value="toggleRelNoFollow"
			/>
		</template>
	</div>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSelect from '@/components/global/ZyroSelect.vue';

import {
	mapState,
	mapGetters,
	useStore,
} from 'vuex';

import {
	LINK_TYPE_INTERNAL,
	LINK_TYPE_EXTERNAL,
	LINK_TYPE_DOWNLOAD,
	LINK_TYPE_ANCHORED_SECTION,
} from '@zyro-inc/site-modules/constants';

import LinkSettingsFileDownload from '@/components/builder-controls/edit-button/LinkSettingsFileDownload.vue';
import { generateRandomId } from '@/utils/generateRandomId';
import {
	getValidPhone,
	getValidEmail,
} from '@/utils/urlValidators';

import {
	ref,
	computed,
	defineComponent,
} from 'vue';
import { useI18n } from 'vue-i18n';

export const DEFAULT_PREFIX = 'https://';

export const ALLOWED_PREFIXES = [
	DEFAULT_PREFIX,
	'http://',
	'sms:',
	'fax:',
	'tel:',
	'mailto:',
	'/',
];

export default defineComponent({

	components: {
		ZyroDropdown,
		ZyroFieldInput,
		ZyroFieldToggle,
		LinkSettingsFileDownload,
		ZyroSelect,
	},

	props: {
		target: {
			type: String,
			default: null,
		},
		href: {
			type: String,
			default: null,
		},
		rel: {
			type: String,
			default: null,
		},
		pageId: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			default: LINK_TYPE_EXTERNAL,
			validator: (value) => [
				LINK_TYPE_EXTERNAL,
				LINK_TYPE_DOWNLOAD,
				LINK_TYPE_INTERNAL,
				LINK_TYPE_ANCHORED_SECTION,
			].includes(value),
		},
		// This property is needed until deep nav/pages refactor.
		// Currently adding/adjusting links in pages drawer allows also adding internal pages.
		// We could force their type from "Link" to "Page", but then IDs would match when adding the same page.
		disableInternalPages: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'update:type',
		'update:pageId',
		'update:target',
		'update:rel',
		'update:href',
	],

	setup(props, ctx) {
		const { t } = useI18n();
		const {
			getters,
			state,
		} = useStore();
		const selectedOption = ref(null);
		const anchoredGlobalFooter = computed(() => Object.values(getters.siteBlocks).find(({
			htmlId,
			slot,
		}) => !!htmlId && slot === 'footer'));

		const isHomepage = (pageId) => pageId === getters.homePageId;
		const anchoredSections = computed(() => [
			...Object.entries(getters.siteBlocks)
				.filter(([, blockData]) => blockData.htmlId && blockData.slot !== 'footer')
				.map(([blockId, { htmlId }]) => {
					const [pageId, pageData] = Object.entries(getters.sitePages).find(([, { blocks }]) => blocks.includes(blockId));
					const slug = isHomepage(pageId) ? `#${htmlId}` : `/${pageData.slug}#${htmlId}`;

					return {
						anchorId: htmlId,
						pageName: pageData.name,
						slug,
					};
				}),
			// Handles global anchored footers
			// Buttons that link to footer will link to the current page footer
			...(anchoredGlobalFooter.value ? [
				{
					anchorId: anchoredGlobalFooter.value.htmlId,
					pageName: getters.currentPage.name,
					slug: isHomepage(state.currentPageId)
						? `#${anchoredGlobalFooter.value.htmlId}`
						: `/${getters.currentPage.slug}#${anchoredGlobalFooter.value.htmlId}`,
				},
			] : []),
		]);

		const getInitialSectionAnchor = () => {
			if (!props.href) {
				return null;
			}

			const splitHref = props.href.split('#');
			const [pageSlug, anchorId] = splitHref;

			if (splitHref.length !== 2 && pageSlug && anchorId) {
				return null;
			}

			const page = props.href.startsWith('/#')
				? getters.siteHomePage
				: Object.values(getters.sitePages).find(({ slug }) => slug === pageSlug.slice(1));

			if (!page) {
				return null;
			}

			return [
				{
					anchorId,
					pageName: page.name,
					slug: props.href,
				},
			];
		};

		const selectedAnchoredSection = ref(getInitialSectionAnchor());

		const anchoredSectionDropdownPlaceholder = ref(anchoredSections.value.length
			? t('builder.editButton.linkSettings.anchoredSectionPlaceholder')
			: t('builder.editButton.linkSettings.noNamedSections'));

		const isSelectedAnchoredSection = computed(() => selectedOption.value?.type === LINK_TYPE_ANCHORED_SECTION);

		// Appends tel:, mailto: or https://, depending on the validation.
		// TODO: instead of force-changing href, add proper validation
		const emitPrefixedHref = (inputValue) => {
			if (!inputValue) {
				return inputValue;
			}

			const emailValidationResult = getValidEmail(inputValue);

			if (emailValidationResult.isUrlValid) {
				return ctx.emit('update:href', emailValidationResult.url);
			}

			const phoneValidationResult = getValidPhone(inputValue);

			if (phoneValidationResult.isUrlValid) {
				return ctx.emit('update:href', phoneValidationResult.url);
			}

			if (inputValue.startsWith('#')) {
				const localePrefix = state.currentLocale !== state.defaultLocale ? `/${state.currentLocale}` : '';

				return ctx.emit('update:href', `${localePrefix}/${inputValue}`);
			}

			const doesStartWithAllowedPrefix = ALLOWED_PREFIXES.some((prefix) => inputValue.startsWith(prefix));

			if (!doesStartWithAllowedPrefix) {
				return ctx.emit('update:href', `${DEFAULT_PREFIX}${inputValue}`);
			}

			return ctx.emit('update:href', inputValue);
		};

		const handleAnchoredSectionSelect = (value) => {
			selectedAnchoredSection.value = [value];
			emitPrefixedHref(value.slug);
		};

		const handleHrefBlur = ({ target }) => {
			emitPrefixedHref(target.value.trim());
		};

		return {
			anchoredSections,
			selectedOption,
			selectedAnchoredSection,
			anchoredSectionDropdownPlaceholder,
			isSelectedAnchoredSection,
			handleAnchoredSectionSelect,
			handleHrefBlur,
		};
	},

	computed: {
		...mapState(['isDemoMode']),
		...mapGetters([
			'sitePages',
			'siteBlocks',
		]),
		elementId() {
			return generateRandomId();
		},
		isSelectedExternal() {
			return this.selectedOption?.type === LINK_TYPE_EXTERNAL;
		},
		isSelectedDownload() {
			return this.selectedOption?.type === LINK_TYPE_DOWNLOAD;
		},
		isSelectedInternal() {
			return this.selectedOption?.type === LINK_TYPE_INTERNAL;
		},
		dropdownValues() {
			const internalPages = Object
				.entries(this.sitePages)
				.map(([pageId, page]) => ({
					title: page.type === 'blog' ? page.meta.title : page.name,
					value: pageId,
					type: LINK_TYPE_INTERNAL,
				}));

			return [
				{
					title: this.$t('builder.linkSettingsCustomLink'),
					svg: 'link',
					value: LINK_TYPE_EXTERNAL,
					type: LINK_TYPE_EXTERNAL,
				},
				...(this.isDemoMode ? [] : [
					{
						title: this.$t('builder.linkSettingsFileDownload'),
						svg: 'document',
						value: LINK_TYPE_DOWNLOAD,
						type: LINK_TYPE_DOWNLOAD,
					},
				]),
				{
					title: this.$t('builder.linkSettingsSection'),
					svg: 'sections',
					value: 'section',
					type: LINK_TYPE_ANCHORED_SECTION,
				},
				...(this.disableInternalPages ? [] : internalPages),
			];
		},
	},

	created() {
		this.selectedOption = this.dropdownValues.find((option) => {
			if (this.type === LINK_TYPE_INTERNAL) {
				return this.pageId === option.value;
			}

			return this.type === option.type;
		});

		if (!this.selectedOption) {
			[this.selectedOption] = this.dropdownValues;
		}

		// If no href or page ID is set, preselect the first option
		if (!this.href && !this.pageId) {
			this.handleSelect(this.selectedOption);
		}
	},

	methods: {
		handleSelect({
			value,
			type,
		}) {
			this.$emit('update:type', type);

			// clear all the attributes to prevent falsely setting stuff to data.json
			this.$emit('update:href', null);
			this.$emit('update:pageId', null);
			this.$emit('update:rel', null);
			this.$emit('update:target', null);

			if (type === LINK_TYPE_EXTERNAL) {
				this.$emit('update:rel', 'nofollow');
				this.$emit('update:target', '_blank');
			}

			if (type === LINK_TYPE_INTERNAL) {
				this.$emit('update:pageId', value);
			}
		},
		toggleOpenNewTab() {
			this.$emit('update:target', this.target === '_blank' ? null : '_blank');
		},
		toggleRelNoFollow() {
			this.$emit('update:rel', this.rel === 'nofollow' ? null : 'nofollow');
		},
	},
});
</script>

<style scoped lang="scss">
	:deep(.link-settings__anchored-section-datalist) {
		.vs__search {
			z-index: 0;
		}

		.vs__dropdown-menu {
			max-height: 328px;
		}
	}

	.link-settings {
		&__anchored-section-datalist {
			margin-bottom: 8px;

			.anchored-section__search-value,
			.anchored-section__option-page-name {
				font-size: 14px;
				line-height: 1.43;
				letter-spacing: 0.25px;
				color: $color-gray;
			}

			.anchored-section__search-value {
				width: 255px;
				overflow: hidden;
				text-overflow: ellipsis;

				.anchor-id {
					white-space: nowrap;
					color: $color-dark;
				}
			}
		}

		&__anchored-section-hint {
			font-size: 12px;
			line-height: 1.33;
			color: $color-gray;
		}
	}
</style>
