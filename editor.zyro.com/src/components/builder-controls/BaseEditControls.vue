<template>
	<div>
		<Popup
			:target-ref="currentElementRef"
			portal-selector="[data-portal='builder-preview']"
			placement="top-start"
			auto-update
			:flip="false"
			:offset="22"
		>
			<div
				v-if="!isElementEditMode && !croppedImageId"
				class="edit-actions-top"
			>
				<ZyroButton
					v-if="buttonTitle"
					class="edit-actions-top__button"
					theme="editor"
					data-qa="element-button-edit"
					@click="enterElementEditMode"
				>
					{{ buttonTitle }}
				</ZyroButton>
				<!-- When using with buttons dont forget to set the elements block as current -->
				<slot name="additional-buttons" />
				<AiTextGeneratorFormControls
					v-if="isLayoutOnly && isAiTextGeneratorVisible"
					:element-id="currentElementId"
					class="edit-actions-top__button"
				/>
				<ZyroButton
					v-if="isMobileView && !isLayoutOnly"
					ref="gridMobileAlignControlsTriggerRef"
					title="align-items"
					theme="editor"
					class="edit-actions-top__align-button"
					@click="showGridMobileAlignControls = !showGridMobileAlignControls"
				>
					<template #icon>
						<ZyroSvgDeprecated
							:name="selectedAlignSelfValue.icon"
							:direction="selectedAlignSelfValue.direction"
						/>
					</template>
				</ZyroButton>
				<Popup
					v-if="showGridMobileAlignControls"
					:target-ref="$refs.gridMobileAlignControlsTriggerRef && $refs.gridMobileAlignControlsTriggerRef.$el"
					portal-selector="[data-portal='builder-preview']"
					class="edit-actions-top__align"
					:offset="4"
					placement="bottom"
					@click-outside="showGridMobileAlignControls = false"
				>
					<ZyroIconControls
						:model-value="currentElementStyles['m-align-self']"
						class="edit-actions-top__align-controls"
						:icons="$options.valuesAlignSelf"
						@update:model-value="updateAlignSelf"
					/>
				</Popup>
				<ControlsTooltip
					v-if="showCrop"
					:title="$t('common.crop')"
				>
					<ZyroButton
						class="edit-actions-top__button edit-actions-top__crop-button"
						theme="editor"
						data-qa="builder-elementedit-buttoncrop"
						:title="$t('common.crop')"
						@click="enterCropMode(currentElementId)"
					>
						<template #icon>
							<Icon
								name="crop"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
				<ControlsTooltip
					v-if="isEditingGridShape"
					:title="$t('builder.helpResources.changeColors')"
				>
					<ColorPicker
						:is-open="isShapeColorPickerOpen"
						:model-value="currentElement.color"
						class="edit-actions-top__button"
						@toggle="isShapeColorPickerOpen = !isShapeColorPickerOpen"
						@update:model-value="updateShapeColor"
						@click-outside="isShapeColorPickerOpen = false"
					>
						<ZyroButton theme="editor">
							<template #icon>
								<ColorPickerButton :color="currentElement.color" />
							</template>
						</ZyroButton>
					</ColorPicker>
				</ControlsTooltip>
				<ControlsTooltip
					v-if="showDuplicate"
					:title="$t('common.duplicate')"
				>
					<ZyroButton
						class="edit-actions-top__button"
						theme="editor"
						data-qa="builder-textelementedit-buttonduplicate"
						:title="$t('common.duplicate')"
						@click="duplicateCurrentElement"
					>
						<template #icon>
							<Icon
								name="content_copy"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
					<template #shortcut>
						<span>
							{{ isMac ? '⌘D' : 'Ctrl+D' }}
						</span>
					</template>
				</ControlsTooltip>
				<ControlsTooltip
					v-if="isLayoutOnly"
					:title="$t('builder.editBlockButton.hideShow')"
				>
					<VisibilityControls
						class="edit-actions-top__button"
						:is-hidden-desktop="isHiddenDesktop"
						:is-hidden-mobile="isHiddenMobile"
						@set-desktop-visibility="setDesktopElementHidden"
						@set-mobile-visibility="setMobileElementHidden"
					/>
				</ControlsTooltip>
				<ControlsTooltip
					v-if="showDelete"
					:title="$t('common.delete')"
				>
					<ZyroButton
						class="edit-actions-top__button"
						theme="editor"
						data-qa="builder-textelementedit-buttondelete"
						:title="$t('common.delete')"
						@click="handleElementRemove"
					>
						<template #icon>
							<Icon
								name="delete"
								dimensions="18px"
							/>
						</template>
					</ZyroButton>
					<template #shortcut>
						<span>
							{{ '⌫' }}
						</span>
					</template>
				</ControlsTooltip>
				<ControlsTooltip
					v-if="isLayoutOnly"
					:title="$t('common.more')"
				>
					<ZyroButton
						ref="contextMenuButtonRef"
						class="edit-actions__button"
						data-qa="builder-elementedit-buttoncontext"
						theme="editor"
						:title="$t('builder.contextMenuTitle')"
						@click="setContextMenuVisibility({ isOpen: !isContextMenuWithTriggerActive })"
					>
						<template #icon>
							<Icon
								name="more_horiz"
								dimensions="18px"
							/>
						</template>
					</ZyroButton>
				</ControlsTooltip>
			</div>
			<div
				v-if="croppedImageId"
				class="edit-actions-top"
			>
				<div class="range-slider">
					<ZyroRange
						:model-value="cropScale"
						:is-value-shown="false"
						min="1"
						units="%"
						step="0.01"
						max="2.5"
						@update:model-value="updateCropScale"
					/>
				</div>
				<ZyroButton
					class="edit-actions-top__button"
					theme="editor"
					data-qa="builder-elementedit-buttoncropdone"
					:title="$t('common.crop')"
					@click="exitCropMode"
				>
					{{ $t('common.done') }}
				</ZyroButton>
			</div>
		</Popup>
		<Popup
			v-if="isElementEditMode"
			:target-ref="currentElementRef"
			portal-selector="[data-portal='builder-preview']"
			:placement="editControlsPopupOptions.placement"
			:offset="editControlsPopupOptions.offset"
			:auto-update="editControlsPopupOptions.autoUpdate"
			:flip="editControlsPopupOptions.flip"
			@click-outside="disableEditModeOnClickOutside"
		>
			<slot />
		</Popup>
		<ContextMenuLayoutElement
			v-if="isContextMenuWithTriggerActive"
			:trigger-ref="contextMenuButtonRef && contextMenuButtonRef.$el"
			@close-context-menu="setContextMenuVisibility({ isOpen: false })"
		/>

		<Popup
			:target-ref="currentElementRef"
			portal-selector="[data-portal='builder-preview']"
			placement="bottom-start"
			auto-update
			:flip="false"
			:offset="6"
		>
			<AiTextGeneratorTextControls
				:element-id="currentElementId"
			/>
		</Popup>
	</div>
