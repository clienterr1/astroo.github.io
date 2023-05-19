<template>
	<div
		ref="connectionStatusContainer"
		class="connection-status"
		@mouseenter="setIsHeaderDomainConnectionStatusExpanded(true)"
		@mouseleave="setIsHeaderDomainConnectionStatusExpanded(false)"
	>
		<div
			class="connection-status__trigger"
		>
			<div class="connection-status__status">
				<div class="connection-status__status-dot" />
				<a
					v-qa="'header-connected-domain'"
					class="connection-status__domain-text z-body-small"
					:href="`https://${zyroDomain}`"
					target="_blank"
				>
					{{ zyroDomain }}
				</a>
			</div>
		</div>

		<Popup
			v-if="isHeaderDomainConnectionStatusExpanded"
			placement="bottom"
			:offset="0"
			:target-ref="$refs.connectionStatusContainer"
		>
			<div
				class="connection-status__hover-area"
				@mouseenter="setIsHeaderDomainConnectionStatusExpanded(true)"
				@mouseleave="setIsHeaderDomainConnectionStatusExpanded(false)"
			>
				<div class="connection-status-content">
					<a
						v-qa="'domain-card-connected-domain'"
						class="connection-status-content__domain-text domain-text z-body-small z-body-small--strong
						connection-status-content__title"
						:href="`https://${zyroDomain}`"
						target="_blank"
					>
						{{ zyroDomain }}
					</a>
					<ZyroPill
						v-qa="`zyro-domain-card-status-connected`"
						:text="$t('common.connected')"
						:theme="PILL_THEME_SUCCESS"
					/>
					<InfoBanner
						theme="info"
						class="connection-status-content__banner"
					>
						<template #title>
							<i18n-t
								tag="p"
								class="z-body-small"
								keypath="builder.headerZyroDomainStatusBanner"
							/>
						</template>
					</InfoBanner>
					<ZyroSeparator class="connection-status-content__separator" />
					<ZyroButton
						theme="outline"
						@click="openDomainConnection"
					>
						{{ $t('builder.publishModal.label') }}
					</ZyroButton>
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPill, { PILL_THEME_SUCCESS } from '@/components/global/ZyroPill.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import { mapState } from 'vuex';

import { useHeaderPopups } from '@/use/useHeaderPopups';
import InfoBanner from '@/components/ui/InfoBanner.vue';
import { MODAL_DOMAIN_CONNECTION } from '@/constants';
import Popup from '@/components/global/Popup.vue';

import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroPill,
		ZyroSeparator,
		InfoBanner,
		Popup,
	},

	setup() {
		const {
			setIsHeaderDomainConnectionStatusExpanded,
			isHeaderDomainConnectionStatusExpanded,
		} = useHeaderPopups();

		return {
			PILL_THEME_SUCCESS,
			setIsHeaderDomainConnectionStatusExpanded,
			isHeaderDomainConnectionStatusExpanded,
		};
	},

	computed: {
		...mapState(['zyroDomain']),
	},

	methods: {
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		openDomainConnection() {
			this.openModal({
				name: MODAL_DOMAIN_CONNECTION,
			});

			this.setIsHeaderDomainConnectionStatusExpanded(false);
		},
	},
});
</script>

<style lang="scss" scoped>
$popup-width: 370px;

@mixin hidden-text-overflow($max-width) {
	max-width: $max-width;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.connection-status {
	&__trigger {
		padding: 16px;
	}

	&__status {
		display: flex;
		gap: 8px;
		align-items: center;
		user-select: none;
	}

	&__status-dot {
		width: 8px;
		height: 8px;
		background-color: $color-success-dark;
		border-radius: 50%;
	}

	&__domain-text {
		@include hidden-text-overflow(200px);

		@media screen and (max-width: $media-desktop) {
			@include hidden-text-overflow(100px);
		}

		text-decoration: none;
	}

	&__hover-area {
		// center content popup under the trigger
		width: $popup-width;
		padding-top: 8px;
	}
}

.connection-status-content {
	$content-padding: 16px;

	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	padding: $content-padding;
	background: $color-light;
	border: 1px solid $color-gray-light;
	border-radius: 12px;
	box-shadow: $box-shadow;

	&__title {
		margin-bottom: 8px;
	}

	&__banner {
		width: 100%;
		margin-top: 16px;
	}

	&__separator {
		margin: 16px 0;
	}

	&__domain-text {
		@include hidden-text-overflow($popup-width - 2 * $content-padding);

		text-decoration: none;
	}
}
</style>
