<template>
	<main
		v-if="shouldRenderPage"
		:style="pageCSSVars"
		class="page"
		@click="handleGlobalClick"
	>
		<StickyTrigger v-if="blocks.header.settings.isSticky" />
		<BlockHeader
			v-if="isHeaderVisible"
			v-bind="headerProps"
			@toggle-visibility="isNavOpen = !isNavOpen"
			@cart-click="handleCartClick"
		/>
		<!-- Simple blocks -->
		<BlockUser
			v-for="blockId of currentPageBlocks"
			:id="blocks[blockId].htmlId || blockId"
			:key="blockId"
			:data="blocks[blockId]"
			:blocks="blocks"
			:lcp="lcp"
			:page-id="currentPageId"
			:ecommerce-translations="ecommerceTranslations"
			:current-page-type="currentPageType"
			:components="elements"
			:style="blockId === firstVisibleBlockId ? firstBlockCSSVars : null"
			:current-locale="currentLocale"
			:is-cart-visible="headerProps.isCartVisible"
		/>
		<CookieBanner
			v-if="meta.isCookieBarEnabled"
			:disclaimer="cookieBannerDisclaimer || ''"
			:accept-text="cookieBannerAcceptText"
			:decline-text="cookieBannerDeclineText"
			:site-meta="meta"
		/>
		<EcommerceShoppingCartProviderUser
			v-if="isLocaleWithEcommerceItems"
			:ecommerce-translations="ecommerceTranslations"
			:language="language"
			:is-header-sticky="headerProps.isSticky"
			:is-nav-hidden="!isHeaderVisible"
			:current-page-ecommerce-blocks="currentPageEcommerceBlocks"
			:current-page-ecommerce-components="currentPageEcommerceComponents"
		/>
		<EcommerceModalRoot
			:ecommerce-translations="ecommerceTranslations"
			:language="language"
			:current-locale="currentLocale"
			:is-cart-visible="headerProps.isCartVisible"
		/>
	</main>
	<PasswordPage
		v-else
		:page-id="currentPageId"
		:locale="currentLocale"
		:default-locale="defaultLocale"
		:in-preview-mode="getIsInPreviewMode()"
		:current-page-data="currentPage"
		:homepage-name="homepageName"
		:is-current-page-homepage="isCurrentPageHomepage"
	/>
	<Lightbox v-if="isLightboxOpen" />
	<Integrations :site-meta="meta" />
</template>

<script>
import {
	ref,
	watch,
	computed,
	onMounted,
	onUnmounted,
	defineComponent,
	nextTick,
} from 'vue';
import {
	mapState,
	mapGetters,
	mapActions,
	useStore,
} from 'vuex';
import Integrations from '@/components/metas/integrations/Integrations.vue';

import StickyTrigger from '@zyro-inc/site-modules/components/StickyTrigger.vue';
import { scrollToSection } from '@zyro-inc/site-modules/utils/scrollToSection';
import { getGridItemSize } from '@zyro-inc/site-modules/utils/getGridItemSize';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import { useEcwidStore } from '@zyro-inc/site-modules/use/useEcwidStore';

