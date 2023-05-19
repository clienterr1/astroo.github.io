/**
 * @typedef {Object} ReturnedMoveMethods
 * @property {Function} enableMoveEvents - adds event listeners to move events
 * @property {Function} disableMoveEvents - removes move events from event listeners
 */

/**
 * @typedef {Object} MoveTypes
 * @property {Boolean} swipe - enables swipe events if true
 * @property {Boolean} drag - enables drag events if false
 */

/**
 * https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
 * Basic usage:
 * 1) Pass your move methods on appropriate directions up, right, down, left and extract
 * enabled and disable move event methods
 * const { enableMoveEvents, disableMoveEvents } = swipe({onMoveLeft: navigateLeft});
 * 2) Use enable/disable SwipeEvents on component lifecycle hooks
 * 3) Profit
 * @param {MoveTypes} move - pass a function that would activate on swipe left
 * @param {Function} onMoveLeft - pass a function that would activate on swipe left
 * @param {Function} onMoveRight - pass a function that would activate on swipe right
 * @param {Function} onMoveUp - pass a function that would activate on swipe up
 * @param {Function} onMoveDown - pass a function that would activate on swipe down
 * @returns {ReturnedMoveMethods}
 */
export const moveDirection = ({
    move = {
        swipe: false,
        drag: false,
    },
    onMoveLeft = () => {},
    onMoveRight = () => {},
    onMoveUp = () => {},
    onMoveDown = () => {},
}) => {
    let xDown = null;
    let yDown = null;
    const isSwipeAndDragEnabled = move.swipe && move.drag;
    const isSwipeOrMoveEnabled = move.swipe || move.drag;

    function getTouches(event) {
        return event.touches;
    }

    function handleSwipeStart(event) {
        const firstTouch = getTouches(event)[0];

        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }

    function handleDragStart(event) {
        /**
         * Remove ghost image on drag by replacing with transparent one
         */
        const img = new Image();

        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
        event.dataTransfer.setDragImage(img, 0, 0);

        xDown = event.clientX;
        yDown = event.clientY;
    }

    const triggerMoveDirection = (xDiff, yDiff) => {
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                onMoveLeft();
            } else {
                onMoveRight();
            }
        } else if (yDiff > 0) {
            onMoveUp();
        } else {
            onMoveDown();
        }

        xDown = null;
        yDown = null;
    };

    const handleSwipeMovement = (event) => {
        if (!xDown || !yDown) {
            return;
        }

        const xUp = event.touches[0].clientX;
        const yUp = event.touches[0].clientY;

        const xDiff = xDown - xUp;
        const yDiff = yDown - yUp;

        triggerMoveDirection(xDiff, yDiff);
    };

    const handleDragMovement = (event) => {
        if (!xDown || !yDown) {
            return;
        }

        const xDiff = xDown - event.clientX;
        const yDiff = yDown - event.clientY;

        triggerMoveDirection(xDiff, yDiff);
    };

    const enableMoveEvents = (isAddingListener = true, elementRef = null) => {
        const element = elementRef === null ? document : elementRef;
        const listenerType = isAddingListener ? 'addEventListener' : 'removeEventListener';

        if (isSwipeAndDragEnabled) {
            element[listenerType]('touchstart', handleSwipeStart, false);
            element[listenerType]('touchmove', handleSwipeMovement, false);
            element[listenerType]('dragstart', handleDragStart, false);
            element[listenerType]('drag', handleDragMovement, false);
        } else if (isSwipeOrMoveEnabled) {
            const startMoveHandler = move.swipe ? handleSwipeStart : handleDragStart;
            const movementHandler = move.swipe ? handleSwipeMovement : handleDragMovement;

            element[listenerType](move.swipe ? 'touchstart' : 'dragstart', startMoveHandler, false);
            element[listenerType](move.swipe ? 'touchmove' : 'drag', movementHandler, false);
        }
    };

    return {
        enableMoveEvents,
    };
};