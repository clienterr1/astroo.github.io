<template>
	<div
		class="ecommerce-product-ribbon"
		:style="computedStyles"
	>
		<p class="ecommerce-product-ribbon__text">
			{{ text }}
		</p>
	</div>
</template>

<script>
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';

export default {
	props: {
		text: {
			type: String,
			default: '',
		},
		ribbonStyle: {
			type: String,
			default: '',
		},
	},

	computed: {
		computedStyles() {
			return {
				...objectToCssVariables(this.ribbonStyle),
			};
		},
	},
};
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/font-style";
@include font-style("body-small", ".ecommerce-product-ribbon");

$margin: 8px;

.ecommerce-product-ribbon {
	position: absolute;
	z-index: 1;
	display: flex;
	max-height: calc(100% - ($margin * 2));
	padding: 6px 12px;
	margin: $margin $margin $margin 0;
	text-align: left;
	background-color: var(--ribbon-background-color, $color-dark);

	&__text {
		overflow: hidden;
		color: var(--ribbon-color, $color-light);
		word-break: break-word;
	}
}
</style>
