<template>
	<ZyroDrawer
		class="seo-drawer"
		close-on-click-outside
		@close="closeDrawer"
	>
		<div class="seo-drawer__block">
			<p class="seo-drawer__title">
				{{ $t('siteSettings.nav.seo') }}
			</p>
			<p class="seo-drawer__description">
				{{ $t('builder.seoDrawer.description') }}
			</p>
		</div>
		<div class="seo-drawer__block">
			<p class="seo-drawer__subtitle">
				{{ $t('builder.seoDrawer.quickLinks') }}
			</p>
			<a
				href="https://support.hostinger.com/en/articles/6448761-website-builder-how-to-make-my-website-appear-on-google"
				class="seo-drawer__quick-link"
				target="_blank"
				rel="noopener noreferrer"
			>
				{{ $t('builder.seoDrawer.quickLinkImproveSeo') }}
				<ZyroSvgDeprecated
					dimensions="26px"
					name="external-link"
				/>
			</a>
			<a
				:href="isHostingerBrand ? 'https://support.hostinger.com/en/articles/3692620-how-to-add-a-domain-to-the-google-search-console' : 'https://support.zyro.com/en/articles/5268022-how-to-verify-a-domain-in-google-search-console'"
				class="seo-drawer__quick-link"
				target="_blank"
				rel="noopener noreferrer"
			>
				{{ $t('builder.seoDrawer.quickLinkGoogleSearchConsole') }}
				<ZyroSvgDeprecated
					dimensions="26px"
					name="external-link"
				/>
			</a>
			<a
				href="https://www.google.com/business/"
				class="seo-drawer__quick-link"
				target="_blank"
				rel="noopener noreferrer"
				@click="logGoogleBusinessSetupLinkClick"
			>
				{{ $t('builder.seoDrawer.quickLinkGoogleBusiness') }}
				<ZyroSvgDeprecated
					dimensions="26px"
					name="external-link"
				/>
			</a>
		</div>
		<div class="seo-drawer__block seo-drawer__block--last">
			<div class="seo-drawer__block-title-wrap">
				<p class="seo-drawer__subtitle">
					{{ $t('builder.seoDrawer.seoOpportunities') }}
				</p>
				<p class="seo-drawer__description">
					{{ completePageCompare }}
				</p>
			</div>
			<ZyroProgressBar :percentage="progressPercentage" />
			<p class="seo-drawer__description seo-drawer__opportunities-description">
				{{ $t('builder.seoDrawer.descriptionImprove') }}
			</p>
			<div class="seo-drawer__general-status-block">
				<ZyroSvgDeprecated
					class="status-icon"
					:name="isGeneralSeoCompleted ? 'checkmark' : 'exclamation'"
					:class="{ 'status-icon--completed': isGeneralSeoCompleted }"
				/>
				<p class="seo-drawer__page-name--general z-body-small">
					{{ $t('common.general') }}
				</p>
			</div>
			<PageSearchPreview
				class="seo-drawer__page-search-preview"
				:title="metaTitle || $t('builder.seoDrawer.yourWebsiteTitle')"
				:url="siteUrl"
			/>
			<ZyroFieldInput
				v-model="metaTitle"
				input-data-qa="seo-drawer-input-title"
				:placeholder="$t('siteSettings.seoGeneralInputTitlePlaceholder')"
				:label="$t('siteSettings.seoGeneralInputTitle')"
				:maxlength="SEO_MAX_STRING_LENGTH_TITLE"
				@update:model-value="updateMetaTitle"
			/>
			<div v-if="!hasLanguages">
				<p class="seo-drawer__languages-title">
					{{ $t('siteSettings.seoGeneralInputLangDropdownTitle') }}
				</p>
				<ZyroDropdown
					:id="HTML_LANG_SELECT_ID"
					v-model="metaHtmlLanguage"
					:options="HTML_LANG_VALUES"
					@update:model-value="updateMetaLanguage"
				/>
			</div>
			<div
				v-for="(page, key) in pagesWithSeoStatus"
				:key="key"
				class="seo-drawer__page-status-block"
				@click="openPageSEODrawer({ pageId: key })"
			>
				<ZyroSvgDeprecated
					class="status-icon"
					:name="page.isSeoComplete ? 'checkmark' : 'exclamation'"
					:class="{ 'status-icon--completed': page.isSeoComplete }"
				/>

				<div class="seo-drawer__page-status-block-content">
					<p class="seo-drawer__page-name z-body-small">
						{{ page.name }}
					</p>
					<ZyroSvgDeprecated
						class="seo-drawer__chevron"
						name="chevron-right"
					/>
				</div>
			</div>
		</div>
		<NpsRateFeature
			class="seo-drawer__nps"
			:feature-name="$t('siteSettings.nav.seo')"
			:type="NPS_TYPE_FEATURE_SEO"
		/>
		<PageSettingsPopup
			v-if="pageToOpen"
			:key="pageToOpen.id"
			:page-id="pageToOpen.id"
			:open-tab="pageToOpen.tab"
			@close="pageToOpen = null"
		/>
	</ZyroDrawer>
