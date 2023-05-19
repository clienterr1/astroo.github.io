<template>
	<div
		class="unsplash"
		:class="{ 'unsplash--preview-open': isPreviewOpen }"
	>
		<UnsplashPreview
			v-if="isPreviewOpen"
			:image-data="previewImage"
			:is-last-image="previewImageIndex === unsplashResultsFiltered.length - 1"
			:is-first-image="previewImageIndex === 0"
			:is-gallery="isGallery"
			@show-previous-image="decreasePreviewImageIndex"
			@show-next-image="increasePreviewImageIndex"
			@select-image="$emit('select-image', $event)"
		/>
		<div
			v-show="!isPreviewOpen"
			class="unsplash__wrapper"
		>
			<ZyroInput
				v-model="searchTerm"
				input-data-qa="chooseimage-inputfield-searchforphotos"
				class="unsplash__search-input"
				:placeholder="$t('builder.assetManagerTabUnsplashSearch')"
				@update:model-value="startUnsplashSearch"
			/>
			<div
				ref="unsplashContainer"
				class="unsplash__container"
				@scroll.passive="loadMoreFromUnsplash"
			>
				<div
					v-if="!isNewSearchRequestPending && !unsplashResultsFiltered.length"
					class="unsplash__no-results"
					data-qa="chooseimage-section-noresults"
				>
					<ZyroSvgDeprecated name="sad-face" />
					<span class="z-h5">
						<i18n-t keypath="builder.assetManagerTabUnsplashNoResults">
							{{ searchTerm }}
						</i18n-t>
					</span>
					<span class="z-body-small unsplash__no-results-bottom-text">
						{{ $t('builder.assetManagerTabUnsplashCheckSpelling') }}
					</span>
				</div>
				<MasonryLayout
					v-else-if="unsplashResultsFiltered.length"
					data-qa="chooseimage-section-freeimages"
					:images="unsplashResultsFiltered"
					:loaded-thumbnails="loadedThumbnails"
					@select-image="setPreviewImageIndex"
					@thumbnail-loaded="loadedThumbnails.push($event)"
				/>
				<div
					v-if="isSearchRequestPending || isNewSearchRequestPending"
					class="loader-wrapper"
				>
					<ZyroLoader
						data-qa="builder-loader"
					/>
				</div>
			</div>
			<div class="unsplash__bottom-bar">
				<ZyroSvgDeprecated name="unsplash" />
			</div>
		</div>
	</div>
</template>

<script>
import ZyroInput from '@/components/global/ZyroInput.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { captureException } from '@sentry/browser';
import { mapState } from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import { ASSET_MANAGER_PLACEHOLDERS_BASE_PATH } from '@zyro-inc/cdn-builder-placeholders/constants';
import { debounce } from '@zyro-inc/site-modules/utils/debounce';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';

import MasonryLayout from '@/components/builder-modals/modals/asset-manager/unsplash/MasonryLayout.vue';
import UnsplashPreview from '@/components/builder-modals/modals/asset-manager/unsplash/UnsplashPreview.vue';

