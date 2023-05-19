import {
    DESKTOP_BLOCK_WIDTH,
    MOBILE_BUILDER_WIDTH,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';

const blogPageElements = {
    getContentTextBox: (content) => ({
        type: 'GridTextBox',
        content: `<p class="body" style="color: rgb(26, 26, 26)">${content}</p>`,
        settings: {
            styles: {
                'm-element-margin': '0 0 16px 0',
                text: 'left',
                align: 'flex-start',
                justify: 'flex-start',
                position: '2/3/4/15',
            },
        },
        animation: {
            name: 'slide',
            type: 'global',
        },
    }),
    getLayoutContentTextBox: (content) => ({
        type: 'GridTextBox',
        content: `<p class="body" style="color: rgb(26, 26, 26)">${content}</p>`,
        desktop: {
            height: 30,
            top: 442,
            left: 0,
            width: DESKTOP_BLOCK_WIDTH,
        },
        mobile: {
            height: 30,
            top: 424,
            left: 0,
            width: MOBILE_BUILDER_WIDTH,
        },
        settings: {
            styles: {
                'm-element-margin': '0 0 16px 0',
            },
        },
    }),
    getImage: (blogThumbnail) => ({
        rel: 'nofollow',
        type: 'GridImage',
        mobile: {
            top: 40,
            left: 0,
            width: 382,
            height: 320,
        },
        desktop: {
            top: 40,
            left: 206,
            width: 812,
            height: 344,
        },
        settings: {
            alt: blogThumbnail.alt,
            path: blogThumbnail.path,
            origin: blogThumbnail.origin,
            styles: {
                align: 'center',
                justify: 'center',
                'm-element-margin': '0 0 16px 0',
            },
            clickAction: 'none',
        },
        animation: {
            name: 'slide',
            type: 'global',
        },
        fullResolutionWidth: 3024,
        fullResolutionHeight: 4032,
    }),
};

export {
    blogPageElements,
};