<template>
	<div>
		<EditableItemsList
			ref="slides"
			:items="currentSlideshowSlides"
			:placeholder="$t('builder.editSlideshow.manageSlides.editSlidePlaceholder')"
			:current-selected-item-index="currentSlideshowActiveSlideIndex"
			:item-placeholder-text="$t('builder.editSlideshow.manageSlides.itemPlaceholder')"
			:validate-value="manageSlidesValidator"
			class="manage-slides__manager"
			@edit="editSlide"
			@update-items="updateCurrentSlideshowSlides"
			@item-click="setCurrentActiveSlideById($event.blockId)"
		>
			<template
				v-if="!hasCurrentSlideshowReachedMaxCount"
				#header
			>
				<EditableItemsAddButton
					:validate-value="manageSlidesValidator"
					:button-text="$t('builder.editSlideshow.manageSlides.addSlide')"
					:placeholder="$t('builder.editSlideshow.manageSlides.editSlidePlaceholder')"
					:is-input-visible-on-add-click="false"
					@click="addSlide"
				/>
			</template>
			<template
				#item-button="{ item, startEditingItem }"
			>
				<ManageBlockSlidesPopup
					@duplicate="duplicateSlide(item)"
					@delete="toggleDeleteSlideModal(item)"
					@edit="startEditingItem"
					@change-background="openSlideBackgroundEdit(item.blockId)"
				/>
			</template>
		</EditableItemsList>

		<SystemDialogModal
			v-if="isDeleteSlideModalVisible"
			:title="$t('builder.editSlideshow.manageSlides.deleteSlideModal.title')"
			:secondary-button-text="$t('common.delete')"
			:primary-button-text="$t('common.keepIt')"
			@click-secondary="removeSlide(slideToDelete)"
			@click-primary="toggleDeleteSlideModal"
			@close="toggleDeleteSlideModal"
		>
			{{ $t('builder.editSlideshow.manageSlides.deleteSlideModal.subtitle') }}
		</SystemDialogModal>
	</div>
</template>

<script>
import ManageBlockSlidesPopup from '@/components/builder-controls/edit-block-slideshow/ManageBlockSlidesPopup.vue';
import { useEditBlockSlideshow } from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshow';
import { useManageBlockSlideshowSlides } from '@/components/builder-controls/edit-block-slideshow/use/useManageBlockSlideshowSlides';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import EditableItemsAddButton
	from '@/components/reusable-components/editable-items-list/-partials/EditableItemsAddButton.vue';
import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		SystemDialogModal,
		ManageBlockSlidesPopup,
		EditableItemsAddButton,
		EditableItemsList,
	},

	setup(props, context) {
		const {
			isDeleteSlideModalVisible,
			slideToDelete,
			currentSlideshowSlides,
			currentSlideshowSlideNames,
			currentSlideshowActiveSlideIndex,
			toggleDeleteSlideModal,
			setCurrentActiveSlideById,
			updateCurrentSlideshowSlides,
			addSlide,
			duplicateSlide,
			editSlide,
			removeSlide,
			manageSlidesValidator,
			hasCurrentSlideshowReachedMaxCount,
		} = useManageBlockSlideshowSlides(props, context);
		const { openSlideBackgroundEdit } = useEditBlockSlideshow(props, context);

		return {
			isDeleteSlideModalVisible,
			slideToDelete,
			currentSlideshowSlides,
			currentSlideshowSlideNames,
			currentSlideshowActiveSlideIndex,
			toggleDeleteSlideModal,
			setCurrentActiveSlideById,
			openSlideBackgroundEdit,
			hasCurrentSlideshowReachedMaxCount,
			updateCurrentSlideshowSlides,
			addSlide,
			duplicateSlide,
			editSlide,
			removeSlide,
			manageSlidesValidator,
		};
	},
});
</script>

<style lang="scss" scoped>
.manage-slides {
	&__manager {
		display: flex;
		flex-direction: column-reverse;
	}
}
</style>
