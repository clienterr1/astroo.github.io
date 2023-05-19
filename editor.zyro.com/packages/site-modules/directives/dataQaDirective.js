// Regexp for spaces and &nbsp
const regexpToReplace = /\s|&nbsp;/g;

export const formatAttribute = (string) => {
    try {
        return string.replaceAll(regexpToReplace, '').toLowerCase();
    } catch {
        return string;
    }
};

const setDataQA = (element, binding) => {
    // eslint-disable-next-line no-param-reassign
    element.dataset.qa = formatAttribute(binding.value);
};

export const QA_DIRECTIVE_NAME = 'qa';

export const dataQADirective = {
    beforeMount: (element, binding) => setDataQA(element, binding),
    updated: (element, binding) => setDataQA(element, binding),
};