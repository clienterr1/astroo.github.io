/**
 * Transform items array based on columnCount to array of columns with items
 * assign to specific column to mimic masonry effect. Adds originalIndex value
 * to image object which is used to select correct image from original array.
 *
 * @param {string} columnCount - masonry column count
 * @param {array} items - items to transform to masonry columns
 * @return {array} - array of columns with items assign to specific column to mimic masonry effect
 */
export const getMasonryColumns = (columnCount, items) => {
    const initialColumns = Array(columnCount).fill([]);

    return items
        .reduce((acc, curr, i) => {
            const columnIndex = i % columnCount;

            acc[columnIndex] = [
                ...acc[columnIndex],
                {
                    ...curr,
                    originalIndex: i,
                },
            ];

            return acc;
        }, initialColumns);
};