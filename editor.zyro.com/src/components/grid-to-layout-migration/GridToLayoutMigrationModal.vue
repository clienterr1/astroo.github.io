<template>
	<ZyroModal
		:max-width="MODAL_MAX_WIDTH"
		:max-height="MODAL_MAX_HEIGHT"
		height="auto"
		:title="$t('builder.gridToLayoutMigrationModalTitle')"
		position="center"
		@close-modal="$emit('close-modal')"
	>
		<div class="migration-to-layout-modal">
			<i18n-t
				tag="p"
				keypath="builder.gridToLayoutMigrationSubtitle"
				class="migration-to-layout-modal__subtitle"
			>
				<b>{{ $t('builder.gridToLayoutMigrationSubtitleBoldedPart') }}</b>
			</i18n-t>
			<div
				class="migration-to-layout-modal__video"
			>
				<video
					width="100%"
					height="100%"
					controls
					autoplay
					loop
				>
					<source
						src="@/assets/images/migration-to-layout.webm"
						type="video/webm"
					>
				</video>
			</div>

			<InfoBanner
				v-if="hasMigrationToLayoutModifications"
				v-qa="'grid-to-layout-migation-info-banner'"
				theme="warning"
				class="migration-to-layout-modal__info-banner"
				:subtitle="$t('builder.gridToLayoutMigrationChangesInSections')"
			/>

			<div class="migration-to-layout-modal__footer">
				<ZyroButton
					v-if="hasMigrationToLayoutModifications"
					v-qa="'migration-to-layout-modal-footer-button'"
					theme="primary"
					class="button"
					@click="handleButtonClick"
				>
					{{ $t('builder.reviewChanges') }}
				</ZyroButton>

				<ZyroButton
					v-else
					v-qa="'migration-to-layout-modal-footer-button'"
					theme="primary"
					class="button"
					@click="handleButtonClick"
				>
					{{ $t('builder.continueToEditor') }}
				</ZyroButton>
			</div>
		</div>
	</ZyroModal>
</template>

<script>
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import InfoBanner from '@/components/ui/InfoBanner.vue';

import {
	computed,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

const MODAL_MAX_WIDTH = '540px';
const MODAL_MAX_HEIGHT = '660px';

export default defineComponent({
	components: {
		ZyroModal,
		ZyroButton,
		InfoBanner,
	},
	setup(_, context) {
		const {
			getters,
			dispatch,
		} = useStore();

		const hasMigrationToLayoutModifications = computed(() => Object.keys(getters.siteMeta.migrationToLayoutModifications).length);

		const handleButtonClick = () => {
			context.emit('close-modal');

			if (hasMigrationToLayoutModifications.value) {
				dispatch('gui/setMigrationToLayoutPopupVisibility', true);
			} else {
				dispatch('removeMetaProperty', 'migrationToLayoutModifications');
				dispatch('saving/saveWebsite');
			}
		};

		return {
			handleButtonClick,
			hasMigrationToLayoutModifications,
			MODAL_MAX_WIDTH,
			MODAL_MAX_HEIGHT,
		};
	},
});
</script>

<style lang="scss" scoped>
:deep(.modal) {
	.modal {
		&__title {
			padding: 32px 32px 16px;
		}

		&__close {
			padding: 20px;
		}

		&__content {
			padding: 0;
		}
	}
}

.migration-to-layout-modal {
	height: 100%;

	&__subtitle {
		padding: 0 32px;
		margin-bottom: 24px;
		font-size: 14px;
		line-height: 20px;
		color: $color-gray;
	}

	&__video {
		display: flex;
		justify-content: center;
		max-width: 476px;
		height: 268px;
		padding-bottom: 32px;
		margin: auto;

		& video {
			width: 100%;
			height: 100%;
		}
	}

	&__info-banner {
		padding: 12px;
		margin: 0 32px 32px;

		:deep(.banner__content-wrapper) {
			.banner__content {
				margin: 0;
			}
		}
	}

	&__footer {
		position: relative;
		display: flex;
		flex-direction: row-reverse;
		padding: 16px 24px;
		border-top: 1px solid $color-gray-border;
	}
}
</style>
