<template>
	<div class="grid-tiles">
		<svg
			class="grid-tiles__svg"
			width="100%"
			height="100%"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<pattern
					:id="`grid-pattern-${id}`"
					:height="gridPatternSize.outerHeight"
					:width="gridPatternSize.outerWidth"
					class="grid-tiles__pattern-outer"
					patternUnits="userSpaceOnUse"
				>
					<rect
						v-if="gapsEnabled"
						:height="gridPatternSize.innerHeight"
						:width="gridPatternSize.innerWidth"
						class="grid-tiles__pattern-inner"
						rx="3"
						x="0.5"
						y="0.5"
						stroke-width="1"
					/>
					<rect
						v-else
						:height="gridPatternSize.innerHeight"
						:width="gridPatternSize.innerWidth"
						rx="0"
						stroke-width="1"
						stroke-linecap="square"
						x="0.5"
						y="0.5"
						fill="none"
						stroke="var(--color-gray)"
					/>
				</pattern>
			</defs>
			<rect
				width="100%"
				height="100%"
				:fill="`url(#grid-pattern-${id})`"
			/>
		</svg>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockGridPattern',

	props: {
		columnWidth: {
			type: Number,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
	},

	computed: {
		styles({ data }) {
			return data?.settings?.styles ?? {};
		},
		gapsEnabled({ styles }) {
			return !(styles['column-gap'] === '0px' && styles['row-gap'] === '0px');
		},
		gridPatternSize({
			columnWidth,
			styles,
		}) {
			return {
				innerWidth: `${columnWidth}px`,
				outerWidth: `${Number.parseInt(styles['column-gap'], 10) + columnWidth}px`,
				innerHeight: styles['row-size'],
				outerHeight: `${Number.parseInt(styles['row-size'], 10) + Number.parseInt(styles['row-gap'], 10)}px`,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.grid-tiles {
	position: absolute;
	top: 0;
	right: -1px;
	bottom: -1px;
	left: 0;
	z-index: -1;
	grid-area: 1 / 3 / calc(var(--current-grid-height) + 1) / -3;
	pointer-events: none;
	transform-origin: left;

	&__svg {
		grid-row: 1 / span var(--rows);
	}

	&__pattern-inner {
		fill: rgba($color-dark, 0.1);
		stroke: rgba($color-light, 0.35);
	}
}

@include site-engine-mobile {
	.grid-tiles {
		grid-area: 1/1 / calc(var(--m-rows) + 1) / -1;

		&__svg {
			grid-row: 1 / span var(--m-rows);
		}
	}
}
</style>
