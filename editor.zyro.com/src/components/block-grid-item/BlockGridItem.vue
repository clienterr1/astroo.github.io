<template>
	<div
		ref="elementRef"
		v-qa="`${data.type}:${id}`"
		:data-element-id="id"
		class="block-grid-item"
		:style="computedStyles"
		:data-popper-reference="currentElementId === id ? LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT : null"
		:class="{
			'is-current': currentElementId === id,
			'is-editing': isElementEditMode,
			'use-m-margin': useMMargin,
			'is-cut': isThisElementCut
		}"
		@mousedown.stop="handleElementMousedown(id)"
		@dblclick="handleElementDblclick()"
	>
		<GridButtonProviderBuilder
			v-if="data.type === ELEMENT_TYPE_BUTTON"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridStripeButtonProviderBuilder
			v-if="data.type === ELEMENT_TYPE_STRIPE_BUTTON"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridEcommerceButtonProviderBuilder
			v-if="data.type === ELEMENT_TYPE_ECOMMERCE_BUTTON"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridMapProviderBuilder
			v-if="data.type === ELEMENT_TYPE_MAP"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridVideoProviderBuilder
			v-if="data.type === ELEMENT_TYPE_VIDEO"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridImageProviderBuilder
			v-if="data.type === ELEMENT_TYPE_IMAGE"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridTextBoxProviderBuilder
			v-if="data.type === ELEMENT_TYPE_TEXT_BOX"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridFormProviderBuilder
			v-if="data.type === ELEMENT_TYPE_FORM"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridInstagramFeedProviderBuilder
			v-if="data.type === ELEMENT_TYPE_INSTAGRAM_FEED"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridSocialIconsProviderBuilder
			v-if="data.type === ELEMENT_TYPE_SOCIAL_ICONS"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridGalleryProviderBuilder
			v-if="data.type === ELEMENT_TYPE_GALLERY"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<GridEmbedProviderBuilder
			v-if="data.type === ELEMENT_TYPE_EMBED"
			:id="id"
			ref="element"
			:data="data"
			@vue:mounted="handleElementMounted"
			@vue:beforeUnmount="handleElementBeforeUnmount"
		/>
		<BlockGridMobileResizer
			v-if="useMobileResizer"
			:element-alignment="elementAlignment"
			:value="width"
			:max-width="parentWidth"
			@start-resizing="onStartResizing"
			@resize="onResize"
			@stop-resizing="onStopResizing"
		/>
	</div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { getGridItemSize } from '@zyro-inc/site-modules/utils/getGridItemSize';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
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
} from '@zyro-inc/site-modules/constants';
import BlockGridMobileResizer from '@/components/block-grid/BlockGridMobileResizer.vue';
import { LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT } from '@/constants';
import { useGridContextMenu } from '@/components/context-menu/useGridContextMenu';
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
import { useCurrentElementRef } from '@/use/useCurrentElementRef';

import { defineComponent } from 'vue';

const AUTO_EXPAND_ELEMENTS = [
	// MIGRATION - resize observer fails because element ref is text fragment
	// 'GridTextBox',
	'GridSocialIcons',
	'GridForm',
];

const AUTO_RESIZE_ELEMENTS = [
	'GridInstagramFeed',
	'GridGallery',
];

const AUTO_RESIZEABLE_ELEMENTS = [
	...AUTO_RESIZE_ELEMENTS,
	...AUTO_EXPAND_ELEMENTS,
];

