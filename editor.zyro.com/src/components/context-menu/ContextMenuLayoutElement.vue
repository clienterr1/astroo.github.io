<template>
	<ContextMenu
		:is-enabled="!!selectedLayoutElementId"
		:trigger-ref="triggerRef"
		@close-context-menu="handleCloseMenu"
	>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.cut')"
			:shortcut="{
				mac: '⌘ X',
				windows: 'Ctrl+X',
			}"
			@click="executeCommand('cut')"
		/>
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.copy')"
			:shortcut="{
				mac: '⌘ C',
				windows: 'Ctrl+C',
			}"
			@click="executeCommand('copy')"
		/>
		<ContextMenuButton
			:title="$t('common.duplicate')"
			:shortcut="{
				mac: '⌘ D',
				windows: 'Ctrl+D',
			}"
			@click="executeCommand('duplicate')"
		/>
		<ZyroSeparator />
		<ContextMenuButton
			:title="$t('builder.contextMenu.gridItem.sendFront')"
			:shortcut="{
				mac: '⌥ ⌘ ]',
				windows: 'Ctrl+Shift+]',
			}"
			:disabled="isElementZindexMax"
			@click="executeCommand('sendFront', {
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
			@click="executeCommand('moveForward', {
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
			@click="executeCommand('sendBack',{
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
			@click="executeCommand('moveBackward',{
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
			@click="executeCommand('delete')"
		/>
	</ContextMenu>
</template>

<script>
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import ContextMenu from '@/components/context-menu/ContextMenu.vue';
import ContextMenuButton from '@/components/context-menu/ContextMenuButton.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';
import {
	moveRight,
	moveLeft,
} from '@/utils/array';

import { defineComponent } from 'vue';

const CONTEXT_MENU_AVAILABLE_COMMANDS = [
	'sendFront',
	'moveForward',
	'sendBack',
	'moveBackward',
	'cut',
	'copy',
	'duplicate',
	'delete',
];

export default defineComponent({
	components: {
		ContextMenu,
		ContextMenuButton,
		ZyroSeparator,
	},
	props: {
		triggerRef: {
			type: Element,
			default: null,
		},
	},
	setup(props, context) {
		const {
			selectedLayoutElementId,
			copiedElementId,
			isElementCut,
		} = useLayoutContextMenu();

		const { closeContextMenu } = useContextMenu();

		const handleCloseMenu = () => {
			selectedLayoutElementId.value = null;

			if (props.triggerRef) {
				context.emit('close-context-menu');
			} else {
				closeContextMenu();
			}
		};

		return {
			selectedLayoutElementId,
			copiedElementId,
			isElementCut,
			handleCloseMenu,
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
			return this.blockZIndexes[this.blockZIndexes.length - 1] === this.selectedLayoutElementId;
		},
		isElementZindexMin() {
			return this.blockZIndexes[0] === this.selectedLayoutElementId;
		},
	},

	methods: {
		...mapActions([
			'duplicateCurrentElement',
			'removeCurrentElement',
			'updateBlockData',
		]),
		cutElement() {
			this.copiedElementId = this.selectedLayoutElementId;
			this.isElementCut = true;
		},
		copyElement() {
			this.copiedElementId = this.selectedLayoutElementId;
			this.isElementCut = false;
		},
		updateZIndex(params) {
			const {
				shouldMoveLeft = false,
				shouldMoveFully = false,
			} = params;
			const zindexes = shouldMoveLeft
				? moveLeft(this.blockZIndexes, this.selectedLayoutElementId, shouldMoveFully)
				: moveRight(this.blockZIndexes, this.selectedLayoutElementId, shouldMoveFully);

			this.updateBlockData({
				blockId: this.currentElementBlockId,
				blockData: {
					zindexes,
				},
				merge: true,
				pushToHistory: true,
			});
		},
		executeCommand(command, commandProps) {
			if (!command || !CONTEXT_MENU_AVAILABLE_COMMANDS.includes(command)) return;

			if ([
				'sendFront',
				'moveForward',
				'sendBack',
				'moveBackward',
			].includes(command)) {
				this.updateZIndex(commandProps);
			}

			if (command === 'cut') this.cutElement();
			if (command === 'copy') this.copyElement();
			if (command === 'duplicate') this.duplicateCurrentElement();
			if (command === 'delete') this.removeCurrentElement();

			this.handleCloseMenu();
			this.selectedLayoutElementId = null;
		},
	},
});
</script>
