<template>
	<Integration
		:integration-key="INTEGRATION_KEY_GOOGLE_AD_MOB"
		icon="admob"
		input-tag="textarea"
		:name="$t('siteSettings.integrationGoogleAdMobName')"
		:input-label="$t('siteSettings.integrationGoogleAdMobLabel')"
		:input-placeholder="$t('siteSettings.integrationGoogleAdMobExample')"
	>
		<IntegrationInfoText translation-key="siteSettings.integrationGoogleAdMobMessage" />

		<ZyroNotification
			mode="light"
			type="info"
			:message="$t('siteSettings.integrationGoogleAdMobNotification')"
		/>
	</Integration>
</template>

<script>
import ZyroNotification from '@/components/site-settings/components/ZyroNotification.vue';
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_GOOGLE_AD_MOB } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Integration,
		ZyroNotification,
		IntegrationInfoText,
	},

	setup() {
		return {
			INTEGRATION_KEY_GOOGLE_AD_MOB,
		};
	},
});
</script>
