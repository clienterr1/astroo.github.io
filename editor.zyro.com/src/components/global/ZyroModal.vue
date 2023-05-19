<template>
	<div
		class="modal-backdrop"
		:class="[position, { hide: hideBackdrop }]"
		:style="computedStyles"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP"
		@mousedown.self.prevent="onCloseModal()"
	>
		<div
			:ref="modalRefKey"
			class="modal"
			:class="{ 'modal--rounded': isRounded }"
			role="dialog"
			aria-labelledby="modalTitle"
			aria-describedby="modalDescription"
		>
			<h2
				v-if="title || hasSlotContent($slots.title)"
				class="modal__title"
				:class="{
					'modal__title--has-subtitle': subtitle,
					'z-h5': !isTitleCentered,
					'modal__title--centered z-body-small z-body-small--strong': isTitleCentered
				}"
			>
				<slot name="title">
					{{ title }}
				</slot>
			</h2>
			<p
				v-if="subtitle || hasSlotContent($slots.subtitle)"
				class="modal__subtitle z-body-small z-body-small--light"
			>
				<slot name="subtitle">
					{{ subtitle }}
				</slot>
			</p>
			<div
				class="modal__content"
				:class="{
					'modal__content--no-overflow': noOverflow,
					'modal__content--display-flex': useFlexForContent
				}"
				body-scroll-lock-ignore
			>
				<slot />
			</div>
			<ZyroButton
				v-if="showCloseButton"
				class="modal__close"
				data-qa="modal-btn-close"
				:title="$t('common.close')"
				@click="onCloseModal()"
			>
				<template #icon>
					<Icon
						name="close"
						dimensions="20px"
					/>
				</template>
			</ZyroButton>
			<div
				v-if="hasSlotContent($slots.footer)"
				class="modal__footer"
			>
				<slot name="footer" />
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import {
	disableBodyScroll,
	enableBodyScroll,
} from 'body-scroll-lock';

import {
	getCode,
	CODE,
} from '@zyro-inc/site-modules/utils/getCode';
import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP,
} from '@zyro-inc/site-modules/constants';
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import { generateRandomId } from '@/utils/generateRandomId';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	props: {
		position: {
			validator(value) {
				return [
					'center',
					'right',
					'left',
					'top',
					'bottom',
				].includes(value);
			},
			default: 'center',
		},
		showCloseButton: {
			type: Boolean,
			default: true,
		},
		maxWidth: {
			type: [
				Number,
				String,
			],
			default: '100%',
		},
		maxHeight: {
			type: [
				Number,
				String,
			],
			default: '100%',
		},
		width: {
			type: [
				Number,
				String,
			],
			default: '100%',
		},
		height: {
			type: [
				Number,
				String,
			],
			default: '100%',
		},
		minHeight: {
			type: [
				Number,
				String,
			],
			default: 'auto',
		},
		overflow: {
			type: String,
			default: 'auto',
		},
		hideBackdrop: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
		delay: {
			type: Number,
			default: 0,
		},
		noOverflow: {
			type: Boolean,
			default: false,
		},
		useFlexForContent: {
			type: Boolean,
			default: false,
		},
		isRounded: {
			type: Boolean,
			default: true,
		},
		contentPadding: {
			type: String,
			default: '',
		},
		modalMargin: {
			type: String,
			default: '',
		},
		isTitleCentered: {
			type: Boolean,
			default: false,
		},
	},

	emits: ['close-modal'],

	setup() {
		return {
			hasSlotContent,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP,
		};
	},

	data() {
		return {
			blockClosing: false,
			closingTimeout: null,
			modalId: generateRandomId(),
		};
	},

	computed: {
		computedStyles() {
			return {
				'--z-content-padding': this.contentPadding,
				'--modal-margin': this.modalMargin,
				'--modal-max-width': this.maxWidth,
				'--modal-max-height': this.maxHeight,
				'--modal-width': this.width,
				'--modal-height': this.height,
				'--modal-min-height': this.minHeight,

			};
		},
		modalRefKey() {
			return `modal-${this.modalId}`;
		},
	},

	created() {
		window.addEventListener('keydown', this.onEscapeClick);
	},

	mounted() {
		if (this.delay) {
			this.blockClosing = true;
			setTimeout(() => {
				this.blockClosing = false;
			}, this.delay);
		}

		disableBodyScroll(this.$refs[this.modalRefKey], {
			// Allow touch move is required for IOS devices
			// https://www.npmjs.com/package/body-scroll-lock#more-complex
			// eslint-disable-next-line consistent-return
			allowTouchMove: (el) => {
				while (el && el !== document.body) {
					if (el.getAttribute('body-scroll-lock-ignore') !== null) {
						return true;
					}

					// eslint-disable-next-line no-param-reassign
					el = el.parentElement;
				}
			},
		});
	},

	beforeUnmount() {
		window.removeEventListener('keydown', this.onEscapeClick);
		enableBodyScroll(this.$refs[this.modalRefKey]);
	},

	methods: {
		onCloseModal() {
			if (!this.blockClosing) {
				this.$emit('close-modal');
			}
		},
		onEscapeClick(event) {
			if (getCode(event) === CODE.Escape) {
				this.onCloseModal();
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.modal {
	position: relative;
	display: flex;
	flex-direction: column;
	width: var(--modal-width);
	max-width: var(--modal-max-width);
	height: var(--modal-height);
	min-height: var(--modal-min-height);
	max-height: var(--modal-max-height);
	margin: var(--modal-margin);
	cursor: default;
	background: $color-light;
	box-shadow: 0 5px 5px rgba($color-dark, 0.05), 0 10px 30px rgba($color-dark, 0.2);
	transition: all 0.3s ease;

	&--rounded {
		border-radius: $border-radius-large;
	}

	&__close {
		position: absolute;
		right: 0;
	}

	&__title {
		padding: 16px 24px;

		&--has-subtitle {
			padding: 16px 24px 0;
		}

		&--centered {
			text-align: center;
		}
	}

	&__subtitle {
		padding: 8px 24px;
		color: $color-gray;
	}

	&__content {
		height: 100%;
		padding: var(--z-content-padding, 0 24px 8px 24px);
		overflow: auto;

		&--display-flex {
			display: flex;
			flex-direction: column;
		}

		&--no-overflow {
			overflow: hidden;
		}
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		padding: 16px 24px;
		margin-top: auto;
		border-top: 1px solid $color-gray-border;
	}
}

.modal-backdrop {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: $z-index-modal;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background: rgba($color-dark, 0.7);
	transition: all 0.3s ease;

	&.right {
		justify-content: flex-end;
	}

	&.left {
		justify-content: flex-start;
	}

	&.up {
		align-items: flex-start;
	}

	&.down {
		align-items: flex-end;
	}

	&.hide {
		background-color: rgba($color-dark, 0);
	}
}
</style>
