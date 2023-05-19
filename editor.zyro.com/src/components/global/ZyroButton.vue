<template>
	<Component
		:is="tag"
		class="zyro-button"
		:class="[
			{
				[`zyro-button-${theme}`]: theme,
				[`zyro-button-${theme}--${color}`]: color,
				[`zyro-button-${theme}--${size}`]: size,
				[`zyro-button-${theme}--icon-only`]: $slots.icon,
				'zyro-button--icon-left': $slots['icon-left'],
				'zyro-button--icon-right': $slots['icon-right'],
				'disabled': isDisabled
			},
		]"
		:disabled="isDisabled"
		:style="computedStyles"
		:type="tag === 'button' ? type || 'button' : undefined"
		:to="toValue"
		:href="href"
		:title="title || defaultSlotText"
		@click="handleClick"
	>
		<slot name="icon-left" />
		<!-- icon slot is adding specific different styles from left one to the button component -->
		<slot name="icon" />
		<div
			v-if="hasSlotContent($slots.default)"
			class="zyro-button__text"
			:class="{ [textClass]: textClass }"
		>
			<slot />
		</div>

		<slot name="icon-right" />
	</Component>
</template>

<script>
import { addBreadcrumb } from '@sentry/browser';
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

export default defineComponent({
	props: {
		to: {
			type: [
				Object,
				String,
			],
			default: undefined,
		},
		type: {
			type: String,
			default: '',
		},
		href: {
			type: String,
			default: '',
		},
		theme: {
			type: String,
			validator: (value) => [
				'primary',
				'outline',
				'editor',
				'header',
				'plain',
				'danger',
				'hostinger-primary',
				'hostinger-outline',
			].includes(value),
			default: 'plain',
		},
		color: {
			type: String,
			validator: (value) => [
				'red',
				'error-red',
				'blue',
				'plump-purple',
				'black',
				'white',
			].includes(value),
			default: 'black',
		},
		size: {
			type: String,
			validator: (value) => [
				'xxs',
				'xs',
				'sm',
				'md',
				'lg',
			].includes(value),
			default: 'xs',
		},
		borderRadius: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		textClass: {
			type: String,
			default: '',
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		return {
			hasSlotContent,
		};
	},

	computed: {
		tag() {
			if (this.href) {
				return 'a';
			}

			if (this.to) {
				return 'router-link';
			}

			return 'button';
		},
		toValue() {
			if (typeof this.to === 'string') {
				return {
					name: this.to,
				};
			}

			return this.to;
		},
		computedStyles() {
			return {
				'--z-border-radius': this.borderRadius || undefined,
			};
		},
		defaultSlotText() {
			return this.$slots.default?.()?.[0]?.text?.trim();
		},
	},

	methods: {
		handleClick() {
			addBreadcrumb({
				category: 'CLICK:ZyroButton',
				data: {
					title: this.title || this.defaultSlotText,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
// TODO: https://github.com/zyro-inc/zyro/issues/1066

$button-xs-font-size: 10px;
$button-sm-font-size: 12px;
$button-md-font-size: 14px;
$button-xxs-padding-h: 24px;
$button-xs-padding-h: 32px;
$button-sm-padding-h: 40px;
$button-md-padding-h: 48px;
$button-lg-padding-h: 56px;
$button-xxs-height: 24px;
$button-xs-height: 36px;
$button-sm-height: 48px;
$button-md-height: 56px;
$button-lg-height: 64px;
$button-shadow: 0 6px 14px rgb(0 0 0 / 10%);

@mixin font-styles($type: "caps") {
	@if $type == "caps" {
		font-weight: 500;
		line-height: 1.6em;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	} @else {
		line-height: 1.2em;
	}
}

// --- Common for all themes ----------------------------------------------------------------
.zyro-button {
	/* Do not set following props in here, set them in themes:
		- font-size, font-weight, line-height, text-transform, letter-spacing
		- border-width, border-color, padding, height, width */
	$this: &;

	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-family: inherit;
	text-decoration: none;
	cursor: pointer;
	border: 0 solid transparent;
	border-radius: var(--z-border-radius, 100px);
	transition: all 0.2s $transition-timing-easing-standard;

	:deep(svg) {
		flex-shrink: 0;
		transition: inherit;
		transition-property: fill;
	}

	// Space between text and icon
	&__text {
		display: flex; // for logo
		align-items: center;
		margin: 0 8px;
		white-space: nowrap;

		&:first-child {
			margin-left: 0;
		}

		&:last-child {
			margin-right: 0;
		}
	}

	&--icon-right {
		justify-content: right;
		text-align: right;
	}

	&--icon-left {
		justify-content: left;
		text-align: left;
	}

	&:disabled,
	&.disabled {
		pointer-events: none;
		cursor: default;
	}
}

// --- Theme: Primary & Outline -------------------------------------------------------------
.zyro-button-primary,
.zyro-button-outline {
	$this: &;

	@include font-styles("caps");

	transition-property:
		border-color,
		background-color,
		color;

	// --- Sizes ---

	// Keeps button size consistent while changing border width
	@mixin set-padding-minus-border($border-width, $padding-vertical, $padding-horizontal) {
		padding: ($padding-vertical - $border-width) ($padding-horizontal - $border-width);
		border-width: $border-width $border-width;
	}

	// Sets paddings, handles border widths.
	// Holds logic for which button type and on what states should have borders
	@mixin set-padding-and-border($selector, $vertical, $horizontal) {
		@include set-padding-minus-border(3px, $vertical, $horizontal);

		&.zyro-button-outline {
			@include set-padding-minus-border(1px, $vertical, $horizontal);
		}

		&:focus,
		&.focus {
			&.zyro-button-outline {
				@include set-padding-minus-border(3px, $vertical, $horizontal);
			}

			// Removes border on ripple effect
			&:hover,
			&.hover {
				@include set-padding-minus-border(0, $vertical, $horizontal);
			}
		}
	}

	&--xxs {
		@include set-padding-and-border($this, ($button-xs-font-size * 0.5), $button-xxs-padding-h);

		min-width: $button-xxs-height;
		min-height: $button-xxs-height;
		font-size: $button-xs-font-size;
	}

	&--xs {
		@include set-padding-and-border($this, ($button-xs-font-size * 0.5), $button-xs-padding-h);

		min-width: $button-xs-height;
		min-height: $button-xs-height;
		font-size: $button-xs-font-size;
	}

	&--sm {
		@include set-padding-and-border($this, ($button-sm-font-size * 0.5), $button-sm-padding-h);

		min-width: $button-sm-height;
		min-height: $button-sm-height;
		font-size: $button-sm-font-size;
	}

	&--md {
		@include set-padding-and-border($this, ($button-md-font-size * 0.5), $button-md-padding-h);

		min-width: $button-md-height;
		min-height: $button-md-height;
		font-size: $button-md-font-size;
	}

	&--lg {
		@include set-padding-and-border($this, ($button-md-font-size * 0.5), $button-lg-padding-h);

		min-width: $button-lg-height;
		min-height: $button-lg-height;
		font-size: $button-md-font-size;
	}

	&--icon-only {
		padding: 0 !important; // override all modifiers and states
	}

	// --- Colors ---

	// Takes 2 colors as arguments and sets one or another depending on $inverse
	// Helps generate all color options.
	@mixin set-text-color($inverse, $color: $color-light, $color-inverse: $color-dark) {
		@if $inverse {
			color: $color-inverse;
		} @else {
			color: $color;
		}
	}

	// Colors: text, bg, border, hover, focus, active
	@mixin set-colors($selector, $bg, $bg-hover, $border-focus, $inverse: false) {
		@include set-text-color($inverse);

		background-color: $bg;
		border-color: $bg;

		&.zyro-button-outline {
			@include set-text-color(false, $bg);

			background-color: transparent;
		}

		// States
		&:focus,
		&.focus {
			@include set-text-color($inverse);

			background-color: $bg; // repeats for outline
			border-color: $border-focus;
			box-shadow: none;
		}

		&:hover,
		&.hover {
			@include set-text-color($inverse);

			background-color: $bg-hover;
			border-color: $bg-hover;

			&.zyro-button-outline {
				background-color: $bg;
				border-color: $bg;
			}
		}

		&:active,
		&.active {
			@include set-text-color($inverse);

			background-color: $bg; // repeats for outline
		}
	}

	&--red {
		@include set-colors(
			$this,
			$color-primary,
			$color-primary-dark,
			$color-primary-light
		);
	}

	&--blue {
		@include set-colors(
			$this,
			$color-azure,
			$color-azure-dark,
			$color-azure-light,
		);
	}

	&--plump-purple {
		@include set-colors(
			$this,
			$color-primary,
			$color-primary-dark,
			$color-primary-light
		);
	}

	&--black {
		@include set-colors($this, $color-dark, $color-dark, $color-dark);
	}

	&--white {
		@include set-colors(
			$this,
			$color-light,
			$color-light,
			$color-light,
			true
		);
	}

	&:disabled,
	&.disabled {
		color: $color-dark;
		background-color: $color-gray;
		border-color: $color-gray;
	}

	&--warning {
		@include set-colors(
			$this,
			$color-danger,
			$color-danger-dark,
			$color-primary-light,
		);
	}
}

// --- Theme: Plain -------------------------------------------------------------------------
.zyro-button-plain {
	$this: &;
	$border-width: 2px;

	min-width: $button-xs-height;
	min-height: $button-xs-height;
	padding: (($button-xs-font-size - $border-width) * 0.5) 1px;
	font-size: $button-xs-font-size;
	background-color: transparent;
	border-width: 2px 0;
	border-radius: 0;
	transition-property: color;

	@include font-styles("caps");

	&--icon-only {
		padding: 0;
		border-width: 2px;
		border-radius: var(--z-border-radius, 100px);
	}

	// --- Colors ---
	@mixin set-state-colors($color, $color-focus) {
		&:focus,
		&.focus,
		&:hover,
		&.hover {
			color: $color;
		}

		&:focus,
		&.focus {
			border-bottom-color: $color-focus;

			&#{$this}--icon-only {
				border-color: $color-focus;
			}
		}
	}

	&--black {
		color: $color-dark;

		@include set-state-colors($color-azure, $color-azure);
	}

	&--red {
		color: $color-primary;

		@include set-state-colors($color-primary, $color-primary-light);
	}

	&--error-red {
		color: $color-danger;

		@include set-state-colors($color-danger-dark, $color-primary-light);
	}

	&:disabled,
	&.disabled {
		color: $color-gray-border;
	}
}

// --- Theme: Editor ------------------------------------------------------------------------
.zyro-button-editor {
	$this: &;
	$border-width: 2px;

	min-width: $button-xs-height;
	min-height: $button-xs-height;
	padding: (($button-md-font-size * 0.5 ) - $border-width) (16px - $border-width);

	@include font-styles("regular");

	font-size: $button-md-font-size;
	color: $color-dark;
	background-color: $color-light;
	border-color: $color-light;
	border-width: $border-width;
	box-shadow: $button-shadow;
	transition-property:
		border-color,
		box-shadow,
		color;

	&--icon-only {
		padding: 0;
	}

	&:hover,
	&.hover {
		color: $color-azure;
	}

	&:focus,
	&.focus {
		color: $color-azure;
		border-color: $color-azure;
	}

	&:disabled,
	&.disabled {
		color: $color-gray-border;
	}
}

// --- Theme: Header ------------------------------------------------------------------------
.zyro-button-header {
	$border-width: 2px;
	$header-bottom-border-width: 1px;

	height: 100%;
	min-height: #{$header-height-editor - $header-bottom-border-width};
	padding: (($button-md-font-size - $border-width) * 0.5) 16px;
	font-size: $button-md-font-size;
	font-weight: 700;
	border-radius: 0;
	transition-property:
		border-color,
		color;

	@include font-styles("regular");

	// Reduce size for tablet
	@media screen and (max-width: $media-mobile) {
		min-width: 40px;
		padding-right: 14px;
		padding-left: 14px;
	}

	// --- Colors ---
	&--white {
		color: $color-gray;
		background-color: transparent;
		border-width: 2px 0;

		&:focus,
		&.focus {
			color: $color-primary-dark;
			border-bottom-color: $color-primary;
		}

		&:hover,
		&.hover {
			color: $color-primary-dark;
		}

		&:disabled,
		&.disabled {
			color: $color-gray-border;
			background-color: $color-light;
		}
	}

	&--black {
		padding-right: 40px;
		padding-left: 40px;
		color: $color-light;
		background-color: $color-dark;
		border-width: 2px 0;

		&:focus,
		&.focus {
			color: $color-primary;
			border-bottom-color: $color-primary;
		}

		&:hover,
		&.hover {
			color: $color-primary;
		}

		&:disabled,
		&.disabled {
			color: $color-gray-border;
			background-color: $color-light;
		}
	}

	// Specific to publish
	&--red,
	&--error-red {
		padding-right: 30px;
		padding-left: 30px;
		border-width: 2px;

		// Reduce size for tablet
		@media screen and (max-width: $media-mobile) {
			padding-right: 20px;
			padding-left: 20px;
		}
	}

	&--red {
		color: $color-light;
		background-color: $color-primary;
		transition: 0.3s ease background-color;

		&:focus,
		&.focus {
			color: $color-light;
			background-color: $color-primary-dark;
			border-color: $color-primary-dark;
		}

		&:hover,
		&.hover {
			color: $color-light;
			background-color: $color-primary-dark;
			border-color: $color-primary-dark;
		}

		&:disabled,
		&.disabled {
			color: $color-gray-border;
			background-color: $color-azure;
			border-color: $color-azure;
		}
	}

	&--error-red {
		color: $color-light;
		background-color: $color-primary;
	}
}

// --- Theme: Hostinger primary ------------------------------------------------------------------------
.zyro-button-hostinger-primary {
	$border-width: 0;
	$header-bottom-border-width: 1px;

	height: 100%;
	min-height: 40px;
	padding: (($button-md-font-size - $border-width) * 0.5) 16px;
	padding-right: 24px;
	padding-left: 24px;
	font-size: $button-md-font-size;
	font-weight: 700;
	color: $color-light;
	background-color: $color-primary;
	border: none;
	border-radius: 4px;

	@include font-styles("regular");

	// Reduce size for tablet
	@media screen and (max-width: $media-mobile) {
		min-width: 40px;
		padding-right: 14px;
		padding-left: 14px;
	}

	&:disabled,
	&.disabled {
		background-color: $color-gray;
	}
}

// --- Theme: Hostinger outline ------------------------------------------------------------------------
.zyro-button-hostinger-outline {
	$border-width: 0;
	$header-bottom-border-width: 1px;

	height: 100%;
	min-height: 40px;
	padding: (($button-md-font-size - $border-width) * 0.5) 16px;
	padding-right: 24px;
	padding-left: 24px;
	font-size: $button-md-font-size;
	font-weight: 700;
	color: $color-primary;
	background-color: transparent;
	border: 1px solid $color-gray-border;
	border-radius: 4px;

	@include font-styles("regular");

	// Reduce size for tablet
	@media screen and (max-width: $media-mobile) {
		min-width: 40px;
		padding-right: 14px;
		padding-left: 14px;
	}

	&:disabled,
	&.disabled {
		color: $color-gray;
	}
}
</style>
