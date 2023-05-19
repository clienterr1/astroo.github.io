<template>
	<div
		class="zyro-field-shorthand"
	>
		<ZyroLabel
			:bold="bold"
			:for="inputId"
		>
			{{ label }}
		</ZyroLabel>
		<ZyroLabel
			:for="inputId"
			class="zyro-field-shorthand__label"
			:class="{ 'zyro-field-shorthand__label--disabled': disabled }"
		>
			{{ changeVertical ?
				$t('builder.cssShorthandControlRange.vertical'):
				$t('builder.cssShorthandControlRange.horizontal')
			}}
		</ZyroLabel>
		<ZyroRange
			:id="inputId"
			v-qa="qa"
			:model-value="computedValue"
			class="zyro-field-shorthand__input"
			:disabled="disabled"
			min="0"
			step="1"
			:max="maxRange"
			@update:model-value="updateComputedValue"
		/>
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';

import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';

import { generateRandomId } from '@/utils/generateRandomId';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLabel,
		ZyroRange,
	},

	props: {
		changeVertical: {
			type: Boolean,
			default: true,
		},
		bold: {
			type: Boolean,
			default: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: String,
			required: true,
		},
		units: {
			type: String,
			default: 'px',
		},
		maxRange: {
			type: Number,
			default: 128,
		},
		qa: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: '',
		},
	},
	emits: ['update:model-value'],

	data() {
		return {
			inputId: null,
		};
	},

	computed: {
		parsedCSSSides() {
			return parseCSSSides(this.modelValue);
		},
		computedValue() {
			return this.changeVertical ? this.topBottom : this.leftRight;
		},
		topBottom() {
			return Number.parseInt(this.parsedCSSSides.top, 10) || 0;
		},
		leftRight() {
			return Number.parseInt(this.parsedCSSSides.left, 10) || 0;
		},
	},

	created() {
		this.inputId = generateRandomId();
	},

	methods: {
		updateComputedValue(newValue) {
			if (this.changeVertical) {
				this.updateTopBottom(newValue);
			} else {
				this.updateLeftRight(newValue);
			}
		},
		updateTopBottom(newValue) {
			const parsedValue = `${Number.parseInt(newValue, 10)}px`;
			const fullPadding = parseCSSSides(this.modelValue);

			fullPadding.top = parsedValue;
			fullPadding.bottom = parsedValue;
			this.$emit('update:model-value', Object.values(fullPadding).join(' '));
		},
		updateLeftRight(newValue) {
			const parsedValue = `${Number.parseInt(newValue, 10)}px`;
			const fullPadding = parseCSSSides(this.modelValue);

			fullPadding.left = parsedValue;
			fullPadding.right = parsedValue;
			this.$emit('update:model-value', Object.values(fullPadding).join(' '));
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-field-shorthand {
	width: 100%;

	&__label {
		display: block;
		width: 100%;
		margin: 8px 0 4px;
		line-height: 16px;
		cursor: pointer;

		&--disabled {
			color: $color-gray;
		}
	}
}
</style>
