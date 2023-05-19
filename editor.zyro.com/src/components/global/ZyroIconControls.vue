<template>
	<div
		class="zyro-icon-controls"
		:class="`zyro-icon-controls--${theme}`"
	>
		<div
			v-for="icon in icons"
			:key="icon.value"
			v-qa="`iconcontrols-${icon.value}`"
			class="zyro-icon-controls__icon"
			:class="{ 'zyro-icon-controls__icon--active': icon.value === modelValue }"
			@click="setNewValue(icon.value)"
		>
			<ZyroSvgDeprecated
				:direction="icon.direction"
				:name="icon.icon"
			/>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroSvgDeprecated,
	},

	props: {
		modelValue: {
			type: String,
			default: '',
		},
		icons: {
			type: Array,
			required: true,
		},
		theme: {
			type: String,
			validator: (value) => [
				'rounded',
				'bordered',
			].includes(value),
			default: 'bordered',
		},
		toggleable: {
			type: Boolean,
			default: true,
		},
		defaultValue: {
			type: String,
			default: '',
		},
	},
	emits: ['update:model-value'],

	methods: {
		setNewValue(value) {
			const newValue = (value === this.current && this.toggleable)
				? this.defaultValue : value;

			this.$emit('update:model-value', newValue);
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-icon-controls {
	display: inline-flex;
	padding: 0;
	margin: 8px 0 16px;
	width: fit-content;

	$this: &;

	&--bordered {
		border: 1px solid $color-gray-light;
		border-radius: $border-radius-xsmall;
	}

	&--rounded {
		#{$this}__icon {
			&:first-child {
				border-radius: 5px 0 0 5px;
			}

			&:last-child {
				border-radius: 0 5px 5px 0;
			}
		}
	}

	&__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		padding: 5px;

		&--active,
		&:hover,
		&:focus {
			cursor: pointer;
			background-color: $color-gray-light;
		}

		svg {
			width: 16px;
			height: 16px;
		}
	}
}
</style>