</template>

<script>
import {
	defineComponent,
	watch,
	computed,
	ref,
} from 'vue';
import {
	useStore,
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import ContextMenuLayoutElement from '@/components/context-menu/ContextMenuLayoutElement.vue';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ColorPicker from '@/components/global/ColorPicker.vue';
import ColorPickerButton from '@/components/global/ColorPickerButton.vue';
import ControlsTooltip from '@/components/ControlsTooltip.vue';
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';
import ZyroRange from '@/components/global/ZyroRange.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import Popup from '@/components/global/Popup.vue';
import VisibilityControls from '@/components/builder-controls/VisibilityControls.vue';
import AiTextGeneratorFormControls from '@/components/builder-controls/AiTextGeneratorFormControls.vue';
import AiTextGeneratorTextControls from '@/components/builder-controls/AiTextGeneratorTextControls.vue';
import { useBlockLayout } from '@zyro-inc/site-modules/components/blocks/layout/useBlockLayout';
import { useAiTextGeneration } from '@/use/useAiTextGeneration';

import { useCropImage } from '@/components/layout-element/useCropImage';

import {
	getCode,
	CODE,
} from '@zyro-inc/site-modules/utils/getCode';

import { getExtension } from '@zyro-inc/site-modules/utils/modifyString';
import { useEditGridGallery } from '@/components/builder-controls/edit-gallery/useEditGridGallery';
import { useGridContextMenu } from '@/components/context-menu/useGridContextMenu';
import {
	moveRight,
	moveLeft,
} from '@/utils/array';
import { useShape } from '@/use/useShape';
import { getIsUserUsingMac } from '@/utils/getIsUserUsingMac';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';
import { useCurrentElementRef } from '@/use/useCurrentElementRef';
import { useTextEditor } from '@/use/text-editor/useTextEditor';
import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS } from '@/constants';
import { useGamification } from '@/use/useGamification';

