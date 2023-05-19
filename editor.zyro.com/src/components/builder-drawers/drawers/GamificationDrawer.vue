<template>
	<ZyroDrawer>
		<div
			v-qa="'builder-sidemenu-gamificationdrawer'"
			class="gamification-drawer"
		>
			<div class="gamification-drawer__header">
				<div class="gamification-drawer__title-container">
					<h2 class="z-h5">
						{{ title }}
					</h2>
					<img
						v-if="areAllAchievementsCompleted"
						src="@/assets/images/raised-hands.png"
						class="gamification-drawer__image"
					>
					<img
						v-else
						src="@/assets/images/wave.png"
						class="gamification-drawer__image"
					>
				</div>
				<p class="gamification-drawer__description z-body-small">
					{{ subtitle }}
				</p>
				<GamificationDrawerTimer v-if="isGamificationTimerVisible" />
				<div class="gamification-drawer__progress-container">
					<p class="gamification-drawer__progress-title">
						{{ $t('builder.gamificationProgressTitle') }}
					</p>
					<p class="gamification-drawer__progress-text z-body-small">
						{{ $t('builder.gamificationProgressText', [completedAchievementsCount, achievements.length]) }}
					</p>
				</div>
				<ZyroProgressBar :percentage="progressPercentage" />
			</div>
			<div class="gamification-drawer__content">
				<GamificationTaskList />
				<NpsRateFeature
					hide-border
					class="gamification-drawer__nps"
					:feature-name="$t('builder.gamificationNpsTitle')"
					:type="NPS_TYPE_FEATURE_GAMIFICATION"
				/>
			</div>
		</div>
	</ZyroDrawer>
</template>

<script>
import {
	NPS_TYPE_FEATURE_GAMIFICATION,
	GAMIFICATION_EVENT_NAMES,
	TIME_DENOMINATOR_DAY,
} from '@/constants';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import ZyroProgressBar from '@/components/reusable-components/ZyroProgressBar.vue';
import GamificationTaskList from '@/components/onboarding/GamificationTaskList.vue';
import {
	defineComponent,
	computed,
} from 'vue';
import { useI18n } from 'vue-i18n';
import EventLogApi from '@/api/EventLogApi';
import { useGamification } from '@/use/useGamification';
import GamificationDrawerTimer from '@/components/GamificationDrawerTimer.vue';
import { useStore } from 'vuex';
import { useTimestamp } from '@vueuse/core';

export default defineComponent({
	components: {
		ZyroDrawer,
		ZyroProgressBar,
		GamificationTaskList,
		NpsRateFeature,
		GamificationDrawerTimer,
	},

	setup() {
		const { t } = useI18n();
		const {
			areAllAchievementsCompleted,
			completedAchievementsCount,
			achievements,
		} = useGamification();
		const currentTimestamp = useTimestamp();

		const { state } = useStore();

		const progressPercentage = computed(() => (completedAchievementsCount.value / achievements.value.length) * 100);
		const title = computed(() => (areAllAchievementsCompleted.value
			? t('builder.gamificationDrawerTitleCompleted')
			: t('builder.gamificationDrawerTitle')));
		const subtitle = computed(() => (areAllAchievementsCompleted.value
			? t('builder.gamificationDrawerDescriptionCompleted')
			: t('builder.gamificationDrawerDescription')));

		EventLogApi.logEvent({
			eventName: GAMIFICATION_EVENT_NAMES.ENTER,
			isHostingerEvent: true,
		});

		const isGamificationTimerVisible = computed(() => {
			const isGamificationTimerDone = state.gamification.createdAt + TIME_DENOMINATOR_DAY < currentTimestamp.value;

			return areAllAchievementsCompleted.value || !isGamificationTimerDone;
		});

		return {
			isGamificationTimerVisible,
			title,
			subtitle,
			areAllAchievementsCompleted,
			progressPercentage,
			completedAchievementsCount,
			achievements,
			NPS_TYPE_FEATURE_GAMIFICATION,
		};
	},
});
</script>

<style lang="scss" scoped>
.gamification-drawer {
	display: flex;
	flex-direction: column;
	height: 100%;

	&__header {
		flex: 0;
		width: 100%;
		padding: 24px;
	}

	&__image {
		width: 32px;
		height: 32px;
		margin-left: 8px;
	}

	&__title-container {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}

	&__description {
		margin-bottom: 24px;
		color: $color-gray;
	}

	&__progress-text {
		color: $color-gray;
	}

	&__content {
		flex: 1;
		padding: 0 16px 24px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	&__progress-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	&__progress-title {
		font-size: 12px;
		font-weight: 700;
		text-transform: uppercase;
	}

	&__nps {
		padding-top: 16px;
	}
}
</style>
