<template>
	<div class="add-element">
		<div
			v-for="(element,key) in filteredElements"
			:key="`add-${key}`"
			v-qa="`builder-addelements-element-${element.name}`"
			class="add-element__element"
			draggable="true"
			@click="handleElementClick(element)"
			@dragstart="onDragStart($event, key)"
			@dragend="onDragEnd"
		>
			<div class="add-element__icon">
				<ZyroSvgDeprecated :name="element.icon" />
			</div>
			<div
				class="z-body-small"
				v-text="element.name"
			/>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	useStore,
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { activeSlides } from '@zyro-inc/site-modules/components/blocks/slideshow/useBlockSlideshow';
import { DEFAULT_GRID_COLUMN_COUNT } from '@zyro-inc/site-modules/constants/defaultStyles';
import { DATA_ATTRIBUTE_ELEMENT_ID } from '@zyro-inc/site-modules/constants';

import EventLogApi from '@/api/EventLogApi';
import { addElementEvents } from '@/components/block-grid/BlockGridEvents';
import {
	getGridBlock,
	getLayoutBlock,
} from '@/components/block/blocks';
import { eventNames } from '@/data/analyticEventList';
import {
	mapActionsGui,
	CLOSE_DRAWER,
} from '@/store/builder/gui';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';
import { generateRandomId } from '@/utils/generateRandomId';
import { snapPositionToGrid } from '@/utils/snapPositionToGrid';
import { useAddElement } from '@/use/useAddElement';
import { useBlockLayout } from '@zyro-inc/site-modules/components/blocks/layout/useBlockLayout';

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	name: 'AddElementList',

	components: {
		ZyroSvgDeprecated,
	},

	setup() {
		const { getters } = useStore();
		const { defaultElements } = useAddElement();

		const currentBlock = computed(() => getters.currentBlock);
		const siteElements = computed(() => getters.siteElements);
		const { addLayoutElement } = useAddElement();

		const { layoutElements } = useBlockLayout({
			blockData: currentBlock,
			siteElements,
			shouldBuildResponsive: false,
		});

		return {
			defaultElements,
			addLayoutElement,
			currentBlock,
			layoutElements,
		};
	},

	data() {
		return {
			isEmptyPageDrag: false,
		};
	},

	computed: {
		...mapState([
			'currentPageId',
			'currentBlockId',
		]),
		...mapGetters([
			'siteBlocks',
			'currentPage',
			'isCurrentPageEmpty',
			'currentBlockType',
		]),
		...mapGetters('ecommerce', [
			'isEcommerceAvailableForUsers',
			'isStoreTypeZyro',
		]),
		...mapGetters('ecwid', ['isStoreTypeEcwid']),
		...mapGetters('flags', ['isLayoutOnly']),
		filteredElements() {
			return Object.fromEntries(Object.entries(this.defaultElements).filter(
				([, elementValue]) => {
					if (!this.isLayoutOnly && elementValue.content.type === 'GridShape') {
						return false;
					}

					if ((!this.isEcommerceAvailableForUsers && !this.isStoreTypeZyro) || this.isStoreTypeEcwid) {
						const isElementEcommerceButton = elementValue.content.type === 'GridEcommerceButton';

						return !isElementEcommerceButton;
					}

					return true;
				},
			));
		},
		currentBlockRowsCount() {
			return Number.parseInt(this.currentBlock.value.settings.styles.rows, 10);
		},
	},

	methods: {
		...mapActions([
			'addBlock',
			'removeBlock',
			'selectCurrentElement',
			'addElement',
			'updateAddElementData',
		]),
		...mapActionsGui({
			closeDrawer: CLOSE_DRAWER,
		}),
		...mapActionsNotifications({
			notify: NOTIFY,
		}),
		onDragStart(event, key) {
			if (this.isCurrentPageEmpty) {
				this.isEmptyPageDrag = true;

				this.addBlock({
					pageId: this.currentPageId,
					blockData: this.isLayoutOnly ? getLayoutBlock() : getGridBlock(),
				});
			}

			const {
				content,
				width,
				widthPixels,
				heightPixels,
				height,
			} = this.filteredElements[key];

			if (this.isLayoutOnly) {
				this.updateAddElementData({
					elementId: generateRandomId(),
					elementData: content,
					width: widthPixels,
					height: heightPixels,
				});
			} else {
				// DEPRECATED: dataTransfer should only be used with OLD grid
				// it will be removed after grid deprecation
				event.dataTransfer.setData('element', key);
				event.dataTransfer.setData('content', JSON.stringify(content));
				event.dataTransfer.setData('elementId', generateRandomId());
				event.dataTransfer.setData('width', width);
				event.dataTransfer.setData('height', height);
				event.dataTransfer.setData('widthPixels', widthPixels);
				event.dataTransfer.setData('heightPixels', heightPixels);
				event.dataTransfer.setData('eventData', JSON.stringify({
					from: 'addElement',
					action: 'drag',
					type: content.type,
				}));
			}
		},
		onDragEnd() {
			if (this.isEmptyPageDrag) {
				this.handleEmptyPageBlock();
				this.isEmptyPageDrag = false;
			}
		},
		handleEmptyPageBlock() {
			const blockId = this.currentPage.blocks[0];
			const hasElements = this.siteBlocks[blockId].components.length > 0;

			if (!hasElements) {
				this.removeBlock({
					blockId,
				});
			}
		},
		async handleElementClick(element) {
			const isBlockLayout = this.currentBlockType === 'BlockLayout';
			const isBlockGrid = this.currentBlockType === 'BlockGrid';
			const isBlockSlideshow = this.currentBlockType === 'BlockSlideshow';

			EventLogApi.logEvent({
				eventName: eventNames.builder.add_element,
				eventProperties: {
					from: 'addElement',
					action: 'click',
					type: addElementEvents[element.content.type],
				},
			});

			if (!isBlockGrid && !isBlockLayout && !isBlockSlideshow) {
				this.notify({
					messageI18nKeyPath: 'builder.failedToAddElementToSectionErrorMessage',
				});

				return;
			}

			const newElementId = generateRandomId();
			const elementToAdd = {
				...element.content,
				settings: {
					...element.content.settings,
					styles: {
						...(element.content.settings?.styles || {}),
					},
				},
			};

			if (isBlockSlideshow || isBlockGrid) {
				const position = this.getElementPositionInCenter(element);
				const positionString = `${position.y1}/${position.x1}/${position.y2}/${position.x2}`;

				elementToAdd.settings.styles.position = positionString;
				const blockId = isBlockSlideshow ? activeSlides.value[this.currentBlockId] : this.currentBlockId;

				this.addElement({
					blockId,
					elementId: newElementId,
					elementData: elementToAdd,
				});
			}

			if (isBlockLayout) {
				const currentBlockSelected = document.querySelector(`[data-block-ref='${this.currentBlockId}'`);

				const {
					width: blockLayoutWidth,
					height: blockLayoutHeight,
					left: blockLayoutLeft,
					top: blockLayoutTop,
				} = currentBlockSelected.getBoundingClientRect();

				this.addLayoutElement({
					layoutElements: this.layoutElements,
					blockId: this.currentBlockId,
					blockToAddRef: currentBlockSelected,
					elementId: newElementId,
					newElementData: elementToAdd,
					newElementRawLeft: blockLayoutLeft + (blockLayoutWidth / 2 - element.widthPixels / 2), // Center element horizontally
					newElementRawTop: blockLayoutTop + (blockLayoutHeight / 2 - element.heightPixels / 2), // Center element vertically
					newElementRawWidth: element.widthPixels,
					newElementRawHeight: element.heightPixels,
				});
			}

			await this.$nextTick();

			this.selectCurrentElement({
				elementId: newElementId,
			});

			document.querySelector(`[${DATA_ATTRIBUTE_ELEMENT_ID}="${newElementId}"]`).scrollIntoView({
				block: 'nearest',
			});

			this.closeDrawer();
		},
		getElementPositionInCenter(element) {
			// Without offset, element is added too much to the left (probably because of invisible columns), so using offset to normalise
			const blockXOffset = 3;
			const xSideOffset = Math.round((DEFAULT_GRID_COLUMN_COUNT - element.width) / 2) + blockXOffset;
			const ySideOffset = Math.round((this.currentBlockRowsCount - element.height) / 2);

			return snapPositionToGrid({
				position: {
					x1: xSideOffset,
					x2: xSideOffset + element.width,
					y1: ySideOffset,
					y2: ySideOffset + element.height,
				},
				columnCount: DEFAULT_GRID_COLUMN_COUNT,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.add-element {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 16px;
	color: $color-gray;
	text-align: center;

	@media screen and (max-height: $media-mobile) {
		grid-template-columns: 1fr 1fr 1fr;
	}

	&__info {
		display: block;
		padding: 12px 24px;
		margin-bottom: 12px;
		text-align: center;
		background: $color-gray-light;
	}

	&__icon {
		display: flex;
		width: 100%;
		padding: 16px;
		margin-bottom: 8px;
		border: 1px solid $color-gray-border;
		transition: 300ms border-color;

		svg {
			width: 100%;
			height: 48px;
		}
	}

	&__element {
		cursor: move;

		&:hover {
			.add-element {
				&__icon {
					border-color: $color-dark;
				}
			}
		}
	}
}
</style>
