import {
    computed,
    ref,
} from 'vue';

import {
    DESKTOP_BLOCK_WIDTH,
    DEFAULT_MOBILE_BLOCK_HEIGHT,
    MOBILE_BUILDER_WIDTH,
    MOBILE_BLOCK_WIDTH,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';

import {
    ELEMENT_TYPE_MAP,
    ELEMENT_TYPE_VIDEO,
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

import {
    getLowestElementBottom
} from '@zyro-inc/site-modules/utils/getLowestElementBottom';

const ELEMENTS_WITH_CONSTANT_HEIGHT = [
    ELEMENT_TYPE_MAP,
    ELEMENT_TYPE_VIDEO,
];

export const getLastRowHeight = ({
    lowestElementBottom,
    sectionMinHeight,
}) => {
    // This happens then you drag element bellow section bottom
    // After doing that sectionMinHeight is not updated and element bottom is below section height

    const isElementBelowSectionHeight = lowestElementBottom >= sectionMinHeight;
    const lastRowHeightPixels = isElementBelowSectionHeight ? 0 : sectionMinHeight - lowestElementBottom;

    return lowestElementBottom ? `${lastRowHeightPixels}px` : '1fr';
};

// Calculate vertical element positions
// eslint-disable-next-line consistent-return
export const calculateRowTopsUniqueSorted = ({
    blockElementsWithPosition
}) => {
    try {
        // For each component, find the start and end distance from the top
        const rowsTop = blockElementsWithPosition
            .flatMap(({
                position
            }) => [
                position.top,
                position.height + position.top,
            ]);

        // Sometimes the start/end distances from the top are equal, so we need to remove duplicates
        // Adding 0 as the first row
        const rowTopsUniqueSorted = [
            ...new Set([
                0,
                ...rowsTop,
            ]),
        ].sort((a, b) => a - b);

        return rowTopsUniqueSorted;
    } catch (error) {
        console.error(error);
    }
};

export const getElementPositionInGrid = ({
    rowTopsUniqueSorted,
    columnsLeftUniqueSorted,
    elementPosition,
}) => {
    const {
        top,
        left,
        width,
        height,
    } = elementPosition;

    const rowStart = rowTopsUniqueSorted.indexOf(top) + 1;
    const rowEnd = rowTopsUniqueSorted.indexOf(top + height) + 1;

    const columnStart = columnsLeftUniqueSorted.indexOf(left) + 1;
    const columnEnd = columnsLeftUniqueSorted.indexOf(left + width) + 1;

    return {
        rowStart,
        rowEnd,
        columnStart,
        columnEnd,
    };
};

// Calculate horizontal element positions
export const calculateColumnLeftsUniqueSorted = ({
    blockElementsWithPosition,
    blockWidth,
}) => {
    // For each component, find the start and end distance from the left
    const columnsLeft = blockElementsWithPosition
        .flatMap(({
            position
        }) => [
            position.left,
            position.width + position.left,
        ]);
    // Sometimes the start/end distances from the left are equal, so we need to remove duplicates
    // Adding 0 and block.width as the first and last column respectively
    const columnsLeftUniqueSorted = [
        ...new Set([
            0,
            ...columnsLeft,
            blockWidth,
        ]),
    ].sort((a, b) => a - b);

    return columnsLeftUniqueSorted;
};

export const getBlockElementsPositions = ({
    blockElements,
    elementPositionKey,
}) => blockElements.map((element) => ({
    ...element,
    position: element[elementPositionKey],
}));

// Calculate grid-template-rows css property
export const calculateGridTemplateColumns = ({
    blockElements,
    elementPositionKey,
    buildResponsiveGrid,
}) => {
    const blockWidth = elementPositionKey === ELEMENT_POSITION_KEY_MOBILE ? MOBILE_BUILDER_WIDTH : DESKTOP_BLOCK_WIDTH;
    const elementsPositions = getBlockElementsPositions({
        blockElements,
        elementPositionKey,
    });
    const columnsLeftUniqueSorted = calculateColumnLeftsUniqueSorted({
        blockElementsWithPosition: elementsPositions,
        blockWidth,
    });
    // For each distance from the left, subtract the previous distance to find distances between columns
    const gridColumns = columnsLeftUniqueSorted
        .map((columnLeft, index, columnList) => (index === 0 ? columnLeft : columnLeft - columnList[index - 1]));

    const gridTemplateColumns = gridColumns
        // Remove 0 because CSS grid assumes 0 column by default
        .filter((column) => column !== 0)
        .map((column) => (buildResponsiveGrid ? `${(column / blockWidth) * 100}%` : `${column}px`)).join(' ');

    return gridTemplateColumns;
};

export const filterOutZeroRows = ({
    gridRows
}) => gridRows.filter((row) => row !== 0);
export const mapToPxRows = ({
    gridRows
}) => gridRows.map((row) => `${row}px`);
export const mapToMinMaxRows = ({
    gridRows
}) => gridRows.map((row) => `minmax(${row}px, auto)`);
export const mapToResponsiveRows = ({
    gridRows,
    responsiveRows,
    isMobile,
}) => gridRows.map((row, index) => {
    if (responsiveRows.includes(index + 1)) {
        return 'auto';
    }

    // Rows without elements should have fixed height so that spacing would be consistent
    const spacing = (row * 100) / (isMobile ? MOBILE_BLOCK_WIDTH : DESKTOP_BLOCK_WIDTH);

    return `${spacing}vw`;
});
export const concatenateGridTemplateRows = ({
    gridRows,
    lastRowHeight,
}) => `${gridRows.join(' ')} ${lastRowHeight}`;

// Calculate grid-template-rows css property
export const calculateGridTemplateRows = ({
    blockElements,
    elementPositionKey,
    buildResponsiveGrid,
    responsiveRows,
    lowestElementBottom,
    sectionMinHeight,
}) => {
    const isMobile = elementPositionKey === ELEMENT_POSITION_KEY_MOBILE;
    const elementsPositions = getBlockElementsPositions({
        blockElements,
        elementPositionKey,
    });
    const rowTopsUniqueSorted = calculateRowTopsUniqueSorted({
        blockElementsWithPosition: elementsPositions,
    });
    // For each distance from the top, subtract the previous distance to find distances between rows
    const gridRows = rowTopsUniqueSorted
        .map((rowTop, index, rowList) => (index === 0 ? rowTop : rowTop - rowList[index - 1]));

    const lastRowHeight = getLastRowHeight({
        lowestElementBottom,
        sectionMinHeight,
    });

    const nonZeroRows = filterOutZeroRows({
        gridRows,
    });

    if (!buildResponsiveGrid) {
        const gridPixelRows = mapToPxRows({
            gridRows: nonZeroRows,
        });

        return concatenateGridTemplateRows({
            gridRows: gridPixelRows,
            lastRowHeight,
        });
    }

    if (!responsiveRows) {
        const gridMinMaxRows = mapToMinMaxRows({
            gridRows: nonZeroRows,
        });

        return concatenateGridTemplateRows({
            gridRows: gridMinMaxRows,
            lastRowHeight,
        });
    }

    const gridResponsiveRows = mapToResponsiveRows({
        gridRows: nonZeroRows,
        responsiveRows,
        isMobile,
    });

    return concatenateGridTemplateRows({
        gridRows: gridResponsiveRows,
        lastRowHeight,
    });
};

export const getResponsiveGridRows = ({
    blockElements,
    elementPositionKey,
}) => {
    const elementsPositions = getBlockElementsPositions({
        blockElements,
        elementPositionKey,
    });
    const rowTopsUniqueSorted = calculateRowTopsUniqueSorted({
        blockElementsWithPosition: elementsPositions,
    });
    const columnsLeftUniqueSorted = calculateColumnLeftsUniqueSorted({
        blockElementsWithPosition: elementsPositions,
        blockWidth: elementPositionKey === ELEMENT_POSITION_KEY_MOBILE ? MOBILE_BUILDER_WIDTH : DESKTOP_BLOCK_WIDTH,
    });

    return blockElements
        .filter((element) => !ELEMENTS_WITH_CONSTANT_HEIGHT.includes(element.type))
        .reduce((acc, element) => {
            const {
                rowEnd,
                rowStart,
            } = getElementPositionInGrid({
                rowTopsUniqueSorted,
                columnsLeftUniqueSorted,
                elementPosition: element[elementPositionKey],
            });

            // When element is added on desktop on mobile we add height -1
            // As a result rowEnd becomes lower than rowStart
            const rowsLength = rowEnd > rowStart ?
                rowEnd - rowStart :
                1;

            // Get all the rows that element spans
            const rows = [...new Array(rowsLength).keys()]
                .map((_, index) => rowStart + index);

            // Check if any element row is already responsive
            // For element to be responsive only one auto row is needed to resize
            if (acc.some((row) => rows.includes(row))) {
                return acc;
            }

            return [
                ...acc,
                rowEnd - 1,
            ];
        }, []);
};

export const getLayoutElements = (blockElements, elementsZindexes) => {
    const desktopElementsPositions = getBlockElementsPositions({
        blockElements,
        elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
    });
    const desktopRowTopsUniqueSorted = calculateRowTopsUniqueSorted({
        blockElementsWithPosition: desktopElementsPositions,
    });
    const desktopColumnsLeftUniqueSorted = calculateColumnLeftsUniqueSorted({
        blockElementsWithPosition: desktopElementsPositions,
        blockWidth: DESKTOP_BLOCK_WIDTH,
    });
    const mobileElementsPositions = getBlockElementsPositions({
        blockElements,
        elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
    });
    const mobileRowTopsUniqueSorted = calculateRowTopsUniqueSorted({
        blockElementsWithPosition: mobileElementsPositions,
    });
    const mobileColumnsLeftUniqueSorted = calculateColumnLeftsUniqueSorted({
        blockElementsWithPosition: mobileElementsPositions,
        blockWidth: DESKTOP_BLOCK_WIDTH,
    });

    return blockElements.map((element) => {
        const {
            rowStart,
            rowEnd,
            columnStart,
            columnEnd,
        } = getElementPositionInGrid({
            rowTopsUniqueSorted: desktopRowTopsUniqueSorted,
            columnsLeftUniqueSorted: desktopColumnsLeftUniqueSorted,
            elementPosition: element.desktop,
        });

        const {
            rowStart: mobileRowStart,
            rowEnd: mobileRowEnd,
            columnStart: mobileColumnStart,
            columnEnd: mobileColumnEnd,
        } = getElementPositionInGrid({
            rowTopsUniqueSorted: mobileRowTopsUniqueSorted,
            columnsLeftUniqueSorted: mobileColumnsLeftUniqueSorted,
            elementPosition: element.mobile,
        });

        return {
            ...element,
            settings: {
                ...element.settings,
                styles: {
                    ...(element.settings ? .styles || {}),
                    'z-index': elementsZindexes.indexOf(element.elementId) + 1,
                    'grid-row': `${rowStart}/${rowEnd}`,
                    'grid-column': `${columnStart}/${columnEnd}`,
                    'm-grid-row': `${mobileRowStart}/${mobileRowEnd}`,
                    'm-grid-column': `${mobileColumnStart}/${mobileColumnEnd}`,
                },
            },
        };
    });
};

export const useBlockLayout = ({
    blockData,
    siteElements,
    shouldBuildResponsive = true,
} = {}) => {
    const buildResponsiveGrid = ref(shouldBuildResponsive);

    // Make an array of block components, extend it with componentId
    const blockElements = computed(() => blockData.value.components.map((elementId) => {
        const element = siteElements.value[elementId];

        return {
            ...element,
            elementId,
        };
    }));

    const mobileLowestElementBottom = computed(() => {
        if (!blockElements ? .value ? .length) {
            return null;
        }

        return getLowestElementBottom({
            blockElements: blockElements.value,
            elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
        });
    });

    const desktopLowestElementBottom = computed(() => {
        if (!blockElements ? .value ? .length) {
            return null;
        }

        return getLowestElementBottom({
            blockElements: blockElements.value,
            elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
        });
    });

    const mobileBlockMinHeight = computed(() => {
        // Alow mobile section to resize freely if it has elements
        if (blockData.value.mobile ? .minHeight && mobileLowestElementBottom.value) {
            return 'auto';
        }

        return `${blockData.value.mobile?.minHeight || DEFAULT_MOBILE_BLOCK_HEIGHT}px`;
    });

    const smallDesktopBlockMinHeight = computed(() => {
        // Alow mobile section to resize freely if it has elements
        if (blockData.value.desktop ? .minHeight && desktopLowestElementBottom.value) {
            return 'auto';
        }

        return `${blockData.value.desktop?.minHeight}px`;
    });

    const isMobileLegacy = computed(() => blockData.value.components.some((element) => {
        const elementData = siteElements.value[element];

        return !elementData.mobile;
    }));

    // #region Desktop grid
    // Calculate grid-template-rows for desktop
    const desktopGridTemplateRows = computed(() => calculateGridTemplateRows({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
        buildResponsiveGrid: buildResponsiveGrid.value,
    }));

    // Calculate grid-template-columns for desktop
    const desktopGridTemplateColumns = computed(() => calculateGridTemplateColumns({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
        buildResponsiveGrid: buildResponsiveGrid.value,
    }));

    // #endregion

    // #region Mobile grid
    const mobileGridTemplateColumns = computed(() => calculateGridTemplateColumns({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
        buildResponsiveGrid: buildResponsiveGrid.value,
    }));

    const mobileGridResponsiveRows = computed(() => getResponsiveGridRows({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
    }));

    const mobileGridTemplateRows = computed(() => calculateGridTemplateRows({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
        buildResponsiveGrid: buildResponsiveGrid.value,
        responsiveRows: mobileGridResponsiveRows.value,
        lowestElementBottom: mobileLowestElementBottom.value,
        sectionMinHeight: blockData.value.mobile ? .minHeight,
    }));
    // #endregion

    // #region Tablet grid
    // Currently it uses same sizes as mobile
    const tabletGridTemplateRows = computed(() => calculateGridTemplateRows({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
        buildResponsiveGrid: buildResponsiveGrid.value,
    }));
    // #endregion

    // #region Small desktop grid
    // Currently it uses same sizes as desktop for screen between 920 and 1224px
    const smallDesktopGridResponsiveRows = computed(() => getResponsiveGridRows({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
    }));

    const smallDesktopGridTemplateRows = computed(() => calculateGridTemplateRows({
        blockElements: blockElements.value,
        elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
        buildResponsiveGrid: buildResponsiveGrid.value,
        responsiveRows: smallDesktopGridResponsiveRows.value,
        lowestElementBottom: desktopLowestElementBottom.value,
        sectionMinHeight: blockData.value.desktop ? .minHeight,
    }));

    // #endregion

    // Enhance block elements with grid-row property
    const layoutElements = computed(() => getLayoutElements(blockElements.value, blockData.value.zindexes));

    const layoutCSSVars = computed(() => ({
        '--m-grid-template-rows': mobileGridTemplateRows.value,
        '--t-grid-template-rows': tabletGridTemplateRows.value,
        '--small-desktop-grid-template-rows': smallDesktopGridTemplateRows.value,
        '--grid-template-rows': desktopGridTemplateRows.value,

        '--m-grid-template-columns': mobileGridTemplateColumns.value,
        '--grid-template-columns': desktopGridTemplateColumns.value,

        '--m-block-min-height': mobileBlockMinHeight.value,
        '--t-block-min-height': `${blockData.value.mobile?.minHeight || DEFAULT_MOBILE_BLOCK_HEIGHT}px`,
        '--small-desktop-block-min-height': smallDesktopBlockMinHeight.value,
        '--block-min-height': `${blockData.value.desktop.minHeight}px`,
    }));

    return {
        layoutElements,
        buildResponsiveGrid,
        layoutCSSVars,
        isMobileLegacy,
    };
};