<template>
	<div
		class="zyro-field-shorthand"
		:class="{ 'zyro-field-shorthand--spinner-disabled' : spinnerDisabled }"
	>
		<ZyroLabel
			:bold="bold"
			:for="$options.inputId"
		>
			{{ label }}
		</ZyroLabel>
		<div class="zyro-field-shorthand__controls">
			<div
				v-if="showVertical"
				class="zyro-field-shorthand__top-bottom"
			>
				<ZyroLabel
					:for="$options.inputId"
					class="zyro-field-shorthand__label"
					:class="{ 'zyro-field-shorthand__label--disabled': disabled }"
				>
					{{ titleVertical ?? $t('builder.cssShorthandControlRange.vertical') }}
				</ZyroLabel>
				<ZyroInput
					:id="$options.inputId"
					:model-value="topBottom"
					class="zyro-field-shorthand__input"
					:disabled="disabled"
					type="number"
					:min-value="0"
					maxlength="3"
					:spinner-disabled="spinnerDisabled"
					:suffix="units"
					:input-type="inputType"
					:color="color"
					@update:model-value="updateTopBottom"
				/>
			</div>
			<div
				v-if="showHorizontal"
				class="zyro-field-shorthand__left-right"
			>
				<ZyroLabel
					:for="$options.inputId + '2'"
					class="zyro-field-shorthand__label"
					:class="{ 'zyro-field-shorthand__label--disabled': disabled }"
				>
					{{ titleHorizontal ?? $t('builder.cssShorthandControlRange.horizontal') }}
				</ZyroLabel>
				<ZyroInput
					:id="$options.inputId + '2'"
					:model-value="leftRight"
					class="zyro-field-shorthand__input"
					:disabled="disabled"
					type="number"
					maxlength="3"
					:min-value="0"
					:spinner-disabled="spinnerDisabled"
					:suffix="units"
					:input-type="inputType"
					:color="color"
					@update:model-value="updateLeftRight"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroInput from '@/components/global/ZyroInput.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';

import { generateRandomId } from '@/utils/generateRandomId';

import { defineComponent } from 'vue';

const inputId = generateRandomId();

export default defineComponent({
	inputId,

	components: {
		ZyroInput,
		ZyroLabel,
	},

	props: {
		bold: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		spinnerDisabled: {
			type: Boolean,
			default: true,
		},
		modelValue: {
			type: String,
			required: true,
		},
		units: {
			type: String,
			validator: (value) => [
				'px',
				'',
			].includes(value),
			default: '',
		},
		showHorizontal: {
			type: Boolean,
			default: true,
		},
		showVertical: {
			type: Boolean,
			default: true,
		},
		titleVertical: {
			type: String,
			default: null,
		},
		titleHorizontal: {
			type: String,
			default: null,
		},
		inputType: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			validator: (color) => [
				'',
				'light',
			].includes(color),
			default: '',
		},
		label: {
			type: String,
			default: '',
		},
	},

	emits: ['update:model-value'],

	data() {
		return {
			showSpinner: false,
		};
	},

	computed: {
		parsedCSSSides() {
			return parseCSSSides(this.modelValue);
		},
		topBottom() {
			return Number.parseInt(this.parsedCSSSides.top, 10) || 0;
		},
		leftRight() {
			return Number.parseInt(this.parsedCSSSides.left, 10) || 0;
		},
	},
	methods: {
		updateTopBottom(newValue) {
			const parsedValue = newValue < 0 ? 0 : Number.parseInt(newValue, 10);
			const stringifiedValue = `${parsedValue || 0}px`;
			const fullPadding = {
				...parseCSSSides(this.modelValue),
				top: stringifiedValue,
				bottom: stringifiedValue,
			};

			this.$emit('update:model-value', Object.values(fullPadding).join(' '));
		},
		updateLeftRight(newValue) {
			const parsedValue = newValue < 0 ? 0 : Number.parseInt(newValue, 10);
			const stringifiedValue = `${parsedValue || 0}px`;
			const fullPadding = {
				...parseCSSSides(this.modelValue),
				left: stringifiedValue,
				right: stringifiedValue,
			};

			this.$emit('update:model-value', Object.values(fullPadding).join(' '));
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-field-shorthand {
	padding: 12px 0 16px;

	&__controls {
		position: relative;
		display: flex;

		> * {
			flex: 0 0 96px;
			max-width: 96px;
			margin-right: 16px;

			input::-webkit-outer-spin-button,
			input::-webkit-inner-spin-button { margin-left: 20px; }
		}
	}

	&__input {
		width: 96px !important;
		padding-right: 8px !important;

		:deep() {
			padding: 0;
		}
	}

	&__label {
		margin: 8px 0;
		line-height: 16px;
		cursor: pointer;

		&--disabled {
			color: $color-gray;
		}
	}
}
</style>