import { searchImages } from '@/api/UnsplashApi';
import { ASSET_MANAGER_MEDIA_PLACEHOLDERS } from '@/data';
import {
	NOTIFICATION_TYPE_RENDERLESS,
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'UnsplashLayout',

	components: {
		ZyroInput,
		ZyroSvgDeprecated,
		ZyroLoader,
		MasonryLayout,
		UnsplashPreview,
	},

	props: {
		isPreviewOpen: {
			type: Boolean,
			required: true,
		},
		isGallery: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['toggle-preview'],

	data() {
		return {
			loadedThumbnails: [],
			isSearchRequestPending: false,
			isNewSearchRequestPending: false,
			previewImageIndex: -1,
			unsplashResponse: {
				results: ASSET_MANAGER_MEDIA_PLACEHOLDERS.map((placeholder) => {
					const imagePath = `${ASSET_MANAGER_PLACEHOLDERS_BASE_PATH}/${placeholder.id}.jpeg`;

					return {
						...placeholder,
						urls: {
							raw: imagePath,
							regular: getOptimizedSrc('other', imagePath, this.websiteId, {
								width: 1080,
							}),
							thumb: getOptimizedSrc('other', imagePath, this.websiteId, {
								width: 280,
							}),
						},
					};
				}),
			},
			searchTerm: '',
			scrollTop: 0,
			currentPage: 0,
		};
	},

	computed: {
		...mapState(['websiteId']),
		// Unsplash returns a lot of stuff, this is easier to debug in vue tools
		unsplashResultsFiltered() {
			if (!this.unsplashResponse?.results) {
				return [];
			}

			if (this.unsplashResponse?.results?.errors?.length > 0) {
				this.notify({
					origin: this.$options.name,
					messageI18nKeyPath: 'builder.errorWhileLoadingUnsplashImage',
				});

				return [];
			}

			return this.unsplashResponse.results
				.map((image) => ({
					urls: image.urls,
					id: image.id,
					user: image.user,
					width: image.width,
					height: image.height,
					blur_hash: image.blur_hash,
					alt_description: image.alt_description,
					// Used by download endpoint
					links: image.links,
				}));
		},
		previewImage() {
			if (!this.isPreviewOpen) {
				return null;
			}

			return this.unsplashResultsFiltered[this.previewImageIndex];
		},
	},

	watch: {
		async isPreviewOpen(newValue) {
			if (!newValue) {
				// Wait for unsplash container to be rendered again
				await this.$nextTick();
				// Reset scroll position back
				this.$refs.unsplashContainer.scrollTo(0, this.scrollTop);
			}
		},
	},

	methods: {
		...mapActionsNotifications({
			notify: NOTIFY,
		}),
		/**
		 * Used for initial new keyword search
		 * TODO: Add immediate mode for deobunce, so we can use 'enter' key
		 * to trigger search instantly
		 */
		startUnsplashSearch: debounce(async function debouncedFunction() {
			if (!this.searchTerm) {
				return;
			}

			this.unsplashResponse.results = [];
			this.loadedThumbnails = [];
			this.currentPage = 1;
			this.isNewSearchRequestPending = true;
			try {
				this.unsplashResponse = await searchImages(
					{
						query: this.searchTerm,
						page: this.currentPage,
					},
				);
			} catch (error) {
				this.notify({
					origin: this.$options.name,
					messageI18nKeyPath: 'builder.errorWhileSearchingImages',
				});

				captureException(error);
			} finally {
				this.isNewSearchRequestPending = false;
			}
		}, 500),
		async loadMoreFromUnsplash(isPreviewMode = false) {
			const { unsplashContainer } = this.$refs;

			if (!unsplashContainer) {
				return;
			}

			// This function should only be responsible for loading more images,
			// but it is convenient to update this value here
			this.scrollTop = unsplashContainer.scrollTop;

			// When less than 1400px is left to scroll, load more images
			const scrollThreshold = unsplashContainer.offsetHeight + this.scrollTop + 1400;
			const scrollThresholdReached = scrollThreshold > unsplashContainer?.scrollHeight;

			if (
				// Dont load if random images are loaded or there is no search term
				!this.searchTerm
				// Dont load more if last page
				|| this.unsplashResponse.total_pages <= this.currentPage
				// Dont load more if previous request is still pending
				|| this.isSearchRequestPending
				// Dont load if user hasn't scrolled enough, ignored in preview mode
				|| (!scrollThresholdReached && !isPreviewMode)
				// Dont load more if previous set of images hasn't loaded, ignored in preview mode
				|| ((this.loadedThumbnails.length < this.unsplashResultsFiltered.length) && !isPreviewMode)
			) {
				return;
			}

			this.currentPage += 1;

			/**
			 * Flag for request still loading is needed because
			 * code above will still pass conditionals after request is started
			 * and the function will request even more images till previous request isn't completed
			 */
			this.isSearchRequestPending = true;
			try {
				const unsplashResponse = await searchImages(
					{
						query: this.searchTerm,
						page: this.currentPage,
					},
				);

				// Merge results
				this.unsplashResponse.results = [
					...this.unsplashResponse.results,
					...unsplashResponse.results,
				];

				if (unsplashResponse.results.length === 0) {
					this.currentPage = this.unsplashResponse.total_pages;
				}
			} catch (error) {
				this.notify({
					type: NOTIFICATION_TYPE_RENDERLESS,
					origin: this.$options.name,
					messageI18nKeyPath: 'builder.errorWhileLoadingImages',
				});

				captureException(error);
			} finally {
				this.isSearchRequestPending = false;
			}
		},
		increasePreviewImageIndex() {
			this.setPreviewImageIndex(this.previewImageIndex + 1);
		},
		decreasePreviewImageIndex() {
			this.setPreviewImageIndex(this.previewImageIndex - 1);
		},
		setPreviewImageIndex(index) {
			this.previewImageIndex = index;
			// Load more images if second to last image is opened
			if (index >= this.unsplashResultsFiltered.length - 2) {
				this.loadMoreFromUnsplash(true);
			}

			this.$emit('toggle-preview', index !== -1);
		},
	},
});
</script>

<style lang="scss" scoped>
.unsplash {
	height: 100%;

	&--preview-open {
		// Account for back button height in safari
		height: calc(100% - 48px);
	}

	&__wrapper {
		display: flex;
		flex-direction: column;

		// Account for navigation height
		height: calc(100% - 34px);
		padding: 0 24px;
		overflow: hidden;
	}

	&__container {
		// Fill space even if there is no images
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: auto;
	}

	&__no-results {
		display: grid;
		grid-gap: 10px;
		justify-items: center;
		margin: auto;
	}

	&__no-results-bottom-text {
		color: $color-gray;
	}

	&__bottom-bar {
		padding: 24px;

		:deep(svg) {
			display: block;
			margin-left: auto;
		}

		@media screen and (max-width: $media-mobile) {
			padding: 8px 16px 45px;
		}
	}

	&__search-input {
		margin: 8px 0 16px;

		@media screen and (max-width: $media-mobile) {
			margin: 4px 0 8px;

			:deep(.zyro-input__input) {
				padding: 8px;
			}
		}
	}
}

.loader-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
</style>
