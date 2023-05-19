<template>
	<ColorPicker
		:model-value="currentColor"
		:is-open="isOpen"
		portal-selector="[data-portal='builder-preview']"
		auto-update
		@update:model-value="updateTextColor"
		@click-outside="isOpen = false"
		@toggle="isOpen = !isOpen"
	>
		<EditTextButton
			is-rounded-left
			class="edit-text-color"
			:tooltip-text="$t('builder.editText.textColor')"
			:is-active="isOpen"
			:data-qa="'builder-colorpicker-toggle-btn'"
		>
			<ColorPickerButton :color="currentColor" />
		</EditTextButton>
	</ColorPicker>
</template>

<script>
import ColorPickerButton from '@/components/global/ColorPickerButton.vue';
import ColorPicker from '@/components/global/ColorPicker.vue';

import {
	computed,
	defineComponent,
} from 'vue';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import {
	TEXT_EDITOR_PROPERTY_COLOR_MARK,
	TEXT_EDITOR_NODE_NAME_HEADING,
	TEXT_EDITOR_NODE_NAME_PARAGRAPH,
	TEXT_EDITOR_PROPERTY_LIST_ITEM,
} from '@/constants';
import { useTextEditor } from '@/use/text-editor/useTextEditor';

export default defineComponent({
	components: {
		ColorPickerButton,
		ColorPicker,
		EditTextButton,
	},

	setup() {
		const {
			editor,
			isAllTextNodeSelected,
			getInlineStyleValue,
		} = useTextEditor();

		const colorUnderCursor = computed(() => {
			// Super hacky, but there's no other way for tiptap to detect what's the text color for
			// <h1>Text</h1>
			// when we only have this set in global styles:
			// .text-box h1 { color: var(--h1-color); }
			const currentNode = editor.value.view.domObserver.currentSelection.anchorNode;

			return currentNode?.parentNode && getComputedStyle(currentNode.parentNode).color;
		});

		return {
			editor,
			colorUnderCursor,
			isAllTextNodeSelected,
			getInlineStyleValue,
			TEXT_EDITOR_PROPERTY_COLOR_MARK,
		};
	},

	data() {
		return {
			isOpen: false,
		};
	},

	computed: {
		currentColor() {
			return this.getInlineStyleValue('color') || this.colorUnderCursor || 'rgb(26, 26, 26)';
		},
	},

	methods: {
		updateTextColor(newColor) {
			const isSelectionEmpty = this.editor.view.state.selection.empty;

			if (isSelectionEmpty || this.isAllTextNodeSelected) {
				if (isSelectionEmpty) {
					this.editor.commands.selectParentNode();
				}

				const colorAttribute = {
					color: newColor,
				};

				this.editor.chain()
					.unsetColor()
					.updateAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH, colorAttribute)
					.updateAttributes(TEXT_EDITOR_NODE_NAME_HEADING, colorAttribute)
					.updateAttributes(TEXT_EDITOR_PROPERTY_LIST_ITEM, colorAttribute)
					.focus()
					.run();

				return;
			}

			this.editor
				.chain()
				.setColor(newColor)
				.focus()
				.run();
		},

	},
});
</script>
