<template>
	<PopupFrame
		class="onboarding-popup-base"
		:max-width="maxWidth"
	>
		<ZyroButton
			v-if="isWithCloseButton"
			v-qa="'modal-btn-close'"
			class="onboarding-popup-base__close-button"
			@click="$emit('close')"
		>
			<template #icon>
				<Icon
					name="close"
					dimension="20px"
				/>
			</template>
		</ZyroButton>
		<div
			class="onboarding-popup-base__content"
			:style="popupContentStyles"
		>
			<slot />
		</div>
		<div
			v-if="hasSlotContent($slots.media)"
			class="onboarding-popup-base__media"
		>
			<slot name="media" />
		</div>
		<div
			v-if="hasSlotContent($slots.footer)"
			class="onboarding-popup-base__footer"
		>
			<slot name="footer" />
		</div>
	</PopupFrame>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import Icon from '@/components/global/Icon.vue';
import PopupFrame from '@/components/global/PopupFrame.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

export default defineComponent({
	components: {
		Icon,
		PopupFrame,
		ZyroButton,
	},

	props: {
		contentPadding: {
			type: String,
			default: '40px 24px',
		},
		maxWidth: {
			type: String,
			default: '350px',
		},
		isWithCloseButton: {
			type: Boolean,
			default: true,
		},
	},
	setup() {
		return {
			hasSlotContent,
		};
	},

	computed: {
		popupContentStyles() {
			return {
				'--content-padding': this.contentPadding,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.onboarding-popup-base {
	position: relative;
	z-index: $z-index-overlay-onboarding-popup;
	max-height: 100vh;
	overflow-y: auto;

	@include site-engine-mobile {
		width: 100vw;
	}

	&__content {
		padding: var(--content-padding);
	}

	&__media {
		border-top: 1px solid $color-gray-border;
	}

	&__footer {
		padding: 16px 24px;
		border-top: 1px solid $color-gray-border;
	}

	&__close-button {
		position: absolute;
		top: 7px;
		right: 7px;
	}
}
</style>
