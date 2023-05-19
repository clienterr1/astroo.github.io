<template>
	<ContextMenu
		:is-enabled="!!selectedLayoutBlockId && isEnabled"
		:trigger-ref="triggerRef"
		@close-context-menu="handleCloseMenu"
	>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridBlock.paste')"
			:disabled="!isPastingAllowed"
			@click="handlePasteElement($event)"
		/>
		<ZyroSeparator />
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridBlock.copySection')"
			:disabled="isFooter"
			@click="handleCopyBlock"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridBlock.pasteSection')"
			:disabled="!doesCopiedBlockExist || isFooter"
			@click="handlePasteBlock"
		/>
	</ContextMenu>
</template>

<script>
import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuButton from '@/components/context-menu/ContextMenuButton.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { cloneBlock } from '@/utils/siteDataUtils';
import { useStore } from 'vuex';
import { useAddElement } from '@/use/useAddElement';
import cloneDeep from 'lodash.clonedeep';
import { generateRandomId } from '@/utils/generateRandomId';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	components: {
		ContextMenu,
		ContextMenuButton,
		ZyroSeparator,
	},
	props: {
		isEnabled: {
			type: Boolean,
			default: true,
		},
		isPastingAllowed: {
			type: Boolean,
			required: true,
		},
		layoutElements: {
			type: Array,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		triggerRef: {
			type: Element,
			default: null,
		},
	},
	emits: ['close-context-menu'],
	setup(props, context) {
		const {
			selectedLayoutBlockId,
			copiedLayoutBlockId,
			copiedElementId,
			isElementCut,
		} = useLayoutContextMenu();

		const { closeContextMenu } = useContextMenu();

		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { addLayoutElement } = useAddElement();

		const website = computed(() => state.website);
		const currentLocale = computed(() => state.currentLocale);
		const currentPageId = computed(() => state.currentPageId);
		const siteElements = computed(() => getters.siteElements);
		const siteBlocks = computed(() => getters.siteBlocks);
		const isMobileMode = computed(() => getters['gui/isMobileMode']);
		const isFooter = computed(() => siteBlocks.value[selectedLayoutBlockId.value]?.slot === 'footer');
		const doesCopiedBlockExist = computed(() => !!siteBlocks.value[copiedLayoutBlockId.value]);

		const copyBlock = () => {
			copiedLayoutBlockId.value = selectedLayoutBlockId.value;
		};

		const pasteBlock = () => {
			const {
				newBlock,
				newElements,
				newBlocks,
			} = cloneBlock({
				siteData: website.value,
				blockId: copiedLayoutBlockId.value,
				fromLocale: currentLocale.value,
				toLocale: currentLocale.value,
			});

			dispatch('addBlock', {
				pageId: currentPageId.value,
				blockData: newBlock,
				blocks: newBlocks,
				elements: newElements,
				previousBlockId: selectedLayoutBlockId.value,
			});
		};

		const pasteElement = (element) => {
			const copiedElementData = siteElements.value[copiedElementId.value];

			if (!copiedElementData) {
				return;
			}

			const newElementData = cloneDeep(copiedElementData);
			const blockToAddRef = document.querySelector(`[data-block-ref='${props.blockId}']`);

			addLayoutElement({
				layoutElements: props.layoutElements,
				blockId: props.blockId,
				blockToAddRef,
				elementId: generateRandomId(),
				newElementData,
				newElementRawLeft: element.clientX,
				newElementRawTop: element.clientY,
				newElementRawWidth: isMobileMode.value ? newElementData.mobile.width : newElementData.desktop.width,
				newElementRawHeight: isMobileMode.value ? newElementData.mobile.height : newElementData.desktop.height,
			});

			if (isElementCut.value) {
				dispatch('removeElement', {
					elementId: copiedElementId.value,
				});

				isElementCut.value = null;
				copiedElementId.value = null;
			}
		};

		const handleCloseMenu = () => {
			selectedLayoutBlockId.value = null;

			if (props.triggerRef) {
				context.emit('close-context-menu');
			} else {
				closeContextMenu();
			}
		};

		const handleCopyBlock = () => {
			copyBlock();
			handleCloseMenu();
		};

		const handlePasteBlock = () => {
			pasteBlock();
			handleCloseMenu();
		};

		const handlePasteElement = (element) => {
			pasteElement(element);
			handleCloseMenu();
		};

		return {
			isFooter,
			doesCopiedBlockExist,
			selectedLayoutBlockId,
			copiedLayoutBlockId,
			closeContextMenu,
			handleCopyBlock,
			handlePasteBlock,
			handlePasteElement,
			handleCloseMenu,
		};
	},
});
</script>
