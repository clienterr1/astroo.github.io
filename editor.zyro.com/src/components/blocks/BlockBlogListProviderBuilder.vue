<template>
	<BlockBlogList
		:data="data"
		:block-id="blockId"
		:posts="blogPosts"
		:blog-categories="blogCategories"
		@post-click="editPost"
	>
		<template #block-blog-list-empty-block>
			<BlockBlogListEmptyBlock
				:mode="emptyBlockMode"
				@add-post-button-click="addPost"
			/>
		</template>
		<template #block-blog-list-overlay="{ post }">
			<BlockBlogListItemOverlay
				:post="post"
				@overlay-button-click="editPost"
			/>
		</template>
	</BlockBlogList>
</template>

<script>

import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import BlockBlogList from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogList.vue';
import BlockBlogListEmptyBlock from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListEmptyBlock.vue';
import BlockBlogListItemOverlay from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListItemOverlay.vue';
import {
	BLOG_POST_COVER_IMAGE_MAX_HEIGHT,
	BLOG_POST_COVER_IMAGE_MAX_WIDTH,
} from '@zyro-inc/site-modules/components/blocks/blog/constants';
import { mockPosts } from '@zyro-inc/site-modules/components/blocks/blog/mockPosts';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockBlogListProviderBuilder',

	components: {
		BlockBlogList,
		BlockBlogListEmptyBlock,
		BlockBlogListItemOverlay,
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
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		...mapState([
			'websiteId',
			'currentPageId',
		]),
		...mapState('user', ['user']),
		...mapGetters([
			'publishedBlogPages',
			'blogPages',
			'blogCategories',
		]),
		blogPosts() {
			return Object.fromEntries(Object.entries(this.posts)
				.map(([id, post]) => {
					const coverImageSrc = getOptimizedSrc(post.coverImageOrigin, post.coverImagePath, this.websiteId, {
						width: BLOG_POST_COVER_IMAGE_MAX_WIDTH,
						height: BLOG_POST_COVER_IMAGE_MAX_HEIGHT,
					});

					return [
						id,
						{
							...post,
							coverImageSrc,
						},
					];
				}));
		},
		emptyBlockMode() {
			return Object.keys(this.blogPages).length === 0 ? 'with-button' : 'no-posts';
		},
		posts() {
			return this.isBlockPreviewMode ? mockPosts : this.publishedBlogPages;
		},
	},

	methods: {
		...mapActions([
			'addBlogPostPage',
			'updateCurrentPageId',
		]),
		addPost() {
			this.addBlogPostPage({
				postTitle: this.$t('builder.blog.blogPost.title'),
				postDescription: this.$t('builder.blog.blogPost.description'),
				postContent: this.$t('builder.blog.blogPageElements.content'),
			});
			window.hj('identify', this.user.id, {
				'builder.blog.create_new_post': true,
			});
		},
		editPost(post) {
			const pageId = Object.keys(this.publishedBlogPages).find(
				(key) => this.publishedBlogPages[key].slug === post.slug,
			);

			// Prevent "navigation duplicated" error (do not push to the same route)
			if (pageId === this.currentPageId) {
				return;
			}

			this.updateCurrentPageId(pageId);
		},
	},
});
</script>
