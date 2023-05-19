<template>
	<Teleport :to="portalSelector">
		<div
			:id="popupId"
			ref="popupContentRef"
			:[POPUP_DATA_ATTRIBUTE]="true"
			:style="popupStyle"
			class="popup-content"
			:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT"
		>
			<slot />
		</div>
	</Teleport>
	<!-- Wrapper div used for nested popup's click outside handling (onClickOutside()) -->
	<div
		:[PORTAL_DATA_ATTRIBUTE]="true"
		:data-popup-id="popupId"
	/>
</template>

<script>
import {
	computePosition,
	flip,
	shift,
	offset,
	size,
	autoUpdate,
	limitShift,
} from '@floating-ui/dom';
import {
	ref,
	watch,
	computed,
	defineComponent,
	onUnmounted,
	nextTick,
} from 'vue';
import { generateRandomId } from '@/utils/generateRandomId';
import { onClickOutside } from '@vueuse/core';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER,
	DATA_ATTRIBUTE_SELECTOR_FONT_SELECT,
	DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT,
} from '@zyro-inc/site-modules/constants';

const PORTAL_DATA_ATTRIBUTE = 'data-popup-portal';
const POPUP_DATA_ATTRIBUTE = 'data-popup-content';

export default defineComponent({
	props: {
		targetRef: {
			type: HTMLElement,
			default: null,
		},
		portalSelector: {
			type: String,
			default: 'body',
		},
		placement: {
			type: String,
			default: 'right',
		},
		offset: {
			type: Number,
			default: 8,
		},
		padding: {
			type: Number,
			default: 16,
		},
		borderRadius: {
			type: Number,
			default: null,
		},
		// shift - keep popup in view, while moving it from the edge
		shift: {
			type: Boolean,
			default: true,
		},
		// flip - keep popup in view, while moving it to other side of element
		flip: {
			type: Boolean,
			default: true,
		},
		// autoMaxHeight - prevent popup from overflowing viewport, by applying max height and adding a scroll to it
		autoMaxHeight: {
			type: Boolean,
			default: false,
		},
		// autoupdate - updates popup position on scroll/DOM changes/etc
		autoUpdate: {
			type: Boolean,
			default: false,
		},
		autoUpdateOptions: {
			type: Object,
			default: () => ({}),
		},
		isOnlyClickInside: {
			type: Boolean,
			default: false,
		},
		onClickOutsideOptions: {
			type: Object,
			default: () => ({}),
		},
	},

	emits: ['click-outside'],

	setup(props, context) {
		const popupId = `popup-${generateRandomId()}`;

		const popupContentRef = ref();
		const popupX = ref();
		const popupY = ref();
		const popupMaxHeight = ref();
		const autoUpdateCleanFunc = ref();

		const popupStyle = computed(() => ({
			transform: `translate3d(${popupX.value}px, ${popupY.value}px, 0)`,
			borderRadius: `${props.borderRadius}px`,
			...(props.autoMaxHeight && {
				overflowY: 'auto',
				maxHeight: `${popupMaxHeight}px`,
			}),
		}));

		const setPopupPosition = async (referenceEl, popupEl) => {
			const {
				x,
				y,
			} = await computePosition(referenceEl, popupEl, {
				placement: props.placement,
				middleware: [
					offset(props.offset),
					...(props.flip ? [
						flip({
							padding: props.padding,
						}),
					] : []),
					...(props.shift ? [
						shift({
							padding: props.padding,
							crossAxis: true,
							limiter: limitShift(),
						}),
					] : []),
					...(props.autoMaxHeight ? [
						size({
							apply({ availableHeight }) {
								popupMaxHeight.value = availableHeight;
							},
						}),
					] : []),

				],
			});

			popupX.value = x;
			popupY.value = y;

			return {
				popupX,
				popupY,
			};
		};

		watch(() => props.targetRef, async (targetRef) => {
			if (!targetRef) {
				return;
			}

			await nextTick();

			const popupRef = document.getElementById(popupId);

			if (props.autoUpdate) {
				if (autoUpdateCleanFunc.value) {
					autoUpdateCleanFunc.value();
				}

				autoUpdateCleanFunc.value = autoUpdate(targetRef, popupRef, () => {
					setPopupPosition(targetRef, popupRef);
				}, props.autoUpdateOptions);
			} else {
				setPopupPosition(targetRef, popupRef);
			}
		}, {
			immediate: true,
		});

		onUnmounted(() => {
			if (autoUpdateCleanFunc.value) {
				autoUpdateCleanFunc.value();
			}
		});

		onClickOutside(popupContentRef, (event) => {
			try {
				if (
					props.isOnlyClickInside
					|| (props.onClickOutsideOptions.detectIframe && event.target instanceof Window)
				) {
					context.emit('click-outside', event);

					return;
				}

				// If root node is not document, very likely element on which click is registered is no longer relevent/in the DOM
				if (event.target.getRootNode() !== document
				|| event.target?.closest(`[${DATA_ATTRIBUTE_SELECTOR}=${DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER}]`)) {
					return;
				}

				if (props.targetRef.contains(event.target) || props.targetRef.isSameNode(event.target)) {
					return;
				}

				// This prevents Edit Controls from closing when choosing Font Weight through Font Select.
				if (event.target?.closest(`[${DATA_ATTRIBUTE_SELECTOR}=${DATA_ATTRIBUTE_SELECTOR_FONT_SELECT}]`)) {
					return;
				}

				// If clicking on child popup, don't close parent popup
				// TODO: now it supports only 1 level deep nesting. With a first need, implement recursive levels support
				const childPopupPortals = popupContentRef.value.querySelectorAll(`[${PORTAL_DATA_ATTRIBUTE}]`);
				const clickedPopup = event.target.closest(`[${POPUP_DATA_ATTRIBUTE}]`);
				const isParent = clickedPopup
					&& childPopupPortals
					&& [...childPopupPortals].some((childPopupPortal) => clickedPopup.id === childPopupPortal.dataset.popupId);

				if (isParent) {
					return;
				}

				// It's probably lib bug, but sometimes event is triggered even when clicking on popup itself:
				if (event.target.closest(`#${popupId}`)) {
					return;
				}

				context.emit('click-outside', event);
			} catch (error) {
				context.emit('click-outside', event);
				console.error(error);
			}
		}, props.onClickOutsideOptions);

		return {
			popupContentRef,
			popupStyle,
			popupId,
			PORTAL_DATA_ATTRIBUTE,
			POPUP_DATA_ATTRIBUTE,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT,
		};
	},
});
</script>

<style lang="scss" scoped>
.popup-content {
	position: absolute;
	top: 0;
	left: 0;
	will-change: transform;
	z-index: $z-index-popup;
}
</style>
