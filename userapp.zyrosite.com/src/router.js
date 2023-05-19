import {
    createRouter,
    createWebHistory,
} from 'vue-router';

import {
    BLOCK_HEADER_CLASS,
    BLOCK_HEADER_STICKY_CLASS,
} from '@zyro-inc/site-modules/constants';
import PageWrapper from '@/components/PageWrapper.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [{
            path: '/',
            component: PageWrapper,
        },
        {
            path: '/:slug',
            component: PageWrapper,
        },
        {
            path: '/:lang/:slug',
            component: PageWrapper,
        },
    ],
    // If there is a saved already position - use it.
    // If no hash is provided - scroll to top
    // If hash is provided - scroll to the section (and account for header height)
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition && !to.hash) {
            return savedPosition;
        }

        if (!to.hash) {
            return {
                top: 0,
                left: 0,
            };
        }

        const headerHeight = document.querySelector(`.${BLOCK_HEADER_CLASS}`) ? .offsetHeight;
        const isHeaderSticky = document.querySelector(`.${BLOCK_HEADER_STICKY_CLASS}`);

        return {
            el: to.hash,
            top: isHeaderSticky ? headerHeight : 0,
            left: 0,
            behavior: 'smooth',
        };
    },
});

// Make google analytics pageview work with SinglePageApplications
// https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications
router.afterEach((to) => {
    if (window.gtag) {
        window.gtag('set', 'page_path', to.path);
        window.gtag('event', 'page_view');
    }
});

export default router;