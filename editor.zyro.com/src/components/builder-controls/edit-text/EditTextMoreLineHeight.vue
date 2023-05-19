<template>
	<EditTextMoreItem :title="$t('builder.editText.lineHeight')">
		<ZyroRange
			type="range"
			:min="MIN_LINE_HEIGHT"
			:max="MAX_LINE_HEIGHT"
			:step="STEP"
			has-number-input
			:model-value="currentLineHeight"
			@update:model-value="handleInput"
		/>
	</EditTextMoreItem>
</template>

<script>
import ZyroRange from '@/components/global/ZyroRange.vue';

import { mapGetters } from 'vuex';
import {
	TEXT_EDITOR_NODE_NAME_HEADING,
	TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';
import EditTextMoreItem from '@/components/builder-controls/edit-text/EditTextMoreItem.vue';
import { useTextEditor } from '@/use/text-editor/useTextEditor';

import { defineComponent } from 'vue';

const MIN_LINE_HEIGHT = 0.5;
const MAX_LINE_HEIGHT = 3;
const STEP = 0.01;

export default defineComponent({
	components: {
		ZyroRange,
		EditTextMoreItem,
	},

	setup() {
		const {
			editor,
			getInlineStyleValue,
		} = useTextEditor();

		return {
			MIN_LINE_HEIGHT,
			MAX_LINE_HEIGHT,
			STEP,
			editor,
			getInlineStyleValue,
		};
	},

	computed: {
		...mapGetters(['siteStyles']),
		...mapGetters('gui', ['isMobileMode']),
		currentLineHeight() {
			const lineHeightKey = this.isMobileMode ? 'lineHeightMobile' : 'lineHeightDesktop';
			const inlineFontSize = this.getInlineStyleValue(lineHeightKey);

			if (inlineFontSize || !this.editor) {
				return Number.parseFloat(inlineFontSize, 10);
			}

			const headingLevel = this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_HEADING).level;
			const paragraphClassName = this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).className;
			const globalStylesKey = headingLevel ? `h${headingLevel}` : paragraphClassName;
			const globalStylesObject = this.siteStyles[globalStylesKey];
			const lineHeight = Number.parseFloat(globalStylesObject['line-height'], 10);

			return lineHeight;
		},
	},

	methods: {
		handleInput(value) {
			// Rewrite "global styles" value only if custom value is not the same
			if (value === this.currentLineHeight) {
				return;
			}

			const lineHeightKey = this.isMobileMode ? 'lineHeightMobile' : 'lineHeightDesktop';
			const attributeToUpdate = {
				[lineHeightKey]: value,
			};

			this.editor.chain()
				.updateAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH, attributeToUpdate)
				.updateAttributes(TEXT_EDITOR_NODE_NAME_HEADING, attributeToUpdate)
				.run();
		},
	},
});
</script>
