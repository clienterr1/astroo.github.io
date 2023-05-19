<template>
	<div class="ai-text-controls">
		<div
			v-if="isGeneratedTextControlsVisible"
			class="ai-text-controls__button-group"
		>
			<button
				class="ai-text-controls__button"
				@click="discardAiGeneratedText"
			>
				{{ $t('common.discard') }}
			</button>
			<button
				class="ai-text-controls__button"
				@click="generateAiText({
					elementId,
					isTryingAgain: true
				})"
			>
				{{ $t('common.tryAgain') }}
			</button>
			<button
				class="ai-text-controls__button"
				@click="keepAiGeneratedText"
			>
				{{ $t('common.keep') }}
			</button>
		</div>

		<div
			v-if="isTextBeingGenerated"
			class="ai-text-controls__loader"
		>
			<ZyroLoader
				size="16px"
				color="var(--color-primary)"
			/>
			<p class="ai-text-controls__loader-text">
				{{ $t('builder.AITextGeneratorLoadingText') }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
import { useAiTextGeneration } from '@/use/useAiTextGeneration';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

const props = defineProps({
	elementId: {
		type: String,
		required: true,
	},
});

const {
	isTextBeingGenerated,
	isAiTextGeneratorPopupVisible,
	aiGeneratedText,
	generateAiText,
	discardAiGeneratedText,
	keepAiGeneratedText,
} = useAiTextGeneration({
	elementId: props.elementId,
});

const isGeneratedTextControlsVisible = computed(() => !isTextBeingGenerated.value
	&& !isAiTextGeneratorPopupVisible.value
	&& aiGeneratedText.value.length);
</script>

<style lang="scss" scoped>
.ai-text-controls {
	background-color: $color-light;
	border-radius: 5px;
	box-shadow: 0 6px 14px rgba($color-dark, 10%);

	&__loader {
		display: flex;
		align-items: center;
		padding: 10px 16px;
	}

	&__loader-text {
		font-size: 14px;
		line-height: 1.42;
		color: $color-primary;
		margin-left: 8px;
	}

	&__button-group {
		border-radius: 5px;
		border: 2px solid $color-primary;
		background-color: $color-primary;
		overflow: hidden;
	}

	&__button {
		font-size: 14px;
		line-height: 1.42;
		color: $color-dark;
		padding: 8px 16px;
		transition: all 0.3s ease-in-out;

		&:first-child {
			border-right: 2px solid $color-primary;
		}

		&:last-child {
			border-left: 2px solid $color-primary;
		}

		&:hover,
		&:focus {
			background-color: $color-primary;
			color: $color-light;
			cursor: pointer;
		}
	}
}
</style>
