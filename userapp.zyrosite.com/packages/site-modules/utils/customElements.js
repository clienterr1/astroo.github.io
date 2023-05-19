import {
    toDom
} from 'hast-util-to-dom';
import {
    rehype
} from 'rehype';
import rehypeMinifyWhitespace from 'rehype-minify-whitespace';
import rehypeRemoveComments from 'rehype-remove-comments';
import rehypeSanitize from 'rehype-sanitize';
import {
    filter
} from 'unist-util-filter';
import {
    parents
} from 'unist-util-parents';
import {
    visit
} from 'unist-util-visit';

import {
    SCRIPT_TAG,
    NOSCRIPT_TAG,
    IFRAME_TAG,
    STYLE_TAG,
    DIV_TAG,
    SANITIZE_SCHEMA,
} from '@zyro-inc/site-modules/constants/sanitizeConfig';

import {
    REHYPE_SETTINGS
} from '@zyro-inc/site-modules/constants/rehypeSettings';

const EMPTY_ROOT_NODE = {
    children: [],
    type: 'root',
};

const DATA_REHYPE_ATTRIBUTE = 'data-rehype';

// check wether particular elements (nodes) should be rendered in <body>
const shouldRenderInBody = (node) => {
    const {
        type,
        parent,
        children,
    } = node;
    // either take current node tag name or if it is text, take it's parent tag name
    const tagName = node.tagName ? ? (type === 'text' && parent ? .tagName);
    const isBodyElement = [
        SCRIPT_TAG,
        NOSCRIPT_TAG,
        IFRAME_TAG,
    ].includes(tagName);
    const isEmptyDiv = node.tagName === DIV_TAG && children.length === 0;
    const isHeadScript = !!node.properties ? .dataRenderHead;

    // always render <script>, <noscript> and <iframe> inside body
    return ((isBodyElement || isEmptyDiv) && !isHeadScript);
};

// replace all // with https:// in src=""
export const rehypeForceDoubleSlashHttps = () => (tree) => {
    visit(tree, 'element', (node) => {
        if (node.properties ? .src ? .startsWith('//')) {
            // eslint-disable-next-line no-param-reassign
            node.properties.src = `https:${node.properties.src}`;
        }
    });
};

// add specific data-hehype attributes (for removing them from DOM before re-adding)
export const rehypeAddDataRehype = () => (tree) => {
    visit(tree, 'element', (node) => {
        // eslint-disable-next-line no-param-reassign
        node.properties[DATA_REHYPE_ATTRIBUTE] = true;
    });
};

// remove all text nodes which are not inside <script>, <style> or <noscript>
export const rehypeRemoveTextNodes = () => (tree) => filter(parents(tree), {
    cascade: false,
}, (node) => {
    const keepTextContent = [
        SCRIPT_TAG,
        STYLE_TAG,
        NOSCRIPT_TAG,
    ].includes(node.parent ? .tagName);

    return keepTextContent || node.type !== 'text';
});

// filter out nodes which should be rendered in <head> (exclude root nodes)
export const rehypeHeadElements = () => (tree) => {
    const filteredTree = filter(parents(tree), (node) => node.type === 'root' || !shouldRenderInBody(node));

    return filteredTree ? ? EMPTY_ROOT_NODE;
};

export const rehypeBodyElements = () => (tree) => {
    const filteredTree = filter(parents(tree), (node) => node.type === 'root' || shouldRenderInBody(node));

    return filteredTree ? ? EMPTY_ROOT_NODE;
};

export const processHtml = (html) => rehype()
    .data('settings', REHYPE_SETTINGS)
    .use(rehypeSanitize, SANITIZE_SCHEMA)
    .use(rehypeRemoveTextNodes)
    .use(rehypeForceDoubleSlashHttps)
    .use(rehypeAddDataRehype)
    .use(rehypeMinifyWhitespace)
    .use(rehypeRemoveComments)
    .processSync(html)
    .toString();

export const getHeadElements = (html) => rehype()
    .data('settings', REHYPE_SETTINGS)
    .use(rehypeHeadElements)
    .processSync(html)
    .toString();

export const getBodyElements = (html) => rehype()
    .data('settings', REHYPE_SETTINGS)
    .use(rehypeBodyElements)
    .processSync(html)
    .toString();

export const appendHtmlString = ({
    htmlString,
    targetNode,
}) => {
    // parse HTML string to HAST trees
    const tree = rehype().data('settings', REHYPE_SETTINGS).parse(htmlString);
    // parse HAST tree to DOM (#document-fragment)
    const fragment = toDom(tree, REHYPE_SETTINGS);

    // convert AST trees to DOM elements and append to <head> and <body>
    targetNode.append(fragment);
};

export const addCustomElements = (customMeta) => {
    // remove existing elements from DOM, if any
    document.querySelectorAll(`[${DATA_REHYPE_ATTRIBUTE}]`).forEach((el) => el.remove());

    // process HTML from custom meta
    const htmlString = processHtml(customMeta);

    // get HTML strings for head and body elements
    const customHeadElements = getHeadElements(htmlString);
    const customBodyElements = getBodyElements(htmlString);

    if (customHeadElements) {
        appendHtmlString({
            htmlString: customHeadElements,
            targetNode: document.head,
        });
    }

    if (customBodyElements) {
        appendHtmlString({
            htmlString: customBodyElements,
            targetNode: document.body,
        });
    }
};