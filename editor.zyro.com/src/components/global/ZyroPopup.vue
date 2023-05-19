<template>
	<div
		ref="popupRef"
		class="popup"
		:class="{ 'popup--is-open': isOpen }"
	>
		<div
			ref="trigger"
			class="trigger"
		>
			<slot
				name="trigger"
				:toggle="toggle"
			/>
		</div>

		<ZyroPopupCard
			v-if="isOpen"
			ref="popupCardRef"
			v-qa="dataQa"
			:title="title"
			:tabs="tabs"
			:type="type"
			:current-tab="currentTab"
			:show-close-button="showCloseButton"
			:show-footer="showFooter"
			:show-arrow="showArrow"
			class="popup__card"
			@close="closePopup"
			@save="$emit('save'), closePopup()"
			@toggle="toggle"
			@vue:mounted="initPopper"
		>
			<slot
				:toggle="toggle"
				:close="closePopup"
			/>
		</ZyroPopupCard>
	</div>
</template>

<script>
import { createPopper } from '@popperjs/core';

import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';

import { onClickOutside } from '@/utils/onClickOutside';
import { DATA_SELECTOR_POPUP } from '@/constants';

import {
	defineComponent,
	ref,
} from 'vue';

export default defineComponent({

	components: {
		ZyroPopupCard,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			validator: (type) => [
				'no-padding',
				'editor',
				'',
			].includes(type),
			default: '',
		},
		dataQa: {
			type: String,
			default: '',
		},
		showCloseButton: {
			type: Boolean,
			default: true,
		},
		showFooter: {
			type: Boolean,
			default: false,
		},
		tabs: {
			type: Array,
			default: () => [],
		},
		currentTab: {
			type: Object,
			default: () => {},
		},
		popperOptions: {
			type: Object,
			default: () => ({
				position: 'bottom',
			}),
		},
		showArrow: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'close',
		'toggle',
	],

	setup(props, context) {
		const isOpen = ref(false);
		const popperInstance = ref(null);
		const popupResizeObserver = ref(null);
		const popupRef = ref(null);

		const closePopup = () => {
			isOpen.value = false;
			context.emit('close');
		};

		onClickOutside({
			target: popupRef,
			preventSelector: DATA_SELECTOR_POPUP,
		}, () => {
			if (!isOpen.value) return;

			closePopup();
		});

		return {
			isOpen,
			popperInstance,
			popupResizeObserver,
			closePopup,
			popupRef,
		};
	},

	updated() {
		if (this.isOpen) {
			this.popupResizeObserver = new ResizeObserver(() => {
				this.popperInstance.forceUpdate();
			});

			this.popupResizeObserver.observe(this.$refs.popupCardRef.$el);
		} else if (this.popupResizeObserver) {
			this.popupResizeObserver.disconnect();
			this.popupResizeObserver = null;
		}
	},

	methods: {
		async initPopper() {
			this.popperInstance = createPopper(this.$refs.trigger, this.$refs.popupCardRef.$el, this.popperOptions);
		},
		toggle() {
			this.isOpen = !this.isOpen;
			this.$emit('toggle', this.isOpen);
		},
	},
});
</script>

<style lang="scss" scoped>
.popup {
	&__card {
		position: absolute;
	}
}

.trigger {
	display: flex;
	align-items: center;
	width: 100%;
}

// Transitions
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
