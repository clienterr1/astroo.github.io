<template>
	<div>
		<ZyroButton
			ref="aiTextGeneratorFormControlsRef"
			theme="editor"
			class="ai-text-generator__controls-button"
			data-qa="ai-text-generator-open-settings"
			@click="isAiTextGeneratorPopupVisible = !isAiTextGeneratorPopupVisible"
		>
			<template #icon-left>
				<Icon
					is-custom
					name="stars"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.AITextGeneratorPopupTitle') }}
		</ZyroButton>
		<Popup
			v-if="isAiTextGeneratorPopupVisible"
			:target-ref="aiTextGeneratorFormControlsRef && aiTextGeneratorFormControlsRef.$el"
			placement="bottom"
			auto-update
			@click-outside="isAiTextGeneratorPopupVisible = false"
		>
			<ZyroPopupCard
				:title="$t('builder.AITextGeneratorPopupTitle')"
				@close="isAiTextGeneratorPopupVisible = false"
			>
				<form
					class="ai-text-generator__controls"
					@submit.prevent="generateAiText({
						userPrompt,
						elementId,
					})"
				>
					<p class="ai-text-generator__description">
						{{ $t('builder.AITextGeneratorPopupDescription') }}
					</p>
					<ZyroFieldTextArea
						v-model="userPrompt"
						class="ai-text-generator__text-area"
						input-data-qa="ai-text-generator-prompt-input"
						theme="primary"
						:placeholder="$t('builder.AITextGeneratorPopupInputPlaceholder')"
						:label="$t('builder.AITextGeneratorPopupInputTitle')"
						:min-height="72"
						is-resizable
						autofocus
						:error="isPromptInputInvalid"
					>
						<template #message>
							<div
								v-if="isPromptInputInvalid"
								class="ai-text-generator__error-message"
							>
								{{ $t('builder.AITextGeneratorPromptValidationError', [AI_BUILDER_DESCRIPTION_WORD_COUNT_BAD_QUALITY]) }}
							</div>
						</template>
					</ZyroFieldTextArea>
					<ZyroButton
						theme="primary"
						class="ai-text-generator__button"
						color="red"
						:is-disabled="isAiTextGeneratorDailyLimitReached"
						type="submit"
						data-qa="ai-text-generator-button"
					>
						<template #icon-left>
							<Icon
								is-custom
								name="stars"
								is-filled
							/>
						</template>
						{{ $t('builder.AIWriter.btn') }}
					</ZyroButton>
					<p class="ai-text-generator__limit-disclaimer">
						{{ limitDisclaimerText }}
					</p>
				</form>
				<NpsRateFeature
					class="ai-text-generator__nps-rate"
					:feature-name="$t('builder.npsRateAiAssist')"
					:type="NPS_TYPE_AI_ASSIST"
				/>
			</ZyroPopupCard>
		</Popup>
	</div>
</template>

<script setup>
import {
	ref,
	computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import Popup from '@/components/global/Popup.vue';
import ZyroPopupCard from '@/components/global/ZyroPopupCard.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldTextArea from '@/components/global/ZyroFieldTextArea.vue';
import Icon from '@/components/global/Icon.vue';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';

import { useAiTextGeneration } from '@/use/useAiTextGeneration';
import { useAiTextGenerate } from '@/use/useAiTextGenerate';
import {
	AI_BUILDER_DESCRIPTION_WORD_COUNT_BAD_QUALITY,
	NPS_TYPE_AI_ASSIST,
} from '@/constants';

const { t } = useI18n();

const props = defineProps({
	elementId: {
		type: String,
		required: true,
	},
});

const {
	isAiTextGeneratorPopupVisible,
	generateAiText,
	userPrompt,
	isUserPromptValid,
	isPromptInputTouched,
} = useAiTextGeneration({
	elementId: props.elementId,
});
const { isAiTextGeneratorDailyLimitReached } = useAiTextGenerate();
const aiTextGeneratorFormControlsRef = ref(null);

const isPromptInputInvalid = computed(() => !isUserPromptValid.value && isPromptInputTouched.value);

const limitDisclaimerText = computed(() => (isAiTextGeneratorDailyLimitReached.value
	? t('builder.AITextGeneratorPopupDailyLimitReachedDisclaimer')
	: t('builder.AITextGeneratorPopupDailyLimitDisclaimer')
));

</script>

<style lang="scss" scoped>
.ai-text-generator {
	&__controls-button {
		color: $color-primary;

		&:hover,
		&:focus {
			color: $color-primary;
		}
	}

	&__controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 360px;
	}

	&__text-area {
		width: 100%;
	}

	&__description {
		color: $color-gray;
		font-size: 14px;
		line-height: 1.4;
		margin: 16px 0;
	}

	&__button,
	&__button:hover:focus {
		padding: 0 24px 0 16px;
	}

	&__limit-disclaimer {
		font-size: 12px;
		line-height: 1.66;
		color: $color-gray;
		margin-top: 8px;
	}

	&__error-message {
		margin-top: 8px;
		overflow: hidden;
		font-size: 13px;
		color: $color-primary;
		text-align: left;
		text-overflow: ellipsis;
		user-select: text;
	}

	&__nps-rate {
		margin-top: 8px;
	}
}
</style>
