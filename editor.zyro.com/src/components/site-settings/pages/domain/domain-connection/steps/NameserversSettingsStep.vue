<template>
	<ZyroCard class="card">
		<div class="card__content">
			<h2 class="z-h5 card__title">
				{{ $t('siteSettings.domain.nameserversSettingsStep.title') }}
			</h2>
			<p class="card__subtitle z-body">
				{{ $t('siteSettings.domain.nameserversSettingsStep.subtitleText') }}
			</p>

			<div class="card__nameservers-lists">
				<div
					v-if="isRemoveNameserversColumnShown"
					class="nameservers-list"
				>
					<p class="nameservers-list__title z-body-small z-font-weight-bold">
						{{ $t('siteSettings.domain.nameserversSettingsStep.removeNameservers') }}
					</p>
					<div class="nameservers-list__item nameservers-list__item--rounded-top nameservers-list__item--no-bottom-border">
						<p class="z-body-small">
							{{ nameserversToShow[0] }}
						</p>
					</div>
					<div class="nameservers-list__item nameservers-list__item--rounded-bottom">
						<p class="z-body-small">
							{{ nameserversToShow[1] }}
						</p>
					</div>
				</div>

				<div class="nameservers-list">
					<p class="nameservers-list__title z-body-small z-font-weight-bold">
						{{ $t('siteSettings.domain.nameserversSettingsStep.addTheseNameservers') }}
					</p>
					<div class="nameservers-list__item nameservers-list__item--rounded-top nameservers-list__item--no-bottom-border">
						<p class="z-body-small">
							{{ requiredDNSValue1 }}
						</p>
						<div class="copy-icon__wrapper">
							<ZyroSvgDeprecated
								name="duplicate"
								class="copy-icon__icon"
								@click="copyToClipboard(requiredDNSValue1)"
							/>
						</div>
					</div>
					<div class="nameservers-list__item nameservers-list__item--rounded-bottom">
						<p class="z-body-small">
							{{ requiredDNSValue2 }}
						</p>
						<div class="copy-icon__wrapper">
							<ZyroSvgDeprecated
								name="duplicate"
								class="copy-icon__icon"
								@click="copyToClipboard(requiredDNSValue2)"
							/>
						</div>
					</div>
				</div>
			</div>

			<template v-if="!isHostingerBrand">
				<a
					class="z-body-small z-link card__link"
					:href="providerData.instructionsUrl"
					target="_blank"
				>
					{{ $t('siteSettings.domain.nameserversSettingsStep.howDoIFind') }}
				</a>
				<a
					class="z-body-small z-link"
					href="https://support.zyro.com/en/articles/4237563-connecting-a-domain-to-your-website"
					target="_blank"
				>
					{{ $t('siteSettings.domain.nameserversSettingsStep.linkText') }}
				</a>
			</template>
		</div>
	</ZyroCard>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import {
	DNS_ZYRO_1,
	DNS_ZYRO_2,
	DNS_HOSTINGER_1,
	DNS_HOSTINGER_2,
} from '@/constants';
import { useDomainConnection } from '@/use/useDomainConnection';

import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroCard,
	},

	setup() {
		const {
			currentNameservers,
			providerData,
		} = useDomainConnection();

		const requiredDNSValue1 = isHostingerBrand ? DNS_HOSTINGER_1 : DNS_ZYRO_1;
		const requiredDNSValue2 = isHostingerBrand ? DNS_HOSTINGER_2 : DNS_ZYRO_2;

		return {
			currentNameservers,
			providerData,
			requiredDNSValue1,
			requiredDNSValue2,
			isHostingerBrand,
		};
	},

	computed: {
		nameserversToShow() {
			return this.currentNameservers.slice(0, 2);
		},
		isRemoveNameserversColumnShown() {
			return this.nameserversToShow.length === 2;
		},
	},

	methods: {
		copyToClipboard(value) {
			navigator.clipboard.writeText(value);
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./ModalStepCard";

$cell-border-radius: 12px;

.card {
	&__link {
		&:first-of-type {
			margin-bottom: 8px;
		}
	}

	&__nameservers-lists {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-bottom: 32px;
	}
}

.copy-icon {
	&__wrapper {
		padding-left: 16px;
		margin-left: 16px;
		cursor: pointer;
		border-left: 1px solid $color-gray-border;
	}

	&__icon {
		color: $color-dark;
		transition: color 0.3s ease-in-out;

		&:hover,
		&:focus {
			color: $color-azure;
		}
	}
}

.nameservers-list {
	&__title {
		margin-bottom: 8px;
	}

	&:first-of-type {
		margin-bottom: 16px;
	}

	&__item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 292px;
		padding: 16px 24px;
		color: $color-gray;
		background-color: $color-gray-light;
		border: 1px solid $color-gray-border;

		@media screen and (max-width: $media-mobile) {
			min-width: unset;
		}

		&--rounded-top {
			border-top-left-radius: $cell-border-radius;
			border-top-right-radius: $cell-border-radius;
		}

		&--rounded-bottom {
			border-bottom-right-radius: $cell-border-radius;
			border-bottom-left-radius: $cell-border-radius;
		}

		&--no-bottom-border {
			border-bottom: 0;
		}
	}
}
</style>
