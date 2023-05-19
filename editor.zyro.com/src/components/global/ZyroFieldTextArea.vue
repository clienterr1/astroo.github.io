<template>
	<div class="zyro-field-text">
		<div class="zyro-field-text__label-wrapper">
			<ZyroLabel
				v-if="label"
				:for="id"
				:bold="theme === 'primary' || bold"
				class="zyro-field-text__label"
				:class="`zyro-field-text__label--${theme}`"
				:theme="theme"
			>
				{{ label }}
			</ZyroLabel>
			<slot name="label-tooltip" />
		</div>
		<slot name="sublabel" />

		<ZyroFieldWrapper>
			<ZyroTextArea
				v-qa="inputDataQa"
				class="zyro-field-text__input"
				:theme="theme"
				:placeholder="placeholder"
				:autofocus="autofocus"
				:is-resizable="isResizable"
				:min-height="minHeight"
				:maxlength="maxlength"
				:model-value="modelValue"
				:error="error"
				@text-area-blur="$emit('text-area-blur', $event)"
				@text-area-focus="$emit('text-area-focus', $event)"
				@update:model-value="$emit('update:model-value', $event)"
			/>

			<template #suffix>
				<slot name="suffix" />
			</template>
		</ZyroFieldWrapper>

		<slot name="message" />
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import ZyroFieldWrapper from '@/components/global/ZyroFieldWrapper.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroTextArea from '@/components/global/ZyroTextArea.vue';

export default defineComponent({
	components: {
		ZyroFieldWrapper,
		ZyroLabel,
		ZyroTextArea,
	},

	props: {
		id: {
			type: String,
			default: '',
		},
		modelValue: {
			type: String,
			required: true,
		},
		label: {
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		error: {
			type: String,
			default: '',
		},
		maxlength: {
			type: [
				String,
				Number,
			],
			default: null,
		},
		inputDataQa: {
			type: String,
			default: 'textfield-textarea',
		},
		theme: {
			type: String,
			default: 'primary',
			validator: (value) => [
				'primary',
				'secondary',
				'hostinger',
			].includes(value),
		},
		isResizable: {
			type: Boolean,
			default: false,
		},
		minHeight: {
			type: Number,
			default: 0,
		},
		autofocus: {
			type: Boolean,
			default: false,
		},
		bold: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'update:model-value',
		'text-area-blur',
		'text-area-focus',
	],

	setup() {
		return {
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.zyro-field-text {
	position: relative;
	margin-bottom: 16px;

	&__input {
		width: 100%;
	}

	&__label-wrapper {
		display: flex;
		align-items: center;
	}

	&__label {
		width: auto;

		&--primary {
			margin: 8px 0;
		}
	}
}
</style>
