<template>
	<div class="feedback">
		<ZyroSvgDeprecated
			class="feedback__icon"
			name="smiley-face"
		/>
		<p class="feedback__text">
			<i18n-t
				tag="p"
				keypath="builder.editImage.tabSeo.NpsImage"
			>
				<p
					class="z-link z-link--dark"
					data-qa="feature-nps-modal-link"
					@click="openNps"
				>
					{{ $t('builder.editImage.tabSeo.NpsImageRateThisFeature') }}
				</p>
			</i18n-t>
		</p>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapActions } from 'vuex';
import { NPS_TYPE_FEATURE_TEXT } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	methods: {
		...mapActions('nps', ['setNpsData']),
		openNps() {
			this.setNpsData({
				question: `${this.$t('builder.npsRateQuestion')} ${this.$t('builder.npsRateText')}?`,
				isVisible: true,
				formType: NPS_TYPE_FEATURE_TEXT,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.feedback {
	display: flex;
	align-items: center;
	padding: 16px;
	font-size: 13px;

	&__icon {
		flex-shrink: 0;
		margin-right: 4px;
	}
}
</style>
