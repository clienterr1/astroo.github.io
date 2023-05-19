<template>
	<div class="settings">
		<ZyroFieldInput
			:model-value="pageName"
			:label="$t('builder.blog.blogPostSettings.postTitle')"
			:error="pageNameErrorMessage"
			input-data-qa="blog-postsettings-input-posttitle"
			@update:model-value="handleNameChange"
		/>
		<AiRecommendation v-if="!isHostingerBrand">
			<i18n-t
				tag="p"
				keypath="builder.blog.blogPostSettings.AIRecommendationBlogTitle"
			>
				<BlogPostSettingsTabGeneralAiLink />
			</i18n-t>
		</AiRecommendation>
		<ZyroFieldTextArea
			:model-value="pageDescription"
			:label="$t('builder.blog.blogPostSettings.postDescription')"
			input-data-qa="blog-postsettings-input-postdescription"
			@update:model-value="updateDescription"
		/>
		<ZyroFieldInput
			:model-value="pageSlug"
			:label="$t('builder.blog.blogPostSettings.url')"
			:error="pageSlugErrorMessage"
			:message="pageSlugMessage"
			input-data-qa="blog-postsettings-input-posturl"
			@update:model-value="updatePageSlug"
		/>
		<ZyroFieldInput
			:model-value="authorName"
			:label="$t('builder.blog.blogPostSettings.postAuthors')"
			input-data-qa="blog-postsettings-input-postauthors"
			@update:model-value="updateAuthorName"
		/>
		<div v-if="!isScheduled">
			<ZyroLabel class="settings__label">
				{{ $t('builder.blog.blogPostSettings.postDate') }}
			</ZyroLabel>
			<ZyroDatePicker
				v-qa="`blogpostsettings-datepicker-input`"
				class="settings__post-date"
				:model-value="pageDate"
				@update:model-value="updateDate"
			/>
		</div>
		<ZyroFieldToggle
			id="toggleSchedulePostSwitch"
			v-qa="`blogpostsettings-schedulepost-${isScheduled ? 'on' : 'off'}`"
			:model-value="isScheduled"
			:label="$t('builder.blog.blogPostSettings.schedulePost')"
			@update:model-value="updateIsScheduled"
		/>
		<ZyroDatePicker
			v-if="isScheduled"
			v-qa="`blogpostsettings-datepicker-input`"
			class="settings__schedule-post-date"
			:model-value="pageDate"
			:min="sliceTimeFromISODate(earliestAllowedScheduledPostDate)"
			@update:model-value="updateDate"
		/>
	</div>
</template>

<script>
import ZyroDatePicker from '@/components/global/ZyroDatePicker.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';

import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import AiRecommendation from '@/components/ui/AiRecommendation.vue';
import BlogPostSettingsTabGeneralAiLink from '@/components/builder-controls/blog-post-settings/BlogPostSettingsTabGeneralAiLink.vue';
import { sliceTimeFromISODate } from '@/utils/date';
import { slugifyPagePath } from '@/utils/urlValidators';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';

import {
	defineComponent,
	computed,
} from 'vue';
import { usePageNameWithSlugValidation } from '@/use/usePageNameWithSlugValidation';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

export default defineComponent({

	components: {
		ZyroDatePicker,
		ZyroFieldInput,
		ZyroFieldTextArea,
		ZyroLabel,
		ZyroFieldToggle,
		AiRecommendation,
		BlogPostSettingsTabGeneralAiLink,
	},
	emits: ['update-error'],

	setup(_, { emit }) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { t } = useI18n();

		const pageId = computed(() => state.gui.activeModalSettings.blogPostId);
		const pageSlugMessage = computed(() => {
			const path = getPagePathFromId({
				pageId: pageId.value,
				siteData: state.website,
				locale: state.currentLocale,
			});

			return `${t('builder.pageSettingsModal.textFields.pageUrl.message')} ${getters.siteUrl}${path}`;
		});
		const pageToEdit = computed(() => getters.blogPages[pageId.value]);
		const pageName = computed(() => pageToEdit.value.meta.title);
		const pageSlug = computed(() => pageToEdit.value.slug);
		const pageDescription = computed(() => pageToEdit.value.meta.description);
		const pageDate = computed(() => sliceTimeFromISODate(pageToEdit.value.date));
		const isScheduled = computed(() => pageToEdit.value.isScheduled || false);
		const authorName = computed(() => pageToEdit.value.meta.authorName || '');
		const earliestAllowedScheduledPostDate = computed(() => {
			const currentDate = new Date();

			return new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString();
		});
		const {
			pageNameErrorMessage,
			isPageNameValid,
			pageSlugErrorMessage,
			isPageSlugValid,
		} = usePageNameWithSlugValidation({
			pageName,
			pageSlug,
			pageId,
		});
		const isFormValid = computed(() => isPageNameValid.value && isPageSlugValid.value);

		const updatePageData = (pageData) => {
			dispatch('mergePageData', {
				pageId: pageId.value,
				pageData,
			});
		};

		const updateIsScheduled = (newValue) => {
			updatePageData({
				isScheduled: newValue,
				isDraft: true,
				date: earliestAllowedScheduledPostDate.value,
			});
		};

		const updateDate = (newValue) => {
			updatePageData({
				date: newValue,
			});
		};

		const updatePageName = (newValue) => {
			updatePageData({
				meta: {
					title: newValue,
				},
				name: newValue,
			});

			emit('is-valid', isFormValid.value);
		};

		const updatePageSlug = (newValue) => {
			updatePageData({
				slug: slugifyPagePath(newValue).path,
			});

			emit('is-valid', isFormValid.value);
		};

		const handleNameChange = (newValue) => {
			const trimmedValue = newValue.trim();

			updatePageName(trimmedValue);
			updatePageSlug(trimmedValue);
		};

		const updateAuthorName = (newValue) => {
			updatePageData({
				meta: {
					authorName: newValue,
				},
			});
		};

		const updateDescription = (newValue) => {
			updatePageData({
				meta: {
					description: newValue,
				},
			});
		};

		return {
			pageSlugMessage,
			pageName,
			pageSlug,
			pageDescription,
			authorName,
			pageDate,
			isScheduled,
			earliestAllowedScheduledPostDate,
			pageNameErrorMessage,
			pageSlugErrorMessage,
			sliceTimeFromISODate,
			isHostingerBrand,
			updateIsScheduled,
			updateDate,
			handleNameChange,
			updatePageSlug,
			updateAuthorName,
			updateDescription,
		};
	},
});
</script>

<style lang="scss" scoped>
.settings {
	&__label {
		margin: 8px 0;
	}

	&__post-date {
		margin-bottom: 8px;
	}

	&__schedule-post-date {
		margin-bottom: 16px;
	}
}
</style>
