<template>
	<div
		v-if="isLoading || showSuccessMessage || isError"
		class="submit-message"
		:style="submitElementCSSVars"
		:class="`submit-message--${theme}`"
	>
		<ZyroLoader
			v-if="isLoading"
			color="var(--grid-button-primary-background-color)"
		/>
		<div
			v-else-if="showSuccessMessage && !isError"
			class="success-message__heading"
		>
			{{ successMessage }}
		</div>
		<div v-if="isError && !isLoading">
			<div class="submit-message__heading">
				Something went wrong
			</div>
			<div>
				Please try again later
			</div>
		</div>
	</div>
</template>

<script>
import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import {
	THEMES,
	THEME_LIGHT,
} from '@zyro-inc/site-modules/components/elements/form/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLoader,
	},

	props: {
		successMessage: {
			type: String,
			default: '',
		},
		isError: {
			type: Boolean,
			default: false,
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		showSuccessMessage: {
			type: Boolean,
			default: false,
		},
		theme: {
			type: String,
			validator: (theme) => THEMES.includes(theme),
			default: THEME_LIGHT,
		},
		hasBorderWidth: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		submitElementCSSVars() {
			return {
				'--submit-element-border': this.hasBorderWidth ? '' : 'var(--color-gray)',
			};
		},
	},
});
</script>

<style lang="scss" scoped>
/* stylelint-disable custom-property-pattern */
.submit-message {
	position: absolute;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	place-content: center;
	place-items: center;
	width: 100%;
	height: 100%;
	padding: 24px;
	text-align: center;
	border: 1px solid var(--submit-element-border);

	&--dark {
		color: $color-light;
	}

	&__heading {
		margin-bottom: var(--formSpacing);
	}
}
</style>
