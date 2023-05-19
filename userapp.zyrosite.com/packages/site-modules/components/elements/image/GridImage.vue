<template>
	<Component
		:is="tagName"
		:href="href"
		:target="target"
		:rel="rel"
		:title="alt"
		:style="imageCSSVars"
		class="image"
		:class="{
			'image--grid': !isUnstyled,
			'image--unstyled': isUnstyled,
			'image--link': tagName === ANCHOR_TAG,
			'loaded': isLoaded
		}"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_IMAGE"
		:[DATA_ATTRIBUTE_ANIMATION_ROLE]="DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE"
		@click="$emit('image-click', $event)"
	>
		<img
			ref="imageRef"
			v-qa="'builder-gridelement-gridimage'"
			:alt="alt"
			:src="src"
			:srcset="srcset"
			:sizes="sizes"
			:height="elementHeight"
			:width="elementWidth"
			:loading="isEager? 'eager' : 'lazy'"
			:class="{
				'image__image--zoom': isLightboxEnabled,
				'image__image--unstyled': isUnstyled,
				'image__image--cropped': !!cropCssVars,
				'image__image': !isUnstyled,
				'image__image--reset-m-position': resetMobilePosition,
				'image__image--svg': isSvg
			}"
			v-on="{
				drag: preventDrag ? (e) => e.preventDefault() : () => null,
				dragstart: preventDrag ? (e) => e.preventDefault() : () => null,
			}"
		>
		<slot />
	</Component>
</template>

<script>
import {
	ANCHOR_TAG,
	DIV_TAG,
	DATA_ATTRIBUTE_ANIMATION_ROLE,
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_IMAGE,
	DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE,
} from '@zyro-inc/site-modules/constants';

import {
	MOBILE_BLOCK_WIDTH,
	DESKTOP_BLOCK_WIDTH,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';
import {
	computed,
	defineComponent,
	ref,
	watch,
} from 'vue';

const ALLOWED_TAG_NAMES = [
	DIV_TAG,
	ANCHOR_TAG,
];

export default defineComponent({
	props: {
		alt: {
			type: String,
			default: null,
		},
		href: {
			type: String,
			default: null,
		},
		preventDrag: {
			type: Boolean,
			default: false,
		},
		sizes: {
			type: String,
			default: null,
		},
		src: {
			type: String,
			required: true,
		},
		srcset: {
			type: String,
			default: null,
		},
		tagName: {
			type: String,
			validator: (tag) => ALLOWED_TAG_NAMES.includes(tag),
			default: 'div',
		},
		target: {
			type: String,
			default: null,
		},
		rel: {
			type: String,
			default: null,
		},
		isLightboxEnabled: {
			type: Boolean,
			default: false,
		},
		isUnstyled: {
			type: Boolean,
			default: false,
		},
		resetMobilePosition: {
			type: Boolean,
			default: true,
		},
		elementWidth: {
			type: Number,
			default: null,
		},
		elementHeight: {
			type: Number,
			default: null,
		},
		cropCssVars: {
			type: Object,
			default: null,
		},
		isOverflowVisible: {
			type: Boolean,
			default: false,
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		isMobileImage: {
			type: Boolean,
			default: false,
		},
		isInBuilder: {
			type: Boolean,
			default: false,
		},
		isSvg: {
			type: Boolean,
			default: false,
		},
	},

	setup(props, context) {
		// If image height is < 0 mobile values are not yet mapped
		const imageRef = ref(null);
		const isLoaded = ref(false);
		const isMobileLayoutImage = computed(() => props.elementHeight > 0 && props.isMobileImage);
		const mobileWidthCSSVar = computed(() => (isMobileLayoutImage.value ? `${(props.elementWidth * 100) / MOBILE_BLOCK_WIDTH}vw` : '100%'));
		const mobileHeightCSSVar = computed(() => (isMobileLayoutImage.value ? `${(props.elementHeight * 100) / MOBILE_BLOCK_WIDTH}vw` : 'auto'));
		const smallDesktopWidthCSSVar = computed(() => `${(props.elementWidth * 100) / DESKTOP_BLOCK_WIDTH}vw`);
		const smallDesktopHeightCSSVar = computed(() => `${(props.elementHeight * 100) / DESKTOP_BLOCK_WIDTH}vw`);

		// @load event on <img> tag works properly within Vue/Vite build, but within Astro `client:load` mode, it doesn't.
		// Watching for the `complete` property works identically as the @load event, and works within both builds.
		watch(() => imageRef.value?.complete, () => {
			context.emit('image-load');
			isLoaded.value = true;
		});

		return {
			imageRef,
			DATA_ATTRIBUTE_ANIMATION_ROLE,
			DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_IMAGE,
			ANCHOR_TAG,
			isLoaded,
			imageCSSVars: computed(() => ({
				'--overflow': props.isOverflowVisible ? 'visible' : null,
				...props.cropCssVars,
			})),
			mobileWidthCSSVar: computed(() => (props.isInBuilder ? '100%' : mobileWidthCSSVar.value)),
			mobileHeightCSSVar: computed(() => (props.isInBuilder ? 'auto' : mobileHeightCSSVar.value)),
			smallDesktopWidthCSSVar: computed(() => (props.isInBuilder ? '100%' : smallDesktopWidthCSSVar.value)),
			smallDesktopHeightCSSVar: computed(() => (props.isInBuilder ? '100%' : smallDesktopHeightCSSVar.value)),
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.image {
	overflow: var(--overflow, hidden);
	border-radius: var(--border-radius);

	&--grid {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;

		@media screen and (min-width: $media-mobile) and (max-width: $media-desktop-editor) {
			width: v-bind(smallDesktopWidthCSSVar);
			max-width: 100%;
			height: v-bind(smallDesktopHeightCSSVar);
		}
	}

	&--unstyled {
		// Fill element with image
		display: flex;
	}

	&--link {
		transition: filter 0.2s ease;

		&:hover {
			filter: contrast(0.8);
		}
	}

	&__image {
		// <img /> size is controlled by parent element (which is controlled by grid)
		display: block;
		object-fit: cover;

		&--svg {
			object-fit: contain;
		}

		&--zoom {
			cursor: zoom-in;
		}

		// When size is not controlled by grid
		&,
		&--unstyled {
			width: 100%;
			height: 100%;
		}

		&--cropped {
			position: absolute; // absolute is needed for cropping to work properly
			top: var(--desktop-top);
			left: var(--desktop-left);
			width: var(--desktop-width);
			height: var(--desktop-height);
			transform: scale(var(--desktop-scale));
			transform-origin: 0 0;
		}
	}
}

@include site-engine-mobile {
	.image {
		&__image {
			&--cropped {
				top: var(--mobile-top);
				left: var(--mobile-left);
				width: var(--mobile-width);
				height: var(--mobile-height);
				transform: scale(var(--mobile-scale));
			}

			&--reset-m-position {
				position: static;
				width: 100%;
				height: auto;
			}
		}
	}
}

@media screen and (max-width: $media-mobile-editor) {
	.image {
		width: v-bind(mobileWidthCSSVar);
		max-width: 100%;
		height: v-bind(mobileHeightCSSVar);
	}
}
</style>
