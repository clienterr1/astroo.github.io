<template>
	<Integration
		:integration-key="INTEGRATION_KEY_GOOGLE_AD_SENSE"
		icon="adsense"
		input-tag="textarea"
		:name="$t('siteSettings.integrationGoogleAdSenseName')"
		:input-label="$t('siteSettings.integrationGoogleAdSenseLabel')"
		:input-placeholder="$t('siteSettings.integrationGoogleAdSenseExample')"
	>
		<IntegrationInfoText translation-key="siteSettings.integrationGoogleAdSenseMessage" />

		<ZyroNotification
			mode="light"
			type="info"
			:message="$t('siteSettings.integrationGoogleAdSenseNotification')"
		/>
	</Integration>
</template>

<script>
import ZyroNotification from '@/components/site-settings/components/ZyroNotification.vue';
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_GOOGLE_AD_SENSE } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Integration,
		ZyroNotification,
		IntegrationInfoText,
	},

	setup() {
		return {
			INTEGRATION_KEY_GOOGLE_AD_SENSE,
		};
	},
});
</script>
