import {
    DEFAULT_BLOCK_BLOG_COLUMN_GAP,
    DEFAULT_BLOCK_BLOG_M_COLUMN_GAP,
    DEFAULT_ECWID_CONTENT_WIDTH,
    DEFAULT_ECOMMERCE_PRODUCT_CONTENT_WIDTH,
    DEFAULT_BLOG_CONTENT_WIDTH,
} from '@zyro-inc/site-modules/constants/defaultStyles';

import {
    BLOG_POST_EXAMPLE_PAGE_COUNT
} from '@/constants';

import {
    blogPageElements
} from '@/components/builder-controls/add-element/elements';
import {
    generateRandomId
} from '@/utils/generateRandomId';

export const DEFAULT_GRID_STYLES = {
    'row-gap': '16px',
    'row-size': '48px',
    'column-gap': '24px',
    'block-padding': '16px 0',
    'm-block-padding': '56px 16px',
};

export const getBlogListBlock = ({
    mockCategories
}) => ({
    type: 'BlockBlogList',
    settings: {
        postsPerPage: BLOG_POST_EXAMPLE_PAGE_COUNT,
        categories: [],
        showAllPosts: true,
        showWithoutCategories: false,
        fullWidth: false,
        mockCategories,
        shownItems: {
            coverImage: true,
            title: true,
            description: true,
            date: true,
            categories: true,
            authorFullName: true,
            avatar: true,
            minutesToRead: true,
        },
        styles: {
            'post-column-count': '2',
            'grid-gap-size': `${DEFAULT_BLOCK_BLOG_COLUMN_GAP}px`,
            'm-grid-gap-size': `${DEFAULT_BLOCK_BLOG_M_COLUMN_GAP}px`,
            'block-padding': '60px',
            'content-width': `${DEFAULT_BLOG_CONTENT_WIDTH}px`,
            'cover-object-fit': 'contain',
            // Styles below are not used for the list appearance - they are for AddBlockModal support
            rows: 10,
            cols: 10,
            'row-size': DEFAULT_GRID_STYLES['row-size'],
            'row-gap': DEFAULT_GRID_STYLES['row-gap'],
        },
    },
    components: [],
    zindexes: [],
    background: {
        current: 'color',
        color: 'rgb(255, 255, 255)',
    },
});

export const getEcwidBlock = () => ({
    type: 'BlockEcwidStore',
    settings: {
        styles: {
            'content-width': `${DEFAULT_ECWID_CONTENT_WIDTH}px`,
            'block-padding': '16px 46px',
            'm-block-padding': DEFAULT_GRID_STYLES['m-block-padding'],
        },
    },
    background: {
        current: 'color',
        color: 'var(--color-light)',
    },
    components: [],
    zindexes: [],
});

export const getGridBlock = () => ({
    type: 'BlockGrid',
    settings: {
        styles: {
            rows: 5,
            ...DEFAULT_GRID_STYLES,
        },
    },
    components: [],
    background: {},
    zindexes: [],
});

export const getLayoutBlock = () => ({
    type: 'BlockLayout',
    desktop: {
        minHeight: 500,
    },
    mobile: {
        minHeight: 140,
    },
    settings: {
        styles: {
            'block-padding': '16px 0 16px 0',
            'm-block-padding': '16px',
        },
    },
    components: [],
    background: {
        color: 'rgb(255, 255, 255)',
        current: 'color',
    },
    zindexes: [],
});

export const getBlogHeaderBlock = () => ({
    type: 'BlockBlogHeader',
    hidden: false,
    background: {
        current: 'color',
        color: 'rgb(255, 255, 255)',
    },
    settings: {
        shownItems: {
            date: true,
            categories: true,
            authorFullName: true,
            avatar: true,
            minutesToRead: true,
            description: true,
        },
        styles: {
            'block-padding': '45px 30px 45px 30px',
            'm-block-padding': '16px 16px 16px 16px',
            'content-width': '954px',
            align: 'flex-start',
            'text-align': 'center',
        },
    },
    animation: {
        name: 'slide',
        type: 'global',
    },
    components: [],
});

export const getBlogPostGridBlock = (postContent) => {
    const textBoxElementId = generateRandomId();

    return {
        blockData: {
            type: 'BlockGrid',
            settings: {
                styles: {
                    rows: '9',
                    ...DEFAULT_GRID_STYLES,
                },
            },
            components: [textBoxElementId],
            background: {},
            zindexes: [textBoxElementId],
        },
        elements: {
            [textBoxElementId]: blogPageElements.getContentTextBox(postContent),
        },
    };
};

