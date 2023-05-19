import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    PROPERTY_FONT_SIZE,
    TYPOGRAPHY_HEADINGS,
    TYPOGRAPHY_PARAGRAPHS,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
    filterObject,
    mapObject,
} from '@zyro-inc/site-modules/utils/object';

import {
    getMaxArrayValue,
    getMinArrayValue,
} from '@/utils/array';

const MAX_HEADING_PREVIEW_SIZE = 32;
const MIN_HEADING_PREVIEW_SIZE = 14;
const MAX_PARAGRAPH_PREVIEW_SIZE = 18;
const MIN_PARAGRAPH_PREVIEW_SIZE = 14;

export const getHeadingFontSizes = (styles) => mapObject(
    filterObject(styles, ({
        key
    }) => TYPOGRAPHY_HEADINGS.includes(key)),
    ({
        value
    }) => Number.parseInt(value[PROPERTY_FONT_SIZE], 10),
);

export const getParagraphFontSizes = (styles) => mapObject(
    filterObject(styles, ({
        key
    }) => TYPOGRAPHY_PARAGRAPHS.includes(key)),
    ({
        value
    }) => Number.parseInt(value[PROPERTY_FONT_SIZE], 10),
);

export const previewFormula = ({
    previewMinValue,
    previewMaxValue,
    currentMaxValue,
    currentMinValue,
}, sizeToPreview) => Math.round((previewMinValue + (
    ((sizeToPreview - currentMinValue) * (previewMaxValue - previewMinValue)) /
    (currentMaxValue - currentMinValue)
)) * 10) / 10;

export const useTextTypePreviewCalculation = () => {
    const {
        getters
    } = useStore();

    const headingFontSizes = computed(() => getHeadingFontSizes(getters.siteStyles));

    const paragraphFontSizes = computed(() => getParagraphFontSizes(getters.siteStyles));

    const allTypographyFontSizes = computed(
        () => ({
            ...headingFontSizes.value,
            ...paragraphFontSizes.value,
        }),
    );

    const headingFontSizeArray = computed(() => Object.values(headingFontSizes.value));

    const paragraphFontSizeArray = computed(() => Object.values(paragraphFontSizes.value));

    const maxHeadingFontSize = computed(() => getMaxArrayValue(headingFontSizeArray.value));

    const minHeadingFontSize = computed(() => getMinArrayValue(headingFontSizeArray.value));

    const maxParagraphFontSize = computed(() => getMaxArrayValue(paragraphFontSizeArray.value));

    const minParagraphFontSize = computed(() => getMinArrayValue(paragraphFontSizeArray.value));

    const typographyPreviewSizes = computed(
        () => mapObject(allTypographyFontSizes.value, ({
            key: typographyType,
            value: typographyFontSize,
        }) => {
            const previewFormulaValues = TYPOGRAPHY_HEADINGS.includes(typographyType) ? {
                previewMinValue: MIN_HEADING_PREVIEW_SIZE,
                previewMaxValue: MAX_HEADING_PREVIEW_SIZE,
                currentMaxValue: maxHeadingFontSize.value,
                currentMinValue: minHeadingFontSize.value,
            } : {
                previewMinValue: MIN_PARAGRAPH_PREVIEW_SIZE,
                previewMaxValue: MAX_PARAGRAPH_PREVIEW_SIZE,
                currentMaxValue: maxParagraphFontSize.value,
                currentMinValue: minParagraphFontSize.value,
            };

            return previewFormula({
                ...previewFormulaValues,
            }, typographyFontSize);
        }),
    );

    return {
        typographyPreviewSizes,
        headingFontSizes,
        paragraphFontSizes,
        headingFontSizeArray,
        paragraphFontSizeArray,
        minParagraphFontSize,
        minHeadingFontSize,
        maxParagraphFontSize,
        maxHeadingFontSize,
    };
};