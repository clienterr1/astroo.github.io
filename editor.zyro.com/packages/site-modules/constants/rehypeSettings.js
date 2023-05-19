// 'fragment: true' is the important part here, that's why settings are reused everywhere.
// It tells rehype to not wrap the output in a <document><html>...</html> (which is default behaviour).
export const REHYPE_SETTINGS = {
    fragment: true,
    collapseEmptyAttributes: true,
};