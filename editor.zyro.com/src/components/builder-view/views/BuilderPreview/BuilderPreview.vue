<template>
	<div
		data-portal="builder-preview"
		class="preview"
	>
		<main
			v-if="website"
			ref="mobilePreview"
			class="preview__content"
		>
			<BlockControls
				v-if="isHeaderVisible"
				is-first
				data-qa="builder-section-navigation"
				slot-name="navigation"
				block-id="header"
				:is-block-selected="'header' === currentBlockId"
				:is-dragging-over="'header' === draggedOverBlockId"
				:is-block-hovered="getIsBlockHovered('header')"
			>
				<BlockHeader
					id="header"
					ref="headerRef"
					v-bind="headerProps"
					@click="handleHeaderClick"
					@toggle-visibility="isNavOpen = !isNavOpen"
					@mousedown="handleBlockSelect('header'), closeBlockEditor(), unselectCurrentElement()"
					@mouseover="handleBlockHover('header')"
				/>
			</BlockControls>
			<BuilderEmptyPage v-if="isCurrentPageEmpty && !pageBlocksSlotFooter" />
			<BlockControls
				v-for="(blockId, index) of allBlocks"
				:key="blockId"
				:block-id="blockId"
				:is-hidden="isBlockHidden(blockId)"
				:is-first="isNavHidden && index === 0"
				:is-block-selected="blockId === currentBlockId"
				:slot-name="siteBlocks[blockId].slot"
				:block-type="siteBlocks[blockId].type"
				:is-dragging-over="blockId === draggedOverBlockId"
				:is-block-hovered="getIsBlockHovered(blockId)"
				:hovered-block="hoveredBlock"
				:transparent-header-height="index === 0 ? transparentBlockSize : 0"
				@set-edit-control-visibility="isEditControlsLayoutVisible = $event"
				@lock-hovered-block="handleBlockSelect(blockId), unselectCurrentElement(), isHoveredBlockLocked = $event"
				@unhide-block="onToggleLinkedBlock('footer', false, false)"
			>
				<Block
					:id="blockId"
					:ref="`${blockId}Ref`"
					v-qa="`builder-section-${index}`"
					:data-block-id="blockId"
					:data="siteBlocks[blockId]"
					:blocks="siteBlocks"
					:components="siteElements"
					:is-block-hovered="getIsBlockHovered(blockId)"
					:hovered-block="hoveredBlock"
					:style="index === 0 ? headerHeightStyle : null"
					@set-edit-control-visibility="isEditControlsLayoutVisible = $event"
					@mousedown="handleBlockSelect(blockId), closeBlockEditor()"
					@mouseover="handleBlockHover(blockId)"
					@drag-status-change="setDraggedOverBlock({
						blockId,
						isDraggedOver: $event
					})"
				/>
			</BlockControls>

			<EditControls v-if="isEditControlsVisible" />
			<div
				v-if="showBlockControls"
				ref="controlsRef"
				class="preview__edit-block preview__edit-block--button"
				:class="{ 'preview__edit-block--fixed-position': isEcommerceSection }"
			>
				<EditBlockButton
					:block-id="currentBlockId"
					:block-type="currentBlockType"
					:block-slot="currentBlockSlot || ''"
					:is-linked-block-hidden="currentPage[`${currentBlockSlot}SlotIsHidden`]"
					:is-moving-block-up-allowed="isMovingBlockUpAllowed(currentBlockId)"
					:is-moving-block-down-allowed="isMovingBlockDownAllowed(currentBlockId)"
					@move-block-up="onMoveBlockUp(currentBlockId)"
					@move-block-down="onMoveBlockDown(currentBlockId)"
					@edit-block="onEditBlock"
					@remove-block="onRemoveCurrentBlock"
					@duplicate-block="onDuplicateBlock"
					@toggle-linked-block="onToggleLinkedBlock"
					@sort-block-components="onSortBlockComponents"
					@vue:mounted="initPopper"
				/>
			</div>
			<div
				v-if="currentBlockId && isEditControlsLayoutVisible && !isEditBlockButtonVisible"
				ref="controlsRef"
				class="preview__edit-block preview__edit-block--popup"
				:class="{ 'editing-navigation': isEditingNavigation }"
			>
				<EditBlockPopup
					v-if="isBlockEditorOpen"
					ref="editBlockPopupRef"
					:start-tab-id="defaultBlockEditTab"
					:starting-popup-component="editBlockStartingPopupComponent"
					@close="closeBlockEditor"
					@vue:mounted="initPopper"
				/>
			</div>
		</main>
	</div>
