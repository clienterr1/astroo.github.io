<template>
	<div class="zyro-field-range">
		<ZyroLabel
			:for="id"
			:bold="bold"
			class="zyro-field-range__label"
		>
			{{ label }}
		</ZyroLabel>
		<ZyroRange
			:data-qa="qa"
			:model-value="modelValue"
			:min="min"
			:max="max"
			:step="step"
			:units="units"
			:has-number-input="hasNumberInput"
			@update:model-value="$emit('update:model-value', $event)"
		/>
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLabel,
		ZyroRange,
	},

	props: {
		id: {
			type: String,
			default: '',
		},
		min: {
			type: [
				String,
				Number,
			],
			default: '',
		},
		max: {
			type: [
				String,
				Number,
			],
			default: '',
		},
		step: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		bold: {
			type: Boolean,
			default: true,
		},
		modelValue: {
			type: Number,
			required: true,
		},
		units: {
			type: String,
			default: 'px',
		},
		qa: {
			type: String,
			default: '',
		},
		hasNumberInput: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:model-value'],
});
</script>

<style lang="scss" scoped>
.zyro-field-range {
	margin: 16px 0;

	&__label {
		margin-bottom: 16px;
		line-height: 16px;
		cursor: pointer;
	}
}
</style>
