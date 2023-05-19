<template>
	<Component
		:is="tagName"
		:type="buttonType"
		:name="buttonType"
		:href="href"
		:disabled="isDisabled"
		:target="target"
		:rel="rel"
		class="grid-button"
		:class="computedClass"
		:aria-hidden="isLoading"
		:style="buttonCSSVars"
		@click="$emit('click', $event)"
		@drag="$emit('drag', $event)"
		@dragstart="$emit('dragstart', $event)"
	>
		{{ content }}
	</Component>
</template>

<script>

import {
	defineComponent,
	computed,
} from 'vue';

import { MOBILE_BLOCK_WIDTH } from '@zyro-inc/site-modules/components/blocks/layout/constants';

export default defineComponent({
	name: 'GridButton',

	props: {
		tagName: {
			type: String,
			default: 'a',
		},
		href: {
			type: String,
			default: null,
		},
		target: {
			type: String,
			default: null,
		},
		rel: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			default: 'primary',
		},
		buttonType: {
			type: String,
			default: null,
		},
		content: {
			type: String,
			default: '',
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		fontSizeMobile: {
			type: Number,
			default: null,
		},
		fontSizeDesktop: {
			type: Number,
			default: null,
		},
		fontFamily: {
			type: String,
			default: null,
		},
		fontWeight: {
			type: Number,
			default: null,
		},
		borderWidth: {
			type: Number,
			default: null,
		},
		borderRadius: {
			type: Number,
			default: null,
		},
		backgroundColor: {
			type: String,
			default: null,
		},
		fontColor: {
			type: String,
			default: null,
		},
		borderColor: {
			type: String,
			default: null,
		},
		backgroundColorHover: {
			type: String,
			default: null,
		},
		fontColorHover: {
			type: String,
			default: null,
		},
		borderColorHover: {
			type: String,
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
		isInBuilder: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'click',
		'drag',
		'dragstart',
	],

	setup(props) {
		const mobileWidthCSSVar = computed(() => `${(props.mobileElementWidth * 100) / MOBILE_BLOCK_WIDTH}vw`);
		const mobileHeightCSSVar = computed(() => `${(props.mobileElementHeight * 100) / MOBILE_BLOCK_WIDTH}vw`);

		const buttonCSSVars = computed(() => ({
			'--font-size-mobile': props.fontSizeMobile ? `${props.fontSizeMobile}px` : null,
			'--font-size-desktop': props.fontSizeDesktop ? `${props.fontSizeDesktop}px` : null,
			'--font-family': props.fontFamily,
			'--font-weight': props.fontWeight,
			'--border-radius': props.borderRadius === 0 || props.borderRadius ? `${props.borderRadius}px` : null,
			'--border-width': props.borderWidth === 0 || props.borderWidth ? `${props.borderWidth}px` : '0px',
			'--background-color': props.backgroundColor,
			'--font-color': props.fontColor,
			'--border-color': props.borderColor || 'rgb(26, 26, 26)',
			'--background-color-hover': props.backgroundColorHover,
			'--font-color-hover': props.fontColorHover,
			'--border-color-hover': props.borderColorHover,
			'--m-height': (props.isInBuilder ? '100%' : mobileHeightCSSVar.value),
			'--m-width': (props.isInBuilder ? '100%' : mobileWidthCSSVar.value),
		}));

		const computedClass = computed(() => ({
			'grid-button--empty': !props.content,
			[`grid-button--${props.type}`]: props.type,
			loading: props.isLoading,
		}));

		return {
			buttonCSSVars,
			computedClass,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/mixins/transitions/loading-animation";

@mixin button-style($button-type, $isMobile: false) {
	$states: "hover";
	$prefix: "grid-button-#{$button-type}";

	// z-index is needed in layout templates to make cursor:pointer and hover state to work
	z-index: 1;
	display: flex;
	align-items: center;
	max-width: 100%;
	height: min-content;
	min-height: var(--#{$prefix}-min-height);
	padding:
		calc(var(--#{$prefix}-padding-y) - var(--border-width))
		calc(var(--#{$prefix}-padding-x) - var(--border-width));
	overflow: hidden;
	font-family: var(--font-family, var(--#{$prefix}-font-family));
	font-size: var(--font-size-desktop, var(--#{$prefix}-font-size));
	font-style: var(--#{$prefix}-font-style);
	font-weight: var(--font-weight, var(--#{$prefix}-font-weight));
	line-height: var(--#{$prefix}-line-height);
	color: var(--font-color, var(--#{$prefix}-color));
	text-align: center;
	text-decoration: var(--#{$prefix}-text-decoration);
	text-overflow: ellipsis;
	text-transform: var(--#{$prefix}-text-transform);
	letter-spacing: var(--#{$prefix}-letter-spacing);
	white-space: nowrap;
	cursor: pointer;
	background-color: var(--background-color, var(--#{$prefix}-background-color-null, var(--#{$prefix}-background-color)));
	border: var(--border-width) solid var(--border-color, var(--#{$prefix}-border-color));
	border-radius: var(--border-radius, var(--#{$prefix}-border-radius));
	box-shadow:
		var(
			--#{$prefix}-box-shadow-null,
			var(--#{$prefix}-box-shadow-x)
			var(--#{$prefix}-box-shadow-y)
			var(--#{$prefix}-box-shadow-blur)
			var(--#{$prefix}-box-shadow-spread)
			var(--#{$prefix}-box-shadow-color)
		);
	transition:
		color var(--#{$prefix}-transition-duration) var(--#{$prefix}-transition-timing-function),
		border-color var(--#{$prefix}-transition-duration) var(--#{$prefix}-transition-timing-function),
		background-color var(--#{$prefix}-transition-duration) var(--#{$prefix}-transition-timing-function);

	@each $state in $states {
		&:#{$state} {
			color: var(--font-color-hover, var(--#{$prefix}-color-#{$state}));
			background-color:
				var(
					--background-color-hover,
					var(
						--#{$prefix}-background-color-null-#{$state},
						var(--#{$prefix}-background-color-#{$state})
					)
				);
			border: var(--border-width) solid var(--border-color-hover, var(--#{$prefix}-border-color-#{$state}));
			box-shadow:
				var(
					--#{$prefix}-box-shadow-null-#{$state},
					var(--#{$prefix}-box-shadow-x-#{$state})
					var(--#{$prefix}-box-shadow-y-#{$state})
					var(--#{$prefix}-box-shadow-blur-#{$state})
					var(--#{$prefix}-box-shadow-spread-#{$state})
					var(--#{$prefix}-box-shadow-color-#{$state})
				);
		}
	}

	@if $isMobile {
		padding:
			calc(
				var(--#{$prefix}-m-padding-y, var(--#{$prefix}-padding-y)) - var(--border-width)
			)
			calc(
				var(--#{$prefix}-m-padding-x, var(--#{$prefix}-padding-x)) - var(--border-width)
			);
		font-size: var(--font-size-mobile, var(--#{$prefix}-m-font-size, var(--#{$prefix}-font-size)));
		border-radius: var(--border-radius, var(--#{$prefix}-m-border-radius, var(--#{$prefix}-border-radius)));
	}

	&:disabled {
		cursor: unset;
		opacity: 0.4;
	}

	@include loading-animation;
}

@mixin button-mobile($name) {
	.grid-button-#{$name}-mobile {
		@include button-style($name, $isMobile: true);
	}

	@include site-engine-mobile {
		.grid-button--#{$name} {
			@include button-style($name, $isMobile: true);
		}
	}
}

.grid-button {
	&--primary {
		@include button-style("primary");
	}

	&--secondary {
		@include button-style("secondary");
	}
}

@include button-mobile("primary");
@include button-mobile("secondary");

// '/00A0;' is non breaking space html entity code, does not work as a constant or v-text,
// it's used to prevent button from collapsing when it has no content
// v-text adds whitespace around content and makes safari clip text

.grid-button--empty {
	&::after {
		content: "\00A0";
	}
}
</style>
