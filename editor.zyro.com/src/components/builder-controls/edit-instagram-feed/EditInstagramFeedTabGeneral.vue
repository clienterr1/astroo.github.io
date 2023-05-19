<template>
	<div>
		<div class="edit-instagram-feed__account">
			<DemoJoinZyroInlineDisclaimer
				v-if="isDemoMode"
				:text="$t('builder.demoBuilderChooseBuilderToConnectInstagram')"
			/>
			<div
				v-else-if="instagramUsername"
				class="edit-instagram-feed__connected"
			>
				<span class="edit-instagram-feed__status z-body-small">
					{{ $t('builder.editInstagram.tabGeneral.instagramConnected') }}
				</span>
				<a
					class="edit-instagram-feed__link z-body-small"
					:href="`https://instagram.com/${instagramUsername}/`"
					target="_blank"
				>
					@{{ instagramUsername }}
				</a>
				<ZyroButton
					theme="outline"
					@click="disconnectInstagram"
				>
					{{ $t('common.disconnect') }}
				</ZyroButton>
			</div>
			<div
				v-else
				class="edit-instagram-feed__connect"
			>
				<ZyroSvgDeprecated
					name="instagram"
					class="edit-instagram-feed__icon"
				/>
				<div class="edit-instagram-feed__description z-body-small">
					{{ $t('builder.editInstagram.tabGeneral.connectYourInstagramInfo') }}
				</div>
				<ZyroButton
					theme="primary"
					data-qa="connect-instagram-button"
					@click="connectInstagram"
				>
					{{ $t('builder.editInstagram.tabGeneral.connectInstagram') }}
				</ZyroButton>
			</div>
		</div>
		<ZyroFieldRange
			:label="$t('common.items')"
			units=""
			:model-value="itemCount"
			min="1"
			max="24"
			@update:model-value="updateItemCount"
		/>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { captureException } from '@sentry/browser';
import {
	mapState,
	mapGetters,
	mapActions,
	useStore,
} from 'vuex';

import {
	authorize,
	openAuthorizationWindow,
	deleteToken,
} from '@/api/InstagramApi';

import EventLogApi from '@/api/EventLogApi';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';
import { instagramBroadcastChannel } from '@/utils/broadcastChannels';
import { generateRandomId } from '@/utils/generateRandomId';

import DemoJoinZyroInlineDisclaimer from '@/components/reusable-components/DemoJoinZyroInlineDisclaimer.vue';

import {
	defineComponent,
	computed,
} from 'vue';

import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroFieldRange,
		ZyroSvgDeprecated,
		DemoJoinZyroInlineDisclaimer,
	},

	setup() {
		const {
			getters,
			dispatch,
		} = useStore();
		const currentElementId = computed(() => getters.currentElementId);
		const currentElementSettings = computed(() => getters.currentElementSettings);
		const itemCount = computed(() => currentElementSettings.value['item-count']);

		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		const updateItemCount = (newValue) => {
			dispatch('mergeCurrentElementData', {
				elementData: {
					settings: {
						'item-count': Number.parseInt(newValue, 10),
					},
				},
			});

			updateElementHeightOnDevices({
				elementId: currentElementId.value,
			});
		};

		return {
			currentElementId,
			currentElementSettings,
			itemCount,
			updateElementHeightOnDevices,
			updateItemCount,
		};
	},

	computed: {
		...mapState([
			'websiteId',
			'isDemoMode',
		]),
		...mapGetters(['currentElement']),
		instagramUsername() {
			return this.currentElementSettings.username;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		...mapActions('saving', ['saveWebsite']),
		...mapActionsNotifications({
			notify: NOTIFY,
		}),
		async handleInstagramMessage(message, CSRFtoken) {
			const {
				code,
				CSRFtoken: messageCSRFtoken,
				error: errorInQuery,
				errorDescription,
			} = message;

			// Making sure the authorization window was opened by the client
			if (CSRFtoken !== messageCSRFtoken) {
				return;
			}

			if (errorInQuery) {
				this.notify({
					origin: 'EditInstagramFeedTabGeneral',
					messageI18nKeyPath: 'builder.errorWhileAuthorizingInstagram',
					submitLabelI18nKeyPath: 'builder.errorWhileAuthorizingInstagram',
					submitCallback: this.connectInstagram,
				});

				captureException(errorDescription || errorInQuery);

				return;
			}

			try {
				const { username } = await authorize({
					siteId: this.websiteId,
					elementId: this.currentElementId,
					code,
				});

				EventLogApi.logEvent({
					eventName: 'instagram.connectAccount',
				});

				this.mergeCurrentElementData({
					elementData: {
						settings: {
							username,
						},
					},
				});
			} catch (error) {
				this.notify({
					origin: 'EditInstagramFeedTabGeneral',
					messageI18nKeyPath: 'builder.errorWhileAuthorizingInstagram',
					submitLabelI18nKeyPath: 'builder.AIHeatmapRetry',
					submitCallback: this.connectInstagram,
				});

				captureException(error);
			}
		},
		async connectInstagram() {
			this.saveWebsite();
			const CSRFtoken = generateRandomId();

			openAuthorizationWindow(JSON.stringify({
				CSRFtoken,
				siteId: this.websiteId,
			}));

			// Expecting code from pages/instagram/Auth component
			instagramBroadcastChannel.addEventListener('message', (message) => this.handleInstagramMessage(message, CSRFtoken));
		},

		async disconnectInstagram() {
			await deleteToken({
				siteId: this.websiteId,
				elementId: this.currentElementId,
			});
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						username: null,
					},
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.edit-instagram-feed {
	&__account {
		padding: 32px 0 40px;
		border-bottom: 0.5px solid $color-gray-border;
	}

	&__connected,
	&__connect {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	&__status {
		margin-bottom: 8px;
	}

	&__link {
		margin-bottom: 24px;
		text-decoration: none;
	}

	&__icon,
	&__description {
		margin-bottom: 24px;
	}

	&__description,
	&__status,
	&__link {
		text-align: center;
	}
}
</style>
