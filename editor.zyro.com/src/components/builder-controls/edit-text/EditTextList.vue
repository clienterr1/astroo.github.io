<template>
	<div>
		<EditTextButton
			ref="editTextListButton"
			:disabled="editor.isActive(TEXT_EDITOR_NODE_NAME_HEADING)"
			:tooltip-text="$t('builder.editText.list')"
			:is-active="isTextListSettingsOpen"
			@click="isTextListSettingsOpen = !isTextListSettingsOpen"
		>
			<ZyroSvgDeprecated name="bulleted-list" />
		</EditTextButton>
		<Popup
			v-if="isTextListSettingsOpen"
			:target-ref="$refs.editTextListButton && $refs.editTextListButton.$el"
			placement="bottom"
			:offset="4"
			auto-update
			portal-selector="[data-portal='builder-preview']"
			@click-outside="isTextListSettingsOpen = false"
		>
			<EditTextIconControls
				:icons="LIST_VALUES"
				:model-value="currentListValue"
				@update:model-value="updateListValue"
			/>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';
import EditTextIconControls from '@/components/builder-controls/edit-text/EditTextIconControls.vue';

import {
	TEXT_EDITOR_NODE_NAME_HEADING,
	TEXT_EDITOR_NODE_NAME_PARAGRAPH,
	TEXT_EDITOR_PROPERTY_TEXT_STYLE,
	TEXT_EDITOR_PROPERTY_LIST_ITEM,
} from '@/constants';
import { useTextEditor } from '@/use/text-editor/useTextEditor';
import {
	ref,
	computed,
	defineComponent,
} from 'vue';

export default defineComponent({
	components: {
		Popup,
		ZyroSvgDeprecated,
		EditTextButton,
		EditTextIconControls,
	},

	setup() {
		const { editor } = useTextEditor();

		const isTextListSettingsOpen = ref(false);

		const LIST_VALUES = [
			{
				translationPath: 'builder.editText.bulletedList',
				value: 'bulletList',
				icon: 'bulleted-list',
				toggle: () => {
					const customColor = editor.value.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).color
						|| editor.value.getAttributes(TEXT_EDITOR_PROPERTY_TEXT_STYLE).color;

					editor.value.chain().focus().toggleBulletList().run();
					if (customColor) {
						editor.value.commands.updateAttributes(TEXT_EDITOR_PROPERTY_LIST_ITEM, {
							color: customColor,
						});
					}
				},
			},
			{
				translationPath: 'builder.editText.numberedList',
				value: 'orderedList',
				icon: 'numbered-list',
				toggle: () => {
					const customColor = editor.value.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).color
						|| editor.value.getAttributes(TEXT_EDITOR_PROPERTY_TEXT_STYLE).color;

					editor.value.chain().focus().toggleOrderedList().run();

					if (customColor) {
						editor.value.commands.updateAttributes(TEXT_EDITOR_PROPERTY_LIST_ITEM, {
							color: customColor,
						});
					}
				},
			},
		];

		const updateListValue = (newValue) => LIST_VALUES.find((list) => list.value === newValue).toggle();
		const currentListValue = computed(() => LIST_VALUES.find(({ value }) => editor.value.isActive(value))?.value);

		return {
			editor,
			currentListValue,
			updateListValue,
			isTextListSettingsOpen,
			LIST_VALUES,
			TEXT_EDITOR_NODE_NAME_HEADING,
		};
	},
});
</script>
