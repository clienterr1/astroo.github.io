<!-- Astro support/bug - setting v-html on parent does not work -->
<template>
	<div
		v-if="content"
		class="text-box"
		:style="textBoxStyles"
		v-html="content"
	/>
	<div
		v-else
		class="text-box"
		:style="textBoxStyles"
	>
		<slot />
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		isWhiteSpaceNormal: {
			type: Boolean,
			default: false,
		},
		backgroundColor: {
			type: String,
			default: null,
		},
		content: {
			type: String,
			default: null,
		},
	},

	computed: {
		textBoxStyles() {
			return {
				'--whiteSpace': this.isWhiteSpaceNormal ? 'normal' : null,
				'--backgroundColor': this.backgroundColor,
			};
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/mixins/font-style";

@mixin font-spacing($element, $margin-bottom) {
	#{$element} {
		margin-bottom: $margin-bottom;

		&:last-child {
			margin-bottom: 0;
		}
	}
}

@include font-style("h1", "h1", ".text-box");
@include font-style("h2", "h2", ".text-box");
@include font-style("h3", "h3", ".text-box");
@include font-style("h4", "h4", ".text-box");
@include font-style("h5", "h5", ".text-box");
@include font-style("h6", "h6", ".text-box");
@include font-style("body-large", ".body-large", ".text-box");
@include font-style("body", ".body", ".text-box");
@include font-style("body-small", ".body-small", ".text-box");
@include font-style("button", ".button", ".text-box");
@include font-style("link", ".link", ".text-box");

.text-box {
	width: 100%;
	padding: 0;
	margin: 0;
	overflow-wrap: break-word;
	white-space: var(--whiteSpace, break-spaces);
	background-color: var(--backgroundColor);
	outline: none;

	& .ProseMirror {
		white-space: var(--whiteSpace, break-spaces);
	}

	// Font spacing
	@include font-spacing("h1", 48px);
	@include font-spacing("h2, h3, h4, .body-large, .body", 32px);
	@include font-spacing("h5", 16px);
	@include font-spacing("h6", 8px);
	@include font-spacing(".body-small", 24px);

	h1 {
		font-size: var(--fontSizeDesktop, var(--h1-font-size));
		line-height: var(--lineHeightDesktop, var(--h1-line-height));
	}

	h2 {
		font-size: var(--fontSizeDesktop, var(--h2-font-size));
		line-height: var(--lineHeightDesktop, var(--h2-line-height));
	}

	h3 {
		font-size: var(--fontSizeDesktop, var(--h3-font-size));
		line-height: var(--lineHeightDesktop, var(--h3-line-height));
	}

	h4 {
		font-size: var(--fontSizeDesktop, var(--h4-font-size));
		line-height: var(--lineHeightDesktop, var(--h4-line-height));
	}

	h5 {
		font-size: var(--fontSizeDesktop, var(--h5-font-size));
		line-height: var(--lineHeightDesktop, var(--h5-line-height));
	}

	h6 {
		font-size: var(--fontSizeDesktop, var(--h6-font-size));
		line-height: var(--lineHeightDesktop, var(--h6-line-height));
	}

	.body-large {
		font-size: var(--fontSizeDesktop, var(--body-large-font-size));
		line-height: var(--lineHeightDesktop, var(--body-large-line-height));
	}

	.body {
		font-size: var(--fontSizeDesktop, var(--body-font-size));
		line-height: var(--lineHeightDesktop, var(--body-line-height));
	}

	.body-small {
		font-size: var(--fontSizeDesktop, var(--body-small-font-size));
		line-height: var(--lineHeightDesktop, var(--body-small-line-height));
	}

	span {
		font-size: var(--fontSizeDesktop);
	}

	ol,
	ul {
		padding-left: 40px;
	}

	/**
		* ProseMirror removes <br> tags inside empty paragraphs
		as they are only used as a new line placeholder,
		* but it is intuitive to use as a spacer between text.
		So, we convert all empty p tags to have CSS line-break
		* so that text box would look the same in preview as it does in editor
		*/
	> p:empty::after {
		content: "\00A0";
	}
}

@include site-engine-mobile {
	.text-box {
		// Font spacing
		@include font-spacing("h1", 48px);
		@include font-spacing("h2, h3, h4, .body-large, .body", 32px);
		@include font-spacing("h5", 16px);
		@include font-spacing("h6", 8px);
		@include font-spacing(".body-small", 24px);

		h1 {
			font-size: var(--fontSizeMobile, var(--h1-m-font-size));
			line-height: var(--lineHeightMobile, var(--h1-line-height));
		}

		h2 {
			font-size: var(--fontSizeMobile, var(--h2-m-font-size));
			line-height: var(--lineHeightMobile, var(--h2-line-height));
		}

		h3 {
			font-size: var(--fontSizeMobile, var(--h3-m-font-size));
			line-height: var(--lineHeightMobile, var(--h3-line-height));
		}

		h4 {
			font-size: var(--fontSizeMobile, var(--h4-m-font-size));
			line-height: var(--lineHeightMobile, var(--h4-line-height));
		}

		h5 {
			font-size: var(--fontSizeMobile, var(--h5-m-font-size));
			line-height: var(--lineHeightMobile, var(--h5-line-height));
		}

		h6 {
			font-size: var(--fontSizeMobile, var(--h6-font-size));
			line-height: var(--lineHeightMobile, var(--h6-line-height));
		}

		.body-large {
			font-size: var(--fontSizeMobile, var(--body-large-m-font-size));
			line-height: var(--lineHeightMobile, var(--body-large-line-height));
		}

		.body {
			font-size: var(--fontSizeMobile, var(--body-m-font-size));
			line-height: var(--lineHeightMobile, var(--body-line-height));
		}

		.body-small {
			font-size: var(--fontSizeMobile, var(--body-small-m-font-size));
			line-height: var(--lineHeightMobile, var(--body-small-line-height));
		}

		span {
			font-size: var(--fontSizeMobile);
		}
	}
}
</style>
