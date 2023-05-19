<template>
	<div
		ref="controls"
		class="controls"
		:style="computedStyles"
		:class="{
			'is-selected': isBlockSelected,
			'is-dragging-over': isDraggingOver,
		}"
	>
		<slot />
		<BlockHidden
			v-if="isHidden"
			@button-click="$emit('unhide-block')"
		/>
		<div
			class="controls__selection"
			:class="{ 'controls__selection--overlay-nps-opened': isOverlayNpsOpened }"
		>
			<BlockGridElementInfoOverlay
				use-border
				:disable-pill-overflow="isFirst"
				:info="blockSelectionInfo"
				:block-id="blockId"
				:is-block-selected="isBlockSelected"
				:is-block-hovered="isBlockHovered"
				:is-dragging-over="isDraggingOver"
				:is-overlay-nps-visible="isOverlayNpsVisible"
				@overlay-nps-opened="isOverlayNpsOpened = $event"
			/>
		</div>
		<AddBlockButton
			v-if="isAddBlockButtonVisible"
			class="controls__add-block"
			:block-id="blockId"
		/>
		<div class="controls__resize-handle-container">
			<ZyroTooltip
				position="top"
				toggle-event="hover"
				:hide-tooltip="isMobileMode || isHoveredBlockLocked"
				:use-portal="false"
				content-position="absolute"
				:forced-position="{
					right: '-35px',
					bottom: '30px',
					'white-space': 'nowrap'
				}"
			>
				<template #trigger>
					<Component
						:is="resizeHandleComponent"
						v-if="isResizeHandleVisible"
						class="controls__resize-handle"
						:block-id="blockId"
						:block-height="getBlockDOMHeight()"
						@lock-hovered-block="$emit('lock-hovered-block', $event)"
						@set-edit-control-visibility="$emit('set-edit-control-visibility', $event)"
					/>
				</template>
				<p class="controls__resize-handle-text z-body-small">
					{{ $t("builder.sectionControlLine.text") }}
				</p>
			</ZyroTooltip>
		</div>
	</div>
</template>

<script>
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';
import {
	blockHeightOnResize,
	resizedSectionId,
} from '@/use/useSectionResizing';

import {
	mapState,
	mapGetters,
} from 'vuex';

import BlockHidden from '@/components/block/BlockHidden.vue';

import BlockGridElementInfoOverlay from '@/components/block-grid/BlockGridElementInfoOverlay.vue';
import AddBlockButton from '@/components/builder-controls/control-line/AddBlockButton.vue';
import ResizeBlockHandle from '@/components/builder-controls/control-line/ResizeBlockHandle.vue';
import ResizeBlockLayoutHandle from '@/components/builder-controls/control-line/ResizeBlockLayoutHandle.vue';

import { defineComponent } from 'vue';

const RESIZABLE_BLOCK_TYPES = [
	'BlockGrid',
	'BlockSlideshow',
	'BlockLayout',
	'BlockImageSlideshow',
];

export default defineComponent({
	components: {
		ZyroTooltip,
		BlockGridElementInfoOverlay,
		BlockHidden,
		AddBlockButton,
		ResizeBlockHandle,
		ResizeBlockLayoutHandle,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		blockType: {
			type: String,
			default: null,
		},
		isHidden: {
			type: Boolean,
			default: false,
		},
		isFirst: {
			type: Boolean,
			required: false,
		},
		isHoveredBlockLocked: {
			type: Boolean,
			default: false,
		},
		isBlockSelected: {
			type: Boolean,
			default: false,
		},
		slotName: {
			type: String,
			default: null,
		},
		isDraggingOver: {
			type: Boolean,
			default: false,
		},
		isBlockHovered: {
			type: Boolean,
			default: false,
		},
		transparentHeaderHeight: {
			type: Number,
			default: 0,
		},
	},

	data() {
		return {
			isOverlayNpsOpened: false,
		};
	},

	computed: {
		...mapState('gui', ['isMobileScreen']),
		...mapGetters('gui', ['isMobileMode']),
		...mapGetters('flags', ['isLayoutOnly']),
		sectionTitle() {
			if (this.blockType === 'BlockBlogHeader') {
				return this.$t('common.postHeader');
			}

			if (this.slotName === 'footer') {
				return this.$t('common.footer');
			}

			if (this.slotName === 'navigation') {
				return this.$t('common.header');
			}

			return this.$t('common.section');
		},
		isOverlayNpsVisible() {
			return this.blockType === 'BlockLayout' && this.isBlockHovered && !this.isDraggingOver;
		},
		blockSelectionInfo() {
			const color = this.slotName === 'footer' ? 'var(--color-primary)' : 'var(--color-azure-dark)';

			return {
				y1: 0,
				y2: 0,
				x1: 0,
				x2: 0,
				title: this.sectionTitle,
				color,
			};
		},
		isAddBlockButtonVisible() {
			if (this.isLayoutOnly && this.isMobileMode) {
				return false;
			}

			const isFooterBlock = this.slotName === 'footer';

			return this.isMobileScreen || (!isFooterBlock && this.isBlockHovered) || (isFooterBlock && this.isFirst);
		},
		computedStyles() {
			return {
				'--block-height-on-resize': blockHeightOnResize.value && resizedSectionId.value === this.blockId ? `${blockHeightOnResize.value + this.transparentHeaderHeight}px` : null,
			};
		},
		resizeHandleComponent() {
			return [
				'BlockLayout',
				'BlockImageSlideshow',
			].includes(this.blockType) ? 'ResizeBlockLayoutHandle' : 'ResizeBlockHandle';
		},
		isResizeHandleVisible() {
			if (this.blockType === 'BlockLayout' || this.blockType === 'BlockImageSlideshow') {
				return RESIZABLE_BLOCK_TYPES.includes(this.blockType) && this.isBlockHovered;
			}

			return RESIZABLE_BLOCK_TYPES.includes(this.blockType) && this.isBlockHovered && !this.isMobileMode;
		},
	},

	methods: {
		getBlockDOMHeight() {
			return Number.parseInt(this.$refs.controls.clientHeight, 10);
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.controls {
	$this: &;

	position: relative;
	display: grid;
	cursor: pointer;

	&__resize-handle-container {
		position: absolute;
		z-index: $z-index-controls-edit; // button container should be above block edit level
		align-self: end;
		justify-self: center;
		width: 100%;
		max-width: 1200px;
	}

	&__resize-handle {
		position: absolute;
		right: 0;
		z-index: $z-index-controls-edit;

		@include site-engine-mobile {
			right: 5px;
		}
	}

	&__resize-handle-text {
		margin: 0;
	}

	&__selection {
		position: absolute;
		top: 0;
		left: 0;
		z-index: $z-index-controls-block-selection;
		display: none;
		width: 100%;
		height: 100%;
		pointer-events: none;

		&--overlay-nps-opened {
			z-index: $z-index-controls-popup-card;
		}
	}

	&:hover,
	&.is-selected,
	&.is-dragging-over {
		#{$this}__selection {
			display: grid;
		}
	}

	&__add-block {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: $z-index-controls-section-line;
		display: flex;
		justify-content: center;
		pointer-events: none;
		transform: translateY(50%);
	}
}

@include site-engine-mobile {
	.controls {
		&__resize-handle {
			right: 16px;
		}
	}
}
</style>
