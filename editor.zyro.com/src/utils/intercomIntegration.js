import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';

const ZYRO_URL_CONTACT_US = `${import.meta.env.VITE_HOMEPAGE_URL}/contact-us`;
const appId =
    import.meta.env.VITE_INTERCOM_APP_ID;

const callIntercom = (...args) => {
    if (window.Intercom) {
        window.Intercom(...args);
    }
};

export const updateIntercom = (...args) => {
    callIntercom('update', ...args);
};

export const bootIntercom = (userData) => {
    if (appId) {
        callIntercom('boot', {
            app_id: appId,
            ...userData,
        });

        window.Intercom('onShow', () => {
            if (!isHostingerBrand) {
                window.open(ZYRO_URL_CONTACT_US, '_blank');
                window.Intercom('hide');
            }
        });
    }
};

export const openIntercomMessage = () => callIntercom('showNewMessage');