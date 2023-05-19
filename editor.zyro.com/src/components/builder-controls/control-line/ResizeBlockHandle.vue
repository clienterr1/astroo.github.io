<template>
	<ResizeHandle
		:type="resizeHandleType"
		:resize-direction="resizeHandleDirection"
		@mousedown="startSectionResize"
	/>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';

import {
	CONTROL_LINE_SCROLL_START_THRESHOLD,
	CONTROL_LINE_SCROLL_AMOUNT,
	CONTROL_LINE_SCROLL_INTERVAL_DELAY,
} from '@/constants';

import ResizeHandle from '@/components/builder-controls/control-line/ResizeHandle.vue';
import { getDocumentHeight } from '@/utils/browser';
import { isDesktopSafari } from '@/utils/browserIdentifiers';
import windowScrolledToTheBottom from '@/utils/windowScrolledToTheBottom';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ResizeHandle,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: '',
		},
		blockHeight: {
			type: Number,
			required: true,
		},
	},
	emits: [
		'lock-hovered-block',
		'change-height',
		'change-height',
		'lock-hovered-block',
	],

	data() {
		return {
			eventInfo: null,
			minimumHeightReached: false,
			initialCurrentBlockData: null,
			autoResizeInterval: null,
			resizeHandleDirection: 0,
		};
	},

	computed: {
		...mapState('gui', [
			'mobilePreviewRef',
			'blockResizeInfo',
		]),
		...mapGetters([
			'siteElements',
			'siteBlocks',
		]),
		...mapGetters('gui', ['isMobileMode']),
		blockData() {
			return this.siteBlocks[this.blockId];
		},
		distanceBetweenButtonAndHandle() {
			return -(this.eventInfo.y - this.eventInfo.currentMouseMoveClientY);
		},
		shouldScrollUp() {
			const isInTopThreshold = this.eventInfo.currentMouseMoveClientY < CONTROL_LINE_SCROLL_START_THRESHOLD;
			const isCursorAboveHandle = this.distanceBetweenButtonAndHandle < 0;

			return isInTopThreshold && isCursorAboveHandle;
		},
		shouldScrollDown() {
			const isInBottomThreshold = this.eventInfo.currentMouseMoveClientY
			> document.documentElement.clientHeight - CONTROL_LINE_SCROLL_START_THRESHOLD;
			const isCursorBelowHandle = this.distanceBetweenButtonAndHandle > 0;

			return isInBottomThreshold && isCursorBelowHandle;
		},
		shouldScroll() {
			return this.shouldScrollUp || this.shouldScrollDown;
		},
		autoResizeAmount() {
			return this.shouldScrollDown ? CONTROL_LINE_SCROLL_AMOUNT : -CONTROL_LINE_SCROLL_AMOUNT;
		},
		distanceMoved() {
			return this.distanceBetweenButtonAndHandle + (this.shouldScroll ? this.autoResizeAmount : 0);
		},
		sizeDifference() {
			return this.distanceMoved + this.eventInfo.buttonMovedByScroll;
		},
		calculatedHeight() {
			return this.eventInfo.originalHeightPx + this.sizeDifference;
		},
		currentBlockHeight() {
			return Math.max(this.calculatedHeight, this.eventInfo.minimumHeight);
		},
		isBlockSlideshow() {
			return this.siteBlocks[this.blockId].type === 'BlockSlideshow';
		},
		blockSlideshowComponents() {
			return this.siteBlocks[this.blockId].slides
				.flatMap((slide) => this.siteBlocks[slide.blockId].components);
		},
		resizeHandleType() {
			if (this.minimumHeightReached) {
				return 'error';
			}

			if (this.blockData.slot === 'footer') {
				return 'primary';
			}

			return 'default';
		},
	},

	watch: {
		minimumHeightReached(newValue) {
			if (!this.eventInfo) {
				return;
			}

			if (!newValue) {
				this.updateBlockResizeInfo({
					blockId: this.eventInfo.id,
				});

				return;
			}

			if (this.eventInfo.lastElementId) {
				this.updateBlockResizeInfo({
					blockId: this.eventInfo.id,
					elementId: this.eventInfo.lastElementId,
					outlineColor: 'var(--color-primary)',
				});
			} else {
				this.updateBlockResizeInfo({
					blockId: this.eventInfo.id,
					outlineColor: 'var(--color-primary)',
				});
			}
		},
	},

	methods: {
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),
		...mapActions('gui', ['updateBlockResizeInfo']),
		getNewSectionHeight(buttonMoved) {
			const {
				originalHeight,
				rowHeight,
				rowGap,
			} = this.eventInfo;
			const addedHeight = Math.round(buttonMoved / (rowHeight + rowGap));

			return originalHeight + addedHeight;
		},
		resetAutoScrollInterval() {
			clearInterval(this.autoResizeInterval);
			this.autoResizeInterval = null;
		},

		startSectionResize(event) {
			this.initialCurrentBlockData = cloneDeep(this.blockData);

			const parseIntWrapper = (value) => Number.parseInt(value, 10);
			const {
				settings,
				background = {},
			} = this.blockData;
			const components = this.isBlockSlideshow
				? this.blockSlideshowComponents
				: this.blockData.components;
			const { styles } = settings;

			// Gather data that wont change
			const padding = parseCSSSides(styles['block-padding'] || '0px');
			const paddingBottom = parseIntWrapper(padding.bottom);
			const paddingTop = parseIntWrapper(padding.top);
			const rowHeight = parseIntWrapper(styles['row-size']);
			const rowGap = parseIntWrapper(styles['row-gap']);
			const scrollTop = window.pageYOffset;

			let elementsEndAt = null;
			let lastEndPosition = 2;
			let lastElementId = null;
			const existingComponents = components
				.filter((componentId) => componentId in this.siteElements);

			if (components.length > 0) {
				elementsEndAt = existingComponents.map((componentId) => {
					const { position } = this.siteElements[componentId].settings.styles;

					return {
						endsAt: Number.parseInt(position.split('/')[2], 10),
						componentId,
					};
				});

				lastEndPosition = Math.max(...elementsEndAt.map((element) => element.endsAt), 2);
				lastElementId = elementsEndAt
					.find((element) => element.endsAt === lastEndPosition).componentId;
			} else if (!background.current) {
				lastEndPosition = 9;
			}

			const minimumHeight = (rowHeight + rowGap) * (lastEndPosition - 1) - rowGap
      + paddingBottom + paddingTop;

			const originalHeight = Math.max(
				styles.rows || 0,
				lastEndPosition - 1,
			);

			this.eventInfo = {
				y: event.clientY,
				yPrev: event.clientY,
				id: this.blockId,
				currentMouseMoveClientY: null,
				originalHeightPx: this.blockHeight,
				originalHeight,
				lastEndPosition,
				lastElementId,
				previousHeight: originalHeight,
				minimumHeight,
				rowHeight,
				rowGap,
				scrollTop,
				buttonMovedByScroll: 0,
			};

			window.addEventListener('mousemove', this.controlSectionResizing);
			window.addEventListener('mouseup', this.stopResizingSection);
			this.updateBlockResizeInfo({
				blockId: this.eventInfo.id,
			});
			this.$emit('lock-hovered-block', true);
		},
		// If we are in threshold, start scroll-resizing. If not, do a regular resize.
		controlSectionResizing(event) {
			this.eventInfo.currentMouseMoveClientY = event.clientY;
			this.resetAutoScrollInterval();

			if (this.shouldScroll) {
				this.autoResizeInterval = setInterval(() => {
					if (!this.shouldScroll) {
						this.resetAutoScrollInterval();

						return;
					}

					this.resizeSection();
				}, CONTROL_LINE_SCROLL_INTERVAL_DELAY);

				return;
			}

			this.resizeSection();
		},
		resizeSection() {
			this.animateButton();

			// Resize section
			this.scrollPage({
				shouldScroll: this.shouldScroll,
				scrollByAmount: this.autoResizeAmount,
			});

			this.$emit('change-height', this.currentBlockHeight);

			// Limit minimum height
			this.minimumHeightReached = this.eventInfo.minimumHeight >= this.calculatedHeight;

			const newHeight = this.getNewSectionHeight(this.sizeDifference);

			// Save new height
			if (newHeight === this.eventInfo.previousHeight) {
				return;
			}

			// This check is needed because section resize breaks on safari,
			// update is done on stopResizingSection()
			if (!isDesktopSafari) {
				this.updateSectionHeight(newHeight);
			}

			this.eventInfo.previousHeight = newHeight;
		},

		stopResizingSection() {
			window.removeEventListener('mousemove', this.controlSectionResizing);
			window.removeEventListener('mouseup', this.stopResizingSection);
			this.resetAutoScrollInterval();

			// Save new height
			this.createSnapshot();

			// If there is fake padding, remove it and scroll to the bottom of the screen
			if (this.mobilePreviewRef.style.paddingBottom) {
				this.mobilePreviewRef.style.setProperty('padding-bottom', '');
				window.scrollTo(0, document.body.scrollHeight);
			}

			// Reset event
			this.resizeHandleDirection = 0;

			this.$emit('change-height', null);

			if (isDesktopSafari) {
				this.updateSectionHeight(this.eventInfo.previousHeight);
			}

			this.eventInfo = null;
			this.updateBlockResizeInfo({});
			this.$emit('lock-hovered-block', false);
			this.minimumHeightReached = false;
		},

		animateButton() {
			this.resizeHandleDirection = Math.sign(this.eventInfo.currentMouseMoveClientY - this.eventInfo.yPrev);

			if (Math.abs(this.eventInfo.currentMouseMoveClientY - this.eventInfo.yPrev) > CONTROL_LINE_SCROLL_AMOUNT) {
				this.eventInfo.yPrev = this.eventInfo.currentMouseMoveClientY;
			}
		},

		updateSectionHeight(newHeight) {
			this.updateBlockData({
				blockId: this.eventInfo.id,
				blockData: {
					settings: {
						styles: {
							rows: Math.max(newHeight, this.eventInfo.lastEndPosition - 1),
						},
					},
				},
				merge: true,
			});
		},

		scrollPage({
			shouldScroll,
			scrollByAmount,
		}) {
			if (windowScrolledToTheBottom()) {
				// Edge case: when at the bottom of the screen, you can't do a scroll resize and you need a
				// fixed amount resize mode (which introduces a lot of edge cases and bugs).
				// To solve this issue, fake padding is added temporarily, so regular auto scroll resizing
				// could work properly again in the same way it does normally.
				this.mobilePreviewRef.style.setProperty('padding-bottom', `${getDocumentHeight()}px`);
			}

			if (shouldScroll && !this.minimumHeightReached) {
				window.scrollBy(0, scrollByAmount);
				this.eventInfo.buttonMovedByScroll = -(this.eventInfo.scrollTop - window.pageYOffset);
			}
		},
	},
});
</script>
