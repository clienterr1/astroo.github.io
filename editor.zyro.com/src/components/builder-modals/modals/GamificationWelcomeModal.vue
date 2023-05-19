<template>
	<ZyroModal
		v-qa="'gamification-modal-welcomemodal'"
		max-width="540px"
		height="auto"
		position="center"
		@close-modal="handleOpenDrawerClick"
	>
		<div class="gamification-welcome-modal">
			<div class="gamification-welcome-modal__title-container">
				<p class="gamification-welcome-modal__title z-h5">
					{{ $t('builder.onboarding.welcome.title') }}
				</p>
			</div>
			<p class="gamification-welcome-modal__subtitle z-body">
				{{ $t('builder.gamificationModalMessage') }}
			</p>
			<div class="gamification-welcome-modal__gift-text">
				{{ $t('builder.gamificationDiscountGift') }}
				<Icon
					name="card_giftcard"
					class="gift-icon"
				/>
			</div>
		</div>
		<template #footer>
			<div class="gamification-welcome-modal__footer">
				<ZyroButton
					v-qa="'gamification-btn-welcomestartbuilding'"
					theme="primary"
					class="button"
					@click="handleOpenDrawerClick"
				>
					{{ $t('builder.gamificationModalButtonText') }}
				</ZyroButton>
			</div>
		</template>
	</ZyroModal>
</template>

<script>
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import {
	OPEN_DRAWER,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { DRAWER_GAMIFICATION } from '@/constants';
import Icon from '@/components/global/Icon.vue';

export default defineComponent({
	components: {
		ZyroModal,
		ZyroButton,
		Icon,
	},
	setup() {
		const { dispatch } = useStore();

		const handleOpenDrawerClick = () => {
			dispatch(`gui/${OPEN_DRAWER}`, {
				id: DRAWER_GAMIFICATION,
			});
			dispatch(`gui/${CLOSE_MODAL}`);
		};

		return {
			handleOpenDrawerClick,
		};
	},
});
</script>

<style lang="scss" scoped>
.gamification-welcome-modal {
	display: flex;
	flex-direction: column;
	padding: 48px 16px 40px;
	text-align: center;

	&__title-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-bottom: 16px;
	}

	&__image {
		width: 32px;
		height: 32px;
	}

	&__title {
		display: inline-block;
		margin-right: 8px;
	}

	&__text {
		margin-bottom: 16px;
	}

	&__footer {
		margin: auto;
	}

	&__subtitle {
		color: $color-gray;
	}

	&__gift-text {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		color: $color-primary;
		font-weight: 700;
		letter-spacing: 0.5px;
	}
}
</style>