</template>
<script>
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import ZyroProgressBar from '@/components/reusable-components/ZyroProgressBar.vue';
import {
	BUILDER_ROUTE,
	SEO_SETTINGS_ROUTE,
} from '@/constants/routes';
import {
	mapState,
	mapActions,
	mapGetters,
	mapMutations,
	useStore,
} from 'vuex';
import { mapStateGui } from '@/store/builder/gui';
import PageSearchPreview from '@/components/builder-controls/page-settings/PageSearchPreview.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import {
	SEO_MAX_STRING_LENGTH_DESCRIPTION,
	SEO_MAX_STRING_LENGTH_TITLE,
} from '@zyro-inc/site-modules/constants';
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';

import PageSettingsPopup from '@/components/builder-modals/modals/PageSettingsPopup.vue';
import { HTML_LANG_VALUES } from '@/data/htmlLangValues';
import { debounce } from '@zyro-inc/site-modules/utils/debounce';
import EventLogApi from '@/api/EventLogApi';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import {
	NPS_TYPE_FEATURE_SEO,
	DRAWER_PAGE_SEO,
} from '@/constants';
import {
	defineComponent,
	ref,
	computed,
	watch,
	onMounted,
} from 'vue';
import { usePageSettingsSeo } from '@/use/usePageSettingsSeo';
import { useRouter } from 'vue-router';

const HTML_LANG_SELECT_ID = 'html-lang-select';

export default defineComponent({
	components: {
		PageSettingsPopup,
		PageSearchPreview,
		ZyroProgressBar,
		ZyroFieldInput,
		NpsRateFeature,
		ZyroDropdown,
		ZyroDrawer,
		ZyroSvgDeprecated,
	},
	setup() {
		const {
			getters,
			dispatch,
		} = useStore();
		const router = useRouter();
		const metaTitle = ref(getters.currentLanguageData.metaTitle ? getters.currentLanguageData.metaTitle : getters.siteMeta.metaTitle);
		const pageToOpen = ref(null);
		const currentMetaTitle = computed(() => (getters.isCurrentSystemLocale
			? getters.siteMeta.metaTitle
			: getters.currentLanguageData.metaTitle));
		const currentMetaHtmlLanguage = computed(() => getters.siteMeta?.metaHtmlLanguage);
		const metaHtmlLanguage = ref({});
		const defaultPages = computed(() => getters.defaultPages);

		const pagesWithSeoStatus = computed(() => Object.fromEntries(Object.entries(defaultPages.value).map(([pageId, page]) => {
			const { isPageSEOSetupCompleted } = usePageSettingsSeo({
				pageId,
			});

			return [
				pageId,
				{
					...page,
					isSeoComplete: isPageSEOSetupCompleted.value,
				},
			];
		})));
		const homePage = computed(() => defaultPages.value[getters.homePageId]);
		const homePageMeta = computed(() => homePage.value.meta ?? {});
		const areHomepageMetaTitleAndDescriptionFilled = computed(() => homePageMeta.value.title && homePageMeta.value.description);
		const pageCount = computed(() => Object.keys(defaultPages.value).length + 1);

		const openPageSEODrawer = ({ pageId }) => {
			dispatch('gui/OPEN_DRAWER', {
				id: DRAWER_PAGE_SEO,
				settings: {
					pageId,
					goBackCallback: () => {
						router.push({
							name: SEO_SETTINGS_ROUTE,
						});
					},
				},
			});
		};

		onMounted(() => {
			if (!areHomepageMetaTitleAndDescriptionFilled.value) {
				openPageSEODrawer({
					pageId: getters.homePageId,
				});
			}
		});

		// Website Title & Language can change after SEO onboarding flow
		// this ensures that SeoDrawer has the latest ones
		watch(currentMetaTitle, (newCurrentMetaTitle) => {
			metaTitle.value = newCurrentMetaTitle;
		});

		watch(currentMetaHtmlLanguage, (newCurrentMetaHtmlLanguage) => {
			metaHtmlLanguage.value = HTML_LANG_VALUES.find(({ value }) => value === newCurrentMetaHtmlLanguage);
		});

		const logGoogleBusinessSetupLinkClick = () => {
			EventLogApi.logEvent({
				eventName: 'website_builder.seo_list_your_business_on_google.enter',
				isHostingerEvent: true,
			});
		};

		return {
			pageCount,
			pagesWithSeoStatus,
			pageToOpen,
			metaTitle,
			metaHtmlLanguage,
			SEO_MAX_STRING_LENGTH_DESCRIPTION,
			SEO_MAX_STRING_LENGTH_TITLE,
			NPS_TYPE_FEATURE_SEO,
			HTML_LANG_SELECT_ID,
			HTML_LANG_VALUES,
			isHostingerBrand,
			openPageSEODrawer,
			logGoogleBusinessSetupLinkClick,
		};
	},
	computed: {
		...mapState(['currentLocale']),
		...mapGetters([
			'siteUrl',
			'siteMeta',
			'hasLanguages',
			'currentLanguageData',
			'isCurrentSystemLocale',
		]),
		...mapStateGui(['activeDrawer']),
		allCompletedOpportunities() {
			return this.isGeneralSeoCompleted ? this.completePageCount + 1 : this.completePageCount;
		},
		completePageCount() {
			return Object.values(this.pagesWithSeoStatus).filter(({ isSeoComplete }) => isSeoComplete).length;
		},
		progressPercentage() {
			return Math.round((this.allCompletedOpportunities * 100) / this.pageCount);
		},
		completePageCompare() {
			return `${this.allCompletedOpportunities} ${this.$t('common.of')} ${this.pageCount}`;
		},
		isGeneralSeoCompleted() {
			return this.metaTitle;
		},
	},
	watch: {
		activeDrawer() {
			if (this.activeDrawer) {
				this.closeDrawer();
			}
		},
		currentLocale() {
			this.setDefaultValues();
		},
	},
	beforeMount() {
		this.setDefaultValues();
	},
	methods: {
		...mapMutations(['setWebsiteMeta']),
		...mapActions(['setLocaleMeta']),
		closeDrawer() {
			this.pageToOpen = null;
			this.$router.push({
				name: BUILDER_ROUTE,
			});
		},
		setDefaultValues() {
			const generalMetaHtmlLanguage = HTML_LANG_VALUES.find(({ value }) => value === this.siteMeta.metaHtmlLanguage)
				|| {
					title: '',
					value: '',
				};

			this.metaTitle = (this.currentLanguageData.metaTitle ? this.currentLanguageData.metaTitle : this.siteMeta.metaTitle);
			this.metaHtmlLanguage = this.isCurrentSystemLocale ? generalMetaHtmlLanguage : this.currentLocale;
		},
		updateMetaLanguage() {
			EventLogApi.logEvent({
				eventName: 'website_builder.seo_language.selected',
				eventProperties: {
					location: 'drawer',
					language_selected: this.metaHtmlLanguage.value,
				},
				isHostingerEvent: true,
			});

			this.setWebsiteMeta({
				key: 'metaHtmlLanguage',
				value: this.metaHtmlLanguage.value,
			});
		},
		updateMetaTitle: debounce(function debouncedFunction() {
			EventLogApi.logEvent({
				eventName: 'website_builder.seo_brand_name.typed',
				eventProperties: {
					location: 'drawer',
					name_provided: this.metaTitle,
				},
				isHostingerEvent: true,
			});

			this.setLocaleMeta({
				metaTitle: this.metaTitle,
			});
		}, 1000),
	},
});
</script>
<style lang="scss" scoped>
.grey-700 {
	color: $color-gray;
}

