<template>
	<BlockBlogList
		:data="data"
		:block-id="blockId"
		:posts="blogPosts"
		:blog-categories="blogCategories"
		@post-click="handlePostClick"
	/>
</template>

<script>
import { mapGetters } from 'vuex';

import {
	SYSTEM_LOCALE,
	PAGE_TYPE_BLOG,
} from '@zyro-inc/site-modules/constants';
import BlockBlogList from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogList.vue';
import {
	BLOG_POST_COVER_IMAGE_MAX_WIDTH,
	BLOG_POST_COVER_IMAGE_MAX_HEIGHT,
} from '@zyro-inc/site-modules/components/blocks/blog/constants';
import { mockPosts } from '@zyro-inc/site-modules/components/blocks/blog/mockPosts';
import { getGridItemSrcset } from '@zyro-inc/site-modules/utils/getSrcsets';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockBlogListProviderUser',

	components: {
		BlockBlogList,
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
		currentLocale: {
			type: String,
			default: SYSTEM_LOCALE,
		},
	},

	computed: {
		...mapGetters([
			'siteId',
			'pages',
			'blogCategories',
			'getPagePathFromId',
		]),
		publishedBlogPages() {
			return Object.fromEntries(Object.entries(this.pages).filter(([, page]) => page.type === PAGE_TYPE_BLOG && !page.isDraft));
		},
		blogPosts() {
			return Object.fromEntries(Object.entries(this.publishedBlogPages)
				.map(([id, post]) => {
					const coverImageSrcset = getGridItemSrcset(
						post.coverImageOrigin,
						post.coverImagePath,
						this.siteId,
						{
							width: BLOG_POST_COVER_IMAGE_MAX_WIDTH,
							height: BLOG_POST_COVER_IMAGE_MAX_HEIGHT,
						},
					);

					return [
						id,
						{
							id,
							...post,
							coverImageSrcset,
						},
					];
				}));
		},
		posts() {
			return this.isBlockPreviewMode ? mockPosts : this.publishedBlogPages;
		},
	},

	methods: {
		handlePostClick(post) {
			const path = this.getPagePathFromId({
				pageId: post.id,
			});

			this.$router.push({
				path,
			});
		},
	},
});
</script>
