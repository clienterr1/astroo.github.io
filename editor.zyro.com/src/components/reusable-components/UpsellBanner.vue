<template>
	<DashboardBannerBase
		class="upsell-banner"
		:theme="theme"
	>
		<h3 class="upsell-banner__title z-body-small z-body-small--strong">
			<slot name="title" />
		</h3>
		<span
			v-if="hasSlotContent($slots.subtitle)"
			class="upsell-banner__subtitle z-body-small"
		>
			<slot name="subtitle" />
		</span>
		<ZyroButton
			class="upsell-banner__button"
			color="white"
			theme="primary"
			@click="$emit('button-click')"
		>
			<slot name="button-text" />
			{{ buttonText }}
		</ZyroButton>
	</DashboardBannerBase>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import ZyroButton from '@/components/global/ZyroButton.vue';
import DashboardBannerBase from '@/components/reusable-components/DashboardBannerBase.vue';

export default defineComponent({
	components: {
		ZyroButton,
		DashboardBannerBase,
	},

	props: {
		buttonText: {
			type: String,
			default: null,
		},
		theme: {
			type: String,
			required: true,
			validator: (theme) => [
				'pink-gradient',
				'blue',
			].includes(theme),
		},
	},
	setup() {
		return {
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.upsell-banner {
	display: flex;
	justify-content: center;
	margin: 32px;
	color: $color-light;

	@media screen and (max-width: $media-mobile) {
		flex-direction: column;
		align-items: flex-start;
		margin: 16px;
	}

	&__title + &__subtitle {
		@media screen and (min-width: $media-mobile) {
			// Include a space before subtitle on desktop.
			margin-left: 1ch;
		}

		@media screen and (max-width: $media-mobile) {
			margin-top: 2px;
		}
	}

	&__button {
		margin-left: 24px;

		@media screen and (max-width: $media-mobile) {
			margin-top: 16px;
			margin-left: 0;
		}
	}
}
</style>
