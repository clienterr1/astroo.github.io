<template>
	<!--
	TODO: Probably could be reusable for more places.
	Figure out where it could be placed and how much reusability can it give.
	-->
	<div class="overlay">
		<ZyroButton
			class="overlay__button"
			theme="editor"
			@click="$emit('overlay-button-click', post)"
		>
			{{ $t('common.editPost') }}
		</ZyroButton>
	</div>
</template>

<script>

import ZyroButton from '@/components/global/ZyroButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockBlogListItemOverlay',

	components: {
		ZyroButton,

	},

	props: {
		post: {
			type: Object,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.overlay {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	cursor: default;
	background: rgb(0 0 0 / 15%);
	opacity: 0;
	transition: opacity 0.3s;

	&:hover {
		opacity: 1;
	}
}
</style>
