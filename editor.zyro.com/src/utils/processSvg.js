import {
    rehype
} from 'rehype';
import {
    visit
} from 'unist-util-visit';
import {
    REHYPE_SETTINGS
} from '@zyro-inc/site-modules/constants/rehypeSettings';

const rehypeAddPreserveAspectRatio = () => (tree) => {
    visit(tree, 'element', (node) => {
        // eslint-disable-next-line no-param-reassign
        node.properties.preserveAspectRatio = 'none';
    });
};

const rehypeRemoveFill = () => (tree) => {
    visit(tree, 'element', (node) => {
        // eslint-disable-next-line no-param-reassign
        delete node.properties.fill;
    });
};

export const processSvg = (svg) => rehype()
    .data('settings', REHYPE_SETTINGS)
    .use(rehypeAddPreserveAspectRatio)
    .use(rehypeRemoveFill)
    .processSync(svg)
    .toString();