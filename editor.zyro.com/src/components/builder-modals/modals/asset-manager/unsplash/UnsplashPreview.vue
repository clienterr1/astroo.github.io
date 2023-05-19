<template>
	<div class="unsplash-preview">
		<div class="unsplash-preview__image-container">
			<div
				v-show="isImageLoading"
				class="unsplash-preview__blurhash"
			>
				<canvas ref="blurHashCanvas" />
			</div>

			<img
				v-show="!isImageLoading"
				class="unsplash-preview__image"
				data-qa="chooseimage-preview-unsplashimage"
				:src="imageUrl"
				:data-image-id="imageData.id"
				:alt="imageData.alt_description"
				@load="isImageLoading = false, $emit('image-loaded', imageUrl)"
			>

			<div class="unsplash-preview__image-switcher">
				<ZyroButton
					theme="editor"
					:disabled="isFirstImage"
					title="prev"
					@click="$emit('show-previous-image')"
				>
					<template #icon>
						<ZyroSvgDeprecated
							name="chevron"
							direction="left"
						/>
					</template>
				</ZyroButton>
				<ZyroButton
					theme="editor"
					title="next"
					:disabled="isLastImage"
					@click="$emit('show-next-image')"
				>
					<template #icon>
						<ZyroSvgDeprecated
							name="chevron"
							direction="right"
						/>
					</template>
				</ZyroButton>
			</div>
		</div>

		<div class="accreditation">
			<div class="accreditation__author">
				<img
					class="accreditation__avatar"
					:src="imageData.user.profile_image.small"
					:alt="`${imageData.user.name} unsplash profile image`"
				>
				<span class="accreditation__meta z-body-small">
					{{ $t('builder.assetManagerTabUnsplashBy') }} <a
						class="accreditation__link"
						target="_blank"
						:href="`https://unsplash.com/@${imageData.user.username}?utm_source=builder&utm_medium=referral`"
					>
						{{ imageData.user.name }}
					</a><br>
					{{ imageData.width }} &times; {{ imageData.height }}
				</span>
			</div>
			<span class="accreditation__tos z-body-small">
				<i18n-t keypath="builder.assetManagerTabUnsplashAccreditation">
					<a
						class="z-link"
						href="https://unsplash.com/terms"
						target="_blank"
						rel="noopener noreferrer"
					>
						{{ $t('builder.assetManagerTabUnsplashAccreditationLink') }}
					</a>
				</i18n-t>
			</span>
			<ZyroButton
				theme="primary"
				size="xs"
				color="black"
				data-qa="chooseimage-btn-addtopage"
				@click="$emit('select-image', imageData)"
			>
				{{ isGallery ? $t('builder.assetManagerAddToGallery') : $t('builder.assetManagerAddToPage') }}
			</ZyroButton>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { decode } from 'blurhash';

import { debounce } from '@zyro-inc/site-modules/utils/debounce';
import {
	getCode,
	CODE,
} from '@zyro-inc/site-modules/utils/getCode';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroSvgDeprecated,
	},

	props: {
		imageData: {
			type: Object,
			required: true,
		},
		isLastImage: {
			type: Boolean,
			default: false,
		},
		isFirstImage: {
			type: Boolean,
			default: false,
		},
		isGallery: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'select-image',
		'show-previous-image',
		'show-next-image',
	],

	data() {
		return {
			isImageLoading: true,
			imageUrl: null,
		};
	},

	watch: {
		'imageData.urls.regular': function regularUrlWatcher(newValue) {
			this.setImageUrlDebounced(newValue);
		},
		'imageData.blur_hash': {
			immediate: true,
			handler() {
				this.isImageLoading = true;
				this.drawBlurHash();
			},
		},
	},

	created() {
		window.addEventListener('keydown', this.handleKeyboardNavigation);
		this.setImageUrl(this.imageData.urls.regular);
	},

	unmounted() {
		window.removeEventListener('keydown', this.handleKeyboardNavigation);
	},

	methods: {
		handleKeyboardNavigation(event) {
			if (getCode(event) === CODE.ArrowLeft && !this.isFirstImage) {
				event.preventDefault();
				this.$emit('show-previous-image');

				return;
			}

			if (getCode(event) === CODE.ArrowRight && !this.isLastImage) {
				event.preventDefault();
				this.$emit('show-next-image');
			}
		},
		/**
		 * If user spam clicks the 'next' button img urls will change rapidly
		 * and the browser will try to load them all. There is no way to cancel
		 * those requests. That's why when the image changes we debounce the actual
		 * url change.
		 * Blur hash takes care of the debounced phase, so the user
		 * still sees that the images are being changed.
		 */
		setImageUrlDebounced: debounce(function debounceSetImageUrl(imageUrl) {
			this.setImageUrl(imageUrl);
		}, 250),
		setImageUrl(imageUrl) {
			this.imageUrl = imageUrl;
		},
		/**
		 * Blurhash is provided by unsplash with every image
		 * more info: https://blurha.sh/
		 */
		drawBlurHash() {
			const canvas = this.$refs.blurHashCanvas;

			if (!canvas) {
				return;
			}

			/**
			 * We don't need a large resolution since its
			 * just a blurred image. Small resolution
			 * also decodes faster
			 */
			const RESOLUTION = 32;
			const dimensions = this.getLimitedDimensions(RESOLUTION, this.imageData.width, this.imageData.height);
			const pixels = decode(this.imageData.blur_hash, dimensions.width, dimensions.height);

			canvas.width = dimensions.width;
			canvas.height = dimensions.height;
			const context = canvas.getContext('2d');
			const imageData = context.createImageData(dimensions.width, dimensions.height);

			imageData.data.set(pixels);
			context.putImageData(imageData, 0, 0);
		},
		/**
		 * Returns input dimmensions limited by max width
		 * keeps aspect ratio
		 */
		getLimitedDimensions(maxWidth, width, height) {
			if (width <= maxWidth) {
				return {
					height,
					width,
				};
			}

			const factor = width / maxWidth;
			const realHeight = Math.floor(height / factor);

			return {
				height: realHeight,
				width: maxWidth,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.unsplash-preview {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__blurhash {
		position: relative;
		width: 100%;
		height: 100%;

		canvas {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 32px;
			object-fit: contain;
		}
	}

	&__image-container {
		position: relative;
		height: 100%;
		margin: 0 24px;
		background-color: $color-gray-light;
	}

	&__image-switcher {
		$padding: 16px;

		position: absolute;
		top: 0;
		right: $padding;
		bottom: 0;
		left: $padding;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__image {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 32px;
		object-fit: contain;
	}
}

.accreditation {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 24px;
	border-top: 1px solid $color-gray-border;

	&__link {
		text-decoration: none;
	}

	&__avatar {
		$avatar-size: 40px;

		width: $avatar-size;
		height: $avatar-size;
		margin-right: 16px;
		border-radius: $avatar-size;
		object-fit: cover;
	}

	&__author {
		display: flex;
		margin-right: 16px;
	}

	&__tos {
		margin-right: 16px;

		@media screen and (max-width: $media-mobile) {
			margin-right: 0;
			text-align: center;
		}
	}

	@media screen and (max-width: $media-mobile) {
		flex-direction: column;
		gap: 8px;
	}
}

.fade {
	&--out-leave-active {
		transition: opacity 0.2s ease-out;
	}

	&--out-leave-to {
		opacity: 0;
	}

	&--in-enter-active {
		transition: opacity 0.1s ease-out;
	}

	&--in-enter {
		opacity: 0;
	}
}
</style>
