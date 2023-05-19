<template>
	<div
		v-if="info"
		class="grid-ghost"
		:class="{
			'grid-ghost--use-border': useBorder,
			'grid-ghost--hovered': isBlockHovered && !isBlockSelected,
			'grid-ghost--selected': isBlockSelected,
		}"
		:style="computedStyles"
	>
		<div
			class="grid-ghost__overlay"
			:class="{ 'grid-ghost__overlay--no-overflow': disablePillOverflow }"
		>
			<OverlayNps
				v-if="isOverlayNpsVisible || isOverlayNpsOpened"
				@overlay-nps-opened="handleOverlayOpen"
			/>
			<OverlayPill
				v-if="isHoveredBlockTitleShown"
				:text="info.title"
				background-color="var(--hover-color)"
			/>
			<OverlayPill
				v-if="isBlockSelected"
				:text="info.title"
				:background-color="info.color"
			>
				<ZyroSvgDeprecated name="check-mark" />
			</OverlayPill>
		</div>
	</div>
</template>

<script>
import {
	mapGetters,
	mapActions,
} from 'vuex';
import OverlayPill from '@/components/block-grid/OverlayPill.vue';
import OverlayNps from '@/components/ui/OverlayNps.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		OverlayPill,
		OverlayNps,
		ZyroSvgDeprecated,
	},

	props: {
		info: {
			validator: (prop) => typeof prop === 'object' || prop === null,
			required: true,
		},
		disablePillOverflow: {
			type: Boolean,
			default: false,
		},
		useBorder: {
			type: Boolean,
			default: false,
		},
		blockId: {
			type: String,
			required: true,
		},
		isDraggingOver: {
			type: Boolean,
			required: false,
		},
		isBlockSelected: {
			type: Boolean,
			default: false,
		},
		isBlockHovered: {
			type: Boolean,
			default: false,
		},
		isOverlayNpsVisible: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['overlay-nps-opened'],

	data() {
		return {
			isOverlayNpsOpened: false,
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
		computedStyles() {
			const {
				y1,
				x1,
				y2,
				x2,
				color,
			} = this.info;

			return {
				'--position': `${y1}/${x1}/${y2}/${x2}`,
				'--outline-color': color,
				'--hover-color': 'var(--color-azure-dark)',
			};
		},
		isHoveredBlockTitleShown() {
			return !this.isBlockSelected && (this.isDraggingOver || this.isBlockHovered);
		},
	},
	methods: {
		...mapActions(['updateCurrentBlockId']),
		handleOverlayOpen(event) {
			this.isOverlayNpsOpened = event;

			this.updateCurrentBlockId(this.blockId);
			this.$emit('overlay-nps-opened', event);
		},
	},
});
</script>

<style lang="scss" scoped>
.grid-ghost {
	position: relative;
	z-index: $z-index-controls-grid-ghost;
	grid-area: var(--position);
	pointer-events: none;

	$border: 2px solid var(--outline-color, $color-azure);

	outline: $border;

	&--use-border {
		border: $border;
		outline: none;
	}

	&--selected {
		border: 2px solid $color-azure;
	}

	&--hovered {
		border: 2px solid var(--hover-color);
	}

	&__overlay {
		position: absolute;
		top: -14px;
		left: 15px;
		z-index: $z-index-controls-edit-block-line;
		display: flex;
		align-items: center;

		&--no-overflow {
			top: 4px;
		}
	}
}
</style>
