<template>
	<section class="export">
		<ZyroSettingsTitle>
			{{ $t('builder.siteSettingsExportTitle') }}
		</ZyroSettingsTitle>
		<ZyroCard class="export-card">
			<div class="export-card__content">
				<ZyroSvgDeprecated
					class="export-card__icon"
					name="wordpress"
					dimensions="32px"
				/>
				<p class="z-body z-body--strong">
					{{ $t('builder.siteSettingsExportSubtitle') }}
				</p>
				<i18n-t
					keypath="builder.siteSettingsExportText"
					class="z-body--small export-card__description"
					tag="p"
				>
					<a
						href="https://support.hostinger.com/en/articles/6572573-website-builder-how-to-move-a-website-to-wordpress"
						target="_blank"
						class="z-body z-link text-link"
					>
						{{ $t('builder.siteSettingsExportLinkText') }}
					</a>
				</i18n-t>
				<ZyroButton
					class="export-card__button"
					theme="outline"
					:is-disabled="!isSitePublished"
					target="_blank"
					:href="exportLink"
					:title="$t('builder.siteSettingsExportButton')"
					download
				>
					<template #icon-left>
						<Icon
							name="cloud_download"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.siteSettingsExportButton') }}
				</ZyroButton>
				<InfoBanner
					v-if="!isSitePublished"
					class="export-card__info-banner"
					:title="$t('builder.siteSettingsExportInfoBanner')"
				/>
			</div>
		</ZyroCard>
	</section>
</template>

<script>

import { defineComponent } from 'vue';
import {
	mapState,
	mapGetters,
} from 'vuex';

import Icon from '@/components/global/Icon.vue';
import ZyroSettingsTitle from '@/components/site-settings/components/ZyroSettingsTitle.vue';
import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import InfoBanner from '@/components/ui/InfoBanner.vue';

export default defineComponent({
	name: 'Export',

	components: {
		Icon,
		ZyroSettingsTitle,
		ZyroCard,
		ZyroButton,
		ZyroSvgDeprecated,
		InfoBanner,
	},

	computed: {
		...mapState(['zyroDomain']),
		...mapGetters(['isSitePublished']),
		exportLink() {
			return `${import.meta.env.VITE_BACKEND_API_URL}/v3/sites/export/${this.$route.params.siteId}`;
		},
	},
});
</script>

<style lang="scss" scoped>
	.export-card {
		&__icon {
			margin-bottom: 10px;
		}

		&__description {
			margin: 8px 0 16px;
			color: $color-gray;
			letter-spacing: 0.25px;
		}

		&__button {
			&.disabled {
				background-color: $color-gray-border;
				border-color: $color-gray-border;
			}
		}

		&__info-banner {
			margin-top: 15px;
		}
	}
</style>