</template>

<script>
import { createPopper } from '@popperjs/core';
import { addBreadcrumb } from '@sentry/browser';
import gsap from 'gsap';
import {
	mapGetters,
	mapState,
	mapMutations,
	mapActions,
	useStore,
} from 'vuex';

import Block from '@/components/block/Block.vue';
import BlockControls from '@/components/block/BlockControls.vue';
import EditBlockButton from '@/components/builder-controls/EditBlockButton.vue';
import EditBlockPopup from '@/components/builder-controls/EditBlockPopup.vue';
import EditControls from '@/components/builder-controls/EditControls.vue';
import BuilderEmptyPage from '@/components/builder-view/components/BuilderEmptyPage.vue';
import {
	moveOneLeft,
	moveOneRight,
} from '@/utils/array';
import { getPageIdFromPath } from '@zyro-inc/site-modules/utils/page/getPageIdFromPath';
import { cloneBlock } from '@/utils/siteDataUtils';
import { useEcwidStore } from '@zyro-inc/site-modules/use/useEcwidStore';
import BlockHeader from '@zyro-inc/site-modules/components/blocks/header/BlockHeader.vue';
import { getHeaderProps } from '@zyro-inc/site-modules/components/blocks/header/getHeaderProps';
import { getPathParams } from '@zyro-inc/site-modules/utils/page/getPathParams';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';
import { getLanguageSwitcherLanguages } from '@zyro-inc/site-modules/utils/getLanguageSwitcherLanguages';

import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
	defineComponent,
} from 'vue';

import { SET_BLOCK_RESIZE_INFO } from '@/store/builder/gui';
import { onClickOutside } from '@/utils/onClickOutside';
import { DATA_SELECTOR_BUILDER_PREVIEW } from '@/constants';
import { useIsWindowBeingResized } from '@/use/useIsWindowResizing';

const BLOCK_REMOVE_DURATION = 400;
const DEFAULT_ACTIVE_BLOCK_OBSERVER_THRESHOLD = 0.9;
const DEFAULT_HEADER_HEIGHT = 130;