.seo-drawer {
	$this: &;

	overflow: auto;

	&__title {
		font-weight: 700;
		font-size: 24px;
		line-height: 1.33;
		margin-bottom: 8px;
	}

	&__subtitle {
		font-weight: 700;
		font-size: 12px;
		line-height: 1.67;
		margin-bottom: 8px;
		text-transform: uppercase;
	}

	&__description {
		font-weight: 400;
		font-size: 14px;
		line-height: 1.71;
		color: $color-gray;
	}

	&__opportunities-description {
		margin-bottom: 24px;
	}

	&__quick-link {
		padding: 8px 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		color: $color-gray;
		text-decoration: none;
		font-weight: 400;
		font-size: 14px;
		line-height: 1.71;

		&:not(:last-child) {
			border-bottom: 1px solid $color-gray-border;
		}
	}

	&__page-search-preview {
		margin-bottom: 16px;
	}

	&__block {
		padding: 24px;
		border-bottom: 1px solid $color-gray-border;

		&--last {
			border-bottom: none;
		}
	}

	&__quick-links {
		font-weight: 700;
		letter-spacing: 0.25px;
	}

	&__general-status-block {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
	}

	&__chevron {
		transition: transform 0.2s ease-in-out;
	}

	&__block-title-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	&__languages-title {
		font-weight: 700;
		font-size: 14px;
		line-height: 1.71;
		margin-bottom: 8px;
	}

	&__page-status-block {
		display: flex;
		gap: 12px;
		align-items: center;
		cursor: pointer;

		&:hover {
			#{$this}__chevron {
				transform: translateX(4px);
			}
		}

		&:not(:last-child) {
			#{$this}__page-status-block-content {
				border-bottom: 1px solid $color-gray-light;
			}
		}
	}

	&__page-status-block-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 12px 0;
	}

	&__nps {
		width: 100%;
		padding: 0 24px 8px;
		background: $color-light;
	}
}

.status-icon {
	color: $color-warning-dark;

	&--completed {
		color: $color-success;
	}
}
</style>
