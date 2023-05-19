<template>
	<AddContentModal
		:template="template"
		:categories="categories"
		:site-elements="templateElements"
		:current-category-id="currentCategoryId"
		:selected-category-content="selectedCategoryBlocks"
		:content-descriptions="blockDescriptions"
		:computed-styles="computedStyles"
		:title="$t('builder.addNewSectionModal.title')"
		:subtitle="$t('builder.addNewSectionModal.subtitle')"
		:add-blank-content-button-title="$t('builder.addNewSectionModal.addBlankSection')"
		@update:current-category-id="(categoryId) => currentCategoryId = categoryId"
		@add-content="addBlock"
		@add-blank-content="addBlankBlock"
	/>
	<!-- Confirm modals (blog, global footer) -->
	<Teleport
		v-if="showBlogListChoice || showFooterGlobalChoice"
		to="body"
	>
		<SystemDialogModal
			v-if="showFooterGlobalChoice"
			:primary-button-text="$t('builder.footer.modal.addToSingle')"
			:secondary-button-text="$t('builder.footer.modal.addToAll')"
			:title="$t('builder.editBlockButton.addFooter')"
			primary-button-theme="plain"
			primary-button-margin="0 16px 0 auto"
			@close="showFooterGlobalChoice = false"
			@click-primary="addFooterBlock({ addToPage: false } )"
			@click-secondary="addFooterBlock({
				addToPage:false,
				slot:'footer'
			})"
		>
			{{ $t('builder.footer.modal.description') }}
		</SystemDialogModal>
		<ChooseBlockPlacementModal
			v-if="showBlogListChoice"
			:primary-button-text="$t('builder.blog.chooseBlogListModal.buttonAddPage')"
			:secondary-button-text="$t('builder.blog.chooseBlogListModal.buttonAddHere')"
			:title="$t('builder.blog.chooseBlogListModal.title')"
			:subtitle="$t('builder.blog.chooseBlogListModal.subtitle')"
			@close="showBlogListChoice = false"
			@add-primary="addBlogPage"
			@add-secondary="addBlogList"
		>
			<template #header-image>
				<img src="@/assets/images/blog-sample.png">
			</template>
		</ChooseBlockPlacementModal>
	</Teleport>
</template>

<script setup>

import AddContentModal from '@/components/builder-modals/modals/add-content-modal/AddContentModal.vue';

import ChooseBlockPlacementModal from '@/components/builder-modals/modals/ChooseBlockPlacementModal.vue';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import { useAddBlockModal } from '@/use/useAddBlockModal';
import { useAddPage } from '@/use/useAddPage';

const {
	template,
	categories,
	templateElements,
	selectedBlockId,
	currentCategoryId,
	addNewBlock,
	selectedCategoryBlocks,
	showBlogListChoice,
	showFooterGlobalChoice,
	addBlogList,
	computedStyles,
	blockDescriptions,
} = useAddBlockModal();

const { addBlogPage } = useAddPage();

const addFooterBlock = ({
	addToPage,
	slot,
}) => {
	addNewBlock({
		blockId: selectedBlockId.value,
		blockData: selectedCategoryBlocks.value[selectedBlockId.value],
		addToPage,
		slot,
	});
};

const addBlock = ({
	contentId: blockId,
	content: block,
}) => {
	addNewBlock({
		blockId,
		blockData: block,
	});

	selectedBlockId.value = blockId;
};

const addBlankBlock = () => {
	addNewBlock({});
};
</script>
