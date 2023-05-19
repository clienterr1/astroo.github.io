<template>
	<div
		:id="id"
		class="image-wrapper"
		:class="{ 'image-wrapper--layout': isMobileLayout }"
	>
		<GridImage
			class="image-wrapper--desktop"
			:alt="alt"
			:href="href"
			:sizes="sizes"
			:src="src"
			:srcset="srcset"
			:tag-name="tagName"
			:target="target"
			:rel="rel"
			:is-eager="lcp.type === 'grid-image' && lcp.id === id"
			:is-lightbox-enabled="isLightboxEnabled"
			:element-height="elementHeight"
			:element-width="elementWidth"
			:reset-mobile-position="resetMobilePosition"
			@image-click="handleImageClick"
		/>
		<GridImage
			v-if="isMobileLayout"
			:is-mobile-image="true"
			class="image-wrapper--mobile"
			:alt="alt"
			:href="href"
			:sizes="sizes"
			:src="mobileSrc"
			:srcset="mobileSrcset"
			:tag-name="tagName"
			:is-svg="isSvg"
			:target="target"
			:rel="rel"
			:is-eager="lcp.type === 'grid-image' && lcp.id === id"
			:is-lightbox-enabled="isLightboxEnabled"
			:element-height="mobileElementHeight"
			:element-width="mobileElementWidth"
			:reset-mobile-position="resetMobilePosition"
			@image-click="handleImageClick"
		/>
	</div>
</template>

