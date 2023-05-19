<template>
	<p class="categories">
		<span
			v-for="(categoryId, index) in categories"
			:key="categoryId"
			class="categories__item"
			@click="$emit('filter-category', categories[index])"
		>
			{{ getCategoryNameById(categoryId) }}
		</span>
	</p>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		categories: {
			type: Array,
			default: () => ([]),
		},
		blogCategories: {
			type: Object,
			default: () => ({}),
		},
	},

	methods: {
		getCategoryNameById(categoryId) {
			return this.blogCategories[categoryId]?.name?.toUpperCase();
		},
	},
});
</script>

<style lang="scss" scoped>
.categories {
	margin-bottom: 16px;

	&__item {
		color: var(--blog-post-header-text-color);
		cursor: pointer;
		opacity: 0.8;

		&:not(:first-child)::before {
			margin: 0 16px;
			content: "· ";
		}
	}
}
</style>
