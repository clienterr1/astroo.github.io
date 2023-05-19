import {
    useStore
} from 'vuex';
import {
    captureException
} from '@sentry/browser';
import {
    computed,
    watch,
} from 'vue';
import GamificationApi from '@/api/GamificationApi';
import {
    checkIfHtmlHasGivenTags
} from '@/utils/rehypeUtils';
import {
    SEO_SETTINGS_ROUTE
} from '@/constants/routes';
import changeHeadingImg from '@/assets/images/hands-raised.png';
import changeImageImg from '@/assets/images/star-struck.png';
import changeParagraphImg from '@/assets/images/thumbs-up.png';
import publishImg from '@/assets/images/tada.png';
import changeLogoImg from '@/assets/images/rocket-color.png';
import socialIconsImg from '@/assets/images/sunglasses.png';
import updateSeoImg from '@/assets/images/muscle.png';
import mobileViewImg from '@/assets/images/the-horns.png';
import {
    useI18n
} from 'vue-i18n';
import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';
import EventLogApi from '@/api/EventLogApi';
import {
    useRouter
} from 'vue-router';
import {
    GAMIFICATION_TASK_START,
    GAMIFICATION_TASK_CHANGE_HEADING,
    GAMIFICATION_TASK_UPDATE_IMAGE,
    GAMIFICATION_TASK_CHANGE_PARAGRAPH,
    GAMIFICATION_TASK_CHANGE_LOGO,
    GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS,
    GAMIFICATION_TASK_CHECK_MOBILE_VIEW,
    GAMIFICATION_TASK_CHANGE_SEO,
    GAMIFICATION_TASK_GO_LIVE,
    GAMIFICATION_EVENT_NAMES,
    MODAL_GAMIFICATION_WELCOME,

    DRAWER_ADD_ELEMENT,
    DRAWER_MULTI_PAGE,
} from '@/constants';
import {
    BLOCK_SLOT_FOOTER,
    ELEMENT_TYPE_TEXT_BOX,
    BLOCK_TYPE_NAVIGATION,
    ELEMENT_TYPE_SOCIAL_ICONS,
    ELEMENT_TYPE_IMAGE,
    BLOCK_TYPE_LAYOUT,
} from '@zyro-inc/site-modules/constants';
import {
    OPEN_MODAL,
    OPEN_DRAWER,
} from '@/store/builder/gui';
import {
    useOnboarding
} from '@/components/onboarding/useOnboarding';
import {
    MOBILE_SWITCH_BUTTON_SELECTOR,
    PUBLISH_BUTTON_SELECTOR,
} from '@/components/onboarding/onboardingSelectors';
import {
    useOverlay
} from '@/use/useOverlay';

const GET_ACHIEVEMENTS = 'getAchievements';
const COMPLETE_ACHIEVEMENT = 'completeAchievement';
const WEBSOCKET_PING_TIME_INTERVAL = 20000;
const HEADER_TAGS = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
];

