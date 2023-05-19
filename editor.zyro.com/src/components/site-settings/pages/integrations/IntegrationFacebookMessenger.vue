<template>
	<Integration
		:integration-key="INTEGRATION_KEY_FACEBOOK_MESSENGER"
		:is-footer-visible="v$.locale.$anyDirty"
		icon="messenger"
		class="integration-facebook-messenger"
		:name="$t('siteSettings.integrationFacebookMessengerName')"
		:input-label="$t('siteSettings.integrationFacebookMessengerLabel')"
		:input-placeholder="$t('siteSettings.integrationFacebookMessengerExample')"
		@reset="resetLocale"
		@submit="submitLocale"
	>
		<IntegrationInfoText
			v-if="!isHostingerBrand"
			translation-key="siteSettings.integrationFacebookMessengerStep1Message"
			:link-href="$t('siteSettings.integrationFacebookMessengerStep1LinkHref')"
			link-text="siteSettings.integrationFacebookMessengerStep1LinkText"
		/>

		<IntegrationInfoText
			v-if="!isHostingerBrand"
			translation-key="siteSettings.integrationFacebookMessengerStep2Message"
			:link-href="$t('siteSettings.integrationFacebookMessengerStep2LinkHref')"
			link-text="siteSettings.integrationFacebookMessengerStep2LinkText"
		/>

		<ZyroNotification
			mode="light"
			type="info"
			:message="$t('siteSettings.integrationFacebookMessengerNotification')"
		/>

		<template #input-suffix>
			<div>
				<ZyroDropdown
					v-model="locale"
					:options="MESSENGER_LOCALES"
					theme="site-settings"
					@update:model-value="v$.locale.$touch()"
				/>
			</div>
		</template>
	</Integration>
</template>

<script>
import { defineComponent } from 'vue';
import {
	mapGetters,
	mapMutations,
} from 'vuex';
import { useVuelidate } from '@vuelidate/core';

import {
	MESSENGER_LOCALES,
	DEFAULT_MESSENGER_LOCALE,
} from '@/components/site-settings/pages/integrations/facebookMessengerLocales';

import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroNotification from '@/components/site-settings/components/ZyroNotification.vue';
import Integration from '@/components/site-settings/pages/integrations/Integration.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import { INTEGRATION_KEY_FACEBOOK_MESSENGER } from '@/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

export default defineComponent({
	components: {
		ZyroDropdown,
		Integration,
		IntegrationInfoText,
		ZyroNotification,
	},

	setup() {
		return {
			v$: useVuelidate(),
			isHostingerBrand,
			MESSENGER_LOCALES,
			INTEGRATION_KEY_FACEBOOK_MESSENGER,
		};
	},

	validations() {
		return {
			locale: {},
		};
	},

	data() {
		return {
			locale: null,
		};
	},

	computed: {
		...mapGetters(['siteMeta']),
		currentMessengerLocaleFromMeta() {
			const activeLocale = MESSENGER_LOCALES.find(({ value }) => this.siteMeta.facebookMessengerLocale === value);

			return activeLocale || DEFAULT_MESSENGER_LOCALE;
		},
	},

	beforeMount() {
		this.locale = this.currentMessengerLocaleFromMeta || DEFAULT_MESSENGER_LOCALE;
	},

	methods: {
		...mapMutations(['setWebsiteMeta']),
		submitLocale() {
			this.setWebsiteMeta({
				key: 'facebookMessengerLocale',
				value: this.locale.value,
			});
			this.v$.$reset();
		},
		resetLocale() {
			this.locale = this.currentMessengerLocaleFromMeta;
			this.v$.$reset();
		},
	},
});
</script>
