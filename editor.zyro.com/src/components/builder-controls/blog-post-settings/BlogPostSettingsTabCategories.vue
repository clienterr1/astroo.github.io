<template>
	<EditableItemsWithDropdown
		:editable-items="editableItems"
		:placeholder="$t('builder.blog.blogPostSettings.writeCategories')"
		:button-text="$t('builder.blog.blogPostSettings.addCategory')"
		:item-placeholder-text="$t('builder.blog.blogPostSettings.itemPlaceholder')"
		:title="$t('builder.blog.blogPostSettings.selectCategories')"
		:dropdown-items="categoriesNames"
		:validate-value="validator"
		:selected-items="selectedItems"
		data-qa="blog-post-settings-select-categories-btn"
		@edit="handleCategoryEdit"
		@update-items="updateItems"
		@add="addCategory"
		@select="selectCategory"
		@deselect="deselectCategory"
	/>
</template>

<script>
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import EditableItemsWithDropdown from '@/components/reusable-components/editable-items-list/-partials/EditableItemsWithDropdown.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		EditableItemsWithDropdown,
	},

	computed: {
		...mapState('gui', ['activeModalSettings']),
		...mapGetters('blog', [
			'postCategories',
			'postCategoriesNames',
			'categoriesNames',
			'categoryIdByName',
		]),
		selectedItems() {
			return this.postCategoriesNames(this.activeModalSettings.blogPostId);
		},
		editableItems() {
			return this.selectedItems.map((name) => ({
				name,
			}));
		},
	},

	methods: {
		...mapActions(['mergePageData']),
		...mapActions('blog', [
			'addPostCategory',
			'editCategory',
		]),
		validator(categoryName) {
			if (!categoryName) {
				return {
					isValid: false,
					error: this.$t('validate.emptyValue'),
				};
			}

			if (this.categoriesNames.includes(categoryName)) {
				return {
					isValid: false,
					error: this.$t('builder.blog.blogPostSettings.error'),
				};
			}

			return {
				isValid: true,
				error: '',
			};
		},
		updateItems(newCategoryNames) {
			this.mergePageData({
				pageId: this.activeModalSettings.blogPostId,
				pageData: {
					categories: newCategoryNames.map(({ name }) => this.categoryIdByName(name)),
				},
			});
		},
		addCategory(newItem) {
			this.addPostCategory({
				name: newItem,
				postId: this.activeModalSettings.blogPostId,
			});
		},
		handleCategoryEdit({
			oldItem,
			newItem,
		}) {
			this.editCategory({
				oldName: oldItem.name,
				newName: newItem.name,
			});
		},
		selectCategory(categoryName) {
			this.mergePageData({
				pageId: this.activeModalSettings.blogPostId,
				pageData: {
					categories: [
						...this.postCategories(this.activeModalSettings.blogPostId),
						this.categoryIdByName(categoryName),
					],
				},
			});
		},
		deselectCategory(categoryName) {
			const categoryToRemoveId = this.categoryIdByName(categoryName);

			this.mergePageData({
				pageId: this.activeModalSettings.blogPostId,
				pageData: {
					categories: [
						...this.postCategories(this.activeModalSettings.blogPostId)
							.filter((categoryId) => categoryId !== categoryToRemoveId),
					],
				},
			});
		},
	},
});
</script>
