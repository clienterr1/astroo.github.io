import {
    BUILDER_BRAND_HOSTINGER
} from '@/constants';

// Used to check on what brand Editor is currently running. When true, Hostinger brand styling/functionality should be applied.
export const isHostingerBrand =
    import.meta.env.VITE_BUILDER_BRAND === BUILDER_BRAND_HOSTINGER;