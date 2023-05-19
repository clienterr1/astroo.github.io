import {
    ref,
    computed,
} from 'vue';

import {
    useI18n
} from 'vue-i18n';

export const defaultValidator = (value) => {
    const isValid = value.trim() !== '';

    return isValid ?
        {
            isValid: true,
            error: '',
        } :
        {
            isValid: false,
            errorI18nPath: 'validate.emptyValue',
        };
};

export const useEditableItemInput = (props, {
    emit
}) => {
    const {
        t
    } = useI18n();

    const isInputShown = ref(false);
    const inputValue = ref('');
    const error = ref('');

    const handleInput = (newValue) => {
        inputValue.value = newValue;

        const {
            error: inputError,
            errorI18nPath,
        } = props.validateValue(newValue);

        const currentError = errorI18nPath ? ? inputError;

        error.value = currentError ? t(currentError) : '';
    };

    const setInputValue = (newValue) => {
        inputValue.value = newValue;
    };

    const showInput = () => {
        isInputShown.value = true;
    };

    const hideInput = () => {
        isInputShown.value = false;
        inputValue.value = '';
        error.value = '';
    };

    const submitValue = () => {
        if (!inputValue.value) {
            hideInput();

            return;
        }

        if (error.value) {
            return;
        }

        emit('add', inputValue.value);
        hideInput();
    };

    return {
        handleInput,
        showInput,
        hideInput,
        submitValue,
        setInputValue,
        isInputShown: computed(() => isInputShown.value),
        inputValue: computed(() => inputValue.value),
        error: computed(() => error.value),
    };
};