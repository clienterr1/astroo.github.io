<template>
	<div
		class="overlay-nps"
		:class="{ 'overlay-nps--mobile': isMobileMode }"
	>
		<ZyroPopup
			type="no-padding"
			show-arrow
			:show-close-button="false"
			:popper-options="{
				placement: 'top-start' ,
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [
								0,
								14,
							],
						},
					},

				],
			}"

			@toggle="toggleLayoutNps"
			@close="closeLayoutNps"
		>
			<template #trigger="{ toggle }">
				<div
					class="overlay-nps__button"
					data-qa="overlay-nps-button"
					@click="toggle"
				>
					<ZyroSvgDeprecated
						name="layout"
						class="overlay-nps__button__icon"
					/>
					{{ $t('builder.nps.rateSmartLayout') }}
				</div>
			</template>

			<template #default="{ close }">
				<BuilderNps @close="close" />
			</template>
		</ZyroPopup>
	</div>
</template>

<script>
import ZyroPopup from '@/components/global/ZyroPopup.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapActions,
	mapGetters,
} from 'vuex';

import BuilderNps from '@/components/builder-nps/BuilderNps.vue';
import {
	NPS_TYPE_FEATURE_LAYOUT,
	NPS_TYPE_FEATURE_MOBILE_LAYOUT,
} from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'OverlayNps',

	components: {
		ZyroPopup,
		ZyroSvgDeprecated,
		BuilderNps,
	},
	emits: [
		'overlay-nps-opened',
		'overlay-nps-opened',
	],

	computed: {
		...mapGetters('gui', ['isMobileMode']),
	},

	methods: {
		...mapActions('nps', ['setNpsData']),
		toggleLayoutNps(isVisible) {
			if (isVisible) {
				this.setNpsData({
					question: this.$t('builder.nps.rateSmartLayoutQuestion'),
					formType: this.isMobileMode ? NPS_TYPE_FEATURE_MOBILE_LAYOUT : NPS_TYPE_FEATURE_LAYOUT,
				});
				this.$emit('overlay-nps-opened', true);
			} else {
				this.closeLayoutNps();
			}
		},
		closeLayoutNps() {
			this.setNpsData({
				question: this.$t('builder.nps.ratingQuestion'),
			});
			this.$emit('overlay-nps-opened', false);
		},
	},
});
</script>

<style lang="scss" scoped>
.overlay-nps {
	pointer-events: auto;

	&__button {
		display: flex;
		align-items: center;
		padding: 4px 14px;
		font-size: 14px;
		color: $color-light;
		cursor: pointer;
		background-color: $color-gray-dark;
		border-radius: $border-radius-round;

		&__icon {
			margin-right: 6px;
		}
	}

	&--mobile {
		position: fixed;
		top: $header-height-editor + 16px;
		left: $sidebar-width-editor + 16px;
	}
}
</style>
