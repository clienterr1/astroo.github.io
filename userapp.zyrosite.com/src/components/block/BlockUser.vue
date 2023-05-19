<template>
	<section
		:id="id"
		ref="blockRef"
		class="block"
		:class="[
			animationClass,
			`block--${blockModifier}`,
			{
				'block--footer': isBlockFooter,
				'block--desktop-hidden': isDesktopBlockHidden,
				'block--mobile-hidden': isMobileBlockHidden
			},
		]"
		:style="computedStyles"
	>
		<BlockBackground
			v-if="data.background"
			:overlay-opacity="data.background['overlay-opacity']"
			:type="data.background.current"
			:color="data.background.color"
			:src="backgroundSrc"
			:srcset="backgroundSrcSet"
			:is-eager="lcp.type === 'block-background' && lcp.id === id"
			:is-fixed="data.attachment === 'fixed'"
			:alt="data.background && data.background.alt"
		/>
		<BlockGridUser
			v-if="data.type === BLOCK_TYPE_GRID"
			:lcp="lcp"
			:data="data"
			:block-id="id"
			:is-cart-visible="isCartVisible"
			:current-locale="currentLocale"
		/>
		<BlockLayoutProviderUser
			v-if="data.type === BLOCK_TYPE_LAYOUT"
			:lcp="lcp"
			:data="data"
			:block-id="id"
			:components="siteElements"
			:current-locale="currentLocale"
			:is-cart-visible="isCartVisible"
			:site-language-pages="siteLanguagePages"
			:stripe-public-api-key="stripePublicApiKey"
		/>
		<BlockBlogHeader
			v-if="data.type === BLOCK_TYPE_BLOG_HEADER"
			:data="data"
			:current-blog-page="currentBlogPage"
			:blog-categories="blogCategories"
		/>
		<BlockBlogListProviderUser
			v-if="data.type === BLOCK_TYPE_BLOG_LIST"
			:data="data"
			:block-id="id"
			:current-locale="currentLocale"
		/>
		<BlockSlideshowProviderUser
			v-if="data.type === BLOCK_TYPE_SLIDESHOW"
			:data="data"
			:block-id="id"
			:blocks="siteBlocks"
			:current-locale="currentLocale"
		/>
		<BlockImageSlideshowProviderUser
			v-if="data.type === BLOCK_TYPE_IMAGE_SLIDESHOW"
			:data="data"
			:block-id="id"
			:website-id="websiteId"
		/>
		<BlockEcwidStoreProviderUser
			v-if="data.type === BLOCK_TYPE_ECWID"
			:data="data"
			:block-id="id"
			:current-locale="currentLocale"
		/>
		<BlockEcommerceProductProviderUser
			v-if="data.type === BLOCK_TYPE_ECOMMERCE_PRODUCT"
			:lcp="lcp"
			:data="data"
			:block-id="id"
			:product-pages="productPages"
			:is-cart-visible="isCartVisible"
			:ecommerce-translations="ecommerceTranslations"
			:current-page-type="currentPageType"
		/>
		<BlockEcommerceProductListProviderUser
			v-if="data.type === BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST"
			:lcp="lcp"
			:data="data"
			:block-id="id"
			:blocks="siteBlocks"
			:current-locale="currentLocale"
			:is-cart-visible="isCartVisible"
			:ecommerce-translations="ecommerceTranslations"
		/>
	</section>
</template>

<script>
import {
	computed,
	defineComponent,
	onMounted,
	onBeforeUnmount,
	ref,
	watch,
} from 'vue';
import { useStore } from 'vuex';

import BlockBackground from '@zyro-inc/site-modules/components/blocks/BlockBackground.vue';
import BlockBlogHeader from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogHeader.vue';
import {
	PAGE_TYPE_BLOG,
	BLOCK_MODIFIERS_MAP,
	SYSTEM_LOCALE,
	BLOCK_TYPE_GRID,
	BLOCK_TYPE_LAYOUT,
	BLOCK_TYPE_BLOG_HEADER,
	BLOCK_TYPE_BLOG_LIST,
	BLOCK_TYPE_SLIDESHOW,
	BLOCK_TYPE_IMAGE_SLIDESHOW,
	BLOCK_TYPE_ECWID,
	BLOCK_TYPE_ECOMMERCE_PRODUCT,
	BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
} from '@zyro-inc/site-modules/constants';
import { DEFAULT_BLOCK_GRID_STYLES } from '@zyro-inc/site-modules/constants/defaultStyles';
import { FULL_WIDTH } from '@zyro-inc/site-modules/utils/getGridItemSize';
import {
	getFullWidthSrcset,
	getOptimizedSrc,
} from '@zyro-inc/site-modules/utils/getSrcsets';

import { getMapValue } from '@zyro-inc/site-modules/utils/object';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';
import BlockGridUser from '@/components/block-grid/BlockGridUser.vue';
import BlockLayoutProviderUser from '@/components/block-layout/BlockLayoutProviderUser.vue';
import BlockBlogListProviderUser from '@/components/blocks/BlockBlogListProviderUser.vue';
import BlockEcommerceProductListProviderUser from '@/components/blocks/BlockEcommerceProductListProviderUser.vue';
import BlockEcommerceProductProviderUser from '@/components/blocks/BlockEcommerceProductProviderUser.vue';
import BlockEcwidStoreProviderUser from '@/components/blocks/BlockEcwidStoreProviderUser.vue';
import BlockSlideshowProviderUser from '@/components/blocks/BlockSlideshowProviderUser.vue';
import BlockImageSlideshowProviderUser from '@/components/blocks/BlockImageSlideshowProviderUser.vue';
import { useSiteEngineAnimations } from '@zyro-inc/site-modules/use/useSiteEngineAnimations';