<script>
import {
	computed,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import GridImage from '@zyro-inc/site-modules/components/elements/image/GridImage.vue';
import { useLightbox } from '@zyro-inc/site-modules/components/lightbox/useLightbox';
import {
	IMAGE_CLICK_ACTION_LINK,
	IMAGE_CLICK_ACTION_LIGHTBOX,
	LINK_TYPE_INTERNAL,
} from '@zyro-inc/site-modules/constants';
import {
	getOptimizedSrc,
	getGridItemSrcset,
	getGridItemSizes,
	getFullWidthSrcset,
} from '@zyro-inc/site-modules/utils/getSrcsets';
import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';
import { useGridImage } from '@zyro-inc/site-modules/components/elements/image/useGridImage';
import { getExtension } from '@zyro-inc/site-modules/utils/modifyString';

export default defineComponent({
	name: 'GridImageProviderUser',

	components: {
		GridImage,
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
			default: '0px',
		},
		elementWidth: {
			type: Number,
			default: null,
		},
		elementHeight: {
			type: Number,
			default: null,
		},
		mobileElementWidth: {
			type: Number,
			default: null,
		},
		mobileElementHeight: {
			type: Number,
			default: null,
		},
		resetMobilePosition: {
			type: Boolean,
			default: true,
		},
		currentLocale: {
			type: String,
			required: true,
		},
	},

	setup(props, context) {
		const { addImagesToLightbox } = useLightbox();
		const { getters } = useStore();

		const {
			cropCSSVars,
			desktopCropParams,
			mobileCropParams,
			href,
		} = useGridImage(props, context, {
			href: computed(() => {
				if (props.data.linkType === LINK_TYPE_INTERNAL) {
					return getters.getPagePathFromId({
						pageId: props.data.linkedPageId,
					});
				}

				return props.data.href;
			}),
		});

		// Calculates params for trim based on full image resolution
		// We need to do this because what users sees in builder is based on how css renders it
		const calculateFullResolutionTrim = (cropParams) => {
			const {
				fullResolutionWidth,
				fullResolutionHeight,
			} = props.data;

			const {
				left,
				top,
				right,
				bottom,
				imageWidth,
				imageHeight,
			} = cropParams;

			const leftCutPercentage = left / imageWidth;
			const topCutPercentage = top / imageHeight;
			const rightCutPercentage = right / imageWidth;
			const bottomCutPercentage = bottom / imageHeight;

			return {
				left: fullResolutionWidth * leftCutPercentage,
				top: fullResolutionHeight * topCutPercentage,
				right: fullResolutionWidth * rightCutPercentage,
				bottom: fullResolutionHeight * bottomCutPercentage,
			};
		};

		// Constructs trim param for cloudflare
		const constructTrimParamForCloudflare = (cropParams) => {
			const {
				top,
				right,
				bottom,
				left,
			} = calculateFullResolutionTrim(cropParams);

			return `${top};${right};${bottom};${left}`;
		};

		// These are repeated a lot in function calls, so lets save them in a variable
		const imagePathParams = computed(() => [
			props.data.settings.origin,
			props.data.settings.path,
			getters.siteId,
		]);

		const src = computed(() => {
			// Cropped layout images
			if (cropCSSVars.value) {
				return getOptimizedSrc(...imagePathParams.value, {
					width: props.elementWidth,
					height: props.elementHeight,
					shouldContain: false,
					trim: constructTrimParamForCloudflare(desktopCropParams.value),
				});
			}

			// Grid and non cropped images
			return getOptimizedSrc(...imagePathParams.value, {
				width: props.elementWidth,
				height: props.elementHeight,
				shouldContain: props.data.settings.styles['object-fit'] === 'contain',
			});
		});

		const isSvg = computed(() => getExtension(props.data.settings.path) === 'svg');
		const isMobileLayout = computed(() => props.mobileElementWidth && props.mobileElementHeight);

		const mobileSrc = computed(() => {
			// DEPRECATE: Legacy flex mobile support
			// If height is -1 it means that the element is in legacy flexbox mode
			if (!props.mobileElementHeight || props.mobileElementHeight < 0) {
				return src.value;
			}

			// Cropped images
			if (cropCSSVars.value) {
				return getOptimizedSrc(...imagePathParams.value, {
					width: props.mobileElementWidth,
					height: props.mobileElementHeight,
					shouldContain: false,
					trim: constructTrimParamForCloudflare(mobileCropParams.value),
				});
			}

			return getOptimizedSrc(...imagePathParams.value, {
				width: props.mobileElementWidth,
				height: props.mobileElementHeight,
				shouldContain: false,
			});
		});

		const srcset = computed(() => {
			if (cropCSSVars.value) {
				return getGridItemSrcset(...imagePathParams.value, {
					width: props.elementWidth,
					height: props.elementHeight,
					shouldContain: false,
					mobilePadding: 0,
					trim: constructTrimParamForCloudflare(desktopCropParams.value),
				});
			}

			return getGridItemSrcset(...imagePathParams.value, {
				width: props.elementWidth,
				height: props.elementHeight,
				shouldContain: props.data.settings.styles['object-fit'] === 'contain',
			});
		});

		const mobileSrcset = computed(() => {
			// DEPRECATE: Legacy flex mobile support
			// If height is -1 it means that the element is in legacy flexbox mode
			if (!props.mobileElementHeight || props.mobileElementHeight < 0) {
				return srcset.value;
			}

			// Cropped image
			if (cropCSSVars.value) {
				return getGridItemSrcset(...imagePathParams.value, {
					width: props.mobileElementWidth,
					height: props.mobileElementHeight,
					shouldContain: false,
					mobilePadding: 0,
					trim: constructTrimParamForCloudflare(mobileCropParams.value),
				});
			}

			return getGridItemSrcset(...imagePathParams.value, {
				width: props.mobileElementWidth,
				height: props.mobileElementHeight,
				mobilePadding: 0,
				shouldContain: false,
			});
		});

		const sizes = computed(() => {
			const { right } = parseCSSSides(props.mobileBlockPadding ?? '');
			const mobilePadding = right ? Number.parseInt(right, 10) : null;

			return getGridItemSizes(props.elementWidth, mobilePadding);
		});

		const handleImageClick = () => {
			if (props.data.settings.clickAction !== IMAGE_CLICK_ACTION_LIGHTBOX) {
				return;
			}

			addImagesToLightbox({
				src: getOptimizedSrc(
					props.data.settings.origin,
					props.data.settings.path,
					getters.siteId,
				),
				srcset: getFullWidthSrcset(
					props.data.settings.origin,
					props.data.settings.path,
					getters.siteId,
				),
				alt: props.data.settings.alt,
			});
		};

		return {
			alt: computed(() => props.data.settings.alt),
			handleImageClick,
			href,
			src,
			mobileSrc,
			srcset,
			mobileSrcset,
			sizes,
			tagName: computed(() => (props.data.settings.clickAction === IMAGE_CLICK_ACTION_LINK ? 'a' : 'div')),
			target: computed(() => props.data.target),
			rel: computed(() => props.data.rel),
			isLightboxEnabled: computed(() => props.data.settings.clickAction === IMAGE_CLICK_ACTION_LIGHTBOX),
			cropCSSVars,
			isMobileLayout,
			isSvg,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.image-wrapper {
	width: 100%;
	height: 100%;
	max-height: calc(v-bind(elementHeight) * 1px);

	&--desktop {
		display: block;
	}

	&--mobile {
		display: none;
	}
}

@include site-engine-mobile {
	.image-wrapper {
		width: 100%;
		height: 100%;
		max-height: calc(v-bind(mobileElementHeight) * 1px);

		$this: &;

		&--layout {

			#{$this}--desktop {
				display: none;
			}

			#{$this}--mobile {
				display: block;
			}
		}
	}
}
</style>
