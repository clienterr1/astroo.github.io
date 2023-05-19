<!-- eslint-disable max-len -->
<template>
	<div
		class="product-list-empty-state"
		:style="computedStyles"
	>
		<svg
			class="product-list-empty-state__icon"
			width="41"
			height="40"
			viewBox="0 0 41 40"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M10.5 3.33334L5.5 10V33.3333C5.5 34.2174 5.85119 35.0652 6.47631 35.6904C7.10143 36.3155 7.94928 36.6667 8.83333 36.6667H32.1667C33.0507 36.6667 33.8986 36.3155 34.5237 35.6904C35.1488 35.0652 35.5 34.2174 35.5 33.3333V10L30.5 3.33334H10.5Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M5.5 10H35.5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M27.1663 16.6667C27.1663 18.4348 26.464 20.1305 25.2137 21.3807C23.9635 22.631 22.2678 23.3334 20.4997 23.3334C18.7316 23.3334 17.0359 22.631 15.7856 21.3807C14.5354 20.1305 13.833 18.4348 13.833 16.6667"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<h6>{{ emptyPageMessage }}</h6>
	</div>
</template>

<script>
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';

import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		textColorVars: {
			type: Object,
			default: () => ({}),
		},
		emptyPageMessage: {
			type: String,
			required: true,
		},
	},

	computed: {
		computedStyles() {
			return {
				...objectToCssVariables(this.textColorVars),
			};
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/font-style";
@include font-style("h6", "h6", ".product-list-empty-state");

.product-list-empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	max-width: 200px;
	min-height: 400px;
	text-align: center;

	&__icon {
		margin-bottom: 16px;
		color: var(--h6-color);
	}
}
</style>
