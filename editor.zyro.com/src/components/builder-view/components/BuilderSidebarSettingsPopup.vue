<template>
	<div>
		<template v-if="isDemoMode || user || $options.isLocalEnv">
			<ZyroButton
				ref="triggerButtonSettings"
				class="sidebar-popup__trigger-button z-body-small z-body-small--strong"
				data-qa="builder-header-btn-settings"
				color="white"
				:title="title"
			>
				<template #icon>
					<Icon
						:name="icon"
						:is-filled="isIconFilled"
					/>
				</template>
				<p v-if="isSidebarExpanded">
					{{ title }}
				</p>
			</ZyroButton>
			<Popup
				v-if="isActive"
				:target-ref="$refs.triggerButtonSettings?.$el"
				class="sidebar-popup"
				@click-outside="$emit('close-popup')"
			>
				<div class="sidebar-popup__content">
					<ul v-if="!isDemoMode">
						<li
							v-for="item in SETTINGS_ITEMS"
							:key="item.titlePath"
							class="sidebar-popup__list-item"
							:class="{ 'sidebar-popup__list-item__divider': item.id === SIDEBAR_SETTINGS_POPUP_ITEM_ID_EXPORT }"
						>
							<ZyroButton
								v-qa="`builder-header-settingsddl-${$t(item.titlePath)}`"
								class="sidebar-popup__button z-body-small"
								@click="handleButtonClick({
									buttonAction: item.clickHandler,
									eventName: item.eventName
								})"
							>
								{{ $t(item.titlePath) }}
							</ZyroButton>
						</li>
					</ul>
					<div
						v-if="!isHostingerBrand"
						class="settings__lang-switcher"
						@mouseenter="toggleList"
						@mouseleave="toggleList"
					>
						<ZyroButton
							class="z-body-small"
							data-qa="builder-header-settingsddl-language"
						>
							<template #icon-right>
								<Icon
									name="language"
									dimensions="16px"
								/>
							</template>
							{{ $t('common.language') }}
						</ZyroButton>
						<span class="settings__lang-switcher-text z-body-small">{{ currentLanguage }}</span>

						<LanguageSwitcher
							v-if="isListOpen"
							class="settings__languages-list"
						/>
					</div>
				</div>
			</Popup>
		</template>
		<template v-else>
			<ZyroButton
				ref="triggerButtonLanguage"
				color="white"
				@click="$emit('toggle')"
			>
				<template #icon>
					<Icon
						name="globe"
						dimensions="16px"
						is-custom
					/>
				</template>
			</ZyroButton>
			<Popup
				v-if="isActive"
				:target-ref="$refs.triggerButtonLanguage && $refs.triggerButtonLanguage.$el"
				@click-outside="$emit('close-popup')"
			>
				<LanguageSwitcher />
			</Popup>
		</template>
		<Teleport
			v-if="isAssetManagerVisible"
			to="body"
		>
			<AssetManager
				is-asset-select-button-hidden
				@close="isAssetManagerVisible = false"
			/>
		</Teleport>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';

import { mapState } from 'vuex';
import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';

import {
	GENERAL_SETTINGS_ROUTE,
	INTEGRATIONS_SETTINGS_ROUTE,
	ANALYTICS_SETTINGS_ROUTE,
	SEO_SETTINGS_ROUTE,
	FORMS_SETTINGS_ROUTE,
	EXPORT_SETTINGS_ROUTE,
} from '@/constants/routes';
import {
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_GENERAL,
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_INTEGRATIONS,
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_ANALYTICS,
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_SEO,
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_FORMS,
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_ASSETS,
	SIDEBAR_SETTINGS_POPUP_ITEM_ID_EXPORT,
} from '@/constants';
import { getLocale } from '@/utils/i18n/supportedLocales';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';
import LanguageSwitcher from '@/components/builder-view/components/LanguageSwitcher.vue';
import EventLogApi from '@/api/EventLogApi';
import { useRouter } from 'vue-router';

const isLocalEnvironment = import.meta.env.DEV;

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		Popup,
		LanguageSwitcher,
		AssetManager,
	},
	props: {
		isActive: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		isIconFilled: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'toggle',
		'close-popup',
	],
	setup() {
		const router = useRouter();
		const isAssetManagerVisible = ref(false);

		const SETTINGS_ITEMS = [
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_GENERAL,
				titlePath: 'siteSettings.nav.general',
				clickHandler: () => router.push({
					name: GENERAL_SETTINGS_ROUTE,
				}),
				eventName: 'website_builder.website_settings_general_settings.enter',
			},
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_INTEGRATIONS,
				titlePath: 'siteSettings.nav.integrations',
				clickHandler: () => router.push({
					name: INTEGRATIONS_SETTINGS_ROUTE,
				}),
				eventName: 'website_builder.website_settings_integrations.enter',
			},
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_ANALYTICS,
				titlePath: 'builder.analytics',
				clickHandler: () => router.push({
					name: ANALYTICS_SETTINGS_ROUTE,
				}),
				eventName: 'website_builder.website_settings_analytics.enter',
			},
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_SEO,
				titlePath: 'siteSettings.nav.seo',
				clickHandler: () => router.push({
					name: SEO_SETTINGS_ROUTE,
				}),
				eventName: 'website_builder.website_settings_seo.enter',
			},
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_FORMS,
				titlePath: 'siteSettings.nav.forms',
				clickHandler: () => router.push({
					name: FORMS_SETTINGS_ROUTE,
				}),
				eventName: 'website_builder.website_settings_form_submissions.enter',
			},
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_ASSETS,
				titlePath: 'builder.assetManagerMediaLibrary',
				clickHandler: () => {
					isAssetManagerVisible.value = true;
				},
				eventName: 'website_builder.website_settings_media_library.enter',
			},
			{
				id: SIDEBAR_SETTINGS_POPUP_ITEM_ID_EXPORT,
				titlePath: 'siteSettings.nav.export',
				clickHandler: () => router.push({
					name: EXPORT_SETTINGS_ROUTE,
				}),
				eventName: 'website_builder.website_settings_export_wordpress.enter',
			},
		];

		return {
			SETTINGS_ITEMS,
			SIDEBAR_SETTINGS_POPUP_ITEM_ID_EXPORT,
			EXPORT_SETTINGS_ROUTE,
			isHostingerBrand,
			isAssetManagerVisible,
		};
	},
	data() {
		return {
			isListOpen: false,
		};
	},
	computed: {
		...mapState(['isDemoMode']),
		...mapState('user', ['user']),
		...mapState('gui', ['isSidebarExpanded']),
		currentLanguage() {
			return getLocale(this.$i18n.locale).language;
		},
	},
	methods: {
		toggleList() {
			this.isListOpen = !this.isListOpen;
		},
		handleButtonClick({
			buttonAction,
			eventName,
		}) {
			buttonAction();

			EventLogApi.logEvent({
				eventName,
				eventProperties: {
					location: 'side_bar_settings_popup',
				},
				isHostingerEvent: true,
			});

			this.$emit('close-popup');
		},
	},
	isLocalEnv: isLocalEnvironment,
});
</script>

<style lang="scss" scoped>
@import "./BuilderSidebarPopup";

.settings {
	&__languages-list {
		position: absolute;
		bottom: 0;
		left: $popup-width;
	}

	&__lang-switcher {
		padding: 18px 12px;
		background: $color-light;
		border-radius: $border-radius-small;
	}

	&__lang-switcher-text {
		padding-left: 18px;
		color: $color-gray;
	}
}
</style>
