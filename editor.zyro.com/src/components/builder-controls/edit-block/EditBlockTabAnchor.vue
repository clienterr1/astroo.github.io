<template>
	<ZyroFieldInput
		:label="$t('builder.editBlockTabAnchor.anchorName')"
		:model-value="htmlId"
		:message="$t('builder.editBlockTabAnchor.anchorUrlExample', [sectionUrl])"
		input-data-qa="grid-tabanchor-input-anchor"
		@update:model-value="updateHtmlId"
	/>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { getValidHtmlId } from '@/utils/urlValidators';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldInput,
	},

	data() {
		return {
			blockId: '',
		};
	},

	computed: {
		...mapState([
			'currentBlockId',
			'currentPageId',
		]),
		...mapGetters([
			'defaultLocale',
			'currentBlock',
			'siteUrl',
			'currentPage',
			'homePageId',
			'currentLanguageData',
		]),
		sectionUrl() {
			const locale = this.currentLanguageData.locale === this.defaultLocale
				? null
				: this.currentLanguageData.locale;
			const slug = this.homePageId === this.currentPageId ? null : this.currentPage.slug;

			const path = [
				locale,
				slug,
			].filter((value) => value).join('/');

			const url = new URL(`${path}${this.htmlId}`, this.siteUrl);

			return url.toString();
		},
		htmlId() {
			const htmlId = this.currentBlock.htmlId || '';

			return `#${htmlId}`;
		},
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),

		updateHtmlId(newValue) {
			const { htmlId } = getValidHtmlId(newValue);

			// updateBlockData skips updating data if its the same
			// So if getValidHtmlId strips out for eg '!' from the end
			// updateBlockData will see that the input is the same
			// and input box will not update leading to weird behaviour
			// forcing update everytime anchor changes makes it so users can't even type not allowed characters
			this.$forceUpdate();
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					htmlId,
				},
				merge: true,
			});
		},
	},
});
</script>
