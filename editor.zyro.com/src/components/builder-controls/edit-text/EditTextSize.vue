<template>
	<div>
		<EditTextButton
			ref="editTextSizeButton"
			:data-qa="'edittext-textsize-button'"
			:tooltip-text="$t('builder.editText.fontSize')"
			class="text-size-button"
			:is-active="isTextSizeSelectOpen"
			:is-square="false"
			@click="toggleTextSizeInput"
		>
			<input
				ref="fontSizeInput"
				v-qa="'edittext-textsize-input'"
				type="number"
				maxlength="2"
				min="0"
				:max="MAX_FONT_SIZE"
				class="text-size-input"
				:value="currentFontSize"
				@input="updateFontSize($event.target.value)"
			>
			<ZyroSvgDeprecated
				name="chevron"
				direction="down"
			/>
		</EditTextButton>
		<Popup
			v-if="isTextSizeSelectOpen"
			:target-ref="$refs.editTextSizeButton && $refs.editTextSizeButton.$el"
			placement="bottom-start"
			auto-update
			:offset="4"
			portal-selector="[data-portal='builder-preview']"
			@click-outside="isTextSizeSelectOpen = false"
		>
			<div class="font-size-select">
				<div
					v-for="size in DEFAULT_FONT_SIZES"
					:key="size"
					v-qa="`edittext-textsize-option-${size}`"
					class="font-size-select__item"
					:class="{ 'font-size-select__item--active': currentFontSize === size }"
					@click="updateFontSize(size), isTextSizeSelectOpen = false"
				>
					{{ size }}
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import Popup from '@/components/global/Popup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapGetters } from 'vuex';

import {
	PROPERTY_FONT_SIZE,
	PROPERTY_M_FONT_SIZE,
} from '@zyro-inc/site-modules/constants/globalStyles';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';

import {
	TEXT_EDITOR_LEVELS_HEADING,
	TEXT_EDITOR_NODE_NAME_HEADING,
	TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';
import { useTextEditor } from '@/use/text-editor/useTextEditor';

import { defineComponent } from 'vue';

const DEFAULT_FONT_SIZES = [
	14,
	16,
	18,
	24,
	32,
	48,
	64,
	72,
];

const MAX_FONT_SIZE = 240;

export default defineComponent({
	components: {
		Popup,
		ZyroSvgDeprecated,
		EditTextButton,
	},

	setup() {
		const {
			editor,
			isAllTextNodeSelected,
			getInlineStyleValue,
		} = useTextEditor();

		return {
			editor,
			isAllTextNodeSelected,
			getInlineStyleValue,
			TEXT_EDITOR_LEVELS_HEADING,
			TEXT_EDITOR_NODE_NAME_HEADING,
			TEXT_EDITOR_NODE_NAME_PARAGRAPH,
			PROPERTY_FONT_SIZE,
			PROPERTY_M_FONT_SIZE,
			DEFAULT_FONT_SIZES,
			MAX_FONT_SIZE,
		};
	},

	data() {
		return {
			isTextSizeSelectOpen: false,
		};
	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
		...mapGetters(['siteStyles']),
		currentFontSize() {
			const fontSizeKey = this.isMobileMode ? 'fontSizeMobile' : 'fontSizeDesktop';
			const inlineFontSize = this.getInlineStyleValue(fontSizeKey);

			if (inlineFontSize) {
				return Number.parseInt(inlineFontSize, 10);
			}

			const headingLevel = this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_HEADING).level;
			const headingName = headingLevel ? `h${headingLevel}` : null;
			const paragraphName = this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).className;
			const fontSize = Number.parseInt(this.getFontSize(headingName || paragraphName), 10);

			return fontSize;
		},
	},

	methods: {
		// Fake text selection makes sure that selected text is being highlighted (has a bluish background)
		// even when font size changing input is being focused in edit text toolbar
		setFakeTextSelection() {
			const isSelectionEmpty = this.editor.view.state.selection.empty;

			this.$refs.fontSizeInput.select();

			if (isSelectionEmpty) {
				this.editor.chain().selectParentNode().run();
			}
		},
		getFontSize(typographyName) {
			const currentTypography = this.siteStyles[typographyName];

			if (!currentTypography) {
				return DEFAULT_FONT_SIZES[1];
			}

			const desktopFontSize = currentTypography[PROPERTY_FONT_SIZE];
			const mobileFontSize = currentTypography[PROPERTY_M_FONT_SIZE];

			return this.isMobileMode ? (mobileFontSize || desktopFontSize) : desktopFontSize;
		},
		updateFontSize(value) {
			if (!value || value > MAX_FONT_SIZE) {
				return;
			}

			const isSelectionEmpty = this.editor.view.state.selection.empty;
			const selectedFontSize = `${value}px`;

			// If selection is empty OR all node (text line) is selected, reset marks (spans) and update parent node style attribute
			if (isSelectionEmpty || this.isAllTextNodeSelected) {
				if (isSelectionEmpty) {
					this.editor.commands.selectParentNode();
				}

				const fontSizeKey = this.isMobileMode ? 'fontSizeMobile' : 'fontSizeDesktop';
				const lineHeightKey = this.isMobileMode ? 'lineHeightMobile' : 'lineHeightDesktop';

				const attributesToUpdate = {
					[fontSizeKey]: selectedFontSize,
					[lineHeightKey]: 1.3,
					letterSpacing: 0,
				};

				// 2 separate calls covers the edge case, when you select multiple text nodes types, for example 1 heading and 2 paragraphs
				// it makes sure that both - headings and paragraphs get resized
				this.editor.chain()
					.unsetMarkFontSize()
					.updateAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH, attributesToUpdate)
					.updateAttributes(TEXT_EDITOR_NODE_NAME_HEADING, attributesToUpdate)
					.run();

				return;
			}

			// Otherwise, if specific text part is selected, wrap it into span and update span's style attribute
			// Reset global styles letter spacing when rewriting
			this.editor.chain()
				.setMarkFontSize(selectedFontSize, this.isMobileMode)
				.setMarkLetterSpacing(0)
				.run();
		},
		toggleTextSizeInput() {
			this.isTextSizeSelectOpen = !this.isTextSizeSelectOpen;

			if (this.isTextSizeSelectOpen) {
				this.$refs.fontSizeInput.select();
			} else {
				this.$refs.fontSizeInput.blur();
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.text-size-button {
	&:focus-within {
		cursor: text;
	}
}

.text-size-input {
	width: 42px;
	cursor: pointer;
	background: transparent;
	border: none;
	outline: none;

	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		appearance: none;
		margin: 0;
	}

	&:focus {
		cursor: text;
	}

	&[type="number"] {
		appearance: textfield;
	}
}

.font-size-select {
	padding: 4px 0;
	background: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;

	&__item {
		width: 48px;
		padding: 4px 8px;
		font-size: 14px;
		line-height: 20px;

		&:hover {
			cursor: pointer;
			background: $color-gray-light;
		}

		&--active {
			background: $color-gray-light;
		}
	}
}
</style>