export const getBlogPostLayoutBlock = (postContent, blogThumbnail) => {
    const textBoxElementId = generateRandomId();
    const imageElementId = generateRandomId();

    return {
        blockData: {
            type: 'BlockLayout',
            desktop: {
                minHeight: 500,
            },
            mobile: {
                minHeight: 140,
            },
            components: [
                imageElementId,
                textBoxElementId,
            ],
            zindexes: [
                imageElementId,
                textBoxElementId,
            ],
            background: {
                current: 'color',
                color: 'rgb(255, 255, 255)',
            },
            settings: {
                styles: {
                    'm-block-padding': DEFAULT_GRID_STYLES['m-block-padding'],
                },
            },
        },
        elements: {
            [imageElementId]: blogPageElements.getImage(blogThumbnail),
            [textBoxElementId]: blogPageElements.getLayoutContentTextBox(postContent),
        },
    };
};

export const getEcommerceProductBlock = ({
    productId = -1,
    buttonText,
} = {}) => ({
    type: 'BlockEcommerceProduct',
    settings: {
        styles: {
            'content-width': `${DEFAULT_ECOMMERCE_PRODUCT_CONTENT_WIDTH}px`,
            'block-padding': '100px 16px',
            'm-block-padding': DEFAULT_GRID_STYLES['m-block-padding'],
        },
    },
    background: {
        current: 'color',
        color: 'rgb(255, 255, 255)',
    },
    navigationArrowsColor: 'rgb(0, 0, 0)',
    navigationThumbnailArrowsColor: 'rgb(0, 0, 0)',
    galleryPlacement: 'bottom',
    imageRatio: 'cover',
    imageBorderRadius: '0%',
    product: {
        id: productId,
    },
    zindexes: [],
    isQuantityPickerEnabled: true,
    buttonStyle: {
        'grid-button-primary-color': 'rgb(255, 255, 255)',
        'grid-button-primary-color-hover': 'rgb(255, 255, 255)',
        'grid-button-primary-background-color': 'rgb(73, 88, 103)',
        'grid-button-primary-background-color-active': 'rgb(73, 88, 103)',
        'grid-button-primary-background-color-hover': 'rgb(48, 63, 78)',
        'grid-button-primary-border-color': 'rgb(73, 88, 103)',
        'grid-button-primary-border-color-active': 'rgb(73, 88, 103)',
        'grid-button-primary-border-color-hover': 'rgb(48, 63, 78)',
        'grid-button-secondary-color': 'rgb(46, 47, 49)',
        'grid-button-secondary-color-hover': 'rgb(29, 30, 32)',
        'grid-button-secondary-background-color': 'rgb(255, 255, 255)',
        'grid-button-secondary-background-color-active': 'rgb(255, 255, 255)',
        'grid-button-secondary-background-color-hover': 'rgb(241, 241, 241)',
        'grid-button-secondary-border-color': 'rgb(255, 255, 255)',
        'grid-button-secondary-border-color-active': 'rgb(255, 255, 255)',
        'grid-button-secondary-border-color-hover': 'rgb(241, 241, 241)',
    },
    textColorVars: {
        'h1-color': 'rgb(26, 26, 26)',
        'h2-color': 'rgb(26, 26, 26)',
        'h3-color': 'rgb(26, 26, 26)',
        'h4-color': 'rgb(26, 26, 26)',
        'h5-color': 'rgb(26, 26, 26)',
        'h6-color': 'rgb(26, 26, 26)',
        'body-large-color': 'rgb(26, 26, 26)',
        'body-color': 'rgb(26, 26, 26)',
    },
    ...(buttonText ? {
        buttonText,
    } : {}),
});

export const getEcommerceProductListBlock = (products = []) => ({
    type: 'BlockEcommerceProductList',
    settings: {
        styles: {
            'content-width': `${DEFAULT_ECOMMERCE_PRODUCT_CONTENT_WIDTH}px`,
            'block-padding': '100px 16px',
            'm-block-padding': DEFAULT_GRID_STYLES['m-block-padding'],
        },
    },
    background: {
        current: 'color',
        color: 'rgb(255, 255, 255)',
    },
    productIds: products.map((product) => product.id),
    zindexes: [],
    textColorVars: {
        'h1-color': 'rgb(26, 26, 26)',
        'h2-color': 'rgb(26, 26, 26)',
        'h3-color': 'rgb(26, 26, 26)',
        'h4-color': 'rgb(26, 26, 26)',
        'h5-color': 'rgb(26, 26, 26)',
        'h6-color': 'rgb(26, 26, 26)',
        'body-large-color': 'rgb(26, 26, 26)',
        'body-color': 'rgb(26, 26, 26)',
    },
    buttonStyle: {
        'grid-button-primary-color': 'rgb(255, 255, 255)',
        'grid-button-primary-color-hover': 'rgb(255, 255, 255)',
        'grid-button-primary-background-color': 'rgb(73, 88, 103)',
        'grid-button-primary-background-color-active': 'rgb(73, 88, 103)',
        'grid-button-primary-background-color-hover': 'rgb(48, 63, 78)',
        'grid-button-primary-border-color': 'rgb(73, 88, 103)',
        'grid-button-primary-border-color-active': 'rgb(73, 88, 103)',
        'grid-button-primary-border-color-hover': 'rgb(48, 63, 78)',
        'grid-button-secondary-color': 'rgb(46, 47, 49)',
        'grid-button-secondary-color-hover': 'rgb(29, 30, 32)',
        'grid-button-secondary-background-color': 'rgb(255, 255, 255)',
        'grid-button-secondary-background-color-active': 'rgb(255, 255, 255)',
        'grid-button-secondary-background-color-hover': 'rgb(241, 241, 241)',
        'grid-button-secondary-border-color': 'rgb(255, 255, 255)',
        'grid-button-secondary-border-color-active': 'rgb(255, 255, 255)',
        'grid-button-secondary-border-color-hover': 'rgb(241, 241, 241)',
    },
    ribbonStyle: {
        'ribbon-color': 'rgb(255, 255, 255)',
        'ribbon-background-color': 'rgb(29, 30, 32)',
    },
    productsPerPage: 6,
});

