<template>
	<div>
		<div class="categories-tab__button">
			<ZyroButton
				theme="outline"
				@click="handleManagePostsClick"
			>
				{{ $t('builder.blog.blockBlogList.managePosts') }}
			</ZyroButton>
		</div>
		<ZyroFieldToggle
			id="posts-from-selected"
			:label="$t('builder.blog.blockBlogList.categories.toggleText')"
			:model-value="!showAllPosts"
			@update:model-value="updateShowAllPosts"
		/>
		<ZyroLabel
			class="categories-tab__label z-body-small"
			:bold="false"
		>
			{{ $t('builder.blog.blockBlogList.categories.explanation') }}
		</ZyroLabel>

		<div>
			<ZyroSeparator />
			<EditableItemsWithDropdown
				v-if="!showAllPosts"
				:is-editable-by-double-click="false"
				:editable-items="editableItems"
				:dropdown-items="items"
				:selected-items="selectedItems"
				:validate-value="validator"
				:placeholder="$t('builder.blog.blogPostSettings.writeCategories')"
				:button-text="$t('builder.blog.blogPostSettings.addCategory')"
				:title="$t('builder.blog.blogPostSettings.selectCategories')"
				:item-placeholder-text="$t('builder.blog.blogPostSettings.itemPlaceholder')"
				@add="addItem"
				@update-items="updateFromEditableItems"
				@select="selectCategory"
				@deselect="deselectCategory"
			/>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import EditableItemsWithDropdown from '@/components/reusable-components/editable-items-list/-partials/EditableItemsWithDropdown.vue';
import { DRAWER_BLOG } from '@/constants';
import {
	mapActionsGui,
	OPEN_DRAWER,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroFieldToggle,
		ZyroLabel,
		ZyroSeparator,
		EditableItemsWithDropdown,
	},
	emits: ['close'],

	data() {
		return {
			blockId: null,
			initialCurrentBlockData: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockSettings',
		]),
		...mapGetters('blog', [
			'categoriesNames',
			'blogListCategoriesNames',
			'categoryIdByName',
		]),
		showAllPosts() {
			return this.currentBlockSettings.showAllPosts;
		},
		withoutCategoriesText() {
			return this.$t('builder.blog.blockBlogList.withoutCategories');
		},
		items() {
			return [
				this.withoutCategoriesText,
				...this.categoriesNames,
			];
		},
		editableItems() {
			return this.selectedItems.map((name) => ({
				name,
			}));
		},
		blogListCategories() {
			return this.blogListCategoriesNames(this.currentBlockId);
		},
		selectedItems() {
			const selectedItems = this.blogListCategories;
			const hasCategoriesWithoutText = selectedItems.includes(this.withoutCategoriesText);

			if (this.currentBlockSettings.showWithoutCategories && !hasCategoriesWithoutText) {
				selectedItems.unshift(this.withoutCategoriesText);
			}

			return selectedItems;
		},
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),

		...mapActions('blog', ['addBlogListCategory']),
		...mapActionsGui({
			openDrawer: OPEN_DRAWER,
		}),
		updateShowAllPosts() {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						showAllPosts: !this.showAllPosts,
					},
				},
				merge: true,
			});
		},
		validator(categoryName) {
			if (!categoryName) {
				return {
					isValid: false,
					error: this.$t('validate.emptyValue'),
				};
			}

			const isDuplicateValue = this.categoriesNames.includes(categoryName)
			|| categoryName === this.withoutCategoriesText;

			if (isDuplicateValue) {
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
		updateFromEditableItems(newItems) {
			const mappedItems = newItems.map(({ name }) => name);

			this.updateItems(mappedItems);
		},
		updateItems(categoryNames) {
			const newCategories = [...categoryNames];
			const indexOfWithoutCategoriesOption = newCategories.indexOf(this.withoutCategoriesText);
			const showWithoutCategories = indexOfWithoutCategoriesOption > -1;

			if (showWithoutCategories) {
				newCategories.splice(indexOfWithoutCategoriesOption, 1);
			}

			const categories = newCategories.map((categoryId) => this.categoryIdByName(categoryId));

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						showWithoutCategories,
						categories,
					},
				},
				merge: true,
			});
		},
		handleManagePostsClick() {
			this.openDrawer({
				id: DRAWER_BLOG,
			});
			this.$emit('close');
		},
		addItem(newItem) {
			this.addBlogListCategory({
				blockId: this.blockId,
				name: newItem,
			});
		},
		selectCategory(categoryName) {
			this.updateItems([
				categoryName,
				...this.blogListCategories,
			]);
		},
		deselectCategory(categoryName) {
			this.updateItems([...this.blogListCategories.filter((name) => name !== categoryName)]);
		},
	},
});
</script>

<style lang="scss" scoped>
.categories-tab {
	&__button {
		display: flex;
		justify-content: center;
		margin-top: 16px;
	}

	&__label {
		margin-bottom: 24px;
		color: $color-gray;
	}
}
</style>
