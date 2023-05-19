<template>
	<EditableItemsList
		ref="items"
		:items="editableItems"
		:placeholder="$t('builder.blog.blogPostSettings.writeCategories')"
		:item-placeholder-text="$t('builder.blog.blogPostSettings.itemPlaceholder')"
		:validate-value="validator"
		@edit="editItem"
		@update-items="updateItems"
	>
		<template #header>
			<EditableItemsAddButton
				:button-text="$t('builder.blog.blogPostSettings.addCategory')"
				:placeholder="$t('builder.blog.blogPostSettings.writeCategories')"
				:validate-value="validator"
				@add="addItem"
			/>
		</template>
		<template #item-button="{ item, startEditingItem }">
			<BlogCategoryPopup
				@duplicate="duplicateItem(item.name)"
				@delete="removeCategory(item.name)"
				@edit="startEditingItem"
			/>
		</template>
	</EditableItemsList>
</template>

<script>
import {
	mapActions,
	mapGetters,
} from 'vuex';

import BlogCategoryPopup from '@/components/builder-controls/blog-drawer/BlogCategoryPopup.vue';

import EditableItemsAddButton from '@/components/reusable-components/editable-items-list/-partials/EditableItemsAddButton.vue';
import EditableItemsList from '@/components/reusable-components/editable-items-list/EditableItemsList.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		EditableItemsList,
		EditableItemsAddButton,
		BlogCategoryPopup,
	},

	computed: {
		...mapGetters('blog', [
			'categoriesNames',
			'categoryIdByName',
		]),
		editableItems() {
			return this.categoriesNames.map((name) => ({
				name,
			}));
		},
	},

	methods: {
		...mapActions('blog', [
			'editCategory',
			'addCategory',
			'duplicateCategory',
			'removeCategory',
			'setCategories',
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
			const newCategories = newCategoryNames.reduce(
				(newCategoriesArray, { name }) => ({
					...newCategoriesArray,
					[this.categoryIdByName(name)]: {
						name,
					},
				}),
				{},
			);

			this.setCategories({
				categories: newCategories,
			});
		},
		editItem({
			oldValue,
			newValue,
		}) {
			this.editCategory({
				oldValue: oldValue.name,
				newValue: newValue.name,
			});
		},
		addItem(newValue) {
			this.addCategory({
				name: newValue,
			});
		},
		duplicateItem(newValue) {
			this.duplicateCategory({
				name: newValue,
			});
		},
	},
});
</script>
