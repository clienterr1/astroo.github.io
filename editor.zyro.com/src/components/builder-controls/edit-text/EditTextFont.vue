<template>
	<div>
		<EditTextButton
			ref="editTextFontButton"
			:is-active="isFontSelectOpen"
			:data-qa="'edittext-textfont-button'"
			:is-square="false"
			:tooltip-text="$t('common.font')"
			@click="isFontSelectOpen = !isFontSelectOpen"
		>
			<div class="text-font-button">
				<div class="text-font-button__text">
					{{ currentFontFamily }}
				</div>
				<ZyroSvgDeprecated
					class="text-font-button__icon"
					name="chevron"
					direction="down"
				/>
			</div>
		</EditTextButton>
		<FontSelect
			:target-ref="$refs.editTextFontButton && $refs.editTextFontButton.$el"
			:is-open="isFontSelectOpen"
			auto-update
			@click-outside="isFontSelectOpen = false"
			@update="updateFont($event), isFontSelectOpen = false"
		/>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapGetters } from 'vuex';

import { useTextEditor } from '@/use/text-editor/useTextEditor';

import EditTextButton from '@/components/builder-controls/edit-text/EditTextButton.vue';
import FontSelect from '@/components/builder-controls/edit-text/FontSelect.vue';

import {
	TEXT_EDITOR_NODE_NAME_HEADING,
	TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';
import { addBreadcrumb } from '@sentry/browser';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		EditTextButton,
		FontSelect,
	},

	setup() {
		const { editor } = useTextEditor();

		return {
			editor,
		};
	},

	data() {
		return {
			isFontSelectOpen: false,
		};
	},

	computed: {
		...mapGetters(['siteStyles']),
		...mapGetters('fonts', ['getFontNames']),
		currentFontFamily() {
			const customFontFamily = this.editor.getAttributes('textStyle').fontFamily;

			if (customFontFamily) {
				return customFontFamily;
			}

			// Handle Global Styles font family
			const headingLevel = this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_HEADING).level;
			const tagName = headingLevel ? `h${headingLevel}` : this.editor.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH).className;

			addBreadcrumb({
				category: 'DEBUG:13699',
				data: {
					tagName,
					headingLevel,
				},
			});

			const isPrimary = tagName && this.siteStyles[tagName]['font-family'].includes('primary');

			if (isPrimary) {
				return this.getFontNames.primary;
			}

			return this.getFontNames.secondary;
		},
	},

	methods: {
		updateFont({
			fontFamily,
			fontWeight,
		}) {
			const isSelectionEmpty = this.editor.view.state.selection.empty;

			if (isSelectionEmpty) {
				this.editor.commands.selectParentNode();
			}

			if (fontFamily) {
				this.editor.commands.setFontFamily(fontFamily);
			}

			if (fontWeight) {
				this.editor.commands.setFontWeight(fontWeight);
			}

			this.editor.commands.focus();
		},
	},
});
</script>

<style lang="scss" scoped>
.text-font-input {
	width: 76px;
}

.text-font-button {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 104px;

	&__text {
		margin-right: 4px;
		overflow: hidden;
		text-align: start;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__icon {
		flex-shrink: 0;
	}
}
</style>
