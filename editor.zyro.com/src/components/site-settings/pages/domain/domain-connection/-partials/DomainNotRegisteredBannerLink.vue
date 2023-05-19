<template>
	<i18n-t
		tag="a"
		class="link z-link"
		:href="domainLinkHref"
		:keypath="domainLinkTextPath"
	>
		<span class="z-font-weight-bold">{{ domain }}</span>
	</i18n-t>
</template>

<script>
import { mapState } from 'vuex';

import { freeTldsList } from '@/components/site-settings/pages/domain/domain-connection/-partials/freeTldsList';
import { useDomainConnection } from '@/use/useDomainConnection';
import {
	WWW_REDIRECT_PATHS,
	REDIRECT_PARAM_KEYS,
	REDIRECT_PARAM_VALUES,
} from '@/constants';
import { useNotifications } from '@/use/useNotifications';
import {
	getRedirectUrlToDashboard,
	getRedirectUrlToWWW,
} from '@/use/useRedirects';
import { getDomainProperties } from '@zyro-inc/site-modules/utils/domainUtils';

import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		domain: {
			type: String,
			default: null,
		},
	},

	setup() {
		const { notify } = useNotifications();
		const {
			fetchFreeDomainSubscription,
			freeDomainTicket,
			isFreeDomainAvailable,
		} = useDomainConnection();

		return {
			notify,
			getRedirectUrlToDashboard,
			getRedirectUrlToWWW,
			freeDomainTicket,
			fetchFreeDomainSubscription,
			isFreeDomainAvailable,
			WWW_REDIRECT_PATHS,
		};
	},

	computed: {
		...mapState(['websiteId']),
		freeTldsList() {
			if (this.freeDomainTicket?.extraTld) {
				return [
					...freeTldsList,
					this.freeDomainTicket.extraTld,
				];
			}

			return freeTldsList;
		},
		domainTld() {
			if (!this.domain) {
				return null;
			}

			return getDomainProperties(this.domain).tld;
		},
		isDomainTldClaimable() {
			if (!this.domain) {
				return false;
			}

			return freeTldsList.includes(`.${this.domainTld}`);
		},
		hasDomainToClaim() {
			return this.isFreeDomainAvailable && this.isDomainTldClaimable;
		},
		domainLinkTextPath() {
			return this.hasDomainToClaim ? 'builder.domainConnectionDomainTakenBannerSubtitleLinkToClaim' : 'builder.domainConnectionDomainTakenBannerSubtitleLinkToGet';
		},
		domainLinkHref() {
			const domainLinkParams = {
				[REDIRECT_PARAM_KEYS.DOMAIN_SEARCH]: this.domain,
				[REDIRECT_PARAM_KEYS.SITE_ID]: this.websiteId,
				[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_DOMAIN_CONNECTED,
			};

			if (this.hasDomainToClaim) {
				return this.getRedirectUrlToDashboard({
					path: WWW_REDIRECT_PATHS.CLAIM_FREE_DOMAIN,
					params: domainLinkParams,
				});
			}

			return this.getRedirectUrlToWWW({
				path: WWW_REDIRECT_PATHS.DOMAINS,
				params: domainLinkParams,
			});
		},
	},

	async beforeMount() {
		await this.fetchFreeDomainSubscription();
	},
});
</script>

<style lang="scss" scoped>
.link {
	display: inline;
}

</style>
