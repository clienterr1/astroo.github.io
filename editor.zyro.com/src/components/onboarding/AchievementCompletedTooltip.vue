<template>
	<ZyroTooltip
		:position="tooltipPosition"
		content-position="absolute"
		toggle-event="none"
		mode="success"
		has-close-icon
		class="gamification-tooltip"
		@on-close="handleClose"
	>
		<slot name="tooltip-content">
			<div
				class="gamification-tooltip__tooltip-content"
				@mouseenter="handleMouseEnter"
				@mouseleave="handleMouseLeave"
			>
				<div
					class="gamification-tooltip__heading z-body-small z-font-weight-bold"
					:class="{ 'gamification-tooltip__heading--centered' : isFeedbackSent }"
				>
					<ZyroSvgDeprecated
						v-if="!isFeedbackSent"
						class="gamification-tooltip__check"
						name="check-mark"
						dimensions="16px"
					/>
					{{ headingText }}
					<img
						:src="headingImage"
						class="gamification-tooltip__heading-img"
					>
				</div>
				<div v-if="areAllAchievementsCompleted">
					<p
						v-if="isFeedbackSent"
						class="gamification-tooltip__text z-body-small"
					>
						{{ $t('builder.gamificationFinishGoodLuck') }}
					</p>
					<BuilderNps
						v-else
						is-close-button-hidden
						class="gamification-tooltip__nps"
						@send-feedback="handleFeedBackSend"
					/>
				</div>
				<template v-else>
					<p class="gamification-tooltip__progress-text z-body-small">
						{{ $t('builder.gamificationProgressTextSteps', [completedAchievementsCount, achievements.length]) }}
					</p>
					<ZyroProgressBar
						with-border
						class="gamification-tooltip__progress-bar"
						:percentage="progressPercentage"
						color="success-dark"
					/>
					<a
						v-qa="'builder-gamificationtooltip-link-opendrawer'"
						target="_blank"
						class="gamification-tooltip__link z-link z-link--light z-body-small"
						@click="handleOpenDrawerClick"
					>
						{{ $t('builder.gamificationCompleteSteps') }}
					</a>
				</template>
			</div>
		</slot>
	</ZyroTooltip>
</template>

<script setup>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';
import {
	GAMIFICATION_EVENT_NAMES,
	DRAWER_GAMIFICATION,
	NPS_TYPE_FEATURE_GAMIFICATION,
} from '@/constants';
import EventLogApi from '@/api/EventLogApi';
import {
	computed,
	ref,
	onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { OPEN_DRAWER } from '@/store/builder/gui';
import ZyroProgressBar from '@/components/reusable-components/ZyroProgressBar.vue';
import { useGamification } from '@/use/useGamification';
import { useStore } from 'vuex';
import BuilderNps from '@/components/builder-nps/BuilderNps.vue';
import prayImg from '@/assets/images/pray.png';
import tadaImg from '@/assets/images/tada.png';

const SUCCESS_TOOLTIP_TIMEOUT = 7000;

const emit = defineEmits(['close']);

const {
	completedAchievementsCount,
	achievements,
	lastCompletedAchievement,
	areAllAchievementsCompleted,
} = useGamification();
const { dispatch } = useStore();
const { t } = useI18n();

const isFeedbackSent = ref(false);
const headingText = ref('');
const headingImage = ref('');
const timeoutId = ref(null);

const progressPercentage = computed(() => (completedAchievementsCount.value / achievements.value.length) * 100);
const tooltipPosition = computed(() => (areAllAchievementsCompleted.value ? 'rightTop' : 'right'));

const handleClose = () => {
	clearTimeout(timeoutId.value);
	emit('close');
};

const handleOpenDrawerClick = () => {
	handleClose();

	dispatch(`gui/${OPEN_DRAWER}`, {
		id: DRAWER_GAMIFICATION,
	});
};

const startCloseTimer = (timeout) => {
	if (timeoutId.value) {
		clearTimeout(timeoutId.value);
	}

	timeoutId.value = setTimeout(() => {
		emit('close');
	}, timeout);
};

const handleFeedBackSend = (event) => {
	headingText.value = t('builder.gamificationFinishThanks');
	headingImage.value = prayImg;
	isFeedbackSent.value = true;

	EventLogApi.logEvent({
		eventName: GAMIFICATION_EVENT_NAMES.RATED,
		isHostingerEvent: true,
		eventProperties: {
			score: event.score,
			comment: event.comment,
		},
	});

	startCloseTimer(SUCCESS_TOOLTIP_TIMEOUT);
};

const handleMouseEnter = () => {
	if (!areAllAchievementsCompleted.value) {
		clearTimeout(timeoutId.value);
	}
};

const handleMouseLeave = () => {
	if (!areAllAchievementsCompleted.value || isFeedbackSent.value) {
		startCloseTimer(SUCCESS_TOOLTIP_TIMEOUT);
	}
};

onMounted(() => {
	if (areAllAchievementsCompleted.value) {
		headingText.value = t('builder.gamificationCompletedTooltip');
		headingImage.value = tadaImg;

		dispatch('nps/setNpsData', {
			formType: NPS_TYPE_FEATURE_GAMIFICATION,
			question: t('builder.gamificationNpsQuestion'),
		});

		return;
	}

	headingText.value = lastCompletedAchievement.value.tooltipText;
	headingImage.value = lastCompletedAchievement.value.tooltipImage;

	startCloseTimer(SUCCESS_TOOLTIP_TIMEOUT);
});

</script>

<style lang="scss" scoped>
.gamification-tooltip {
	&__progress-bar {
		width: 276px;
	}

	&__tooltip-content {
		margin-left: 12px;
	}

	&__heading {
		display: flex;
		align-items: center;
		margin-bottom: 8px;

		&--centered {
			justify-content: center;
		}
	}

	&__heading-img {
		height: 16px;
		object-fit: cover;
		margin-left: 4px;
	}

	&__nps {
		width: 100%;
		margin-top: 16px;

		:deep(.feedback__text) {
			max-width: unset;
			font-size: 14px;
		}

		:deep(.feedback__form) {
			width: 100%;
		}

		:deep(.feedback__content) {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
		}

		:deep(.feedback__back-button) {
			top: 30px;
		}
	}

	&__check {
		animation: checkmark-stroke 1s forwards;
		animation-timing-function: ease-in;
		animation-delay: 0.5s;
		stroke-linejoin: round;
		opacity: 0;
		margin-right: 8px;
		stroke-linecap: round;
		stroke-miterlimit: 10;
		scale: 1;
		stroke-width: 4px;
		stroke-dasharray: 400;
	}

	@keyframes checkmark-stroke {
		0% {
			stroke-dashoffset: 400;
			opacity: 1;
			scale: 1;
		}

		50% {
			scale: 2;
		}

		100% {
			stroke-dashoffset: 0;
			opacity: 1;
			scale: 1;
		}
	}
}
</style>
