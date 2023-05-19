<template>
	<ZyroCard
		v-qa="'connect-your-domain-modal'"
		class="card"
	>
		<div class="card__content">
			<h2 class="z-h5 card__title">
				{{ $t('builder.domainConnectionModalTitle') }}
			</h2>
			<p class="z-body card__subtitle">
				{{ $t('siteSettings.domain.enterDomainCard.subtitle') }}
			</p>
			<div class="card__options">
				<slot />
			</div>
			<ProviderCard
				v-if="isAbleToConnectHostingerDomain"
				class="hostinger-banner"
				icon="hostinger-logo"
			>
				<template #text>
					<i18n-t
						keypath="siteSettings.domain.enterDomainCard.hostingerDomainCardText"
						tag="span"
					>
						<span class="z-body--strong">
							{{ hostingerDomain }}
						</span>
						<span class="z-body--strong">
							{{ $t('siteSettings.domain.enterDomainCard.hostingerDomainCardTextSlot') }}
						</span>
					</i18n-t>
					<br>
				</template>
				<template #footer>
					<ZyroButton
						v-qa="'builder-domainconnection-btn-hostingerdomain'"
						class="hostinger-banner__button"
						theme="outline"
						color="black"
						@click="handleHostingerDomainConnection"
					>
						<ZyroLoader
							v-if="isLoading"
							size="14px"
							weight="2px"
						/>
						<span v-else>{{ $t('common.connect') }}</span>
					</ZyroButton>
				</template>
			</ProviderCard>
		</div>
	</ZyroCard>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	mapState,
	mapGetters,
} from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import ProviderCard from '@/components/site-settings/pages/domain/domain-connection/-partials/ProviderCard.vue';
import { DOMAIN_STEP_VERIFICATION_MODAL } from '@/constants';
import { useDomainConnection } from '@/use/useDomainConnection';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroLoader,
		ZyroCard,
		ProviderCard,
	},

	setup() {
		const {
			setCurrentModalStepComponent,
			connectHostingerDomain,
			isLoading,
			hasFailed,
		} = useDomainConnection();

		return {
			setCurrentModalStepComponent,
			connectHostingerDomain,
			isLoading,
			hasFailed,
		};
	},

	computed: {
		...mapState('user', ['hostingerDomain']),
		...mapGetters('user', ['isAbleToConnectHostingerDomain']),
	},

	methods: {
		async handleHostingerDomainConnection() {
			await this.connectHostingerDomain(this.hostingerDomain);

			if (!this.hasFailed) {
				this.setCurrentModalStepComponent(DOMAIN_STEP_VERIFICATION_MODAL);
			}
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/site-settings/pages/domain/domain-connection/steps/ModalStepCard";

.card {
	&__subtitle {
		color: $color-gray;
	}

	&__options {
		width: 100%;
		max-width: 600px;
	}
}

.hostinger-banner {
	width: 564px;

	@media screen and (max-width: $media-mobile) {
		width: 100%;
	}

	&__button {
		margin-top: 8px;
	}
}
</style>
