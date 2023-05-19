import {
    onlyUnique
} from '@zyro-inc/site-modules/utils/array/onlyUnique';
import {
    extractFontName,
    replaceSpacesWithPlus,
} from '@zyro-inc/site-modules/utils/font';

import FONT_SETS from '@/assets/data/typography-styles-library.json';

export const PARAGRAPH_TEXT = 'Paragraphtext';

/**
 * Takes FONT_SETS array that can be found in 'assets/data' and returns constructed query
 */
export const constructTypographyStylesGoogleFontQuery = () => FONT_SETS
    .flatMap((set) => [ // set.textElementData.font.primary["'Prosto One', sans-serif"] => 'family=Prosto+One'
        `family=${replaceSpacesWithPlus(extractFontName(set.textElementData.font.primary))}`,
        `family=${replaceSpacesWithPlus(extractFontName(set.textElementData.font.secondary))}`,
    ])
    .filter(onlyUnique)
    .join('&');