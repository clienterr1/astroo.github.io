<template>
	<Integration
		:integration-key="INTEGRATION_KEY_GOOGLE_ANALYTICS"
		icon="analytics"
		:name="$t('siteSettings.integrationGoogleAnalyticsName')"
		:input-label="$t('siteSettings.integrationGoogleAnalyticsLabel')"
		:input-placeholder="$t('siteSettings.integrationGoogleAnalyticsExample')"
	>
		<IntegrationInfoText
			v-if="!isHostingerBrand"
			translation-key="siteSettings.integrationGoogleAnalyticsMessage"
			:link-href="$t('siteSettings.integrationGoogleAnalyticsLinkHref')"
			link-text="siteSettings.integrationGoogleAnalyticsLinkText"
		/>
	</Integration>
</template>

<script>
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_GOOGLE_ANALYTICS } from '@/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Integration,
		IntegrationInfoText,
	},

	setup() {
		return {
			INTEGRATION_KEY_GOOGLE_ANALYTICS,
			isHostingerBrand,
		};
	},
});
</script>
