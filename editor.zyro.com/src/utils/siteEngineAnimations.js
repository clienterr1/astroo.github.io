import {
    ANIMATION_APPLICABLE_BLOCK_TYPES,
    ANIMATION_NOT_SUPPORTED_ELEMENTS,
    ANIMATION_TYPE_GLOBAL,
} from '@zyro-inc/site-modules/constants';

export const getAnimatableBlocks = ({
    blocks
}) => Object.fromEntries(Object.entries(blocks)
    .filter(([, value]) => ANIMATION_APPLICABLE_BLOCK_TYPES.includes(value.type)));

export const getAnimatableElements = ({
    elements
}) => Object.fromEntries(Object.entries(elements)
    .filter(([, value]) => !ANIMATION_NOT_SUPPORTED_ELEMENTS.includes(value.type)));

export const getBlocksAndElementsWithGlobalAnimations = ({
    blocks,
    elements,
}) => {
    const animatableBlocks = getAnimatableBlocks({
        blocks,
    });
    const animatableElements = getAnimatableElements({
        elements,
    });

    return [
        ...Object.values(animatableBlocks),
        ...Object.values(animatableElements),
    ].find((item) => item.animation ? .type === ANIMATION_TYPE_GLOBAL);
};

export const mapAnimatableElementsWithAnimation = ({
    elements,
    itemWithAnimation,
}) => Object.fromEntries(Object.entries(elements).map(([key, value]) => {
    if (ANIMATION_NOT_SUPPORTED_ELEMENTS.includes(value.type)) {
        return [
            key,
            value,
        ];
    }

    return [
        key,
        {
            ...value,
            animation: {
                name: itemWithAnimation.animation.name,
                type: ANIMATION_TYPE_GLOBAL,
            },
        },
    ];
}));

export const mapAnimatableBlocksWithAnimation = ({
    blocks,
    itemWithAnimation,
}) => Object.fromEntries(
    Object.entries(blocks).map(([key, value]) => {
        if (!ANIMATION_APPLICABLE_BLOCK_TYPES.includes(value.type)) {
            return [
                key,
                value,
            ];
        }

        return [
            key,
            {
                ...value,
                animation: {
                    name: itemWithAnimation.animation.name,
                    type: ANIMATION_TYPE_GLOBAL,
                },
            },
        ];
    }),
);