<template>
	<div
		:class="`pill ${textClass} ${theme ? `pill--${theme}` : ''}`"
		:style="computedStyles"
	>
		<div
			class="pill__text"
			:class="{ 'pill__text--uppercase': textToUppercase }"
		>
			<slot />
			{{ text ?? $t('common.premium') }}
		</div>
		<div
			v-if="subtext"
			class="pill__subtext"
		>
			{{ subtext }}
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export const PILL_THEME_SUCCESS = 'success';
export const PILL_THEME_WARNING = 'warning';
export const PILL_THEME_DANGER = 'danger';
export const PILL_THEME_SECONDARY = 'secondary';

const PILL_THEMES = [
	PILL_THEME_SUCCESS,
	PILL_THEME_WARNING,
	PILL_THEME_DANGER,
	PILL_THEME_SECONDARY,
];

export default defineComponent({
	props: {
		text: {
			type: String,
			default: null,
		},
		subtext: {
			type: String,
			default: '',
		},
		textToUppercase: {
			type: Boolean,
			default: true,
		},
		textClass: {
			type: String,
			default: 'z-button-small',
		},
		textColor: {
			type: String,
			default: 'var(--color-primary)',
		},
		backgroundColor: {
			type: String,
			default: 'var(--secondary-light)',
		},
		verticalPadding: {
			type: String,
			default: '4px',
		},
		theme: {
			type: String,
			default: null,
			validator: (theme) => PILL_THEMES.includes(theme),
		},
	},

	computed: {
		computedStyles() {
			return {
				'--text-color': this.textColor,
				'--background-color': this.backgroundColor,
				'--vertical-padding': this.verticalPadding,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.pill {
	display: flex;
	justify-content: space-between;
	padding: var(--vertical-padding) 8px;
	margin-right: 8px;
	color: var(--text-color);
	text-align: center;
	text-transform: none;
	background: var(--background-color);
	border-radius: 100px;

	$this: &;

	&__text {
		&--uppercase {
			text-transform: uppercase;
		}
	}

	&__subtext {
		margin-left: 3px;
	}

	&--success {
		background: $color-success-dark;

		#{$this}__text {
			color: $color-light;
		}
	}

	&--warning {
		background: $color-warning-dark;

		#{$this}__text {
			color: $color-light;
		}
	}

	&--danger {
		background: $color-danger-dark;

		#{$this}__text {
			color: $color-light;
		}
	}

	&--secondary {
		background: $color-primary;

		#{$this}__text {
			color: $color-light;
		}
	}
}
</style>
