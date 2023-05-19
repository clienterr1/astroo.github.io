const LINKABLE_ELEMENTS = [
    'GridButton',
    'GridImage',
];

const constructInternalUrl = (href) => {
    const splitHref = href.split('#');

    return {
        origin: '',
        pathname: splitHref[0],
        hash: splitHref.length > 1 ? `#${splitHref[1]}` : '',
    };
};

/**
 * @returns updated elements
 * @description Updates element hrefs to include new locale in URL pathname
 */
export const updateElementHrefs = ({
    elements,
    locale,
    siteUrl,
}) => {
    const updatedElements = Object.fromEntries(Object.entries(elements)
        .map(([elementKey, elementData]) => {
            if (LINKABLE_ELEMENTS.includes(elementData.type) && elementData.href) {
                const {
                    origin,
                    pathname,
                    hash,
                } = elementData.href.startsWith('/') ? constructInternalUrl(elementData.href) : new URL(elementData.href);
                const isInternalLink = origin === '' || siteUrl.includes(origin);
                const hasPathname = pathname.length > 1;

                if (!isInternalLink) {
                    return [
                        elementKey,
                        elementData,
                    ];
                }

                const href = hasPathname ?
                    `${origin}/${locale}${pathname}${hash}` :
                    `${origin}/${locale}${hash}`;

                return [
                    elementKey,
                    {
                        ...elementData,
                        href,
                    },
                ];
            }

            return [
                elementKey,
                elementData,
            ];
        }));

    return updatedElements;
};