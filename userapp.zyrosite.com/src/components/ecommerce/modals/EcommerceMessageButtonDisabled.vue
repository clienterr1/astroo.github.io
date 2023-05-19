<template>
	<Transition name="fade">
		<div
			v-qa="'builder-message-ecommercedisabled'"
			class="notification"
		>
			<svg
				class="notification__icon"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12.01 16L12.01 12"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12.01 8L12 8"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="notification__content">
				{{ translations.checkoutModalDisabledPreview }}
			</p>
			<CloseButton
				class="notification__close"
				title="Close"
				@click="closeEcommerceModal()"
			/>
		</div>
	</Transition>
</template>

<script>
import {
	defineComponent,
	onBeforeUnmount,
} from 'vue';

import CloseButton from '@zyro-inc/site-modules/components/CloseButton.vue';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';

export default defineComponent({
	components: {
		CloseButton,
	},

	props: {
		translations: {
			type: Object,
			default: () => {},
		},
	},

	setup() {
		const { closeEcommerceModal } = useEcommerceModal();
		const modalTimeout = setTimeout(() => {
			closeEcommerceModal();
		}, 6000);

		onBeforeUnmount(() => {
			clearTimeout(modalTimeout);
		});

		return {
			closeEcommerceModal,
		};
	},
});
</script>

<style lang="scss" scoped>
.notification {
	position: fixed;
	top: 16px;
	right: 20px;
	z-index: $z-index-toasts;
	display: flex;
	align-items: flex-start;
	max-width: 400px;
	padding: 16px;
	margin-top: 16px;
	font-size: 14px;
	color: $color-light;
	background-color: $color-azure;
	border-radius: $border-radius-small;
	transition: all 0.5s ease-in-out;

	&__content {
		position: relative;
		display: flex;
		justify-content: flex-end;
		padding: 8px 16px;
		border-right: 1px solid $color-light;
	}

	&__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		margin-left: 8px;
		color: $color-light;
		border-radius: 100px;

		&:hover {
			background-color: $color-azure-dark;
		}
	}

	&__icon {
		align-self: center;
	}
}

.fade-enter-active {
	transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
