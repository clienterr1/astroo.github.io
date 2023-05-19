export const snapPositionToGrid = ({
    position,
    columnCount,
}) => {
    const newPosition = position;
    // Limit to center grid
    let leftOvershot = false;
    let rightOvershot = false;

    if (newPosition.x1 < 3) {
        const overshot = Math.abs(newPosition.x1 - 3);

        newPosition.x1 += overshot;
        newPosition.x2 += overshot;
        leftOvershot = true;
    }

    if (newPosition.x2 > columnCount + 3) {
        const overshot = newPosition.x2 - columnCount - 3;

        newPosition.x2 -= overshot;
        newPosition.x1 -= overshot;
        rightOvershot = true;
    }

    // Check left overshot again, overshooting on the right may make left side too big
    if (newPosition.x1 < 3) {
        const overshot = Math.abs(newPosition.x1 - 3);

        newPosition.x1 += overshot;
        newPosition.x2 += overshot;
        leftOvershot = true;
    }

    if (leftOvershot && rightOvershot) {
        newPosition.x1 = 3;
        newPosition.x2 = columnCount + 3;
    }

    if (newPosition.y1 < 1) {
        const overshot = Math.abs(1 - newPosition.y1);

        newPosition.y1 += overshot;
        newPosition.y2 += overshot;
    }

    return newPosition;
};