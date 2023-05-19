<template>
	<figure>
		<video
			v-if="src.includes('video') || src.includes('.mp4')"
			:src="src"
			:poster="poster"
			class="media-item"
			controls
			@progress.once="$emit('media-load')"
		/>
		<img
			v-else
			:src="src"
			:alt="alt"
			class="media-item"
			@load="$emit('media-load')"
		>
	</figure>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		src: {
			type: String,
			default: null,
		},
		alt: {
			type: String,
			default: null,
		},
		poster: {
			type: String,
			default: null,
		},
	},

	emits: ['media-load'],
});
</script>

<style lang="scss" scoped>
.media-item {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	font-size: 0; // hide alt text in loading state
	background-color: $color-gray-border;
	object-fit: cover;
}
</style>
