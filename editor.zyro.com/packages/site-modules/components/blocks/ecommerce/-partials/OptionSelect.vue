<template>
	<div class="option-select">
		<p class="option-select__label">
			{{ title }}
		</p>
		<div class="option-select__select-wrapper">
			<select
				v-model="selectedValue"
				data-qa="product-section-select-button"
				class="option-select__select"
			>
				<option
					v-for="(option, index) in options"
					:key="`option-${index}`"
					:value="option.id"
				>
					{{ option[labelKey] }}
				</option>
			</select>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'OptionSelect',

	props: {
		title: {
			type: String,
			required: true,
		},
		labelKey: {
			type: String,
			default: 'label',
		},
		options: {
			type: Object,
			default: () => {},
		},
		value: {
			type: String,
			default: '',
		},
	},

	emits: ['set-value'],

	computed: {
		selectedValue: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit('set-value', value);
			},
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

$select-padding-x: 16px;
$select-padding-y: 10px;

.option-select {
	width: 100%;
	max-width: 340px;

	&__label {
		margin-bottom: 8px;
	}

	&__select-wrapper {
		position: relative;
		display: flex;
		align-items: center;

		&::before {
			position: absolute;
			right: $select-padding-x;
			display: inline-block;
			width: 8px;
			height: 8px;
			color: $color-dark;
			vertical-align: top;
			pointer-events: none;
			content: "";
			border-style: solid;
			border-width: 2px 2px 0 0;
			transform: rotate(135deg);
		}
	}

	&__select {
		width: 100%;
		padding: $select-padding-y $select-padding-x;
		font-family: inherit;
		font-size: inherit;
		line-height: 1.5;
		color: var(--body-color, $color-dark);
		background-color: $color-light;
		border: 0.5px solid $color-gray-border;
		appearance: none;
	}
}

@include site-engine-mobile {
	.option-select {
		&__select-wrapper {
			margin-bottom: 16px;
		}
	}
}
</style>
