<template>
	<ContextMenu
		:is-rendering-allowed="!!rightClickedElementId"
		@close-context-menu="rightClickedElementId = null"
	>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.cut')"
			:shortcut="{
				mac: '⌘ X',
				windows: 'Ctrl+X',
			}"
			@click="closeContextMenu(), cutElement()"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.copy')"
			:shortcut="{
				mac: '⌘ C',
				windows: 'Ctrl+C',
			}"
			@click="closeContextMenu(), copyElement()"
		/>
		<ContextMenuButton
			:title="$t('common.duplicate')"
			:shortcut="{
				mac: '⌘ D',
				windows: 'Ctrl+D',
			}"
			@click="closeContextMenu(), duplicateCurrentElement()"
		/>
		<ZyroSeparator />
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.sendFront')"
			:shortcut="{
				mac: '⌥ ⌘ ]',
				windows: 'Ctrl+Shift+]',
			}"
			:disabled="isElementZindexMax"
			@click="closeContextMenu(), updateZIndex({
				shouldMoveLeft: false,
				shouldMoveFully: true,
			})"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.moveForward')"
			:shortcut="{
				mac: '⌘ ]',
				windows: 'Ctrl+]',
			}"
			:disabled="isElementZindexMax"
			@click="closeContextMenu(), updateZIndex({
				shouldMoveLeft: false,
				shouldMoveFully: false,
			})"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.sendBack')"
			:shortcut="{
				mac: '⌥ ⌘ [',
				windows: 'Ctrl+Shift+[',
			}"
			:disabled="isElementZindexMin"
			@click="closeContextMenu(), updateZIndex({
				shouldMoveLeft: true,
				shouldMoveFully: true,
			})"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.moveBackward')"
			:shortcut="{
				mac: '⌘ [',
				windows: 'Ctrl+[',
			}"
			:disabled="isElementZindexMin"
			@click="closeContextMenu(), updateZIndex({
				shouldMoveLeft: true,
				shouldMoveFully: false,
			})"
		/>
		<ZyroSeparator />
		<ContextMenuButton
			:title="$t('common.delete')"
			:shortcut="{
				mac: '⌫',
				windows: 'Backspace',
			}"
			@click="closeContextMenu(), removeCurrentElement()"
		/>
	</ContextMenu>
</template>

<script>
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuButton from '@/components/context-menu/ContextMenuButton.vue';

import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { useGridContextMenu } from '@/components/context-menu/useGridContextMenu';
import {
	moveRight,
	moveLeft,
} from '@/utils/array';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSeparator,
		ContextMenu,
		ContextMenuButton,
	},

	setup() {
		const {
			rightClickedElementId,
			copiedElementId,
			isElementCut,
		} = useGridContextMenu();
		const { closeContextMenu } = useContextMenu();

		return {
			rightClickedElementId,
			copiedElementId,
			isElementCut,
			closeContextMenu,
		};
	},

	computed: {
		...mapState(['currentElementId']),
		...mapGetters([
			'currentElementBlockId',
			'currentElement',
			'siteBlocks',
		]),
		blockZIndexes() {
			return this.siteBlocks[this.currentElementBlockId]?.zindexes || [];
		},
		isElementZindexMax() {
			return this.blockZIndexes[this.blockZIndexes.length - 1] === this.rightClickedElementId;
		},
		isElementZindexMin() {
			return this.blockZIndexes[0] === this.rightClickedElementId;
		},
	},

	watch: {
		// Closes menu when other shortcuts are used to modfiy the element
		currentElement() {
			this.rightClickedElementId = null;
			this.closeContextMenu();
		},
	},

	methods: {
		...mapActions([
			'duplicateCurrentElement',
			'removeCurrentElement',
			'updateBlockData',
		]),
		cutElement() {
			this.copiedElementId = this.rightClickedElementId;
			this.isElementCut = true;
		},
		copyElement() {
			this.copiedElementId = this.rightClickedElementId;
			this.isElementCut = false;
		},
		updateZIndex(params) {
			const {
				shouldMoveLeft = false,
				shouldMoveFully = false,
			} = params;
			const zindexes = shouldMoveLeft
				? moveLeft(this.blockZIndexes, this.rightClickedElementId, shouldMoveFully)
				: moveRight(this.blockZIndexes, this.rightClickedElementId, shouldMoveFully);

			this.updateBlockData({
				blockId: this.currentElementBlockId,
				blockData: {
					zindexes,
				},
				merge: true,
				pushToHistory: true,
			});
		},
	},
});
</script>
