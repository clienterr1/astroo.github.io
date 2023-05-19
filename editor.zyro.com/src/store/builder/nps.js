import {
    captureException
} from '@sentry/browser';

import {
    getCookie
} from '@zyro-inc/site-modules/utils/cookies';
import {
    NPS_TYPE_DEFAULT,
    NPS_TYPE_DEFAULT_AI_BUILDER,
    NPS_MAX_DAYS_AFTER_LAST_SCORE,
    NPS_DATA_MAP,
    COOKIE_NPS_HIDDEN,
    AI_BUILDER_TEMPLATE_ID,
} from '@/constants';
import {
    getLastEvaluation
} from '@/api/NpsApi';
// Mutations
export const SET_NPS_VISIBLE = 'SET_NPS_VISIBLE';
export const SET_NPS_QUESTION = 'SET_NPS_QUESTION';
export const UPDATE_NPS_DATA = 'UPDATE_NPS_DATA';

export default {
    namespaced: true,
    state: {
        isNpsVisible: false,
        question: null,
        npsData: {
            titleI18Key: '',
            formType: NPS_TYPE_DEFAULT,
            maxScoreI18Key: '',
            lowestScoreI18KEy: '',
        },
    },
    getters: {
        defaultFormType: (state, getters, rootState) => (
            rootState.website.meta.template === AI_BUILDER_TEMPLATE_ID ? NPS_TYPE_DEFAULT_AI_BUILDER : NPS_TYPE_DEFAULT
        ),
    },
    mutations: {
        [SET_NPS_VISIBLE]: (state, isVisible) => {
            state.isNpsVisible = isVisible;
        },
        [SET_NPS_QUESTION]: (state, newQuestion) => {
            state.question = newQuestion;
        },
        [UPDATE_NPS_DATA]: (state, {
            formType,
            importedWebsiteUrl = '',
        }) => {
            state.npsData = {
                ...NPS_DATA_MAP[formType],
                importedWebsiteUrl,
            };
        },
    },
    actions: {
        refetchNpsModalVisibilityStatus: async ({
            commit,
            getters,
        }, {
            formType = ''
        } = {}) => {
            try {
                const {
                    daysPassed
                } = await getLastEvaluation(NPS_TYPE_DEFAULT);
                const hasTermAfterLastSubmissionPassed = daysPassed > NPS_MAX_DAYS_AFTER_LAST_SCORE || daysPassed === null;
                const hasTermAfterLastModalClosePassed = getCookie(COOKIE_NPS_HIDDEN) !== 'true';
                const isNpsVisible = hasTermAfterLastSubmissionPassed && hasTermAfterLastModalClosePassed;

                if (isNpsVisible) {
                    commit(UPDATE_NPS_DATA, {
                        formType: formType || getters.defaultFormType,
                    });
                }

                commit(SET_NPS_VISIBLE, isNpsVisible);
            } catch (error) {
                captureException(error);
                commit(SET_NPS_VISIBLE, false);
            }
        },
        setNpsData: ({
            getters,
            commit,
        }, {
            isVisible,
            formType,
            importedWebsiteUrl = '',
            question = null,
        }) => {
            commit(UPDATE_NPS_DATA, {
                formType: formType || getters.defaultFormType,
                importedWebsiteUrl,
            });

            commit(SET_NPS_QUESTION, question);
            commit(SET_NPS_VISIBLE, isVisible);
        },
    },
};