export const getPageTitleBlock = ({
    title
}) => {
    const gridTextBoxElementId = generateRandomId();

    return {
        blockData: {
            type: 'BlockLayout',
            mobile: {
                minHeight: 170,
            },
            desktop: {
                minHeight: 234,
            },
            settings: {
                styles: {
                    'block-padding': '16px 0 16px 0',
                    'm-block-padding': '16px',
                },
            },
            zindexes: [gridTextBoxElementId],
            background: {
                color: 'rgb(255, 255, 255)',
                current: 'color',
            },
            components: [gridTextBoxElementId],
        },
        elements: {
            [gridTextBoxElementId]: {
                type: 'GridTextBox',
                mobile: {
                    top: 64,
                    left: 0,
                    width: 382,
                    height: 46,
                },
                content: `<h1>${title}</h1>`,
                desktop: {
                    top: 80,
                    left: 309,
                    width: 606,
                    height: 72,
                },
                settings: {
                    styles: {
                        text: 'center',
                        align: 'flex-start',
                        justify: 'flex-start',
                        'm-element-margin': '0 0 16px 0',
                    },
                },
                animation: {
                    name: 'slide',
                    type: 'global',
                },
            },
        },
    };
};

export const getPortfolioBlock = () => {
    const gridGalleryElementId = generateRandomId();

    return {
        blockData: {
            type: 'BlockLayout',
            mobile: {
                minHeight: 1455,
            },
            desktop: {
                minHeight: 1925,
            },
            settings: {
                styles: {
                    'block-padding': '16px 0 16px 0',
                    'm-block-padding': '16px',
                },
            },
            zindexes: [gridGalleryElementId],
            background: {
                color: 'rgb(255, 255, 255)',
                current: 'color',
            },
            components: [gridGalleryElementId],
        },
        elements: {
            [gridGalleryElementId]: {
                type: 'GridGallery',
                images: [{
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-aeae-ss-ae---2848289-m5kpo846zzf0bgek-AE0E3LX1KZuDK17O.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-edward-jenner-4252525-m5kpo84naqf4kbo6-A85D7Pk72PuR98aN.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-graphicgumcom-1289672-ylen74xpl8u9a0rn-m2W1OV5L2kHblob7.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-ilya-galica-5271593-ar0ep1qeb1s9kwnj-Yg27E3gErJhgP4yO.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-carlos-montelara-5152692-y4llnpbqpnclvzxo-Yan7eP3egJtD3jeo.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-lisa-fotios-4644397-d95mnzob1zhx54ov-mP4Z6Je6j2c3Xxaw.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-anna-shvets-4557398-avlpox4q0ku594kg-dWxn64G6erF5laj3.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-damian-apanasowicz-4185556-y4llnpbn95sznnjk-AzGOab1Q6WsOjBPD.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-thiago-giardini-5815066-ar0ep1qv43t1kger-YrD3O7zOlBUjOwNa.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-charlotte-may-5825574-aopda47pbotbyq5l-mjEzjB0j9JUO1K48.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-mitchell-luo-3685207-a3qbylnzq0trx2gq-YbNb68MWQof74BQ7.jpg',
                        origin: 'other',
                    },
                    {
                        alt: '',
                        path: 'https://assets.zyrosite.space/AR0eprE7RRhpVzDz/pexels-bruno-cervera-6033461-yg27e4gdebtgb9o7-mePyWM0W3lSkywGL.jpg',
                        origin: 'other',
                    },
                ],
                mobile: {
                    top: 16,
                    left: 0,
                    width: 382,
                    height: 1417,
                    columnGap: 12,
                    columnCount: 2,
                },
                desktop: {
                    top: 64,
                    left: 103,
                    width: 1018,
                    height: 1746,
                    columnGap: '16',
                    columnCount: '3',
                },
                settings: {
                    layout: 'masonry',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                    },
                    imageClickAction: 'lightbox',
                },
                animation: {
                    name: 'slide',
                    type: 'global',
                },
            },
        },
    };
};