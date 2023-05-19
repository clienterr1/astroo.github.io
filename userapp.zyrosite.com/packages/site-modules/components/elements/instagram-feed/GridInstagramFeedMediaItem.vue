<template>
	<div
		class="media-wrapper"
		:[DATA_ATTRIBUTE_ANIMATION_ROLE]="DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE"
		:class="{ 'loaded': isLoaded }"
	>
		<a
			v-if="src && href"
			title="Open instagram page of this image"
			:href="href"
			rel="noopener"
			target="_blank"
		>
			<GridInstagramFeedMediaItemFigure
				:src="src"
				:alt="alt"
				:poster="poster"
				@media-load="isLoaded = true"
			/>
		</a>
		<div v-else-if="src && !href">
			<GridInstagramFeedMediaItemFigure
				:src="src"
				:alt="alt"
				:poster="poster"
				@media-load="isLoaded = true"
			/>
		</div>
		<div
			v-else
			class="placeholder"
		/>
	</div>
</template>

<script>
import GridInstagramFeedMediaItemFigure from './GridInstagramFeedMediaItemFigure.vue';
import {
	DATA_ATTRIBUTE_ANIMATION_ROLE,
	DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE,
} from '@zyro-inc/site-modules/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		GridInstagramFeedMediaItemFigure,
	},

	props: {
		src: {
			type: String,
			default: null,
		},
		alt: {
			type: String,
			default: null,
		},
		href: {
			type: String,
			default: null,
		},
		poster: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			DATA_ATTRIBUTE_ANIMATION_ROLE,
			DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE,
			isLoaded: false,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "./common";

.media-wrapper {
	position: relative;

	&:first-child {
		grid-area: 1/1/1/1;
	}
}

.placeholder:last-child {
	@include instagram-placeholder;

	display: none;
}
</style>
