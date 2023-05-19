<template>
	<LayoutElementWrapper
		ref="elementRef"
		v-qa="`${elementData.type}:${elementId}`"
		class="layout-element"
		:data-element-id="elementId"
		:element-data="elementData"
		:style="elementComputedStyles"
		:data-popper-reference="currentElementId === elementId ? LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT : null"
		:class="[
			{
				'is-cut': isElementCut && elementId === copiedElementId,
				'is-active-element-present': isActiveElementPresent,
				'is-highlighted': isHighlighted,
				'is-blocking-resize': isBlockingResize,
				'layout-element--is-active': isElementActive,
				'layout-element--is-multi-selected': isElementMultiSelected,
			}, customAnimationClass
		]"
		:[DATA_ATTRIBUTE_ANIMATION_STATE]="isAnimationDisplayedInEditorActive ? DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE : null"
		:is-mobile-view="isMobileView"
		@dblclick="selectCurrentElement({ elementId }), enterElementEditMode()"
		@mousedown.stop="handleElementMousedown(elementId)"
	>
		<VisibilityTooltip
			:is-hidden-desktop="isHiddenDesktop"
			:is-hidden-mobile="isHiddenMobile"
			:is-tooltip-shown="isTooltipShown"
		/>
		<GridButtonProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_BUTTON"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridButton"
		/>
		<GridStripeButtonProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_STRIPE_BUTTON"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridStripeButton"
		/>
		<GridEcommerceButtonProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_ECOMMERCE_BUTTON"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridEcommerceButton"
		/>
		<GridMapProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_MAP"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridMap"
		/>
		<GridVideoProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_VIDEO"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridVideo"
		/>
		<GridImageProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_IMAGE"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			:rendered-position="renderedPosition"
			:reset-mobile-position="false"
			class="layout-element__component layout-element__component--GridImage"
		/>
		<GridTextBoxProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_TEXT_BOX"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridTextBox"
		/>
		<GridFormProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_FORM"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridForm"
		/>
		<GridInstagramFeedProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_INSTAGRAM_FEED"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridInstagramFeed"
		/>
		<GridSocialIconsProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_SOCIAL_ICONS"
			:data="elementData"
			:data-element-ref="elementId"
			:is-block-preview-mode="isBlockPreviewMode"
			class="layout-element__component layout-element__component--GridSocialIcons"
		/>
		<GridGalleryProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_GALLERY"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridGallery"
		/>
		<GridEmbedProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_EMBED"
			:id="elementId"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridEmbed"
		/>
		<GridShapeProviderBuilder
			v-if="elementData.type === ELEMENT_TYPE_SHAPE"
			:data="elementData"
			:data-element-ref="elementId"
			class="layout-element__component layout-element__component--GridShape"
		/>
		<div class="layout-element__slot">
			<slot />
		</div>
	</LayoutElementWrapper>
</template>

<script>
import {
	computed,
	defineComponent,
	onMounted,
	onBeforeUnmount,
} from 'vue';
import {
	mapActions,
	mapState,
	useStore,
} from 'vuex';

import LayoutElementWrapper from '@zyro-inc/site-modules/components/blocks/layout/LayoutElementWrapper.vue';
import VisibilityTooltip from '@/components/builder-view/components/VisibilityTooltip.vue';
import {
	ELEMENT_TYPE_BUTTON,
	ELEMENT_TYPE_STRIPE_BUTTON,
	ELEMENT_TYPE_ECOMMERCE_BUTTON,
	ELEMENT_TYPE_MAP,
	ELEMENT_TYPE_VIDEO,
	ELEMENT_TYPE_IMAGE,
	ELEMENT_TYPE_TEXT_BOX,
	ELEMENT_TYPE_FORM,
	ELEMENT_TYPE_INSTAGRAM_FEED,
	ELEMENT_TYPE_SOCIAL_ICONS,
	ELEMENT_TYPE_GALLERY,
	ELEMENT_TYPE_EMBED,
	ELEMENT_TYPE_SHAPE,
	DATA_ATTRIBUTE_ANIMATION_STATE,
	DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
	ANIMATION_NOT_SUPPORTED_ELEMENTS,
} from '@zyro-inc/site-modules/constants';
import { LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT } from '@/constants';
import GridButtonProviderBuilder from '@/components/elements/GridButtonProviderBuilder.vue';
import GridEcommerceButtonProviderBuilder from '@/components/elements/GridEcommerceButtonProviderBuilder.vue';
import GridEmbedProviderBuilder from '@/components/elements/GridEmbedProviderBuilder.vue';
import GridFormProviderBuilder from '@/components/elements/GridFormProviderBuilder.vue';
import GridGalleryProviderBuilder from '@/components/elements/GridGalleryProviderBuilder.vue';
import GridImageProviderBuilder from '@/components/elements/GridImageProviderBuilder.vue';
import GridInstagramFeedProviderBuilder from '@/components/elements/GridInstagramFeedProviderBuilder.vue';
import GridMapProviderBuilder from '@/components/elements/GridMapProviderBuilder.vue';
import GridSocialIconsProviderBuilder from '@/components/elements/GridSocialIconsProviderBuilder.vue';
import GridStripeButtonProviderBuilder from '@/components/elements/GridStripeButtonProviderBuilder.vue';
import GridTextBoxProviderBuilder from '@/components/elements/GridTextBoxProviderBuilder.vue';
import GridVideoProviderBuilder from '@/components/elements/GridVideoProviderBuilder.vue';
import GridShapeProviderBuilder from '@/components/elements/GridShapeProviderBuilder.vue';
import { useCurrentElementRef } from '@/use/useCurrentElementRef';
import { useElementsRefs } from '@/use/useElementsRefs';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';
import { useSiteEngineAnimations } from '@zyro-inc/site-modules/use/useSiteEngineAnimations';
import { updateElementPositionFromDOM } from '@/components/block-layout/useLayout';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';
import { useIsWindowBeingResized } from '@/use/useIsWindowResizing';
import { useLayoutElementResizeObserver } from '@/use/useLayoutElementResizeObserver';

