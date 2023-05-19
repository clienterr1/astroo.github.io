<template>
	<GridImage
		ref="image"
		class="image"
		:src="src"
		:alt="data.settings.alt"
		:reset-mobile-position="resetMobilePosition"
		prevent-drag
		:crop-css-vars="cropCSSVars"
		:is-overflow-visible="croppedImageId === id"
		is-eager
		is-in-builder
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_IMAGE"
		@mousedown="startMovingCropArea"
		@image-load="addImageDimensionsToJson"
	>
		<svg
			v-if="croppedImageId === id"
			:style="overlayCSSVars"
			fill="white"
			class="overlay"
		>
			<path :d="pathDefinition" />
		</svg>
	</GridImage>
</template>

<script>
import {
	mapActions,
	mapState,
	useStore,
} from 'vuex';
import {
	computed,
	ref,
	defineComponent,
	watch,
} from 'vue';

import { debounce } from '@zyro-inc/site-modules/utils/debounce';
import GridImage from '@zyro-inc/site-modules/components/elements/image/GridImage.vue';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';

import { useDrag } from '@/use/useDrag';
import { useCropImage } from '@/components/layout-element/useCropImage';
import {
	useGridImage,
	MAX_WIDTH,
} from '@zyro-inc/site-modules/components/elements/image/useGridImage';
import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';
import { getImageResolution } from '@zyro-inc/site-modules/utils/getImageResolution';
import { onClickOutside } from '@/utils/onClickOutside';
import { DATA_SELECTOR_IMAGE_PROVIDER } from '@/constants';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_IMAGE,
	LINK_TYPE_INTERNAL,
} from '@zyro-inc/site-modules/constants';
import { getPagePathFromId } from '@zyro-inc/site-modules/utils/page/getPagePathFromId';

