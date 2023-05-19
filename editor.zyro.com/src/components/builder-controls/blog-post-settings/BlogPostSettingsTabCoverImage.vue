<template>
	<div>
		<ZyroImageSelector
			:origin="currentBlogPage.coverImageOrigin"
			:path="currentBlogPage.coverImagePath"
			@update="setCurrentBlogPageImages"
		/>
	</div>
</template>

<script>
import ZyroImageSelector from '@/components/global/ZyroImageSelector.vue';

import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroImageSelector,
	},

	computed: {
		...mapState('gui', ['activeModalSettings']),
		...mapGetters(['blogPages']),

		currentBlogPage() {
			return this.blogPages[this.activeModalSettings.blogPostId];
		},
	},

	methods: {
		...mapActions(['mergePageData']),

		setCurrentBlogPageImages({
			path,
			origin,
			alt,
		}) {
			this.mergePageData({
				pageId: this.activeModalSettings.blogPostId,
				pageData: {
					meta: {
						ogImagePath: path,
						ogImageOrigin: origin,
						ogImageAlt: alt,
					},
					coverImagePath: path,
					coverImageOrigin: origin,
					coverImageAlt: alt,
				},
			});
		},
	},
});
</script>
