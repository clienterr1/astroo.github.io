<template>
	<section class="integration">
		<ZyroSettingsTitle>
			{{ $t('siteSettings.nav.integrations') }}
		</ZyroSettingsTitle>
		<div class="integration__container">
			<div class="integration__info">
				<ZyroText>
					<template #title>
						{{ $t('siteSettings.integrationInfoTextTitle') }}
					</template>
					{{ $t('siteSettings.integrationInfoTextMessage') }}
				</ZyroText>
			</div>
			<div class="integration__meta">
				<IntegrationCustomMeta />
				<JivochatIntegration />
				<IntegrationGoogleAnalytics />
				<IntegrationHotjar />
				<IntegrationFacebookPixel />
				<IntegrationFacebookMessenger />
				<IntegrationGoogleTagManager />
				<IntegrationWhatsApp />
				<IntegrationGoogleAdSense />
				<IntegrationGoogleAdMob />
			</div>
		</div>
	</section>
</template>

<script>
import ZyroSettingsTitle from '@/components/site-settings/components/ZyroSettingsTitle.vue';
import ZyroText from '@/components/site-settings/components/ZyroText.vue';
import IntegrationCustomMeta from '@/components/site-settings/pages/integrations/IntegrationCustomMeta.vue';
import IntegrationFacebookMessenger from '@/components/site-settings/pages/integrations/IntegrationFacebookMessenger.vue';
import IntegrationFacebookPixel from '@/components/site-settings/pages/integrations/IntegrationFacebookPixel.vue';
import IntegrationGoogleAdSense from '@/components/site-settings/pages/integrations/IntegrationGoogleAdSense.vue';
import IntegrationGoogleAnalytics from '@/components/site-settings/pages/integrations/IntegrationGoogleAnalytics.vue';
import IntegrationGoogleTagManager from '@/components/site-settings/pages/integrations/IntegrationGoogleTagManager.vue';
import IntegrationHotjar from '@/components/site-settings/pages/integrations/IntegrationHotjar.vue';
import IntegrationWhatsApp from '@/components/site-settings/pages/integrations/IntegrationWhatsApp.vue';
import JivochatIntegration from '@/components/site-settings/pages/integrations/jivochat/JivochatIntegration.vue';
import IntegrationGoogleAdMob from '@/components/site-settings/pages/integrations/IntegrationGoogleAdMob.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Integrations',

	components: {
		ZyroSettingsTitle,
		ZyroText,
		JivochatIntegration,
		IntegrationGoogleAnalytics,
		IntegrationHotjar,
		IntegrationFacebookPixel,
		IntegrationFacebookMessenger,
		IntegrationGoogleTagManager,
		IntegrationWhatsApp,
		IntegrationGoogleAdSense,
		IntegrationCustomMeta,
		IntegrationGoogleAdMob,
	},
});
</script>

<style lang="scss" scoped>
.integration {
	&__container {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
		}
	}

	&__info {
		width: 40%;
		margin-right: 40px;

		@media screen and (max-width: $media-mobile) {
			order: 2;
			width: 100%;
			margin-right: 0;
		}
	}

	&__meta {
		width: 60%;

		@media screen and (max-width: $media-mobile) {
			order: 1;
			width: 100%;
			margin-bottom: 32px;
		}
	}
}
</style>
