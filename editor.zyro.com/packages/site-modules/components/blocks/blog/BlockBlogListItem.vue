<template>
	<div
		class="block-blog-list-item"
		:[DATA_ATTRIBUTE_ANIMATION_ROLE]="DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT"
		:[DATA_ATTRIBUTE_ANIMATION_STATE]="isAnimationActive ? DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE : null"
	>
		<slot name="block-blog-list-item-overlay" />
		<a
			v-if="isCoverImageShown"
			v-qa="'blog-list-item-image'"
			:href="post.slug"
			class="block-blog-list-item__cover-image-container"
			@click.prevent="$emit('post-click')"
		>
			<div class="block-blog-list-item__cover-image-wrapper">
				<img
					class="block-blog-list-item__cover-image"
					:alt="coverImageAlt"
					:src="post.coverImageSrc"
					:srcset="post.coverImageSrcset"
					:sizes="sizes"
					rel="preload"
				>
			</div>
		</a>
		<BlockBlogListItemCategories
			v-show="shownItems.categories && categories.length"
			class="font-secondary"
			:categories="categories"
			:blog-categories="blogCategories"
			@filter-category="(category) => $emit('filter-category', category)"
		/>
		<a
			class="block-blog-list-item__content"
			:href="post.slug"
			@click.prevent="$emit('post-click')"
		>
			<h3
				v-show="shownItems.title"
				class="font-primary block-blog-list-item__title"
			>
				{{ post.meta.title }}
			</h3>
			<p
				v-show="shownItems.description"
				class="block-blog-list-item__description font-secondary"
			>
				{{ post.meta.description }}
			</p>
			<BlockBlogListItemMeta
				v-bind="{
					authorName: authorName,
					minutesAmount: post.minutesToRead,
					date: $options.getFormattedNumericDate(post.date),
					showAvatar: shownItems.avatar,
					showName: shownItems.authorFullName,
					showDate: shownItems.date,
					showMinutes: shownItems.minutesToRead
				}"
			/>
		</a>
	</div>
</template>

<script>
import BlockBlogListItemCategories from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListItemCategories.vue';
import BlockBlogListItemMeta from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListItemMeta.vue';
import { BLOG_POST_COVER_IMAGE_MAX_WIDTH } from '@zyro-inc/site-modules/components/blocks/blog/constants';
import { getFormattedNumericDate } from '@zyro-inc/site-modules/utils/getFormattedNumericDate';
import { getGridItemSizes } from '@zyro-inc/site-modules/utils/getSrcsets';
import {
	DATA_ATTRIBUTE_ANIMATION_ROLE,
	DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
	DATA_ATTRIBUTE_ANIMATION_STATE,
	DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
} from '@zyro-inc/site-modules/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		BlockBlogListItemMeta,
		BlockBlogListItemCategories,
	},

	props: {
		post: {
			type: Object,
			default: () => ({}),
		},
		isLcp: {
			type: Boolean,
			default: false,
		},
		authorName: {
			type: String,
			default: null,
		},
		shownItems: {
			type: Object,
			default: () => ({
				authorFullName: true,
				coverImage: true,
				title: true,
				description: true,
				date: true,
				categories: true,
				avatar: true,
				minutesToRead: true,
			}),
		},
		coverObjectFit: {
			type: String,
			default: 'cover',
		},
		cursor: {
			type: String,
			default: 'pointer',
		},
		blogCategories: {
			type: Object,
			default: () => ({}),
		},
		isAnimationActive: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			DATA_ATTRIBUTE_ANIMATION_ROLE,
			DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
			DATA_ATTRIBUTE_ANIMATION_STATE,
			DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
		};
	},

	computed: {
		coverImageAlt() {
			return this.post?.coverImageAlt ?? '';
		},
		sizes() {
			return getGridItemSizes(BLOG_POST_COVER_IMAGE_MAX_WIDTH, null);
		},
		categories() {
			return this.post?.categories ?? [];
		},
		isCoverImageShown() {
			return !!this.shownItems.coverImage && (this.post?.coverImageSrc || this.post?.coverImageSrcset);
		},
	},

	getFormattedNumericDate,
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/components/blocks/blog/BlockBlogFonts";

.block-blog-list-item {
	position: relative;
	display: flex;
	flex-direction: column;
	cursor: var(--cursor-style);
	cursor: pointer;
	border-radius: 5px;
	transition: box-shadow 0.3s $transition-timing-easing-standard;

	// Image always fills up the parent wrapper
	&__cover-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	// Make the image wrapper always keep the same 5:3 aspect ratio
	&__cover-image-wrapper {
		position: relative;
		padding-bottom: 60%;
	}

	&__cover-image-container {
		padding-bottom: 20px;
	}

	&__content {
		color: var(--blog-post-header-text-color);
		text-decoration: none;
	}

	&__description {
		margin-bottom: 12px;
		text-decoration: none;
		opacity: 0.8;
	}

	&__title {
		margin-bottom: 12px;
		word-break: break-word;
	}
}
</style>
