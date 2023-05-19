<template>
	<div
		class="zyro-checkbox"
		:class="`zyro-checkbox--theme-${theme}`"
	>
		<input
			:id="checkboxId"
			type="checkbox"
			:checked="modelValue"
			class="zyro-checkbox__input"
			@input="handleInputClick"
		>
		<label
			:for="checkboxId"
			class="zyro-checkbox__label"
			:class="[
				{ 'zyro-checkbox__label--fully-rounded' : isRounded },
				{ 'zyro-checkbox__label--filled' : isFilled }
			]"
		>
			<ZyroSvgDeprecated
				class="zyro-checkbox__check-mark"
				name="check-mark-thick"
			/>
		</label>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { generateRandomId } from '@/utils/generateRandomId';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		id: {
			type: String,
			default: '',
		},
		modelValue: {
			type: Boolean,
			required: true,
		},
		theme: {
			type: String,
			validator: (value) => [
				'blue',
				'purple',
				'green',
			].includes(value),
			default: 'purple',
		},
		isRounded: {
			type: Boolean,
			default: false,
		},
		isFilled: {
			type: Boolean,
			default: false,
		},
		isNonClickable: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['update:model-value'],

	computed: {
		checkboxId() {
			return this.id || generateRandomId();
		},
	},

	methods: {
		handleInputClick(event) {
			if (!this.isNonClickable) {
				this.$emit('update:model-value', event.target.checked);
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-checkbox {
	$this: &;

	display: inline-block;
	font-size: 24px;

	&--theme-blue {
		#{$this}__label {
			color: $color-azure;

			&:hover {
				border-color: $color-azure;
			}
		}

		#{$this}__input {
			&:checked + #{$this}__label {
				color: $color-light;
				background-color: $color-azure;
				border-color: $color-azure;
			}
		}
	}

	&--theme-green {
		#{$this}__label {
			color: $color-success;

			&:hover {
				border-color: $color-success;
			}
		}

		#{$this}__input {
			&:checked + #{$this}__label {
				color: $color-light;
				background-color: $color-success;
				border-color: $color-success;
			}
		}
	}

	&__label {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		color: $color-primary;
		background-color: $color-light;
		border: 2px solid $color-gray-border;
		border-radius: 5px;
		transition: border 300ms ease;

		&:hover {
			border: 2px solid $color-primary;
		}

		&--fully-rounded {
			border-radius: 100%;
		}

		#{$this}__check-mark {
			margin-top: 1px;
			transition: transform 75ms $transition-timing-easing-accelerate;
			transform: rotateY(-90deg) scale(0);
			backface-visibility: hidden;
		}
	}

	&__input {
		display: none;
		visibility: hidden;
		appearance: none;

		&:checked + #{$this}__label {
			border: 2px solid $color-primary;

			&--filled {
				color: $color-light;
				background-color: $color-primary;
			}

			#{$this}__check-mark {
				transform: rotateY(0) scale(1);
			}
		}

		&:disabled + #{$this}__label {
			background: $color-gray-border;

			&:hover {
				border: 2px solid $color-gray-border;
			}
		}

		&:focus + #{$this}__label {
			border: 2px solid $color-primary;
		}
	}
}
</style>
