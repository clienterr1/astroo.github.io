<template>
	<LayoutElementWrapper
		ref="elementRef"
		class="layout-element"
		:class="[
			{
				'layout-element--desktop-element-hidden': isDesktopElementHidden,
				'layout-element--mobile-element-hidden': isMobileElementHidden,
			}, animationClass
		]"
		:element-data="elementData"
		:is-mobile-legacy="isMobileLegacy"
	>
		<!-- ID is used by other internal services -->
		<GridButtonProviderUser
			v-if="elementData.type === ELEMENT_TYPE_BUTTON"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			:current-locale="currentLocale"
			:mobile-element-width="elementData.mobile.width"
			:mobile-element-height="elementData.mobile.height"
			class="layout-element__component layout-element__component--GridButton"
		/>
		<GridStripeButtonProviderUser
			v-if="elementData.type === ELEMENT_TYPE_STRIPE_BUTTON"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			:success-page-slug="stripeSuccessPageSlug"
			:cancellation-page-slug="stripeCancellationPageSlug"
			:stripe-public-api-key="stripePublicApiKey"
			class="layout-element__component layout-element__component--GridStripeButton"
		/>
		<GridEcommerceButtonProviderUser
			v-if="elementData.type === ELEMENT_TYPE_ECOMMERCE_BUTTON"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			:is-cart-visible="isCartVisible"
			:mobile-element-width="elementData.mobile.width"
			:mobile-element-height="elementData.mobile.height"
			class="layout-element__component layout-element__component--GridEcommerceButton"
		/>
		<GridFormProviderUser
			v-if="elementData.type === ELEMENT_TYPE_FORM"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			:current-locale="currentLocale"
			class="layout-element__component layout-element__component--GridForm"
		/>
		<GridVideoProviderUser
			v-if="elementData.type === ELEMENT_TYPE_VIDEO"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			class="layout-element__component layout-element__component--GridVideo"
		/>
		<GridTextBoxProviderUser
			v-if="elementData.type === ELEMENT_TYPE_TEXT_BOX"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			:[DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE]="ELEMENT_TYPE_TEXT_BOX"
			class="layout-element__component layout-element__component--GridTextBox"
		/>
		<GridMapProviderUser
			v-if="elementData.type === ELEMENT_TYPE_MAP"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			class="layout-element__component layout-element__component--GridMap"
		/>
		<GridSocialIconsProviderUser
			v-if="elementData.type === ELEMENT_TYPE_SOCIAL_ICONS"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			class="layout-element__component layout-element__component--GridSocialIcons"
		/>
		<GridGalleryProviderUser
			v-if="elementData.type === ELEMENT_TYPE_GALLERY"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			:element-width="elementData.desktop.width"
			:element-height="elementData.desktop.height"
			class="layout-element__component layout-element__component--GridGallery"
			@image-load="observeElement"
		/>
		<GridImageProviderUser
			v-if="elementData.type === ELEMENT_TYPE_IMAGE"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:lcp="lcp"
			:data="elementData"
			:mobile-element-width="elementData.mobile.width"
			:mobile-element-height="elementData.mobile.height"
			:element-width="elementData.desktop.width"
			:[DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE]="ELEMENT_TYPE_IMAGE"
			:element-height="elementData.desktop.height"
			:reset-mobile-position="isMobileLegacy"
			:current-locale="currentLocale"
			class="layout-element__component layout-element__component--GridImage"
		/>
		<GridInstagramFeedProviderUser
			v-if="elementData.type === ELEMENT_TYPE_INSTAGRAM_FEED"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			class="layout-element__component layout-element__component--GridInstagramFeed"
			@media-loaded="observeElement"
		/>
		<GridEmbedProviderUser
			v-if="elementData.type === ELEMENT_TYPE_EMBED"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			class="layout-element__component layout-element__component--GridEmbed"
		/>
		<GridShapeProviderUser
			v-if="elementData.type === ELEMENT_TYPE_SHAPE"
			:id="elementId"
			v-qa="`${elementData.type}:${elementId}`"
			:data="elementData"
			class="layout-element__component layout-element__component--GridShape"
		/>
		<slot />
	</LayoutElementWrapper>
</template>

<script>
import {
	ELEMENT_TYPE_BUTTON,
	ELEMENT_TYPE_STRIPE_BUTTON,
	ELEMENT_TYPE_ECOMMERCE_BUTTON,
	ELEMENT_TYPE_MAP,
	ELEMENT_TYPE_VIDEO,
	ELEMENT_TYPE_IMAGE,
	ELEMENT_TYPE_TEXT_BOX,
	ELEMENT_TYPE_FORM,
	ELEMENT_TYPE_INSTAGRAM_FEED,
	ELEMENT_TYPE_SOCIAL_ICONS,
	ELEMENT_TYPE_GALLERY,
	ELEMENT_TYPE_EMBED,
	ELEMENT_TYPE_SHAPE,
	DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE,
} from '@zyro-inc/site-modules/constants';

