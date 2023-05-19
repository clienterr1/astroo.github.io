import {
    STRIPE_PUBLIC_KEY_REGEX
} from '@/constants';

const integrationsValidators = {
    googleAnalytics: {
        getIdFromScript: /ga\('create', '([^']*)', 'auto'\);/,
        idValidation: /UA-\w*-\w*|G-\w*/,
    },
    hotjar: {
        getIdFromScript: /h\._hjSettings={hjid:([^,]*)/,
        idValidation: /^\w{1,30}$/,
    },
    whatsAppNumber: {
        getIdFromScript: /^\+?\d+$/,
        charactersToRemove: '+',
        idValidation: /^\+?\d+$/,
    },
    facebookPixel: {
        getIdFromScript: /fbq\('init', '([^']*)'\);/,
        idValidation: /^\w{1,30}$/,
    },
    // Cant get multiple ids to match, not even talking about extracting the values, so match anything
    googleAdSense: {
        getIdFromScript: /.*/,
        idValidation: /.*/,
    },
    googleAdMob: {
        getIdFromScript: /.*/,
        idValidation: /.*/,
    },
    facebookMessenger: {
        getIdFromScript: /page_id="([^"]*)"/,
        idValidation: /^\w{1,30}$/,
    },
    googleTagManager: {
        getIdFromScript: /\(window,document,'script','dataLayer','([^']*)'\);/,
        idValidation: /GTM-\w{1,30}/,
    },
    stripePublicApiKey: {
        getIdFromScript: /.*/,
        idValidation: STRIPE_PUBLIC_KEY_REGEX,
    },
};

const validateIntegrationInput = ({
    integrationId,
    inputValue,
}) => {
    if (inputValue === '') {
        return {
            value: inputValue,
            isValid: true,
        };
    }

    const {
        getIdFromScript,
        idValidation,
        charactersToRemove,
    } = integrationsValidators[integrationId];
    // Check if user has pasted in the whole script, and, if yes, get ID from it
    const searchScript = inputValue.match(getIdFromScript);
    const idFromInput = searchScript ? .length >= 2 ? searchScript[1] : inputValue;
    const trimmedId = idFromInput.trim();
    const sanitizedId = charactersToRemove ? trimmedId.replace(charactersToRemove, '') : trimmedId;
    const isValid = idValidation.test(trimmedId);

    return {
        value: sanitizedId,
        isValid,
    };
};

export {
    integrationsValidators,
    validateIntegrationInput,
};