export default defineComponent({
	name: 'LayoutElementProviderBuilder',

	components: {
		GridButtonProviderBuilder,
		GridStripeButtonProviderBuilder,
		GridEcommerceButtonProviderBuilder,
		GridFormProviderBuilder,
		GridVideoProviderBuilder,
		GridTextBoxProviderBuilder,
		GridMapProviderBuilder,
		GridSocialIconsProviderBuilder,
		GridGalleryProviderBuilder,
		GridImageProviderBuilder,
		GridInstagramFeedProviderBuilder,
		GridEmbedProviderBuilder,
		GridShapeProviderBuilder,
		LayoutElementWrapper,
		VisibilityTooltip,
	},

	props: {
		elementId: {
			type: String,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		elementData: {
			type: Object,
			required: true,
		},
		currentElementId: {
			type: [
				String,
				null,
			],
			required: true,
		},
		multiSelectedElementsIds: {
			type: Array,
			default: () => [],
		},
		lowerElementsIdsRelativeToActive: {
			type: Array,
			default: () => [],
		},
		elementsCssVars: {
			type: Object,
			default: () => {},
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
		renderedPosition: {
			type: Object,
			default: null,
		},
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
		isActiveElementPresent: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		isBlockingResize: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'element-size-changed',
		'reset-multi-select',
	],

	setup(props) {
		// it's a workaround for the issues when element position is updated before fonts are loaded
		const BUILDER_DEPENDENCIES_LOAD_TIMEOUT = 1500;

		const {
			getters,
			dispatch,
		} = useStore();
		const { refs } = useElementsRefs();
		const { elementRef } = useCurrentElementRef(props);
		const {
			animationInEditorClass,
			isAnimationDisplayedInEditor,
			isAnimationDisplayedInEditorActive,
			animationInEditorComponentId,
		} = useSiteEngineAnimations();
		const { isWindowResizing } = useIsWindowBeingResized();
		const { updateElementHeightOnDevices } = useDeviceElementHeight();
		const {
			observeLayoutElement,
			unobserveLayoutElement,
		} = useLayoutElementResizeObserver();

		const customAnimationClass = computed(() => {
			const isAnimationTriggered = isAnimationDisplayedInEditor.value
				&& !ANIMATION_NOT_SUPPORTED_ELEMENTS.includes(props.elementData.type);
			const isAnimationForElementTriggered = props.elementId === animationInEditorComponentId.value;

			if (!isAnimationTriggered || (animationInEditorComponentId.value && !isAnimationForElementTriggered)) {
				return '';
			}

			return animationInEditorClass.value;
		});
		const isMobileMode = computed(() => getters['gui/isMobileMode']);

		const updateElementPosition = () => {
			// AI generated texts take up more space than initial text box heights,
			// so `useAiTemplate.js` adds `shouldUpdateElementPosition` flag.
			// When this component encounters the flag, it forcefully updates those elements heights.

			if (props.elementData.type === 'GridTextBox' && props.elementData.shouldUpdateElementPosition) {
				updateElementPositionFromDOM({
					dispatch,
					elementId: props.elementId,
					blockId: props.blockId,
					isMobileMode: isMobileMode.value,
					pushToHistory: false,
				});

				updateElementHeightOnDevices({
					elementId: props.elementId,
					blockId: props.blockId,
				});
			}
		};

		const isHighlighted = computed(() => props.currentElementId === props.elementId);

		const elementComputedStyles = computed(() => props.elementsCssVars?.[props.elementId] ?? {});

		const isElementMultiSelected = computed(() => props.multiSelectedElementsIds.includes(props.elementId));
		const isElementLowerThatActiveElement = computed(() => props.lowerElementsIdsRelativeToActive.includes(props.elementId));

		const isElementActive = computed(() => props.isActive
			|| (props.isActiveElementPresent && isElementMultiSelected.value)
			|| (props.isActiveElementPresent && isElementLowerThatActiveElement.value));

		onMounted(() => {
			refs.value[props.elementId] = elementRef.value.$el;

			setTimeout(() => {
				updateElementPosition();
			}, BUILDER_DEPENDENCIES_LOAD_TIMEOUT);
		});

		onBeforeUnmount(() => {
			delete refs.value[props.elementId];
		});

		const {
			isElementCut,
			copiedElementId,
		} = useLayoutContextMenu();

		return {
			isWindowResizing,
			LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT,
			elementRef,
			isElementCut,
			copiedElementId,
			ELEMENT_TYPE_BUTTON,
			ELEMENT_TYPE_STRIPE_BUTTON,
			ELEMENT_TYPE_ECOMMERCE_BUTTON,
			ELEMENT_TYPE_MAP,
			ELEMENT_TYPE_VIDEO,
			ELEMENT_TYPE_IMAGE,
			ELEMENT_TYPE_TEXT_BOX,
			ELEMENT_TYPE_FORM,
			ELEMENT_TYPE_INSTAGRAM_FEED,
			ELEMENT_TYPE_SOCIAL_ICONS,
			ELEMENT_TYPE_GALLERY,
			ELEMENT_TYPE_EMBED,
			ELEMENT_TYPE_SHAPE,
			isHighlighted,
			elementComputedStyles,
			isElementActive,
			DATA_ATTRIBUTE_ANIMATION_STATE,
			DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
			isAnimationDisplayedInEditorActive,
			customAnimationClass,
			isElementMultiSelected,
			observeLayoutElement,
			unobserveLayoutElement,
		};
	},

	data() {
		return {
			resizeObserver: null,
		};
	},

	computed: {
		...mapState(['isElementEditMode']),
		isHiddenDesktop() {
			return !this.isMobileView && !!this.elementData.desktop?.isHidden;
		},
		isHiddenMobile() {
			return this.isMobileView && !!this.elementData.mobile?.isHidden;
		},
		isTooltipShown() {
			return this.elementData.desktop.width > 90 && this.elementData.desktop.height > 90;
		},
	},

	mounted() {
		this.observeLayoutElement({
			htmlElement: this.elementRef?.$el,
			triggerCallback: () => this.$emit('element-size-changed'),
			elementId: this.elementId,
		});
	},

	beforeUnmount() {
		this.unobserveLayoutElement({
			htmlElement: this.elementRef?.$el,
			elementId: this.elementId,
		});
	},

	methods: {
		...mapActions([
			'enterElementEditMode',
			'selectCurrentElement',
			'leaveElementEditMode',
		]),
		handleElementMousedown(elementId) {
			if (elementId === this.currentElementId) {
				return;
			}

			if (this.isElementEditMode) {
				this.leaveElementEditMode();
			}

			if (!this.isElementMultiSelected) {
				this.$emit('reset-multi-select');
			}

			this.selectCurrentElement({
				elementId,
			});
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/components/blocks/layout/LayoutElementWrapperProvider";
</style>

<style lang="scss" scoped>
.layout-element {
	$this: &;

	pointer-events: all;
	cursor: move;

	&__component {
		overflow: var(--overflow, hidden);

		&--GridSocialIcons {
			&#{&} {
				max-height: fit-content;
			}
		}

		&--GridEmbed {
			&#{&} {
				height: 100%;
			}
		}
	}

	&--is-active {
		&#{&} {
			position: absolute;
			top: var(--element-top);
			left: var(--element-left);
			grid-area: 1 / 1 / -1 / -1;
			width: var(--element-width);
			height: var(--element-height);

			// Needed for correctly setting hovered block while dragging element.
			// Without it wrong block will be set, because you hover element that belongs to another block
			pointer-events: none;

			#{$this}__component {
				user-select: none;

				:deep(.warning-tooltip) {
					* {
						pointer-events: none;
					}
				}
			}
		}
	}

	&__slot {
		display: grid;
		grid-area: 1 / 1 / -1 / -1;
		visibility: hidden;
	}

	&.is-cut {
		opacity: 0.5;
	}

	&:not(.is-highlighted) {
		:deep(#{$this}__component) {

			* { pointer-events: none; }

			.warning-tooltip {
				* {
					pointer-events: auto;
				}
			}
		}
	}

	&:not(.is-active-element-present):hover,
	&.is-highlighted,
	&.is-blocking-resize,
	&--is-multi-selected {
		// Needed so you can select text in safari while editing
		user-select: text;

		#{$this}__slot {
			visibility: visible;
		}
	}
}
</style>
