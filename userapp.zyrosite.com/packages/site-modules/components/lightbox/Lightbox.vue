<template>
	<Transition
		name="fade"
		appear
	>
		<div
			v-if="isLightboxOpen"
			class="lightbox"
			role="dialog"
			aria-modal="true"
		>
			<button
				class="lightbox__button lightbox__button--close"
				title="close-ligthbox-button"
				data-lightbox-button
				@click="closeLightbox"
			/>
			<div class="lightbox__container">
				<div
					class="lightbox__nav"
					:class="{
						'lightbox__nav--multiple': isImageGalleryMode,
						'lightbox__nav--single': !isImageGalleryMode,
					}"
					data-lightbox-nav
					@click="goToPreviousImage"
				>
					<button
						class="lightbox__button lightbox__button--nav lightbox__button--prev"
						data-lightbox-button
					/>
				</div>
				<Transition
					name="fade"
					mode="out-in"
				>
					<img
						:key="`${currentLightboxImage.src}${currentLightboxImageIndex}`"
						ref="lightboxRef"
						class="lightbox__image"
						:class="{
							'lightbox__image--multiple': isImageGalleryMode,
							'lightbox__image--single': !isImageGalleryMode,
						}"
						:src="currentLightboxImage.src"
						:alt="currentLightboxImage.alt"
					>
				</Transition>
				<div
					class="lightbox__nav"
					:class="{
						'lightbox__nav--multiple': isImageGalleryMode,
						'lightbox__nav--single': !isImageGalleryMode,
					}"
					data-lightbox-nav
					@click="goToNextImage"
				>
					<button
						data-lightbox-button
						class="lightbox__button lightbox__button--nav lightbox__button--next"
					/>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script>
import {
	disableBodyScroll,
	clearAllBodyScrollLocks,
} from 'body-scroll-lock';
import {
	onBeforeUnmount,
	onMounted,
	ref,
	defineComponent,
} from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useLightbox } from '@zyro-inc/site-modules/components/lightbox/useLightbox';
import { moveDirection } from '@zyro-inc/site-modules/utils/moveDirection';

export default defineComponent({
	name: 'Lightbox',

	setup() {
		const {
			lightboxImages,
			currentLightboxImageIndex,
			currentLightboxImage,
			closeLightbox,
			isLightboxOpen,
			isFirstImage,
			isLastImage,
			isImageGalleryMode,
			onLightboxClickOutside,
			handleLightboxNav,
			goToNextImage,
			goToPreviousImage,
		} = useLightbox();

		const lightboxRef = ref(null);

		const { enableMoveEvents } = moveDirection({
			move: {
				drag: true,
				swipe: true,
			},
			onMoveLeft: goToNextImage,
			onMoveRight: goToPreviousImage,
		});

		onMounted(() => {
			onClickOutside(lightboxRef, (event) => {
				if (!event.target.matches('[data-lightbox-button],[data-lightbox-nav]')) {
					closeLightbox();
				}
			});

			enableMoveEvents();
			window.document.addEventListener('keydown', handleLightboxNav);
		});

		onBeforeUnmount(() => {
			closeLightbox();
			enableMoveEvents(false);
			document.removeEventListener('keydown', handleLightboxNav);
		});

		return {
			lightboxImages,
			currentLightboxImageIndex,
			currentLightboxImage,
			closeLightbox,
			isImageGalleryMode,
			isFirstImage,
			isLastImage,
			isLightboxOpen,
			onLightboxClickOutside,
			goToNextImage,
			goToPreviousImage,
			lightboxRef,
		};
	},

	async mounted() {
		await this.$nextTick();
		disableBodyScroll(this.$refs.lightboxRef);
	},

	beforeUnmount() {
		clearAllBodyScrollLocks();
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

$button-hover-background: rgba($color-light, 0.2);

.lightbox {
	$this: &;

	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: $z-index-site-engine-overlay;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: rgba($color-dark, 0.8);

	&__button {
		position: relative;
		display: flex;
		width: 52px;
		height: 52px;
		color: $color-gray-light;
		cursor: pointer;
		background-color: transparent;
		transition: background-color ease 0.2s;

		&:hover,
		&:focus-visible {
			background-color: $button-hover-background;
		}

		&--close {
			position: absolute;
			top: 0;
			right: 0;

			&::before,
			&::after {
				position: absolute;
				top: 25px;
				left: 16px;
				width: 20px;
				height: 2px;
				content: "";
				background-color: currentColor;
				border-radius: 2px;
			}

			&::before {
				transform: rotate(45deg);
			}

			&::after {
				transform: rotate(-45deg);
			}
		}

		&--nav {
			&::before {
				position: absolute;
				top: 20px;
				left: 20px;
				width: 14px;
				height: 14px;
				content: "";
				border-bottom: solid 2px currentColor;
				border-left: solid 2px currentColor;
				border-radius: 2px;
				transform: rotate(45deg);
			}
		}

		&--next {
			transform: rotate(180deg);
		}
	}

	&__container {
		display: flex;
		width: 100%;
	}

	&__nav {
		display: flex;
		flex: 0 1 10%;
		align-items: center;
		justify-content: center;
		background-color: transparent;

		&--single {
			display: none;
		}

		@include site-engine-mobile {
			display: none;
		}
	}

	&__image {
		position: relative;
		flex: 0 0 80%;
		max-width: 80%;
		max-height: 90vh;
		padding: 0;
		margin: auto;
		text-align: center;
		object-fit: contain;

		&--single {
			flex: none;
			max-width: 100%;
		}

		@include site-engine-mobile {
			max-width: 100%;

			&--multiple {
				cursor: grab;
			}

			&--multiple:active {
				cursor: grabbing;
			}
		}
	}
}
</style>
