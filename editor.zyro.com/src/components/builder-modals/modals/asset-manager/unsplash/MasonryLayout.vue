<template>
	<div
		class="masonry"
		:style="masonryCSSVars"
	>
		<div
			v-for="(column, columnIndex) in masonryColumns"
			:key="columnIndex"
		>
			<img
				v-for="(image) in column"
				:key="`image-${image.id}`"
				class="masonry__image"
				data-qa="chooseimage-unsplashimage"
				:src="image.urls.thumb"
				@click="$emit('select-image', image.originalIndex)"
				@load="$emit('thumbnail-loaded', image.id)"
			>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { getMasonryColumns } from '@zyro-inc/site-modules/utils/getMasonryColumns';

const MASONRY_COLUMN_COUNT = 4;

export default defineComponent({
	props: {
		images: {
			type: Array,
			required: true,
		},
	},
	computed: {
		masonryColumns() {
			return getMasonryColumns(MASONRY_COLUMN_COUNT, this.images);
		},
		masonryCSSVars() {
			return {
				'--masonry-column-count': MASONRY_COLUMN_COUNT,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.masonry {
	$masonry-column-gap: 8px;

	display: grid;
	grid-template-columns: repeat(var(--masonry-column-count), auto);
	grid-column-gap: $masonry-column-gap;
	height: calc(100% + $masonry-column-gap);
	margin-bottom: $masonry-column-gap;

	@media screen and (max-width: $media-mobile) {
		grid-template-columns: repeat(var(--masonry-column-count), 24%);
		width: 100%;
	}

	&__image {
		width: 100%;
		margin-bottom: $masonry-column-gap;
		cursor: pointer;
	}
}
</style>