export default defineComponent({
	name: 'BuilderPreview',

	components: {
		BlockControls,
		BuilderEmptyPage,
		Block,
		EditControls,
		EditBlockButton,
		EditBlockPopup,
		BlockHeader,
	},
	setup() {
		const {
			openCart,
			ecwidCartItemCount,
		} = useEcwidStore();

		// #region Header height handling
		const {
			getters,
			commit,
			dispatch,
			state,
		} = useStore();

		const { setIsWindowBeingResized } = useIsWindowBeingResized();

		const siteMeta = computed(() => getters.siteMeta);
		const isHeaderVisible = computed(() => !getters.isNavHidden);
		const isBlockEditorOpen = computed(() => state.isBlockEditorOpen);
		const headerRef = ref(null);
		const defaultBlockEditTab = computed(() => state.defaultBlockEditTab);

		const resizeObserver = new ResizeObserver(([{ contentRect }]) => {
			requestAnimationFrame(() => {
				const { height } = contentRect;
				// Adding additional height to header accounts for nav elements wrapping
				const HEIGHT_PADDING = 50;

				if (!siteMeta.value.headerHeight || siteMeta.value.headerHeight !== height + HEIGHT_PADDING) {
					commit('setWebsiteMeta', {
						key: 'headerHeight',
						value: height + HEIGHT_PADDING,
					});
				}

				// If header height was not set before, save the website so you can close the tab
				if (!siteMeta.value.headerHeight) {
					dispatch('saving/saveWebsite');
				}
			});
		});

		const bodyResizeObserver = new ResizeObserver(() => {
			setIsWindowBeingResized();
			dispatch('unselectCurrentElement');
		});

		const editBlockPopupRef = ref(null);
		const editBlockStartingPopupComponent = ref(null);

		onMounted(() => {
			if (headerRef.value?.$el) {
				resizeObserver.observe(headerRef.value.$el);
			}

			bodyResizeObserver.observe(document.body);
		});

		onBeforeUnmount(() => {
			resizeObserver.disconnect();
			bodyResizeObserver.disconnect();
		});

		// onClickOutside handling
		watch(isBlockEditorOpen, (newValue) => {
			commit(`gui/${SET_BLOCK_RESIZE_INFO}`, {
				blockId: newValue ? state.currentBlockId : null,
			});
		});

		watch(isHeaderVisible, async (newValue) => {
			if (newValue) {
				await nextTick();

				resizeObserver.observe(headerRef.value.$el);
			} else {
				resizeObserver.disconnect();
			}
		});

		onClickOutside({
			target: editBlockPopupRef,
			preventSelector: DATA_SELECTOR_BUILDER_PREVIEW,
		}, () => {
			if (getters['gui/isColorPickerOpen']) return;

			dispatch('leaveBlockEditMode');
			dispatch('setDefaultBlockEditTab', '');
		});

		const closeBlockEditor = () => {
			dispatch('leaveBlockEditMode');
			dispatch('setDefaultBlockEditTab', '');
		};

		const onEditBlock = (options) => {
			editBlockStartingPopupComponent.value = options?.startingPopupComponent || null;
			dispatch('enterBlockEditMode');
			dispatch('leaveElementEditMode');
			dispatch('setDefaultBlockEditTab', options?.tabId || '');
		};

		return {
			isHeaderVisible,
			ecwidCartItemCount,
			headerRef,
			openCart,
			editBlockPopupRef,
			isBlockEditorOpen,
			defaultBlockEditTab,
			closeBlockEditor,
			onEditBlock,
			editBlockStartingPopupComponent,
		};
	},

	data() {
		return {
			isNavOpen: false,
			position: {},
			popperInstance: null,
			draggedOverBlockId: '',
			hoveredBlock: null,
			isHoveredBlockLocked: false,
			isTransitioning: false,
			isEditControlsLayoutVisible: true,
			// Observer which has a consistent threshold (smaller than viewport)
			currentActiveBlocksShorterThanViewportObserver: null,
			// Observers which have different thresholds (to observe sections higher than the viewport)
			currentActiveBlocksTallerThanViewportObservers: [],
			controlsPopperResizeObserver: null,
		};
	},

	computed: {
		...mapState([
			'website',
			'websiteId',
			'currentBlockId',
			'currentElementId',
			'isElementEditMode',
			'currentPageId',
			'currentLocale',
		]),
		...mapState('gui', [
			'blockResizeInfo',
			'isMobileScreen',
		]),
		...mapGetters([
			'currentPage',
			'currentBlock',
			'currentBlockType',
			'sitePages',
			'siteBlocks',
			'siteElements',
			'siteMeta',
			'headerBlock',
			'isNavHidden',
			'isCurrentPageEmpty',
			'scheduledBlogPages',
			'currentBlockSlot',
			'ecwidPages',
		]),
		...mapGetters('navigation', ['items']),
		...mapGetters('gui', ['isMobileMode']),
		isFirstPageBlockHidden() {
			const firstPageBlock = this.siteBlocks[this.allBlocks[0]];
			const isDesktopFirstBlockHidden = !this.isMobileMode && firstPageBlock?.desktop?.isHidden;
			const isMobileFirstBlockHidden = this.isMobileMode && firstPageBlock.mobile?.isHidden;

			return isDesktopFirstBlockHidden || isMobileFirstBlockHidden;
		},
		headerProps() {
			const {
				blocks,
				nav,
				pages,
				elements,
				metaTitle,
			} = this.website.languages[this.currentLocale];
			const headerProps = getHeaderProps({
				siteId: this.websiteId,
				meta: this.website.meta,
				blocks,
				nav,
				pages,
				elements,
				languageMetaTitle: metaTitle,
				languageSwitcherLanguages: getLanguageSwitcherLanguages({
					languages: this.website.languages,
					defaultLocale: this.website.meta.defaultLocale,
				}),
				currentLocale: this.currentLocale,
				currentPageId: this.currentPageId,
				isLogoOptimized: false,
				shoppingCartItems: [],
				ecwidCartItemCount: 0,
				getPagePathFromId: ({ pageId }) => getPagePathFromId({
					siteData: this.website,
					pageId,
					locale: this.currentLocale,
				}),
				isOpen: this.isNavOpen,
				ecwidPages: this.ecwidPages,
				devicePixelRatio: window?.devicePixelRatio,
			});

			return {
				...headerProps,
				// Disable header transparency in editor if first block is hidden - it won't work.
				isTransparent: this.isFirstPageBlockHidden ? false : headerProps.isTransparent,
			};
		},
		isEditBlockButtonVisible() {
			return !this.currentElementId && this.currentBlockRef && !this.isBlockEditorOpen && !this.isTransitioning;
		},
		isEditControlsVisible() {
			return this.isEditControlsLayoutVisible && (this.currentBlockId || this.currentElementId);
		},
		popperPlacement() {
			if (this.isNavigationOrBlogTop && !this.isMobileMode) {
				return 'bottom-end';
			}

			if (this.isMobileMode && this.isEditBlockButtonVisible) {
				return 'top';
			}

			return 'right-start';
		},
		popperOffset() {
			const HALF_BUTTON_HEIGHT = 18;
			const POPPER_PADDING = 24;

			return {
				name: 'offset',
				options: {
					offset: () => {
						if (this.isMobileMode) {
							return [
								0,
								POPPER_PADDING,
							];
						}

						if (this.isNavigationOrBlogTop) {
							return [
								POPPER_PADDING,
								-HALF_BUTTON_HEIGHT,
							];
						}

						return [
							POPPER_PADDING,
							POPPER_PADDING,
						];
					},
				},
			};
		},
		isNavigationOrBlogTop() {
			return [
				'BlockNavigation',
				'BlockBlogHeader',
			].includes(this.currentBlockType);
		},
		isEcommerceSection() {
			return [
				'BlockEcommerceProduct',
				'BlockEcommerceProductList',
			].includes(this.currentBlockType);
		},
		isEditingNavigation() {
			return this.currentBlockType === 'BlockNavigation';
		},
		pageBlocks() {
			return this.currentPage?.blocks || [];
		},
		pageBlocksSlotFooter() {
			return Object.keys(this.siteBlocks).find((blockId) => this.siteBlocks[blockId].slot === 'footer');
		},
		allBlocks() {
			return [
				...this.pageBlocks,
				...(this.pageBlocksSlotFooter ? [this.pageBlocksSlotFooter] : []),
			];
		},
		currentPageBlocks() {
			return this.currentPage.blocks;
		},
		currentBlockRef() {
			return this.getBlockRef(this.currentBlockId);
		},
		isHeaderTransparent() {
			return this.headerProps.isTransparent;
		},
		transparentBlockSize() {
			return this.isHeaderTransparent ? this.siteMeta.headerHeight : 0;
		},
		headerHeightStyle() {
			return {
				'--header-height': this.isHeaderTransparent ? `${this.siteMeta.headerHeight || DEFAULT_HEADER_HEIGHT}px` : null,
			};
		},
		showBlockControls() {
			return this.currentBlockId && this.isEditControlsLayoutVisible && this.isEditBlockButtonVisible && this.currentBlockRef;
		},
	},

	watch: {
		// In case currentPageId becomes undefined (ex. undo/redo deletes current page), reset it to homepage
		currentPageId: {
			immediate: true,
			handler(newValue) {
				if (!newValue) {
					this.updateCurrentPageId();
				}

				this.resetHoveredBlock();
			},
		},
		showBlockControls() {
			this.initPopper();
		},
		isMobileMode(value) {
			this.unselectCurrentElement();

			// Reposition block editor
			this.initPopper();

			if (!value) {
				this.isNavOpen = value;
			}
		},
		currentPageBlocks: {
			async handler(newValue, oldValue) {
				// Scrolls newly added blocks into view
				const newBlockId = newValue.find((value) => !oldValue.includes(value));

				if (!newBlockId) {
					return;
				}

				await this.$nextTick();

				this.getBlockRef(newBlockId).scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			},
		},
		scheduledBlogPages: {
			immediate: true,
			deep: true,
			handler(newValue) {
				this.movePublicScheduledPostsToPublishedTab(newValue);
			},
		},
		allBlocks: {
			// Active block intersection observer - sets currently displayed in viewport block as active (outlined, showing edit options)
			// Initialize on mount, reinitialize on allBlocks change
			immediate: true,
			async handler() {
				await this.$nextTick();
				this.createActiveBlockIntersectionObservers();
			},
		},
	},

	beforeMount() {
		// currentBlockRef is computed only once currentBlockId changes. This is fine for initial load, but for non-initial mounts
		// (for ex., navigating to preview and back) currentBlockId is not reset. So, when builder mounts, ref is not initially found.
		// Resetting currentBlockId forces currentBlockRef to return the ref not before the mount, but after mounting - when ref exists.
		this.updateCurrentBlockId(null);
	},

	mounted() {
		this.setRef({
			el: 'mobilePreviewRef',
			ref: this.$refs.mobilePreview,
		});

		if (this.isElementEditMode) {
			this.leaveElementEditMode();
		}
	},

	beforeUnmount() {
		if (this.currentActiveBlockObserver) {
			this.currentActiveBlockObserver.disconnect();
		}
	},

	methods: {
		...mapMutations('gui', ['setRef']),
		...mapActions([
			'updateCurrentPageId',
			'updateCurrentBlockId',
			'updateCurrentLocale',
			'unselectCurrentElement',
			'addBlock',
			'removeBlock',
			'leaveElementEditMode',
			'mergePageData',
		]),
		...mapActions('gui', ['updateBlockResizeInfo']),
		...mapActions('blog', ['toggleBlogPostVisibility']),
		handleHeaderClick(event) {
			this.handleBlockSelect('header');

			const closestAnchor = event.target.closest('a');

			if (!closestAnchor) {
				return;
			}

			event.preventDefault();

			const href = closestAnchor.getAttribute('href');

			if (!href) {
				return;
			}

			// Removing parameters that are added to the link;
			const path = href.split('?')[0];

			const pageId = getPageIdFromPath({
				siteData: this.website,
				path,
			});

			const { locale } = getPathParams({
				path,
				languageKeys: Object.keys(this.website.languages),
				defaultLocale: this.website.meta.defaultLocale,
			});

			const queryParams = new URLSearchParams(closestAnchor.search);

			if (locale !== this.currentLocale) {
				this.updateCurrentLocale(locale);
			}

			if (pageId) {
				this.updateCurrentPageId(pageId);
				if (this.ecwidPages[pageId] && window.Ecwid && queryParams.get('store-page') === 'cart') {
					this.openCart();
				}
			}
		},
		async initPopper() {
			addBreadcrumb({
				category: 'POPPER:INIT',
				message: 'Before early return',
				data: {
					currentBlockRef: !!this.currentBlockRef,
					refs: !!this.$refs.controlsRef,
				},
			});

			if (!this.currentBlockRef || !this.isEditControlsLayoutVisible) {
				return;
			}

			await this.$nextTick;

			addBreadcrumb({
				category: 'POPPER:INIT',
				message: 'After next tick',
				data: {
					currentBlockRef: !!this.currentBlockRef,
					refs: !!this.$refs.controlsRef,
				},
			});

			if (this.popperInstance) {
				this.popperInstance.destroy();
				this.popperInstance = null;
				this.controlsPopperResizeObserver.disconnect();
			}

			const defaultPadding = {
				top: 54, // header height + 4px
				bottom: 24,
				right: this.isMobileScreen && !this.isMobileView ? 0 : 24,
				left: 24,
			};

			const ecommercePadding = {
				top: 58,
				bottom: 8,
				right: 8,
				left: 8,
			};

			this.popperInstance = createPopper(this.currentBlockRef, this.$refs.controlsRef, {
				placement: this.popperPlacement,
				strategy: this.isEcommerceSection ? 'fixed' : 'absolute',
				modifiers: [
					this.popperOffset,
					{
						name: 'flip',
						enabled: false,
					},
					{
						name: 'preventOverflow',
						options: {
							altAxis: true,
							mainAxis: true,
							tether: false,
							padding: this.isEcommerceSection ? ecommercePadding : defaultPadding,
						},
					},

					// Navigation settings popup height is too big.
					// Quick fix, until implementing scroll in settings popup. Makes popup not sticky
					// so you can access all its contents
					...(this.isEditingNavigation ? [
						{
							name: 'eventListeners',
							options: {
								scroll: false,
							},
						},
					] : []),

				],
			});

			this.controlsPopperResizeObserver = new ResizeObserver(() => {
				this.popperInstance.forceUpdate();
			});

			this.controlsPopperResizeObserver.observe(this.$refs.controlsRef);
		},
		// #region Active block intersection observer related methods
		// Creates and returns an observer which unselects current element and selects intersecting block as current
		createActiveBlockIntersectionObserver(threshold) {
			return new IntersectionObserver(([intersectionEntry]) => {
				if (intersectionEntry.isIntersecting && !this.isBlockEditorOpen) {
					this.handleBlockSelect(intersectionEntry.target.dataset.blockId);
				}
			}, {
				threshold,
			});
		},
		createActiveBlockIntersectionObservers() {
			// This check prevents block switching while user is using Asset Manager.
			// i.e. on pages with multiple blocks, where Slideshow is only partially visible,
			// user makes a change via Asset Manager to Slideshow that causes Layout Update which triggers
			// observer and causes currentSelectedBlock to change while user still has Asset Manager for Slideshow open
			if (window.document.querySelector('body > .asset-manager')) return;

			this.destroyActiveBlockIntersectionObservers();

			this.allBlocks.forEach((blockId) => {
				const blockToObserve = this.$refs[`${blockId}Ref`][0].$el;
				const blockHeight = blockToObserve.getBoundingClientRect().height;
				const isBlockTooTallForScreen = blockHeight > (window.innerHeight * DEFAULT_ACTIVE_BLOCK_OBSERVER_THRESHOLD);
				const tooTallBlockCoefficientWithViewport = (window.innerHeight * DEFAULT_ACTIVE_BLOCK_OBSERVER_THRESHOLD) / blockHeight;
				const tooTallBlockThreshold = tooTallBlockCoefficientWithViewport * DEFAULT_ACTIVE_BLOCK_OBSERVER_THRESHOLD;

				// If block is too tall for the screen, we need a specific observer for it
				// Reason for that: block may be 2 times bigger than viewport, so, for example, "90%" of that block will never be visible.
				// Thus, the section won't be selected. If we have a specific threshold for that block - issue gets resolved.
				if (isBlockTooTallForScreen) {
					const higherThanViewportBlockObserver = this.createActiveBlockIntersectionObserver(tooTallBlockThreshold);

					higherThanViewportBlockObserver.observe(blockToObserve);
					// Save the observer so we could reset it later and prevent performance bottlenecks
					this.currentActiveBlocksTallerThanViewportObservers.push(higherThanViewportBlockObserver);

					return;
				}

				// Else, create a general observer
				if (!this.currentActiveBlocksShorterThanViewportObserver) {
					this.currentActiveBlocksShorterThanViewportObserver = this.createActiveBlockIntersectionObserver(
						DEFAULT_ACTIVE_BLOCK_OBSERVER_THRESHOLD,
					);
				}

				this.currentActiveBlocksShorterThanViewportObserver.observe(blockToObserve);
			});
		},
		destroyActiveBlockIntersectionObservers() {
			// Reset observer for blocks that fit in the viewport
			this.currentActiveBlocksShorterThanViewportObserver?.disconnect();
			this.currentActiveBlocksShorterThanViewportObserver = null;
			// Reset observers for blocks that do not fit in the viewport
			this.currentActiveBlocksTallerThanViewportObservers.forEach((observer) => observer.disconnect());
			this.currentActiveBlocksTallerThanViewportObservers = [];
		},
		// #endregion
		setDraggedOverBlock({
			blockId,
			isDraggedOver,
		}) {
			this.draggedOverBlockId = isDraggedOver ? blockId : '';
		},
		getIsBlockHovered(blockId) {
			return this.hoveredBlock?.id === blockId;
		},
		getBlockRef(blockId) {
			const nonDynamicReferences = [
				'header',
				'footer',
			];
			const refName = `${blockId}Ref`;

			if (!this.$refs[refName]) {
				return null;
			}

			return nonDynamicReferences.includes(blockId)
				? this.$refs[refName]?.$el : this.$refs[refName][0]?.$el;
		},
		handleBlockHover(blockId) {
			if (this.isHoveredBlockLocked) {
				return;
			}

			this.hoveredBlock = {
				id: blockId,
				ref: this.getBlockRef(blockId),
				type: this.siteBlocks[blockId].type,
				slot: this.siteBlocks[blockId].slot,
			};
		},
		handleBlockSelect(blockId) {
			if (this.isHoveredBlockLocked) {
				return;
			}

			this.updateCurrentBlockId(blockId);

			if (![
				'BlockGrid',
				'BlockLayout',
				'BlockSlideshow',
			].includes(this.currentBlockType)) {
				this.unselectCurrentElement();
			}
		},
		resetHoveredBlock() {
			this.hoveredBlock = null;
		},
		async onDuplicateBlock() {
			// Set current block and close editing popup
			this.leaveElementEditMode();
			this.closeBlockEditor();

			const {
				newBlock,
				newElements,
				newBlocks,
			} = cloneBlock({
				siteData: this.website,
				blockId: this.currentBlockId,
				fromLocale: this.currentLocale,
				toLocale: this.currentLocale,
			});

			this.addBlock({
				pageId: this.currentPageId,
				blockData: newBlock,
				blocks: newBlocks,
				elements: newElements,
				previousBlockId: this.currentBlockId,
			});
		},
		onToggleLinkedBlock(slot, onAllPages, hide) {
			const slotProperty = `${slot}SlotIsHidden`;

			if (onAllPages) {
				Object.keys(this.sitePages).forEach((pageId) => {
					this.mergePageData({
						pageId,
						pageData: {
							[slotProperty]: hide,
						},
					});
				});
			} else {
				const oldValue = this.currentPage[slotProperty];

				this.mergePageData({
					pageId: this.currentPageId,
					pageData: {
						[slotProperty]: !oldValue,
					},
				});
			}
		},
		isBlockHidden(blockId) {
			return this.siteBlocks[blockId].isHidden
				|| (this.siteBlocks[blockId].slot === 'footer' && this.currentPage.footerSlotIsHidden);
		},
		isMovingBlockUpAllowed(blockId) {
			const blockIndex = this.pageBlocks.indexOf(blockId);

			return blockIndex !== 0 && blockIndex !== -1;
		},
		isMovingBlockDownAllowed(blockId) {
			const blockIndex = this.pageBlocks.indexOf(blockId);

			return blockIndex !== this.pageBlocks.length - 1 && blockIndex !== -1;
		},
		setPageBlocks(blocks) {
			this.mergePageData({
				pageId: this.currentPageId,
				pageData: {
					blocks,
				},
				pushToHistory: true,
			});
		},
		onMoveBlockUp(blockId) {
			this.setPageBlocks(moveOneLeft(this.pageBlocks, blockId));
			this.onAfterSectionReorder(blockId);
		},
		onMoveBlockDown(blockId) {
			this.setPageBlocks(moveOneRight(this.pageBlocks, blockId));
			this.onAfterSectionReorder(blockId);
		},
		async onAfterSectionReorder(blockId) {
			// wait till vue sets section order and renders it
			await this.$nextTick();
			this.handleBlockSelect(blockId);
			// Wait till block is reselected
			await this.$nextTick();
			// yOffset is arbitary, needed so we can see both blocks in view
			const yOffset = -150;
			const top = this.currentBlockRef.getBoundingClientRect().top + window.pageYOffset + yOffset;

			window.scrollTo({
				top,
				behavior: 'smooth',
			});
		},
		onSortBlockComponents() {
			const positionsAndIds = this.currentBlock.components.map((componentId) => {
				const { position } = this.siteElements[componentId].settings.styles;

				return {
					position,
					componentId,
				};
			});

			// grid position:
			// top/left/bottom/right
			// sorts by right
			// then sorts by bottom
			positionsAndIds.sort((position, position2) => {
				const splitPosition = position.position.split('/').map((singlePosition) => Number.parseInt(singlePosition, 10));
				const splitPosition2 = position2.position.split('/').map((singlePosition) => Number.parseInt(singlePosition, 10));

				if (splitPosition[2] > splitPosition2[2]) {
					return 1;
				}

				if (splitPosition[2] < splitPosition2[2]) {
					return -1;
				}

				if (splitPosition[3] > splitPosition2[3]) {
					return 1;
				}

				if (splitPosition[3] < splitPosition2[3]) {
					return -1;
				}

				return 0;
			});
			const sortedIds = positionsAndIds.map((position) => position.componentId);

			this.currentBlock.components = sortedIds;
		},
		onRemoveCurrentBlock() {
			this.leaveElementEditMode();
			this.closeBlockEditor();
			this.isTransitioning = true;

			const blockId = this.currentBlockId;

			gsap.to(this.getBlockRef(blockId), {
				height: 0,
				duration: BLOCK_REMOVE_DURATION / 1000, // GSAP uses seconds
				onComplete: () => {
					this.isTransitioning = false;
					this.removeBlock({
						blockId,
					});
					this.resetHoveredBlock();
				},
			});
		},
		movePublicScheduledPostsToPublishedTab(scheduledPosts) {
			Object.entries(scheduledPosts).forEach(([key, value]) => {
				const { date } = value;
				const currentDate = new Date().setHours(0, 0, 0, 0);
				const postDate = new Date(date).setHours(0, 0, 0, 0);

				if (currentDate >= postDate) {
					this.toggleBlogPostVisibility(key);
				}
			});
		},
	},
});
</script>

