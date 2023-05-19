<template>
	<div class="zyro-field-toggle">
		<div class="zyro-field-toggle__group">
			<ZyroLabel
				:for="id"
				:bold="bold"
				class="zyro-field-toggle__label"
				data-qa="toggle-label"
				:class="{ 'zyro-field-toggle__label--disabled': disabled }"
			>
				{{ label }}
			</ZyroLabel>
			<ZyroToggle
				:id="id"
				v-qa="toggleDataQa"
				:model-value="modelValue"
				class="zyro-field-toggle__switch"
				:disabled="disabled"
				@update:model-value="$emit('update:model-value', $event)"
			/>
		</div>
		<div
			v-if="message"
			class="zyro-field-toggle__message"
		>
			{{ message }}
		</div>
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLabel,
		ZyroToggle,
	},

	props: {
		id: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
		message: {
			type: String,
			default: '',
		},
		modelValue: {
			type: Boolean,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		bold: {
			type: Boolean,
			default: true,
		},
		toggleDataQa: {
			type: String,
			default: 'toggle',
		},
	},
	emits: ['update:model-value'],
});
</script>

<style lang="scss" scoped>
.zyro-field-toggle {
	width: 100%;
	padding: 16px 0;

	&__group {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 24px;
	}

	&__message {
		margin-top: 8px;
		font-size: 13px;
		color: $color-gray;
	}

	&__label {
		line-height: 16px;
		cursor: pointer;

		&--disabled {
			color: $color-gray;
		}
	}

	&__switch {
		margin-left: auto;
	}
}
</style>
