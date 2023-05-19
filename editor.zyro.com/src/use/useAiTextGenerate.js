import {
    ref
} from 'vue';
import {
    useI18n
} from 'vue-i18n';

import {
    useNotifications
} from '@/use/useNotifications';
import {
    generateText
} from '@/api/AiApi';

const isTextBeingGenerated = ref(false);
const isAiTextGeneratorDailyLimitReached = ref(false);

export const useAiTextGenerate = () => {
    const {
        t
    } = useI18n();
    const {
        notify
    } = useNotifications();

    const getAiGeneratedText = async ({
        userPrompt
    }) => {
        try {
            isTextBeingGenerated.value = true;

            const {
                data
            } = await generateText({
                prompt: userPrompt,
            });

            isTextBeingGenerated.value = false;

            return data;
        } catch (error) {
            isTextBeingGenerated.value = false;

            if (error.error === 429) {
                isAiTextGeneratorDailyLimitReached.value = true;
                notify({
                    message: t('builder.AITextGeneratorPopupDailyLimitReachedDisclaimer'),
                    origin: 'useAiTextGeneration.js',
                });

                return {};
            }

            notify({
                message: t('builder.AITextGenerationFailed'),
                origin: 'useAiTextGeneration.js',
            });

            return {};
        }
    };

    return {
        getAiGeneratedText,
        isTextBeingGenerated,
        isAiTextGeneratorDailyLimitReached,
    };
};