<template>
	<PopupFrame
		ref="popupCard"
		v-qa="dataQa"
		class="popup-card"
		:max-width="maxWidth"
		:class="{
			'popup-card--no-padding': type === 'no-padding',
			'popup-card--editor': type === 'editor',
			'popup-card--absolute': isAbsolute,
			'popup-card--full-height': isFullHeight,
		}"
		:with-arrow="showArrow"
		:style="computedStyles"
	>
		<div
			v-if="showCloseButton || title || tabs.length"
			ref="popupHead"
			class="popup-card__head"
		>
			<h4
				v-if="title"
				class="popup-card__title z-h5"
				:class="{ 'popup-card__title--no-margin-bottom': !tabs.length }"
			>
				<!-- TODO: different prop name. It looks like native HTML "title" attribute -->
				{{ title }}
				<slot name="title-suffix" />
			</h4>
			<ZyroButton
				v-if="showCloseButton"
				class="popup-card__close"
				data-qa="builder-popupcard-btn-close"
				:title="$t('common.close')"
				@click="$emit('close')"
			>
				<template #icon>
					<Icon
						name="close"
						dimensions="20px"
					/>
				</template>
			</ZyroButton>
			<ZyroTabs
				v-if="tabs.length"
				:tabs="tabs"
				:current-tab="currentTab"
				class="popup-card__tabs"
				@update:current-tab="$emit('update:current-tab', $event)"
			/>
		</div>
		<div
			class="popup-card__content"
			:class="{ 'popup-card__content--align-left': isLeftAligned }"
		>
			<slot />
		</div>
		<div
			v-if="showFooter"
			ref="popupFooter"
			class="popup-card__footer"
		>
			<slot
				v-if="!!hasSlotContent($slots.footer)"
				name="footer"
			/>
			<template v-else>
				<ZyroButton
					v-qa="'builder-popupcard-cancelbtn'"
					@click="$emit('close')"
				>
					{{ $t('common.cancel') }}
				</ZyroButton>
				<ZyroButton
					v-qa="'builder-popupcard-savebtn'"
					:disabled="error"
					theme="primary"
					@click="$emit('save')"
				>
					{{ saveBtnTitle ?? $t('common.save') }}
				</ZyroButton>
			</template>
		</div>
	</PopupFrame>
</template>

<script>

import { defineComponent } from 'vue';
import {
	disableBodyScroll,
	enableBodyScroll,
} from 'body-scroll-lock';

import Icon from '@/components/global/Icon.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import PopupFrame from '@/components/global/PopupFrame.vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

export default defineComponent({
	components: {
		Icon,
		PopupFrame,
		ZyroButton,
		ZyroTabs,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: '',
			validator: (type) => [
				'no-padding',
				'editor',
				'',
			].includes(type),
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
		error: {
			type: Boolean,
			default: false,
		},
		dataQa: {
			type: String,
			default: '',
		},
		isLeftAligned: {
			type: Boolean,
			default: false,
		},
		isAbsolute: {
			type: Boolean,
			default: false,
		},
		disableBodyScroll: {
			type: Boolean,
			default: false,
		},
		maxWidth: {
			type: String,
			default: '400px',
		},
		showArrow: {
			type: Boolean,
			required: false,
		},
		editorPopupWidth: {
			type: String,
			default: '360px',
		},
		saveBtnTitle: {
			type: String,
			default: null,
		},
		isFullHeight: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'close',
		'save',
		'update:current-tab',
	],

	setup() {
		return {
			hasSlotContent,
		};
	},

	computed: {
		computedStyles() {
			return {
				'--editor-popup-width': this.editorPopupWidth,
			};
		},
	},

	mounted() {
		if (this.disableBodyScroll) {
			disableBodyScroll(this.$refs.popupCard);
		}
	},

	beforeUnmount() {
		if (this.disableBodyScroll) {
			enableBodyScroll(this.$refs.popupCard);
		}
	},
});
</script>

<style lang="scss" scoped>
$popper-padding: 16px;

.popup-card {
	$this: &;

	position: relative;
	padding: 16px;
	margin-top: 0;

	&--full-height {
		height: calc(100vh - $header-height-editor - $popper-padding);
		overflow-y: hidden;

		@media screen and (max-width: $media-mobile) {
			margin: 0 $popper-padding 0 auto;
		}

		&#{&} {
			#{$this}__content {
				height: 100%;
				padding: 0;
			}
		}
	}

	&--no-padding {
		padding: 0;
		border-radius: $border-radius-small;
	}

	&--editor {
		width: var(--editor-popup-width);
		padding: 0;
		border: 1px solid $color-gray-light;
		border-radius: $border-radius-large;

		#{$this}__head {
			padding: 16px 16px 0;
		}

		#{$this}__content {
			padding: 8px 16px 16px;
		}
	}

	&--absolute {
		&#{&} {
			position: absolute;
		}
	}

	&__head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	}

	&__content {
		&--align-left {
			text-align: left;
		}
	}

	&__title {
		margin-right: 1em;
		margin-bottom: 20px;

		&--no-margin-bottom {
			margin-bottom: 0;
		}
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		padding: 12px 24px 14px;
		border-top: 1px solid $color-gray-border;
	}

	&__close {
		position: absolute;
		top: 8px;
		right: 8px;
		box-sizing: content-box;
		cursor: pointer;
		background-color: transparent;
		border: 0;
	}

	@media screen and (max-width: $media-mobile) {
		width: 100%;
	}
}
</style>
