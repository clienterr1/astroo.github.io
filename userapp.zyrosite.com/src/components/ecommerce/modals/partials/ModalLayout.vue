<template>
	<Transition name="fade">
		<div class="modal-wrapper">
			<div
				tabindex="-1"
				class="modal-backdrop"
				@click="handleCloseModalAction"
			/>
			<div
				ref="modal"
				:style="modalStyle"
				class="modal"
				tabindex="0"
				aria-modal="true"
				@keydown.esc="handleCloseModalAction"
			>
				<CloseButton
					class="modal__close-button"
					@click="handleCloseModalAction"
				/>
				<slot />
			</div>
		</div>
	</Transition>
</template>

<script>
import CloseButton from '@zyro-inc/site-modules/components/CloseButton.vue';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		CloseButton,
	},

	props: {
		backgroundColor: {
			type: String,
			default: 'var(--color-light)',
		},
		padding: {
			type: String,
			default: '16px',
		},
		width: {
			type: String,
			default: 'auto',
		},
		maxWidth: {
			type: String,
			default: 'unset',
		},
		overflow: {
			type: String,
			default: 'unset',
		},
	},

	setup() {
		const { closeEcommerceModal } = useEcommerceModal();

		return {
			closeEcommerceModal,
		};
	},

	computed: {
		modalStyle() {
			return {
				'--modal-background-color': this.backgroundColor,
				'--padding': this.padding,
				'--width': this.width,
				'--max-width': this.maxWidth,
				'--overflow': this.overflow,
			};
		},
	},

	mounted() {
		this.$refs.modal?.focus();
	},

	methods: {
		handleCloseModalAction() {
			this.closeEcommerceModal();

			const params = new URLSearchParams(window.location.search);

			if (!params.get('open-modal')) {
				return;
			}

			params.delete('open-modal');
			params.delete('product');

			const paramsString = params.toString();

			if (paramsString) {
				window.history.pushState(null, null, `?${paramsString}`);
			}
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.modal-wrapper {
	position: fixed;
	top: 50%;
	left: 50%;
	z-index: $z-index-site-engine-modal-overlay;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	transform: translate(-50%, -50%);

	@include site-engine-mobile {
		padding: 0 16px;
	}
}

.modal-backdrop {
	position: absolute;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background-color: rgba($color-dark, 0.5);
}

.modal {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: var(--width);
	min-width: 540px;
	max-width: var(--max-width);
	height: var(--height);
	padding: var(--padding);
	overflow: var(--overflow);
	font-family: var(--font-primary);
	text-align: center;
	background-color: var(--modal-background-color);
	outline: none;

	@include site-engine-mobile {
		min-width: unset;
	}

	&__close-button {
		position: absolute;
		top: 4px;
		right: 4px;
		z-index: 1;
		align-self: flex-end;
	}
}
</style>
