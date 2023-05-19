<template>
	<div class="page-settings-seo-general">
		<!-- Search preview -->
		<PageSearchPreview
			class="page-settings-seo-general__search-preview"
			:title="searchPreviewTitle"
			:url="searchPreviewUrl"
			:description="searchPreviewDescription"
		/>
		<p class="page-settings-seo-general__search-preview-disclaimer-text">
			{{ $t('builder.pageSettingsModal.googleSeoUpdateMessageV2') }}
		</p>

		<!-- Meta title -->
		<ZyroFieldInput
			id="page-title"
			:model-value="pageMetaTitle"
			:label="$t('builder.pageSettingsModal.seoTitle')"
			:maxlength="SEO_MAX_STRING_LENGTH_TITLE"
			@update:model-value="updatePageMetaTitle"
			@input-blur="isMetaTitleMessageShown = false"
			@input-focus="isMetaTitleMessageShown = true"
		>
			<template
				v-if="isMetaTitleMessageShown"
				#sublabel
			>
				<div class="page-settings-seo-general__char-counter z-body-small">
					{{ pageMetaTitle.length }} / {{ SEO_MAX_STRING_LENGTH_TITLE }}
				</div>
			</template>
			<template
				v-if="isMetaTitleMessageShown"
				#message
			>
				<p class="page-settings-seo-general__input-message z-body-small">
					{{ $t('builder.pageSettingsModal.seoTitleMessage') }}
				</p>
			</template>
		</ZyroFieldInput>

		<!-- Meta description -->
		<ZyroFieldTextArea
			id="page-description"
			:model-value="pageMetaDescription"
			:label="$t('builder.pageSettingsModal.metaDescription')"
			is-resizable
			:maxlength="SEO_MAX_STRING_LENGTH_DESCRIPTION"
			@update:model-value="updatePageMetaDescription"
			@text-area-blur="isMetaDescriptionMessageShown = false"
			@text-area-focus="isMetaDescriptionMessageShown = true"
		>
			<template
				v-if="isMetaDescriptionMessageShown"
				#sublabel
			>
				<div class="page-settings-seo-general__char-counter z-body-small">
					{{ pageMetaDescription.length }} / {{ SEO_MAX_STRING_LENGTH_DESCRIPTION_COUNTER }}
				</div>
			</template>
			<template
				v-if="isMetaDescriptionMessageShown"
				#message
			>
				<p class="page-settings-seo-general__input-message z-body-small">
					{{ $t('builder.pageSettingsModal.metaDescriptionMessage') }}
				</p>
			</template>
		</ZyroFieldTextArea>
		<div class="page-settings-seo-general__keywords-header z-body-small">
			<p class="z-body-small z-body-small--strong">
				{{ $t('builder.keywords') }}
			</p>
			<p class="page-settings-seo-general__keywords-header-counter z-body-small">
				{{ `${pageMetaKeywordsCount}/${MAX_KEYWORDS}` }}
			</p>
		</div>

		<!-- Meta keywords -->
		<p class="page-settings-seo-general__keywords-message">
			{{ $t('builder.keywordsMessage') }}
		</p>
		<EditableItemsList
			:items="editableListPageMetaKeywords"
			:placeholder="$t('builder.addNewKeywordPlaceholder')"
			:validate-value="getIsKeywordValid"
			@update-items="updateKeywords"
			@edit="updateSingleKeyword({
				oldKeyword: $event.oldValue.name,
				newKeyword: $event.newValue.name,
			})"
		>
			<template #header>
				<EditableItemsAddButton
					:button-text="$t('builder.pageSettingsAddNewKeyword')"
					:placeholder="$t('builder.addNewKeywordPlaceholder')"
					class="page-settings-seo-general__add-keyword-button"
					:class="{ 'page-settings-seo-general__add-keyword-button--disabled': isPageMetaKeywordsLimitReached }"
					:is-input-visible-on-add-click="!isPageMetaKeywordsLimitReached"
					:validate-value="getIsKeywordValid"
					@add="addKeyword({ keyword: $event })"
				/>
			</template>
			<template #item-button="{ item }">
				<ZyroButton
					:title="$t('common.remove')"
					@click="removeKeyword({ keyword: item.name })"
				>
					<template #icon-left>
						<Icon
							name="close"
							dimensions="20px"
						/>
					</template>
				</ZyroButton>
			</template>
		</EditableItemsList>

		<!-- noindex toggle -->
		<ZyroFieldToggle
			id="page-noindex"
			v-qa="'pagesettings-inputtoggle-noindex'"
			:model-value="shouldPageBeNoIndexed"
			:label="$t('siteSettings.seo.toggleFields.noindex.label')"
			@update:model-value="updateShouldPageBeNoIndexed"
		/>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import EditableItemsAddButton from '@/components/reusable-components/editable-items-list/-partials/EditableItemsAddButton.vue';
