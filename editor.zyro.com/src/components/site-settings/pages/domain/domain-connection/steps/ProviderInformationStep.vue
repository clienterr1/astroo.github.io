<template>
	<ZyroCard class="card">
		<div class="card__content">
			<h2 class="z-h5 card__title">
				{{ $t('siteSettings.domain.providerInformationStep.title') }}
			</h2>
			<div class="card__subcontent">
				<p class="z-body card__subtitle">
					{{ $t('siteSettings.domain.providerInformationStep.signInToWhereYouBoughtDomain') }}
				</p>
				<ol class="card__list">
					<li class="card__list-item card__list-item--rounded-top z-body-small">
						{{ $t('siteSettings.domain.providerInformationStep.firstStep') }}
					</li>
					<i18n-t
						v-if="providerData.url"
						tag="li"
						class="card__list-item card__list-item--no-top-border card__list-item--no-bottom-border z-body-small"
						keypath="siteSettings.domain.providerInformationStep.secondStep"
					>
						<a
							class="z-link"
							:href="getNonRelativeUrl(providerData.url)"
							target="_blank"
							rel="noopener noreferrer"
						>
							{{ $t('siteSettings.domain.providerInformationStep.secondStepLink') }}
						</a>
						<span>{{ providerData.providerName }}</span>
					</i18n-t>
					<li
						v-else
						class="card__list-item z-body-small"
					>
						{{ $t('siteSettings.domain.providerInformationStep.secondStepAlternative') }}
					</li>
					<li class="card__list-item card__list-item--rounded-bottom z-body-small">
						{{ $t('siteSettings.domain.providerInformationStep.thirdStep') }}
					</li>
				</ol>
			</div>
			<a
				v-if="!isHostingerBrand"
				class="z-link z-body-small"
				href="https://support.zyro.com/en/articles/4992775-pointing-a-domain-to-zyro-servers#h_e3f20b4e5b"
				target="_blank"
			>
				{{ $t('siteSettings.domain.providerInformationStep.linkText') }}
			</a>
		</div>
	</ZyroCard>
</template>

<script>
import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import { useDomainConnection } from '@/use/useDomainConnection';
import { getNonRelativeUrl } from '@/utils/urlValidators';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCard,
	},

	setup() {
		const { providerData } = useDomainConnection();

		return {
			getNonRelativeUrl,
			providerData,
			isHostingerBrand,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "./ModalStepCard";

$list-item-border-radius: 12px;

.card {
	&__list {
		margin-bottom: 32px;
		list-style-position: inside;
	}

	&__list-item {
		padding: 16px 0 16px 24px;
		color: $color-gray;
		background-color: $color-gray-light;
		border: 1px solid $color-gray-border;

		&--rounded-top {
			border-top-left-radius: $list-item-border-radius;
			border-top-right-radius: $list-item-border-radius;
		}

		&--rounded-bottom {
			border-bottom-right-radius: $list-item-border-radius;
			border-bottom-left-radius: $list-item-border-radius;
		}

		&--no-top-border {
			border-top: 0;
		}

		&--no-bottom-border {
			border-bottom: 0;
		}
	}
}

</style>
