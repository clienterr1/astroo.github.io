<template>
	<div
		:id="blockId"
		ref="blogList"
		v-qa="'builder-section-blog'"
		class="block-blog-list"
	>
		<div
			v-if="filteredCategoryId"
			class="block-blog-list__filter"
		>
			{{ blogCategories[filteredCategoryId].name }}
			<button
				class="block-blog-list__filter-button"
				@click="filteredCategoryId = null"
			>
				{{ SHOW_ALL_POSTS_LABEL }}
			</button>
		</div>
		<div
			v-if="currentPageItems.length"
			class="block-blog-list__list"
			:class="{ 'block-blog-list__list--one-col': postColumnCount === 1 }"
		>
			<BlockBlogListItem
				v-for="(post, index) in currentPageItems"
				:key="`post-${index}`"
				v-qa="'blog-list-item'"
				:post="post"
				:author-name="post.meta.authorName"
				:cover-object-fit="data.settings.styles['cover-object-fit']"
				:shown-items="data.settings.shownItems"
				:blog-categories="blogCategories"
				:is-animation-active="isAnimationActive"
				@filter-category="(filteredCategoryId = $event), scrollToTop()"
				@post-click="$emit('post-click', post)"
			>
				<template #block-blog-list-item-overlay>
					<slot
						name="block-blog-list-overlay"
						:post="post"
					/>
				</template>
			</BlockBlogListItem>
		</div>
		<div
			v-else
			class="block-blog-list__empty-block"
		>
			<slot name="block-blog-list-empty-block" />
		</div>
		<ZyroPagination
			class="block-blog-list__pagination"
			:current-page="currentPage"
			:page-count="pageCount"
			@change-page="setCurrentPage($event)"
		/>
	</div>
</template>

<script>
import ZyroPagination from '@zyro-inc/site-modules/components/ZyroPagination.vue';
import BlockBlogListItem from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListItem.vue';
import {
	defineComponent,
	ref,
	onMounted,
	onBeforeUnmount,
} from 'vue';

// TODO: this should not be used as it's gets included in every implementation

// TODO: should be editable via UI:
const SHOW_ALL_POSTS_LABEL = 'Show all posts';

export default defineComponent({
	name: 'BlockBlogList',

	components: {
		BlockBlogListItem,
		ZyroPagination,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		lcp: {
			type: Object,
			default: () => ({}),
		},
		posts: {
			type: Object,
			default: () => ({}),
		},
		blogCategories: {
			type: Object,
			default: () => ({}),
		},
	},

	emits: ['post-click'],

	setup() {
		const currentPage = ref(1);
		const isAnimationActive = ref(false);

		const handleBrowserNavigationPageChange = () => {
			const params = new URLSearchParams(window.location.search);
			const pageFromParams = Number.parseInt(params.get('page'), 10) || 1;

			if (pageFromParams === currentPage.value) {
				return;
			}

			currentPage.value = pageFromParams;
		};

		onMounted(() => {
			const params = new URLSearchParams(window.location.search);

			currentPage.value = Number.parseInt(params.get('page'), 10) || 1;

			window.addEventListener('popstate', () => {
				handleBrowserNavigationPageChange();
			});
		});

		onBeforeUnmount(() => {
			window.removeEventListener('popstate', handleBrowserNavigationPageChange);
		});

		return {
			currentPage,
			isAnimationActive,
			SHOW_ALL_POSTS_LABEL,
		};
	},

	data() {
		return {
			filteredCategoryId: null,
		};
	},

	computed: {
		postColumnCount() {
			return Number.parseInt(this.data.settings.styles['post-column-count'], 10);
		},
		// Create a posts object from original one, but exclude posts that don't have shown categories.
		// or, if filtered category is set, show only filtered posts.
		// If the main categories array is empty, show all posts.
		postsToRender() {
			const {
				categories,
				showAllPosts,
				showWithoutCategories,
			} = this.data.settings;

			const posts = showAllPosts ? this.posts : Object.fromEntries(
				Object.entries(this.posts)
					.filter(([, page]) => {
						const isPostIncludedInList = categories.some(
							(listCategory) => page.categories.includes(listCategory),
						);
						const showUncategorized = showWithoutCategories && page.categories.length === 0;

						return showUncategorized || isPostIncludedInList;
					}),
			);

			if (this.filteredCategoryId) {
				return Object.fromEntries(Object.entries(posts)
					.filter(([, post]) => post.categories.includes(this.filteredCategoryId)));
			}

			return posts;
		},
		sortedPosts() {
			return Object.values(this.postsToRender).sort(
				(a, b) => Date.parse(b.date) - Date.parse(a.date),
			);
		},
		currentPageItems() {
			return this.sortedPosts.slice(
				(this.currentPage - 1) * this.data.settings.postsPerPage,
				this.currentPage * this.data.settings.postsPerPage,
			);
		},
		pageCount() {
			return Math.ceil(Object.keys(this.postsToRender).length / this.data.settings.postsPerPage);
		},
	},

	watch: {
		// If current page is not the first page and there are no items to show, go back one page
		currentPageItems(value) {
			if (value.length === 0 && this.currentPage > 1) {
				this.currentPage -= 1;
			}
		},
	},

	methods: {
		setCurrentPage(event) {
			this.currentPage = event;
			this.isAnimationActive = true;

			this.$router.push({
				hash: `#${this.blockId}`,
				query: {
					page: this.currentPage,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.block-blog-list {
	z-index: $z-index-site-engine-block-grid;
	display: flex;
	flex-direction: column;
	grid-area: 1/1 / -1/-1;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	padding: var(--block-padding, 8px) 46px;

	&__list {
		// There is always 1 gap less than there are columns. Multiply those columns by one gap size.
		--total-gaps-width: calc((var(--post-column-count) - 1) * max(var(--grid-gap-size), 4px));

		// Take the whole content width and subtract the gaps.
		--list-width: calc(var(--content-width) - var(--total-gaps-width));

		display: grid;

		// Auto-fill makes columns wrap, but also doesn't allow to have more items than column count,
		// since columns grow to max possible size.
		/* stylelint-disable-next-line max-line-length */
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--list-width) / max(calc(var(--post-column-count)), 2)), 1fr));
		grid-gap: var(--grid-gap-size);
		width: var(--content-width);
		max-width: 100%;

		&--one-col {
			width: calc(var(--content-width) / 2);
		}
	}

	&__filter {
		display: flex;
		flex-direction: column;
		text-align: center;

		&-button {
			font-size: 14px;
			font-weight: normal;
			line-height: 1.43;
			text-decoration: underline;
			text-transform: none;
			letter-spacing: 0;
		}
	}

	&__pagination {
		align-self: center;
	}

	&__empty-block {
		display: flex;
		flex-direction: column;
		place-content: center;
		place-items: center;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
}

// Mobile layout
@include site-engine-mobile {
	.block-blog-list {
		padding: var(--block-padding, 8px) 8px;

		&__list {
			grid-template-columns: repeat(1, 1fr);
			grid-gap: var(--m-grid-gap-size);
			width: 100%;
		}
	}
}

</style>