<style lang="scss" scoped>
$full-height-settings-padding: 8px;

.preview {
	$this: &;

	position: relative;

	/*
	* Without high min-height edit popup
	* is not always visible when users site has low height
	*/
	min-height: calc(100vh - #{$header-height-editor});

	&__content {
		position: relative;
		z-index: 0;
		display: flex;
		flex-direction: column;
		margin-bottom: 32px;
		user-select: none;
	}

	&__edit-block {
		opacity: 1;
		transition: opacity 0.15s $transition-timing-easing-standard;

		&[data-popper-reference-hidden]:not(.editing-navigation) {
			pointer-events: none;
			opacity: 0;
		}

		&--fixed-position {
			padding: 0 $full-height-settings-padding 0 calc($sidebar-width-editor - $full-height-settings-padding);
		}

		&--popup {
			z-index: $z-index-controls-edit-block;
		}

		&--button {
			z-index: $z-index-controls-edit-block-button;
		}

		@media screen and (max-width: $media-mobile) {
			width: 100%;
		}
	}
}

.fade-in {
	transform-origin: 50% -50px;

	&--quick {
		&-enter-active,
		&-leave-active {
			transition: transform 0.15s, opacity 0.1s;
		}

		&-enter,
		&-leave-to {
			opacity: 0;
			transform: rotateX(-10deg) scaleY(0.98) scaleX(0.99);
		}
	}

	&-enter-active,
	&-leave-active {
		transition: transform 0.25s, opacity 0.2s;
	}

	&-enter,
	&-leave-to {
		opacity: 0;
		transform: rotateX(-10deg) scaleY(0.98) scaleX(0.99);
	}
}
</style>
