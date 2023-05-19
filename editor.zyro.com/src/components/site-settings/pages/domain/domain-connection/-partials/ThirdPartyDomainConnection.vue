<template>
	<DomainConnectionFirstStepLayout>
		<form
			class="card__input-wrapper"
			@submit.prevent="$emit('submit')"
		>
			<ZyroFieldInput
				:model-value="domainInputValue"
				class="card__input"
				input-theme="secondary"
				:placeholder="$t('siteSettings.domain.enterDomainCard.placeholder')"
				:bold="false"
				:error="domainInputError"
				:focus-on-mount="true"
				input-data-qa="sitesettings-domain-input-domainname"
				@update:model-value="$emit('update-domain-value', $event)"
			/>
			<DomainNotRegisteredBanner
				v-if="isDomainAvailableToRegisterBannerShown"
				:domain="domainInputValue"
			/>
			<div v-else>
				<InfoBanner
					theme="info"
					class="card__banner"
					:subtitle="$t('builder.domainConnectionDomainNameInfoBannerText')"
				/>
				<a
					class="card__link z-body-small z-link"
					:href="getRedirectUrlToWWW({ path: WWW_REDIRECT_PATHS.DOMAINS })"
				>
					{{ $t('siteSettings.domainConnectionModalGetADomain') }}
				</a>
			</div>
		</form>
	</DomainConnectionFirstStepLayout>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import DomainConnectionFirstStepLayout from '@/components/site-settings/pages/domain/domain-connection/-partials/DomainConnectionFirstStepLayout.vue';
import DomainNotRegisteredBanner from '@/components/site-settings/pages/domain/domain-connection/-partials/DomainNotRegisteredBanner.vue';
import InfoBanner from '@/components/ui/InfoBanner.vue';
import { WWW_REDIRECT_PATHS } from '@/constants';
import { getRedirectUrlToWWW } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroFieldInput,
		InfoBanner,
		DomainNotRegisteredBanner,
		DomainConnectionFirstStepLayout,
	},

	props: {
		domainInputValue: {
			type: String,
			default: '',
		},
		domainInputError: {
			type: String,
			default: '',
		},
		isDomainAvailableToRegisterBannerShown: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		return {
			getRedirectUrlToWWW,
			WWW_REDIRECT_PATHS,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/site-settings/pages/domain/domain-connection/steps/ModalStepCard";

.card {
	&__input-wrapper {
		max-width: 483px;
		margin-right: auto;
		margin-left: auto;
		text-align: center;
	}

	&__input {
		margin-bottom: 24px;
	}

	&__banner {
		margin-bottom: 32px;
	}
}
</style>
