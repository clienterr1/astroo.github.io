<template>
	<Popup
		v-if="triggerRef"
		ref="contextMenuPopupRef"
		:target-ref="triggerRef"
		auto-update
		placement="bottom-start"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU"
	>
		<div class="context-menu">
			<slot />
		</div>
	</Popup>
	<div
		v-else-if="renderMenu && isEnabled"
		ref="contextMenuRef"
		class="context-menu context-menu--absolute"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU"
		@mousedown.stop
	>
		<slot />
	</div>
</template>

<script>
import {
	ref,
	watch,
	nextTick,
	defineComponent,
} from 'vue';

import { useContextMenu } from '@/components/context-menu/useContextMenu';
import { fitElementToContainer } from '@/utils/fitElementToContainer';
import { onClickOutside } from '@/utils/onClickOutside';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU,
} from '@zyro-inc/site-modules/constants';
import Popup from '@/components/global/Popup.vue';

export default defineComponent({
	components: {
		Popup,
	},

	props: {
		isEnabled: {
			type: Boolean,
			default: false,
		},
		triggerRef: {
			type: Element,
			default: null,
		},
	},

	setup(props, context) {
		const contextMenuRef = ref(null);
		const contextMenuPopupRef = ref(null);
		const positionTop = ref('');
		const positionLeft = ref('');
		const renderMenu = ref(false);
		const {
			mousePosition,
			closeContextMenu,
		} = useContextMenu();

		const setCoordinates = () => {
			const {
				clientX,
				clientY,
			} = mousePosition?.value ?? {};

			const {
				left,
				top,
			} = fitElementToContainer(
				contextMenuRef.value,
				document.body,
				{
					left: clientX,
					top: clientY,
				},
			);

			positionLeft.value = `${left}px`;
			positionTop.value = `${top + window.scrollY}px`;
		};

		watch(mousePosition, async (newPosition) => {
			// Trigger animation
			renderMenu.value = false;
			if (newPosition) {
				renderMenu.value = true;
				// Wait for popup to render so we can place it properly
				await nextTick();
				if (contextMenuRef.value) {
					setCoordinates();
				}
			}
		});

		onClickOutside({
			target: props.targetRef ? contextMenuPopupRef : contextMenuRef,
			preventSelector: DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU,
		}, () => {
			closeContextMenu();
			context.emit('close-context-menu');
		});

		return {
			contextMenuRef,
			contextMenuPopupRef,
			renderMenu,
			positionLeft,
			positionTop,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU,
		};
	},
});
</script>

<style lang="scss" scoped>
.context-menu {
	min-width: 230px;
	z-index: $z-index-controls-popup-card;
	max-width: 400px;
	overflow: hidden;
	user-select: none;
	background: $color-light;
	border-radius: $border-radius-small;
	box-shadow: $box-shadow;

	&--absolute {
		position: absolute;
		top: v-bind(positionTop);
		left: v-bind(positionLeft);
	}
}

.fade-in {
	transform-origin: 50% -50px;

	&-enter-active,
	&-leave-active {
		transition: transform 0.25s, opacity 0.2s;
	}

	&-enter,
	&-leave-to {
		opacity: 0;
		transform: rotateX(-10deg) scaleY(0.98) scaleX(0.99);
	}
}

</style>
