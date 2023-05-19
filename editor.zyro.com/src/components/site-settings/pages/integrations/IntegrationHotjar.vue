<template>
	<Integration
		:integration-key="INTEGRATION_KEY_HOTJAR"
		icon="hotjar"
		:name="$t('siteSettings.integrationHotjarName')"
		:input-label="$t('siteSettings.integrationHotjarLabel')"
		:input-placeholder="$t('siteSettings.integrationHotjarExample')"
	>
		<IntegrationInfoText
			v-if="!isHostingerBrand"
			translation-key="siteSettings.integrationHotjarMessage"
			:link-href="$t('siteSettings.integrationHotjarLinkHref')"
			link-text="siteSettings.integrationHotjarLinkText"
		/>
	</Integration>
</template>

<script>
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_HOTJAR } from '@/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Integration,
		IntegrationInfoText,
	},

	setup() {
		return {
			isHostingerBrand,
			INTEGRATION_KEY_HOTJAR,
		};
	},
});
</script>
