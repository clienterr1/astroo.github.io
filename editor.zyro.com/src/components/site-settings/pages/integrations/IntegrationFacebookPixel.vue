<template>
	<Integration
		:integration-key="INTEGRATION_KEY_FACEBOOK_PIXEL"
		icon="fb-px"
		:name="$t('siteSettings.integrationFacebookPixelName')"
		:input-label="$t('siteSettings.integrationFacebookPixelLabel')"
		:input-placeholder="$t('siteSettings.integrationFacebookPixelExample')"
	>
		<IntegrationInfoText
			v-if="!isHostingerBrand"
			translation-key="siteSettings.integrationFacebookPixelTip"
			:link-href="$t('siteSettings.integrationFacebookPixelLinkHref')"
			link-text="siteSettings.integrationFacebookPixelLinkText"
		/>
	</Integration>
</template>

<script>
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_FACEBOOK_PIXEL } from '@/constants';
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
			INTEGRATION_KEY_FACEBOOK_PIXEL,
		};
	},
});
</script>