const valuesAlignSelf = [
	{
		value: 'flex-start',
		icon: 'align',
		direction: 'left',
	},
	{
		value: 'center',
		icon: 'align-middle-h',
	},
	{
		value: 'flex-end',
		icon: 'align',
		direction: 'right',
	},
];

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ColorPicker,
		ColorPickerButton,
		ZyroIconControls,
		ZyroRange,
		ZyroSvgDeprecated,
		Popup,
		ControlsTooltip,
		VisibilityControls,
		ContextMenuLayoutElement,
		AiTextGeneratorFormControls,
		AiTextGeneratorTextControls,
	},
	valuesAlignSelf,
	props: {
		buttonTitle: {
			type: String,
			default: '',
		},
		showDuplicate: {
			type: Boolean,
			default: true,
		},
		showDelete: {
			type: Boolean,
			default: true,
		},
		currentTab: {
			type: Object,
			default: () => ({}),
		},
	},

	setup() {
		const {
			getters,
			state,
			dispatch,
		} = useStore();

		const { completeAchievement } = useGamification();
		const { editor } = useTextEditor();
		const { showGalleryManager } = useEditGridGallery();
		const {
			copiedElementId,
			isElementCut,
		} = getters['flags/isLayoutOnly'] ? useLayoutContextMenu() : useGridContextMenu();
		const {
			croppedImageId,
			exitCropMode,
			cropScale,
			enterCropMode,
		} = useCropImage();
		const { updateShapeColor } = useShape();
		const { currentElementRef } = useCurrentElementRef();
		const { selectedLayoutElementId } = useLayoutContextMenu();
		const {
			mousePositionX,
			mousePositionY,
			isContextMenuWithTriggerActive,
		} = useContextMenu();

		const contextMenuButtonRef = ref(null);

		const currentElementId = computed(() => state.currentElementId);
		const currentElementType = computed(() => getters.currentElementType);
		const currentElementBlock = computed(() => getters.currentElementBlock);
		const siteElements = computed(() => getters.siteElements);

		const isAiTextGeneratorVisible = computed(() => currentElementType.value === 'GridTextBox');

		const { isAiTextGeneratorPopupVisible } = useAiTextGeneration({
			elementId: currentElementId.value,
		});

		const { layoutElements } = useBlockLayout({
			blockData: currentElementBlock,
			siteElements,
			shouldBuildResponsive: false,
		});

		const setContextMenuVisibility = ({ isOpen }) => {
			selectedLayoutElementId.value = isOpen ? currentElementId.value : null;
			isContextMenuWithTriggerActive.value = isOpen;
			mousePositionX.value = null;
			mousePositionY.value = null;
		};

		watch(() => currentElementId.value, (newBlockId, oldBlockId) => {
			if (isContextMenuWithTriggerActive.value && newBlockId !== oldBlockId) {
				selectedLayoutElementId.value = newBlockId;
			}
		});

		const handleElementRemove = () => {
			if (siteElements.value[currentElementId.value].type === 'GridSocialIcons') {
				completeAchievement(GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS);
			}

			dispatch('removeCurrentElement');
		};

		return {
			showGalleryManager,
			copiedElementId,
			croppedImageId,
			cropScale,
			exitCropMode,
			enterCropMode,
			updateShapeColor,
			currentElementRef,
			editor,
			currentElementId,
			selectedLayoutElementId,
			contextMenuButtonRef,
			setContextMenuVisibility,
			layoutElements,
			isElementCut,
			isMac: getIsUserUsingMac(),
			isContextMenuWithTriggerActive,
			handleElementRemove,
			isAiTextGeneratorVisible,
			isAiTextGeneratorPopupVisible,
		};
	},

	data() {
		return {
			showGridMobileAlignControls: false,
			isShapeColorPickerOpen: false,
		};
	},

	computed: {
		...mapState(['isElementEditMode']),
		...mapState('gui', [
			'isMobileView',
			'isMobileScreen',
		]),
		...mapGetters([
			'currentElement',
			'currentElementStyles',
			'currentElementType',
			'siteBlocks',
		]),
		...mapGetters('gui', [
			'isMobileMode',
			'isColorPickerOpen',
		]),
		...mapGetters('flags', ['isLayoutOnly']),
		blockZindexes: {
			get() {
				return this.siteBlocks[this.currentElementBlockId].zindexes;
			},
			set(zindexes) {
				this.updateBlockData({
					blockId: this.currentElementBlockId,
					blockData: {
						zindexes,
					},
					pushToHistory: true,
					merge: true,
				});
			},
		},
		selectedAlignSelfValue() {
			return valuesAlignSelf.find((item) => item.value === this.alignSelf) || {
				icon: 'align',
				direction: 'left',
			};
		},
		showCrop() {
			return (
				this.currentElementType === 'GridImage'
				&& this.isLayoutOnly
				&& !this.isMobileMode
				&& this.currentElement.settings.origin === 'assets'
				&& ![
					'svg',
					'ico',
					'gif',
				].includes(getExtension(this.currentElement.settings.path))
			);
		},
		isEditingGridShape() {
			return this.currentElementType === 'GridShape';
		},
		editControlsPopupOptions() {
			if (this.currentElementType === 'GridTextBox') {
				return {
					placement: 'top-start',
					offset: 6,
					flip: false,
					autoUpdate: true,
				};
			}

			return {
				placement: 'right-start',
				offset: 18,
			};
		},
		isHiddenDesktop() {
			return this.currentElement.desktop?.isHidden || false;
		},
		isHiddenMobile() {
			return this.currentElement.mobile?.isHidden || false;
		},
	},
	created() {
		window.addEventListener('keydown', this.onKeyDownPressed);
	},

	beforeUnmount() {
		window.removeEventListener('keydown', this.onKeyDownPressed);
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			document.selection.empty();
		}
	},

	methods: {
		...mapActions([
			'duplicateCurrentElement',
			'removeCurrentElement',
			'enterElementEditMode',
			'leaveElementEditMode',
			'updateBlockData',
			'mergeCurrentElementData',
			'mergeElementData',
		]),
		disableEditModeOnClickOutside() {
			if (!this.isColorPickerOpen && !this.editor) {
				this.leaveElementEditMode();
			}
		},
		updateAlignSelf(newValue) {
			if (newValue) {
				this.mergeCurrentElementData({
					elementData: {
						settings: {
							styles: {
								'm-align-self': newValue,
							},
						},
					},
				});
			}
		},
		updateCropScale(scale) {
			// TODO: Pass temp scale to composable instead of updating it all the time
			//  and only update on exit or when slider is released
			this.mergeElementData({
				elementId: this.croppedImageId,
				elementData: {
					desktop: {
						crop: {
							scale,
						},
					},
				},
				pushToHistory: false,
			});
		},
		setDesktopElementHidden(value) {
			this.mergeCurrentElementData({
				elementData: {
					desktop: {
						isHidden: value,
					},
				},
			});
		},
		setMobileElementHidden(value) {
			this.mergeCurrentElementData({
				elementData: {
					mobile: {
						isHidden: value,
					},
				},
			});
		},
		onKeyDownPressed(event) {
			if (getCode(event) === CODE.Escape && (this.isElementEditMode || this.croppedImageId)) {
				event.preventDefault();
				this.leaveElementEditMode();
				this.exitCropMode();
			}

			if (this.isElementEditMode || this.showGalleryManager) {
				return;
			}

			if (
				(getCode(event) === CODE.Backspace || getCode(event) === CODE.Delete)
				&& !this.isColorPickerOpen
				&& !this.isAiTextGeneratorPopupVisible
			) {
				event.preventDefault();
				this.handleElementRemove();
			}

			// ctrl + d or cmd + d
			if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.KeyD) {
				event.preventDefault();
				this.duplicateCurrentElement();
			}

			// cmd + backspace or ctrl + backspace
			if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.Backspace) {
				event.preventDefault();
				this.handleElementRemove();
			}

			// cmd + c or ctrl + c
			if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.KeyC) {
				event.preventDefault();
				this.copiedElementId = this.currentElementId;
				this.isElementCut = false;
			}

			// cmd + x or ctrl + x
			if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.KeyX) {
				event.preventDefault();
				this.copiedElementId = this.currentElementId;
				this.isElementCut = true;
			}

			// Push/send to back
			if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.BracketLeft) {
				event.preventDefault();
				this.blockZindexes = moveLeft(
					this.blockZindexes,
					this.currentElementId,
					this.isMac ? event.altKey : event.shiftKey,
				);
			}

			// Push/send to front
			if ((event.ctrlKey || event.metaKey) && getCode(event) === CODE.BracketRight) {
				event.preventDefault();
				this.blockZindexes = moveRight(
					this.blockZindexes,
					this.currentElementId,
					this.isMac ? event.altKey : event.shiftKey,
				);
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.edit-actions-top {
	display: flex;

	&__align-controls {
		margin: 0;
		background-color: $color-light;
	}

	&__align-button {
		margin-right: 8px;
	}

	&__button:not(:last-child) {
		margin-right: 8px;
	}
}

.range-slider {
	padding: 6px 16px;
	margin-right: 8px;
	background-color: $color-light;
	border-radius: 18px;
	box-shadow: $box-shadow;
}
</style>
