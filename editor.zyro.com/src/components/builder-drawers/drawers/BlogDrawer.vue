<template>
	<ZyroDrawer
		class="drawer"
		data-qa="builder-sidebar-blog"
	>
		<div
			v-if="hasBlog"
			class="drawer-content"
		>
			<div class="drawer-content__header">
				<div class="drawer-content__header-title z-h5">
					{{ $t('common.blog') }}
				</div>
				<p class="drawer-content__header-description z-body-small">
					{{ $t('builder.blog.blogDrawer.subtitle') }}
				</p>
			</div>
			<div class="drawer-content__tabs">
				<ZyroTabs
					:tabs="tabs"
					:current-tab="currentTab"
					@update:current-tab="currentTab = $event"
				/>
			</div>
			<div
				ref="items"
				class="drawer-content__list"
			>
				<BlogDrawerItem
					v-for="(post, key) in sortedBlogPosts"
					:key="`post-${key}`"
					v-qa="'blog-card-post'"
					:title="post.meta.title"
					:date="getFormattedNumericDate(post.date)"
					:is-publishable="isPublishable(post)"
					:type-text="postTypeText({
						isScheduled: post.isScheduled,
						isDraft: post.isDraft
					})"
					@edit="editPost(key)"
					@duplicate="duplicatePost(key)"
					@delete="removePage({ pageId: key })"
					@settings="openPostSettings(key)"
					@publish="publishPost(key)"
				/>
			</div>
			<div class="drawer-content__footer">
				<ZyroButton
					theme="outline"
					class="list-button"
					data-testId="add-post-button"
					data-qa="blog-btn-addnewpost"
					@click="addBlogPost"
				>
					<template #icon-left>
						<Icon
							name="add"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.blog.blockBlogListEmptyBlock.addNewPost') }}
				</ZyroButton>
				<ZyroButton
					theme="outline"
					class="list-button"
					:title="$t('builder.blog.blogDrawer.openModal')"
					data-qa="blog-btn-settings"
					@click="openModal({ name: 'BlogSettingsModal' })"
				>
					<template #icon>
						<Icon
							name="settings"
							dimensions="16px"
						/>
					</template>
				</ZyroButton>
			</div>
		</div>
		<EmptyBlogDrawer
			v-else
			@add-post="addBlogList"
		/>
	</ZyroDrawer>
</template>

<script>

import {
	mapActions,
	mapGetters,
	mapState,
} from 'vuex';
import {
	defineComponent,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import EmptyBlogDrawer from '@/components/builder-drawers/drawers/partials/blogDrawer/EmptyBlogDrawer.vue';

import BlogDrawerItem from '@/components/builder-controls/blog-drawer/BlogDrawerItem.vue';
import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';
import { getFormattedNumericDate } from '@/utils/date';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroDrawer,
		ZyroTabs,
		BlogDrawerItem,
		EmptyBlogDrawer,
	},

	setup() {
		const { t } = useI18n();

		const tabs = [
			{
				id: 'all',
				title: t('common.all'),
			},
			{
				id: 'drafts',
				title: t('common.drafts'),
			},
			{
				id: 'scheduled',
				title: t('common.scheduled'),
			},
			{
				id: 'published',
				title: t('common.published'),
			},
		];

		const currentTab = ref(tabs[0]);

		return {
			tabs,
			currentTab,
			getFormattedNumericDate,
		};
	},

	computed: {
		...mapState([
			'website',
			'currentPageId',
		]),
		...mapState('user', ['user']),
		...mapGetters([
			'draftBlogPages',
			'scheduledBlogPages',
			'publishedBlogPages',
			'blogPages',
		]),
		...mapGetters('blog', ['hasBlog']),
		blogPosts() {
			if (this.currentTab.id === this.tabs[0].id) {
				return this.blogPages;
			}

			if (this.currentTab.id === this.tabs[1].id) {
				return this.draftBlogPages;
			}

			if (this.currentTab.id === this.tabs[2].id) {
				return this.scheduledBlogPages;
			}

			return this.publishedBlogPages;
		},
		sortedBlogPosts() {
			return Object.fromEntries(
				Object.entries(this.blogPosts)
					.sort(([, postA], [, postB]) => new Date(postB.date) - new Date(postA.date)),
			);
		},
	},

	methods: {
		...mapActions([
			'addBlogPostPage',
			'addBlog',
			'duplicatePage',
			'removePage',
			'updateCurrentPageId',
		]),
		...mapActions('blog', ['toggleBlogPostVisibility']),
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		isPublishable(post) {
			return post.isDraft || post.isScheduled;
		},
		postTypeText({
			isScheduled,
			isDraft,
		}) {
			if (isScheduled) {
				return this.$t('common.scheduled');
			}

			if (isDraft) {
				return this.$t('common.draft');
			}

			return this.$t('common.public');
		},
		editPost(pageId) {
			if (this.currentPageId !== pageId) {
				this.updateCurrentPageId(pageId);
			}
		},
		openPostSettings(blogPostId) {
			this.openModal({
				name: 'BlogPostSettingsModal',
				settings: {
					blogPostId,
				},
			});
		},
		duplicatePost(blogPostId) {
			this.duplicatePage({
				siteData: this.website,
				pageId: blogPostId,
			});
		},
		publishPost(blogPostId) {
			this.toggleBlogPostVisibility(blogPostId);
		},
		addBlogPost() {
			this.addBlogPostPage({
				postTitle: this.$t('builder.blog.blogPost.title'),
				postDescription: this.$t('builder.blog.blogPost.description'),
				postContent: this.$t('builder.blog.blogPageElements.content'),
			});
			window.hj('identify', this.user.id, {
				'builder.blog.create_new_post': true,
			});
		},
		addBlogList() {
			this.addBlog({
				pageTitle: this.$t('common.blog'),
				postTitle: this.$t('builder.blog.blogPost.title'),
				postDescription: this.$t('builder.blog.blogPost.description'),
				postContent: this.$t('builder.blog.blogPageElements.content'),
			});
			if (this.user?.id) {
				window.hj('identify', this.user.id, {
					'builder.blog.add_blog_page': true,
				});
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.drawer {
	overflow: visible;

	&-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;

		&__header {
			flex: 0;
			padding: 24px;
			margin-bottom: 16px;

			&-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 8px;
			}

			&-description {
				color: $color-gray;
			}
		}

		&__list {
			flex: 1;
			width: 100%;
			padding: 0 24px;
			overflow-x: hidden;
			overflow-y: auto;
			border-bottom: 1px solid $color-gray-border;
		}

		&__tabs {
			padding: 0 24px;
			margin-bottom: 8px;
		}

		&__footer {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 24px;
			margin-top: auto;
		}
	}
}
</style>
