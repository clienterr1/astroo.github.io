<template>
	<div
		:style="computedStyles"
		class="notification"
		:class="`notification--${mode}-${type}`"
	>
		<ZyroSvgDeprecated
			:name="icon"
			class="notification__icon"
		/>
		<div class="notification__wrapper">
			<p class="notification__message z-body-small">
				{{ message }}
			</p>
			<slot />
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		type: {
			type: String,
			validator(value) {
				return [
					'error',
					'success',
					'warning',
					'info',
				].includes(value);
			},
			default: 'success',
		},
		message: {
			type: String,
			default: '',
		},
		mode: {
			type: String,
			validator(value) {
				return [
					'light',
					'dark',
				].includes(value);
			},
			default: 'light',
		},
		icon: {
			type: String,
			default: 'info-circle',
		},
		padding: {
			type: String,
			default: '18px',
		},
	},

	computed: {
		computedStyles() {
			return {
				'--notification-padding': this.padding,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.notification {
	display: flex;
	padding: var(--notification-padding);
	margin-top: 32px;
	margin-bottom: 24px;
	border-radius: 8px;

	&:first-child {
		margin-top: 0;
	}

	@media screen and (max-width: $media-mobile) {
		margin-bottom: 16px;
	}

	$styles: "light" "error" $color-primary,
		"light" "success" $color-success,
		"light" "warning" $color-dark $color-warning-light 1 $color-warning-dark,
		"light" "info" $color-azure,
		"dark" "error" $color-light $color-primary,
		"dark" "success" $color-light $color-success,
		"dark" "warning" $color-light $color-warning-dark,
		"dark" "info" $color-light $color-azure;

	@each $mode, $type, $color, $background, $opacity, $icon-color in $styles {
		&--#{$mode}-#{$type} {
			color: $color;
			background: rgba($color, 0.1);

			@if $background {
				background: rgba($background, 0.6);
			}

			@if $opacity {
				background: rgba($background, $opacity);
			}

			svg {
				color: $color;
			}

			@if $icon-color {
				svg {
					color: $icon-color;
				}
			}
		}
	}

	&__wrapper {
		display: flex;
		align-items: center;
		text-align: left;
	}

	&__message {
		margin-bottom: 0;
	}

	&__icon {
		min-width: 20px;
		min-height: 20px;
		margin-right: 8px;
	}
}

</style>
