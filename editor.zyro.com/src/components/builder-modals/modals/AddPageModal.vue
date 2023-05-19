<template>
	<AddContentModal
		:template="template"
		:categories="categories"
		:site-elements="templateElements"
		:current-category-id="currentCategoryId"
		:selected-category-content="selectedCategoryPages"
		:content-descriptions="pageDescriptions"
		:computed-styles="computedStyles"
		:title="$t('builder.addNewPageModal.title')"
		:subtitle="$t('builder.addNewPageModal.subtitle')"
		:add-blank-content-button-title="$t('builder.addNewPageModal.addEmptyPage')"
		@update:current-category-id="(categoryId) => currentCategoryId = categoryId"
		@add-content="addNewPage({ pageId: $event.contentId })"
		@add-blank-content="addNewPage({ isPageEmpty: true })"
	/>
</template>

<script setup>
import AddContentModal from '@/components/builder-modals/modals/add-content-modal/AddContentModal.vue';

import { useAddPageModal } from '@/use/useAddPageModal';

const {
	template,
	categories,
	templateElements,
	currentCategoryId,
	selectedCategoryPages,
	addNewPage,
	pageDescriptions,
	computedStyles,
} = useAddPageModal();

</script>
