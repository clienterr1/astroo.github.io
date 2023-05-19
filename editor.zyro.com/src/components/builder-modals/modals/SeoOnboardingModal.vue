<template>
	<Teleport to="body">
		<ZyroModal
			:max-width="'730px'"
			:height="'auto'"
			:max-height="'auto'"
			position="center"
			class="seo-onboarding"
			:class="{ 'loading': isLoading }"
			show-close-button
			content-padding="0 40px 16px 40px"
			@close-modal="$emit('close')"
		>
			<div class="seo-onboarding__content">
				<div
					v-if="currentStepName !== ONBOARDING_STEPS_SEO_INTRO"
					class="page-reminder"
				>
					<span class="page-reminder__seo">{{ $t('common.seo') }}:</span>
					<ZyroSvgDeprecated
						class="page-icon"
						:name="isCurrentPageHomePage ? 'home' : 'page'"
					/>
					<span class="page-reminder__page-name">{{ pageName }}</span>
				</div>
				<div
					v-if="currentStepName === ONBOARDING_STEPS_SEO_INTRO"
					class="onboarding-intro"
				>
					<ZyroSvgDeprecated
						name="search"
						dimensions="16px"
						class="search-icon"
					/>
					<p class="content-heading">
						{{ $t('builder.optimizeForGoogle') }}
					</p>
					<p class="content-subtitle">
						{{ $t('builder.seoOnboardingIntroduction') }}
					</p>
				</div>
				<div
					v-if="currentStepName === ONBOARDING_STEPS_SEO_BRAND_NAME"
					class="brand-name"
				>
					<p class="content-heading">
						{{ $t('builder.seoOnboardingBusinessNameHeading') }}
					</p>
					<p class="content-subtitle">
						{{ $t('builder.seoOnboardingBusinessNameSubtitle') }}
					</p>
					<ZyroLabel
						for="brand-name-input"
						class="input-label"
					>
						{{ $t('builder.seoOnboardingBusinessOrBrandName') }}
					</ZyroLabel>
					<ZyroInput
						id="brand-name-input"
						v-model="businessBrandName"
						class="input"
						:placeholder="$t('builder.seoOnboardingInputPlaceholder')"
						focus-on-mount
					/>
					<p class="input-example">
						{{ $t('builder.seoOnboardingInputExample') }}
					</p>
				</div>
				<div
					v-if="currentStepName === ONBOARDING_STEPS_SEO_LANGUAGE"
					class="website-language"
				>
					<p class="content-heading">
						{{ $t("builder.seoOnboardingLanguageHeading") }}
					</p>
					<p class="content-subtitle">
						{{ $t("builder.seoOnboardingLanguageSubtitle") }}
					</p>
					<ZyroDropdown
						v-model="websiteMetaHtmlLanguage"
						:label="$t('siteSettings.seoGeneralInputLangDropdownTitle')"
						:options="HTML_LANG_VALUES"
					/>
				</div>
				<div
					v-if="currentStepName === ONBOARDING_STEPS_SEO_DESCRIPTION"
					class="page-description"
				>
					<p class="content-heading">
						{{ $t("builder.seoOnboardingPageDescriptionHeading") }}
					</p>
					<p class="content-subtitle">
						{{ $t("builder.seoOnboardingPageDescriptionSubtitle") }}
					</p>
					<ZyroLabel
						for="page-description-textarea"
						class="input-label"
					>
						{{ $t('builder.seoOnboardingPageDescription') }}
					</ZyroLabel>
					<ZyroFieldTextArea
						id="page-description-textarea"
						v-model="businessBrandDescription"
						input-data-qa="seo-onboarding-description-input"
						theme="primary"
						:placeholder="$t('builder.seoOnboardingPageDescriptionPlaceholder')"
						:min-height="120"
						is-resizable
						autofocus
					/>
					<SegmentedProgressBar
						:progress="descriptionQualityData.progress"
						:colors="descriptionQualityData.colors"
					/>
					<p class="description-quality-label">
						{{ descriptionQualityData.label }}
					</p>
				</div>
				<div
					v-if="currentStepName === ONBOARDING_STEPS_SEO_BRAND_KEYWORDS"
					class="brand-keywords"
				>
					<p class="content-heading">
						{{ $t('builder.seoOnboardingKeywordsHeading') }}
					</p>
					<p class="content-subtitle">
						{{ $t('builder.seoOnboardingKeywordsSubtitle') }}
					</p>
					<TagMultiselect
						v-model="selectedKeywords"
						:tags="keywords"
						:max-selections="3"
						@update:model-value="selectedKeywords = $event"
					/>
				</div>
				<div
					v-if="currentStepName === ONBOARDING_STEPS_SEO_BRAND_REVIEW"
					class="flow-review"
				>
					<p class="content-heading">
						{{ $t('builder.seoOnboardingReviewHeading') }}
					</p>
					<p class="content-subtitle">
						{{ $t('builder.seoOnboardingReviewSubtitle') }}
					</p>
					<PageSearchPreview
						class="preview"
						:title="generatedTitle"
						:description="generatedDescription"
						:url="currentPageUrl"
					/>
					<p class="preview-description">
						{{ $t('builder.seoOnboardingReviewExampleDescription') }}
					</p>
					<ZyroLabel
						for="seo-title-input"
						class="input-label"
					>
						{{ $t('builder.pageSettingsModal.seoTitle') }}
					</ZyroLabel>
					<ZyroInput
						id="seo-title-input"
						v-model="generatedTitle"
						class="input"
						@update:modelValue="generatedTitle = $event, hasModifiedManually = true"
					/>
					<ZyroLabel
						for="seo-description-input"
						class="input-label"
					>
						{{ $t('builder.pageSettingsModal.metaDescription') }}
					</ZyroLabel>
					<ZyroInput
						id="seo-description-input"
						v-model="generatedDescription"
						class="input"
						@update:modelValue="generatedDescription = $event, hasModifiedManually = true"
					/>
				</div>
			</div>
			<template #footer>
				<div class="footer__right-side">
					<span
						v-if="currentStepName !== ONBOARDING_STEPS_SEO_INTRO"
						class="step-count"
					>
						{{ currentOnboardingStep + 1 }} / {{ onboardingStepCount }}
					</span>
					<ZyroButton
						class="next-button"
						theme="primary"
						:disabled="isNextStepButtonDisabled"
						@click="handleNextStepClick"
					>
						{{ nextStepButtonText }}
						<ZyroLoader
							v-if="isLoading"
							class="next-button__loader"
							size="20px"
							weight="2px"
						/>
					</ZyroButton>
				</div>
				<ZyroSvgDeprecated
					v-if="isPreviousStepArrowVisible"
					name="arrow-down"
					class="back-arrow"
					:class="{ 'disabled': isLoading }"
					dimensions="20px"
					direction="right"
					@click="goToPreviousStep(), hasModifiedManually = false"
				/>
			</template>
		</ZyroModal>
	</Teleport>