import CookieBanner from '@/components/CookieBanner.vue';
import BlockUser from '@/components/block/BlockUser.vue';
import PasswordPage from '@/components/password-page/PasswordPage.vue';
import EcommerceShoppingCartProviderUser from '@/components/ecommerce/EcommerceShoppingCartProviderUser.vue';
import EcommerceModalRoot from '@/components/ecommerce/modals/EcommerceModalRoot.vue';
import BlockHeader from '@zyro-inc/site-modules/components/blocks/header/BlockHeader.vue';
import { getHeaderProps } from '@zyro-inc/site-modules/components/blocks/header/getHeaderProps';
import { getIsLocaleWithEcommerce } from '@zyro-inc/site-modules/utils/getters/getIsLocaleWithEcommerce';
import { MUTATION_SET_PAGE_DATA } from '@/store';
import { getIsInPreviewMode } from '@zyro-inc/site-modules/utils/getIsInPreviewMode';
import { usePasswordProtection } from '@/utils/usePasswordProtection';
import { getPathParams } from '@zyro-inc/site-modules/utils/page/getPathParams';
import { useLightbox } from '@zyro-inc/site-modules/components/lightbox/useLightbox';
import Lightbox from '@zyro-inc/site-modules/components/lightbox/Lightbox.vue';
import {
	SYSTEM_LOCALE,
	MEDIA_MOBILE_BREAKPOINT,
	ELEMENT_POSITION_KEY_MOBILE,
	ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';
import {
	addPreviewModeEventListeners,
	removePreviewModeEventListeners,
	sendMessageUpdateElementsPositions,
	sendMessageUpdatePreviewPageId,
} from '@/utils/previewModeUtils';
import { getIsInIframe } from '@zyro-inc/site-modules/utils/getIsInIframe';

const NUMBER_OF_LCP_IMAGES_TO_COMPARE = 2;

export default defineComponent({
	name: 'Page',
	components: {
		BlockHeader,
		BlockUser,
		CookieBanner,
		PasswordPage,
		EcommerceShoppingCartProviderUser,
		EcommerceModalRoot,
		StickyTrigger,
		Lightbox,
		Integrations,
	},
	props: {
		pageData: {
			type: Object,
			required: true,
		},
	},
	setup(props) {
		const {
			getters,
			commit,
		} = useStore();
		const {
			openEcwidHomepage,
			openCart,
			ecwidCartItemCount,
		} = useEcwidStore();
		const { isLightboxOpen } = useLightbox();

		const pages = computed(() => getters.pages);
		const blocks = computed(() => getters.blocks);
		const elements = computed(() => getters.elements);
		const nav = computed(() => getters.nav);
		const meta = computed(() => getters.meta);
		const metaTitle = computed(() => getters.metaTitle);
		const ecommerceShoppingCart = computed(() => getters.ecommerceShoppingCart);
		const cookieBannerDisclaimer = computed(() => getters.cookieBannerDisclaimer);
		const cookieBannerAcceptText = computed(() => getters.cookieBannerAcceptText);
		const cookieBannerDeclineText = computed(() => getters.cookieBannerDeclineText);
		const currentLocale = computed(() => getters.currentLocale);
		const currentPage = computed(() => getters.currentPageData);
		const currentPageType = computed(() => currentPage.value.type);
		const languageKeys = computed(() => getters.languageKeys);
		const ecwidPages = computed(() => getters.ecwidPages);
		const languageSwitcherLanguages = computed(() => getters.languageSwitcherLanguages);
		const siteId = computed(() => getters.siteId);
		const getPagePathFromId = computed(() => getters.getPagePathFromId);
		const homePageId = computed(() => getters.homePageId);
		const pageCSSVars = computed(() => objectToCssVariables(getters.styles));
		const isHeaderVisible = computed(() => !getters.isNavHidden);
		const currentPageId = computed(() => getters.currentPageId);
		const isCurrentPageHomepage = computed(() => currentPageId.value === homePageId.value);
		const homepageName = computed(() => pages.value?.[homePageId.value]?.name ?? '');
		const firstVisibleBlockId = ref(ELEMENT_POSITION_KEY_DESKTOP);
		const devicePixelRatio = ref(null);

		const shouldRenderPage = computed(() => {
			if (!currentPage.value?.meta?.password || getIsInPreviewMode()) {
				return true;
			}

			const { isPageOpen } = usePasswordProtection({
				pagePassword: currentPage.value?.meta?.password ?? '',
				locale: currentLocale.value,
				pageId: currentPageId.value,
			});

			return isPageOpen.value;
		});
		const pageBlocksSlotFooter = computed(() => {
			if (!currentPage.value || currentPage.value.footerSlotIsHidden) {
				return [];
			}

			const footerBlock = Object.keys(blocks.value).find((blockId) => blocks.value[blockId].slot === 'footer');

			return footerBlock ? [footerBlock] : [];
		});
		const currentPageBlocks = computed(() => (currentPage.value ? [
			...currentPage.value.blocks,
			...pageBlocksSlotFooter.value,
		] : []));
		const getFirstVisibleBlockId = () => {
			const positionKey = window.innerWidth < MEDIA_MOBILE_BREAKPOINT ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP;

			return currentPageBlocks.value.find(
				(blockId) => !blocks.value[blockId][positionKey]?.isHidden,
			);
		};

		// Since `pageData` is set to state during mount, it has to be updated via watcher every time the prop changes.
		watch(() => props.pageData, (pageData) => {
			commit(MUTATION_SET_PAGE_DATA, {
				pageData,
			});
		}, {
			immediate: true,
		});

		// The first watched has an `immediate` watcher - so it performs server-side compatible actions
		// This watched has no immediate - so it will run only on the client.
		watch(() => props.pageData, async () => {
			// Without next tick firstVisibleBlockId refers to previous page first visible block instead of current
			await nextTick();
			firstVisibleBlockId.value = getFirstVisibleBlockId();
			sendMessageUpdateElementsPositions();
			sendMessageUpdatePreviewPageId({
				currentPageId: currentPageId.value,
			});
		});

		onMounted(() => {
			firstVisibleBlockId.value = getFirstVisibleBlockId();
			devicePixelRatio.value = window?.devicePixelRatio;

			sendMessageUpdatePreviewPageId({
				currentPageId: currentPageId.value,
			});
			addPreviewModeEventListeners();
		});

		onUnmounted(() => {
			removePreviewModeEventListeners();
		});

		return {
			pages,
			blocks,
			elements,
			nav,
			meta,
			metaTitle,
			homepageName,
			ecommerceShoppingCart,
			cookieBannerDisclaimer,
			cookieBannerAcceptText,
			cookieBannerDeclineText,
			currentLocale,
			currentPageId,
			currentPage,
			currentPageType,
			languageKeys,
			languageSwitcherLanguages,
			siteId,
			getPagePathFromId,
			pageCSSVars,
			isHeaderVisible,
			ecwidPages,
			openEcwidHomepage,
			openCart,
			isCurrentPageHomepage,
			shouldRenderPage,
			ecwidCartItemCount,
			currentPageBlocks,
			pageBlocksSlotFooter,
			firstVisibleBlockId,
			devicePixelRatio,
			isLightboxOpen,
			getIsInPreviewMode,
		};
	},

	data() {
		return {
			isNavOpen: false,
		};
	},

	computed: {
		...mapState('ecommerce', ['shoppingCartItems']),
		...mapGetters('ecommerce', ['isStoreTypeZyro']),
		isLocaleWithEcommerceItems() {
			return getIsLocaleWithEcommerce({
				blocks: this.blocks,
				elements: this.elements,
			});
		},
		defaultLocale() {
			return this.meta.defaultLocale ?? SYSTEM_LOCALE;
		},
		headerProps() {
			return getHeaderProps({
				siteId: this.siteId,
				meta: this.meta,
				blocks: this.blocks,
				nav: this.nav,
				pages: this.pages,
				elements: this.elements,
				languageMetaTitle: this.metaTitle,
				currentLocale: this.currentLocale,
				currentPageId: this.currentPageId,
				languageSwitcherLanguages: this.languageSwitcherLanguages,
				isLogoOptimized: true,
				shoppingCartItems: this.shoppingCartItems,
				ecwidCartItemCount: this.ecwidCartItemCount,
				getPagePathFromId: ({ pageId }) => this.getPagePathFromId({
					pageId,
				}),
				isOpen: this.isNavOpen,
				devicePixelRatio: this.devicePixelRatio,
				ecwidPages: this.ecwidPages,
			});
		},
		ecommerceTranslations() {
			if (!this.isStoreTypeZyro) {
				return {};
			}

			return this.ecommerceShoppingCart?.translations ?? {};
		},
		language() {
			if (!this.isStoreTypeZyro) {
				return null;
			}

			return this.ecommerceShoppingCart?.lang ?? 'en';
		},
		currentPageBlockData() {
			return this.currentPageBlocks.map((id) => this.blocks[id]);
		},
		currentPageEcommerceBlocks() {
			if (!this.isLocaleWithEcommerceItems) {
				return [];
			}

			return this.currentPageBlockData.filter((block) => [
				'BlockEcommerceProduct',
				'BlockEcommerceProductList',
			].includes(block.type));
		},
		currentPageEcommerceComponents() {
			if (!this.isLocaleWithEcommerceItems) {
				return [];
			}

			const allEcommerceComponents = Object.keys(this.elements)?.filter((id) => this.elements[id].type === 'GridEcommerceButton');

			return allEcommerceComponents.filter((id) => this.currentPageBlockData.some((data) => data.components?.includes(id)))
				.map((id) => this.elements[id]);
		},
		firstBlockCSSVars() {
			const { isTransparent } = this.blocks.header.background ?? {};

			return {
				'--header-height': isTransparent ? `${this.meta.headerHeight}px` : null,
			};
		},
		lcp() {
			const [firstBlockId] = this.currentPage?.blocks ?? [];

			if (this.blocks?.[firstBlockId]?.background?.current === 'image') {
				return {
					type: 'block-background',
					id: firstBlockId,
				};
			}

			if (this.blocks?.[firstBlockId]?.type === 'BlockBlogList') {
				return {
					type: 'block-blog-list',
					id: firstBlockId,
				};
			}

			if (this.blocks?.[firstBlockId]?.type === 'BlockEcommerceProduct') {
				return {
					type: 'block-ecommerce-product',
					id: firstBlockId,
				};
			}

			if (this.blocks?.[firstBlockId]?.type === 'BlockEcommerceProductList') {
				return {
					type: 'block-ecommerce-product-list',
					id: firstBlockId,
				};
			}

			// this should return [{ blockId, elementId }, { blockId, elementId }, ...]
			// because we need both blockId and elementId to get image size
			const allElementIds = this.currentPageBlocks
				.filter((blockId) => this.blocks[blockId]?.components?.length > 0)
				.flatMap((blockId) => this.blocks[blockId].components.map((elementId) => ({
					blockId,
					elementId,
				})));

			const firstImages = allElementIds
				.filter(({ elementId }) => this.elements[elementId]?.type === 'GridImage')
				.slice(0, NUMBER_OF_LCP_IMAGES_TO_COMPARE)
				.map(({
					blockId,
					elementId,
				}) => {
					const elementData = this.elements[elementId];
					// Check wether image has 'mobile' or 'desktop' width/height
					// If yes, use them to calculate LCP, otherwise it's grid and calculate size via `getGridItemSize`
					const sizeInLayout = elementData.mobile ?? elementData.desktop;

					const {
						width,
						height,
					} = sizeInLayout ?? getGridItemSize(
						this.blocks[blockId],
						elementData.settings.styles.position,
					);

					return {
						elementId,
						imageRatio: height / width,
					};
				});

			if (firstImages.length === 0) {
				return {};
			}

			const largestImage = firstImages.reduce(
				(previous, current) => (current.imageRatio > previous.imageRatio ? current : previous),
			);

			return {
				type: 'grid-image',
				id: largestImage?.elementId,
			};
		},
	},

	watch: {
		$route: {
			handler() {
				this.isNavOpen = false;
			},
			immediate: true,
		},
	},
	mounted() {
		this.scrollToHash(window.location.hash);
	},
	methods: {
		...mapActions('ecommerce', ['setShoppingCartOpen']),
		handleCartClick() {
			if (this.isLocaleWithEcommerceItems) {
				this.setShoppingCartOpen(true);
			}
		},
		redirectToThirdPartyLink(anchorElement) {
			const {
				target,
				href,
			} = anchorElement;
			const shouldOpenInNewTab = target === '_blank';
			const linkOpenMode = shouldOpenInNewTab || getIsInIframe() ? '_blank' : '_self';

			window.open(href, linkOpenMode);
		},
		scrollToHash(hash) {
			if (!hash) {
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				});

				return;
			}

			scrollToSection(hash);
		},
		async handleGlobalClick(event) {
			const closestAnchor = event.target.closest('a');

			if (!closestAnchor) {
				return;
			}

			const {
				href,
				pathname,
				origin,
				hash,
				target,
				search,
			} = closestAnchor;

			if (!href) {
				return;
			}

			event.preventDefault();

			const isTargetThirdParty = window.location.origin !== origin;

			if (isTargetThirdParty) {
				this.redirectToThirdPartyLink(closestAnchor);

				return;
			}

			const { slug } = getPathParams({
				path: pathname,
				languageKeys: this.languageKeys,
				defaultLocale: this.meta.defaultLocale,
			});

			const targetPageId = slug ? Object.keys(this.pages).find((pageId) => this.pages[pageId].slug === slug) : this.homePageId;
			const isTargetPageCurrentPage = window.location.pathname === pathname;
			const queryParams = new URLSearchParams(search);
			const targetEcwidPage = queryParams.get('store-page');
			const isTargetPageWithEcwidBlock = Object.keys(this.ecwidPages).includes(targetPageId);
			const isTargetPageEcwid = !!targetEcwidPage || isTargetPageWithEcwidBlock;
			const shouldOpenInNewTab = target === '_blank';
			const fullPath = href.replace(origin, '');
			const currentFullPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

			if (isTargetPageCurrentPage && !shouldOpenInNewTab) {
				this.scrollToHash(hash);
			}

			if (shouldOpenInNewTab && !getIsInIframe()) {
				window.open(href, target);
			} else if (currentFullPath !== fullPath) {
				await this.$router.push(fullPath);

				if (hash) {
					this.scrollToHash(hash);
				}
			}

			if (!isTargetPageEcwid) {
				return;
			}

			if (!targetEcwidPage) {
				if (!window.Ecwid) {
					return;
				}

				this.openEcwidHomepage();

				return;
			}

			if (targetEcwidPage === 'cart') {
				this.openCart();

				return;
			}

			// Todo: Ecwid page click handling needs refactor, window.location.reload isn't working on previews
			window.location.reload();
		},
	},
});
</script>

<style lang="scss">
.page {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
</style>
