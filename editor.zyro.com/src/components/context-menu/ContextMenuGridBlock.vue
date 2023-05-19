<template>
	<ContextMenu
		:is-rendering-allowed="!!rightClickedGridBlockId && isRenderingAllowed"
		@close-context-menu="rightClickedGridBlockId = null"
	>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridBlock.paste')"
			:disabled="isPastingAllowed"
			@click="pasteElement(), closeContextMenu()"
		/>
		<ZyroSeparator />
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridBlock.copySection')"
			@click="copyBlock(), closeContextMenu()"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridBlock.pasteSection')"
			:disabled="!doesCopiedBlockExist"
			@click="pasteBlock(), closeContextMenu()"
		/>
	</ContextMenu>
</template>

<script>
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuButton from '@/components/context-menu/ContextMenuButton.vue';

import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { useGridContextMenu } from '@/components/context-menu/useGridContextMenu';
import { cloneBlock } from '@/utils/siteDataUtils';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroSeparator,
		ContextMenu,
		ContextMenuButton,
	},

	props: {
		isRenderingAllowed: {
			type: Boolean,
			default: true,
		},
		isPastingAllowed: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['paste-element'],

	setup() {
		const {
			rightClickedGridBlockId,
			copiedGridBlockId,
		} = useGridContextMenu();

		const { closeContextMenu } = useContextMenu();

		return {
			rightClickedGridBlockId,
			copiedGridBlockId,
			closeContextMenu,

		};
	},

	computed: {
		...mapState([
			'website',
			'currentPageId',
			'currentLocale',
		]),
		...mapGetters(['siteBlocks']),
		doesCopiedBlockExist() {
			return !!this.siteBlocks[this.copiedGridBlockId];
		},
	},

	methods: {
		...mapActions(['addBlock']),
		pasteElement() {
			this.$emit('paste-element');
		},
		copyBlock() {
			this.copiedGridBlockId = this.rightClickedGridBlockId;
		},
		pasteBlock() {
			const {
				newBlock,
				newElements,
				newBlocks,
			} = cloneBlock({
				siteData: this.website,
				blockId: this.copiedGridBlockId,
				fromLocale: this.currentLocale,
				toLocale: this.currentLocale,
			});

			this.addBlock({
				pageId: this.currentPageId,
				blockData: newBlock,
				blocks: newBlocks,
				elements: newElements,
				previousBlockId: this.rightClickedGridBlockId,
			});
		},
	},
});
</script>
