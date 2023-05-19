import {
    computed,
    ref,
} from 'vue';

import {
    useStore
} from 'vuex';
import {
    countryCodes
} from '@/data/isoCountryCodes';
import {
    captureException
} from '@sentry/browser';
import {
    useNotifications
} from '@/use/useNotifications';
import {
    useApi,
    SITE_TRAFFIC_API,
} from '@/use/useApi';
import {
    useI18n
} from 'vue-i18n';

const siteTrafficData = ref(null);
const DEFAULT_DAYS_TO_SHOW = 7;

export const useSiteTraffic = () => {
    const {
        isLoading,
        hasFailed,
        error,
        result,
        callApi,
    } = useApi();

    const {
        t
    } = useI18n();
    const {
        notify
    } = useNotifications();
    const {
        state,
        getters,
    } = useStore();

    const customDomain = computed(() => state.customDomain);
    const isPublishedSiteWithCustomDomain = computed(() => customDomain.value && getters.isSitePublished);
    const daysToShow = ref(DEFAULT_DAYS_TO_SHOW);

    const fetchSiteTrafficData = async ({
        forceFetch = false
    } = {}) => {
        if ((siteTrafficData.value && !forceFetch) || !isPublishedSiteWithCustomDomain.value) {
            return;
        }

        await callApi(`${SITE_TRAFFIC_API}/${customDomain.value}`);

        if (hasFailed.value) {
            captureException(error);
            notify({
                message: t('builder.analyticsFetchHasFailed'),
                origin: 'useSiteTraffic.js',
            });

            return;
        }

        siteTrafficData.value = result.value;
    };

    const isVisitorsCountDataAvailable = computed(() => {
        if (!siteTrafficData.value) {
            return false;
        }

        const allVisitorCountsAreZeros = Object.values(siteTrafficData.value.totalVisitors).every((visitorCount) => visitorCount === 0);

        if (allVisitorCountsAreZeros) {
            return false;
        }

        return true;
    });

    const siteTotalVisitorsData = computed(() => {
        if (!isVisitorsCountDataAvailable.value) {
            return [];
        }

        // Removing last item from the data array because it's always 0
        const totalVisitorsArray = Object.entries(siteTrafficData.value.totalVisitors).slice(0, -1);

        return totalVisitorsArray.slice(totalVisitorsArray.length - daysToShow.value, totalVisitorsArray.length);
    });

    /**
     * @param {*} data Key value pair object, where key is date & value is number
     * @returns trend in percentage for selected days, where positive number indicate gain and negative - drop
     * Excludes current day
     */
    const getTrendByDaysToShow = ({
        data
    }) => {
        if (!data) return null;
        const periodDataSet = Object.values(data);
        const firstPeriod = periodDataSet
            .slice(-daysToShow.value - 1, -1)
            .reduce((sum, cur) => sum + cur, 0);

        const secondPeriod = periodDataSet
            .slice(-daysToShow.value * 2 - 1, -daysToShow.value - 1)
            .reduce((sum, cur) => sum + cur, 0);

        return Math.round((((firstPeriod - secondPeriod) / (secondPeriod || 100)) * 100));
    };

    /**
     * @param {*} data Key value pair object, where key is date & value is number
     * @returns accumulation of given numeric data for selected days
     * Excludes current day
     */
    const getSumByDaysToShow = ({
        data
    }) => {
        if (!data) return null;

        return Object.values(data)
            .slice(-daysToShow.value - 1, -1)
            .reduce((totalSessions, currentSession) => totalSessions + currentSession, 0);
    };

    const uniqueVisitorsCount = computed(() => getSumByDaysToShow({
        data: siteTrafficData.value ? .totalUniqueVisitors,
    }));
    const uniqueVisitorsTrend = computed(() => getTrendByDaysToShow({
        data: siteTrafficData.value ? .totalUniqueVisitors,
    }));
    const siteSessionsCount = computed(() => getSumByDaysToShow({
        data: siteTrafficData.value ? .totalVisitors,
    }));
    const siteSessionsTrend = computed(() => getTrendByDaysToShow({
        data: siteTrafficData.value ? .totalVisitors,
    }));

    /**
     * @param {*} data Key value pair object, where key is country or device & value is Object that contains key value pair object,
     * where key is date & value is number
     * @returns object with country or device name as a key and object that contains:
     * periodVisitorCount - accumulation of given numeric data for selected days
     * periodVisitorTrend - trend in percentage for selected days, where positive number indicate gain and negative - drop
     * totalVisitorPercentagePart - percentage part of total visitors for selected days
     * Excludes current day
     */
    const getFormattedDataForProgressCharts = ({
        data
    }) => {
        if (!data) return null;

        const formattedData = Object.fromEntries(Object.entries(data)
            .map(([key, datesObject]) => {
                // Get a sum of visitors for selected period for current key.
                const periodVisitorCount = getSumByDaysToShow({
                    data: datesObject,
                });

                // Get a trend for selected period for current key.
                const periodPercentageChange = getTrendByDaysToShow({
                    data: datesObject,
                });

                // Get a percentage part of total visitors for selected period for current key.
                const totalVisitorPercentagePart = Math.round((periodVisitorCount / siteSessionsCount.value) * 100);

                return [
                    key,
                    {
                        periodVisitorCount,
                        periodPercentageChange,
                        totalVisitorPercentagePart,
                    },
                ];
            }));

        // Get 5 entries with biggest visitor count.
        const sortedData = Object.fromEntries(Object.entries(formattedData)
            .sort(([, a], [, b]) => b.periodVisitorCount - a.periodVisitorCount)
            .slice(0, 5));

        return sortedData;
    };

    const sessionsByCountryData = computed(() => {
        if (!siteTrafficData.value || !siteTrafficData.value.totalVisitorsByCountries) {
            return null;
        }

        const countriesData = getFormattedDataForProgressCharts({
            data: siteTrafficData.value.totalVisitorsByCountries,
        });

        if (!countriesData) {
            return null;
        }

        // Replace country codes with country names.
        return Object.fromEntries(Object.entries(countriesData)
            .map(([key, value]) => {
                const upperCaseKey = key.toUpperCase();

                return [
                    countryCodes[upperCaseKey] || upperCaseKey,
                    value,
                ];
            }));
    });

    const sessionsByDeviceData = computed(() => {
        if (!siteTrafficData.value || !siteTrafficData.value.totalVisitorsByDevices) {
            return null;
        }

        return getFormattedDataForProgressCharts({
            data: siteTrafficData.value.totalVisitorsByDevices,
        });
    });

    return {
        uniqueVisitorsCount,
        uniqueVisitorsTrend,
        siteSessionsCount,
        siteSessionsTrend,
        fetchSiteTrafficData,
        isLoading,
        sessionsByDeviceData,
        sessionsByCountryData,
        siteTotalVisitorsData,
        isVisitorsCountDataAvailable,
        isPublishedSiteWithCustomDomain,
        daysToShow,
        siteTrafficData,
    };
};