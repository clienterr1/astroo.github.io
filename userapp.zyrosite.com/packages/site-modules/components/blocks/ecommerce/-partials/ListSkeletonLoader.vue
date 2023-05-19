<template>
	<div class="skeleton-loader">
		<div
			v-for="index in columnCount"
			:key="index"
			class="skeleton-loader__item"
		>
			<div class="skeleton-loader__image-placeholder" />
			<div class="skeleton-loader__text" />
			<div class="skeleton-loader__text" />
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		columnCount: {
			type: Number,
			default: 3,
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "./shared";

.skeleton-loader {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--image-max-width), 1fr));
	gap: 24px;
	width: 100%;
	max-width: var(--content-width);

	&__item {
		display: flex;
		flex-direction: column;
	}

	&__image-placeholder {
		position: relative;
		display: flex;
		width: 100%;

		// variable defined in parent component
		height: var(--image-max-width);
		padding-bottom: 100%;
		overflow: hidden;
		transition: height 0.2s ease-in;
	}

	&__image-placeholder,
	&__text {
		@include skeleton-loader-animation;

		border-radius: 5px;
	}

	&__text {
		width: 100%;
		height: 24px;
		margin-top: 8px;

		&:nth-child(3) {
			width: calc(100% - 120px);
		}
	}
}

@mixin product-list-mobile {
	.skeleton-loader {
		grid-template-columns: 1fr;
	}
}

@include site-engine-mobile {
	.skeleton-loader {
		&__image-placeholder {
			height: 100%;
		}
	}
}

@media screen and (max-width: 700px) {
	@include product-list-mobile;
}
</style>
