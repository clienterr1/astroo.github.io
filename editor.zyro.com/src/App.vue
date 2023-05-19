<template>
	<div
		key="builder"
		class="app"
		data-portal="app"
		:style="computedStyles"
	>
		<RouterView />
		<PreviewIframe
			v-show="showPreviewIframe"
			ref="previewIframe"
			:site-data="website"
			:site-id="websiteId"
			:path="previewIframePath"
			:update-preview-on-site-data-change="false"
		/>
		<BuilderModals data-portal="modal" />
		<BuilderToasts />
		<SiteSettings />
		<SpotlightSearch />
		<BuilderImpersonateToast
			v-if="!!user && user.impersonating"
			:email="!!user && user.email"
		/>
		<MobileObserver @toggle-mobile="updateIsMobileScreen" />
		<div
			v-if="isAppLoading"
			class="loader-wrapper"
		>
			<ZyroLoader size="155px" />
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import {
	mapState,
	mapActions,
	mapGetters,
	useStore,
} from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import MobileObserver from '@zyro-inc/site-modules/components/ui/MobileObserver.vue';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import BuilderModals from '@/components/builder-modals/BuilderModals.vue';
import BuilderImpersonateToast from '@/components/builder-toasts/BuilderImpersonateToast.vue';
import BuilderToasts from '@/components/builder-toasts/BuilderToasts.vue';
import SiteSettings from '@/components/site-settings/SiteSettings.vue';
import { _000_WEBHOST_REF } from '@/constants';
import SpotlightSearch from '@/components/spotlight/SpotlightSearch.vue';
import { PREVIEW_ROUTE } from '@/constants/routes';
import PreviewIframe from '@/pages/PreviewIframe.vue';
import {
	mapActionsGui,
	UPDATE_IS_MOBILE_SCREEN,
} from '@/store/builder/gui';
import { useLocaleProperties } from '@/use/useLocaleProperties';
// MIGRATION - currently vuex subscriptions are not working
// import { useExceptionLog } from '@/use/useExceptionLog';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { addGtmElements } from '@/utils/injectableDomElements/addGtmElements';
import { addRobotsMeta } from '@/utils/injectableDomElements/addRobotsMeta';
import { addIntercomScript } from '@/utils/injectableDomElements/addIntercomScript';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';

export default defineComponent({
	name: 'App',

	components: {
		ZyroLoader,
		BuilderModals,
		MobileObserver,
		BuilderToasts,
		SiteSettings,
		BuilderImpersonateToast,
		PreviewIframe,
		SpotlightSearch,
	},

	setup() {
		const {
			state,
			getters,
		} = useStore();
		const computedStyles = computed(() => objectToCssVariables(state.website?.styles));
		const { localeProperties } = useLocaleProperties();
		const currentPageData = computed(() => getters.currentPage);
		const pageName = computed(() => currentPageData.value?.meta?.title || currentPageData.value?.name);

		// MIGRATION - currently vuex subscriptions are not working
		// useExceptionLog();

		return {
			localeProperties,
			computedStyles,
			PREVIEW_ROUTE,
			pageName,
		};
	},

	data() {
		return {
			isWebsiteLoaded: false,
		};
	},

	computed: {
		...mapState([
			'website',
			'generatedWebsite',
			'websiteId',
			'currentPageId',
			'currentLocale',
			'isAppLoading',
		]),
		...mapState('user', ['user']),
		...mapGetters(['siteFonts']),
		...mapGetters('user', ['isGoRobotsUser']),
		...mapGetters('fonts', ['getMetaFont']),
		...mapGetters('saving', ['canSave']),
		showPreviewIframe() {
			return this.$route.name === PREVIEW_ROUTE;
		},
		getMetaFontQueryString() {
			return this.siteFonts && this.getMetaFont;
		},
		brandTitle() {
			return isHostingerBrand ? this.$t('common.hostingerPageTitle') : this.$t('common.zyroPageTitle');
		},
		previewIframeSiteData() {
			if (this.$route.name === PREVIEW_ROUTE) {
				return this.website;
			}

			return null;
		},
		previewIframePath() {
			if (this.$route.name === PREVIEW_ROUTE) {
				return getPagePathFromId({
					siteData: this.website,
					pageId: this.currentPageId,
					locale: this.currentLocale,
				});
			}

			return null;
		},
	},

	watch: {
		async $route(to) {
			if (to.name === PREVIEW_ROUTE) {
				await this.$nextTick();
				this.$refs.previewIframe.updatePreviewIframe();
			}
		},

		user: {
			handler(user) {
				if (!user) return;

				const isUnpaid000WebhostUser = (!user.paid && [_000_WEBHOST_REF].includes(user.ref === _000_WEBHOST_REF));

				if (!user.intercomHash
					|| !user.paid
					|| isUnpaid000WebhostUser
					|| this.isGoRobotsUser
					|| user.impersonating
					|| user.isImpersonated
				) {
					return;
				}

				setTimeout(
					() => {
						addIntercomScript({
							intercomUserData: {
								user_id: user.hPanelId || user.id,
								wb_userID: user.hPanelId || user.id,
								user_hash: user.intercomHash,
								name: user.fullName,
								email: user.email,
								language_override: this.localeProperties.iso6391,
								...(!user.hPanelId && {
									reseller: 'zyro.com',
								}),
							},
						});
					},
					import.meta.env.VITE_INTERCOM_DELAY,
				);
			},
		},
		// Page title updates based on user's page settings values & current page user has selected for editing
		pageName(newPageName) {
			document.title = newPageName ? `${newPageName} | ${this.brandTitle}` : this.brandTitle;
		},
	},

	created() {
		if (this.user?.impersonating) {
			return;
		}

		document.title = this.pageName ? `${this.pageName} | ${this.brandTitle}` : this.brandTitle;

		addGtmElements();
		addRobotsMeta();

		this.handleTabClose();
		this.startSavingTimer();
		this.initHotjar();
		this.handleQATestUser();
	},

	methods: {
		...mapActions(['setIsQATestUser']),
		...mapActions('saving', ['startSavingTimer']),
		...mapActionsGui({
			updateIsMobileScreen: UPDATE_IS_MOBILE_SCREEN,
		}),
		handleQATestUser() {
			const urlParam = new URLSearchParams(window.location.search).get('endOnboarding');

			this.setIsQATestUser(urlParam ? JSON.parse(urlParam) : false);
		},
		handleTabClose() {
			window.addEventListener('beforeunload', (event) => {
				if (this.canSave) {
					event.preventDefault();
					// Chrome requires returnValue to be set.
					// eslint-disable-next-line no-param-reassign
					event.returnValue = '';
				}
			});
		},
		initHotjar() {
		// https://help.hotjar.com/hc/en-us/articles/360033640653-Identify-API-Reference#best-practices
		// eslint-disable-next-line func-names, no-undef, prefer-rest-params, brace-style
			window.hj = window.hj || function () { (hj.q = hj.q || []).push(arguments); };
		},
	},
});
</script>

<style lang="scss" scoped>
.app {
	height: 100%;
}

.tooltip-portal {
	position: fixed;
	top: 0;
	left: 0;
	z-index: $z-index-layout-tooltip-portal;
	width: 100%;
}

.loader-wrapper {
	position: fixed;
	top: 0;
	left: 0;
	z-index: $z-index-layout-loader;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
</style>
