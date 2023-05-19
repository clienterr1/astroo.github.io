<template>
	<div
		ref="gridContainer"
		class="block-grid"
		data-qa="builder-section-grid"
		:style="computedStyles"
		:class="{
			'block-grid__add-element-active' : eventInfo && eventInfo.addElementActive,
			'has-zero-m-vertical-padding': isMobileMode
		}"
		@dragenter.prevent="onDragEnter"
		@dragover.prevent="onDragEnter"
		@dragleave.prevent="onDragLeave"
		@drop.prevent="onDrop($event)"
		@contextmenu="openGridBlockContextMenu($event, blockId)"
	>
		<div
			v-show="showLayoutHelpers"
			class="block-grid__center-line"
		/>

		<HeightController
			v-if="isMobileMode"
			:value="topPadding"
			:is-resizable="isBlockHovered"
			@start-resizing="onHeightControllerStart"
			@stop-resizing="topPadding = $event, onHeightControllerStop()"
			@select-current-block="selectCurrentBlock"
		/>

		<!-- Use wrapper div for mobile or sorting breaks -->
		<template v-if="!isMobileMode || isBlockPreviewMode">
			<BlockGridItem
				v-for="(elementId) of blockElements"
				:id="elementId"
				:key="`${elementId}-element-desktop`"
				:ref="`item-${elementId}`"
				:data="getElementData(elementId)"
				class="block-grid__item"
				:use-m-margin="!isBlockHovered"
				:style="{ '--element-z-index': data.zindexes.indexOf(elementId) + 1 }"
				:block-data="data"
				@mousedown="startMovingGridElement($event, elementId)"
				@mouseenter="hoveredElementId = elementId"
				@mouseleave="hoveredElementId = null"
				@update-height="changeElementHeight($event)"
				@set-height="changeElementHeight($event, true)"
				@contextmenu.stop="openElementContextMenu($event, elementId)"
			/>
		</template>
		<Draggable
			v-else
			v-model="blockElements"
			animation="150"
			:item-key="blockId"
			ghost-class="dragged-element"
			:delay-on-touch-only="true"
			:prevent-on-filter="false"
			:disabled="isEditingTextBoxElement"
			filter=".height-controller, .grid-resizer__outline, .right, .left"
			fallback-axis="y"
			:force-fallback="true"
			:delay="200"
			:fallback-tolerance="1"
			@start="handleDragStart"
			@sort="handleDragSort"
			@end="handleDragEnd"
		>
			<template #item="{ element: elementId }">
				<div
					:key="`${elementId}-wrapper`"
					class="block-grid__item-wrapper"
					@mousedown.self="selectCurrentBlock"
				>
					<div
						class="block-grid__item"
						:class="{ 'is-selected': currentElementId === elementId }"
						:style="alignmentStyles(elementId)"
						@mouseenter="hoveredElementId = elementId"
						@mouseleave="hoveredElementId = null"
					>
						<BlockGridItem
							:id="elementId"
							:key="`${elementId}-element`"
							:ref="`item-${elementId}`"
							:data="getElementData(elementId)"
							class="block-grid__item--inner"
							:use-m-margin="!isBlockHovered"
							:style="{ '--element-z-index': data.zindexes.indexOf(elementId) + 1 }"
							:block-data="data"
							@start-resizing="onHeightControllerStart"
							@stop-resizing="onHeightControllerStop"
						/>
						<OverlayPill
							class="block-grid__item-pill"
							:text="$t(GRID_ELEMENT_TYPE_TRANSLATION[siteElements[elementId].type])"
						/>
					</div>
					<HeightController
						v-if="isMobileMode
							&& isBlockHovered
							&& elementId !== blockElements[blockElements.length - 1]"
						:key="`${elementId}-margin`"
						:is-resizable="isBlockHovered"
						class="height-controller"
						:value="getElementBottomMargin(elementId)"
						@start-resizing="onHeightControllerStart"
						@stop-resizing="updateElementBottomMargin(elementId, $event), onHeightControllerStop()"
						@select-current-block="selectCurrentBlock"
					/>
				</div>
			</template>
		</Draggable>
		<EmptyBlockWarning v-if="showEmptyBlock" />

		<BlockGridPattern
			v-show="showLayoutHelpers"
			:id="blockId"
			:column-width="columnWidth"
			:data="data"
		/>

		<BlockGridElementInfoOverlay
			v-if="isOverlayTriggeredByThisGridBlock"
			:info="hoveredElementInfo"
			:block-id="blockId"
		/>

		<BlockGridResizer
			:position="gridResizerPosition"
			:resize-visible="!eventInfo"
			@trigger-resize="startResizingGridElement"
		/>
		<HeightController
			v-if="isMobileMode"
			:value="bottomPadding"
			:is-resizable="isBlockHovered"
			@stop-resizing="bottomPadding = $event, onHeightControllerStop()"
			@start-resizing="onHeightControllerStart"
			@select-current-block="selectCurrentBlock"
		/>
		<Teleport to="body">
			<ContextMenuGridBlock
				:is-rendering-allowed="blockId === rightClickedGridBlockId"
				:is-pasting-allowed="!copiedElementData"
				@paste-element="pasteElement"
			/>
		</Teleport>
	</div>
