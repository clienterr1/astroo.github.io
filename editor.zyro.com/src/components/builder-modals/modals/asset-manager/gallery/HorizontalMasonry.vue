<template>
	<div
		class="horizontal-masonry"
		:class="{ 'horizontal-masonry--has-moving-image' : movedImageIndex !== -1 }"
	>
		<UserImage
			v-for="(image, key, index) in images"
			:id="key"
			:key="`image-${key}`"
			v-qa="'gallerymanager-image'"
			:style="getImageStyle(image, index)"
			:class="{
				'horizontal-masonry__image-container--is-moved': index === movedImageIndex,
				[`horizontal-masonry__image-container--indicator-${indicatorPosition}`]:
					index === hoveredImageIndex
			}"
			:src="image.urlBase64 || image.url"
			:is-fresh-upload="!!image.urlBase64"
			:load-percentage="image.transferProgress"
			@cancel-upload="$emit('cancel-upload', $event)"
			@mousedown="isImageMovable(image) ? startMovingImage($event, index) : null"
			@mousemove="movedImageIndex !== -1 ? onHoverMovingImageOverImage($event, index) : null"
		>
			<div
				class="horizontal-masonry__overlay horizontal-masonry__gallery-overlay"
			>
				<div class="horizontal-masonry__gallery-overlay-icons">
					<span class="z-body-small z-body-small--strong horizontal-masonry__gallery-overlay-index">
						{{ index + 1 }}
					</span>
					<ZyroButton
						v-if="isImageMovable(image)"
						class="horizontal-masonry__gallery-overlay-cancel"
						theme="editor"
						data-qa="gallerymanager-btn-delete"
						:title="$t('common.delete')"
						@mousedown.stop
						@click="$emit('remove-from-gallery', index)"
					>
						<template #icon>
							<Icon
								name="delete"
								dimensions="16px"
							/>
						</template>
					</ZyroButton>
				</div>
			</div>
		</UserImage>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import UserImage from '@/components/builder-modals/modals/asset-manager/UserImage.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		UserImage,
	},

	props: {
		images: {
			type: Object,
			required: true,
		},
		selectedImageKeys: {
			type: Array,
			default: () => [],
		},
	},
	emits: ['move-image'],

	data() {
		return {
			movedImageIndex: -1,
			hoveredImageIndex: -1,
			indicatorPosition: null,
			startMouseCoordinates: {
				x: 0,
				y: 0,
			},
			mousePositionDifference: {
				x: 0,
				y: 0,
			},
		};
	},

	computed: {
		movedImageOffset() {
			return {
				'--x': `${this.mousePositionDifference.x}px`,
				'--y': `${this.mousePositionDifference.y}px`,
			};
		},
		nonMovedImageStyle() {
			return {
				'--cursor': this.movedImageIndex === -1 ? 'grab' : 'move',
			};
		},
	},

	methods: {
		getImageStyle(image, index) {
			if (!this.isImageMovable(image)) {
				return '';
			}

			return index === this.movedImageIndex ? this.movedImageOffset : this.nonMovedImageStyle;
		},
		resetState() {
			this.movedImageIndex = -1;
			this.hoveredImageIndex = -1;
			this.indicatorPosition = null;
			this.startMouseCoordinates = {
				x: 0,
				y: 0,
			};
			this.mousePositionDifference = {
				x: 0,
				y: 0,
			};
		},
		onHoverMovingImageOverImage(event, index) {
			const addToLeft = event.currentTarget.getBoundingClientRect().left
			+ (event.currentTarget.clientWidth / 2) > event.clientX;

			this.hoveredImageIndex = index;
			this.indicatorPosition = addToLeft ? 'left' : 'right';
		},
		isImageMovable(image) {
			return image.url && !image.urlBase64;
		},
		startMovingImage(event, index) {
			this.movedImageIndex = index;
			this.startMouseCoordinates = {
				x: event.clientX,
				y: event.clientY,
			};
			window.addEventListener('mousemove', this.moveImage);
			window.addEventListener('mouseup', this.stopMovingImage);
		},
		moveImage(event) {
			this.mousePositionDifference = {
				x: event.clientX - this.startMouseCoordinates.x,
				y: event.clientY - this.startMouseCoordinates.y,
			};
		},
		stopMovingImage() {
			const movedToLeftSideOfRightImage = this.movedImageIndex + 1 === this.hoveredImageIndex && this.indicatorPosition === 'left';
			const movedToRightSideOfImageLeft = this.movedImageIndex - 1 === this.hoveredImageIndex && this.indicatorPosition === 'right';

			if (this.hoveredImageIndex !== -1
				&& !movedToRightSideOfImageLeft
				&& !movedToLeftSideOfRightImage) {
				/**
				 * Add 1 if visual indicator is on the right,
				 * if we don't the dragged image will appear to the left
				 */
				let newIndex = this.hoveredImageIndex + (this.indicatorPosition === 'right' ? 1 : 0);

				// If image is moved to right substract index to correct placement, not sure why
				newIndex += this.movedImageIndex < this.hoveredImageIndex ? -1 : 0;
				this.$emit('move-image', {
					oldIndex: this.movedImageIndex,
					newIndex,
				});
			}

			this.resetState();
			window.removeEventListener('mousemove', this.moveImage);
			window.removeEventListener('mouseup', this.stopMovingImage);
		},
	},
});
</script>

<style lang="scss" scoped>
.horizontal-masonry {
	$this: &;

	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 5px;
	align-content: flex-start;

	// Substract top bar and title height
	height: calc(100% - 106px);
	padding: 2px 4px;
	overflow-x: hidden;
	overflow-y: auto;
	user-select: none;

	&__gallery-overlay-cancel {
		opacity: 0;
		transition: opacity 0.1s $transition-timing-easing-standard;
	}

	&--has-moving-image {
		cursor: move;

		.horizontal-masonry {
			&__gallery-overlay-cancel {
				visibility: hidden;
			}
		}
	}

	&__gallery-overlay-icons {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px;
	}

	&__gallery-overlay-index {
		padding: 0 8px;
		background: $color-light;

		// Fully round
		border-radius: 10px;
	}

	&__overlay {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		transition: opacity 0.1s $transition-timing-easing-standard;

		&:hover {
			.horizontal-masonry {
				&__gallery-overlay-cancel {
					opacity: 1;
				}
			}
		}
	}

	&__image-container {
		&--is-moved {
			z-index: 99;
			pointer-events: none;
			opacity: 0.5;
			transition: opacity 0.1s $transition-timing-easing-standard;
			transform: translate(var(--x, 0), var(--y, 0));
		}

		&--indicator-left {
			box-shadow: -1px 0 0 0 $color-light, -4px 0 0 0 $color-azure;
		}

		&--indicator-right {
			box-shadow: 1px 0 0 0 $color-light, 4px 0 0 0 $color-azure;
		}
	}
}
</style>