</template>

<script>
import { captureException } from '@sentry/browser';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';
import ZyroInput from '@/components/global/ZyroInput.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import TagMultiselect from '@/components/global/TagMultiselect.vue';
import SegmentedProgressBar from '@/components/global/SegmentedProgressBar.vue';
import {
	ONBOARDING_STEPS_SEO,
	ONBOARDING_STEPS_SEO_INTRO,
	ONBOARDING_STEPS_SEO_BRAND_NAME,
	ONBOARDING_STEPS_SEO_DESCRIPTION,
	ONBOARDING_STEPS_SEO_BRAND_KEYWORDS,
	ONBOARDING_STEPS_SEO_BRAND_REVIEW,
	ONBOARDING_STEPS_SEO_LANGUAGE,
} from '@/constants';
import {
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import PageSearchPreview from '@/components/builder-controls/page-settings/PageSearchPreview.vue';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';
import EventLogApi from '@/api/EventLogApi';
import { useNotifications } from '@/use/useNotifications';
import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import { HTML_LANG_VALUES } from '@/data/htmlLangValues';
import { useSeoStepOnboarding } from '@/use/useSeoStepOnboarding';
import { createSeo } from '@/api/AiApi';

const DESCRIPTION_WORD_COUNT_BAD_QUALITY = 8;
const DESCRIPTION_WORD_COUNT_MEDIUM_QUALITY = 30;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 3000;

export default defineComponent({
	components: {
		TagMultiselect,
		ZyroModal,
		ZyroButton,
		ZyroSvgDeprecated,
		ZyroInput,
		ZyroLabel,
		ZyroDropdown,
		ZyroFieldTextArea,
		SegmentedProgressBar,
		PageSearchPreview,
		ZyroLoader,
	},
	props: {
		pageId: {
			type: String,
			required: true,
		},
	},
	emits: ['close'],
	setup(props, { emit }) {
		const { notify } = useNotifications();
		const { t } = useI18n();
		const {
			commit,
			getters,
			state,
			dispatch,
		} = useStore();
		const isLoading = ref(false);

		const siteMetaTitle = computed(() => (getters.currentLanguageData.metaTitle
			? getters.currentLanguageData.metaTitle
			: getters.siteMeta.metaTitle
		));

		const onboardingSteps = computed(() => ONBOARDING_STEPS_SEO.filter((stepName) => {
			// Skipping intro step
			if (stepName === ONBOARDING_STEPS_SEO_INTRO) return false;

			// If Website Title is present skip this step
			if (stepName === ONBOARDING_STEPS_SEO_BRAND_NAME) {
				return !siteMetaTitle.value;
			}

			// if user has set metaHtmlLanguage property
			// or if Website Title is present
			// or if website has more than 1 language (multilanguage) skip this step
			if (stepName === ONBOARDING_STEPS_SEO_LANGUAGE) {
				if (getters.siteLanguagesArray.length > 1) return false;

				return !getters.siteMeta.metaHtmlLanguage;
			}

			return true;
		}));

		const {
			currentOnboardingStep,
			isOnboardingRestarted,
			goToNextStep,
			onboardingStepCount,
			goToPreviousStep,
			endOnboarding,
		} = useSeoStepOnboarding({
			steps: onboardingSteps,
		});
		const sitePages = computed(() => getters.sitePages);
		const pageData = computed(() => sitePages.value[props.pageId]);
		const pageMeta = computed(() => pageData.value.meta ?? {});
		const pageMetaDescription = computed(() => pageMeta.value.description ?? '');
		const providedDescription = computed(() => (isOnboardingRestarted.value ? pageMetaDescription.value : ''));
		const pageName = ref(getters.sitePages[props.pageId].name);
		const currentStepName = computed(() => onboardingSteps.value[currentOnboardingStep.value]);
		const isPreviousStepArrowVisible = computed(() => currentOnboardingStep.value !== 0);
		const isCurrentPageHomePage = computed(() => props.pageId === getters.homePageId);
		const websiteMetaHtmlLanguage = ref(
			HTML_LANG_VALUES.find(({ value }) => (!getters.siteMeta.metaHtmlLanguage ? value === 'en' : value === getters.siteMeta.metaHtmlLanguage)),
		);
		const businessBrandName = ref('');
		const businessBrandDescription = ref(providedDescription.value);
		const selectedKeywords = ref([]);
		const keywords = ref([]);
		const generatedDescription = ref('');
		const generatedTitle = ref('');
		const hasModifiedManually = ref(false);
		const descriptionWordCount = computed(() => businessBrandDescription.value.split(' ').length);

		const saveOnboardingPageMeta = () => {
			dispatch('mergePageData', {
				pageId: props.pageId,
				pageData: {
					meta: {
						title: generatedTitle.value,
						description: generatedDescription.value,
						keywords: selectedKeywords.value,
					},
				},
			});

			if (businessBrandName.value) {
				if (getters.isCurrentSystemLocale) {
					commit('setWebsiteMeta', {
						key: 'metaTitle',
						value: businessBrandName.value,
					});
				} else {
					dispatch('setLocaleMeta', {
						metaTitle: businessBrandName.value,
					});
				}
			}

			if (onboardingSteps.value.includes(ONBOARDING_STEPS_SEO_LANGUAGE)) {
				commit('setWebsiteMeta', {
					key: 'metaHtmlLanguage',
					value: websiteMetaHtmlLanguage.value.value,
				});
			}
		};

		const descriptionQualityData = computed(() => {
			if (!businessBrandDescription.value.length) {
				return {
					progress: 0,
					label: t('builder.descriptionQualityLabel'),
				};
			}

			if (descriptionWordCount.value < DESCRIPTION_WORD_COUNT_BAD_QUALITY) {
				return {
					progress: 1,
					label: t('builder.descriptionQualityLabelBad'),
				};
			}

			if (descriptionWordCount.value < DESCRIPTION_WORD_COUNT_MEDIUM_QUALITY) {
				return {
					progress: 2,
					label: t('builder.descriptionQualityLabelMedium'),
				};
			}

			if (businessBrandDescription.value.length > MAX_DESCRIPTION_LENGTH) {
				return {
					progress: 3,
					label: t('builder.seoOnboardingPageDescriptionTooLong'),
					colors: [
						'var(--color-danger)',
						'var(--color-danger)',
						'var(--color-danger)',
					],
				};
			}

			return {
				progress: 3,
				label: t('builder.descriptionQualityLabelGood'),
			};
		});

		const nextStepButtonText = computed(() => {
			if (currentStepName.value === ONBOARDING_STEPS_SEO_INTRO) return t('builder.quickStartGuideStartButton');
			if (currentOnboardingStep.value === onboardingStepCount.value - 1) return t('builder.onboardingFinish');

			return t('builder.seoOnboardingNextStep');
		});

		const validateDescriptionLength = (descriptionLength) => descriptionLength >= MIN_DESCRIPTION_LENGTH
			&& descriptionLength <= MAX_DESCRIPTION_LENGTH
			&& descriptionWordCount.value >= DESCRIPTION_WORD_COUNT_BAD_QUALITY;

		const isNextStepButtonDisabled = computed(() => {
			if (isLoading.value) return true;

			if (currentStepName.value === ONBOARDING_STEPS_SEO_BRAND_NAME) return !businessBrandName.value;

			if (currentStepName.value === ONBOARDING_STEPS_SEO_DESCRIPTION) {
				return !validateDescriptionLength(businessBrandDescription.value.trim().length);
			}

			if (currentStepName.value === ONBOARDING_STEPS_SEO_BRAND_KEYWORDS) return selectedKeywords.value.length < 3;

			return false;
		});

		const handleNextStepClick = async () => {
			if (currentStepName.value === ONBOARDING_STEPS_SEO_BRAND_NAME && businessBrandName.value) {
				EventLogApi.logEvent({
					eventName: 'website_builder.seo_brand_name.typed',
					eventProperties: {
						location: 'onboarding',
						name_provided: businessBrandName.value,
					},
					isHostingerEvent: true,
				});
			}

			if (currentStepName.value === ONBOARDING_STEPS_SEO_LANGUAGE && websiteMetaHtmlLanguage.value.value) {
				EventLogApi.logEvent({
					eventName: 'website_builder.seo_language.selected',
					eventProperties: {
						location: 'onboarding',
						language_selected: websiteMetaHtmlLanguage.value.value,
					},
					isHostingerEvent: true,
				});
			}

			if (currentStepName.value === ONBOARDING_STEPS_SEO_DESCRIPTION) {
				// TODO: is_modification property - if page onboarding is opened manually, set it as false
				EventLogApi.logEvent({
					eventName: 'website_builder.seo_website_description.typed',
					eventProperties: {
						location: 'onboarding',
						is_main: isCurrentPageHomePage.value,
						is_modification: false,
						description: businessBrandDescription.value,
						quality: descriptionQualityData.value.progress,
					},
					isHostingerEvent: true,
				});

				isLoading.value = true;

				try {
					const { data } = await createSeo({
						brandDescription: businessBrandDescription.value,
					});

					keywords.value = data.keywords;
					selectedKeywords.value = data.keywords.slice(0, 2);

					goToNextStep();
				} catch (error) {
					captureException(error);
					notify({
						message: t('builder.seoOnboardingFailed'),
						origin: 'SeoOnboardingModal.vue',
					});
					emit('close');
				} finally {
					isLoading.value = false;
				}

				return;
			}

			if (currentStepName.value === ONBOARDING_STEPS_SEO_BRAND_KEYWORDS) {
				// TODO: is_modification property - if page onboarding is opened manually, set it as false
				EventLogApi.logEvent({
					eventName: 'website_builder.seo_keywords.chosen',
					eventProperties: {
						location: 'onboarding',
						is_main: isCurrentPageHomePage.value,
						is_modification: false,
						keyword_chosen: selectedKeywords.value,
					},
					isHostingerEvent: true,
				});

				isLoading.value = true;

				try {
					const { data } = await createSeo({
						brandDescription: businessBrandDescription.value,
						keywords: selectedKeywords.value,
					});

					generatedDescription.value = data.meta;
					generatedTitle.value = data.title;

					goToNextStep();
				} catch (error) {
					captureException(error);
					notify({
						message: t('builder.seoOnboardingFailed'),
						origin: 'SeoOnboardingModal.vue',
					});
					emit('close');
				} finally {
					isLoading.value = false;
				}

				return;
			}

			if (currentStepName.value === ONBOARDING_STEPS_SEO_BRAND_REVIEW) {
				// TODO: is_modification property - if page onboarding is opened manually, set it as false
				EventLogApi.logEvent({
					eventName: 'website_builder.seo_summary.finished',
					eventProperties: {
						location: 'onboarding',
						is_main: isCurrentPageHomePage.value,
						is_modification: false,
						manual_changes: hasModifiedManually.value,
					},
					isHostingerEvent: true,
				});

				saveOnboardingPageMeta();
				endOnboarding();

				return;
			}

			goToNextStep();
		};

		const currentPageUrl = computed(() => {
			const url = getPagePathFromId({
				siteData: getters.website,
				pageId: props.pageId,
				locale: state.currentLocale,
			});

			return url ? `${getters.siteUrl}${url}` : getters.siteUrl;
		});

		return {
			isLoading,
			pageName,
			hasModifiedManually,
			isCurrentPageHomePage,
			handleNextStepClick,
			isNextStepButtonDisabled,
			generatedDescription,
			generatedTitle,
			currentPageUrl,
			onboardingStepCount,
			nextStepButtonText,
			selectedKeywords,
			keywords,
			isPreviousStepArrowVisible,
			descriptionQualityData,
			HTML_LANG_VALUES,
			websiteMetaHtmlLanguage,
			businessBrandDescription,
			businessBrandName,
			currentStepName,
			currentOnboardingStep,
			goToPreviousStep,
			ONBOARDING_STEPS_SEO_INTRO,
			ONBOARDING_STEPS_SEO_BRAND_NAME,
			ONBOARDING_STEPS_SEO_DESCRIPTION,
			ONBOARDING_STEPS_SEO_BRAND_KEYWORDS,
			ONBOARDING_STEPS_SEO_LANGUAGE,
			ONBOARDING_STEPS_SEO_BRAND_REVIEW,
		};
	},
});
</script>

<style lang="scss" scoped>
.seo-onboarding {
	&.loading {
		:deep(.modal) {
			.modal__content > * {
				pointer-events: none;
				opacity: 0.6;
			}
		}
	}

	&__content {
		.content-heading {
			margin-bottom: 8px;
			font-size: 24px;
			font-weight: 500;
			line-height: 1.33;
		}

		.content-subtitle {
			margin-bottom: 24px;
			font-size: 14px;
			font-weight: 400;
			line-height: 1.42;
			color: $color-gray;
			letter-spacing: 0.25px;
		}

		.page-reminder {
			display: flex;
			align-items: center;
			margin-bottom: 16px;
			color: $color-gray;

			&__seo,
			&__page-name {
				font-size: 14px;
				line-height: 1.42;
				letter-spacing: 0.25px;
			}

			&__seo:first-child {
				margin-right: 8px;
				font-weight: 700;
				color: rgb(0, 0, 0);
			}

			.page-icon {
				margin-right: 8px;
			}
		}

		.onboarding-intro {
			text-align: center;

			.search-icon {
				margin-bottom: 29px;
				color: $color-gray;
			}
		}

		.input-label,
		.input {
			margin-bottom: 8px;
		}

		.input-label {
			line-height: 1.42;
		}

		.brand-keywords .brand-keywords,
		.brand-name .input-example {
			margin-bottom: 40px;
		}

		.brand-name .input-example {
			font-size: 13px;
			line-height: 1.23;
			color: $color-gray;
		}

		.page-description .description-quality-label {
			margin-top: 4px;
			font-size: 12px;
			line-height: 1.3;
			color: $color-gray;
			text-align: right;
		}

		.flow-review .preview-description {
			margin-bottom: 20px;
			font-size: 13px;
			line-height: 1.23;
			color: $color-gray;
		}

		.preview {
			margin-bottom: 8px;
		}
	}
}

:deep(.modal) {
	.modal__content {
		margin-top: 40px;
		overflow: visible;
	}

	.modal__footer {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		height: 69px;
		border-top: 1px solid rgb(218, 220, 224);

		.back-arrow {
			&:not(.disabled):hover {
				cursor: pointer;
			}

			&.disabled {
				pointer-events: none;
				opacity: 0.5;
			}
		}

		.footer__right-side {
			display: flex;
			align-items: center;

			.next-button {
				position: relative;

				&__loader {
					margin-left: 8px;
				}
			}

			.step-count {
				margin-right: 16px;
				font-size: 14px;
				line-height: 1.42;
				color: $color-gray;
				letter-spacing: 0.25px;
			}
		}
	}
}
</style>
