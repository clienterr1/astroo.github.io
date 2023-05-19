<template>
	<Integration
		class="integration-custom-meta"
		:is-initially-open="true"
		:integration-key="INTEGRATION_KEY_CUSTOM_META"
		icon="custom-code"
		input-tag="textarea"
		is-input-text-monospaced
		:name="$t('siteSettings.integrationCustomCodeName')"
	>
		<IntegrationInfoText
			translation-key="siteSettings.integrationCustomCodeMessage"
			:bold-spans="['<head>']"
		/>
	</Integration>
</template>

<script>
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_CUSTOM_META } from '@/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Integration,
		IntegrationInfoText,
	},

	setup() {
		return {
			INTEGRATION_KEY_CUSTOM_META,
		};
	},
});
</script>
