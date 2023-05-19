<template>
	<!-- notranslate class is needed to prevent browser extensions from breaking the textbox -->
	<!-- @dragstart.prevent needed to prevent default link dragging behavior -->
	<GridTextBox
		ref="textBoxRef"
		class="notranslate"
		data-qa="builder-gridelement-gridtextbox"
		:is-white-space-normal="isWhiteSpaceNormal"
		:background-color="data.backgroundColor"
		@dragstart.prevent
		@keyup.enter="enterElementEditMode"
		@mouseleave="handleDragFinish"
		@mousemove="updateSpaceBetweenLines"
	>
		<EditorContent
			v-if="isTextEditMode"
			ref="textBoxEditorRef"
			:editor="editor"
			class="text-editor"
		/>
		<div
			v-else
			v-html="data.content"
		/>

		<!-- Space between lines editor -->
		<div v-if="isTextEditMode">
			<!-- 1. Area that prevents from selecting, while editing space between lines (user-select:none on textbox doesn't work) -->
			<div
				v-show="isEditingSpaceBetweenLines"
				class="space-between-lines-no-select-area"
				:style="noSelectAreaStyles"
				@mouseup="handleDragFinish"
			/>
			<!-- 2. A draggable area for each space between lines in textbox -->
			<div
				v-for="(verticalSpace, index) in spaceBetweenLinesAreas"
				:key="index"
				class="space-between-lines-area"
				:class="{
					'space-between-lines-area--disabled': verticalSpace.isHidden,
					'space-between-lines-area--active': isEditingSpaceBetweenLinesByIndex(index),
					'pointer-events-none': isEditingSpaceBetweenLines && !isEditingSpaceBetweenLinesByIndex(index)
				}"
				:style="{
					width: `${verticalSpace.width}px`,
					height: `${verticalSpace.height}px`,
					top: `${verticalSpace.offsetTop}px`,
				}"
				@mousedown="handleDragStart($event, verticalSpace.height, index)"
				@mouseup="handleDragFinish"
			>
				<div
					v-show="isEditingSpaceBetweenLinesByIndex(index)"
					class="space-between-lines-area__value z-body-small"
				>
					{{ currentlyEditedNodeMarginBottom }}
				</div>
			</div>
		</div>
	</GridTextBox>
</template>

<script>
import { EditorContent } from '@tiptap/vue-3';
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import GridTextBox from '@zyro-inc/site-modules/components/elements/text-box/GridTextBox.vue';
import { useGamification } from '@/use/useGamification';
import { useTextEditor } from '@/use/text-editor/useTextEditor';
import { useTracking } from '@/use/useTracking';
import { getBrowser } from '@zyro-inc/site-modules/utils/getBrowser';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';
import {
	GAMIFICATION_TASK_CHANGE_HEADING,
	GAMIFICATION_TASK_CHANGE_PARAGRAPH,
} from '@/constants';
import {
	defineComponent,
	ref,
} from 'vue';
import { PAGE_TYPE_BLOG } from '@zyro-inc/site-modules/constants';

