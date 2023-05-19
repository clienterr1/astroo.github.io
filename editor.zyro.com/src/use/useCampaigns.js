import {
    computed,
    ref,
    onBeforeMount,
} from 'vue';

import i18n from '@/i18n/setup';

export const CAMPAIGN_BRAZIL_CONSUMERS_DAY = 'BRAZIL_CONSUMERS_DAY';
export const CAMPAIGN_SPRING = 'SPRING';
export const CAMPAIGN_BLACK_FRIDAY = 'BLACK_FRIDAY';

const CAMPAIGN_DATES = {
    [CAMPAIGN_BRAZIL_CONSUMERS_DAY]: {
        start: '2022-03-14T00:00:00Z',
        end: '2022-03-31T23:59:59Z',
        locales: ['br'],
    },
    [CAMPAIGN_SPRING]: {
        start: '2022-03-01T00:00:00Z',
        end: '2022-05-31T23:59:59Z',
    },
    [CAMPAIGN_BLACK_FRIDAY]: {
        start: '2022-11-11T00:00:00Z',
        end: '2022-12-04T05:59:59Z',
        locales: [
            'en',
            'fr',
            'lt',
            'pt',
            'br',
            'es',
        ],
    },
};

const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const HOURS_IN_DAY = 24;

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;
const WEEK_DAY_MAP = {
    mon: 0,
    tue: 1,
    wed: 2,
    thu: 3,
    fri: 4,
    sat: 5,
    sun: 6,
};

const timeLeft = ref(null);
const intervalId = ref(null);
const campaigns = ref({});

export const useCampaigns = () => {
    const timerDays = computed(() => {
        const days = Math.floor((timeLeft.value / (HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE)));

        return days.toString().padStart(2, '0');
    });

    const timerHours = computed(() => {
        const hours = Math.floor(
            (timeLeft.value % (SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY)) / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR),
        );

        return hours.toString().padStart(2, '0');
    });

    const timerMinutes = computed(() => {
        const minutes = Math
            .floor((timeLeft.value % (SECONDS_IN_MINUTE * MINUTES_IN_HOUR)) / (MINUTES_IN_HOUR));

        return minutes.toString().padStart(2, '0');
    });

    const timerSeconds = computed(() => {
        const seconds = Math.floor((timeLeft.value % SECONDS_IN_MINUTE));

        return seconds.toString().padStart(2, '0');
    });

    const initiateCampaignTimer = () => {
        const currentDate = new Date();
        const [
            hour,
            minutes,
            seconds,
        ] = currentDate.toISOString().split('T')[1].slice(0, 8).split(':');
        const dayOfTheWeek = currentDate.toString().slice(0, 3).toLowerCase();

        const timePassedTotal = WEEK_DAY_MAP[dayOfTheWeek] * 24 * 3600 +
            Number.parseInt(hour, 10) * 3600 +
            Number.parseInt(minutes, 10) * 60 +
            Number.parseInt(seconds, 10);

        timeLeft.value = WEEK_IN_SECONDS - timePassedTotal;
    };

    const initiateCampaignTimeout = () => {
        if (intervalId.value) {
            return;
        }

        intervalId.value = setInterval(() => {
            timeLeft.value -= 1;

            if (timeLeft.value <= 0) {
                clearInterval(intervalId.value);
            }
        }, 1000);
    };

    const loadCampaigns = () => {
        const currentTime = Date.now();

        campaigns.value = Object.fromEntries(
            Object.entries(CAMPAIGN_DATES).map((([campaignKey, campaign]) => {
                const startDate = new Date(campaign.start).getTime();
                const endDate = new Date(campaign.end).getTime();
                const isCampaignRunning = currentTime > startDate && currentTime < endDate;

                const isCampaignEnabledForACertainlocale = !campaign.locales || campaign.locales.includes(i18n.global.locale);
                const isCampaignActive = isCampaignRunning && isCampaignEnabledForACertainlocale;

                return [
                    campaignKey,
                    isCampaignActive,
                ];
            })),
        );
    };

    onBeforeMount(() => {
        loadCampaigns();
        initiateCampaignTimer();
        initiateCampaignTimeout();
    });

    return {
        timerSeconds,
        timerMinutes,
        timerHours,
        timerDays,
        initiateCampaignTimer,
        initiateCampaignTimeout,
        loadCampaigns,
        campaigns,
    };
};