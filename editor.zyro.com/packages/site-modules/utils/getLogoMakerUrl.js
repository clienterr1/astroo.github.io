import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';

export const getLogoMakerUrl = ({
    ref
} = {}) => {
    const locationPrefix = isHostingerBrand ? 'hostinger-builder-' : 'zyro-builder-';
    const builderRef = ref ? `/?ref=${locationPrefix}${ref}` : '';

    return `https://logo.hostinger.com${builderRef}`;
};