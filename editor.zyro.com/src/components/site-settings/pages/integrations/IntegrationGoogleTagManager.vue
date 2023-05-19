<template>
	<Integration
		:integration-key="INTEGRATION_KEY_GOOGLE_TAG_MANAGER"
		icon="tag-manager"
		:name="$t('siteSettings.integrationGoogleTagManagerName')"
		:input-label="$t('siteSettings.integrationGoogleTagManagerLabel')"
		:input-placeholder="$t('siteSettings.integrationGoogleTagManagerExample')"
	>
		<IntegrationInfoText
			translation-key="siteSettings.integrationGoogleTagManagerMessage"
			:bold-spans="[
				$t('siteSettings.integrationGoogleTagManagerWorkspace'),
				'GTM-XXXXXX',
			]"
		/>
	</Integration>
</template>

<script>
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_GOOGLE_TAG_MANAGER } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Integration,
		IntegrationInfoText,
	},

	setup() {
		return {
			INTEGRATION_KEY_GOOGLE_TAG_MANAGER,
		};
	},
});
</script>
