<template>
	<section
		class="block"
		:class="`block--${blockModifier}`"
		:style="computedStyles"
		@contextmenu="openLayoutBlockContextMenu($event, id)"
		@mousedown="handleBlockMousedown"
	>
		<BlockBackground
			v-if="data.background"
			class="block__background"
			:class="{
				'block__background--fixed-mobile-view-with-collapsed-sidebar': isFixedMobileBackground && !isSidebarExpanded,
				'block__background--fixed-mobile-view-with-expanded-sidebar': isFixedMobileBackground && isSidebarExpanded,
			}"
			:overlay-opacity="data.background['overlay-opacity']"
			:type="data.background.current"
			:color="data.background.color"
			:src="backgroundSrc"
			:srcset="backgroundSrcSet"
			:is-fixed="isFixedBlockBackground"
			:alt="data.background && data.background.alt"
		/>
		<VisibilityTooltip
			:is-hidden-desktop="isHiddenDesktop"
			:is-hidden-mobile="isHiddenMobile"
		/>
		<BlockGrid
			v-if="data.type === BLOCK_TYPE_GRID"
			:data="data"
			:block-id="id"
			:components="components"
			:is-block-hovered="isBlockHovered"
			:is-block-preview-mode="isBlockPreviewMode"
			@lock-hovered-block="$emit('lock-hovered-block', $event)"
			@drag-status-change="$emit('drag-status-change', $event)"
			@set-edit-control-visibility="$emit('set-edit-control-visibility', $event)"
		/>
		<BlockLayoutProviderBuilder
			v-if="data.type === BLOCK_TYPE_LAYOUT"
			:data="data"
			:block-id="id"
			:components="components"
			:hovered-block="hoveredBlock"
			:is-block-hovered="isBlockHovered"
			:is-block-preview-mode="isBlockPreviewMode"
			@set-edit-control-visibility="$emit('set-edit-control-visibility', $event)"
		/>
		<BlockBlogHeader
			v-if="data.type === BLOCK_TYPE_BLOG_HEADER"
			:data="data"
			:current-blog-page="currentPage"
			:class="customAnimationClass"
			:blog-categories="blogCategories"
			:[DATA_ATTRIBUTE_ANIMATION_STATE]="animationAttributeStateValue"
		/>
		<BlockBlogListProviderBuilder
			v-if="data.type === BLOCK_TYPE_BLOG_LIST"
			:data="data"
			:block-id="id"
			:is-block-preview-mode="isBlockPreviewMode"
			:is-block-hovered="isBlockHovered"
			:class="customAnimationClass"
			:[DATA_ATTRIBUTE_ANIMATION_STATE]="animationAttributeStateValue"
		/>
		<BlockSlideshowProviderBuilder
			v-if="data.type === BLOCK_TYPE_SLIDESHOW"
			:data="data"
			:block-id="id"
			:blocks="blocks"
			:components="components"
			:is-block-hovered="isBlockHovered"
			@lock-hovered-block="$emit('lock-hovered-block', $event)"
			@drag-status-change="$emit('drag-status-change', $event)"
			@set-edit-control-visibility="$emit('set-edit-control-visibility', $event)"
		/>
		<BlockImageSlideshowProviderBuilder
			v-if="data.type === BLOCK_TYPE_IMAGE_SLIDESHOW"
			:data="data"
			:block-id="id"
		/>
		<BlockEcwidStoreProviderBuilder
			v-if="data.type === BLOCK_TYPE_ECWID"
			:data="data"
			:block-id="id"
			:current-locale="currentLocale"
		/>
		<BlockEcommerceProductProviderBuilder
			v-if="data.type === BLOCK_TYPE_ECOMMERCE_PRODUCT"
			:data="data"
			:block-id="id"
			:is-block-preview-mode="isBlockPreviewMode"
			:ecommerce-translations="ecommerceTranslations"
			:class="customAnimationClass"
			:current-page-type="currentPageType"
			:[DATA_ATTRIBUTE_ANIMATION_STATE]="animationAttributeStateValue"
		/>
		<BlockEcommerceProductListProviderBuilder
			v-if="data.type === BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST"
			:data="data"
			:block-id="id"
			:current-locale="currentLocale"
			:is-block-preview-mode="isBlockPreviewMode"
			:ecommerce-translations="ecommerceTranslations"
			:class="customAnimationClass"
			:[DATA_ATTRIBUTE_ANIMATION_STATE]="animationAttributeStateValue"
		/>
	</section>
