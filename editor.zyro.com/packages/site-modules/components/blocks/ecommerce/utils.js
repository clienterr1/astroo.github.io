import {
    BOOKING_DURATION_UNIT_HOURS,
    SITE_PRODUCT_SELECTION,
    SITE_PRODUCT_SELECTION_TYPE_LOWEST,
} from '@zyro-inc/site-modules/constants/ecommerce';

export const COLUMN_COUNT_6 = 6;
export const COLUMN_COUNT_5 = 5;
export const COLUMN_COUNT_4 = 4;
export const COLUMN_COUNT_3 = 3;
export const COLUMN_COUNT_2 = 2;

export const productsPerPageByColumnCount = {
    [COLUMN_COUNT_6]: 18,
    [COLUMN_COUNT_5]: 15,
    [COLUMN_COUNT_4]: 12,
    [COLUMN_COUNT_3]: 9,
    [COLUMN_COUNT_2]: 6,
};

const isBookingProductDurationInHours = (product) => (product ? .variants[0].booking_event ? .length_unit === BOOKING_DURATION_UNIT_HOURS);

export function getBookingDuration(product) {
    return product ? .variants[0].booking_event ? .length || null;
}

export const getFormattedBookingDuration = (product, translations) => {
    // not using toPrecision because bigger numbers that have more than 3 digits are displayed with exponential notation
    const roundNumberToTwoDecimals = (number) => Math.round(number * 100) / 100;

    if (isBookingProductDurationInHours(product)) {
        return `${roundNumberToTwoDecimals(getBookingDuration(product) / 1000 / 60 / 60)} ${translations.hourShort}`;
    }

    return `${roundNumberToTwoDecimals(getBookingDuration(product) / 1000 / 60)} ${translations.minuteShort}`;
};

export const isProductPriceRangeShown = (product) => {
    if (product[SITE_PRODUCT_SELECTION] !== SITE_PRODUCT_SELECTION_TYPE_LOWEST) {
        return false;
    }

    return !product.variants.every(
        (item, _, arr) => {
            const firstPrice = arr[0].prices[0].sale_amount ? ? arr[0].prices[0].amount;
            const priceToCompareWith = item.prices[0].sale_amount ? ? item.prices[0].amount;

            return firstPrice === priceToCompareWith;
        },
    );
};