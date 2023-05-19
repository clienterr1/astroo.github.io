<template>
	<a
		class="block-header-logo"
		:href="href"
		:style="computedCSSVars"
	>
		<div
			v-if="logoSvg"
			class="block-header-logo__image"
			v-html="logoSvg"
		/>
		<img
			v-else
			v-qa="'builder-siteheader-img-logo'"
			class="block-header-logo__image"
			:src="logoSrc"
			:alt="logoAltTag"
		>
	</a>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockHeaderLogo',

	props: {
		logoSrc: {
			type: String,
			default: null,
		},
		logoSvg: {
			type: String,
			default: null,
		},
		href: {
			type: String,
			default: '/',
		},
		// CSS Properties
		height: {
			type: String,
			default: null,
		},
		heightMobile: {
			type: String,
			default: null,
		},
		maxWidth: {
			type: String,
			default: null,
		},
		maxWidthMobile: {
			type: String,
			default: null,
		},
		objectPosition: {
			type: String,
			default: null,
		},
		objectPositionMobile: {
			type: String,
			default: null,
		},
		// Optimising logo is an expensive operation when doing reactive actions, so a flag is present to control it
		isOptimized: {
			type: Boolean,
			default: false,
		},
		siteName: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			optimizedHeight: null,
			optimizedHeightMobile: null,
		};
	},

	computed: {
		logoAltTag() {
			return this.siteName ? `${this.siteName} logo` : null;
		},
		computedCSSVars() {
			return {
				'--height': this.isOptimized && this.height ? `${this.height}px` : null,
				'--m-height': this.isOptimized && this.heightMobile ? `${this.heightMobile}px` : null,
				'--width': this.maxWidth,
				'--m-width': this.maxWidthMobile,
				'--object-position': this.objectPosition,
				'--m-object-position': this.objectPositionMobile,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.block-header-logo {
	width: 100%;
	max-width: var(--width);
	height: var(--height, auto);
	cursor: pointer;

	&__image {
		width: 100%;
		height: 100%;
		vertical-align: middle;
		object-fit: contain;
		object-position: var(--object-position);
	}
}

@include site-engine-mobile {
	.block-header-logo {
		max-width: var(--m-width, var(--width));
		height: var(--m-height, auto);

		&__image {
			object-position: var(--m-object-position);
		}
	}
}
</style>
