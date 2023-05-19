<template>
	<div class="steps">
		<button
			v-for="(step, index) in steps"
			:key="index"
			class="steps__bubble"
			:class="[
				{ 'steps__bubble--completed': step.isCompleted },
				{ 'steps__bubble--active': step.isActive }
			]"
			:disabled="!isStepClickEnabled(index)"
			@click="stepClickHandler(index)"
		>
			<Transition
				name="fade"
				mode="out-in"
			>
				<ZyroSvgDeprecated
					v-if="step.isCompleted"
					class="steps__icon"
					name="check-mark-thick"
				/>
			</Transition>
		</button>
	</div>
</template>

<script setup>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import { computed } from 'vue';

const props = defineProps({
	stepsConfig: {
		type: Array,
		required: true,
	},
	currentStepIndex: {
		type: Number,
		required: true,
	},
	seperatorWidth: {
		type: String,
		default: '24px',
	},
});
const emit = defineEmits(['step-click']);

const stepCountToRender = computed(() => props.stepsConfig.length);
const steps = computed(() => props.stepsConfig.map((step, stepNumber) => {
	const isActive = stepNumber === props.currentStepIndex;
	const isLastStep = stepNumber === stepCountToRender.value && props.currentStepIndex === stepCountToRender.value;
	const isCompleted = step.isCompleted ?? (stepNumber < props.currentStepIndex || isLastStep);

	return {
		isActive,
		isCompleted,
	};
}));

const isStepClickEnabled = (index) => {
	const step = steps.value[index];

	if (index === 0) {
		return step.isCompleted;
	}

	const previousSteps = steps.value.slice(0, index);

	// every previous step should be completed in order to click on further steps so no data is missed in the process
	return step.isCompleted && !previousSteps.some((stepData) => !stepData.isCompleted);
};

const stepClickHandler = (index) => {
	emit('step-click', index);
};
</script>

<style lang="scss" scoped>
$bubble-size: 16px;
$separator-margin: 1px;
$transition: 0.3s ease-in-out;

.steps {
	display: flex;
	justify-content: space-between;
	width:
		calc(
			#{$bubble-size} * v-bind(stepCountToRender) + v-bind(seperatorWidth) * (
				v-bind(stepCountToRender) - 1
			) - #{$separator-margin} * v-bind(stepCountToRender)
		);

	&__bubble {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 16px;
		height: 16px;
		color: white;
		background-color: transparent;
		border: 2px solid $color-gray-border;
		border-radius: 50%;
		transition: all $transition;

		&:not(:disabled) {
			cursor: pointer;
		}

		&:not(:first-child) {
			&::after {
				position: absolute;
				right: 100%;
				width: calc(v-bind(seperatorWidth) + #{$separator-margin});
				height: 2px;
				content: "";
				background: linear-gradient(to right, $color-meteorite 50%, $color-gray-border 50%) left bottom;
				background-size: 200% 100%;
				border-radius: 1000px;
				transition: all $transition;
				background-color: $color-meteorite;
			}
		}

		&--active {
			background-color: transparent;
			border-color: $color-meteorite;

			&::before {
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				position: absolute;
				content: "";
				width: 5px;
				height: 5px;
				border-radius: 50%;
				background-color: $color-meteorite;
			}

			// makes further from active positioned stepper lines gray
			&#{&} {
				& ~ .steps__bubble::after {
					background-color: $color-gray-border;
					background-position: right bottom;
				}
			}
		}

		&--completed {
			background-color: $color-meteorite;
			border-color: $color-meteorite;
		}
	}

	&__icon {
		width: 8px;
		height: 8px;
		transition: color $transition;
	}
}
</style>
