<template>
	<div
		class="item"
		:class="{ 'item--column': direction === 'column' }"
	>
		<div class="item__title z-body-small z-body-small--strong">
			{{ title }}
		</div>

		<slot />
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		direction: {
			type: String,
			default: 'column',
		},
		title: {
			type: String,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.item {
	$this: &;

	display: flex;
	align-items: center;
	padding: 16px;

	&--column {
		flex-direction: column;
		align-items: flex-start;

		& #{$this}__title {
			margin-bottom: 8px;
		}
	}

	&__title {
		margin-right: auto;
	}
}

.margin-bottom-8 {
	margin-bottom: 8px;
}
</style>
