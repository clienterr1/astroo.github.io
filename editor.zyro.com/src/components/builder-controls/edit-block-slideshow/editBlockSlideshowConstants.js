export const MAX_SLIDE_COUNT = 20;
export const MIN_SLIDE_COUNT = 1;

export const DEFAULT_SLIDE = {
    slide: {
        type: 'BlockGrid',
        settings: {
            styles: {
                rows: 12,
                width: '1224px',
                'm-rows': '1',
                'row-gap': '16px',
                'row-size': '48px',
                'column-gap': '24px',
                'block-padding': '16px 0',
                'm-block-padding': '60px 16px 60px 16px',
            },
        },
        zindexes: [],
        background: {
            image: 'https://assets.zyrosite.com/gallery-assets/Frame-AoPlb3zeMWiKLJqW.png',
            current: 'image',
        },
        components: [],
    },
    components: [],
};

export const EDIT_OPTION_ID = 'edit';
export const CHANGE_BACKGROUND_OPTION_ID = 'change-background';
export const DUPLICATE_OPTION_ID = 'duplicate';
export const DELETE_OPTION_ID = 'delete';