import {
    ref,
    computed,
    watch,
} from 'vue';
import {
    useStore
} from 'vuex';
import {
    useI18n
} from 'vue-i18n';
import {
    useNotifications
} from '@/use/useNotifications';
import {
    useAiTextGenerate
} from '@/use/useAiTextGenerate';
import {
    AI_BUILDER_DESCRIPTION_WORD_COUNT_BAD_QUALITY,
    TEXT_EDITOR_TAG_PARAGRAPH,
    TEXT_EDITOR_CLASS_BODY,
} from '@/constants';
import {
    DATA_ATTRIBUTE_ELEMENT_ID
} from '@zyro-inc/site-modules/constants';

import {
    getColorsFromHTML
} from '@/use/useWebsiteColors';

const isAiTextGeneratorPopupVisible = ref(false);

const elementPreviousTextContent = ref('');
const aiGeneratedText = ref('');

const userPrompt = ref('');
const isPromptInputTouched = ref(false);

const DESCRIPTION_NOT_CLEAR_TEXT_RESPONSE = 'Description not clear.';

export const useAiTextGeneration = (props) => {
    const {
        dispatch,
        getters,
    } = useStore();
    const {
        t
    } = useI18n();
    const {
        notify
    } = useNotifications();
    const {
        getAiGeneratedText,
        isTextBeingGenerated,
    } = useAiTextGenerate();

    const currentElementId = computed(() => getters.currentElementId);
    const currentElement = computed(() => getters.currentElement);
    const isEditingTextBoxElement = computed(() => getters.isEditingTextBoxElement);

    const isUserPromptValid = computed(() => userPrompt.value.trim().length > AI_BUILDER_DESCRIPTION_WORD_COUNT_BAD_QUALITY);

    const textElementColor = computed(() => {
        const textContentColors = getColorsFromHTML(elementPreviousTextContent.value);

        if (textContentColors.length) {
            return textContentColors[textContentColors.length - 1];
        }

        return '';
    });

    const aiGeneratedTextHtmlContent = computed(() => {
        const style = textElementColor.value ? `style="color: ${textElementColor.value}"` : '';

        return `<${TEXT_EDITOR_TAG_PARAGRAPH} ${style} class="${TEXT_EDITOR_CLASS_BODY}"
			>${aiGeneratedText.value}</${TEXT_EDITOR_TAG_PARAGRAPH}>`;
    });

    const updateElementWithAiGeneratedText = ({
        pushToHistory = false
    }) => {
        dispatch('mergeElementData', {
            elementId: props.elementId,
            elementData: {
                content: `${elementPreviousTextContent.value}${aiGeneratedTextHtmlContent.value}`,
            },
        });

        if (pushToHistory) {
            dispatch('undoRedo/createSnapshot');
        }

        // Scroll to the bottom of the page to show the generated text
        // setTimeout is needed to wait for the element to be updated with new text
        setTimeout(() => {
            document.querySelector(`[${DATA_ATTRIBUTE_ELEMENT_ID}="${props.elementId}"]`).scrollIntoView({
                block: 'end',
                behavior: 'smooth',
            });
        });
    };

    const generateAiText = async ({
        isTryingAgain
    }) => {
        isPromptInputTouched.value = true;
        if (!isUserPromptValid.value) {
            return;
        }

        isAiTextGeneratorPopupVisible.value = false;
        aiGeneratedText.value = '';

        if (!isTryingAgain) {
            elementPreviousTextContent.value = currentElement.value.content;
        }

        const {
            text
        } = await getAiGeneratedText({
            userPrompt: userPrompt.value,
        });

        if (!text || props.elementId !== currentElementId.value) {
            return;
        }

        if (text === DESCRIPTION_NOT_CLEAR_TEXT_RESPONSE) {
            notify({
                message: t('builder.AITextGenerationDescriptionNotClear'),
                origin: 'useAiTextGeneration.js',
            });

            isAiTextGeneratorPopupVisible.value = true;

            return;
        }

        aiGeneratedText.value = text;
        updateElementWithAiGeneratedText({
            pushToHistory: false,
        });
    };

    const discardAiGeneratedText = () => {
        dispatch('mergeElementData', {
            elementId: props.elementId,
            elementData: {
                content: elementPreviousTextContent.value,
            },
        });

        aiGeneratedText.value = '';
    };

    const keepAiGeneratedText = () => {
        updateElementWithAiGeneratedText({
            pushToHistory: true,
        });

        aiGeneratedText.value = '';
    };

    watch(currentElementId, (newCurrentElementId) => {
        // Reset AI text generation state if user switched to another element
        if (newCurrentElementId !== props.elementId) {
            if (isTextBeingGenerated.value) {
                notify({
                    message: t('builder.AITextGenerationStopped'),
                    origin: 'useAiTextGeneration.js',
                });

                isTextBeingGenerated.value = false;
            }

            aiGeneratedText.value = '';
            userPrompt.value = '';
            isPromptInputTouched.value = false;
        }
    });

    watch(isEditingTextBoxElement, () => {
        // Reset AI text generation state if user started editing text box element
        if (
            aiGeneratedText.value.length &&
            isEditingTextBoxElement.value
        ) {
            aiGeneratedText.value = '';
            userPrompt.value = '';
        }
    });

    return {
        userPrompt,
        aiGeneratedText,
        isAiTextGeneratorPopupVisible,
        isTextBeingGenerated,
        getAiGeneratedText,
        generateAiText,
        discardAiGeneratedText,
        keepAiGeneratedText,
        isUserPromptValid,
        isPromptInputTouched,
    };
};