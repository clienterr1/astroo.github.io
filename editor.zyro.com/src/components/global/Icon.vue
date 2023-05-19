<template>
	<svg
		v-if="isCustom"
		v-qa="`icon-${name}`"
		class="icon"
		viewBox="0 0 60 55"
		:class="{ 'icon__dimensions': isCustom }"
		@click="handleClick"
	>
		<use :xlink:href="iconHref" />
	</svg>
	<span
		v-else
		v-qa="`icon-${name}`"
		class="icon icon__dimensions"
		:class="[`material-icons${isFilled ? '' : '-outlined'}`]"
		@click="handleClick"
	>
		{{ name }}
	</span>
</template>

<script setup>
import { addBreadcrumb } from '@sentry/browser';
import { computed } from 'vue';

const ICON_ROTATION_MAP = {
	up: '0deg',
	right: '90deg',
	down: '180deg',
	left: '270deg',
};

const props = defineProps({
	direction: {
		type: String,
		default: 'up',
		validator(value) {
			return [
				'up',
				'right',
				'down',
				'left',
			].includes(value);
		},
	},
	// Is icon custom uploaded
	isCustom: {
		type: Boolean,
		default: false,
	},
	// Icon name that can be custom or MDI from here https://marella.me/material-icons/demo/
	name: {
		type: String,
		required: true,
	},
	// Uploaded icon location in file system
	location: {
		type: String,
		default: '',
	},
	// Icon size dimensions in pixels
	dimensions: {
		type: String,
		default: '24px',
		validator: (value) => value.includes('px'),
	},
	// Is MDI icon filled style
	isFilled: {
		type: Boolean,
		default: false,
	},
});

const size = computed(() => props.dimensions);
const rotationAngle = computed(() => ICON_ROTATION_MAP[props.direction]);
const iconHref = computed(() => `#icon${props.location && `-${props.location}`}-${props.name}`);

const handleClick = () => {
	addBreadcrumb({
		category: 'CLICK:Icon',
		data: {
			name: props.name,
		},
	});
};
</script>

<style lang="scss" scoped>
.icon {
	transition: 0.3s ease transform;
	fill: currentColor;
	font-size: v-bind(size);
	transform: rotate(v-bind(rotationAngle));
	width: v-bind(size);
	height: v-bind(size);

	&__dimensions {
		width: v-bind(size);
		height: v-bind(size);
	}
}
</style>
