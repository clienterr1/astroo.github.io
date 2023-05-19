import {
    ref,
    computed,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    DEFAULT_GRID_STYLES
} from '@/components/block/blocks';
import {
    useBuilderStyles
} from '@/components/builder-controls/useBuilderStyles';

export const useEditBlockSlideshowSettings = (props, context) => {
    const {
        state,
        getters,
        dispatch,
    } = useStore();
    const {
        getStyleKey,
        getStyleValue,
    } = useBuilderStyles(props, context);

    const currentTab = ref(null);

    const currentBlockSettings = computed(() => getters.currentBlockSettings);

    const currentBlockStyles = computed(() => currentBlockSettings.value.styles);

    const slideshowNavigationArrowsColor = computed(
        () => currentBlockStyles ? .value.navigationArrowsColor,
    );

    const slideshowNavigationBulletsColor = computed(
        () => currentBlockStyles ? .value.navigationBulletsColor,
    );

    const isSlideshowNavigationArrowsVisible = computed(
        () => currentBlockSettings.value.isNavigationArrowsVisible,
    );

    const isSlideshowNavigationBulletsVisible = computed(
        () => currentBlockSettings.value.isNavigationBulletsVisible,
    );

    const isSlideshowAutoplayEnabled = computed(
        () => currentBlockSettings.value.isAutoplayEnabled,
    );

    const isSlideshowLoopEnabled = computed(
        () => currentBlockSettings.value.isLoopEnabled,
    );

    const isSlideshowMobileFullScreenHeightEnabled = computed(
        () => currentBlockSettings.value.isMobileFullScreenHeightEnabled,
    );

    const isSlideshowGridGapsEnabled = computed(() => currentBlockSettings.value.styles['column-gap'] !== '0px' &&
        currentBlockSettings.value.styles['row-gap'] !== '0px');

    const slideshowAutoplayIntervalSeconds = computed(
        () => currentBlockSettings.value.autoplaySlidesIntervalSeconds,
    );

    const slideshowPadding = computed(() => getStyleValue('block-padding', currentBlockStyles ? .value));

    const setCurrentTab = (tab) => {
        currentTab.value = tab;
    };

    /**
     * Set's the color of slideshow navigations
     * @param {
     * 'navigationArrowsColor',
     * 'navigationBulletsColor',
     * 'block-padding',
     * 'm-block-padding'
     * } style - color control key
     * @param value - style value
     */
    const setSlideshowStyle = (style, value) => {
        const styleKey = getStyleKey(style);

        dispatch('updateBlockData', {
            blockId: state.currentBlockId,
            blockData: {
                settings: {
                    styles: {
                        [styleKey]: value,
                    },
                },
            },
            merge: true,
        });
    };

    const setSlideshowSetting = (setting, value) => {
        dispatch('updateBlockData', {
            blockId: state.currentBlockId,
            blockData: {
                settings: {
                    [setting]: value,
                },
            },
            merge: true,
        });
    };

    const toggleSlideshowGridGaps = () => {
        if (isSlideshowGridGapsEnabled.value) {
            dispatch('updateBlockData', {
                blockId: state.currentBlockId,
                blockData: {
                    settings: {
                        styles: {
                            'column-gap': '0px',
                            'row-gap': '0px',
                            'row-size': '64px',
                        },
                    },
                },
                merge: true,
            });
        } else {
            dispatch('updateBlockData', {
                blockId: state.currentBlockId,
                blockData: {
                    settings: {
                        styles: {
                            'column-gap': DEFAULT_GRID_STYLES['column-gap'],
                            'row-gap': DEFAULT_GRID_STYLES['row-gap'],
                            'row-size': DEFAULT_GRID_STYLES['row-size'],
                        },
                    },
                },
                merge: true,
            });
        }
    };

    return {
        currentTab,
        currentBlockStyles,
        slideshowNavigationArrowsColor,
        slideshowNavigationBulletsColor,
        isSlideshowNavigationArrowsVisible,
        isSlideshowNavigationBulletsVisible,
        isSlideshowAutoplayEnabled,
        isSlideshowLoopEnabled,
        isSlideshowMobileFullScreenHeightEnabled,
        isSlideshowGridGapsEnabled,
        slideshowAutoplayIntervalSeconds,
        slideshowPadding,
        toggleSlideshowGridGaps,
        setCurrentTab,
        setSlideshowStyle,
        setSlideshowSetting,
    };
};