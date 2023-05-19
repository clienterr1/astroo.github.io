<template>
	<InfoBanner
		theme="warning"
		:title="$t('builder.domainConnectionDomainTakenBannerTitle')"
		class="banner"
	>
		<template #subtitle>
			<i18n-t
				keypath="builder.domainConnectionDomainTakenBannerSubtitle"
				class="banner__subtitle z-body-small"
			>
				<DomainNotRegisteredBannerLink :domain="domain" />
			</i18n-t>
		</template>
	</InfoBanner>
</template>

<script>
import InfoBanner from '@/components/ui/InfoBanner.vue';
import DomainNotRegisteredBannerLink from '@/components/site-settings/pages/domain/domain-connection/-partials/DomainNotRegisteredBannerLink.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		InfoBanner,
		DomainNotRegisteredBannerLink,
	},

	props: {
		domain: {
			type: String,
			default: null,
		},
	},
});
</script>

<style lang="scss" scoped>
.banner {
	&__subtitle {
		color: $color-gray;
	}
}
</style>
