<template>
	<div class="gallery">
		<div
			v-if="isMasonryLayout"
			class="gallery__masonry"
			:style="gridGalleryCSSVars"
		>
			<div
				v-for="(column, columnIndex) in mobileMasonryColumns"
				:key="columnIndex"
				class="gallery__masonry-mobile-columns"
			>
				<GridImage
					v-for="(image, index) in column"
					:key="`${index}${image.src}`"
					class="gallery__masonry-image"
					:alt="image.alt"
					:src="image.src"
					:srcset="image.srcset"
					:sizes="image.sizes"
					:element-width="image.width"
					prevent-drag
					is-eager
					is-unstyled
					:reset-mobile-position="false"
					:is-lightbox-enabled="isLightboxEnabled"
					@image-click="$emit('image-click', image.originalIndex)"
					@image-load="$emit('image-load')"
				/>
			</div>
			<div
				v-for="(column, columnIndex) in masonryColumns"
				:key="columnIndex"
				class="gallery__masonry-desktop-columns"
			>
				<GridImage
					v-for="(image, index) in column"
					:key="`${index}${image.src}`"
					class="gallery__masonry-image"
					:alt="image.alt"
					:src="image.src"
					:srcset="image.srcset"
					:sizes="image.sizes"
					:element-width="image.width"
					prevent-drag
					is-eager
					is-unstyled
					:reset-mobile-position="false"
					:is-lightbox-enabled="isLightboxEnabled"
					@image-click="$emit('image-click', image.originalIndex)"
					@image-load="$emit('image-load')"
				/>
			</div>
		</div>
		<div
			v-else
			class="gallery__grid"
			:style="gridGalleryCSSVars"
		>
			<div
				v-for="(image, index) in gridImages"
				:key="`${index}${image.src}`"
				class="gallery__block"
			>
				<GridImage
					:key="`${index}${image.src}`"
					:alt="image.alt"
					:src="image.src"
					:srcset="image.srcset"
					:sizes="image.sizes"
					:element-width="image.width"
					:element-height="image.height"
					prevent-drag
					:is-lightbox-enabled="isLightboxEnabled"
					:reset-mobile-position="false"
					is-eager
					class="gallery__image"
					@image-click="$emit('image-click', index)"
					@image-load="$emit('image-load')"
				/>
			</div>
		</div>
		<slot />
	</div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import GridImage from '@zyro-inc/site-modules/components/elements/image/GridImage.vue';
import { getMasonryColumns } from '@zyro-inc/site-modules/utils/getMasonryColumns';
import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	name: 'GridGallery',

	components: {
		GridImage,
	},

	props: {
		columnCount: {
			type: Number,
			required: true,
		},
		columnGap: {
			type: Number,
			required: true,
		},
		mobileColumnCount: {
			type: Number,
			required: true,
		},
		mobileColumnGap: {
			type: Number,
			required: true,
		},
		gridImages: {
			type: Array,
			required: true,
		},
		isLightboxEnabled: {
			type: Boolean,
			required: false,
		},
		isMasonryLayout: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['image-load'],

	setup(props) {
		const masonryColumns = computed(() => getMasonryColumns(props.columnCount, props.gridImages));
		const mobileMasonryColumns = computed(() => getMasonryColumns(props.mobileColumnCount, props.gridImages));

		return {
			masonryColumns,
			mobileMasonryColumns,
		};
	},
	computed: {
		gridGalleryCSSVars() {
			return {
				'--column-gap': `${this.columnGap}px`,
				'--column-count': this.columnCount,
				'--m-column-gap': `${this.mobileColumnGap}px`,
				'--m-column-count': this.mobileColumnCount,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.gallery {
	&__grid {
		display: grid;
		grid-template-columns: repeat(var(--column-count), 1fr);
		grid-gap: var(--column-gap);
	}

	&__block {
		position: relative;
		padding-top: 100%;
	}

	// After building css order changes, increase specificity to override styles in final build
	&__image {
		&#{&} {
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	&__masonry {
		display: grid;
		grid-template-columns: repeat(var(--column-count), auto);
		grid-column-gap: var(--column-gap);
		height: calc(100% + var(--column-gap));
		margin-bottom: calc(var(--column-gap) * -1);
	}

	&__masonry-image {
		margin-bottom: var(--column-gap);
	}

	&__masonry-mobile-columns {
		display: none;
	}
}

@include site-engine-mobile {
	.gallery {
		&__grid {
			grid-template-columns: repeat(var(--m-column-count), 1fr);
			grid-gap: var(--m-column-gap);
		}

		&__masonry {
			grid-template-columns: repeat(var(--m-column-count), auto);
			grid-column-gap: var(--m-column-gap);
			height: calc(100% + var(--m-column-gap));
			margin-bottom: calc(var(--m-column-gap) * -1);
		}

		&__masonry-image {
			margin-bottom: var(--m-column-gap);
		}

		&__masonry-desktop-columns {
			display: none;
		}

		&__masonry-mobile-columns {
			display: block;
		}
	}
}
</style>
