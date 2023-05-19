<template>
	<div
		v-qa="'blog-postinformation'"
		class="block-blog-header"
		:[DATA_ATTRIBUTE_ANIMATION_ROLE]="DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT"
	>
		<div class="block-blog-header__content">
			<h1
				v-qa="'blog-label-posttitle'"
				class="font-primary block-blog-header__title"
			>
				{{ meta.title }}
			</h1>
			<p
				v-if="shownItems.description"
				v-qa="'blog-label-postdescription'"
				class="font-secondary block-blog-header__description"
			>
				{{ meta.description }}
			</p>
			<BlockBlogListItemCategories
				v-if="areCategoriesShown"
				v-qa="'blog-label-category'"
				class="font-secondary"
				:categories="categories"
				:blog-categories="blogCategories"
			/>
			<BlockBlogListItemMeta
				v-bind="{
					authorName,
					minutesAmount: currentBlogPage.minutesToRead,
					date: getFormattedNumericDate(currentBlogPage.date),
					showAvatar: shownItems.avatar,
					showName: shownItems.authorFullName,
					showDate: shownItems.date,
					showMinutes: shownItems.minutesToRead
				}"
			/>
		</div>
	</div>
</template>

<script>
import BlockBlogListItemCategories from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListItemCategories.vue';
import BlockBlogListItemMeta from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogListItemMeta.vue';
import { getFormattedNumericDate } from '@zyro-inc/site-modules/utils/getFormattedNumericDate';
import {
	DATA_ATTRIBUTE_ANIMATION_ROLE,
	DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
} from '@zyro-inc/site-modules/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockBlogHeader',

	components: {
		BlockBlogListItemMeta,
		BlockBlogListItemCategories,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		currentBlogPage: {
			type: Object,
			required: true,
		},
		blogCategories: {
			type: Object,
			default: () => ({}),
		},
	},

	setup() {
		return {
			getFormattedNumericDate,
			DATA_ATTRIBUTE_ANIMATION_ROLE,
			DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
		};
	},

	computed: {
		categories() {
			return this.currentBlogPage?.categories ?? [];
		},
		meta() {
			return this.currentBlogPage?.meta ?? {};
		},
		authorName() {
			return this.meta?.authorName;
		},
		shownItems() {
			return this.data?.settings?.shownItems ?? {};
		},
		areCategoriesShown() {
			return this.shownItems.categories && this.categories.length;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/components/blocks/blog/BlockBlogFonts";
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.block-blog-header {
	z-index: $z-index-site-engine-block-grid;
	display: flex;
	flex-direction: column;
	grid-area: 1/1 / -1/-1;
	align-items: var(--align);
	width: 100%;
	max-width: var(--content-width);
	padding: var(--block-padding);
	margin: auto;
	text-align: var(--text-align);

	&__content {
		width: 100%;
		color: var(--blog-post-header-text-color);
	}

	&__description {
		margin-bottom: 12px;
		opacity: 0.8;
	}

	&__title {
		margin-bottom: 12px;
		font-size: 32px;
	}
}

@include site-engine-mobile {
	.block-blog-header {
		padding: var(--m-block-padding);
	}
}
</style>
