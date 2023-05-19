<template>
	<DomainConnectionFirstStepLayout>
		<ListOption
			v-for="domain in unusedDomainsList"
			:key="domain.related_domain_id"
			:model-value="currentlySelectedOption"
			:value="domain.domain"
			@update:model-value="updateSelectedDomainConnectionOption({
				option: DOMAIN_OPTION_ZYRO,
				domainValue: domain.domain
			})"
		>
			<template #title>
				<p class="z-body-small z-body-small--strong">
					{{ domain.domain }}
				</p>
			</template>
		</ListOption>
		<ListOption
			v-if="isFreeDomainAvailable"
			:model-value="currentlySelectedOption"
			:value="DOMAIN_OPTION_FREE"
			class="claim-free-domain"
			@update:model-value="updateSelectedDomainConnectionOption({ option: DOMAIN_OPTION_FREE })"
		>
			<template #title>
				<div class="claim-free-domain__title-container">
					<p class="z-body-small z-body-small--strong">
						{{ $t('builder.publishModalClaimFreeDomainCardTitle') }}
					</p>
					<ZyroPill
						text-class="z-button-small"
						class="claim-free-domain__pill"
						:text="$t('builder.publishModalClaimFreeDomainCardPillText')"
						text-color="var(--color-primary)"
						background-color="var(--color-primary-light)"
					/>
				</div>
			</template>
			<p class="claim-free-domain__title__subtitle z-body-small">
				{{ $t('builder.publishModalClaimFreeDomainCardSubtitle') }}
			</p>
		</ListOption>
		<ListOption
			:model-value="currentlySelectedOption"
			:value="DOMAIN_OPTION_THIRD_PARTY"
			@update:model-value="updateSelectedDomainConnectionOption({ option: DOMAIN_OPTION_THIRD_PARTY })"
		>
			<template #title>
				<p class="z-body-small z-body-small--strong">
					{{ $t('siteSettings.domainConnectionModalUseOwnDomainTitle') }}
				</p>
			</template>
		</ListOption>
		<ListOption
			:model-value="currentlySelectedOption"
			:value="DOMAIN_OPTION_BUY"
			@update:model-value="updateSelectedDomainConnectionOption({ option: DOMAIN_OPTION_BUY })"
		>
			<template #title>
				<p class="z-body-small z-body-small--strong">
					{{ $t('builder.getNewDomain') }}
				</p>
			</template>
		</ListOption>
		<InfoBanner
			theme="info"
			class="banner"
			:subtitle="$t('builder.domainConnectionDomainNameInfoBannerText')"
		/>
	</DomainConnectionFirstStepLayout>
</template>

<script>
import ZyroPill from '@/components/global/ZyroPill.vue';

import DomainConnectionFirstStepLayout from '@/components/site-settings/pages/domain/domain-connection/-partials/DomainConnectionFirstStepLayout.vue';
import {
	DOMAIN_OPTION_THIRD_PARTY,
	DOMAIN_OPTION_FREE,
	DOMAIN_OPTION_ZYRO,
	DOMAIN_OPTION_BUY,
} from '@/constants';
import InfoBanner from '@/components/ui/InfoBanner.vue';
import { useDomainConnection } from '@/use/useDomainConnection';
import ListOption from '@/components/ui/ListOption.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroPill,
		DomainConnectionFirstStepLayout,
		ListOption,
		InfoBanner,
	},

	props: {
		selectedDomainConnectionOption: {
			type: String,
			default: null,
		},
		domainValue: {
			type: String,
			default: null,
		},
	},
	emits: [
		'update-domain-connection-option',
		'update-domain-value',
	],

	setup() {
		const {
			unusedDomainsList,
			isFreeDomainAvailable,
		} = useDomainConnection();

		return {
			unusedDomainsList,
			isFreeDomainAvailable,
			DOMAIN_OPTION_THIRD_PARTY,
			DOMAIN_OPTION_FREE,
			DOMAIN_OPTION_ZYRO,
			DOMAIN_OPTION_BUY,
		};
	},

	computed: {
		currentlySelectedOption() {
			return this.selectedDomainConnectionOption === DOMAIN_OPTION_ZYRO ? this.domainValue : this.selectedDomainConnectionOption;
		},
	},

	methods: {
		updateSelectedDomainConnectionOption({
			option,
			domainValue,
		}) {
			this.$emit('update-domain-connection-option', option);
			this.$emit('update-domain-value', domainValue || '');
		},
	},
});
</script>

<style lang="scss" scoped>
.claim-free-domain {
	&__title-container {
		display: flex;
		gap: 8px;
		margin-bottom: 8px;
	}

	&__subtitle {
		color: $color-gray;
	}

	&__pill {
		margin-top: -2px;
	}
}

.banner {
	margin-top: 16px;
}
</style>
