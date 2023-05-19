<template>
	<div
		ref="tooltipRef"
		class="tooltip"
	>
		<div
			ref="trigger"
			class="trigger"
			v-on="triggerAction()"
		>
			<slot name="trigger" />
		</div>
		<Component
			:is="usePortal ? 'Teleport' : 'div'"
			v-if="show"
			to="body"
		>
			<div
				ref="tooltip"
				:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_TOOLTIP_CONTENT"
				:class="[
					`tooltip__content
						tooltip__content--${mode}
						tooltip__content--${size}
						tooltip__content--position-${contentPosition}
						body-small`,
					{
						'tooltip__content--modal' : isOnModal,
						'tooltip__content--drawer' : isOnDrawer,
						'tooltip__content--has-close-icon' : hasCloseIcon
					}
				]"
				:style="forcedPosition || tooltipPosition"
			>
				<div
					v-show="triangle"
					class="tooltip__triangle"
					:class="[
						`tooltip__triangle
							tooltip__triangle--${mode}`,
						{
							'tooltip__triangle--top': position === 'bottom',
							'tooltip__triangle--bottom': position === 'top',
							'tooltip__triangle--left': position === 'right',
							'tooltip__triangle--right': position === 'left'
						}
					]"
				/>
				<slot />
				<ZyroSvgDeprecated
					v-if="hasCloseIcon"
					data-qa="tooltip-btn-close"
					name="close-sm"
					:class="
						`icon-close-sm
							tooltip__close-icon
							tooltip__close-icon--${mode}
							tooltip__close-icon--${size}
							tooltip__close-icon--position-${contentPosition}`"
					@click="closeTooltip"
				/>
			</div>
		</Component>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapState } from 'vuex';
import positionUtils from '@/utils/positioning';
import { onClickOutside } from '@vueuse/core';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_TOOLTIP_CONTENT,
} from '@zyro-inc/site-modules/constants';
import {
	defineComponent,
	ref,
	Teleport,
} from 'vue';

const TOOLTIP_CLOSE_TIMEOUT = 2000;