import LayoutElementWrapper from '@zyro-inc/site-modules/components/blocks/layout/LayoutElementWrapper.vue';
import GridButtonProviderUser from '@/components/elements/GridButtonProviderUser.vue';
import GridEcommerceButtonProviderUser from '@/components/elements/GridEcommerceButtonProviderUser.vue';
import GridEmbedProviderUser from '@/components/elements/GridEmbedProviderUser.vue';
import GridFormProviderUser from '@/components/elements/GridFormProviderUser.vue';
import GridGalleryProviderUser from '@/components/elements/GridGalleryProviderUser.vue';
import GridImageProviderUser from '@/components/elements/GridImageProviderUser.vue';
import GridInstagramFeedProviderUser from '@/components/elements/GridInstagramFeedProviderUser.vue';
import GridMapProviderUser from '@/components/elements/GridMapProviderUser.vue';
import GridSocialIconsProviderUser from '@/components/elements/GridSocialIconsProviderUser.vue';
import GridStripeButtonProviderUser from '@/components/elements/GridStripeButtonProviderUser.vue';
import GridTextBoxProviderUser from '@/components/elements/GridTextBoxProviderUser.vue';
import GridVideoProviderUser from '@/components/elements/GridVideoProviderUser.vue';
import GridShapeProviderUser from '@/components/elements/GridShapeProviderUser.vue';
import { useSiteEngineAnimations } from '@zyro-inc/site-modules/use/useSiteEngineAnimations';
import {
	defineComponent,
	computed,
	onMounted,
	onBeforeUnmount,
	ref,
} from 'vue';

export default defineComponent({
	name: 'LayoutElementProviderUser',

	components: {
		GridButtonProviderUser,
		GridStripeButtonProviderUser,
		GridEcommerceButtonProviderUser,
		GridFormProviderUser,
		GridVideoProviderUser,
		GridTextBoxProviderUser,
		GridMapProviderUser,
		GridSocialIconsProviderUser,
		GridGalleryProviderUser,
		GridImageProviderUser,
		GridInstagramFeedProviderUser,
		GridEmbedProviderUser,
		GridShapeProviderUser,
		LayoutElementWrapper,
	},
	props: {
		elementId: {
			type: String,
			required: true,
		},
		elementData: {
			type: Object,
			required: true,
		},
		overrideWidth: {
			type: Number,
			default: null,
		},
		overrideHeight: {
			type: Number,
			default: null,
		},
		isMobileLegacy: {
			type: Boolean,
			default: false,
		},
		lcp: {
			type: Object,
			default: () => ({}),
		},
		siteLanguagePages: {
			type: Object,
			required: true,
		},
		stripePublicApiKey: {
			type: String,
			default: '',
		},
		currentLocale: {
			type: String,
			required: true,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
		isParentBlockFooter: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const elementRef = ref(null);
		const {
			intersectionObserver,
			animationClass,
			addIntersectionObserver,
			observe,
		} = useSiteEngineAnimations({
			elementData: props.elementData,
			isParentBlockFooter: props.isParentBlockFooter,
			elementId: props.elementId,
		});
		const firstLanguagePage = computed(() => Object.values(props.siteLanguagePages)[0]);

		const stripeSuccessPageSlug = computed(() => {
			if (props.elementData.type !== ELEMENT_TYPE_STRIPE_BUTTON) {
				return '';
			}

			return (props.siteLanguagePages[props.elementData.settings?.successPageId] || firstLanguagePage.value).slug;
		});
		const stripeCancellationPageSlug = computed(() => {
			if (props.elementData.type !== ELEMENT_TYPE_STRIPE_BUTTON) {
				return '';
			}

			return (props.siteLanguagePages[props.elementData.settings?.cancellationPageId] || firstLanguagePage.value).slug;
		});

		const observeElement = async () => {
			await observe(elementRef.value?.$el);
		};

		onMounted(async () => {
			const imageListTypeElements = [
				ELEMENT_TYPE_INSTAGRAM_FEED,
				ELEMENT_TYPE_GALLERY,
			];
			const isElementTypeImageList = imageListTypeElements.includes(props.elementData.type);
			const elementHeight = elementRef.value?.$el.getBoundingClientRect().height;
			const isElementTooTallForScreen = elementHeight > window.innerHeight;
			const elementRoot = !isElementTypeImageList && isElementTooTallForScreen && elementRef.value
				? elementRef.value.$el.parentElement
				: null;

			addIntersectionObserver({
				root: elementRoot,
			});

			if (!isElementTypeImageList) {
				await observeElement();
			}
		});

		onBeforeUnmount(() => intersectionObserver.value?.disconnect());

		return {
			stripeSuccessPageSlug,
			stripeCancellationPageSlug,
			ELEMENT_TYPE_BUTTON,
			ELEMENT_TYPE_STRIPE_BUTTON,
			ELEMENT_TYPE_ECOMMERCE_BUTTON,
			ELEMENT_TYPE_MAP,
			ELEMENT_TYPE_VIDEO,
			ELEMENT_TYPE_IMAGE,
			ELEMENT_TYPE_TEXT_BOX,
			ELEMENT_TYPE_FORM,
			ELEMENT_TYPE_INSTAGRAM_FEED,
			ELEMENT_TYPE_SOCIAL_ICONS,
			ELEMENT_TYPE_GALLERY,
			ELEMENT_TYPE_EMBED,
			ELEMENT_TYPE_SHAPE,
			DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE,
			elementRef,
			animationClass,
			observe,
			observeElement,
		};
	},
	computed: {
		isMobileElementHidden() {
			return this.elementData.mobile?.isHidden || false;
		},
		isDesktopElementHidden() {
			return this.elementData.desktop?.isHidden || false;
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/components/blocks/layout/LayoutElementWrapperProvider";
</style>
