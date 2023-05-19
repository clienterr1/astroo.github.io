<template>
	<div class="preview">
		<GridTextBox>
			<Component
				:is="element"
				:class="previewClass"
			>
				<slot>Preview</slot>
			</Component>
		</GridTextBox>
	</div>
</template>

<script>
import GridTextBox from '@zyro-inc/site-modules/components/elements/text-box/GridTextBox.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		GridTextBox,
	},

	props: {
		element: {
			type: String,
			default: null,
		},
		previewClass: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
@import "@zyro-inc/site-modules/scss/mixins/font-style";
@include font-style("nav-link", ".nav-link", ".text-box");

</style>
