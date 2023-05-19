<template>
	<BaseEditControls
		ref="editControlsRef"
		:button-title="$t('builder.editText.title')"
	>
		<div
			v-if="editor"
			class="toolbar"
		>
			<div class="toolbar__group">
				<EditTextColor />
			</div>
			<div class="toolbar__group">
				<EditTextType />
			</div>
			<div class="toolbar__group">
				<EditTextFont />
			</div>
			<div class="toolbar__group">
				<EditTextSize />
			</div>
			<EditTextFontStyle />
			<div class="toolbar__group">
				<EditTextList />
				<EditTextLink />
			</div>
			<div class="toolbar__group">
				<EditTextAlign />
			</div>
			<div class="toolbar__group">
				<EditTextClearFormatting />
			</div>
			<EditTextMore />
		</div>
	</BaseEditControls>
</template>

<script>
import {
	ref,
	defineComponent,
} from 'vue';

import EditTextAlign from '@/components/builder-controls/edit-text/EditTextAlign.vue';
import EditTextColor from '@/components/builder-controls/edit-text/EditTextColor.vue';
import EditTextFont from '@/components/builder-controls/edit-text/EditTextFont.vue';
import EditTextFontStyle from '@/components/builder-controls/edit-text/EditTextFontStyle.vue';
import EditTextLink from '@/components/builder-controls/edit-text/EditTextLink.vue';
import EditTextList from '@/components/builder-controls/edit-text/EditTextList.vue';
import EditTextMore from '@/components/builder-controls/edit-text/EditTextMore.vue';
import EditTextSize from '@/components/builder-controls/edit-text/EditTextSize.vue';
import EditTextType from '@/components/builder-controls/edit-text/EditTextType.vue';
import EditTextClearFormatting from '@/components/builder-controls/edit-text/EditTextClearFormatting.vue';

import BaseEditControls from '@/components/builder-controls/BaseEditControls.vue';
import { useTextEditor } from '@/use/text-editor/useTextEditor';

export default defineComponent({
	components: {
		BaseEditControls,
		EditTextFontStyle,
		EditTextColor,
		EditTextAlign,
		EditTextType,
		EditTextLink,
		EditTextMore,
		EditTextList,
		EditTextFont,
		EditTextSize,
		EditTextClearFormatting,
	},

	// Text editor controls need to wait for the editor to be ready and fully loaded.
	// Otherwise, it breaks on new text element addition while another editor is open.
	setup() {
		const { editor } = useTextEditor();

		const editControlsRef = ref(null);

		return {
			editor,
			editControlsRef,
		};
	},
});
</script>

<style lang="scss" scoped>
	.toolbar {
		display: flex;
		background-color: $color-light;
		border-radius: $border-radius-round;
		box-shadow: $box-shadow;

		&__group {
			position: relative;
			display: flex;

			&:not(:last-child)::before {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 1;
				width: 1px;
				height: 24px;
				margin: auto;
				content: "";
				background-color: $color-gray-border;
			}
		}

		@media screen and (max-width: $media-mobile) {
			flex-wrap: wrap;
			max-width: calc(100% - $sidebar-width-editor);
			margin-left: $sidebar-width-editor;
			border-radius: 0;
		}
	}
	</style>
