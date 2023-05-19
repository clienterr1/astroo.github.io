import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';

const createDomElement = ({
    type,
    tagName,
    properties = {},
    children = [],
}) => {
    if (type !== 'element') {
        return console.error('Failed to injected HTML element - missing node type');
    }

    const element = document.createElement(tagName);

    Object.entries(properties).forEach(([property, value]) => {
        element.setAttribute(property, value);
    });

    if (children.length) {
        const innerHTML = (children.find((child) => child.type === 'text')).value;

        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
    }

    return element;
};

/**
 * Returns element that has provided data-el-id
 * @param {string} attributeValue data-el-id attribute value to be found
 */
const getElementByDataAttribute = (attributeValue) => {
    const elementSelector = `[${ELEMENT_DATA_ATTRIBUTE}="${attributeValue}"]`;

    return document.querySelector(elementSelector);
};

/**
 * @param {object} node Object with element properties that follow hast.
 * @param {string} node.type 'element'
 * @param {string} node.tagName - HTML element tag i.e. 'script', 'link', 'meta'
 * @param {object} node.properties - element attributes in key-value pairs. Must include unique [ELEMENT_DATA_ATTRIBUTE]
 * @description Injects element to head
 */
export const addElementToHead = (node) => {
    const newElement = createDomElement(node);
    const currentElement = getElementByDataAttribute(newElement.getAttribute(ELEMENT_DATA_ATTRIBUTE));

    if (newElement.outerHTML === currentElement ? .outerHTML) {
        return currentElement;
    }

    currentElement ? .remove();
    document.head.append(newElement);

    return newElement;
};

/**
 * @param {object} node Object with element properties that follow hast.
 * @param {string} node.type 'element'
 * @param {string} node.tagName - HTML element tag i.e. 'script', 'link', 'meta'
 * @param {object} node.properties - element attributes in key-value pairs. Must include unique [ELEMENT_DATA_ATTRIBUTE]
 * @description Injects element to body
 */
export const addElementToBody = (node) => {
    const newElement = createDomElement(node);
    const currentElement = getElementByDataAttribute(newElement.getAttribute(ELEMENT_DATA_ATTRIBUTE));

    if (newElement.outerHTML === currentElement ? .outerHTML) {
        return currentElement;
    }

    currentElement ? .remove();
    document.body.append(newElement);

    return newElement;
};