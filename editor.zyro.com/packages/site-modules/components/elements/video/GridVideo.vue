<template>
	<div
		class="video"
	>
		<iframe
			v-if="renderIframe"
			:src="src"
			class="video__frame"
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			width="100%"
			height="100%"
			@load="isIframeLoaded = true"
		/>
		<template v-else-if="renderPicture && (jpg || webp)">
			<picture>
				<source
					type="image/webp"
					:srcset="webp"
				>
				<img
					v-qa="'builder-gridelement-gridvideo'"
					referrerpolicy="origin"
					class="video__placeholder"
					height="100%"
					width="100%"
					:src="jpg"
				>
			</picture>
			<button
				type="button"
				:class="`video__play video__play--${provider}`"
			/>
		</template>
	</div>
</template>

<script setup>
import { PROVIDERS } from '@zyro-inc/site-modules/components/elements/video/constants';

import {
	computed,
	ref,
} from 'vue';

defineProps({
	renderIframe: {
		type: Boolean,
		default: false,
	},
	renderPicture: {
		type: Boolean,
		default: true,
	},
	src: {
		type: String,
		required: true,
	},
	provider: {
		type: String,
		default: PROVIDERS.YOUTUBE,
	},
	jpg: {
		type: String,
		default: '',
	},
	webp: {
		type: String,
		default: '',
	},
});

const isIframeLoaded = ref(false);
const backgroundColor = computed(() => (isIframeLoaded.value ? 'transparent' : 'var(--color-dark)'));

</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.video {
	position: relative;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background-color: v-bind(backgroundColor);

	&__frame,
	&__placeholder {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		width: 100%;
		height: 100%;
	}

	&__placeholder {
		object-fit: cover;
	}

	&__play {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 68px;
		height: 48px;
		padding: 0;
		margin-top: -24px;
		margin-left: -34px;
		color: $color-light;
		text-align: center;
		text-indent: 1px;
		background-color: rgb(30 30 30 / 80%);
		border-radius: 15% / 40%;
		transition: background-color 150ms ease-out;

		&::before {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 0;
			height: 0;
			margin-top: -10px;
			margin-left: -9px;
			content: "";
			border-color: transparent transparent transparent $color-light;
			border-style: solid;
			border-width: 10px 0 10px 18px;
		}

		&--vimeo {
			background-color: rgb(30 30 30 / 90%);
			border-radius: 5px;
		}
	}

	&:hover {
		.video {
			&__play {
				background-color: $color-danger;

				&--vimeo {
					background-color: rgb(0 102 153);
				}
			}
		}
	}
}

@include site-engine-mobile {
	.video {
		position: relative;
		padding-top: 56.25%;
	}
}
</style>
