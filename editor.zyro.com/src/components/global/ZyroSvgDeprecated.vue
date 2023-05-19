<template>
	<svg
		class="icon"
		:class="[`icon-${name}`, { 'icon__dimensions': dimensions }]"
		:style="computedStyles"
		@click="handleClick"
	>
		<use :xlink:href="iconHref" />
	</svg>
</template>

<script>
import { addBreadcrumb } from '@sentry/browser';

import { defineComponent } from 'vue';

const rotationMap = {
	up: '0deg',
	right: '90deg',
	down: '180deg',
	left: '270deg',
};

export default defineComponent({
	props: {
		direction: {
			type: String,
			default: 'up',
			validator(value) {
				return [
					'up',
					'down',
					'right',
					'left',
				].includes(value);
			},
		},
		name: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			default: '',
		},
		dimensions: {
			type: String,
			default: '',
		},
	},

	computed: {
		computedStyles({ direction }) {
			return {
				'--rotation-angle': rotationMap[direction],
				'--dimensions': this.dimensions || null,
			};
		},
		iconHref() {
			return `#icon${this.location && `-${this.location}`}-${this.name}`;
		},
	},

	methods: {
		handleClick() {
			addBreadcrumb({
				category: 'CLICK:ZyroSvg',
				data: {
					name: this.name,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.icon {
	transition: 0.3s ease transform;
	transform: rotate(var(--rotation-angle));

	&__dimensions {
		width: var(--dimensions);
		height: var(--dimensions);
	}
}
</style>
