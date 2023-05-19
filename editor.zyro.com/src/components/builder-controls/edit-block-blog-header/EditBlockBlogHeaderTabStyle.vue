<template>
	<EditBlockVisibleElements :value-map="keyToTextValueMap" />
</template>

<script>
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
		EditBlockVisibleElements,
	},

	setup() {
		const { t } = useI18n();

		const keyToTextValueMap = {
			description: t('builder.blog.blockBlogList.post.description'),
			categories: t('builder.blog.blockBlogList.post.categories'),
			authorFullName: t('builder.blog.blockBlogList.post.authorFullName'),
			date: t('builder.blog.blockBlogList.post.date'),
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
			id: null,
			initialCurrentBlockData: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlock']),
	},

	mounted() {
		this.id = this.currentBlockId;
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
