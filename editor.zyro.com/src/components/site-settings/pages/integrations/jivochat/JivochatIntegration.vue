<template>
	<ZyroCollapsible
		v-if="widgetId"
		v-qa="`sitesettings-integrations-${id}`"
		class="jivochat"
		:icon="icon"
		:is-open="isOpen"
		@toggle="isOpen = !isOpen"
	>
		<template #heading>
			<div class="jivochat__title">
				{{ name }}
			</div>
		</template>
		<template #tag>
			<ZyroStatus
				:text="$t('common.connect')"
				:status-done="true"
				:text-done="$t('common.saved')"
			/>
		</template>
		<template #content>
			<IntegrationInfoText
				translation-key="siteSettings.integrationJivoChatInstructionMessage"
				link-text="siteSettings.integrationJivoChatInstructionLinkText"
				:link-href="$t('siteSettings.integrationJivoChatInstructionLinkHref')"
			/>
			<ZyroButton
				v-if="widgetId"
				v-qa="'jivochat-remove'"
				color="red"
				class="jivochat__remove-button"
				@click="removeJivochat"
			>
				{{ $t('siteSettings.integrationJivoChatRemove') }}
			</ZyroButton>
		</template>
	</ZyroCollapsible>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	mapGetters,
	mapMutations,
} from 'vuex';

import ZyroCollapsible from '@/components/site-settings/components/ZyroCollapsible.vue';
import ZyroStatus from '@/components/site-settings/components/ZyroStatus.vue';
import IntegrationInfoText from '@/components/site-settings/pages/integrations/components/IntegrationInfoText.vue';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';

import { defineComponent } from 'vue';

const JIVOCHAT_ID = 'jivoChat';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroCollapsible,
		ZyroStatus,
		IntegrationInfoText,
	},

	data() {
		return {
			icon: 'jivochat',
			id: JIVOCHAT_ID,
			name: this.$t('siteSettings.integrationJivoChatName'),
			isOpen: false,
		};
	},

	computed: {
		...mapGetters(['siteMeta']),
		widgetId() {
			return this.siteMeta?.[this.id];
		},
	},

	methods: {
		...mapActionsNotifications({
			notify: NOTIFY,
		}),
		...mapMutations(['setWebsiteMeta']),
		removeJivochat() {
			this.setWebsiteMeta({
				key: 'jivoChat',
				value: '',
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.jivochat {
	&__title {
		display: flex;
		gap: 8px;
	}

	&__remove-button {
		margin-top: 16px;
	}
}

.integration {
	&__meta {
		width: 60%;

		@media screen and (max-width: $media-mobile) {
			order: 1;
			width: 100%;
			margin-bottom: 32px;
		}

		&-footer {
			margin-right: 32px;

			@media screen and (max-width: $media-mobile) {
				margin-right: 24px;
			}
		}
	}
}
</style>
