<template>
	<div class="snapping-lines">
		<template v-if="yLines">
			<div
				v-for="(line, index) in yLines"
				:key="`y-${index}`"
				class="snapping-lines__line snapping-lines__line--horizontal"
				:style="{
					'--top': line.top,
					'--left': line.left,
					'--width': line.width,
					'--line-style' : line.style,
					'--line-color' : line.color
				}"
			/>
		</template>
		<template v-if="xLines">
			<div
				v-for="(line, index) in xLines"
				:key="`x-${index}`"
				class="snapping-lines__line snapping-lines__line--vertical"
				:style="{
					'--top': line.top,
					'--left': line.left,
					'--height': line.height,
					'--line-style' : line.style,
					'--line-color' : line.color
				}"
			/>
		</template>
	</div>
</template>

<script>
import { LAYOUT_SNAP_TYPES } from '@/constants';

import { defineComponent } from 'vue';

const LINE_STYLE_MAP = {
	[LAYOUT_SNAP_TYPES.ELEMENT_EDGE]: 'solid',
	[LAYOUT_SNAP_TYPES.ELEMENT_CENTER]: 'dashed',
	[LAYOUT_SNAP_TYPES.COLUMN]: 'solid',
	[LAYOUT_SNAP_TYPES.ROW]: 'solid',
	[LAYOUT_SNAP_TYPES.BLOCK_CENTER]: 'dashed',
};

const LINE_COLOR_MAP = {
	[LAYOUT_SNAP_TYPES.ELEMENT_EDGE]: 'var(--color-azure-dark)',
	[LAYOUT_SNAP_TYPES.ELEMENT_CENTER]: 'var(--color-azure-dark)',
	[LAYOUT_SNAP_TYPES.COLUMN]: 'var(--color-azure-dark)',
	[LAYOUT_SNAP_TYPES.ROW]: 'var(--color-azure-dark)',
	[LAYOUT_SNAP_TYPES.BLOCK_CENTER]: 'var(--color-warning-dark)',
};

export default defineComponent({
	props: {
		elementPosition: {
			type: Object,
			default: null,
		},
		yPoints: {
			type: Array,
			default: null,
		},
		xPoints: {
			type: Array,
			default: null,
		},
	},

	computed: {
		yLines() {
			const {
				left: elementLeft,
				width: elementWidth,
			} = this.elementPosition;

			const elementRight = elementLeft + elementWidth;

			return this.yPoints.map((point) => {
				const left = Math.min(elementLeft, point.left);
				const right = Math.max(elementRight, point.right);

				if (LAYOUT_SNAP_TYPES.ROW === point.type) {
					return {
						top: `${point.location}px`,
						left: 0,
						height: '1px',
						style: LINE_STYLE_MAP[point.type],
						color: LINE_COLOR_MAP[point.type],
					};
				}

				return {
					top: `${point.location}px`,
					left: `${left}px`,
					width: `${right - left}px`,
					style: LINE_STYLE_MAP[point.type],
					color: LINE_COLOR_MAP[point.type],
				};
			});
		},
		xLines() {
			const {
				top: elementTop,
				height: elementHeight,
			} = this.elementPosition;

			const elementBottom = elementTop + elementHeight;

			return this.xPoints.map((point) => {
				if ([
					LAYOUT_SNAP_TYPES.COLUMN,
					LAYOUT_SNAP_TYPES.BLOCK_CENTER,
				].includes(point.type)) {
					return {
						top: 0,
						left: `${point.location}px`,
						height: '100%',
						style: LINE_STYLE_MAP[point.type],
						color: LINE_COLOR_MAP[point.type],
					};
				}

				const top = Math.min(elementTop, point.top);
				const bottom = Math.max(elementBottom, point.bottom);

				return {
					top: `${top}px`,
					left: `${point.location}px`,
					height: `${bottom - top}px`,
					style: LINE_STYLE_MAP[point.type],
					color: LINE_COLOR_MAP[point.type],
				};
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.snapping-lines {
	position: relative;
	z-index: $z-index-controls-block-selection;
	grid-area: 1 / 1 / -1 / -1;
	pointer-events: none;

	&__line {
		position: absolute;

		&--vertical {
			top: var(--top);
			bottom: 0;
			left: calc(var(--left) - 1px);
			width: 0;
			height: var(--height);
			border-right: 1px var(--line-style) var(--line-color);
			border-left: 1px var(--line-style) var(--line-color);
		}

		&--horizontal {
			top: calc(var(--top) - 1px);
			right: 0;
			left: var(--left);
			width: var(--width);
			max-width: 100%;
			height: 0;
			border-top: 1px var(--line-style) var(--line-color);
			border-bottom: 1px var(--line-style) var(--line-color);
		}
	}
}
</style>
