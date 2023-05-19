<template>
	<div
		:id="id"
		class="instagram-feed"
	>
		<GridInstagramFeedMediaItem
			v-for="mediaItem in media"
			:key="mediaItem.src"
			:src="mediaItem.src"
			:href="mediaItem.href"
			:alt="mediaItem.alt"
			:poster="mediaItem.poster"
		/>
	</div>
</template>

<script>
import GridInstagramFeedMediaItem from './GridInstagramFeedMediaItem.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		GridInstagramFeedMediaItem,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		media: {
			type: Array,
			default: () => [],
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "./common";

.instagram-feed {
	display: grid;
	grid-template-columns: repeat(var(--items-per-row), 1fr);
	grid-auto-rows: 1fr;
	grid-gap: var(--item-gap);
	width: 100%;

	&::before {
		@include instagram-placeholder;

		grid-area: 1/1/1/1;
		padding-bottom: 100%;
		content: "";
	}
}

@include site-engine-mobile {
	.instagram-feed {
		grid-template-columns: repeat(var(--m-items-per-row), 1fr);
		grid-gap: var(--m-item-gap);
	}
}
</style>
