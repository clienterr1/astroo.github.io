<template>
	<div
		class="resize-dots"
		:class="{
			'resize-dots--minHeight': isElementMinHeight,
			'resize-dots--minWidth': isElementMinWidth,
			'resize-dots--minSize': isElementMinHeight && isElementMinWidth,
			'resize-dots--only-horizontal': isOnlyHorizontalDotsVisible,
		}"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_RESIZE_DOTS"
	>
		<div
			v-for="direction in resizeDirections"
			:key="direction"
			class="resize-dot"
			:class="[`resize-dot--${direction}`]"
			@mousedown.stop="$emit('start-resizing', direction)"
		>
			<div class="resize-dot__visual-trigger" />
		</div>
	</div>
</template>
<script>

import { defineComponent } from 'vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_RESIZE_DOTS,
} from '@zyro-inc/site-modules/constants';

export default defineComponent({
	props: {
		isElementMinHeight: {
			type: Boolean,
			default: false,
		},
		isElementMinWidth: {
			type: Boolean,
			default: false,
		},
		resizeDirections: {
			type: Array,
			default: () => [],
		},
	},
	setup() {
		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_RESIZE_DOTS,
		};
	},
	computed: {
		isOnlyHorizontalDotsVisible() {
			return this.resizeDirections.length === 2
				&& this.resizeDirections.includes('left')
				&& this.resizeDirections.includes('right');
		},
	},
});
</script>
<style lang="scss" scoped>
$dot-padding: 4px;

.resize-dot {
	$this: &;
	$outline-offset: 1px;
	$size: 10px;

	position: absolute;
	grid-area: 1 / 1 / -1 / -1;
	padding: $dot-padding;
	pointer-events: all;

	&__visual-trigger {
		// Total size of the dot is 12px = 10px + 2px (outline)
		width: $size;
		height: $size;
		background: white;
		outline: 2px solid var(--outline-color, $color-azure);
	}

	&--right,
	&--left,
	&--top,
	&--bottom {
		#{$this}__visual-trigger {
			display: none;
		}
	}

	&--right,
	&--left {
		width: $size;
		height: 100%;
	}

	&--top,
	&--bottom {
		width: 100%;
		height: $size;
	}

	&--right {
		align-self: center;
		justify-self: end;
		cursor: ew-resize;
		transform: translateX(calc(50% + #{$outline-offset}));
	}

	&--left {
		align-self: center;
		justify-self: start;
		cursor: ew-resize;
		transform: translateX(calc(-50% - #{$outline-offset}));
	}

	&--bottom {
		align-self: end;
		justify-self: center;
		cursor: ns-resize;
		transform: translateY(calc(50% + #{$outline-offset}));
	}

	&--bottom-right {
		align-self: end;
		justify-self: end;
		cursor: nwse-resize;
		transform: translate(50%, 50%);
	}

	&--bottom-left {
		align-self: end;
		justify-self: start;
		cursor: nesw-resize;
		transform: translate(-50%, 50%);
	}

	&--top {
		align-self: start;
		justify-self: center;
		cursor: ns-resize;
		transform: translateY(calc(-50% - #{$outline-offset}));
	}

	&--top-left {
		align-self: start;
		justify-self: start;
		cursor: nwse-resize;
		transform: translate(-50%, -50%);
	}

	&--top-right {
		align-self: start;
		justify-self: end;
		cursor: nesw-resize;
		transform: translate(50%, -50%);
	}
}

.resize-dots {
	$this: &;

	position: relative;
	z-index: 1;
	display: grid;
	pointer-events: none;

	&--only-horizontal {
		.resize-dot {
			display: inline-flex;
			align-items: center;
			width: auto;

			&__visual-trigger {
				display: block;
			}
		}
	}

	&--minHeight {
		.resize-dot {
			&--top {
				padding: $dot-padding $dot-padding 0;
			}

			&--bottom {
				padding: 0 $dot-padding $dot-padding;
			}
		}
	}

	&--minWidth {
		.resize-dot {
			&--right {
				padding: $dot-padding $dot-padding $dot-padding 0;
			}

			&--left {
				padding: $dot-padding 0 $dot-padding $dot-padding;
			}
		}
	}

	&--minSize {
		.resize-dot {
			padding: 0;
		}
	}
}
</style>
