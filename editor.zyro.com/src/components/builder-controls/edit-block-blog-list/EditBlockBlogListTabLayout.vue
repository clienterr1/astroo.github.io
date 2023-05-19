<template>
	<div>
		<ZyroFieldRange
			:model-value="postsPerPage"
			min="1"
			:max="maxPostsPerPage"
			:label="$t('builder.blog.blockBlogList.layout.postsPerPage')"
			units=""
			@update:model-value="updatePostsPerPage"
		/>
		<ZyroSeparator />
		<ZyroFieldRange
			:model-value="columnCount"
			min="1"
			max="4"
			:label="$t('common.columns')"
			units=""
			@update:model-value="updateColumnCount"
		/>
		<ZyroSeparator />
		<ZyroFieldRange
			:model-value="gridGapSize"
			min="0"
			max="80"
			step="4"
			:label="$t('common.columnGap')"
			@update:model-value="updateGridGapSize"
		/>
		<ZyroSeparator />
		<ZyroFieldRange
			:model-value="padding"
			min="0"
			max="80"
			step="4"
			:label="$t('builder.blog.blockBlogList.layout.padding')"
			@update:model-value="updatePadding"
		/>
		<ZyroSeparator />
	</div>
</template>

<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { useBuilderStyles } from '@/components/builder-controls/useBuilderStyles';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldRange,
		ZyroSeparator,
	},

	setup() {
		const {
			getStyleValue,
			getStyleKey,
		} = useBuilderStyles();

		return {
			getStyleValue,
			getStyleKey,
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
		...mapGetters([
			'currentBlock',
			'currentBlockSettings',
			'currentBlockStyles',
			'publishedBlogPages',
		]),
		maxPostsPerPage() {
			return Object.keys(this.publishedBlogPages).length;
		},
		postsPerPage() {
			const { postsPerPage } = this.currentBlockSettings;

			return postsPerPage > this.maxPostsPerPage ? this.maxPostsPerPage : postsPerPage;
		},
		columnCount() {
			return this.currentBlockStyles?.['post-column-count'];
		},
		padding() {
			return Number.parseInt(this.currentBlockStyles?.['block-padding'], 10);
		},
		gridGapSize() {
			return Number.parseInt(this.getStyleValue('grid-gap-size', this.currentBlockSettings.styles), 10);
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
		updatePostsPerPage(newValue) {
			// Always convert value to number
			const numberValue = Number(newValue);

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						postsPerPage: numberValue,
					},
				},
				merge: true,
			});
		},
		updateColumnCount(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							'post-column-count': newValue,
						},
					},
				},
				merge: true,
			});
		},
		updatePadding(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							'block-padding': `${newValue}px`,
						},
					},
				},
				merge: true,
			});
		},
		updateGridGapSize(newValue) {
			const key = this.getStyleKey('grid-gap-size');

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							[key]: `${newValue}px`,
						},
					},
				},
				merge: true,
			});
		},
	},
});
</script>
