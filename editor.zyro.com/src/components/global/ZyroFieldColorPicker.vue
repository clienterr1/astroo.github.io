<template>
	<ColorPicker
		:is-open="isOpen"
		:model-value="modelValue"
		:placement="placement"
		:flip="false"
		:portal-selector="portalSelector"
		@update:model-value="$emit('update:model-value', $event)"
		@toggle="$emit('toggle')"
		@click-outside="$emit('click-outside')"
	>
		<div class="color-picker-toggle">
			<p class="z-body-small z-body-small--strong">
				{{ label }}
			</p>
			<ColorPickerButton :color="modelValue" />
		</div>
	</ColorPicker>
</template>

<script>
import ColorPickerButton from '@/components/global/ColorPickerButton.vue';
import ColorPicker from '@/components/global/ColorPicker.vue';

export default {
	components: {
		ColorPicker,
		ColorPickerButton,
	},
	props: {
		modelValue: {
			type: String,
			default: 'rgb(255, 255, 255)',
		},
		isOpen: {
			type: Boolean,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		placement: {
			type: String,
			default: 'right-start',
		},
		portalSelector: {
			type: String,
			default: "[data-portal='builder-preview']",
		},
	},
	emits: [
		'toggle',
		'click-outside',
		'update:model-value',
	],
};
</script>

<style lang="scss" scoped>
.color-picker-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
}
</style>