export default defineComponent({

	components: {
		Teleport,
		ZyroSvgDeprecated,
	},

	props: {
		position: {
			type: String,
			default: 'bottom',
			validator: (position) => [
				'top',
				'right',
				'bottom',
				'left',
				'rightTop',
				'leftTop',
			].includes(position),
		},
		size: {
			type: String,
			default: 'large',
			validator: (size) => [
				'x-small',
				'small',
				'large',
				'x-large',
			].includes(size),
		},
		toggleEvent: {
			type: String,
			default: 'click',
			validator: (event) => [
				'hover',
				'click',
				'none',
			].includes(event),
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		hideTooltip: {
			type: Boolean,
			default: false,
		},
		contentPosition: {
			type: String,
			default: 'fixed',
			validator: (contentPosition) => [
				'absolute',
				'fixed',
			].includes(contentPosition),
		},
		usePortal: {
			type: Boolean,
			default: true,
		},
		forcedPosition: {
			type: [
				Object,
				Boolean,
			],
			default: false,
		},
		triangle: {
			type: Boolean,
			default: true,
		},
		isOnModal: {
			type: Boolean,
			default: false,
		},
		isOnDrawer: {
			type: Boolean,
			default: false,
		},
		mode: {
			type: String,
			default: 'light',
			validator: (mode) => [
				'light',
				'dark',
				'success',
			].includes(mode),
		},
		hasCloseIcon: {
			type: Boolean,
			default: false,
		},
		autoClose: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'trigger-click',
		'on-close',
	],

	setup(props, context) {
		const showTooltip = ref(false);
		const closeTimeout = ref(null);
		const tooltipPosition = ref({});
		const tooltipRef = ref(null);

		const closeTooltip = () => {
			context.emit('on-close');
			showTooltip.value = false;
		};

		onClickOutside(tooltipRef, (event) => {
			if (
				!event.target.closest('.tooltip__content')
				&& !props.hasCloseIcon
				&& showTooltip.value === true
			) {
				if (closeTimeout.value) {
					clearTimeout(closeTimeout.value);
				}

				closeTooltip();
			}
		});

		return {
			showTooltip,
			closeTimeout,
			tooltipPosition,
			tooltipRef,
			closeTooltip,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_TOOLTIP_CONTENT,
		};
	},

	computed: {
		...mapState('gui', [
			'mobilePreviewRef',
			'desktopPreviewRef',
			'isMobileView',
		]),
		show() {
			return this.showTooltip && !this.hideTooltip;
		},
	},

	watch: {
		async show() {
			await this.$nextTick;
			this.calculatePosition();
		},
	},

	created() {
		if (this.toggleEvent === 'none') {
			this.showTooltip = true;
		}
	},

	methods: {
		toggleTooltip() {
			this.showTooltip = !this.showTooltip;
		},
		triggerAction() {
			if (this.disabled) return {};
			switch (this.toggleEvent) {
			case 'none': // do nothing
				return {};
			case 'hover': // toggle on 'mouseenteer' / 'mouseleave'
				return {
					mouseenter: this.toggleTooltip,
					mouseleave: this.closeTooltip,
				};
			default: // toggle on 'click'
				this.$emit('trigger-click');

				return {
					click: () => {
						this.toggleTooltip();
						if (this.show && this.autoClose) {
							this.closeTimeout = setTimeout(this.closeTooltip, TOOLTIP_CLOSE_TIMEOUT);
						}
					},
				};
			}
		},
		calculatePosition() {
			if (!this.show || this.forcedPosition) {
				return;
			}

			const isAbsolute = this.contentPosition === 'absolute';
			// Calculate tooltip position
			const {
				trigger,
				tooltip,
			} = this.$refs;

			switch (this.position) {
			case 'bottom':
				this.tooltipPosition = positionUtils.bottom(trigger, tooltip, isAbsolute);
				break;
			case 'top':
				this.tooltipPosition = positionUtils.top(
					trigger,
					tooltip,
					isAbsolute,
					this.isMobileView ? this.mobilePreviewRef : this.desktopPreviewRef,
					15,
				);
				break;
			case 'right':
				this.tooltipPosition = positionUtils.right(trigger, tooltip, isAbsolute);
				break;
			case 'rightTop':
				this.tooltipPosition = positionUtils.rightTop(trigger, tooltip, isAbsolute);
				break;
			case 'leftTop':
				this.tooltipPosition = positionUtils.leftTop(trigger, tooltip, isAbsolute);
				break;
			// TODO: extend this with a first need
			default:
				this.tooltipPosition = positionUtils.bottom(trigger, tooltip, isAbsolute);
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.tooltip {
	$this: &;

	position: relative;

	&__content {
		z-index: $z-index-controls-tooltip;
		border-radius: 5px;
		box-shadow: $box-shadow;

		&--dark {
			color: $color-light;
			background: $color-dark;

			#{$this}__triangle {
				background: $color-dark;
			}
		}

		&--success {
			color: $color-light;
			background: $color-success;

			#{$this}__triangle {
				background: $color-success;
			}
		}

		&--light {
			color: $color-dark;
			background: $color-light;

			#{$this}__triangle {
				background: $color-light;
			}
		}

		&--modal {
			z-index: $z-index-modal-controls;
		}

		&--drawer {
			z-index: $z-index-layout-drawer;
		}

		&--x-small {
			padding: 0;
		}

		&--small {
			padding: 8px 16px;
		}

		&--large {
			padding: 12px 16px;
		}

		&--x-large {
			padding: 18px 24px;
		}

		&--position {
			top: 0;
			left: 0;

			&-absolute {
				position: absolute;
			}

			&-fixed {
				position: fixed;
			}
		}

		&--has-close-icon {
			padding-right: 32px;
		}
	}

	&__triangle {
		position: absolute;
		width: 8px;
		height: 8px;
		margin: auto;
		content: "";
		transform: rotate(45deg);

		&--top {
			top: -4px;
			right: 0;
			left: 0;
		}

		&--bottom {
			right: 0;
			bottom: -4px;
			left: 0;
		}

		&--left {
			top: 0;
			bottom: 0;
			left: -4px;
			background: blue;
		}

		&--right {
			top: 0;
			right: -4px;
			bottom: 0;
			background: red;
		}

		// TODO: handle other positions with a first need
	}

	&__close-icon {
		position: absolute;
		top: 0;
		right: 8px;
		cursor: pointer;

		&--x-small {
			top: 2px;
		}

		&--small {
			top: 10px;
		}

		&--large {
			top: 14px;
		}

		&--x-large {
			top: 20px;
		}
	}
}

.trigger {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
