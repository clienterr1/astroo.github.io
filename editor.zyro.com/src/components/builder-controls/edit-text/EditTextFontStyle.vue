<template>
	<div class="toolbar__group">
		<EditTextButton
			:is-active="editor.isActive('bold')"
			:tooltip-text="tooltipBold"
			@click="handleTextBolding"
		>
			<ZyroSvgDeprecated name="bold" />
		</EditTextButton>
		<EditTextButton
			:is-active="editor.isActive('italic')"
			:tooltip-text="tooltipItalic"
			@click="editor.chain().focus().toggleItalic().run()"
		>
			<ZyroSvgDeprecated name="italic" />
		</EditTextButton>
		<EditTextButton
			:is-active="editor.isActive('underline')"
			:tooltip-text="tooltipUnderline"
			@click="editor.chain().focus().toggleUnderline().run()"
		>
			<ZyroSvgDeprecated name="underline" />
		</EditTextButton>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import {
	TEXT_EDITOR_FONT_WEIGHT_BOLD,
	TEXT_EDITOR_FONT_WEIGHT_REGULAR,
} from '@/constants';

import { useTextEditor } from '@/use/text-editor/useTextEditor';
import { getIsUserUsingMac } from '@/utils/getIsUserUsingMac';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		EditTextButton,
	},

	setup() {
		const { editor } = useTextEditor();

		const handleTextBolding = () => {
			editor.value.chain().focus().toggleBold().run();

			const newFontWeight = editor.value.isActive('bold') ? TEXT_EDITOR_FONT_WEIGHT_BOLD : TEXT_EDITOR_FONT_WEIGHT_REGULAR;

			editor.value.commands.setFontWeight(newFontWeight);
		};

		return {
			editor,
			handleTextBolding,
		};
	},

	computed: {
		tooltipBold() {
			return `${this.$t('builder.editText.bold')} ${getIsUserUsingMac() ? '⌘B' : '(CTRL+B)'}`;
		},
		tooltipItalic() {
			return `${this.$t('builder.editText.italic')} ${getIsUserUsingMac() ? '⌘I' : '(CTRL+I)'}`;
		},
		tooltipUnderline() {
			return `${this.$t('builder.editText.underline')} ${getIsUserUsingMac() ? '⌘U' : '(CTRL+U)'}`;
		},
	},
});
</script>