</template>

<script>
import * as Sentry from '@sentry/browser';
import cloneDeep from 'lodash.clonedeep';
import Draggable from 'vuedraggable';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import {
	DEFAULT_GRID_CONTENT_PADDING,
	DEFAULT_GRID_COLUMN_COUNT,
	DEFAULT_GRID_WIDTH,
} from '@zyro-inc/site-modules/constants/defaultStyles';
import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';

import { addElementEvents } from '@/components/block-grid/BlockGridEvents';

import EventLogApi from '@/api/EventLogApi';
import BlockGridItem from '@/components/block-grid-item/BlockGridItem.vue';
import BlockGridElementInfoOverlay from '@/components/block-grid/BlockGridElementInfoOverlay.vue';
import BlockGridPattern from '@/components/block-grid/BlockGridPattern.vue';
import BlockGridResizer from '@/components/block-grid/BlockGridResizer.vue';
import EmptyBlockWarning from '@/components/block-grid/EmptyBlockWarning.vue';
import HeightController from '@/components/block-grid/HeightController.vue';
import OverlayPill from '@/components/block-grid/OverlayPill.vue';
import ContextMenuGridBlock from '@/components/context-menu/ContextMenuGridBlock.vue';
import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { useGridContextMenu } from '@/components/context-menu/useGridContextMenu';
import { eventNames } from '@/data/analyticEventList';
import { generateRandomId } from '@/utils/generateRandomId';
import { snapPositionToGrid } from '@/utils/snapPositionToGrid';
import { GRID_ELEMENT_TYPE_TRANSLATION } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		Draggable,
		BlockGridItem,
		BlockGridPattern,
		BlockGridElementInfoOverlay,
		BlockGridResizer,
		HeightController,
		EmptyBlockWarning,
		ContextMenuGridBlock,
		OverlayPill,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		components: {
			type: Object,
			default: null,
		},
		isBlockHovered: {
			type: Boolean,
			default: false,
		},
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'update-mobile-padding',
		'rows-changed',
		'lock-hovered-block',
		'set-edit-control-visibility',
		'drag-status-change',
	],

	setup() {
		const {
			openContextMenu,
			mouseEventRaw,
		} = useContextMenu();
		const {
			rightClickedElementId,
			copiedElementId,
			isElementCut,
			rightClickedGridBlockId,
		} = useGridContextMenu();

		return {
			openContextMenu,
			mouseEventRaw,
			rightClickedElementId,
			rightClickedGridBlockId,
			copiedElementId,
			isElementCut,
			GRID_ELEMENT_TYPE_TRANSLATION,
		};
	},

	data() {
		return {
			eventInfo: null,
			hoveredElementId: null,
			resizeObserverBody: null,
			resizeObserverGrid: null,
			columnWidth: 0,
			gridHeightInRows: 0,
		};
	},

	computed: {
		...mapState([
			'currentElementId',
			'isElementEditMode',
		]),
		...mapState('gui', [
			'isMobileView',
			'isMobileScreen',
			'blockResizeInfo',
		]),
		...mapState('user', ['user']),
		...mapGetters([
			'siteBlocks',
			'siteElements',
			'siteForms',
			'currentElement',
			'isEditingTextBoxElement',
			'elementBlockId',
		]),
		...mapGetters('gui', ['isMobileMode']),
		copiedElementData() {
			return this.siteElements[this.copiedElementId] || null;
		},
		settings() {
			return this.data.settings;
		},
		styles() {
			return this.settings.styles;
		},
		// TEMPORARY. If element is missing, log Sentry event and return only existing elements.
		// This should be moved to the store getter
		blockElements() {
			const allElements = this.components ?? this.siteElements;
			const missingElements = this.data.components.filter((id) => !allElements[id]);

			if (missingElements.length) {
				Sentry.captureException(new Error(`Missing elements: ${missingElements.join(',')}`), {
					tags: {
						errorType: 'Invalid data.json',
					},
				});
			}

			return this.data.components.filter((id) => allElements[id]);
		},
		computedStyles() {
			return {
				'--current-grid-height': this.gridHeightInRows,
			};
		},
		showEmptyBlock() {
			return this.siteBlocks[this.blockId]?.components.length === 0
				&& !this.data.background.current
				&& !(this.eventInfo && this.eventInfo.addElementActive);
		},
		showLayoutHelpers() {
			return (this.blockResizeInfo
				&& (this.blockResizeInfo.blockId === this.blockId || this.eventInfo))
				&& !this.isMobileScreen && !this.isMobileView;
		},
		topPadding: {
			set(newValue) {
				const padding = parseCSSSides(this.styles['m-block-padding'] || '0');

				padding.top = `${newValue}px`;
				const updatedPadding = Object.values(padding).join(' ');

				this.$emit('update-mobile-padding', updatedPadding);
				this.updateBlockData({
					blockId: this.blockId,
					blockData: {
						settings: {
							styles: {
								'm-block-padding': updatedPadding,
							},
						},
					},
					pushToHistory: true,
					merge: true,
				});
			},
			get() {
				return Number.parseInt(parseCSSSides(this.styles['m-block-padding'] || '0').top, 10);
			},
		},
		bottomPadding: {
			set(newValue) {
				const padding = parseCSSSides(this.styles['m-block-padding'] || '0');

				padding.bottom = `${newValue}px`;
				const updatedPadding = Object.values(padding).join(' ');

				this.$emit('update-mobile-padding', updatedPadding);

				this.updateBlockData({
					blockId: this.blockId,
					blockData: {
						settings: {
							styles: {
								'm-block-padding': updatedPadding,
							},
						},
					},
					pushToHistory: true,
					merge: true,
				});
			},
			get() {
				return Number.parseInt(parseCSSSides(this.styles['m-block-padding'] || '0').bottom, 10);
			},
		},
		isOverlayTriggeredByThisGridBlock() {
			return this.data.components.includes(this.hoveredElementInfo?.elementId);
		},
		hoveredElementInfo() {
			if (this.blockResizeInfo?.elementId) {
				const position = this.gridAreaToArray(this.siteElements[this.blockResizeInfo.elementId].settings.styles.position);

				return {
					elementId: this.blockResizeInfo.elementId,
					y1: position[0],
					x1: position[1],
					y2: position[2],
					x2: position[3],
					color: this.blockResizeInfo.outlineColor,
				};
			}

			if (!this.hoveredElementId
				|| this.eventInfo
				|| !this.siteElements[this.hoveredElementId]
				|| this.hoveredElementId === this.currentElementId
				|| this.isMobileView
				|| this.isMobileScreen) {
				return null;
			}

			const position = this.gridAreaToArray(this.siteElements[this.hoveredElementId].settings.styles.position);

			return {
				title: this.$t(GRID_ELEMENT_TYPE_TRANSLATION[this.siteElements[this.hoveredElementId].type]) || 'Item',
				elementId: this.hoveredElementId,
				y1: position[0],
				x1: position[1],
				y2: position[2],
				x2: position[3],
			};
		},
		gridResizerPosition() {
			if (this.isMobileMode) {
				return null;
			}

			if (this.eventInfo) {
				return this.eventInfo.gridResizerPosition;
			}

			if (this.blockElements.includes(this.currentElementId)) {
				/**
				 * * currentElement getter is somehow not always reactive here
				 * * and position gets out of sync after misc actions
				 * * e.g. adding a section and then moving an element in that section
				 */
				const currentElement = this.siteElements[this.$store.state.currentElementId];

				return currentElement.settings.styles.position;
			}

			return null;
		},
	},

	watch: {
		// assign default background color only when `showEmptyBlock` turns from true to false
		showEmptyBlock(currentState, previousState) {
			if (this.siteBlocks[this.blockId] && previousState && !currentState && !this.data.background.current) {
				this.updateBlockData({
					blockId: this.blockId,
					blockData: {
						background: {
							color: 'rgb(255, 255, 255)',
							current: 'color',
						},
					},
					merge: true,
				});
			}
		},
		// You can remove an element when its being dragged/resized by using undo/redo keyboard shortcuts
		// This fixes errors that occur when the element is removed while being dragged/resized
		siteElements(newSiteElements) {
			// If event is active
			if (this.eventInfo) {
				// If event element is still in site elements remove event listeners
				if (!newSiteElements[this.eventInfo.id]) {
					this.resetEventInfo();
				}
			}
		},
	},

	mounted() {
		this.updateColumnWidth();
		this.updateGridHeightInRows();

		// Watch body size
		this.resizeObserverBody = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				this.updateColumnWidth();
			});
		});

		// Watch grid size
		this.resizeObserverGrid = new ResizeObserver(() => {
			requestAnimationFrame(() => {
				this.updateColumnWidth();
				this.updateGridHeightInRows();
				this.$emit('rows-changed', this.gridHeightInRows);
			});
		});

		this.resizeObserverBody.observe(document.body);
		this.resizeObserverGrid.observe(this.$refs.gridContainer);
	},

	beforeUnmount() {
		this.resizeObserverBody.disconnect();
		this.resizeObserverGrid.disconnect();
	},

	methods: {
		...mapActions([
			'selectCurrentElement',
			'unselectCurrentElement',
			'addElement',
			'removeElement',
			'updateBlockData',
			'mergeElementData',
		]),
		handleDragStart() {
			this.$emit('lock-hovered-block', true);
			this.unselectCurrentElement();
		},
		handleDragSort(event) {
			const items = cloneDeep(this.siteBlocks[this.blockId].components);
			const oldItem = items[event.oldIndex];

			items.splice(event.oldIndex, 1);
			items.splice(event.newIndex, 0, oldItem);

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					components: items,
				},
				merge: true,
			});
		},
		handleDragEnd() {
			this.$emit('lock-hovered-block', false);
		},
		pasteElement() {
			if (this.copiedElementData) {
				const elementData = cloneDeep(this.copiedElementData);

				// Get event data
				const splitPosition = this.gridAreaToArray(elementData.settings.styles.position);
				const width = splitPosition[3] - splitPosition[1];
				const height = splitPosition[2] - splitPosition[0];

				const mousePositionOnGrid = this.isMobileMode ? {
					column: 1,
					row: 1,
				} : this.getMousePositionOnGrid(this.mouseEventRaw);
				const {
					column,
					row,
				} = mousePositionOnGrid;

				const position = snapPositionToGrid({
					position: {
						x1: column,
						x2: column + width,
						y1: row,
						y2: row + height,
					},
					columnCount: DEFAULT_GRID_COLUMN_COUNT,
				});

				elementData.settings.styles.position = `${position.y1}/${position.x1}/${position.y2}/${position.x2}`;

				const id = generateRandomId();

				this.addElement({
					blockId: this.blockId,
					elementId: id,
					elementData,
				});

				if (this.isElementCut) {
					this.removeElement({
						elementId: this.copiedElementId,
					});
					this.isElementCut = null;
					this.copiedElementId = null;
				}

				this.onAfterElementAdd(id);
			}
		},
		async onAfterElementAdd(id, eventData) {
			await this.$nextTick();

			this.selectCurrentElement({
				elementId: id,
			});
			this.$emit('set-edit-control-visibility', true);

			this.eventInfo = null;
			if (eventData) {
				this.logAddElementEvent(eventData);
			}
		},
		openElementContextMenu(e, id) {
			if (this.isEditingTextBoxElement) {
				return;
			}

			e.preventDefault();
			this.openContextMenu(e);
			this.rightClickedElementId = id;
			this.rightClickedGridBlockId = null;
		},
		openGridBlockContextMenu(e, id) {
			if (this.isCurrentlyEditingTextElement) {
				return;
			}

			e.preventDefault();
			this.openContextMenu(e);
			this.rightClickedGridBlockId = id;
		},
		// util to check if currently dragged element has required custom event property (elementId)
		validateDragDrop(event) {
			const canBeDragDropped = event.dataTransfer.getData('elementId');

			if (!canBeDragDropped) {
				event.preventDefault();
			}

			return canBeDragDropped;
		},
		// Mobile spacing control
		getElementBottomMargin(elementId) {
			// Use bottom margin if available
			if (this.siteElements[elementId].settings.styles['m-element-margin']) {
				return Number.parseInt(
					parseCSSSides(
						this.siteElements[elementId].settings.styles['m-element-margin'],
					).bottom,
					10,
				);
			}
			// Fallback to 0

			return 0;
		},
		updateElementBottomMargin(elementId, spacing) {
			this.mergeElementData({
				elementId,
				elementData: {
					settings: {
						styles: {
							'm-element-margin': `0 0 ${spacing}px 0`,
						},
					},
				},
				pushToHistory: true,
			});
		},
		onHeightControllerStart() {
			this.$emit('lock-hovered-block', true);
			this.$emit('set-edit-control-visibility', false);
		},
		onHeightControllerStop() {
			this.$emit('lock-hovered-block', false);
			this.$emit('set-edit-control-visibility', true);
		},
		// Grid control
		pxToRows(value, roundToUpper = false) {
			// Get values
			const rowSize = Number.parseInt(this.styles['row-size'], 10);
			const rowGap = Number.parseInt(this.styles['row-gap'], 10);
			const increaseHeight = roundToUpper ? 0.5 : 0;
			// Calculate

			return Math.round((value / (rowSize + rowGap)) + increaseHeight);
		},
		pxToColumns(value) {
			// Calculate
			return Math.round(value / (this.columnWidth + Number.parseInt(this.styles['column-gap'], 10)));
		},
		gridAreaToArray(position) {
			// Converts grid-area: 0/1/2/3 to an array [0,1,2,3]
			return position.split('/').map(Number);
		},
		changeElementHeight(elementId, allowLowerHeight = false) {
			if (this.eventInfo || this.isMobileMode) {
				return;
			}

			const element = this.$refs[`item-${elementId}`][0].$refs.element.$el;
			const newHeightInRows = this.pxToRows(element.scrollHeight, true);
			// Converts grid-area: 0/1/2/3 to an array [0,1,2,3]
			const originalPosition = this.gridAreaToArray(this.siteElements[elementId].settings.styles.position);
			const addRows = newHeightInRows - (originalPosition[2] - originalPosition[0]);

			if (addRows > 0) {
				originalPosition[2] += addRows;
			}

			const newBottom = allowLowerHeight
				? newHeightInRows + originalPosition[0] : originalPosition[2];

			// eslint-disable-next-line max-len, vue/max-len
			this.siteElements[elementId].settings.styles.position = `${originalPosition[0]}/${originalPosition[1]}/${newBottom}/${originalPosition[3]}`;
		},
		shouldPreventGridLayoutChange(event) {
			// button 2 is right click, prevents opening context menu from starting drag/resize action
			return this.isMobileMode || event.button === 2;
		},
		startResizingGridElement(event, direction) {
			if (this.shouldPreventGridLayoutChange(event)) {
				return;
			}

			const element = this.$refs[`item-${this.currentElementId}`][0].$el;

			this.eventInfo = {
				x: event.clientX,
				y: event.clientY,
				id: this.currentElementId,
				element,
				gridResizerPosition: null,
				direction,
				originalHeight: element.clientHeight,
				originalWidth: element.clientWidth,
				originalPosition: this.gridAreaToArray(this.siteElements[this.currentElementId].settings.styles.position),
			};
			this.eventInfo.gridResizerPosition = this.calculateGridElementPosition(event);
			this.$emit('set-edit-control-visibility', false);
			this.eventInfo.element.style.setProperty('--event-background-color', 'var(--color-gray)');

			window.addEventListener('mousemove', this.resizeGridElement);
			window.addEventListener('mouseup', this.stopResizingGridElement);
		},
		resizeGridElement(event) {
			const newPosition = {
				y1: this.eventInfo.originalPosition[0],
				x1: this.eventInfo.originalPosition[1],
				y2: this.eventInfo.originalPosition[2],
				x2: this.eventInfo.originalPosition[3],
			};

			let eventMouseMovedX = event.clientX - this.eventInfo.x;
			let eventMouseMovedY = event.clientY - this.eventInfo.y;

			// When grabbed by left resize thingie, negative value increases width
			const xIsInverted = this.eventInfo.direction.toLowerCase().includes('left') ? 1 : -1;

			// Limit width to minimum 1 column
			if (this.eventInfo.originalWidth - eventMouseMovedX * xIsInverted < this.columnWidth) {
				eventMouseMovedX = (this.eventInfo.originalWidth - this.columnWidth) * xIsInverted;
			}

			// When grabbed by left resize thingie, negative value increases width
			const yIsInverted = this.eventInfo.direction.toLowerCase().includes('top') ? 1 : -1;
			// Limit height to minimum 1 row
			const rowSize = Number.parseInt(this.styles['row-size'], 10);

			if (this.eventInfo.originalHeight - eventMouseMovedY * yIsInverted < rowSize) {
				eventMouseMovedY = (this.eventInfo.originalHeight - rowSize) * yIsInverted;
			}

			// Limit top resize to grid top
			const rowGap = Number.parseInt(this.styles['row-gap'], 10);
			const maxResizeToTop = (newPosition.y1 - 1) * (rowSize + rowGap);

			if (eventMouseMovedY * yIsInverted < 0) {
				eventMouseMovedY = Math.max(-maxResizeToTop, eventMouseMovedY);
			}

			const movedCols = this.pxToColumns(eventMouseMovedX);
			const movedRows = this.pxToRows(eventMouseMovedY);

			switch (this.eventInfo.direction) {
			case 'right':
				newPosition.x2 += movedCols;
				// TODO: Check if styles can be easily bound
				this.eventInfo.element.style.setProperty('--width-x', `${eventMouseMovedX}px`);
				break;
			case 'left':
				newPosition.x1 += movedCols;
				this.eventInfo.element.style.setProperty('--width-x', `${-eventMouseMovedX}px`);
				this.eventInfo.element.style.setProperty('--moved-x', `${eventMouseMovedX}px`);
				break;
			case 'bottom':
				newPosition.y2 += movedRows;
				this.eventInfo.element.style.setProperty('--width-y', `${eventMouseMovedY}px`);
				break;
			case 'top':
				newPosition.y1 += movedRows;
				this.eventInfo.element.style.setProperty('--width-y', `${-eventMouseMovedY}px`);
				this.eventInfo.element.style.setProperty('--moved-y', `${eventMouseMovedY}px`);
				break;
			case 'topLeft':
				newPosition.y1 += movedRows;
				newPosition.x1 += movedCols;
				this.eventInfo.element.style.setProperty('--width-y', `${-eventMouseMovedY}px`);
				this.eventInfo.element.style.setProperty('--width-x', `${-eventMouseMovedX}px`);
				this.eventInfo.element.style.setProperty('--moved-y', `${eventMouseMovedY}px`);
				this.eventInfo.element.style.setProperty('--moved-x', `${eventMouseMovedX}px`);
				break;
			case 'topRight':
				newPosition.y1 += movedRows;
				newPosition.x2 += movedCols;
				this.eventInfo.element.style.setProperty('--width-y', `${-eventMouseMovedY}px`);
				this.eventInfo.element.style.setProperty('--width-x', `${eventMouseMovedX}px`);
				this.eventInfo.element.style.setProperty('--moved-y', `${eventMouseMovedY}px`);
				break;
			case 'bottomLeft':
				newPosition.y2 += movedRows;
				newPosition.x1 += movedCols;
				this.eventInfo.element.style.setProperty('--width-y', `${eventMouseMovedY}px`);
				this.eventInfo.element.style.setProperty('--width-x', `${-eventMouseMovedX}px`);
				this.eventInfo.element.style.setProperty('--moved-x', `${eventMouseMovedX}px`);
				break;
			case 'bottomRight':
				newPosition.y2 += movedRows;
				newPosition.x2 += movedCols;
				this.eventInfo.element.style.setProperty('--width-y', `${eventMouseMovedY}px`);
				this.eventInfo.element.style.setProperty('--width-x', `${eventMouseMovedX}px`);
				break;
			default:
				break;
			}

			// Limit right position to max column count
			newPosition.x2 = Math.max(Math.min(DEFAULT_GRID_COLUMN_COUNT + 5, newPosition.x2), 2);
			// Limit left position to min column count
			newPosition.x1 = Math.min(Math.max(1, newPosition.x1), newPosition.x2 - 1);
			// Limit top position to  min first row
			newPosition.y1 = Math.max(1, newPosition.y1);
			this.eventInfo.gridResizerPosition = newPosition;
		},
		stopResizingGridElement() {
			window.removeEventListener('mouseup', this.stopResizingGridElement);
			window.removeEventListener('mousemove', this.resizeGridElement);
			this.eventInfo.element.style.setProperty('--width-x', '0');
			this.eventInfo.element.style.setProperty('--width-y', '0');
			this.eventInfo.element.style.setProperty('--moved-x', '0');
			this.eventInfo.element.style.setProperty('--moved-y', '0');
			this.eventInfo.element.style.setProperty('--event-background-color', '');

			// eslint-disable-next-line max-len, vue/max-len
			const newPositionStringified = `${this.eventInfo.gridResizerPosition.y1}/${this.eventInfo.gridResizerPosition.x1}/${this.eventInfo.gridResizerPosition.y2}/${this.eventInfo.gridResizerPosition.x2}`;

			this.mergeElementData({
				elementId: this.eventInfo.id,
				elementData: {
					settings: {
						styles: {
							position: newPositionStringified,
						},
					},
				},
				pushToHistory: true,
			});
			this.changeElementHeight(this.eventInfo.id);
			this.eventInfo = null;
			this.$emit('set-edit-control-visibility', true);
		},
		startMovingGridElement(event, elementId) {
			if (this.shouldPreventGridLayoutChange(event)) {
				return;
			}

			if (this.isEditingTextBoxElement) {
				return;
			}

			// TODO: Improve gridresizerposition naming
			this.eventInfo = {
				x: event.clientX,
				y: event.clientY,
				id: elementId,
				element: this.$refs[`item-${elementId}`][0].$el,
				gridResizerPosition: null,
			};
			this.eventInfo.element.style.setProperty('--event-background-color', 'var(--color-gray');
			this.$emit('set-edit-control-visibility', false);
			window.addEventListener('mousemove', this.moveGridElement);
			window.addEventListener('mouseup', this.stopMovingGridElement);
		},
		moveGridElement(event) {
			// TODO: Check if styles can be bound
			this.eventInfo.element.style.setProperty('--moved-x', `${event.clientX - this.eventInfo.x}px`);
			this.eventInfo.element.style.setProperty('--moved-y', `${event.clientY - this.eventInfo.y}px`);
			this.eventInfo.gridResizerPosition = this.calculateGridElementPosition(event);
		},
		calculateGridElementPosition(event) {
			// Calculate position
			const movedCols = this.pxToColumns(event.clientX - this.eventInfo.x);
			const movedRows = this.pxToRows(event.clientY - this.eventInfo.y);
			const originalPosition = this.gridAreaToArray(this.siteElements[this.eventInfo.id].settings.styles.position);

			let newPosition = {
				y1: originalPosition[0] + movedRows,
				x1: originalPosition[1] + movedCols,
				y2: originalPosition[2] + movedRows,
				x2: originalPosition[3] + movedCols,
			};

			// Checks if element is moved to the sides (dont snap if moving up and down),
			// good for full widht elements
			if (movedCols !== 0) {
				newPosition = snapPositionToGrid({
					position: newPosition,
					columnCount: DEFAULT_GRID_COLUMN_COUNT,
				});
			}

			// Dont first row be negative
			if (newPosition.y1 < 1) {
				const overshot = Math.abs(1 - newPosition.y1);

				newPosition.y1 += overshot;
				newPosition.y2 += overshot;
			}

			return newPosition;
		},
		stopMovingGridElement(event) {
			const newPosition = this.calculateGridElementPosition(event);
			const newPositionStringified = `${newPosition.y1}/${newPosition.x1}/${newPosition.y2}/${newPosition.x2}`;

			// Set position
			this.mergeElementData({
				elementId: this.eventInfo.id,
				elementData: {
					settings: {
						styles: {
							position: newPositionStringified,
						},
					},
				},
				pushToHistory: true,
			});

			this.resetEventInfo();
		},
		resetEventInfo() {
			window.removeEventListener('mouseup', this.stopMovingGridElement);
			window.removeEventListener('mousemove', this.moveGridElement);
			this.eventInfo.element.style.setProperty('--moved-x', '');
			this.eventInfo.element.style.setProperty('--moved-y', '');
			this.eventInfo.element.style.setProperty('--event-background-color', '');
			this.eventInfo = null;
			this.$emit('set-edit-control-visibility', true);
		},
		getMousePositionOnGrid(event) {
			// Calculate position in grid
			const containerBoundingBox = this.$refs.gridContainer.getBoundingClientRect();
			const row = this.pxToRows(event.clientY - containerBoundingBox.top);
			let gridWidth = DEFAULT_GRID_WIDTH;

			if (gridWidth > this.$refs.gridContainer.clientWidth) {
				gridWidth = this.$refs.gridContainer.clientWidth - DEFAULT_GRID_CONTENT_PADDING;
			}

			const gridStartsAt = (containerBoundingBox.width - gridWidth) / 2;

			// Start from grid column
			const column = 3 + this.pxToColumns((event.clientX - gridStartsAt));

			return {
				column,
				row,
			};
		},
		onDrop(event) {
			if (!this.validateDragDrop(event)) {
				return;
			}

			this.$emit('drag-status-change', false);
			// Get event data
			const elementId = event.dataTransfer.getData('elementId');
			const elementData = JSON.parse(event.dataTransfer.getData('content'));
			const width = Number.parseInt(event.dataTransfer.getData('width'), 10);
			const height = Number.parseInt(event.dataTransfer.getData('height'), 10);
			const eventData = JSON.parse(event.dataTransfer.getData('eventData'));

			const {
				column,
				row,
			} = this.isMobileMode ? {
				column: 1,
				row: 1,
			} : this.getMousePositionOnGrid(event);

			const position = snapPositionToGrid({
				position: {
					x1: column,
					x2: column + width,
					y1: row,
					y2: row + height,
				},
				columnCount: DEFAULT_GRID_COLUMN_COUNT,
			});

			elementData.settings.styles.position = `${position.y1}/${position.x1}/${position.y2}/${position.x2}`;

			this.addElement({
				blockId: this.blockId,
				elementId,
				elementData,
			});

			this.onAfterElementAdd(elementId, eventData);
		},
		selectCurrentBlock() {
			if (!this.hoveredElementId) {
				this.unselectCurrentElement();
			}
		},
		onDragEnter(event) {
			if (!this.validateDragDrop(event)) {
				return;
			}

			this.$emit('drag-status-change', true);

			// Error handling
			if (!this.eventInfo) {
				this.$emit('set-edit-control-visibility', false);
			}

			this.eventInfo = {
				addElementActive: true,
			};
		},
		onDragLeave(event) {
			if (!this.validateDragDrop(event)) {
				return;
			}

			this.$emit('drag-status-change', false);
			this.$emit('set-edit-control-visibility', true);
			this.eventInfo = null;
		},
		alignmentStyles(elementId) {
			const elementStyles = this.siteElements[elementId]?.settings.styles;

			return {
				'align-self': `${elementStyles['m-align-self']}`,
				// TODO: Move to mapper
				width: elementStyles['m-width'] || '100%',
			};
		},
		logAddElementEvent(eventData) {
			const {
				from,
				type,
			} = eventData;

			EventLogApi.logEvent({
				eventName: eventNames.builder.add_element,
				eventProperties: {
					from,
					element: addElementEvents[type],
				},
				user: this.user,
			});
		},
		updateColumnWidth() {
			if (this.$refs.gridContainer) {
				this.columnWidth = Number.parseFloat(getComputedStyle(this.$refs.gridContainer)['grid-template-columns'].split(' ')[3], 0);
			} else {
				this.columnWidth = 0;
			}
		},
		updateGridHeightInRows() {
			if (this.$refs.gridContainer) {
				this.gridHeightInRows = getComputedStyle(this.$refs.gridContainer)['grid-template-rows'].split(' ').length;
			} else {
				this.gridHeightInRows = 0;
			}
		},
		getElementData(elementId) {
			if (this.components) {
				return this.components[elementId];
			}

			return this.siteElements[elementId];
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/components/BlockGrid";

.block-grid {
	$this: &;

	user-select: none;

	// Prevent children from triggering dragLeave event
	/* stylelint-disable-next-line selector-class-pattern */
	:deep(.block-grid__add-element-active) * {
		pointer-events: none;
	}

	&__center-line {
		$line-width: 2px;

		position: absolute;
		top: 0;
		bottom: 0;
		justify-self: center;
		width: 0;
		pointer-events: none;
		border-right: $line-width * 0.5 dashed $color-azure;
		border-left: $line-width * 0.5 dashed $color-azure;
	}

	#{$this}__item {
		#{$this}__item-pill {
			position: absolute;
			top: -11px;
			left: 15px;
			z-index: $z-index-controls-edit-block-line;
			display: none;
		}

		&:not(.is-selected):hover {
			#{$this}__item-pill {
				display: block;
			}
		}
	}

	&__item {
		$grid-item: &;

		position: relative;

		&-wrapper {
			display: flex;
			flex-direction: column;

			&:last-of-type {
				#{$grid-item}--inner {
					margin-bottom: 0;
				}
			}
		}
	}

	:deep(.dragged-element) {
		background-color: rgba($color-gray-light, 0.5);
		transition: 0.15s;
	}
}

.fade {
	&-enter-active,
	&-leave-active {
		transition: 400ms opacity;
	}

	&-enter,
	&-leave-to {
		opacity: 0;
	}
}
</style>
