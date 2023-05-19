import {
    useStore
} from 'vuex';
import {
    computed,
    nextTick,
    unref,
} from 'vue';
import {
    useI18n
} from 'vue-i18n';

import {
    DESKTOP_BLOCK_WIDTH,
    ELEMENT_TYPE_TEXT_BOX,
    ELEMENT_TYPE_FORM,
    ELEMENT_TYPE_GALLERY,
    ELEMENT_TYPE_INSTAGRAM_FEED,
    ELEMENT_TYPE_SOCIAL_ICONS,
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_ECOMMERCE_BUTTON,
    ELEMENT_TYPE_IMAGE,
    ELEMENT_TYPE_SHAPE,
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

import {
    MOBILE_BUILDER_WIDTH,
    MOBILE_ELEMENT_TOP_OFFSET,
    DESKTOP_ELEMENT_TOP_OFFSET,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';

import {
    DEFAULT_SHAPE,
    DEFAULT_SHAPE_SVG,
    DEFAULT_SHAPE_WIDTH,
    DEFAULT_SHAPE_HEIGHT,
    DEFAULT_SHAPE_COLOR,
} from '@zyro-inc/site-modules/constants/shapes';
import {
    DEFAULT_SOCIAL_LINKS
} from '@zyro-inc/site-modules/constants/defaultSocialLinks';
import {
    GRID_GALLERY_PLACEHOLDERS_BASE_PATH
} from '@zyro-inc/cdn-builder-placeholders/constants';

import {
    updateElementPositionFromDOM,
    fitToLayoutXBounds,
} from '@/components/block-layout/useLayout';

import {
    useDeviceElementHeight
} from '@/use/useDeviceElementHeight';
import {
    getLowestElementBottom
} from '@zyro-inc/site-modules/utils/getLowestElementBottom';

export const LAYOUT_ELEMENT_DEFAULT_MOBILE_HEIGHT = 200;

const ELEMENTS_RESIZED_BY_CONTENT = [
    ELEMENT_TYPE_TEXT_BOX,
    ELEMENT_TYPE_FORM,
    ELEMENT_TYPE_GALLERY,
    ELEMENT_TYPE_INSTAGRAM_FEED,
    ELEMENT_TYPE_SOCIAL_ICONS,
];

const ELEMENTS_THAT_KEEP_ORIGINAL_SIZE_IN_MOBILE = [
    ELEMENT_TYPE_SHAPE,
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_ECOMMERCE_BUTTON,
    ELEMENT_TYPE_IMAGE,
];

export const getInitialElementMobilePosition = ({
    elementType,
    elementRawPosition,
    isDesktopMode,
    lowestElementBottom,
}) => {
    const {
        rawTop,
        rawLeft,
        rawHeight,
        rawWidth,
    } = elementRawPosition;
    const shouldKeepOriginalSizeInMobile = ELEMENTS_THAT_KEEP_ORIGINAL_SIZE_IN_MOBILE.includes(elementType);
    const width = shouldKeepOriginalSizeInMobile ? rawWidth : MOBILE_BUILDER_WIDTH;

    if (isDesktopMode) {
        const height = shouldKeepOriginalSizeInMobile ? rawHeight : LAYOUT_ELEMENT_DEFAULT_MOBILE_HEIGHT;
        const top = lowestElementBottom + MOBILE_ELEMENT_TOP_OFFSET;

        return fitToLayoutXBounds({
            width,
            left: rawLeft,
            height,
            top,
        }, MOBILE_BUILDER_WIDTH);
    }

    return fitToLayoutXBounds({
        width,
        left: rawLeft,
        height: rawHeight,
        top: rawTop,
    }, MOBILE_BUILDER_WIDTH);
};

export const getInitialElementDesktopPosition = ({
    elementRawPosition,
    isDesktopMode,
    lowestElementBottom,
}) => {
    const {
        rawTop,
        rawLeft,
        rawHeight,
        rawWidth,
    } = elementRawPosition;

    if (isDesktopMode) {
        return fitToLayoutXBounds({
            width: rawWidth,
            left: rawLeft,
            height: rawHeight,
            top: rawTop,
        }, DESKTOP_BLOCK_WIDTH);
    }

    return fitToLayoutXBounds({
        width: rawWidth,
        left: rawLeft,
        height: rawHeight,
        top: lowestElementBottom + DESKTOP_ELEMENT_TOP_OFFSET,
    }, DESKTOP_BLOCK_WIDTH);
};

export const useAddElement = () => {
    const {
        t
    } = useI18n();
    const {
        getters,
        dispatch,
    } = useStore();
    const {
        updateElementHeightOnDevices
    } = useDeviceElementHeight();

    const isMobileMode = computed(() => getters['gui/isMobileMode']);
    const isDesktopMode = computed(() => !isMobileMode.value);
    const elementPositionKeyReversed = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_DESKTOP : ELEMENT_POSITION_KEY_MOBILE));

    const defaultElements = computed(() => ({
        text: {
            name: t('common.text'),
            icon: 'text',
            width: 4,
            widthPixels: 400,
            heightPixels: 200,
            height: 3,
            content: {
                type: 'GridTextBox',
                content: `<h3 style="color: rgb(26, 26, 26)">${t('builder.elements.defaultTextElementText')}</h3>`,
                settings: {
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        text: 'left',
                        align: 'flex-start',
                        justify: 'flex-start',
                    },
                },
            },
        },
        button: {
            name: t('common.button'),
            icon: 'button',
            width: 3,
            widthPixels: 130,
            heightPixels: 50,
            height: 2,
            content: {
                backgroundColor: 'rgb(73, 88, 103)',
                backgroundColorHover: 'rgb(48, 63, 78)',
                fontColor: 'rgb(255, 255, 255)',
                fontColorHover: 'rgb(255, 255, 255)',
                borderColor: 'rgb(73, 88, 103)',
                borderColorHover: 'rgb(73, 88, 103)',
                type: 'GridButton',
                content: 'Button',
                href: '',
                linkType: 'external',
                rel: 'nofollow',
                settings: {
                    type: 'primary',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        align: 'center',
                        justify: 'center',
                    },
                },
            },
        },
        ecommerceButton: {
            name: t('builder.addToBag'),
            icon: 'add-to-bag',
            width: 4,
            widthPixels: 150,
            heightPixels: 50,
            height: 2,
            content: {
                backgroundColor: 'rgb(73, 88, 103)',
                backgroundColorHover: 'rgb(48, 63, 78)',
                fontColor: 'rgb(255, 255, 255)',
                fontColorHover: 'rgb(255, 255, 255)',
                borderColor: 'rgb(73, 88, 103)',
                borderColorHover: 'rgb(73, 88, 103)',
                type: 'GridEcommerceButton',
                content: 'Add to bag',
                settings: {
                    href: '#',
                    type: 'primary',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        align: 'center',
                        justify: 'center',
                    },
                },
            },
        },
        image: {
            name: t('common.image'),
            icon: 'image',
            width: 4,
            widthPixels: 480,
            heightPixels: 320,
            height: 6,
            content: {
                type: 'GridImage',
                rel: 'nofollow',
                settings: {
                    alt: 'Bright living room with modern inventory',
                    origin: 'other',
                    path: 'https://assets.zyrosite.com/bed-and-breakfast/images/amenities.jpg',
                    clickAction: 'none',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        align: 'center',
                        justify: 'center',
                    },
                },
            },
        },
        gallery: {
            name: t('common.gallery'),
            icon: 'gallery',
            width: 9,
            widthPixels: 640,
            heightPixels: 312,
            height: 2,
            content: {
                type: 'GridGallery',
                settings: {
                    layout: 'grid',
                    imageClickAction: 'lightbox',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                    },
                },
                desktop: {
                    columnGap: 16,
                    columnCount: 4,
                },
                mobile: {
                    columnGap: 12,
                    columnCount: 2,
                },
                images: [{
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/blue-oval-spheres.png`,
                        alt: 'Blue oval spheres',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/green-leaves-in-mist.png`,
                        alt: 'Green leaves in mist',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/microscope-bubbles.png`,
                        alt: 'Microscope bubbles',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/microscope-water-bubbles.png`,
                        alt: 'Microscope water bubbles',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/orange-to-blue-gradient.png`,
                        alt: 'Orange to blue gradient',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/white-ball-on-green-floor.png`,
                        alt: 'White ball on green floor',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/white-flower-in-pink-background.png`,
                        alt: 'White flower in pink background',
                    },
                    {
                        origin: 'other',
                        path: `${GRID_GALLERY_PLACEHOLDERS_BASE_PATH}/woman-with-flowers-in-hair.png`,
                        alt: 'Woman with flowers in hair',
                    },
                ],
            },
        },
        video: {
            name: t('common.video'),
            icon: 'video',
            width: 5,
            widthPixels: 480,
            heightPixels: 270,
            height: 5,
            content: {
                type: 'GridVideo',
                settings: {
                    src: 'https://www.youtube.com/embed/c8aFcHFu8QM',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        align: 'center',
                        justify: 'center',
                    },
                },
            },
        },
        shape: {
            name: t('common.shape'),
            icon: 'shape',
            widthPixels: DEFAULT_SHAPE_WIDTH,
            heightPixels: DEFAULT_SHAPE_HEIGHT,
            content: {
                type: 'GridShape',
                svg: DEFAULT_SHAPE_SVG,
                shape: DEFAULT_SHAPE,
                color: DEFAULT_SHAPE_COLOR,
            },
        },
        map: {
            name: t('common.map'),
            icon: 'map',
            width: 5,
            widthPixels: 480,
            heightPixels: 320,
            height: 5,
            content: {
                type: 'GridMap',
                settings: {
                    'm-element-margin': '0 0 16px 0',
                    src: 'https://maps.google.com/maps?q=697 Hilltop Street, Springfield, MA, USA&t=&z=13&ie=UTF8&iwloc=&output=embed',
                    styles: {
                        align: 'center',
                        justify: 'center',
                    },
                },
            },
        },
        instagramFeed: {
            name: t('common.instagramFeed'),
            icon: 'instagram',
            width: 10,
            widthPixels: 640,
            heightPixels: 312,
            height: 5,
            content: {
                type: 'GridInstagramFeed',
                settings: {
                    username: null,
                    'item-count': 8,
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        'items-per-row': 4,
                        'm-items-per-row': 3,
                        'item-gap': '16px',
                        'm-item-gap': '8px',
                        align: 'center',
                        justify: 'flex-start',
                    },
                },
            },
        },
        form: {
            name: t('common.contactForm'),
            icon: 'contact',
            width: 5,
            widthPixels: 400,
            heightPixels: 500,
            height: 5,
            content: {
                type: 'GridForm',
                formId: 'Contact form',
                settings: {
                    successMessage: 'Thank You!',
                    schema: [{
                            fieldType: 'short-answer',
                            id: 'firstName',
                            name: 'Name',
                            inputLabel: 'Name',
                            validation: [
                                ['optional']
                            ],
                            'validation-messages': {
                                required: 'This field is required',
                            },
                            placeholder: 'Your name',
                            type: 'GridInput',
                            svg: 'align-left-short',
                            validationType: 'text',
                        },
                        {
                            fieldType: 'short-answer',
                            id: 'lastName',
                            name: 'Last name',
                            inputLabel: 'Last name',
                            validation: [
                                ['optional']
                            ],
                            'validation-messages': {
                                required: 'This field is required',
                            },
                            placeholder: 'Your last name',
                            type: 'GridInput',
                            svg: 'align-left-short',
                            validationType: 'text',
                        },
                        {
                            fieldType: 'short-answer',
                            id: 'email',
                            name: 'Short answer email',
                            inputLabel: 'Your email',
                            validation: [
                                ['bail'],
                                ['email'],
                                ['required'],
                            ],
                            'validation-messages': {
                                required: 'This field is required',
                                email: 'Please enter a valid email address',
                            },
                            placeholder: 'Your email address',
                            type: 'GridInput',
                            svg: 'align-left-short',
                            validationType: 'email',
                        },
                        {
                            id: 'message',
                            tag: 'textarea',
                            inputLabel: 'Message',
                            name: 'Paragraph',
                            validation: [
                                ['required']
                            ],
                            'validation-messages': {
                                required: 'This field is required',
                            },
                            placeholder: 'Enter your message',
                            type: 'GridInput',
                            svg: 'align-left',
                        },
                    ],
                    theme: 'light',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        justify: 'center',
                        formSpacing: '22px 10px',
                    },
                },
                submitButtonBackgroundColor: 'rgb(73, 88, 103)',
                submitButtonBackgroundColorHover: 'rgb(48, 63, 78)',
                submitButtonFontColor: 'rgb(255, 255, 255)',
                submitButtonFontColorHover: 'rgb(255, 255, 255)',
                submitButtonBorderColor: 'rgb(73, 88, 103)',
                submitButtonBorderColorHover: 'rgb(73, 88, 103)',
                labelTextColor: 'rgb(26, 26, 26)',
                inputTextColor: 'rgb(26, 26, 26)',
                inputBorderColor: 'rgb(26, 26, 26)',
                inputFillColor: 'rgb(241, 241, 241)',
                inputFillColorHover: 'rgb(241, 241, 241)',
                submitButtonData: {
                    type: 'GridButton',
                    content: 'Submit',
                    settings: {
                        type: 'primary',
                        isFormButton: true,
                        styles: {
                            align: 'center',
                            justify: 'center',
                            position: '8/8/9/10',
                        },
                    },
                },
                innerBackground: {
                    current: '',
                    color: 'rgb(255, 255, 255)',
                    image: '',
                },
            },
        },
        subscribeForm: {
            name: t('common.subscribe'),
            icon: 'subscribe',
            width: 5,
            widthPixels: 300,
            heightPixels: 200,
            height: 5,
            content: {
                type: 'GridForm',
                formId: 'Subscribe form',
                settings: {
                    type: 'singleField',
                    successMessage: 'Thank you!',
                    schema: [{
                        svg: 'align-left-short',
                        fieldType: 'short-answer',
                        id: 'email',
                        name: 'email',
                        inputLabel: 'Email address',
                        validation: [
                            ['required'],
                            ['bail'],
                            ['email'],
                        ],
                        'validation-messages': {
                            required: 'Email is required',
                            email: 'Please enter a valid email address',
                        },
                        placeholder: 'Your email address',
                        type: 'GridInput',
                        validationType: 'email',
                    }, ],
                    theme: 'light',
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        align: 'space-between',
                        text: 'left',
                        justify: 'center',
                        formSpacing: '22px 10px',
                    },
                },
                submitButtonBackgroundColor: 'rgb(73, 88, 103)',
                submitButtonBackgroundColorHover: 'rgb(48, 63, 78)',
                submitButtonFontColor: 'rgb(255, 255, 255)',
                submitButtonFontColorHover: 'rgb(255, 255, 255)',
                submitButtonBorderColor: 'rgb(73, 88, 103)',
                submitButtonBorderColorHover: 'rgb(73, 88, 103)',
                labelTextColor: 'rgb(26, 26, 26)',
                inputTextColor: 'rgb(26, 26, 26)',
                inputBorderColor: 'rgb(26, 26, 26)',
                inputFillColor: 'rgb(241, 241, 241)',
                inputFillColorHover: 'rgb(241, 241, 241)',
                submitButtonData: {
                    type: 'GridButton',
                    content: 'Submit',
                    settings: {
                        type: 'primary',
                        isFormButton: true,
                        styles: {
                            align: 'center',
                            position: '8/8/9/10',
                        },
                    },
                },
                innerBackground: {
                    current: '',
                    color: 'rgb(255, 255, 255)',
                    image: '',
                },
            },
        },
        socialIcons: {
            name: t('common.socialIcons'),
            icon: 'social-links',
            width: 2,
            widthPixels: 200,
            heightPixels: 25,
            height: 1,
            content: {
                type: 'GridSocialIcons',
                settings: {
                    useBrandColors: false,
                    styles: {
                        'm-element-margin': '0 0 16px 0',
                        align: '',
                        justify: 'center',
                        'space-between-icons': '20px',
                        'icon-direction': 'row',
                        'icon-color': 'rgb(0, 0, 0)',
                        'icon-color-hover': 'rgb(58, 58, 58)',
                        'icon-spacing': 'space-around',
                        'icon-size': '20px',
                    },
                },
                links: [...Object.values(DEFAULT_SOCIAL_LINKS)],
            },
        },
        embed: {
            name: t('common.embedCode'),
            width: 6,
            widthPixels: 400,
            heightPixels: 22,
            height: 6,
            icon: 'html-brackets',
            content: {
                type: 'GridEmbed',
                content: '<code>Your custom embed code</code>',
                settings: {
                    styles: {},
                },
            },
        },
    }));

    const addLayoutElement = async ({
        layoutElements,
        blockId,
        blockToAddRef,
        elementId,
        newElementData,
        newElementRawLeft,
        newElementRawTop,
        newElementRawWidth,
        newElementRawHeight,
    }) => {
        const lowestElementBottom = getLowestElementBottom({
            blockElements: unref(layoutElements),
            elementPositionKey: elementPositionKeyReversed.value,
        });
        const {
            left: blockLayoutLeft,
            top: blockLayoutTop,
        } = blockToAddRef.getBoundingClientRect();
        const elementRawPosition = {
            rawLeft: Math.max(Math.round(newElementRawLeft - blockLayoutLeft), 0),
            rawTop: Math.max(Math.round(newElementRawTop - blockLayoutTop), 0),
            rawHeight: newElementRawHeight,
            rawWidth: newElementRawWidth,
        };

        const initialElementDesktopPosition = getInitialElementDesktopPosition({
            elementRawPosition,
            isDesktopMode: isDesktopMode.value,
            lowestElementBottom,
        });
        const initialElementMobilePosition = getInitialElementMobilePosition({
            elementType: newElementData.type,
            elementRawPosition,
            isDesktopMode: isDesktopMode.value,
            lowestElementBottom,
        });

        dispatch('addElement', {
            blockId,
            elementId,
            elementData: {
                ...newElementData,
                desktop: {
                    ...newElementData.desktop,
                    ...initialElementDesktopPosition,
                },
                mobile: {
                    ...newElementData.mobile,
                    ...initialElementMobilePosition,
                },
            },
        });

        await nextTick();

        // Updates element position on current device
        updateElementPositionFromDOM({
            dispatch,
            elementId,
            blockId,
            isMobileMode: isMobileMode.value,
            pushToHistory: false,
        });

        // Updates element position on other devices
        if (ELEMENTS_RESIZED_BY_CONTENT.includes(newElementData.type)) {
            updateElementHeightOnDevices({
                elementId,
            });
        }

        dispatch('undoRedo/createSnapshot');
    };

    return {
        addLayoutElement,
        defaultElements,
    };
};