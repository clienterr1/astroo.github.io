<template>
	<section>
		<ZyroSettingsTitle>
			{{ $t('siteSettings.nav.general') }}
		</ZyroSettingsTitle>
		<BannerDomain v-if="(!customDomain || isCustomDomainPreview) && hasActiveSubscription" />
		<MetaImageUploadCollapsible
			:title="$t('common.favicon')"
			:label="$t('common.favicon')"
			:info-text="$t('siteSettings.general.favicon.infoText')"
			:meta-image-initial-image-origin="siteMeta.faviconOrigin"
			:meta-image-initial-image-path="siteMeta.faviconPath"
			qa="favicon"
			@save="saveFavicon"
		>
			<template #preview="{ src }">
				<SettingsBrowserPreview :src="src" />
			</template>
		</MetaImageUploadCollapsible>
		<MetaImageUploadCollapsible
			:title="$t('siteSettings.general.ogImage.heading')"
			:label="$t('siteSettings.general.ogImage.content.label')"
			:info-text="$t('siteSettings.general.ogImage.content.infoText')"
			:meta-image-initial-image-origin="siteMeta.ogImageOrigin"
			:meta-image-initial-image-path="siteMeta.ogImagePath"
			qa="ogimage"
			@save="saveOgImage"
		>
			<template #preview="{ src }">
				<OgImagePreview :src="src" />
			</template>
		</MetaImageUploadCollapsible>
		<CookieBanner />
		<ZyroCard class="www-prefix-card">
			<div class="www-prefix-card__toggle-container">
				<label
					for="www-prefix-toggle"
					class="z-body z-body--strong"
				>
					{{ $t('siteSettings.hasDomainWWWPrefixCardTitle') }}
				</label>
				<ZyroToggle
					id="www-prefix-toggle"
					:model-value="isWWWPrefixEnabled"
					@update:model-value="updateIsWWWPrefixEnabled"
				/>
			</div>
			<p>
				{{ $t('siteSettings.hasDomainWWWPrefixCardSubtitle') }}
			</p>
		</ZyroCard>
	</section>
</template>

<script>
import {
	mapState,
	mapGetters,
	mapMutations,
} from 'vuex';

import ZyroSettingsTitle from '@/components/site-settings/components/ZyroSettingsTitle.vue';
import BannerDomain from '@/components/site-settings/pages/general/components/BannerDomain.vue';
import CookieBanner from '@/components/site-settings/pages/general/components/CookieBanner.vue';
import MetaImageUploadCollapsible from '@/components/site-settings/pages/general/components/MetaImageUploadCollapsible.vue';
import OgImagePreview from '@/components/site-settings/pages/general/components/OgImagePreview.vue';
import SettingsBrowserPreview from '@/components/site-settings/pages/general/components/SettingsBrowserPreview.vue';
import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCard,
		ZyroToggle,
		BannerDomain,
		ZyroSettingsTitle,
		MetaImageUploadCollapsible,
		OgImagePreview,
		SettingsBrowserPreview,
		CookieBanner,
	},

	computed: {
		...mapState([
			'customDomain',
			'hasActiveSubscription',
		]),
		...mapGetters('subscription', ['hasActiveSubscription']),
		...mapGetters([
			'siteMeta',
			'isCustomDomainPreview',
		]),
		isWWWPrefixEnabled() {
			return this.siteMeta.shouldAddWWWPrefixToDomain;
		},
	},

	methods: {
		...mapMutations(['setWebsiteMeta']),
		saveFavicon({
			origin,
			path,
		}) {
			this.setWebsiteMeta({
				key: 'faviconOrigin',
				value: origin,
			});

			this.setWebsiteMeta({
				key: 'faviconPath',
				value: path,
			});
		},
		saveOgImage({
			origin,
			path,
			alt,
		}) {
			this.setWebsiteMeta({
				key: 'ogImageOrigin',
				value: origin,
			});
			this.setWebsiteMeta({
				key: 'ogImagePath',
				value: path,
			});
			this.setWebsiteMeta({
				key: 'ogImageAlt',
				value: alt,
			});
		},
		updateIsWWWPrefixEnabled(newValue) {
			this.setWebsiteMeta({
				key: 'shouldAddWWWPrefixToDomain',
				value: newValue,
			});
		},
	},
});
</script>
<style lang="scss" scoped>
.www-prefix-card {
	margin-bottom: 16px;

	&__toggle-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
}
</style>
