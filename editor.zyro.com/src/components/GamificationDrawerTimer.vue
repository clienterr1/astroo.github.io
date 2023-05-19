<template>
	<div class="gamification-timer">
		<div class="gamification-timer__gift-icon-container">
			<Icon
				name="card_giftcard"
				class="gamification-timer__gift-icon"
				:class="{ shake: shakeGiftBox }"
			/>
			<div
				v-if="areAllAchievementsCompleted"
				class="gamification-timer__green-check"
			>
				<Icon
					name="check"
					class="gamification-timer__check-icon"
				/>
			</div>
		</div>
		<div
			v-if="areAllAchievementsCompleted"
			class="gamification-timer__completed-copy"
		>
			<div class="gamification-timer__reward-wrap">
				<Icon
					class="gamification-timer__reward-chevron"
					name="chevron_right"
					dimensions="16px"
				/>
				<p class="gamification-timer__gift-code">
					{{ GAMIFICATION_DISCOUNT_CODE }}
				</p>
				<Icon
					class="gamification-timer__reward-chevron"
					name="chevron_left"
					dimensions="16px"
				/>
			</div>
			<p class="gamification-timer__reward-text">
				{{ $t('builder.gamificationGiftDescription') }}
			</p>
		</div>

		<div v-else>
			<div class="gamification-timer__copy">
				{{ $t('builder.gamificationTimerCopy') }}
				<p class="gamification-timer__gift-copy">
					{{ $t('builder.gamificationDiscountGift') }}
				</p>
			</div>
			<div
				class="gamification-timer__timer"
				:class="{ 'gamification-timer__timer--red': timeRemainder.hours < RED_COLOR_TRESHOLD }"
			>
				<div class="gamification-timer__timer-segment">
					<span>{{ padNumber(timeRemainder.hours) }}</span>
				</div>
				<div class="gamification-timer__timer-separator">
					:
				</div>
				<div class="gamification-timer__timer-segment">
					<span>{{ padNumber(timeRemainder.minutes) }}</span>
				</div>
				<div class="gamification-timer__timer-separator">
					:
				</div>
				<div class="gamification-timer__timer-segment">
					<span>{{ padNumber(timeRemainder.seconds) }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import {
	ref,
	computed,
	onUnmounted,
} from 'vue';
import { useTimestamp } from '@vueuse/core';
import { useStore } from 'vuex';
import { useGamification } from '@/use/useGamification';
import {
	TIME_DENOMINATOR_DAY,
	GAMIFICATION_DISCOUNT_CODE,
} from '@/constants/index';
import Icon from '@/components/global/Icon.vue';
import { getTimeRemainder } from '@/utils/date';

const RED_COLOR_TRESHOLD = 3;
const SHAKE_ANIMATION_INTERVAL = 5000;

const { state } = useStore();

const { areAllAchievementsCompleted } = useGamification();

const currentTimestamp = useTimestamp();
const deadline = ref(state.gamification.createdAt + TIME_DENOMINATOR_DAY);
const timeLeft = computed(() => deadline.value - currentTimestamp.value);
const timeRemainder = computed(() => getTimeRemainder(timeLeft.value));
const shakeGiftBox = ref(false);
const shakeTimerInterval = ref(null);
const padNumber = (number) => number.toString().padStart(2, '0');

if (areAllAchievementsCompleted.value) {
	shakeTimerInterval.value = setInterval(() => {
		shakeGiftBox.value = !shakeGiftBox.value;
	}, SHAKE_ANIMATION_INTERVAL);
}

onUnmounted(() => {
	if (shakeTimerInterval.value) clearInterval(shakeTimerInterval.value);
});

</script>

<style lang="scss" scoped>
@keyframes shake {
	0% {
		transform: rotate(0deg);
	}

	25% {
		transform: rotate(6deg);
	}

	50% {
		transform: rotate(-6deg);
	}

	75% {
		transform: rotate(3deg);
	}

	100% {
		transform: rotate(0deg);
	}
}

.gamification-timer {
	text-align: center;
	background-color: $color-gray-light;
	padding: 18px 16px 16px;
	border-radius: 8px;
	border: solid 1px $color-gray-border;
	margin-bottom: 25px;
	font-size: 14px;

	&__gift-icon-container {
		position: relative;
	}

	&__gift-icon,
	&__gift-code,
	&__gift-copy {
		color: $color-primary;
	}

	&__gift-icon {
		margin-bottom: 20px;

		&.shake {
			animation: shake 0.3s ease-in-out 0s;
		}
	}

	&__green-check {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: -2px;
		left: calc(50% + 12px);
		transform: translateX(-50%);
		background-color: #00b090;
		border-radius: 50%;
		width: 16px;
		height: 16px;
	}

	&__check-icon {
		transform: scale(0.6);
		color: $color-light;
	}

	&__reward-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding-bottom: 8px;
	}

	&__reward-chevron {
		color: $color-meteorite;

		&:first-child {
			margin-right: 8px;
		}

		&:last-child {
			margin-left: 8px;
		}
	}

	&__gift-code {
		font-weight: 700;
		letter-spacing: 0.5px;
	}

	&__reward-text {
		line-height: 24px;
	}

	&__gift-copy {
		font-weight: 700;
		letter-spacing: 0.5px;
		margin-bottom: 16px;
	}

	&__timer-segment {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border: solid 1px $color-gray-border;
		background-color: $color-light;
		border-radius: 6px;
		font-size: 14px;
		text-align: center;

		& :first-child {
			transform: translateX(1px);
		}
	}

	&__timer {
		display: flex;
		align-items: center;
		justify-content: center;

		&--red .gamification-timer__timer-segment {
			color: $color-danger;
		}
	}

	&__timer-separator {
		width: 4px;
		margin: 0 4px;
		font-weight: 700;
	}
}
</style>