const MOBILE_FULL_HEIGT_THRESHOLD = 360;

export default defineComponent({
	name: 'BlockUser',

	components: {
		BlockGridUser,
		BlockLayoutProviderUser,
		BlockBackground,
		BlockBlogListProviderUser,
		BlockBlogHeader,
		BlockEcwidStoreProviderUser,
		BlockSlideshowProviderUser,
		BlockEcommerceProductProviderUser,
		BlockEcommerceProductListProviderUser,
		BlockImageSlideshowProviderUser,
	},

	inheritAttrs: false,

	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		lcp: {
			type: Object,
			default: () => ({}),
		},
		currentLocale: {
			type: String,
			default: SYSTEM_LOCALE,
		},
		style: {
			type: Object,
			default: () => ({}),
		},
		ecommerceTranslations: {
			type: Object,
			default: () => ({}),
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
		pageId: {
			type: String,
			required: true,
		},
		currentPageType: {
			type: String,
			default: 'default',
		},
	},

	setup(props) {
		const blockRef = ref(null);
		const {
			getters,
			state,
		} = useStore();
		const blogCategories = computed(() => getters.blogCategories);
		const {
			addIntersectionObserver,
			observe,
			intersectionObserver,
			animationClass,
		} = useSiteEngineAnimations({
			data: props.data,
		});
		const websiteId = computed(() => getters.siteId);
		const isEcommerceProductsLoaded = computed(() => state.ecommerce.isLoaded);
		const currentSiteLocale = computed(() => props.currentLocale);

		const isDesktopBlockHidden = computed(() => props.data.desktop?.isHidden || false);

		const isMobileBlockHidden = computed(() => props.data.mobile?.isHidden || false);

		const computedStyles = computed(() => {
			const useBlockGridStyles = props.data.type === BLOCK_TYPE_GRID
				|| props.data.type === BLOCK_TYPE_SLIDESHOW;

			return {
				...props.style,
				...(useBlockGridStyles ? DEFAULT_BLOCK_GRID_STYLES : {}),
				...objectToCssVariables(props.data?.settings?.styles),
			};
		});
		const isMobileFullScreen = computed(() => {
			if (!props.data?.settings?.styles['m-block-padding']) {
				return false;
			}

			/**
			 * This is an assumption that if user sets large paddings on mobile,
			 * he might want to have either full screen or height background.
			 */
			const {
				top,
				bottom,
			} = parseCSSSides(props.data.settings.styles['m-block-padding']);
			const mobilePadding = Number.parseInt(top, 10) + Number.parseInt(bottom, 10);

			return mobilePadding > MOBILE_FULL_HEIGT_THRESHOLD;
		});

		const blockModifier = computed(() => getMapValue(props.data.type, BLOCK_MODIFIERS_MAP));

		const backgroundSrc = computed(() => getOptimizedSrc(
			props.data.background.origin,
			props.data.background.path,
			getters.siteId,
			{
				width: FULL_WIDTH,
			},
		));

		const backgroundSrcSet = computed(
			() => getFullWidthSrcset(
				props.data.background.origin,
				props.data.background.path,
				getters.siteId,
				{
					isMobileFullScreen: isMobileFullScreen.value,
				},
			),
		);

		const isBlockFooter = computed(() => props.data.slot === 'footer');

		const siteBlocks = computed(() => getters.blocks);
		const siteElements = computed(() => getters.elements);
		const siteLanguagePages = computed(() => getters.pages);

		const currentBlogPage = computed(() => {
			if (props.data.type !== BLOCK_TYPE_BLOG_HEADER) {
				return null;
			}

			const [, currentBlockPage] = Object.entries(siteLanguagePages.value).find(
				([pageId, page]) => page.type === PAGE_TYPE_BLOG && pageId === props.pageId,
			);

			return currentBlockPage;
		});

		const stripePublicApiKey = computed(() => getters.meta.stripePublicApiKey);
		const productPages = computed(() => getters['ecommerce/productPages']);

		const isEcommerceBlock = computed(() => props.data.type === BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST);

		// ecommerce products are loaded later so need to observe them after they are loaded
		onMounted(async () => {
			addIntersectionObserver();

			if (!isEcommerceBlock.value || isEcommerceProductsLoaded.value) {
				await observe(blockRef.value);
			}
		});

		onBeforeUnmount(() => intersectionObserver.value?.disconnect());

		watch([
			currentSiteLocale,
			isEcommerceProductsLoaded,
		], async ([currentLocale, isLoaded], [previousLocale]) => {
			if ((isLoaded || currentLocale !== previousLocale) && isEcommerceBlock.value) {
				await observe(blockRef.value);
			}
		});

		return {
			productPages,
			siteLanguagePages,
			blockModifier,
			computedStyles,
			backgroundSrc,
			backgroundSrcSet,
			isBlockFooter,
			siteBlocks,
			siteElements,
			currentBlogPage,
			stripePublicApiKey,
			BLOCK_TYPE_GRID,
			BLOCK_TYPE_LAYOUT,
			BLOCK_TYPE_BLOG_HEADER,
			BLOCK_TYPE_BLOG_LIST,
			BLOCK_TYPE_SLIDESHOW,
			BLOCK_TYPE_IMAGE_SLIDESHOW,
			BLOCK_TYPE_ECWID,
			BLOCK_TYPE_ECOMMERCE_PRODUCT,
			BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
			blockRef,
			animationClass,
			blogCategories,
			isDesktopBlockHidden,
			isMobileBlockHidden,
			websiteId,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/components/Block";
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.block--desktop-hidden {
	@media screen and (min-width: $media-mobile) {
		display: none;
	}
}

@include site-engine-mobile {
	.block--mobile-hidden {
		display: none;
	}
}
</style>
