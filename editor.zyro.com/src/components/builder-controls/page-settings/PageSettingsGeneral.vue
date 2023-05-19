<template>
	<div>
		<ZyroFieldInput
			v-if="!isPageTypeProduct"
			id="name-in-navigation"
			:model-value="pageName"
			:label="$t('builder.pageSettingsModal.textFields.nameInNavigation.label')"
			:error="pageNameErrorMessage"
			@update:model-value="handleNameChange"
		/>
		<ZyroFieldInput
			v-if="!isHomepage"
			id="page-url"
			:model-value="pageSlug"
			:label="$t('builder.pageSettingsModal.textFields.pageUrl.label')"
			:message="pageSlugMessage"
			:error="pageSlugErrorMessage"
			input-data-qa="page-settings-page-url-input"
			@update:model-value="updatePageSlug"
		/>
		<template v-if="!isPageTypeProduct">
			<ZyroSeparator />
			<ZyroFieldToggle
				id="page-is-hidden"
				:model-value="isItemHidden"
				:label="$t('builder.pageSettingsModal.textFields.pageHide.label')"
				:message="$t('builder.pageSettingsModal.textFields.pageHide.message')"
				toggle-data-qa="hide-page-toggle"
				@update:model-value="$emit('set-is-item-hidden', $event)"
			/>
		</template>
	</div>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import { useStore } from 'vuex';

import {
	PAGE_TYPE_ECOMMERCE_PRODUCT,
	PAGE_TYPE_DEFAULT,
} from '@zyro-inc/site-modules/constants';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';

import { slugifyPagePath } from '@/utils/urlValidators';

import {
	defineComponent,
	computed,
	toRefs,
} from 'vue';
import { usePageNameWithSlugValidation } from '@/use/usePageNameWithSlugValidation';
import { useI18n } from 'vue-i18n';

export default defineComponent({

	components: {
		ZyroFieldInput,
		ZyroFieldToggle,
		ZyroSeparator,
	},

	props: {
		isItemHidden: {
			type: Boolean,
			required: true,
		},
		pageType: {
			type: String,
			default: PAGE_TYPE_DEFAULT,
		},
		pageId: {
			type: String,
			default: '',
		},
	},

	emits: [
		'set-is-item-hidden',
		'is-valid',
	],

	setup(props, { emit }) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { t } = useI18n();

		const {
			pageId,
			pageType,
		} = toRefs(props);
		const isHomepage = computed(() => getters.homePageId === pageId.value);
		const isPageTypeProduct = computed(() => pageType.value === PAGE_TYPE_ECOMMERCE_PRODUCT);
		const pageSlugMessage = computed(() => {
			const path = getPagePathFromId({
				pageId: pageId.value,
				siteData: state.website,
				locale: state.currentLocale,
			});

			return `${t('builder.pageSettingsModal.textFields.pageUrl.message')} ${getters.siteUrl}${path}`;
		});
		const pageToEdit = computed(() => getters.sitePages[pageId.value]);
		const pageName = computed(() => pageToEdit.value.name);
		const pageSlug = computed(() => pageToEdit.value.slug);
		const {
			pageNameErrorMessage,
			isPageNameValid,
			pageSlugErrorMessage,
			isPageSlugValid,
		} = usePageNameWithSlugValidation({
			pageName,
			pageSlug,
			pageId,
		});
		const isFormValid = computed(() => {
			if (isHomepage.value) {
				return isPageNameValid.value;
			}

			return isPageNameValid.value && isPageSlugValid.value;
		});

		const updatePageName = (newValue) => {
			dispatch('mergePageData', {
				pageId: pageId.value,
				pageData: {
					name: newValue,
				},
			});

			emit('is-valid', isFormValid.value);
		};

		const updatePageSlug = (newValue) => {
			dispatch('mergePageData', {
				pageId: pageId.value,
				pageData: {
					slug: slugifyPagePath(newValue).path,
				},
			});

			emit('is-valid', isFormValid.value);
		};

		const handleNameChange = (newValue) => {
			const trimmedValue = newValue.trim();

			updatePageName(trimmedValue);

			if (!isHomepage.value) {
				updatePageSlug(trimmedValue);
			}
		};

		return {
			isHomepage,
			isPageTypeProduct,
			pageSlugMessage,
			pageName,
			pageSlug,
			pageNameErrorMessage,
			pageSlugErrorMessage,
			updatePageName,
			updatePageSlug,
			handleNameChange,
		};
	},
});
</script>
