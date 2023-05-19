<template>
	<div class="post-tab">
		<ZyroLabel class="post-tab__title">
			{{ $t('builder.blog.blockBlogList.style.visibilityLabel') }}
		</ZyroLabel>
		<EditBlockVisibleElements :value-map="keyToTextValueMap" />
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import EditBlockVisibleElements from '@/components/builder-controls/reusable-controls/block/EditBlockVisibleElements.vue';
import { useI18n } from 'vue-i18n';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLabel,
		EditBlockVisibleElements,
	},

	setup() {
		const { t } = useI18n();

		const keyToTextValueMap = {
			coverImage: t('builder.blog.blockBlogList.post.coverImage'),
			title: t('builder.blog.blockBlogList.post.title'),
			description: t('builder.blog.blockBlogList.post.description'),
			date: t('builder.blog.blockBlogList.post.date'),
			categories: t('builder.blog.blockBlogList.post.categories'),
			authorFullName: t('builder.blog.blockBlogList.post.authorFullName'),
			// Remove avatar until we can change avatar image
			// avatar: t('builder.blog.blockBlogList.post.avatar'),
			minutesToRead: t('builder.blog.blockBlogList.post.minutesToRead'),
		};

		return {
			keyToTextValueMap,
		};
	},

	data() {
		return {
			blockId: null,
			initialCurrentBlockData: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlock']),
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions('undoRedo', ['createSnapshot']),
	},
});
</script>

<style lang="scss" scoped>
.post-tab {
	&__title {
		margin-bottom: 16px;
	}
}
</style>
