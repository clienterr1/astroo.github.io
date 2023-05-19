<template>
	<div>
		<ZyroCollapsible
			v-qa="`sitesettings-generalsettings-card-cookie`"
			:is-open="isOpen"
			@toggle="isOpen = !isOpen"
		>
			<template #heading>
				{{ $t('siteSettings.general.cookieBanner.heading') }}
			</template>
			<template #tag>
				<ZyroStatus
					:status-done="isCompletedLabelVisible"
					:text-done="$t('common.completed')"
				/>
			</template>
			<template #content>
				<div>
					<ZyroFieldToggle
						id="cookieBannerCheck"
						v-model="isEnabled"
						:label="$t('siteSettings.general.cookieBanner.content.label')"
						:message="$t('siteSettings.general.cookieBanner.content.infoText')"
					/>
					<div>
						<ZyroFieldTextArea
							v-model="disclaimerText"
							input-data-qa="sitesettings-general-cookieBanner"
							:label="$t('siteSettings.cookieBannerLabel')"
							theme="secondary"
							:placeholder="$t('siteSettings.cookieBannerPlaceholderText')"
							:bold="false"
						/>
						<ZyroButton
							data-qa="pagesettings-button-cancel"
							@click="resetChanges"
						>
							{{ $t('siteSettings.cookieBannerRestoreButtonLabel') }}
						</ZyroButton>
					</div>
				</div>
			</template>
			<template
				v-if="hasOptionsChanged"
				#footer
			>
				<ZyroButton
					v-qa="`sitesettings-generalsettings-card-cookie-btn-cancel`"
					theme="plain"
					class="meta-option__footer-button"
					@click="activeModalName = 'confirm'"
				>
					{{ $t('common.cancel') }}
				</ZyroButton>

				<ZyroButton
					v-qa="`sitesettings-generalsettings-card-cookie-btn-save`"
					theme="primary"
					:disabled="!hasOptionsChanged"
					@click="saveCookiesOptions"
				>
					{{ $t('common.saveChanges') }}
				</ZyroButton>
			</template>
		</ZyroCollapsible>
		<SiteSettingsModal
			v-if="activeModalName === 'confirm'"
			:title="$t('common.cancelChanges')"
			:right-button-text="$t('common.discard')"
			:left-button-text="$t('common.continueEditing')"
			@close="activeModalName = null"
			@left-button-click="activeModalName = null"
			@right-button-click="resetChanges"
		>
			{{ $t('siteSettings.common.unsavedChangesText') }}
		</SiteSettingsModal>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import {
	mapState,
	mapGetters,
	mapMutations,
	mapActions,
	useStore,
} from 'vuex';

import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';

import EventLogApi from '@/api/EventLogApi';
import SiteSettingsModal from '@/components/site-settings/components/SiteSettingsModal.vue';
import ZyroCollapsible from '@/components/site-settings/components/ZyroCollapsible.vue';

import ZyroStatus from '@/components/site-settings/components/ZyroStatus.vue';
import { eventNames } from '@/data/analyticEventList';
import { COOKIE_BANNER_TRANSLATIONS } from '@/data';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroFieldToggle,
		ZyroCollapsible,
		ZyroStatus,
		SiteSettingsModal,
		ZyroFieldTextArea,
	},

	setup() {
		const { getters } = useStore();
		const isEnabled = ref(getters.siteMeta?.isCookieBarEnabled);
		const disclaimerText = ref(getters.currentLanguageData?.cookieBannerDisclaimer ?? COOKIE_BANNER_TRANSLATIONS.en.disclaimer);
		const isCompletedLabelVisible = computed(() => (isEnabled.value && !!getters.currentLanguageData?.cookieBannerDisclaimer));

		return {
			isEnabled,
			isCompletedLabelVisible,
			disclaimerText,
		};
	},

	data() {
		return {
			// initially hide 'completed' label to display 'update'
			isOpen: false,
			activeModalName: null,
		};
	},

	computed: {
		...mapState(['currentLocale']),
		...mapGetters([
			'siteMeta',
			'currentLanguageData',
			'siteLanguages',
		]),
		isCurrentValueChanged() {
			if (!this.currentLanguageData.cookieBannerDisclaimer) {
				return this.disclaimerText !== COOKIE_BANNER_TRANSLATIONS.en.disclaimer;
			}

			return this.currentLanguageData.cookieBannerDisclaimer !== this.disclaimerText;
		},
		hasOptionsChanged() {
			return this.isCurrentValueChanged || this.isEnabled !== this.siteMeta.isCookieBarEnabled;
		},
	},
	methods: {
		...mapActions(['updateLanguages']),
		...mapMutations(['setWebsiteMeta']),
		resetChanges() {
			this.isEnabled = this.siteMeta.isCookieBarEnabled;
			this.disclaimerText = COOKIE_BANNER_TRANSLATIONS[this.currentLocale]?.disclaimer
			?? COOKIE_BANNER_TRANSLATIONS.en.disclaimer;
			this.activeModalName = null;
		},
		saveCookiesOptions() {
			const acceptText = COOKIE_BANNER_TRANSLATIONS[this.currentLocale]?.accept ?? COOKIE_BANNER_TRANSLATIONS.en.accept;
			const declineText = COOKIE_BANNER_TRANSLATIONS[this.currentLocale]?.decline ?? COOKIE_BANNER_TRANSLATIONS.en.decline;

			this.setWebsiteMeta({
				key: 'isCookieBarEnabled',
				value: this.isEnabled,
			});

			this.updateLanguages({
				...this.siteLanguages,
				[this.currentLocale]: {
					...this.currentLanguageData,
					cookieBannerDisclaimer: this.disclaimerText,
					cookieBannerAcceptText: acceptText,
					cookieBannerDeclineText: declineText,
				},
			});

			EventLogApi.logEvent({
				eventName: eventNames.builder.save_meta,
				eventProperties: {
					meta: `CookieBanner ${this.isEnabled}`,
				},
			});

			this.isCompletedLabelVisible = true;
		},
	},
});
</script>

<style lang="scss" scoped>
.meta-option {
	&__footer-button {
		margin-right: 32px;

		@media screen and (max-width: $media-mobile) {
			margin-right: 24px;
		}
	}
}
</style>
