import {
    ref,
    computed,
} from 'vue';

import {
    INSTAGRAM_MEDIA_PLACEHOLDERS
} from '@zyro-inc/site-modules/constants/instagramPlaceholders';

const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media';
const INSTAGRAM_API_FIELDS = [
    'id',
    'permalink',
    'caption',
    'media_url',
    'thumbnail_url',
];

export const useGridInstagramFeed = ({
    props,
    siteId,
    getInstagramTokenHandler,
    cleanupCallback,
}) => {
    const limit = computed(() => props.data.settings['item-count']);
    const token = ref(null);
    const responseResult = ref([]);

    const media = computed(() => {
        if (responseResult.value.length > 0) {
            return responseResult.value
                .filter(({
                    src
                }) => typeof src !== 'undefined')
                .slice(0, limit.value);
        }

        return new Array(limit.value).fill({});
    });

    const getInstagramMedia = async () => {
        const instagramUrl = new URL(INSTAGRAM_API_URL);

        instagramUrl.searchParams.set('fields', INSTAGRAM_API_FIELDS.join(','));
        instagramUrl.searchParams.set('access_token', token.value);

        const res = await fetch(instagramUrl.toString());
        const {
            data
        } = await res.json();

        responseResult.value = data.map((item) => ({
            id: item.id,
            src: item.media_url,
            alt: item.caption,
            href: item.permalink,
            poster: item.thumbnail_url,
        }));
    };

    const init = async () => {
        try {
            token.value = await getInstagramTokenHandler({
                siteId,
                elementId: props.id,
            });
        } catch (error) {
            responseResult.value = INSTAGRAM_MEDIA_PLACEHOLDERS;

            return;
        }

        try {
            await getInstagramMedia();
        } catch (error) {
            responseResult.value = INSTAGRAM_MEDIA_PLACEHOLDERS;

            if (cleanupCallback) {
                cleanupCallback(token.value);
            }

            throw error;
        }
    };

    return {
        media,
        init,
        itemGap: computed(() => props.data.settings.styles['item-gap']),
    };
};

/**
 * TODO:
 * preconnect instagram to head
 * proper multi-step error handling
 * refactor overall logic - missign token should not fall back to unsplash by default
 */