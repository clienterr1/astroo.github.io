// Source: https://github.com/hostinger/hpanel-mf-shared/blob/pre-prod/services/index/src/services/experimentService.ts
import {
    getCookie,
    setCookie,
} from '@zyro-inc/site-modules/utils/cookies';
import {
    ENABLED_EXPERIMENT_IDS,
    COOKIE_EXPERIMENT_STATE,
} from '@/constants';

import {
    murmur3
} from 'murmurhash-js';

export const EXPERIMENT_COOKIE_EXPIRATION_DAYS = 7;
const EXPERIMENT_ITEM_SEPARATOR = '!';
const EXPERIMENT_VARIANT_SEPARATOR = '.';
const MUR_MUR_STATIC_SEED = 1779089003;
const ExperimentVariant = {
    CURRENT_VERSION: 0,
    EXPERIMENT_VERSION: 1,
};

const getHashMod = (key) => murmur3(key, MUR_MUR_STATIC_SEED) % 100;

const getRandomExperimentVariant = ({
    experimentID,
    clientId,
    newVariantPercentage = 50,
} = {}) => (
    getHashMod(clientId + experimentID) >= newVariantPercentage ?
    ExperimentVariant.CURRENT_VERSION :
    ExperimentVariant.EXPERIMENT_VERSION);

export const getIsExperimentIDActive = ({
    experimentID
}) => Object.values(ENABLED_EXPERIMENT_IDS).includes(experimentID);

export const getExperimentsFromCookieValue = ({
    cookie
}) => {
    if (!cookie) {
        return [];
    }

    const experimentStrings = cookie ? .split(EXPERIMENT_ITEM_SEPARATOR) || [];

    return experimentStrings.map((experimentString) => {
        const [experimentID, experimentVariantString] = experimentString ? .split(EXPERIMENT_VARIANT_SEPARATOR) || [];

        return {
            experimentID,
            experimentVariant: Number.parseInt(experimentVariantString, 10),
        };
    });
};

export const getCookieValueFromExperiments = ({
    experiments
}) => {
    const experimentsCookieStrings = experiments.map(({
        experimentID,
        experimentVariant,
    }) => `${experimentID}${EXPERIMENT_VARIANT_SEPARATOR}${experimentVariant}`);

    return experimentsCookieStrings.join(EXPERIMENT_ITEM_SEPARATOR);
};

export const addExperimentToExperiments = ({
    experimentID,
    experimentVariant,
    experiments,
}) => {
    const isExperimentIDActive = getIsExperimentIDActive({
        experimentID,
    });
    const isExperimentAlreadyRunning = experiments.some((experiment) => experiment.experimentID === experimentID);

    if (!isExperimentIDActive || isExperimentAlreadyRunning) {
        return experiments;
    }

    return [
        ...experiments,
        {
            experimentID,
            experimentVariant,
        },
    ];
};

export const setExperimentsCookie = ({
    cookie
}) => {
    setCookie(COOKIE_EXPERIMENT_STATE, cookie, EXPERIMENT_COOKIE_EXPIRATION_DAYS, {
        cdomain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
};

export const triggerExperiment = ({
    experimentID,
    isGoRobotsUser,
    userId,
}) => {
    const experimentVariant = isGoRobotsUser ? 0 : getRandomExperimentVariant({
        experimentID,
        clientId: userId,
    });

    const userExperiments = getExperimentsFromCookieValue({
        cookie: getCookie(COOKIE_EXPERIMENT_STATE),
    });

    const updatedUserExperiments = addExperimentToExperiments({
        experimentID,
        experiments: userExperiments,
        experimentVariant,
    });

    const updatedUserExperimentsCookie = getCookieValueFromExperiments({
        experiments: updatedUserExperiments,
    });

    setExperimentsCookie({
        cookie: updatedUserExperimentsCookie,
    });
};

export const getExperimentVariantByID = ({
    experimentID
}) => {
    const userExperiments = getExperimentsFromCookieValue({
        cookie: getCookie(COOKIE_EXPERIMENT_STATE),
    });

    const userExperiment = userExperiments.find((experiment) => experiment.experimentID === experimentID);

    return userExperiment ? .experimentVariant;
};

export const getExperimentsState = () => {
    const experimentsCookie = getCookie(COOKIE_EXPERIMENT_STATE);

    if (!experimentsCookie) {
        return [];
    }

    return experimentsCookie.split(EXPERIMENT_ITEM_SEPARATOR);
};

export const initializeExperiments = () => {
    // Upon initialization, get currently in cookie saved experiments
    const userExperiments = getExperimentsFromCookieValue({
        cookie: getCookie(COOKIE_EXPERIMENT_STATE),
    });

    // They may be outdated - get only active ones
    const activeUserExperiments = userExperiments.filter(({
        experimentID
    }) => getIsExperimentIDActive({
        experimentID,
    }));

    // Get new cookie value from only active experiments, and set it
    const activeUserExperimentsCookie = getCookieValueFromExperiments({
        experiments: activeUserExperiments,
    });

    setExperimentsCookie({
        cookie: activeUserExperimentsCookie,
    });
};