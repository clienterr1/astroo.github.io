// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';
import '@/assets/scss/global.scss';
import {
    createApp
} from 'vue';
import axios from 'axios';
import * as Sentry from '@sentry/vue';
import {
    Dedupe
} from '@sentry/integrations';

import {
    dataQADirective,
    QA_DIRECTIVE_NAME,
} from '@zyro-inc/site-modules/directives/dataQaDirective';

import App from '@/App.vue';
import {
    COOKIE_ZYRO_AUTH_ID
} from '@/constants';
import i18n from '@/i18n/setup';
import router from '@/router';
import {
    store
} from '@/store/builder';
import {
    getAuthCookie
} from '@/utils/getCookies';

(async () => {
    if ('ResizeObserver' in window === false) {
        // Loads polyfill asynchronously, only if required.
        const observer = await
        import ('@juggle/resize-observer');

        window.ResizeObserver = observer.ResizeObserver;
    }
})();

// Send cookies with every request
axios.defaults.withCredentials = true;

const app = createApp(App);

if (
    import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
        app,
        allowUrls: [
            'editor.zyro.com',
            /.*zyro.space/,
        ],
        release: import.meta.env.VITE_BUILD_NUMBER || 'builder@dev',
        dsn: import.meta.env.VITE_SENTRY_DSN,
        environment: import.meta.env.VITE_SENTRY_ENV || 'local',
        integrations: [new Dedupe()],
        tracesSampleRate: 1,
        // https://stackoverflow.com/questions/63020810/what-is-best-way-in-javascript-to-stop-throwing-resizeobserver-loop-limit-excee
        ignoreErrors: [
            'Navigation cancelled from', // Navigation cancelled errors are mostly expected, when handling various final-urls in router beforeEnter hook or spamming router.push method (clicking button fast)
            'ResizeObserver loop limit exceeded',
            'Network Error', // we ignore this because most of errors are because client's IP is blacklisted
        ],
        beforeSend(event, hint) {
            const status = hint.originalException ? .response ? .status;
            const authCookie = getAuthCookie();

            if (status === 401 && !authCookie) {
                return false; // do not send error to sentry because if user doesn't have auth cookie then 401 error is expected
            }

            if (hint.originalException ? .message ? .includes ? .('Failed to fetch dynamically imported module')) {
                return false; // do not send error to sentry when user browser failed to fetch dynamically imported module
            }

            if (status === 409) {
                return false; // do not send error to sentry because 409 error is expected saving errors
            }

            // do not send error to sentry because 404 error is expected when user is not logged in or when site is not found
            if (hint.originalException ? .includes ? .('Site not found') || (status === 404 && hint.originalException ? .message ? .includes ? .('Request failed with status code 404'))) {
                return false;
            }

            if (hint.originalException ? .isAxiosError) {
                const cookies = event.request.cookies || {};

                cookies[COOKIE_ZYRO_AUTH_ID] = authCookie;

                // eslint-disable-next-line no-param-reassign
                event.request.cookies = cookies;
            }

            return event;
        },
    });
}

app.use(i18n);
app.use(router);
app.use(store);
app.directive(QA_DIRECTIVE_NAME, dataQADirective);
app.mount('#app');