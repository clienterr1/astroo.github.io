<template>
	<ZyroModal
		width="360px"
		height="90%"
		class="settings-modal"
		@close-modal="isCloseConfirmationShown = true"
	>
		<template #title>
			{{ $t('common.postSettings') }} <span class="z-subheading">
				{{ $t(getBlogPostStatusTextPath) }}
			</span>
		</template>
		<ZyroTabs
			:tabs="tabs"
			:current-tab="currentTab"
			@update:current-tab="currentTab = $event"
		/>
		<Component
			:is="currentTab.component"
			@is-valid="error = !$event"
		/>
		<template #footer>
			<ZyroButton
				v-qa="`blog-postsettings-btn-cancel`"
				@click="closeAndDiscardChanges"
			>
				{{ $t('common.cancel') }}
			</ZyroButton>
			<ZyroButton
				v-qa="`blog-postsettings-btn-save`"
				theme="primary"
				:disabled="error || !isBlogPostEdited"
				@click="save"
			>
				{{ $t('common.save') }}
			</ZyroButton>
		</template>
		<UnsavedChangesModal
			v-if="isCloseConfirmationShown"
			:item-before-edit="postBeforeEdit"
			:item-after-edit="blogPages[blogPostId]"
			@discard="closeAndDiscardChanges"
			@close-modal="isCloseConfirmationShown = false"
		/>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import EventLogApi from '@/api/EventLogApi';
import BlogPostSettingsTabCategories from '@/components/builder-controls/blog-post-settings/BlogPostSettingsTabCategories.vue';
import BlogPostSettingsTabCoverImage from '@/components/builder-controls/blog-post-settings/BlogPostSettingsTabCoverImage.vue';
import BlogPostSettingsTabGeneral from '@/components/builder-controls/blog-post-settings/BlogPostSettingsTabGeneral.vue';
import UnsavedChangesModal from '@/components/builder-modals/modals/UnsavedChangesModal.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
		ZyroTabs,
		BlogPostSettingsTabGeneral,
		BlogPostSettingsTabCoverImage,
		BlogPostSettingsTabCategories,
		UnsavedChangesModal,
	},

	data() {
		return {
			currentTab: {},
			postBeforeEdit: null,
			blogPostId: null,
			error: false,
			isCloseConfirmationShown: false,
			isBlogPostEdited: false,
		};
	},

	computed: {
		...mapState('gui', ['activeModalSettings']),
		...mapGetters(['blogPages']),
		getBlogPostStatusTextPath() {
			const isDraftPost = this.postBeforeEdit?.isDraft ?? false;

			if (this.isScheduledPost) {
				return 'common.scheduled';
			}

			if (isDraftPost) {
				return 'common.draft';
			}

			return 'common.public';
		},
		blogPostToEdit() {
			return this.blogPages[this.activeModalSettings.blogPostId];
		},
		isScheduledPost() {
			return this.postBeforeEdit?.isScheduled ?? false;
		},
		isScheduledCurrentPost() {
			return this.blogPostToEdit?.isScheduled ?? false;
		},
		tabs() {
			return [
				{
					id: 'general',
					title: this.$t('common.general'),
					component: 'BlogPostSettingsTabGeneral',
				},
				{
					id: 'coverImage',
					title: this.$t('builder.blog.blockBlogList.post.coverImage'),
					component: 'BlogPostSettingsTabCoverImage',
				},
				{
					id: 'categories',
					title: this.$t('common.categories'),
					component: 'BlogPostSettingsTabCategories',
				},
			];
		},
	},

	watch: {
		blogPostToEdit: {
			deep: true,
			handler(newValue) {
				if (newValue) {
					this.isBlogPostEdited = true;
				}
			},
		},
	},

	mounted() {
		this.blogPostId = this.activeModalSettings.blogPostId;
		this.postBeforeEdit = cloneDeep(this.blogPostToEdit);
		[this.currentTab] = this.tabs;
	},

	methods: {
		...mapActions([
			'updateInternalLinks',
			'mergePageData',
		]),
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		closeAndDiscardChanges() {
			this.isCloseConfirmationShown = false;
			this.mergePageData({
				pageId: this.blogPostId,
				pageData: this.postBeforeEdit,
			});
			this.closeModal();
		},

		save() {
			if (this.postBeforeEdit.slug !== this.blogPostToEdit.slug) {
				this.updateInternalLinks({
					oldLink: `/${this.postBeforeEdit.slug}`,
					newLink: `/${this.blogPostToEdit.slug}`,
				});
			}

			if (this.isScheduledCurrentPost) {
				EventLogApi.logEvent({
					eventName: 'builder.blog.schedule_post',
				});
			}

			this.closeModal();
		},
	},
});
</script>

<style lang="scss" scoped>
:deep(.settings-modal) {
	.modal {
		&__content {
			min-height: 400px;
			overflow: auto;
		}
	}
}
</style>
