<template>
	<div
		class="product-carousel"
		:class="{ 'product-carousel--left': isGalleryLeft }"
		:style="carouselStyle"
	>
		<div
			ref="carouselRef"
			class="product-carousel__image-wrapper"
			:class="{ 'product-carousel__image-wrapper--contain': imageRatio === 'contain' }"
		>
			<template v-if="isArrowsShown">
				<button
					data-qa="product-carousel-button-prev"
					class="product-carousel__slider-button product-carousel__slider-button--left"
					@click="goToPreviousSlide"
				>
					<span class="product-carousel__arrow product-carousel__arrow--left" />
				</button>
				<button
					data-qa="product-carousel-button-next"
					class="product-carousel__slider-button product-carousel__slider-button--right"
					@click="goToNextSlide"
				>
					<span class="product-carousel__arrow product-carousel__arrow--right" />
				</button>
			</template>
			<Transition
				v-if="images.length"
				:name="`slide-${slideDirection}`"
				mode="out-in"
				class="product-carousel__image-content"
			>
				<ProductImage
					:key="images[currentIndex].url"
					:src="images[currentIndex].url"
					:alt="productTitle"
					class="product-carousel__image product-carousel__main-image"
					:is-eager="isEager"
					:object-fit="imageRatio"
					:width="imageMaxWidth"
					:height="imageMaxWidth"
					enable-srcset
					@click="$emit('image-click', currentIndex)"
				/>
			</Transition>
			<ProductImagePlaceholder
				v-else
				class="product-carousel__image product-carousel__main-image"
			/>
		</div>
		<template v-if="isMoreThanOneImage">
			<div
				v-if="!isQuickPreview"
				class="product-carousel__image-list"
				:class="{ 'product-carousel__image-list-left': isGalleryLeft }"
			>
				<button
					v-if="imageListStartIndex !== 0"
					data-qa="product-carousel-image-button-left"
					class="product-carousel__image-arrow"
					:class="{
						'product-carousel__image-arrow--left': !isGalleryLeft,
						'product-carousel__image-arrow--top': isGalleryLeft
					}"
					@click="moveImageListLeft"
				/>
				<div :class="{ 'product-carousel__image-list-element-wrapper-left': isGalleryLeft }">
					<button
						v-for="(image, index) in thumbnails"
						:key="`image-${index}-${image.url}`"
						class="product-carousel__image-list-element"
						:class="{ 'product-carousel__image-list-element--active': isImageMatch(index) }"
						@click="handleThumbnailClick(index)"
					>
						<ProductImage
							:src="image.url"
							:alt="productTitle"
							class="product-carousel__image"
							:is-eager="isEager"
							:object-fit="imageRatio"
							:site-id="siteId"
							:width="IMAGE_MAX_WIDTH_SMALL_PX"
							:height="IMAGE_MAX_WIDTH_SMALL_PX"
						/>
					</button>
				</div>
				<button
					v-if="isRightImageArrowShown"
					data-qa="product-carousel-image-button-right"
					class="product-carousel__image-arrow"
					:class="{
						'product-carousel__image-arrow--right': !isGalleryLeft,
						'product-carousel__image-arrow--bottom': isGalleryLeft
					}"
					@click="moveImageListRight"
				/>
			</div>
			<div class="product-carousel__dots-wrapper">
				<button
					v-for="(_, index) in images"
					:key="`image-dot-${index}`"
					class="product-carousel__dot-button"
					@click="currentIndex = index"
				>
					<span
						class="product-carousel__dot"
						:class="{ 'product-carousel__dot--active': index === currentIndex }"
					/>
				</button>
			</div>
		</template>
	</div>
</template>

<script>
import { moveDirection } from '@zyro-inc/site-modules/utils/moveDirection';
import ProductImage from '@zyro-inc/site-modules/components/ecommerce/ProductImage.vue';
import ProductImagePlaceholder from '@zyro-inc/site-modules/components/ecommerce/-partials/ProductImagePlaceholder.vue';

import { defineComponent } from 'vue';

