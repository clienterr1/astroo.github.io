<template>
	<div
		class="quick-start-guide-item"
		data-qa="quick-start-guide-item"
		:class="{ 'quick-start-guide-item--active': isActive }"
	>
		<ZyroCheckbox
			data-qa="quick-start-guide-item-checkbox"
			class="quick-start-guide-item__checkbox"
			is-rounded
			is-filled
			:model-value="isCompleted"
		/>
		<p class="z-body-small">
			<slot />
		</p>
	</div>
</template>

<script>
import ZyroCheckbox from '@/components/global/ZyroCheckbox.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCheckbox,
	},

	props: {
		isCompleted: {
			type: Boolean,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
.quick-start-guide-item {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	height: 50px;
	padding: 16px;
	cursor: pointer;
	border: 1px solid $color-gray-border;
	border-radius: 8px;

	&--active {
		border: 1px solid $color-primary;
	}

	&__checkbox {
		margin-right: 12px;
		pointer-events: none;
	}
}
</style>