import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';

import { useStore } from 'vuex';

import {
	SEO_MAX_STRING_LENGTH_DESCRIPTION,
	SEO_MAX_STRING_LENGTH_DESCRIPTION_COUNTER,
	SEO_MAX_STRING_LENGTH_TITLE,
} from '@zyro-inc/site-modules/constants';
import PageSearchPreview from '@/components/builder-controls/page-settings/PageSearchPreview.vue';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';
import {
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

const SEO_KEYWORD_MAX_STRING_LENGTH = 100;
const MAX_KEYWORDS = 3;

export default defineComponent({
	name: 'PageSettingsSeoGeneral',

	components: {
		Icon,
		ZyroButton,
		ZyroFieldInput,
		ZyroFieldTextArea,
		ZyroFieldToggle,
		PageSearchPreview,
		EditableItemsList,
		EditableItemsAddButton,
	},
	props: {
		pageId: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { t } = useI18n();

		const isMetaTitleMessageShown = ref(false);
		const isMetaDescriptionMessageShown = ref(false);

		const currentLanguageData = computed(() => getters.currentLanguageData);
		const sitePages = computed(() => getters.sitePages);
		const siteMetaTitle = computed(() => currentLanguageData.value.metaTitle);
		const siteUrl = computed(() => getters.siteUrl);
		const pageData = computed(() => sitePages.value[props.pageId]);
		const pageMeta = computed(() => pageData.value.meta ?? {});
		const pageMetaTitle = computed(() => pageMeta.value.title ?? '');
		const pageMetaDescription = computed(() => pageMeta.value.description ?? '');

		const mergePageMeta = (dataToMerge) => {
			dispatch('mergePageData', {
				pageId: props.pageId,
				pageData: {
					meta: {
						...dataToMerge,
					},
				},
			});
		};

		const updatePageMetaTitle = (title) => mergePageMeta({
			title,
		});

		const updatePageMetaDescription = (description) => mergePageMeta({
			description,
		});

		// Search preview
		const searchPreviewTitle = computed(() => `${pageMetaTitle.value || pageData.value.name}${siteMetaTitle.value ? ` | ${siteMetaTitle.value}` : ''}`);

		const searchPreviewUrl = computed(() => {
			const url = getPagePathFromId({
				siteData: state.website,
				pageId: props.pageId,
				locale: state.currentLocale,
			}) || '';

			return `${siteUrl.value}${url}`;
		});
		const searchPreviewDescription = computed(() => pageMeta.value.description || t('builder.pageSettingsModal.metaDescriptionPlaceholder'));

		// Meta keywords
		const pageMetaKeywords = computed(() => pageMeta.value.keywords ?? []);
		const pageMetaKeywordsCount = computed(() => pageMetaKeywords.value.length);
		const isPageMetaKeywordsLimitReached = computed(() => pageMetaKeywordsCount.value >= MAX_KEYWORDS);
		const editableListPageMetaKeywords = computed(() => pageMetaKeywords.value.map((name) => ({
			name,
		})));

		const getIsKeywordValid = (keyword) => {
			if (!keyword) {
				return {
					isValid: false,
					error: t('validate.emptyValue'),
				};
			}

			if (keyword.length > SEO_KEYWORD_MAX_STRING_LENGTH) {
				return {
					isValid: false,
					error: t('builder.maxKeywordLength', [SEO_KEYWORD_MAX_STRING_LENGTH]),
				};
			}

			if (pageMetaKeywords.value.includes(keyword)) {
				return {
					isValid: false,
					error: t('builder.keywordAlreadyExists'),
				};
			}

			return {
				isValid: true,
			};
		};

		const addKeyword = ({ keyword }) => {
			if (isPageMetaKeywordsLimitReached.value) {
				return;
			}

			const updatedKeywords = [
				...pageMetaKeywords.value,
				keyword,
			];

			mergePageMeta({
				keywords: updatedKeywords,
			});
		};

		const removeKeyword = ({ keyword }) => {
			const updatedKeywords = pageMetaKeywords.value.filter((currentKeyword) => currentKeyword !== keyword);

			mergePageMeta({
				keywords: updatedKeywords,
			});
		};

		const updateKeywords = (editableListKeywords) => {
			const keywords = editableListKeywords.map(({ name }) => name);

			mergePageMeta({
				keywords,
			});
		};

		const updateSingleKeyword = ({
			oldKeyword,
			newKeyword,
		}) => {
			const keywords = pageMetaKeywords.value.map((currentKeyword) => (currentKeyword === oldKeyword ? newKeyword : currentKeyword));

			mergePageMeta({
				keywords,
			});
		};

		// Meta noindex
		const shouldPageBeNoIndexed = computed(() => pageMeta.value.noindex || false);
		const updateShouldPageBeNoIndexed = (noindexValue) => {
			mergePageMeta({
				noindex: noindexValue,
			});
		};

		return {
			// Search preview
			searchPreviewTitle,
			searchPreviewUrl,
			searchPreviewDescription,

			// Meta title
			pageMetaTitle,
			isMetaTitleMessageShown,
			updatePageMetaTitle,

			// Meta description
			pageMetaDescription,
			isMetaDescriptionMessageShown,
			updatePageMetaDescription,

			// Meta keywords
			editableListPageMetaKeywords,
			getIsKeywordValid,
			updateKeywords,
			pageMetaKeywordsCount,
			isPageMetaKeywordsLimitReached,
			updateSingleKeyword,
			addKeyword,
			removeKeyword,

			// no-index
			shouldPageBeNoIndexed,
			updateShouldPageBeNoIndexed,

			// constants
			SEO_MAX_STRING_LENGTH_DESCRIPTION_COUNTER,
			SEO_MAX_STRING_LENGTH_DESCRIPTION,
			SEO_MAX_STRING_LENGTH_TITLE,
			MAX_KEYWORDS,
		};
	},
});
</script>
<style lang="scss" scoped>
.page-settings-seo-general {
	&__search-preview {
		margin-bottom: 8px;
	}

	&__search-preview-disclaimer-text {
		margin-bottom: 16px;
		font-size: 12px;
		font-weight: 400;
		line-height: 1.67;
		color: $color-gray;
	}

	&__char-counter {
		position: absolute;
		top: 8px;
		right: 0;
		color: $color-gray;
	}

	&__input-message {
		margin-top: 8px;
		font-size: 13px;
		color: $color-gray;
	}

	&__keywords-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	&__keywords-header-counter {
		color: $color-gray;
	}

	&__keywords-message {
		margin-bottom: 8px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
	}

	&__add-keyword-button {
		:deep(.zyro-button) {
			padding: 16px 0;
			border-bottom: 1px solid $color-gray-border;
		}

		&--disabled {
			:deep(.zyro-button) {
				color: $color-gray-border;
				cursor: not-allowed;
			}
		}
	}
}
</style>