const IMAGE_MAX_WIDTH_PX_DEFAULT = 600;
const IMAGE_MAX_WIDTH_PX_LEFT = 528;
const IMAGE_MAX_WIDTH_PX_PREVIEW = 400;
const IMAGE_MAX_WIDTH_SMALL_PX = 64;

export default defineComponent({
	components: {
		ProductImage,
		ProductImagePlaceholder,
	},

	props: {
		images: {
			type: Array,
			required: true,
		},
		productTitle: {
			type: String,
			required: true,
		},
		arrowsColor: {
			type: String,
			default: 'unset',
		},
		navigationThumbnailArrowsColor: {
			type: String,
			default: 'unset',
		},
		galleryPlacement: {
			type: String,
			default: 'left',
		},
		imageRatio: {
			type: String,
			default: 'unset',
		},
		imageBorderRadius: {
			type: String,
			default: 'unset',
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		variantImage: {
			type: String,
			default: null,
		},
		isQuickPreview: {
			type: Boolean,
			default: false,
		},
		isVariantImagePreselected: {
			type: Boolean,
			default: false,
		},
		siteId: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			IMAGE_MAX_WIDTH_SMALL_PX,
			windowWidth: window.innerWidth,
			slideDirection: '',
			currentIndex: 0,
			imageListStartIndex: 0,
		};
	},

	computed: {
		imagePreviewAmount() {
			let amount = 0;

			switch (true) {
			case this.windowWidth < (this.isGalleryLeft ? 920 : 900):
				amount = 4;
				break;
			case this.windowWidth < (this.isGalleryLeft ? 1060 : 1020):
				amount = 5;
				break;
			case this.windowWidth < (this.isGalleryLeft ? 1250 : 1160):
				amount = 6;
				break;
			case this.windowWidth < (this.isGalleryLeft ? 1400 : 1320):
				amount = 7;
				break;
			default:
				amount = this.isGalleryLeft ? 7 : 8;
			}

			if (this.imageListStartIndex !== 0 && this.imageListStartIndex + amount < this.images.length) {
				return amount - 1;
			}

			return amount;
		},
		isGalleryLeft() {
			return this.galleryPlacement === 'left';
		},
		thumbnails() {
			return this.images.slice(this.imageListStartIndex, this.imageListStartIndex + this.imagePreviewAmount);
		},
		isThumbnailVisible() {
			return this.thumbnails.some((image) => image.url === this.images[this.currentIndex].url);
		},
		isArrowsShown() {
			return this.isMoreThanOneImage && !this.isQuickPreview;
		},
		isRightImageArrowShown() {
			if (this.images.length < this.imagePreviewAmount) {
				return false;
			}

			return this.imageListStartIndex + this.imagePreviewAmount < this.images.length;
		},
		isMoreThanOneImage() {
			return this.images.length > 1;
		},
		imageMaxWidth() {
			return this.isQuickPreview ? IMAGE_MAX_WIDTH_PX_PREVIEW : IMAGE_MAX_WIDTH_PX_DEFAULT;
		},
		carouselStyle() {
			return {
				'--image-max-width': `${this.imageMaxWidth}px`,
				'--image-max-width-left': `${IMAGE_MAX_WIDTH_PX_LEFT}px`,
				'--image-max-width-small': `${IMAGE_MAX_WIDTH_SMALL_PX}px`,
				'--image-object-fit': this.imageRatio,
				'--image-border-radius': this.imageRatio === 'cover' ? this.imageBorderRadius : 0,
				// position set to absolute to make image a responsive square on mobile
				'--image-position': this.imageRatio === 'cover' ? 'absolute' : 'relative',
				'--arrow-color': this.arrowsColor,
				'--thumbnail-arrow-color': this.navigationThumbnailArrowsColor,
			};
		},
	},
	watch: {
		variantImage() {
			this.setVariantImage();

			if (!this.isThumbnailVisible) {
				this.presetThumbnailPosition();
			}
		},
	},
	mounted() {
		window.addEventListener('resize', this.resizeEventHandler);

		if (this.isVariantImagePreselected) {
			this.setVariantImage();
		}

		this.enableCarouselMoveEvents(true);
	},

	beforeDestroy() {
		window.removeEventListener('resize', this.resizeEventHandler);

		this.enableCarouselMoveEvents(false);
	},

	methods: {
		resizeEventHandler() {
			this.windowWidth = window.innerWidth;

			if (this.imagePreviewAmount < this.images.length) {
				this.presetThumbnailPosition();
			}
		},
		presetThumbnailPosition() {
			if (this.images.length - this.currentIndex < this.imagePreviewAmount) {
				this.imageListStartIndex = this.images.length - this.imagePreviewAmount;
			} else {
				this.imageListStartIndex = this.currentIndex;
			}
		},
		isImageMatch(thumbnailIndex) {
			return this.thumbnails[thumbnailIndex].url === this.images[this.currentIndex].url;
		},
		handleThumbnailClick(thumbnailIndex) {
			this.currentIndex = this.images.findIndex((image) => image.url === this.thumbnails[thumbnailIndex].url);
		},
		goToNextSlide() {
			this.slideDirection = 'right';
			this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;

			if (!this.isThumbnailVisible) {
				if (this.imageListStartIndex + this.imagePreviewAmount === this.images.length) {
					this.imageListStartIndex = 0;
				} else {
					this.presetThumbnailPosition();

					if (this.imagePreviewAmount !== this.thumbnails.length) {
						this.presetThumbnailPosition();
					}
				}
			}
		},
		goToPreviousSlide() {
			this.slideDirection = 'left';
			this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;

			if (!this.isThumbnailVisible) {
				if (this.imageListStartIndex === 0) {
					this.imageListStartIndex = this.images.length - this.imagePreviewAmount;
				} else {
					this.presetThumbnailPosition();
				}
			}
		},
		moveImageListRight() {
			const beforeAmount = this.imagePreviewAmount;

			this.imageListStartIndex += 1;

			const afterAmount = this.imagePreviewAmount;

			// imagePreviewAmount depends on imageListStartIndex, so when one changes, other needs to be adjusted accordingly
			if (beforeAmount !== afterAmount && this.isRightImageArrowShown) {
				this.moveImageListRight();
			}
		},
		moveImageListLeft() {
			this.imageListStartIndex -= 1;
		},
		enableCarouselMoveEvents(isEnabled) {
			if (!this.isMoreThanOneImage) {
				return;
			}

			const { enableMoveEvents } = moveDirection({
				move: {
					drag: false,
					swipe: true,
				},
				onMoveLeft: () => this.goToNextSlide(),
				onMoveRight: () => this.goToPreviousSlide(),
			});

			enableMoveEvents(isEnabled, this.$refs.carouselRef);
		},
		setVariantImage() {
			const index = this.images.findIndex((image) => image.url === this.variantImage);

			if (index > -1) {
				this.currentIndex = index;
			}
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.product-carousel {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: var(--image-max-width);
	overflow: hidden;

	&--left {
		flex-direction: row-reverse;

		@media screen and (min-width: 920px) {
			height: var(--image-max-width-left);
			max-height: 40vw;
		}
	}

	&__image-wrapper {
		position: relative;
		display: flex;
		width: 100%;
		overflow: hidden;
		transition: height 0.2s ease-in;

		&--contain {
			max-height: var(--image-max-width-left);
			border: 1px solid $color-gray-border;

			@media screen and (max-width: 500px) {
				// to increase specificity
				&#{&} {
					height: 400px;
				}
			}
		}

		// hack to make image a responsive square according to it's width
		&::after {
			display: block;
			padding-bottom: 100%;
			content: "";
		}
	}

	&__image {
		width: 100%;
		object-fit: cover;
		height: 100%;
	}

	&__main-image {
		position: var(--image-position, relative);
		top: 0;
		left: 0;
		cursor: pointer;
		border-radius: var(--image-border-radius, 0);
		object-fit: var(--image-object-fit, cover);
		object-position: center;
	}

	&__image-content {
		z-index: 0;
		flex: 1 0 auto;
		width: 100%;
		overflow: hidden;
		font-size: 2rem;
		font-weight: bold;
	}

	&__arrow {
		display: inline-block;
		width: 48px;
		height: 48px;
		border: 1px solid rgba($color-gray-border, 0.2);
		border-radius: 50%;
		-webkit-tap-highlight-color: transparent;

		&::before {
			position: absolute;
			width: 48px;
			height: 48px;
			content: "";
			background-color: var(--arrow-color, $color-gray-border);
			filter: invert(1);
			border-radius: 50%;
			opacity: 0.2;
		}

		&::after {
			position: relative;
			display: inline-block;
			width: 0.7em;
			height: 0.7em;
			margin-top: 18px;
			margin-right: 0.5em;
			content: "";
			border-top: 0.2em solid var(--arrow-color, $color-dark);
			border-right: 0.2em solid var(--arrow-color, $color-dark);
			transform: rotate(225deg);
		}

		&--left {
			&::before {
				margin-top: -1px;
				margin-left: -1px;
			}

			&::after {
				margin-left: 20px;
			}
		}

		&--right {
			&::before {
				margin-top: -1px;
				margin-left: -18px;
			}

			&::after {
				margin-right: 20px;
				transform: rotate(45deg);
			}
		}
	}

	&__slider-button {
		position: absolute;
		z-index: 1;
		box-sizing: content-box;
		width: 75px;
		height: 100%;
		cursor: pointer;
		background-color: transparent;
		border: 0;
		outline: none;
		-webkit-tap-highlight-color: transparent;

		&--left {
			left: 0;
			padding-left: 20px;
			text-align: left;
		}

		&--right {
			right: 0;
			padding-right: 20px;
			text-align: right;

			&::after {
				transform: rotate(45deg);
			}
		}
	}

	&__image-arrow {
		height: 100%;
		cursor: pointer;
		background-color: transparent;
		-webkit-tap-highlight-color: transparent;

		&::after {
			display: inline-block;
			width: 0.7em;
			height: 0.7em;
			content: "";
			border-top: 0.2em solid var(--thumbnail-arrow-color, $color-dark);
			border-right: 0.2em solid var(--thumbnail-arrow-color, $color-dark);
			transform: rotate(225deg);
		}

		&--left {
			padding-left: 16px;
		}

		&--right {
			padding-right: 18px;

			&::after {
				transform: rotate(45deg);
			}
		}

		&--top {
			height: 50px;
			padding-right: 6px;

			&::after {
				transform: rotate(315deg);
			}
		}

		&--bottom {
			height: 40px;
			padding-right: 6px;

			&::after {
				transform: rotate(135deg);
			}
		}
	}

	&__image-list {
		display: flex;
		justify-content: space-between;
		margin-top: 8px;
		margin-right: -1px;
		margin-left: -3px;
	}

	&__image-list-left {
		flex-direction: column;
		margin: -3px 0 -1px;
	}

	&__image-list-element-wrapper-left {
		display: grid;
		padding-right: 6px;
	}

	&__image-list-element {
		width: var(--image-max-width-small);
		height: var(--image-max-width-small);
		padding: 3px;
		margin: 3px;
		cursor: pointer;
		background-color: transparent;
		opacity: 0.65;
		transition: opacity 0.3s ease-in-out;

		&--active {
			border: 1px solid $color-dark;
			opacity: 1;
		}

		&:last-child {
			margin-right: 1px;
			margin-bottom: 1px;
		}
	}

	&__dots-wrapper {
		position: absolute;
		bottom: 16px;
		z-index: 10;
		display: none;
		align-items: center;
		justify-content: center;
		width: 100%;
		-webkit-tap-highlight-color: transparent;
	}

	&__dot-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		cursor: pointer;
		background: transparent;
		border: none;
	}

	&__dot {
		width: 10px;
		height: 10px;
		background-color: var(--arrow-color, $color-dark);
		border-radius: 100%;
		opacity: 0.5;
		transition: opacity 0.3s ease-in-out;

		&:not(:last-child) {
			margin-right: 6px;
		}

		&--active {
			opacity: 1;
		}
	}
}

@include site-engine-mobile {
	.product-carousel {
		max-width: none;

		&--left {
			@media screen and (min-width: 920px) {
				height: unset !important;
			}
		}

		&__image-list {
			display: none;
		}

		&__dots-wrapper {
			display: flex;
		}

		&__image-wrapper {
			&--contain {
				height: 400px;
			}
		}
	}
}
</style>
