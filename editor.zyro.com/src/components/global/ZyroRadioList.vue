<template>
	<div class="zyro-radio-list">
		<div
			v-for="(option, key) in options"
			:key="`${key}-parent`"
			class="zyro-radio-list__option"
			:data-qa="`radio-list__option-${key}`"
			@click="$emit('update:model-value', key)"
		>
			<ZyroRadio
				:value="key"
				:model-value="modelValue"
			/>
			<span class="zyro-radio-list__option-name z-body-small z-body-small--light">
				{{ option.name }}
			</span>
		</div>
	</div>
</template>

<script>
import ZyroRadio from '@/components/global/ZyroRadio.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroRadio,
	},

	props: {
		modelValue: {
			type: String,
			required: true,
		},
		options: {
			type: Object,
			validator: (options) => Object.values(options).every((option) => option.name),
			required: true,
		},
	},
	emits: ['update:model-value'],
});
</script>

<style lang="scss" scoped>
.zyro-radio-list {
	display: flex;
	flex-direction: row;

	&__option {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-right: 16px;
		line-height: 1;
		cursor: pointer;
	}

	&__option-name {
		margin-left: 10px;
	}
}
</style>
