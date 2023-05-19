<template>
	<div
		v-qa="`${data.type && data.type}:${id}`"
		class="block-grid-item use-m-margin"
		:style="computedStyles"
	>
		<GridButtonProviderUser
			v-if="data.type === ELEMENT_TYPE_BUTTON"
			:data="data"
			:current-locale="currentLocale"
			class="block-grid-item__component"
		/>
		<GridStripeButtonProviderUser
			v-if="data.type === ELEMENT_TYPE_STRIPE_BUTTON"
			:data="data"
			:stripe-success-page-slug="stripeSuccessPageSlug"
			:stripe-cancellation-page-slug="stripeCancellationPageSlug"
			:stripe-public-api-key="stripePublicApiKey"
			class="block-grid-item__component"
		/>
		<GridEcommerceButtonProviderUser
			v-if="data.type === ELEMENT_TYPE_ECOMMERCE_BUTTON"
			:data="data"
			:is-cart-visible="isCartVisible"
			class="block-grid-item__component"
		/>
		<GridFormProviderUser
			v-if="data.type === ELEMENT_TYPE_FORM"
			:id="id"
			:data="data"
			:current-locale="currentLocale"
			class="block-grid-item__component"
		/>
		<GridVideoProviderUser
			v-if="data.type === ELEMENT_TYPE_VIDEO"
			:data="data"
			class="block-grid-item__component"
		/>
		<GridTextBoxProviderUser
			v-if="data.type === ELEMENT_TYPE_TEXT_BOX"
			:data="data"
			class="block-grid-item__component"
		/>
		<GridMapProviderUser
			v-if="data.type === ELEMENT_TYPE_MAP"
			:data="data"
			class="block-grid-item__component"
		/>
		<GridSocialIconsProviderUser
			v-if="data.type === ELEMENT_TYPE_SOCIAL_ICONS"
			:data="data"
			class="block-grid-item__component"
		/>
		<GridGalleryProviderUser
			v-if="data.type === ELEMENT_TYPE_GALLERY"
			:data="data"
			:element-width="elementWidth"
			:element-height="elementHeight"
			:mobile-block-padding="mobileBlockPadding"
			class="block-grid-item__component"
		/>
		<GridImageProviderUser
			v-if="data.type === ELEMENT_TYPE_IMAGE"
			:id="id"
			:lcp="lcp"
			:data="data"
			:element-width="elementWidth"
			:element-height="elementHeight"
			:mobile-block-padding="mobileBlockPadding"
			:current-locale="currentLocale"
			class="block-grid-item__component"
		/>
		<GridInstagramFeedProviderUser
			v-if="data.type === ELEMENT_TYPE_INSTAGRAM_FEED"
			:id="id"
			:data="data"
			class="block-grid-item__component"
		/>
		<GridEmbedProviderUser
			v-if="data.type === ELEMENT_TYPE_EMBED"
			:id="id"
			:data="data"
			class="block-grid-item__component"
		/>
	</div>
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
} from '@zyro-inc/site-modules/constants';
import { getGridItemSize } from '@zyro-inc/site-modules/utils/getGridItemSize';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
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

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	name: 'BlockGridItemUser',

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
	},

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
		mobileBlockPadding: {
			type: String,
			required: true,
		},
		blockData: {
			type: Object,
			required: true,
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
	},
	setup(props) {
		const firstLanguagePage = computed(() => Object.values(props.siteLanguagePages)[0]);

		const stripeSuccessPageSlug = computed(() => {
			if (props.data.type !== ELEMENT_TYPE_STRIPE_BUTTON) {
				return '';
			}

			return (props.siteLanguagePages[props.data.settings?.successPageId] || firstLanguagePage.value).slug;
		});
		const stripeCancellationPageSlug = computed(() => {
			if (props.data.type !== ELEMENT_TYPE_STRIPE_BUTTON) {
				return '';
			}

			return (props.siteLanguagePages[props.data.settings?.cancellationPageId] || firstLanguagePage.value).slug;
		});

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
		};
	},
	computed: {
		settings() {
			return this.data.settings;
		},
		styles() {
			return this.settings.styles;
		},
		innerBackgroundValue({ data }) {
			const { innerBackground } = data;

			if (!innerBackground) {
				return {};
			}

			const currentBackground = innerBackground[innerBackground.current];

			if (innerBackground.current === 'image') {
				const imageBackground = {
					'--gridItemInnerBackground': `url(${currentBackground})`,
				};

				if ('overlay-opacity' in innerBackground) {
					imageBackground['--gridItemInnerBackgroundOverlayOpacity'] = innerBackground['overlay-opacity'];
				}

				return imageBackground;
			}

			return {
				'--gridItemInnerBackground': currentBackground,
			};
		},
		elementWidth() {
			return getGridItemSize(this.blockData, this.styles.position)?.width;
		},
		elementHeight() {
			return getGridItemSize(this.blockData, this.styles.position)?.height;
		},
		computedStyles() {
			return {
				...objectToCssVariables(this.styles),
				...this.innerBackgroundValue,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/components/BlockGridItem";

.block-grid-item {
	// Make only the actual component clickable
	// Prevents, for example, buttons that are over textboxes, from being non clickable
	pointer-events: none;

	&__component {
		pointer-events: all;
	}
}

@include site-engine-mobile {
	.block-grid-item {
		width: var(--m-width, 100%);

		&.use-m-margin {
			margin: var(--m-element-margin);

			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}
}
</style>
