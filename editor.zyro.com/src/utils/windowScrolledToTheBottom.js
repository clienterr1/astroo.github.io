import {
    getDocumentHeight
} from '@/utils/browser';

// Helps to determine if the user has scrolled browser window to the bottom.
export default function windowScrolledToTheBottom() {
    const {
        pageYOffset
    } = window;
    const {
        body,
        documentElement,
    } = document;
    const {
        scrollTop,
        clientHeight,
    } = documentElement;

    return pageYOffset === 0 ? false :
        Math.max(pageYOffset, scrollTop, body.scrollTop) + clientHeight === getDocumentHeight();
}