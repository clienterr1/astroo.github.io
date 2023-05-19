import {
    rehype
} from 'rehype';
import {
    REHYPE_SETTINGS
} from '@zyro-inc/site-modules/constants/rehypeSettings';
import {
    visit
} from 'unist-util-visit';

export const parseTagsCountFromHTML = ({
    html,
    tagName,
}) => {
    const {
        data
    } = rehype()
        .data('settings', REHYPE_SETTINGS)
        .use(() => (tree, file) => {
            // eslint-disable-next-line no-param-reassign
            file.data.tagsCount = 0;

            visit(tree, 'element', (node) => {
                if (node.tagName === tagName) {
                    // eslint-disable-next-line no-param-reassign
                    file.data.tagsCount += 1;
                }
            });
        })
        .processSync(html);

    return data.tagsCount;
};

export const checkIfHtmlHasGivenTags = ({
    html,
    tagsToMatch,
}) => {
    const {
        data
    } = rehype()
        .data('settings', REHYPE_SETTINGS)
        .use(() => (tree, file) => {
            // eslint-disable-next-line no-param-reassign
            file.data.isMatching = false;

            visit(tree, 'element', (node) => {
                if (tagsToMatch.includes(node.tagName)) {
                    // eslint-disable-next-line no-param-reassign
                    file.data.isMatching = true;
                }
            });
        })
        .processSync(html);

    return data.isMatching;
};

export const parseTextFromHtml = ({
    html
}) => {
    const {
        data
    } = rehype()
        .data('settings', REHYPE_SETTINGS)
        .use(() => (tree, file) => {
            // eslint-disable-next-line no-param-reassign
            file.data.text = '';

            visit(tree, 'text', (node) => {
                // eslint-disable-next-line no-param-reassign
                file.data.text += node.value;
            });
        })
        .processSync(html);

    return data.text;
};