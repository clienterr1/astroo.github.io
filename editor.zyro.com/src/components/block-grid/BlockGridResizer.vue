<template>
	<div
		v-if="position"
		class="grid-resizer"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_GRID_RESIZER"
		:class="{ 'grid-resizer--only-outer-borders': isEditingTextBox }"
		:style="computedStyles"
	>
		<div class="grid-resizer__outline" />
		<template
			v-if="resizeVisible"
			@mousedown.stop
		>
			<div
				v-for="triggerPosition in $options.positions"
				:key="triggerPosition"
				class="grid-resizer__handle"
				:class="triggerPosition"
				@mousedown="$emit('trigger-resize', $event, triggerPosition)"
			>
				<div :class="`${triggerPosition}__dot`" />
			</div>
		</template>
	</div>
</template>

<script>
import {
	mapGetters,
	mapState,
} from 'vuex';

import { defineComponent } from 'vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_GRID_RESIZER,
} from '@zyro-inc/site-modules/constants';

const positions = [
	'top',
	'right',
	'bottom',
	'left',
	'topLeft',
	'topRight',
	'bottomLeft',
	'bottomRight',
];

export default defineComponent({
	positions,

	props: {
		position: {
			type: [
				Object,
				String,
			],
			default: null,
		},
		resizeVisible: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_GRID_RESIZER,
		};
	},
	computed: {
		...mapState(['isElementEditMode']),
		...mapGetters(['currentElement']),
		computedStyles() {
			const { position } = this;

			if (typeof position === 'object') {
				return `--position: ${position.y1}/${position.x1}/${position.y2}/${position.x2};`;
			}

			return `--position: ${position}`;
		},
		isEditingTextBox() {
			return this.currentElement && this.currentElement?.type === 'GridTextBox' && this.isElementEditMode;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "BlockGridResizer";

.grid-resizer {
	position: relative;
	grid-area: var(--position);
}
</style>
