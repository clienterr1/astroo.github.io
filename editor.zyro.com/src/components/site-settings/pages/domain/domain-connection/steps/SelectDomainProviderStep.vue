<template>
	<ZyroCard class="card">
		<div class="card__content">
			<h2 class="z-h5 card__title">
				{{ $t('siteSettings.domain.domainProviderStep.title') }}
			</h2>
			<div class="card__subcontent">
				<p class="z-body card__subtitle text-gray">
					{{ subtitleText }}
				</p>
			</div>
			<ZyroDropdown
				:model-value="currentProvider"
				class="card__select"
				:options="selectableProviders"
				theme="site-settings"
				@update:model-value="updateCurrentProvider"
			/>
			<div class="card__info-text">
				<i18n-t
					tag="p"
					class="z-body-small card__link"
					keypath="siteSettings.domain.domainProviderStep.whoIsYourProvider"
				>
					<a
						class="z-link"
						href="https://www.whois.com/"
						target="_blank"
					>
						{{ $t('siteSettings.domain.domainProviderStep.whoIsYourProviderLink') }}
					</a>
				</i18n-t>
			</div>
		</div>
	</ZyroCard>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';

import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import { ALL_PROVIDERS } from '@/constants';
import { useDomainConnection } from '@/use/useDomainConnection';

import {
	defineComponent,
	computed,
} from 'vue';

import { useI18n } from 'vue-i18n';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

export default defineComponent({
	components: {
		ZyroDropdown,
		ZyroCard,
	},

	setup() {
		const {
			providerData,
			customProviderData,
			setProviderData,
		} = useDomainConnection();

		const { t } = useI18n();

		const subtitleText = isHostingerBrand
			? t('siteSettings.domain.domainProviderStep.subtitleHostinger')
			: t('siteSettings.domain.domainProviderStep.subtitle');

		const currentProviderName = computed(() => providerData.value.providerName);
		const currentProvider = computed(() => ({
			title: currentProviderName.value,
			value: currentProviderName.value,
		}));

		const selectableProviders = computed(() => {
			const mappedProviders = ALL_PROVIDERS.map(({
				providerName,
				providerNameI18nKeyPath,
			}) => ({
				title: providerNameI18nKeyPath ? t(providerNameI18nKeyPath) : providerName,
				value: providerName,
			}));

			const customProvider = customProviderData.value ? {
				title: customProviderData.providerName,
				value: customProviderData.providerName,
			} : null;

			return [
				...(customProvider ? [customProvider] : []),
				...mappedProviders,
			];
		});

		const updateCurrentProvider = ({ value }) => {
			const providerToSet = ALL_PROVIDERS.find(({ providerName }) => providerName === value);

			setProviderData(providerToSet ?? customProviderData);
		};

		return {
			selectableProviders,
			currentProvider,
			updateCurrentProvider,
			subtitleText,
		};
	},

});
</script>

<style lang="scss" scoped>
@import "./ModalStepCard";

.card {
	overflow: visible;

	&__select {
		max-width: 400px;
		margin-bottom: 32px;
	}

	&__info-text {
		margin-top: 32px;
	}

	&__link {
		color: $color-gray;
	}
}
</style>
