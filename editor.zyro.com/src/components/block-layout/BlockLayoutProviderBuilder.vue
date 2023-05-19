<template>
	<div
		class="block-layout-container"
		:class="{ 'block-layout-container--overflow-hidden': isMovingElementsBellow }"
		@mouseup="endSelection"
	>
		<BlockLayoutWrapper
			ref="blockLayoutRef"
			class="block-layout"
			:class="{ 'has-zero-m-vertical-padding': isMobileMode }"
			:data-block-ref="blockId"
			:style="layoutCSSVars"
			:is-block-preview-mode="isBlockPreviewMode"
			@mousedown.left="startSelection({
				event: $event,
				blockId
			})"
			@mousemove="updateSelection({
				event: $event,
				layoutElements
			})"
			@mouseup="endSelection"
			@dragenter.prevent
			@dragover.prevent
			@dragleave.prevent
			@drop.prevent="onDrop"
		>
			<LayoutGuideLines
				:is-visible="areLayoutGuideLinesVisible"
				:column-count="columnCount"
				:block-height="blockHeight"
				:desktop-block-height="data.desktop.minHeight"
				:mobile-block-height="data.mobile.minHeight"
				:snap-row-height="snapRowHeight"
				:snap-row-gap="snapRowGap"
			/>

			<!-- vertical line slices layout via X axis and vice versa -->
			<SnappingLines
				v-if="hasMouseMoved && !isElementMovedToOtherBlock && !isMovingElementsBellow"
				:element-position="renderedPosition"
				:y-points="ySnapPoints"
				:x-points="xSnapPoints"
			/>

			<HorizontalGuideline
				v-if="isMovingElementsBellow"
				:top="renderedPosition.top"
			/>

			<DragBox
				v-show="isMultiSelectAreaVisible"
				:position="multiSelectAreaRenderPosition"
				:is-area-selected="isMultiSelectActive"
				:is-dragging="isDragging"
				:data-element-ref="`${blockId}-drag-box`"
				@mousedown.left.stop="startDragBoxDragging"
			/>

			<LayoutElementProviderBuilder
				v-for="element in layoutElements"
				:key="element.elementId"
				:style="activeElementId === element.elementId ? elementCSSVars : null"
				:elements-css-vars="elementsCSSVars"
				class="block-layout__element"
				:is-active="activeElementId === element.elementId && hasMouseMoved"
				:is-active-element-present="!!activeElementId"
				:element-id="element.elementId"
				:block-id="blockId"
				:element-data="element"
				:rendered-position="activeElementId === element.elementId ? renderedPosition : null"
				:is-mobile-view="isMobileMode"
				:is-block-preview-mode="isBlockPreviewMode"
				:multi-selected-elements-ids="multiSelectedElementsIds"
				:lower-elements-ids-relative-to-active="lowerElementsIdsRelativeToActive"
				:current-element-id="currentElementId"
				:is-blocking-resize="getIsElementBlockingResize({ elementId: element.elementId })"
				@mousedown.left.stop="startDraggingElement({ elementId: element.elementId })"
				@element-size-changed="handleElementSizeChange(element.elementId, isMobileMode)"
				@contextmenu="openLayoutElementContextMenu($event, element.elementId)"
				@reset-multi-select="resetMultiSelection"
			>
				<ResizeDots
					v-if="getIsSelectedElementControlsVisible({ elementId: element.elementId }) && isResizeDotVisible"
					:is-element-min-height="isElementMinHeight(element)"
					:is-element-min-width="isElementMinWidth(element)"
					:resize-directions="getResizeDirections(element.type)"
					@start-resizing="startResizingElement(element.elementId, $event)"
				/>
				<OverlayPill
					class="block-layout__element-pill"
					:text="$t(GRID_ELEMENT_TYPE_TRANSLATION[element.type])"
				/>
				<OverlayOutline
					:outline-style="croppedImageId === element.elementId ? 'dashed' : 'solid'"
					:outline-color="getIsElementBlockingResize({ elementId: element.elementId })
						? 'var(--color-primary)'
						: 'var(--color-azure-dark)'
					"
					:class="{ 'overlay-outline--blocked': getIsElementBlockingResize({ elementId: element.elementId }) }"
				/>
				<SpacingHandle
					v-if="getIsSelectedElementControlsVisible({ elementId: element.elementId }) && !isEditingTextBoxElement"
					:element-data="element"
					@mousedown.left.stop="startDraggingElement({
						elementId: element.elementId,
						shouldMoveElementsBellow: true
					})"
				/>
			</LayoutElementProviderBuilder>

			<Teleport to="body">
				<ContextMenuLayoutBlock
					:is-enabled="blockId === selectedLayoutBlockId"
					:is-pasting-allowed="isPastingAllowed"
					:layout-elements="layoutElements"
					:block-id="blockId"
				/>
			</Teleport>
		</BlockLayoutWrapper>
	</div>