export default defineComponent({
	components: {
		GridTextBox,
		EditorContent,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},

	setup() {
		const {
			editor,
			initializeEditor,
			removeEditor,
			setCaretPositionToEnd,
			getInlineStyleValue,
		} = useTextEditor();

		const {
			isHeadingElement,
			isParagraphElement,
			completeAchievement,
		} = useGamification();

		const { trackTextBoxCountChanges } = useTracking();

		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		const textBoxEditorRef = ref(null);
		const textBoxRef = ref(null);
		const spaceBetweenLinesAreas = ref([]);
		const initialText = ref('');

		const getSpaceBetweenLinesAreas = () => {
			const textEditorElement = textBoxEditorRef?.value?.$el?.firstChild;

			// Prevents code execution on not yet initialized .firstChild
			if (!textEditorElement) return;

			// Prevent bottom margin change for list elements
			const preventedNodeNames = [
				'ul',
				'ol',
			];

			spaceBetweenLinesAreas.value = [...textEditorElement.childNodes].slice(0, -1).map((node, index) => ({
				width: textEditorElement.offsetWidth,
				offsetTop: textBoxRef.value.$el.offsetTop + node.offsetTop + node.offsetHeight,
				height: Number.parseInt(window.getComputedStyle(node).marginBottom, 10),
				nodeRef: [...textEditorElement.childNodes][index],
				isHidden: preventedNodeNames.includes(node?.localName),
			}));
		};

		return {
			editor,
			initializeEditor,
			removeEditor,
			setCaretPositionToEnd,
			getInlineStyleValue,
			spaceBetweenLinesAreas,
			textBoxEditorRef,
			textBoxRef,
			getSpaceBetweenLinesAreas,
			updateElementHeightOnDevices,
			initialText,
			trackTextBoxCountChanges,
			isHeadingElement,
			isParagraphElement,
			completeAchievement,
		};
	},

	data() {
		return {
			dragInfo: {
				dragStartPositionY: null,
				dragStartMarginBottom: null,
				draggedAreaIndex: null,
			},
			gridItemWidth: null,
			gridItemHeight: null,
		};
	},

	computed: {
		...mapState([
			'currentElementId',
			'isElementEditMode',
			'currentPageId',
		]),
		...mapGetters(['currentPage']),
		isTextEditMode() {
			return this.id === this.currentElementId && this.isElementEditMode;
		},
		isEditingSpaceBetweenLines() {
			return !!this.dragInfo.dragStartPositionY;
		},
		currentlyEditedNodeMarginBottom() {
			return this.getInlineStyleValue('marginBottom') || `${this.dragInfo.dragStartMarginBottom}px`;
		},
		noSelectAreaStyles() {
			return {
				width: `${this.gridItemWidth}px`,
				height: `${this.gridItemHeight}px`,
			};
		},
		isWhiteSpaceNormal() {
			const { name } = getBrowser();

			// TipTap has bugs with 'white-space: normal;' in firefox - you can't enter spaces inside textbox as they get deleted
			// Leave default white-space setting for smooth editing experience, but justify alignment won't work in editor
			if (name === 'Firefox') {
				return false;
			}

			return this.data.settings.styles.text === 'justify';
		},
	},
	watch: {
		async isTextEditMode(value) {
			if (value) {
				this.initializeEditor(this.data.content);
				await this.$nextTick(); // Await tiptap editor element to be mounted

				this.initialText = this.editor.getText();
				this.setCaretPositionToEnd();
				this.editor.on('create', this.handleTextBoxContentChange);
				this.editor.on('update', this.handleTextBoxContentChange);
			} else {
				this.mergeElementData({
					elementId: this.id,
					elementData: {
						content: this.editor.getHTML(),
					},
				});

				const currentText = this.editor.getText();

				if (this.initialText !== currentText) {
					this.trackTextBoxCountChanges();

					if (this.isHeadingElement(this.data.content)) {
						this.completeAchievement(GAMIFICATION_TASK_CHANGE_HEADING);
					}

					if (this.isParagraphElement(this.data.content)) {
						this.completeAchievement(GAMIFICATION_TASK_CHANGE_PARAGRAPH);
					}
				}

				await this.updateElementHeightOnDevices({
					elementId: this.id,
				});

				if (this.editor.state.doc.textContent.length === 0) {
					this.removeElement({
						elementId: this.id,
					});
				}

				this.createSnapshot();

				this.editor.off('update', this.handleTextBoxContentChange);
				this.removeEditor();
				this.resetSpaceBetweenLinesAreas();

				if (this.currentPage.type === PAGE_TYPE_BLOG) {
					this.calculateReadTime({
						pageId: this.currentPageId,
					});
				}
			}
		},
		'data.settings.styles': {
			handler() {
				if (!this.isTextEditMode) {
					return;
				}

				this.handleTextBoxContentChange();
			},
		},
	},

	beforeUnmount() {
		this.editor?.off('update', this.handleTextBoxContentChange);
	},

	methods: {
		...mapActions([
			'removeElement',
			'enterElementEditMode',
			'mergeElementData',
		]),
		...mapActions('undoRedo', ['createSnapshot']),
		...mapActions('blog', ['calculateReadTime']),
		isEditingSpaceBetweenLinesByIndex(index) {
			return this.isEditingSpaceBetweenLines && this.dragInfo.draggedAreaIndex === index
			&& !this.spaceBetweenLinesAreas[index].isHidden;
		},
		resetSpaceBetweenLinesAreas() {
			this.dragInfo = {
				dragStartPositionY: null,
				dragStartMarginBottom: null,
				draggedAreaIndex: null,
			};
			this.spaceBetweenLinesAreas = [];
		},
		getGridItemWidthAndHeight() {
			// Grid item is this element parent, in UI inidentified with blue borders (resize handles).
			const gridItemRef = this.$refs.textBoxRef.$el.parentElement;

			this.gridItemWidth = gridItemRef.offsetWidth;
			this.gridItemHeight = gridItemRef.offsetHeight;
		},
		handleTextBoxContentChange() {
			this.getSpaceBetweenLinesAreas();
			this.getGridItemWidthAndHeight();
		},
		handleDragStart(event, initial, index) {
			this.dragInfo.dragStartPositionY = event.clientY;
			this.dragInfo.draggedAreaIndex = index;

			const textNodesEndPositions = [];

			this.editor.state.doc.content.content.forEach((node, nodeIndex) => {
				if (nodeIndex === 0) {
					textNodesEndPositions.push(node.nodeSize - 1);

					return;
				}

				textNodesEndPositions.push(textNodesEndPositions[nodeIndex - 1] + node.nodeSize);
			});

			this.editor.commands.setTextSelection(textNodesEndPositions[index]);

			this.dragInfo.dragStartMarginBottom = Number.parseInt(this.getInlineStyleValue('marginBottom'), 10) || initial;
		},
		handleDragFinish() {
			if (!this.isTextEditMode) {
				return;
			}

			this.dragInfo.dragStartPositionY = null;
			this.dragInfo.dragStartMarginBottom = null;
			this.dragInfo.draggedAreaIndex = null;
			this.editor.commands.focus();
		},
		updateSpaceBetweenLines(event) {
			if (!this.isTextEditMode) {
				return;
			}

			const MIN_SPACE_VALUE = 8;

			if (!this.dragInfo.dragStartPositionY) {
				return;
			}

			const dragValue = event.clientY - this.dragInfo.dragStartPositionY;
			const marginBottom = this.dragInfo.dragStartMarginBottom + dragValue;
			const marginBottomValid = marginBottom > MIN_SPACE_VALUE ? marginBottom : MIN_SPACE_VALUE;

			this.editor.chain()
				.updateAttributes('paragraph', {
					marginBottom: `${marginBottomValid}px`,
				})
				.updateAttributes('heading', {
					marginBottom: `${marginBottomValid}px`,
				})
				.run();
		},
	},
});
</script>

<style lang="scss" scoped>
.text-editor {
	position: relative;
}

.space-between-lines-no-select-area {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	cursor: row-resize;
	user-select: none;
	background: transparent;
}

.space-between-lines-area {
	position: absolute;
	left: 0;
	z-index: 2;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	padding: 8px;
	pointer-events: all;
	cursor: row-resize;
	background: transparent;

	&__value {
		min-width: 44px;
		padding: 2px;
		margin: 0;
		font-size: 12px;
		font-weight: 500;
		line-height: 1;
		color: $color-light;
		text-align: center;
		user-select: none;
		background-color: $color-azure;
		border-radius: 2px;
	}

	&:hover {
		background-color: rgba($color-azure, 0.2);
	}

	&--active {
		background-color: rgba($color-azure, 0.2);
	}

	&--disabled {
		pointer-events: none;

		&:hover {
			background-color: transparent;
		}
	}
}

.pointer-events-none {
	pointer-events: none;
}
</style>
