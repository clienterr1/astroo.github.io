<template>
	<Integration
		:integration-key="INTEGRATION_KEY_WHATS_APP"
		:is-footer-visible="isDirty"
		icon="whatsapp-outline"
		:name="$t('siteSettings.integrationWhatsAppName')"
		:input-label="$t('siteSettings.integrationWhatsAppLabel')"
		:input-placeholder="$t('siteSettings.integrationWhatsAppExample')"
		:input-error-message="$t('siteSettings.integrationWhatsAppError')"
		@reset="reset"
		@submit="save"
	>
		<ZyroFieldTextArea
			input-data-qa="integrations-textarea-whatsapp-message"
			:model-value="whatsAppMessage"
			:placeholder="$t('siteSettings.integrationWhatsAppPlaceholderMessage')"
			:label="$t('siteSettings.integrationWhatsAppLabelMessage')"
			theme="secondary"
			@update:model-value="updateWhatsAppMessage"
		/>

		<IntegrationInfoText
			v-if="!isHostingerBrand"
			translation-key="siteSettings.integrationWhatsAppMessage"
			:link-href="$t('siteSettings.integrationWhatsAppLinkHref')"
			link-text="siteSettings.integrationWhatsAppLinkText"
		/>
	</Integration>
</template>

<script>
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';

import {
	mapGetters,
	mapMutations,
} from 'vuex';

import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_WHATS_APP } from '@/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldTextArea,
		Integration,
		IntegrationInfoText,
	},

	setup() {
		return {
			isHostingerBrand,
			INTEGRATION_KEY_WHATS_APP,
		};
	},

	data() {
		return {
			whatsAppMessage: '',
			isDirty: false,
		};
	},
	computed: {
		...mapGetters(['siteMeta']),
	},
	mounted() {
		this.whatsAppMessage = decodeURI(this.siteMeta?.whatsAppMessage || '');
	},
	methods: {
		...mapMutations(['setWebsiteMeta']),
		reset() {
			this.whatsAppMessage = decodeURI(this.siteMeta?.whatsAppMessage || '');
			this.isDirty = false;
		},
		save() {
			this.setWebsiteMeta({
				key: 'whatsAppMessage',
				value: encodeURI(this.whatsAppMessage),
			});
			this.isDirty = false;
		},
		updateWhatsAppMessage(newValue) {
			this.isDirty = true;
			this.whatsAppMessage = newValue;
		},
	},
});
</script>