export default defineComponent({
	name: 'GridImageProviderBuilder',

	components: {
		GridImage,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		renderedPosition: {
			type: Object,
			default: null,
		},
		resetMobilePosition: {
			type: Boolean,
			default: true,
		},
	},

	setup(props, context) {
		// #region Store
		const {
			state,
			dispatch,
			getters,
		} = useStore();

		const isMobileMode = computed(() => getters['gui/isMobileMode']);
		const currentElementId = computed(() => getters.currentElementId);
		const isLayoutOnly = computed(() => getters['flags/isLayoutOnly']);

		// #endregion

		// #region Composables
		const {
			startDragging,
			hasMouseMoved,
			isDragging,
			mouseDeltaX,
			mouseDeltaY,
		} = useDrag();

		const siteData = computed(() => state.website);
		const locale = computed(() => state.currentLocale);

		const {
			cropCSSVars,
			desktopCropParams,
			mobileCropParams,
			desktopTop,
			mobileTop,
			desktopTopPercentWithOffset,
			desktopLeft,
			mobileLeft,
			desktopLeftPercentWithOffset,
		} = useGridImage(props, context, {
			mouseDeltaY,
			mouseDeltaX,
			href: computed(() => {
				if (props.data.linkType === LINK_TYPE_INTERNAL) {
					return getPagePathFromId({
						siteData: siteData?.value,
						pageId: props.data.linkedPageId,
						locale: locale?.value,
					});
				}

				return props.data.href;
			}),
		});

		const {
			croppedImageId,
			exitCropMode,
		} = useCropImage();
		// #endregion

		// #region General data
		const elementPosition = computed(() => props.renderedPosition || props.data.desktop);

		// Wrappers are used cause later we will return this based on if its mobile mode or not
		const cropParams = computed(() => (isMobileMode.value ? mobileCropParams.value : desktopCropParams.value));
		const currentLeft = computed(() => (isMobileMode.value ? mobileLeft.value : desktopLeft.value));
		const currentTop = computed(() => (isMobileMode.value ? mobileTop.value : desktopTop.value));
		// For now we only allow cropping on desktop
		const cropData = computed(() => props.data.desktop.crop);
		// #endregion

		// #region Focal point moving
		const updateCropData = () => {
			dispatch('mergeElementData', {
				elementId: props.id,
				elementData: {
					desktop: {
						crop: {
							left: desktopLeftPercentWithOffset.value,
							top: desktopTopPercentWithOffset.value,
						},
					},
				},
			});
		};

		const addDefaultCropData = () => {
			// Add default crop data only if it doesn't exist
			if (cropData.value || !isLayoutOnly.value) {
				return;
			}

			dispatch('mergeElementData', {
				elementId: props.id,
				elementData: {
					desktop: {
						crop: {
							scale: 1,
							left: 50,
							top: 50,
						},
					},
				},
			});
		};

		const startMovingCropArea = (e) => {
			if (croppedImageId.value !== props.id) {
				return;
			}

			e.stopPropagation();

			startDragging({
				onDragEnd: updateCropData,
			});
		};

		// #endregion

		// #region Crop overlay
		const pathDefinition = computed(() => {
			const {
				width,
				height,
			} = elementPosition.value;

			const {
				imageWidth,
				imageHeight,
				left,
				top,
			} = cropParams.value;

			const x = Math.abs(left);
			const y = Math.abs(top);

			return `M${imageWidth},${imageHeight}\
					H0\
					V0\
					H${imageWidth}\
					V${imageHeight}\
					Z\
					M${x},${y}\
					a0,0,0,0,0-0,0\
					V${height + y}\
					a0,0,0,0,0,0,0\
					H${width + x}\
					a0,0,0,0,0,0-0\
					V${y}\
					a0,0,0,0,0-0-0\
					Z`;
		});

		const overlayCSSVars = computed(() => {
			const {
				imageWidth,
				imageHeight,
			} = cropParams.value;

			return {
				'--overlay-width': `${imageWidth}px`,
				'--overlay-height': `${imageHeight}px`,
				'--overlay-left': `${currentLeft.value}px`,
				'--overlay-top': `${currentTop.value}px`,
			};
		});
		// #endregion

		const image = ref(null);

		onClickOutside({
			target: image,
			preventSelector: DATA_SELECTOR_IMAGE_PROVIDER,
		}, () => {
			if (!croppedImageId.value) return;

			exitCropMode();
		});

		watch(croppedImageId, (newId) => {
			if (newId === props.id) {
				addDefaultCropData();
			}
		});

		watch(currentElementId, (newCurrentElementId) => {
			if (newCurrentElementId !== props.id) {
				exitCropMode();
			}
		});

		return {
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_IMAGE,
			startDragging,
			hasMouseMoved,
			isDragging,
			mouseDeltaX,
			mouseDeltaY,
			croppedImageId,
			cropParams,
			desktopTop,
			desktopLeft,
			pathDefinition,
			overlayCSSVars,
			cropCSSVars,
			cropData,
			elementPosition,
			desktopTopPercentWithOffset,
			desktopLeftPercentWithOffset,
			startMovingCropArea,
			exitCropMode,
			image,
			isLayoutOnly,
			addDefaultCropData,
		};
	},

	computed: {
		...mapState(['websiteId']),
		src() {
			return getOptimizedSrc(this.data.settings.origin, this.data.settings.path, this.websiteId, {
				isLossless: true,
				width: MAX_WIDTH,
				shouldContain: true,
			});
		},
		fullSizeSrc() {
			return getImageSrc(this.data.settings.origin, this.data.settings.path, this.websiteId);
		},
	},

	methods: {
		...mapActions(['mergeElementData']),
		...mapActions('saving', ['saveWebsite']),

		saveWebsiteDebounced: debounce(function saveSite() {
			this.saveWebsite();
		}, 1000),
		async addImageDimensionsToJson() {
			// Full resolution is needed to calculate offsets for cloudflare
			const {
				naturalWidth: fullResolutionWidth,
				naturalHeight: fullResolutionHeight,
			} = await getImageResolution(this.fullSizeSrc);

			if (!this.isLayoutOnly
			|| (this.data.fullResolutionWidth === fullResolutionWidth
			&& this.data.fullResolutionHeight === fullResolutionHeight)) {
				return;
			}

			this.mergeElementData({
				elementId: this.id,
				elementData: {
					fullResolutionWidth,
					fullResolutionHeight,
				},
				pushToHistory: false,
			});

			this.saveWebsiteDebounced();
		},
	},
});
</script>

<style lang="scss" scoped>
.overlay {
	position: absolute;
	top: var(--overlay-top);
	left: var(--overlay-left);
	z-index: 1;
	width: var(--overlay-width);
	height: var(--overlay-height);
	opacity: 0.5;
}

.image {
	user-select: none;
}
</style>
