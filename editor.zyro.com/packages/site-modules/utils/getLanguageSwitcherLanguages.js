import {
    SYSTEM_LOCALE
} from '@zyro-inc/site-modules/constants';

export const getLanguageSwitcherLanguages = ({
        languages,
        defaultLocale,
    }) => Object.keys(languages)
    .filter((locale) => locale !== SYSTEM_LOCALE)
    .map((locale) => {
        const {
            isHidden,
            flagPath,
            country,
            name,
        } = languages[locale];

        return {
            isHidden,
            flagPath,
            country,
            name,
            href: defaultLocale === locale ? '/' : `/${locale}`,
            locale,
        };
    }) ? ? [];