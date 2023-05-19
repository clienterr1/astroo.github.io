import {
    STATIC_ASSETS_BASE_PATH
} from '@zyro-inc/site-modules/constants';

const APP_IMAGES_BASE_PATH = `${STATIC_ASSETS_BASE_PATH}/ecwid-app-images`;

export const ECWID_APPLICATIONS = [{
        name: 'omniva',
        logoSource: `${APP_IMAGES_BASE_PATH}/omniva.svg`,
        headerText: 'Omniva',
    },
    {
        name: 'dpd',
        logoSource: `${APP_IMAGES_BASE_PATH}/dpd.svg`,
        headerText: 'DPD',
    },
    {
        name: 'lpexpress',
        logoSource: `${APP_IMAGES_BASE_PATH}/lpexpress.svg`,
        headerText: 'LPExpress',
    },
    {
        name: 'inpost',
        logoSource: `${APP_IMAGES_BASE_PATH}/inpost.svg`,
        headerText: 'InPost',
    },
    {
        name: 'other',
        logoSource: `${APP_IMAGES_BASE_PATH}/other.svg`,
        headerText: 'other',
    },
];