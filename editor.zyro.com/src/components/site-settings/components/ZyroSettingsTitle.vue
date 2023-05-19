<template>
	<div class="title">
		<Component
			:is="tag"
			class="z-h4"
		>
			<slot />
		</Component>
	</div>
</template>
<script>

import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		tag: {
			type: String,
			default: 'h1',
		},
	},
});
</script>

<style lang="scss" scoped>
.title {
	padding-bottom: 10px;
	margin: 0 0 56px;
	border-bottom: 1px solid $color-gray;

	@media screen and (max-width: $media-mobile) {
		padding-bottom: 0;
		margin: 0 0 24px;
	}
}
</style>