export default defineComponent({

	name: 'BlockGridItem',

	components: {
		GridButtonProviderBuilder,
		GridStripeButtonProviderBuilder,
		GridEcommerceButtonProviderBuilder,
		GridMapProviderBuilder,
		GridVideoProviderBuilder,
		GridImageProviderBuilder,
		GridTextBoxProviderBuilder,
		GridFormProviderBuilder,
		GridInstagramFeedProviderBuilder,
		GridSocialIconsProviderBuilder,
		GridGalleryProviderBuilder,
		GridEmbedProviderBuilder,
		BlockGridMobileResizer,
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
		useMMargin: {
			type: Boolean,
			default: true,
		},
		blockData: {
			type: Object,
			required: true,
		},
	},
	emits: [
		'update-height',
		'set-height',
		'element-selected',
		'start-resizing',
		'stop-resizing',
	],

	setup(props) {
		const { elementRef } = useCurrentElementRef(props);
		const {
			copiedElementId,
			isElementCut,
		} = useGridContextMenu();

		return {
			copiedElementId,
			isElementCut,
			LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT,
			elementRef,
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
		};
	},

	data() {
		return {
			resizeObserver: null,
			elementDataBeforeResize: null,
			width: null,
			parentWidth: null,
		};
	},

	computed: {
		...mapState([
			'currentElementId',
			'isElementEditMode',
		]),
		...mapGetters(['currentElementType']),
		...mapGetters('gui', ['isMobileMode']),
		isThisElementCut() {
			return this.isElementCut && this.copiedElementId === this.id;
		},
		settings() {
			return this.data.settings;
		},
		styles() {
			return this.settings.styles;
		},
		innerBackgroundValue() {
			const { innerBackground } = this.data;

			if (!innerBackground) {
				return {};
			}

			const currentBackground = innerBackground[innerBackground.current];

			if (innerBackground.current === 'image') {
				const imageBackground = {
					'--gridItemInnerBackground': `url(${currentBackground})`,
				};

				if ('overlay-opacity' in innerBackground) {
					imageBackground['--gridItemInnerBackgroundOverlayOpacity'] = innerBackground['overlay-opacity'];
				}

				return imageBackground;
			}

			return {
				'--gridItemInnerBackground': currentBackground,
			};
		},
		useMobileResizer() {
			return this.currentElementId === this.id && this.isMobileMode;
		},
		elementAlignment() {
			return this.styles['m-align-self'] || 'flex-start';
		},
		elementWidth() {
			return getGridItemSize(this.blockData, this.styles.position)?.width;
		},
		elementHeight() {
			return getGridItemSize(this.blockData, this.styles.position)?.height;
		},
		computedStyles() {
			return {
				...objectToCssVariables(this.styles),
				...this.innerBackgroundValue,
			};
		},
	},

	// We need this watcher to automatically update the height of BlockGridItem
	// when increasing the inner padding of a form element
	watch: {
		'styles.gridItemInnerPadding': function forceResizeElementHeight() {
			this.$emit('update-height', this.id);
		},
		currentElementId(newId) {
			// On slideshow only active block is displayed in result width is not updated on mounted
			// because block is not displayed (display: none)
			if (newId === this.id && !this.width) {
				this.updateWidth();
			}
		},
	},

	methods: {
		...mapActions([
			'selectCurrentElement',
			'enterElementEditMode',
			'leaveElementEditMode',
			'mergeElementData',
		]),
		...mapActions('undoRedo', ['createSnapshot']),
		listenForSizeChanges() {
			if (!AUTO_RESIZEABLE_ELEMENTS.includes(this.data.type)) {
				return;
			}

			const element = this.$refs.element.$el;

			this.resizeObserver = new ResizeObserver(() => {
				// Only work on current element so screen resize doesn't change element positions

				requestAnimationFrame(() => {
					if (this.currentElementId !== this.id) {
						return;
					}

					const shouldUpdateHeight = this.$refs.elementRef.clientHeight < element.scrollHeight;

					if (shouldUpdateHeight) {
						this.$emit('update-height', this.id);

						return;
					}

					if (AUTO_RESIZE_ELEMENTS.includes(this.data.type)) {
						this.$emit('set-height', this.id);
					}
				});
			});
			this.resizeObserver.observe(element);
		},
		handleElementMounted() {
			// Mobile resizing
			this.updateWidth();
			this.listenForSizeChanges();
		},
		updateWidth() {
			this.width = this.$refs.elementRef?.clientWidth;
			this.parentWidth = this.$refs.elementRef?.parentNode.parentNode.clientWidth;
		},
		handleElementBeforeUnmount() {
			if (!AUTO_RESIZEABLE_ELEMENTS.includes(this.data.type)) {
				return;
			}

			if (this.resizeObserver) {
				this.resizeObserver.disconnect();
			}

			this.resizeObserver = null;
		},
		handleElementMousedown(elementId) {
			if (elementId === this.currentElementId) {
				return;
			}

			if (this.isElementEditMode) {
				this.leaveElementEditMode();
			}

			this.selectCurrentElement({
				elementId,
			});
			this.$emit('element-selected');
		},
		handleElementDblclick() {
			if (!this.isElementEditMode) {
				if (this.isMobileMode && this.data.type === 'GridGallery') {
					return;
				}

				this.enterElementEditMode();
			}
		},
		// Mobile resizing
		onStartResizing() {
			this.$emit('start-resizing');
			this.elementDataBeforeResize = cloneDeep(this.data);
		},
		onResize(size) {
			this.mergeElementData({
				elementId: this.id,
				elementData: {
					settings: {
						styles: {
							'm-width': `${size}px`,
						},
					},
				},
			});
		},
		onStopResizing(size) {
			const widthInPercent = (size / this.parentWidth) * 100;

			this.mergeElementData({
				elementId: this.id,
				elementData: {
					settings: {
						styles: {
							'm-width': `${widthInPercent}%`,
						},
					},
				},
			});

			this.createSnapshot();

			this.elementDataBeforeResize = null;
			this.$emit('stop-resizing');
			this.width = this.$refs.elementRef?.clientWidth;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/components/BlockGridItem";

.block-grid-item {
	width: calc(100% + var(--width-x, 0));

	// TODO: rename to height
	height: calc(100% + var(--width-y, 0));
	overflow: hidden;
	word-break: break-word;
	background-color: var(--event-background-color);
	transition: background 0.2s ease-in;
	transform: translate3d(var(--moved-x, 0), var(--moved-y, 0), 0);
	transform-origin: bottom right;

	&:not(.is-editing) {
		cursor: move;
	}

	&:not(.is-current):hover {
		outline: 2px solid $color-azure;
	}

	&.is-editing {
		* {
			// Safari fix
			user-select: text;
		}
	}

	&.is-cut {
		opacity: 0.5;
	}
}

@include site-engine-mobile {
	.block-grid-item {
		overflow: visible;

		&:not(.is-editing) {
			cursor: move;
		}

		&:not(.is-current):hover {
			outline: 2px solid $color-azure;
		}

		// Margin on last element is removed in blockgrid.vue
		&.use-m-margin {
			margin: var(--m-element-margin);
		}
	}
}
</style>
