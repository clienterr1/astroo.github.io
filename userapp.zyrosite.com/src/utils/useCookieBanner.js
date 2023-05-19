import {
    getDomainWithoutWWWPrefix
} from '@zyro-inc/site-modules/utils/domainUtils';
import {
    getCookie,
    setCookie,
} from '@zyro-inc/site-modules/utils/cookies';
import {
    computed,
    onMounted,
    ref,
} from 'vue';
import {
    addIntegrationElements
} from '@/utils/addDocumentElements';
import {
    useStore
} from 'vuex';

export const useCookieBanner = () => {
    const {
        getters
    } = useStore();
    const cookieName = ref('z-cookies-consent');
    const cookieConsent = ref('1');
    const hasUserConsentedCookieBanner = computed(() => !!cookieConsent.value);
    const hasUserAcceptedCookies = computed(() => cookieConsent.value === '1');
    const areCookiesAllowed = computed(() => cookieConsent.value !== '0');

    onMounted(() => {
        const domainNameWithoutWww = getDomainWithoutWWWPrefix(window.location.hostname);

        cookieName.value = `z-cookies-consent-${domainNameWithoutWww}`;
        cookieConsent.value = getCookie(cookieName.value);
    });

    const acceptCookies = () => {
        setCookie(cookieName.value, 1, 365);
        cookieConsent.value = '1';

        addIntegrationElements({
            siteMeta: getters.meta,
            areCookiesAllowed: areCookiesAllowed.value,
        });
    };

    const declineCookies = () => {
        setCookie(cookieName.value, 0, 1);
        cookieConsent.value = '0';
    };

    return {
        acceptCookies,
        declineCookies,
        hasUserConsentedCookieBanner,
        hasUserAcceptedCookies,
        areCookiesAllowed,
    };
};