<template>
	<label
		class="select-input"
		:class="labelClasses"
		:for="id"
	>
		<input
			:id="id"
			:key="isSelected"
			:type="tag"
			class="select-input__input"
			:class="inputClasses"
			:checked="isSelected"
			:tabindex="isInteractive ? 0 : -1"
			@input.stop="selectOption"
			@dragstart.prevent
			@drag.prevent
		>
		{{ name }}
	</label>
</template>
<script>

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridSelectInput',

	props: {
		name: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		tag: {
			type: String,
			required: true,
		},
		selectedOptions: {
			type: Array,
			required: true,
		},
		isInteractive: {
			type: Boolean,
			default: true,
		},
		theme: {
			type: String,
			required: true,
		},
		isSelected: {
			type: Boolean,
			required: true,
		},
	},

	emits: [
		'select-option',
		'remove-selection',
		'add-selection',
	],

	computed: {
		labelClasses() {
			return [
				{
					'input__label--read-only': !this.isInteractive,
				},
				`select-input--${this.theme}`,
			];
		},
		inputClasses() {
			return [
				{
					'input__component--read-only': !this.isInteractive,
				},
			];
		},
	},

	methods: {
		selectOption() {
			if (!this.isInteractive) {
				return;
			}

			const selection = {
				id: this.id,
				value: this.name,
			};

			if (this.tag !== 'checkbox') {
				this.$emit('select-option', selection);
			} else if (this.isSelected) {
				this.$emit('remove-selection', selection);
			} else {
				this.$emit('add-selection', selection);
			}
		},
	},
});
</script>
<style lang="scss" scoped>
/* stylelint-disable custom-property-pattern */

@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

$input-transition-timing-function: "ease";
$input-transition-duration: "0.2s";

.select-input {
	font-size: var(--input-text-size, var(--body-font-size));
	color: var(--input-text-color, var(--body-color));
	transition: color #{$input-transition-timing-function} #{$input-transition-duration};

	&--dark {
		color: var(--input-text-color, $color-light);
	}

	&:hover,
	&:focus {
		color: var(--input-text-color--hover, var(--body-color));
	}

	&--read-only {
		cursor: move;
	}

	&__input {
		cursor: pointer;

		&--read-only {
			cursor: move;
		}
	}
}

@include site-engine-mobile {
	.select-input {
		font-size: var(--m-input-text-size, var(--body-m-font-size));
	}
}
</style>