</template>

<script>
import BlockLayoutWrapper from '@zyro-inc/site-modules/components/blocks/layout//BlockLayoutWrapper.vue';

import OverlayPill from '@/components/block-grid/OverlayPill.vue';
import OverlayOutline from '@/components/block-layout/OverlayOutline.vue';
import LayoutGuideLines from '@/components/block-layout/LayoutGuideLines.vue';
import SnappingLines from '@/components/block-layout/SnappingLines.vue';
import HorizontalGuideline from '@/components/block-layout/HorizontalGuideline.vue';
import DragBox from '@/components/block-layout/DragBox.vue';
import SpacingHandle from '@/components/block-layout/SpacingHandle.vue';
import {
	LAYOUT_ELEMENT_DEFAULT_MIN_HEIGHT,
	LAYOUT_ELEMENT_DEFAULT_MIN_WIDTH,
	GRID_ELEMENT_TYPE_TRANSLATION,
} from '@/constants';
import {
	ELEMENT_POSITION_KEY_MOBILE,
	ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';
import { useLayout } from '@/components/block-layout/useLayout';
import ResizeDots from '@/components/block-layout/ResizeDots.vue';
import LayoutElementProviderBuilder from '@/components/layout-element/LayoutElementProviderBuilder.vue';
import { useCropImage } from '@/components/layout-element/useCropImage';
import {
	useSectionResizing,
	blockHeightOnResize,
	resizedSectionId,
} from '@/use/useSectionResizing';

import {
	defineComponent,
	computed,
	watch,
} from 'vue';
import { useContextMenu } from '@/components/context-menu/useContextMenu';
import ContextMenuLayoutBlock from '@/components/context-menu/ContextMenuLayoutBlock.vue';
import {
	useStore,
	mapGetters,
} from 'vuex';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';

export default defineComponent({
	name: 'BlockLayoutProviderBuilder',

	components: {
		BlockLayoutWrapper,
		LayoutElementProviderBuilder,
		LayoutGuideLines,
		SnappingLines,
		HorizontalGuideline,
		ResizeDots,
		OverlayPill,
		OverlayOutline,
		ContextMenuLayoutBlock,
		DragBox,
		SpacingHandle,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		isBlockHovered: {
			type: Boolean,
			default: false,
		},
		data: {
			type: Object,
			required: true,
		},
		hoveredBlock: {
			type: Object,
			default: null,
		},
		components: {
			type: Object,
			default: null,
		},
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['set-edit-control-visibility'],
	setup(props, context) {
		const {
			state,
			getters,
		} = useStore();
		const { openContextMenu } = useContextMenu();

		const {
			activeElementId,
			elementCSSVars,
			elementsCSSVars,
			layoutElements,
			layoutCSSVars,
			xSnapPoints,
			ySnapPoints,
			startDraggingElement,
			handleElementSizeChange,
			startResizingElement,
			onDrop,
			getResizeDirections,
			isElementMovedToOtherBlock,
			hasMouseMoved,
			renderedPosition,
			columnCount,
			blockLayoutRef,
			snapRowHeight,
			snapRowGap,
			shouldSnapToGuides,
			isViewingLayoutSettings,
			multiSelectedElementsIds,
			updateMultiSelectedElements,
			isMultiSelecting,
			startSelection,
			updateSelection,
			endSelection,
			isDragging,
			multiSelectAreaRenderPosition,
			isMultiSelectActive,
			resetMultiSelection,
			multiSelectedBlockId,
			lowerElementsIdsRelativeToActive,
			isMovingElementsBellow,
			isDraggingElement,
			sectionResizeBlockingElementId,
		} = useLayout(props, context);

		const { blockingElementId } = useSectionResizing(props);

		const isElementMinHeight = (element) => element.desktop.height === LAYOUT_ELEMENT_DEFAULT_MIN_HEIGHT;

		const isElementMinWidth = (element) => element.desktop.width === LAYOUT_ELEMENT_DEFAULT_MIN_WIDTH;

		const { croppedImageId } = useCropImage();

		const {
			selectedLayoutElementId,
			copiedElementId,
			isElementCut,
			selectedLayoutBlockId,
			copiedLayoutBlockId,
		} = useLayoutContextMenu();

		const isCurrentBlock = computed(() => props.blockId === state.currentBlockId);
		const hoveredBlockId = computed(() => props.hoveredBlock?.id);

		const isMobileMode = computed(() => getters['gui/isMobileMode']);
		const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));

		const isEditingTextBoxElement = computed(() => getters.isEditingTextBoxElement);

		const isViewingCurrentBlockLayoutSettings = computed(() => isCurrentBlock.value && isViewingLayoutSettings.value);

		const isMovingElementInCurrentBlock = computed(() => hasMouseMoved.value && !isElementMovedToOtherBlock.value);

		const isResizeDotVisible = computed(() => !isDraggingElement.value && !isMovingElementsBellow.value);
		const areLayoutGuideLinesVisible = computed(() => shouldSnapToGuides.value
			&& (isViewingCurrentBlockLayoutSettings.value || isMovingElementInCurrentBlock.value));

		const isMultiSelectAreaVisible = computed(() => (isMultiSelecting.value || isMultiSelectActive.value)
			&& multiSelectedBlockId.value === props.blockId);

		const blockHeight = computed(() => {
			if (props.blockId === resizedSectionId.value) {
				return blockHeightOnResize.value;
			}

			return props.data[elementPositionKey.value].minHeight;
		});

		const getIsSelectedElementControlsVisible = ({ elementId }) => croppedImageId.value !== elementId
				&& getters.currentElementId === elementId
				&& blockingElementId.value !== elementId
				&& !isMultiSelectActive.value;

		const getIsElementBlockingResize = ({ elementId }) => blockingElementId.value === elementId
				|| sectionResizeBlockingElementId.value === elementId;

		const startDragBoxDragging = () => {
			startDraggingElement({
				elementId: 'multiSelectArea',
			});
			updateMultiSelectedElements({
				shouldForceUpdate: true,
				layoutElements: layoutElements.value,
			});
		};

		watch(hoveredBlockId, (newHoveredBlock) => {
			if (newHoveredBlock !== props.blockId && isMultiSelecting.value) {
				resetMultiSelection();
			}
		});

		return {
			openContextMenu,
			blockLayoutRef,
			activeElementId,
			elementCSSVars,
			elementsCSSVars,
			layoutElements,
			layoutCSSVars,
			isMobileMode,
			xSnapPoints,
			ySnapPoints,
			startDraggingElement,
			handleElementSizeChange,
			startResizingElement,
			onDrop,
			getResizeDirections,
			isElementMinHeight,
			isElementMinWidth,
			isElementMovedToOtherBlock,
			hasMouseMoved,
			renderedPosition,
			croppedImageId,
			columnCount,
			GRID_ELEMENT_TYPE_TRANSLATION,
			blockingElementId,
			selectedLayoutBlockId,
			selectedLayoutElementId,
			copiedElementId,
			isElementCut,
			context,
			props,
			copiedLayoutBlockId,
			snapRowHeight,
			snapRowGap,
			areLayoutGuideLinesVisible,
			startSelection,
			updateSelection,
			endSelection,
			multiSelectedElementsIds,
			updateMultiSelectedElements,
			isMultiSelectActive,
			multiSelectAreaRenderPosition,
			isMultiSelectAreaVisible,
			isDragging,
			resetMultiSelection,
			getIsSelectedElementControlsVisible,
			startDragBoxDragging,
			lowerElementsIdsRelativeToActive,
			isEditingTextBoxElement,
			blockHeight,
			isMovingElementsBellow,
			isResizeDotVisible,
			getIsElementBlockingResize,
		};
	},

	computed: {
		...mapGetters([
			'siteElements',
			'isEditingTextBoxElement',
			'currentElementId',
		]),
		copiedElementData() {
			return this.siteElements[this.copiedElementId] || null;
		},
		isPastingAllowed() {
			return this.copiedElementData !== null;
		},
		isHiddenDesktop() {
			return !this.isMobileView && !!this.data.desktop?.isHidden;
		},
		isHiddenMobile() {
			return this.isMobileView && !!this.data.mobile?.isHidden;
		},
	},

	methods: {
		openLayoutElementContextMenu(e, id) {
			if (this.isEditingTextBoxElement) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			this.openContextMenu(e);
			this.selectedLayoutElementId = id;
			this.selectedLayoutBlockId = null;
		},

	},
});
</script>
<style lang="scss" scoped>
.block-layout-container {
	position: relative;
	z-index: $z-index-site-engine-block-grid;

	&--overflow-hidden {
		overflow: hidden;
	}
}

.block-layout {
	position: relative;

	$this: &;

	&__element {
		position: relative;

		&:hover {
			#{$this}__element-pill {
				&#{&} {
					display: flex;
				}
			}
		}
	}

	&__element-pill {
		&#{&} {
			position: absolute;
			top: -11px;
			left: 15px;
			z-index: $z-index-layout-element-pill;
			display: none;
		}
	}

	.overlay-outline {
		&--blocked {
			// height subtraction is needed so that outline wouldn't overlap section border
			height: calc(100% - 4px);
		}
	}
}
</style>
