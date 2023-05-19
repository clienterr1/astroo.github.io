<template>
	<div class="zyro-field-text">
		<div class="zyro-field-text__label-wrapper">
			<ZyroLabel
				v-if="label"
				:for="id"
				:bold="bold"
				class="zyro-field-text__label"
				:class="[
					`zyro-field-text__label--${inputTheme}`,
					{ 'zyro-field-text__label--disabled': disabled }
				]"
				:theme="labelTheme"
			>
				{{ label }}
			</ZyroLabel>
			<ZyroInfo
				v-if="infoText"
				:info-text="infoText"
			/>
		</div>
		<slot name="sublabel" />

		<ZyroFieldWrapper class="zyro-field-text__field-wrapper">
			<template #prefix>
				<slot name="prefix" />
			</template>

			<ZyroInput
				:id="id"
				class="zyro-field-text__input"
				:disabled="disabled"
				:theme="inputTheme"
				:padding="padding"
				:autofocus="autofocus"
				:input-type="inputType"
				:type="type"
				:placeholder="placeholder"
				:suffix="suffix"
				:error="error"
				:maxlength="maxlength"
				:focus-on-mount="focusOnMount"
				:input-data-qa="inputDataQa"
				:model-value="modelValue"
				@update:model-value="$emit('update:model-value', $event)"
				@input-blur="$emit('input-blur', $event)"
				@input-focus="$emit('input-focus', $event)"
				@keyup-enter="$emit('keyup-enter')"
			/>

			<template #suffix>
				<slot name="suffix" />
			</template>
		</ZyroFieldWrapper>

		<div
			v-if="message || error"
			class="zyro-field-text__message"
			:class="{
				'zyro-field-text__message--error': error,
				'zyro-field-text__message--absolute': isMessageAbsolute
			}"
		>
			<template v-if="!hasSlotContent($slots.error)">
				{{ error ? error : message }}
			</template>
			<slot name="error" />
		</div>

		<slot name="message" />
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import ZyroFieldWrapper from '@/components/global/ZyroFieldWrapper.vue';
import ZyroInput from '@/components/global/ZyroInput.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroInfo from '@/components/site-settings/components/ZyroInfo.vue';

export default defineComponent({
	components: {
		ZyroFieldWrapper,
		ZyroInput,
		ZyroLabel,
		ZyroInfo,
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
		placeholder: {
			type: String,
			default: '',
		},
		error: {
			type: [
				String,
				Boolean,
			],
			default: '',
		},
		modelValue: {
			type: String,
			required: true,
		},
		autofocus: {
			type: Boolean,
			default: false,
		},
		bold: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		labelTheme: {
			type: String,
			default: 'primary',
		},
		infoText: {
			type: String,
			default: '',
		},
		inputTheme: {
			type: String,
			default: 'primary',
		},
		maxlength: {
			type: [
				String,
				Number,
			],
			default: null,
		},
		inputTag: {
			type: String,
			default: 'input',
			validator: (value) => [
				'input',
				'textarea',
			].includes(value),
		},
		type: {
			type: String,
			default: '',
		},
		inputType: {
			type: String,
			default: '',
			validator: (value) => [
				'',
				'number',
			].includes(value),
		},
		suffix: {
			type: String,
			default: null,
		},
		focusOnMount: {
			type: Boolean,
			default: false,
		},
		padding: {
			type: String,
			default: '',
		},
		isMessageAbsolute: {
			type: Boolean,
			default: false,
		},
		inputDataQa: {
			type: String,
			default: 'textfield-input',
		},
	},

	emits: [
		'update:model-value',
		'input-blur',
		'input-focus',
		'keyup-enter',
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

	&__field-wrapper {
		width: 100%;
	}

	&__message {
		margin-top: 8px;
		overflow: hidden;
		font-size: 13px;
		color: $color-gray;
		text-align: left;
		text-overflow: ellipsis;
		user-select: text;

		&--error {
			color: $color-primary;
		}

		&--absolute {
			position: absolute;
			margin: 0;
		}
	}

	&__label-wrapper {
		display: flex;
		align-items: center;
	}

	&__label {
		width: auto;

		&--disabled {
			color: $color-gray;
		}

		&--primary {
			margin: 8px 0;
		}
	}
}
</style>