</template>

<script>
import {
	computed,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import BlockBackground from '@zyro-inc/site-modules/components/blocks/BlockBackground.vue';
import BlockBlogHeader from '@zyro-inc/site-modules/components/blocks/blog/BlockBlogHeader.vue';
import VisibilityTooltip from '@/components/builder-view/components/VisibilityTooltip.vue';
import {
	BLOCK_MODIFIERS_MAP,
	BLOCK_TYPE_GRID,
	BLOCK_TYPE_LAYOUT,
	BLOCK_TYPE_BLOG_HEADER,
	BLOCK_TYPE_BLOG_LIST,
	BLOCK_TYPE_SLIDESHOW,
	BLOCK_TYPE_IMAGE_SLIDESHOW,
	BLOCK_TYPE_ECWID,
	BLOCK_TYPE_ECOMMERCE_PRODUCT,
	BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
	DATA_ATTRIBUTE_ANIMATION_STATE,
	DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
} from '@zyro-inc/site-modules/constants';
import { DEFAULT_BLOCK_GRID_STYLES } from '@zyro-inc/site-modules/constants/defaultStyles';
import { FULL_WIDTH } from '@zyro-inc/site-modules/utils/getGridItemSize';
import {
	getFullWidthSrcset,
	getOptimizedSrc,
} from '@zyro-inc/site-modules/utils/getSrcsets';
import { getMapValue } from '@zyro-inc/site-modules/utils/object';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import BlockGrid from '@/components/block-grid/BlockGrid.vue';
import BlockLayoutProviderBuilder from '@/components/block-layout/BlockLayoutProviderBuilder.vue';
import BlockBlogListProviderBuilder from '@/components/blocks/BlockBlogListProviderBuilder.vue';
import BlockEcommerceProductListProviderBuilder from '@/components/blocks/BlockEcommerceProductListProviderBuilder.vue';
import BlockEcommerceProductProviderBuilder from '@/components/blocks/BlockEcommerceProductProviderBuilder.vue';
import BlockEcwidStoreProviderBuilder from '@/components/blocks/BlockEcwidStoreProviderBuilder.vue';
import BlockSlideshowProviderBuilder from '@/components/blocks/BlockSlideshowProviderBuilder.vue';
import BlockImageSlideshowProviderBuilder from '@/components/blocks/BlockImageSlideshowProviderBuilder.vue';
import { useLayoutContextMenu } from '@/components/context-menu/useLayoutContextMenu';
import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { useSiteEngineAnimations } from '@zyro-inc/site-modules/use/useSiteEngineAnimations';

export default defineComponent({
	name: 'Block',

	components: {
		BlockGrid,
		BlockLayoutProviderBuilder,
		BlockBackground,
		BlockBlogHeader,
		VisibilityTooltip,
		BlockBlogListProviderBuilder,
		BlockSlideshowProviderBuilder,
		BlockImageSlideshowProviderBuilder,
		BlockEcwidStoreProviderBuilder,
		BlockEcommerceProductProviderBuilder,
		BlockEcommerceProductListProviderBuilder,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		hoveredBlock: {
			type: Object,
			default: null,
		},
		// Props below are only required for BlockGrid.
		isBlockHovered: {
			type: Boolean,
			default: false,
		},
		// In AddBlockModal.vue, components are not aware of the context where they are at.
		// For example, BlockBlogList.vue shows mock posts if there are none to show in preview.
		// But it does not know when it should show mock posts - so a flag which tells in what context it is rendered is needed.
		// This is short term until we think of a better architecture for such cases.
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
		components: {
			type: Object,
			default: () => ({}),
		},
		blocks: {
			type: Object,
			default: () => ({}),
		},
	},

	setup(props) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const {
			animationInEditorClass,
			isAnimationDisplayedInEditor,
			isAnimationDisplayedInEditorActive,
			animationInEditorComponentId,
		} = useSiteEngineAnimations({
			data: props.data,
		});
		const {
			selectedLayoutBlockId,
			selectedLayoutElementId,
		} = useLayoutContextMenu();
		const { openContextMenu } = useContextMenu();

		const isEditingTextBoxElement = computed(() => getters.isEditingTextBoxElement);

		const currentPage = computed(() => getters.currentPage);
		const currentPageType = computed(() => currentPage.value.type);
		const blogCategories = computed(() => getters.blogCategories);
		const computedStyles = computed(() => {
			const useBlockGridStyles = props.data.type === 'BlockGrid'
				|| props.data.type === 'BlockSlideshow';

			return {
				...(useBlockGridStyles ? DEFAULT_BLOCK_GRID_STYLES : {}),
				...objectToCssVariables(props.data?.settings?.styles),
			};
		});
		const blockModifier = computed(() => getMapValue(props.data.type, BLOCK_MODIFIERS_MAP));
		const backgroundSrc = computed(() => getOptimizedSrc(props.data.background.origin, props.data.background.path, state.websiteId, {
			width: FULL_WIDTH,
		}));

		const backgroundSrcSet = computed(
			() => getFullWidthSrcset(props.data.background.origin, props.data.background.path, state.websiteId),
		);

		const ecommerceTranslations = computed(() => {
			if (!getters['ecommerce/isStoreTypeZyro']) {
				return {};
			}

			return getters.ecommerceShoppingCart?.translations ?? {};
		});

		const isMobileView = computed(() => state.gui.isMobileView);

		const isHiddenDesktop = computed(() => !isMobileView.value && !!props.data.desktop?.isHidden);

		const isHiddenMobile = computed(() => isMobileView.value && !!props.data.mobile?.isHidden);

		const currentLocale = computed(() => state.currentLocale);

		const isFixedBlockBackground = computed(() => props.data.attachment === 'fixed');

		const isSidebarExpanded = computed(() => state.gui.isSidebarExpanded);

		const isFixedMobileBackground = computed(() => isFixedBlockBackground.value && isMobileView.value);
		const customAnimationClass = computed(() => {
			const isAnimationForElementTriggered = animationInEditorComponentId.value
				&& props.elementId === animationInEditorComponentId.value;

			if (!isAnimationDisplayedInEditor.value || (animationInEditorComponentId.value && !isAnimationForElementTriggered)) {
				return '';
			}

			return animationInEditorClass.value;
		});

		const animationAttributeStateValue = computed(() => (
			isAnimationDisplayedInEditorActive.value ? DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE : null
		));

		const openLayoutBlockContextMenu = (event, id) => {
			if (isEditingTextBoxElement.value) {
				return;
			}

			event.preventDefault();

			openContextMenu(event);
			selectedLayoutBlockId.value = id;
			selectedLayoutElementId.value = null;
		};

		const handleBlockMousedown = () => {
			dispatch('leaveElementEditMode');
		};

		return {
			BLOCK_TYPE_GRID,
			BLOCK_TYPE_LAYOUT,
			BLOCK_TYPE_BLOG_HEADER,
			BLOCK_TYPE_BLOG_LIST,
			BLOCK_TYPE_SLIDESHOW,
			BLOCK_TYPE_IMAGE_SLIDESHOW,
			BLOCK_TYPE_ECWID,
			BLOCK_TYPE_ECOMMERCE_PRODUCT,
			BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
			DATA_ATTRIBUTE_ANIMATION_STATE,
			currentPage,
			currentPageType,
			currentLocale,
			blockModifier,
			computedStyles,
			backgroundSrc,
			backgroundSrcSet,
			ecommerceTranslations,
			selectedLayoutBlockId,
			isHiddenDesktop,
			isHiddenMobile,
			isMobileView,
			isFixedBlockBackground,
			isSidebarExpanded,
			isFixedMobileBackground,
			customAnimationClass,
			isAnimationDisplayedInEditor,
			animationAttributeStateValue,
			blogCategories,
			openLayoutBlockContextMenu,
			handleBlockMousedown,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/components/Block";

.block {
	position: relative;
	grid-area: 1 / 1 / -1 / -1;
	height: var(--block-height-on-resize);

	&:not(:last-child) {
		margin-bottom: -1px;
	}

	&__background {
		&--fixed-mobile-view-with-collapsed-sidebar {
			:deep(.block-background__image) {
				width: $media-mobile-editor;

				// this is required to place fixed image in the center of mobile mode editor
				margin-left: calc((100% + $sidebar-width-editor - $media-mobile-editor) / 2);
			}
		}

		&--fixed-mobile-view-with-expanded-sidebar {
			:deep(.block-background__image) {
				width: $media-mobile-editor;

				// this is required to place fixed image in the center of mobile mode editor
				margin-left: calc((100% + $sidebar-width-expanded-editor - $media-mobile-editor) / 2);
			}
		}
	}
}
</style>
