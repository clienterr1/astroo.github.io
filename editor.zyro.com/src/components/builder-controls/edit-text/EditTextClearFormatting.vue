<template>
	<div class="toolbar__group">
		<EditTextButton
			:tooltip-text="$t('builder.editText.clearFormatting')"
			@click="clearFormatting"
		>
			<ZyroSvgDeprecated name="clear-formatting" />
		</EditTextButton>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import { useTextEditor } from '@/use/text-editor/useTextEditor';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		EditTextButton,
	},

	setup() {
		const { editor } = useTextEditor();

		const clearFormatting = () => {
			const isSelectionEmpty = editor.value.view?.state?.selection.empty;

			if (isSelectionEmpty) {
				return;
			}

			editor.value
				.chain()
				.unsetAllMarks()
				.focus()
				.run();
		};

		return {
			editor,
			clearFormatting,
		};
	},
});
</script>
