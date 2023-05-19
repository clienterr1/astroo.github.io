<template>
	<div
		class="block-preview"
		:style="blockPreviewContainerStyles"
	>
		<div
			ref="blockPreviewRef"
			class="block-preview__blocks"
			:style="blockPreviewStyles"
		>
			<Block
				v-for="(block, blockId) in blocks"
				:id="blockId"
				:key="blockId"
				class="block-preview__block"
				:data="block"
				:components="siteElements"
				:blocks="siteBlocks"
				is-block-preview-mode
			/>
		</div>
	</div>
</template>

<script setup>
import { useStore } from 'vuex';
import Block from '@/components/block/Block.vue';

import {
	computed,
	ref,
} from 'vue';

import {
	ELEMENT_POSITION_KEY_MOBILE,
	ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

const props = defineProps({
	blocks: {
		type: Array,
		default: () => [],
	},
	siteBlocks: {
		type: Object,
		default: () => ({}),
	},
	siteElements: {
		type: Object,
		default: () => ({}),
	},
	actualItemWidth: {
		type: [
			Number,
			String,
		],
		default: 1400,
	},
	previewItemWidth: {
		type: [
			Number,
			String,
		],
		default: 350,
	},
});

const { getters } = useStore();

const blockPreviewRef = ref(null);

const isMobileMode = computed(() => getters['gui/isMobileMode']);
const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));

const blockPreviewScale = computed(() => props.previewItemWidth / props.actualItemWidth);

const blockPreviewHeight = computed(() => {
	const totalHeightOfBlocks = props.blocks.reduce((acc, block) => {
		// Blog and Online store blocks doesn't have minHeight property
		if (!block[elementPositionKey.value]?.minHeight) {
			return acc + (blockPreviewRef.value?.offsetHeight || 0);
		}

		return acc + block[elementPositionKey.value].minHeight;
	}, 0);

	return totalHeightOfBlocks * blockPreviewScale.value;
});

const blockPreviewStyles = computed(() => ({
	width: `${props.actualItemWidth}px`,
	transform: `scale(${props.previewItemWidth / props.actualItemWidth})`,
}));

const blockPreviewContainerStyles = computed(() => ({
	height: `${blockPreviewHeight.value}px`,
	width: `${props.previewItemWidth}px`,
}));
</script>

<style lang="scss" scoped>
.block-preview {
	&__blocks {
		display: flex;
		flex-direction: column;
		transform-origin: 0 0;
	}

	&__block {
		pointer-events: none;
		user-select: none;

		:deep(.background) {
			z-index: 0;
		}

		/* stylelint-disable-next-line selector-class-pattern */
		:deep(.block-grid-item__component) {
			pointer-events: none;
		}

		:deep(.layout-element) {
			pointer-events: none;
		}

		:deep(.image) {
			@media screen and (max-width: $media-mobile) {
				height: 100%;
			}
		}
	}
}
</style>
