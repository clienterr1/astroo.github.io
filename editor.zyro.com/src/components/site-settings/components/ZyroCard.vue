<template>
	<Component
		:is="tag"
		class="card"
	>
		<slot />
	</Component>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		tag: {
			type: String,
			default: 'div',
		},
	},
});
</script>

<style lang="scss" scoped>
.card {
	padding: 24px 32px;
	margin-bottom: 16px;
	overflow: hidden;
	background: $color-light;

	@media screen and (max-width: $media-mobile) {
		padding: 16px;
		margin-bottom: 8px;
	}
}

</style>