export const useGamification = () => {
    const {
        dispatch,
        state,
        getters,
    } = useStore();
    const {
        setHighlightedElement,
        showOverlay,
    } = useOverlay();
    const {
        endOnboarding
    } = useOnboarding();
    const router = useRouter();
    const {
        t
    } = useI18n();

    const ws = computed(() => state.gamification.ws);
    const achievements = computed(() => state.gamification.achievements);
    const completedAchievementsCount = computed(() => getters['gamification/completedAchievementsCount']);
    const areAllAchievementsCompleted = computed(() => achievements.value.every(({
        isCompleted
    }) => isCompleted));
    const isGamificationAvailableForSite = computed(() => getters.isGamificationAvailableForSite);
    const isGamificationLoaded = computed(() => state.gamification.isGamificationLoaded);
    const lastCompletedAchievement = computed(() => state.gamification.lastCompletedAchievement);
    const isQATestUser = computed(() => getters.isQATestUser);
    const footerBlockId = computed(() => Object.keys(getters.siteBlocks)
        .find((key) => getters.siteBlocks[key].slot === BLOCK_SLOT_FOOTER));
    const websiteId = computed(() => state.websiteId);

    const getElementPopperReference = (selector) => `[data-popper-reference="${selector}"]`;

    const isParagraphElement = (html) => checkIfHtmlHasGivenTags({
        html,
        tagsToMatch: ['p'],
    });
    const isHeadingElement = (html) => checkIfHtmlHasGivenTags({
        html,
        tagsToMatch: HEADER_TAGS,
    });

    const getAchievementById = (id) => achievements.value.find((item) => id === item.id);

    const isGamificationVisible = computed(() => {
        const isGamificationLoadedOnMobile = isGamificationLoaded.value && !ws.value && !achievements.value.length;

        return isGamificationAvailableForSite.value && !isGamificationLoadedOnMobile;
    });

    const getCurrentPageElementsByType = ({
        elementType
    }) => {
        const currentPageBlockIds = [
            ...getters.currentPage.blocks,
            ...(footerBlockId.value ? [footerBlockId.value] : []),
        ];

        return currentPageBlockIds
            .flatMap((blockId) => (getters.siteBlocks[blockId].components || [])
                .map(
                    (elementId) => ({
                        id: elementId,
                        ...getters.siteElements[elementId],
                    }),
                ))
            .filter((item) => getters.siteElements[item.id].type === elementType);
    };

    const scrollElementIntoView = (selector) => {
        const domElement = document.querySelector(selector);

        domElement ? .scrollIntoView({
            block: 'center',
        });
    };

    const selectCurrentElement = (elementId) => {
        dispatch('updateCurrentBlockId', null);
        dispatch('selectCurrentElement', {
            elementId,
        });
        dispatch('enterElementEditMode');
    };

    const achievementData = computed(() => [{
            id: GAMIFICATION_TASK_START,
        },
        {
            id: GAMIFICATION_TASK_CHANGE_HEADING,
            tooltipText: t('builder.gamificationHeadingEdited'),
            tooltipImage: changeHeadingImg,
            clickAction: () => {
                const elements = getCurrentPageElementsByType({
                    elementType: ELEMENT_TYPE_TEXT_BOX,
                });

                const element = elements.find((item) => isHeadingElement(item.content));

                if (!element) {
                    dispatch(`gui/${OPEN_DRAWER}`, {
                        id: DRAWER_ADD_ELEMENT,
                    });

                    return;
                }

                scrollElementIntoView(`[data-element-ref="${element.id}"]`);
                selectCurrentElement(element.id);
            },
        },
        {
            id: GAMIFICATION_TASK_UPDATE_IMAGE,
            tooltipText: t('builder.gamificationImageUpdated'),
            tooltipImage: changeImageImg,
            clickAction: () => {
                const [element] = getCurrentPageElementsByType({
                    elementType: ELEMENT_TYPE_IMAGE,
                });

                if (element) {
                    scrollElementIntoView(`[data-element-ref="${element.id}"]`);
                    selectCurrentElement(element.id);

                    return;
                }

                const blockWithBackground = getters.currentPage.blocks
                    .map((blockId) => ({
                        id: blockId,
                        ...getters.siteBlocks[blockId],
                    }))
                    .find((item) => item.type === BLOCK_TYPE_LAYOUT && item.background.current === 'image');

                if (!blockWithBackground) {
                    dispatch(`gui/${OPEN_DRAWER}`, {
                        id: DRAWER_ADD_ELEMENT,
                    });

                    return;
                }

                scrollElementIntoView(`[data-block-ref="${blockWithBackground.id}"]`);

                dispatch('updateCurrentBlockId', blockWithBackground.id);

                dispatch('setDefaultBlockEditTab', 'background');
                dispatch('enterBlockEditMode');
            },
        },
        {
            id: GAMIFICATION_TASK_CHANGE_PARAGRAPH,
            tooltipText: t('builder.gamificationParagraphEdited'),
            tooltipImage: changeParagraphImg,
            clickAction: () => {
                const elements = getCurrentPageElementsByType({
                    elementType: ELEMENT_TYPE_TEXT_BOX,
                });
                const element = elements.find((item) => isParagraphElement(item.content));

                if (!element) {
                    dispatch(`gui/${OPEN_DRAWER}`, {
                        id: DRAWER_ADD_ELEMENT,
                    });

                    return;
                }

                scrollElementIntoView(`[data-element-ref="${element.id}"]`);
                selectCurrentElement(element.id);
            },
        },
        {
            id: GAMIFICATION_TASK_CHANGE_LOGO,
            tooltipText: t('builder.gamificationLogoUpdated'),
            tooltipImage: changeLogoImg,
            clickAction: () => {
                const hasHeader = getters.siteBlocks.header ? .type === BLOCK_TYPE_NAVIGATION;

                if (!hasHeader || getters.isNavHidden) {
                    dispatch(`gui/${OPEN_DRAWER}`, {
                        id: DRAWER_MULTI_PAGE,
                    });

                    return;
                }

                scrollElementIntoView('#header');

                dispatch('updateCurrentBlockId', 'header');
                dispatch('setDefaultBlockEditTab', 'logo');
                dispatch('enterBlockEditMode');
            },
        },
        {
            id: GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS,
            tooltipText: t('builder.gamificationSocialIconsChanged'),
            tooltipImage: socialIconsImg,
            clickAction: () => {
                const [element] = getCurrentPageElementsByType({
                    elementType: ELEMENT_TYPE_SOCIAL_ICONS,
                });

                if (!element) {
                    dispatch(`gui/${OPEN_DRAWER}`, {
                        id: DRAWER_ADD_ELEMENT,
                    });

                    return;
                }

                scrollElementIntoView(`[data-element-ref="${element.id}"]`);
                selectCurrentElement(element.id);
            },
        },
        {
            id: GAMIFICATION_TASK_CHECK_MOBILE_VIEW,
            tooltipText: t('builder.gamificationMobileChecked'),
            tooltipImage: mobileViewImg,
            clickAction: () => {
                const elementPopperReference = getElementPopperReference(MOBILE_SWITCH_BUTTON_SELECTOR);

                setHighlightedElement({
                    element: document.querySelector(elementPopperReference),
                });

                showOverlay(true);
            },
        },
        {
            id: GAMIFICATION_TASK_CHANGE_SEO,
            tooltipText: t('builder.gamificationSeoUpdated'),
            tooltipImage: updateSeoImg,
            clickAction: () => {
                router.push({
                    name: SEO_SETTINGS_ROUTE,
                });
            },
        },
        {
            id: GAMIFICATION_TASK_GO_LIVE,
            tooltipText: t('builder.gamficationPublished'),
            tooltipImage: publishImg,
            clickAction: () => {
                const elementPopperReference = getElementPopperReference(PUBLISH_BUTTON_SELECTOR);

                setHighlightedElement({
                    element: document.querySelector(elementPopperReference),
                });

                showOverlay(true);
            },
        },
    ]);

    const pingWebSocket = () => {
        const intervalId = setInterval(() => {
            if (!ws.value || ws.value.readyState !== 1) {
                clearInterval(intervalId);

                return;
            }

            ws.value.send('keep-alive');
        }, WEBSOCKET_PING_TIME_INTERVAL);
    };

    const getAchievements = () => {
        if (!ws.value) {
            return;
        }

        const jsonData = JSON.stringify({
            method: GET_ACHIEVEMENTS,
        });

        ws.value.send(jsonData);
    };

    const completeAchievement = (taskKey) => {
        if (!isGamificationVisible.value) {
            return;
        }

        const isCompleted = getAchievementById(taskKey) ? .isCompleted;

        if (!ws.value || isCompleted) {
            return;
        }

        const jsonData = JSON.stringify({
            method: COMPLETE_ACHIEVEMENT,
            slug: taskKey,
        });

        try {
            ws.value.send(jsonData);

            EventLogApi.logEvent({
                eventName: GAMIFICATION_EVENT_NAMES.TASK_COMPLETED[taskKey],
                isHostingerEvent: true,
            });

            const isLastAchievement = achievements.value
                .every((achievement) => (achievement.id === taskKey || achievement.isCompleted));

            if (isLastAchievement) {
                EventLogApi.logEvent({
                    eventName: GAMIFICATION_EVENT_NAMES.COMPLETED,
                    isHostingerEvent: true,
                });
            }
        } catch (error) {
            captureException(error);

            dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                origin: 'Gamification',
                messageI18nKeyPath: 'builder.gamificatioFailedError',
            });
        }
    };

    const handleOpenEvent = () => {
        pingWebSocket();
        getAchievements();
    };

    const handleCloseEvent = () => {
        if (!areAllAchievementsCompleted.value) {
            dispatch('gamification/setWebsocketObject');
            // eslint-disable-next-line no-use-before-define
            connectToWebsocket(websiteId.value);
        }
    };

    const handleMessageEvent = (messageEvent) => {
        if (!messageEvent.data || messageEvent.data === 'JWT verification failed') {
            dispatch('gamification/setIsGamificationLoaded', true);

            // eslint-disable-next-line no-use-before-define
            removeGamificationWsListeners();

            return;
        }

        const parsedData = JSON.parse(messageEvent.data.toString());
        const oldAchievements = [...achievements.value];
        const createdAt = new Date(parsedData.created_at).getTime();

        const tasks = Object.entries(parsedData.achievements).map(([key, value]) => {
            const found = achievementData.value.find(((action) => action.id === key));

            return {
                id: key,
                isCompleted: !!value.achieved_at,
                name: value.name,
                clickAction: found ? .clickAction,
                tooltipText: found ? .tooltipText,
                tooltipImage: found ? .tooltipImage,
            };
        });

        dispatch('gamification/setAchievements', tasks);
        dispatch('gamification/setIsGamificationLoaded', true);
        dispatch('gamification/setCreatedAt', createdAt);

        const isAchievementNewlyCompleted = (achievement) => oldAchievements.some((oldAchievement) => achievement.id === oldAchievement.id &&
            achievement.isCompleted !== oldAchievement.isCompleted);

        const completedAchievement = achievements.value.find((achievement) => isAchievementNewlyCompleted(achievement));

        if (completedAchievement) {
            dispatch('gamification/setLastCompletedAchievement', completedAchievement);
        }

        const {
            isCompleted: isGamificationTaskStartCompleted
        } = getAchievementById(GAMIFICATION_TASK_START);

        if (!isGamificationTaskStartCompleted && isGamificationVisible.value) {
            if (!isQATestUser.value) {
                dispatch(`gui/${OPEN_MODAL}`, {
                    name: MODAL_GAMIFICATION_WELCOME,
                });
            }

            endOnboarding();

            completeAchievement(GAMIFICATION_TASK_START);
        }
    };

    const removeGamificationWsListeners = () => {
        if (!ws.value) {
            return;
        }

        try {
            ws.value.removeEventListener('open', handleOpenEvent);
            ws.value.removeEventListener('message', handleMessageEvent);
            ws.value.removeEventListener('close', handleCloseEvent);
            ws.value.close();

            dispatch('gamification/setWebsocketObject');
        } catch {
            dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                origin: 'Gamification',
                messageI18nKeyPath: 'builder.gamificatioFailedError',
            });
        }
    };

    const connectToWebsocket = async (siteId) => {
        if (!isGamificationAvailableForSite.value) {
            dispatch('gamification/setIsGamificationLoaded', true);

            return;
        }

        if (!siteId || ws.value) {
            return;
        }

        try {
            const token = await GamificationApi.getGamificationToken(siteId);

            const websocket = new WebSocket(`${import.meta.env.VITE_GAMIFICATION_WEBSOCKET_URL}/gamification?token=${token}`);

            dispatch('gamification/setWebsocketObject', websocket);

            ws.value.addEventListener('open', handleOpenEvent);
            ws.value.addEventListener('message', handleMessageEvent);
            ws.value.addEventListener('close', handleCloseEvent);
        } catch (error) {
            captureException(error);

            dispatch('gamification/setIsGamificationLoaded', true);

            dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                origin: 'Gamification',
                messageI18nKeyPath: 'builder.gamificatioFailedError',
            });
        }
    };

    watch(achievements, (value) => {
        if (value.length && areAllAchievementsCompleted.value) {
            removeGamificationWsListeners();
        }
    });

    return {
        achievements,
        completedAchievementsCount,
        areAllAchievementsCompleted,
        connectToWebsocket,
        removeGamificationWsListeners,
        getAchievements,
        completeAchievement,
        achievementData,
        isParagraphElement,
        isHeadingElement,
        handleMessageEvent,
        isGamificationVisible,
        lastCompletedAchievement,
        isGamificationAvailableForSite,
        getAchievementById,
    };
};