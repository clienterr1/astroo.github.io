<template>
	<div
		class="guides"
		:class="{ 'guides--invisible': !isVisible }"
		:style="computedStyles"
	>
		<div
			v-for="columnIndex in columnCount"
			:key="columnIndex"
			class="guides__guide"
		>
			<div
				v-for="rowindex in rowsCount"
				:key="rowindex"
				class="guides__guide__row"
			/>
		</div>
	</div>
</template>

<script setup>
import { DEFAULT_COLUMN_GAP } from '@zyro-inc/site-modules/components/blocks/layout/constants';

import { computed } from 'vue';

const props = defineProps({
	columnCount: {
		type: Number,
		required: true,
	},
	isVisible: {
		type: Boolean,
		default: true,
	},
	blockHeight: {
		type: Number,
		required: true,
	},
	desktopBlockHeight: {
		type: Number,
		required: true,
	},
	mobileBlockHeight: {
		type: Number,
		required: true,
	},
	snapRowGap: {
		type: Number,
		required: true,
	},
	snapRowHeight: {
		type: Number,
		required: true,
	},
});

const rowsCount = computed(() => Math.round(props.blockHeight / (props.snapRowHeight + props.snapRowGap)));
const computedStyles = computed(() => ({
	'--column-count': props.columnCount,
	'--row-count': rowsCount.value,
	'--column-gap': `${DEFAULT_COLUMN_GAP}px`,
	'--row-height': `${props.snapRowHeight}px`,
	'--row-gap': `${props.snapRowGap}px`,
}));

</script>

<style lang="scss">
.guides {
	display: grid;
	grid-area: 1 / 1 / -1 /-1;
	grid-template-columns: repeat(var(--column-gap), 1fr);
	grid-auto-flow: column;
	grid-column-gap: var(--column-gap);
	border-radius: 3px;
	transition: all 0.15s linear;

	&--invisible {
		opacity: 0;
	}

	&__guide {
		display: grid;
		grid-template-rows: repeat(var(--row-count), var(--row-height));
		grid-row-gap: var(--row-gap);
		background: rgba($color-dark, 0.1);
		border-radius: 3px;
		outline: 2px solid rgba($color-light, 0.1);

		&__row {
			position: relative;
			background: rgba(0, 0, 0, 5%);

			&::after {
				position: absolute;
				top: -2px;
				width: 100%;
				height: calc(100% + 4px);
				content: "";
				border-top: 2px solid rgba($color-light, 0.1);
				border-bottom: 2px solid rgba($color-light, 0.1);
			}
		}
	}
}
</style>
