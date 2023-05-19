import {
    ref,
    computed,
    nextTick,
} from 'vue';

import {
    ANIMATION_ROLE_ITEMS,
    ANIMATION_NOT_SUPPORTED_ELEMENTS,
    DATA_ATTRIBUTE_ANIMATION_ROLE,
    DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE,
    DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
    DATA_ATTRIBUTE_ANIMATION_STATE,
    ANIMATION_APPLICABLE_BLOCK_TYPES,
    DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
} from '@zyro-inc/site-modules/constants';

const isAnimationDisplayedInEditor = ref(false);
const isAnimationDisplayedInEditorActive = ref(false);
const animationInEditorClass = ref(false);
const animationInEditorName = ref('');
const animationInEditorComponentId = ref(null);

export const useSiteEngineAnimations = ({
    elementData,
    data,
    elementId,
    isParentBlockFooter,
} = {}) => {
    const activationTimeout = ref(null);
    const displayTimeout = ref(null);
    const intersectionObserver = ref(null);
    const propsData = elementData || data || {};

    const getDefaultAnimationClass = (animationName) => `transition transition--${animationName}`;

    const animationClass = computed(() => {
        const isNonSupportedElement = elementId && ANIMATION_NOT_SUPPORTED_ELEMENTS.includes(propsData.type);
        const isNonSupportedBlock = !elementId && !ANIMATION_APPLICABLE_BLOCK_TYPES.includes(propsData.type);

        if (isNonSupportedElement || isNonSupportedBlock) {
            return '';
        }

        const defaultAnimationName = getDefaultAnimationClass(propsData.animation ? .name);

        return ANIMATION_ROLE_ITEMS.includes(propsData.type) ? `${defaultAnimationName} transition--root-hidden` : defaultAnimationName;
    });

    const addTransition = async (observerEntries) => {
        observerEntries.forEach(({
            target,
            isIntersecting,
        }) => {
            if (!isIntersecting) {
                target.removeAttribute(DATA_ATTRIBUTE_ANIMATION_STATE);

                return;
            }

            // footer always stays in dom after page change so it cannot be unobserved in order to repeat the animation
            if (!isParentBlockFooter) {
                intersectionObserver.value ? .unobserve(target);
            }

            // cannot set classes directly on a target with classList.add because
            // if vue template has dynamic classes they will override these ones set with js
            target.setAttribute(DATA_ATTRIBUTE_ANIMATION_STATE, DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE);
        });
    };

    const addIntersectionObserver = ({
        root = null
    } = {}) => {
        if (!propsData.animation ? .name) {
            return;
        }

        intersectionObserver.value = new IntersectionObserver(
            addTransition, {
                threshold: 0,
                root,
            },
        );
    };

    const observe = async (itemRef) => {
        if (!propsData.animation ? .name) {
            return;
        }

        // some elements load a tad later so next tick needed
        await nextTick();

        if (ANIMATION_ROLE_ITEMS.includes(propsData.type)) {
            // observe separate images/block elements instead of a wrapper
            const imageElements = itemRef ? .querySelectorAll(`[${DATA_ATTRIBUTE_ANIMATION_ROLE}="${DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE}"]`);
            const blockElements = itemRef ? .querySelectorAll(
                `[${DATA_ATTRIBUTE_ANIMATION_ROLE}="${DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT}"]`,
            );
            const allElements = [
                ...imageElements,
                ...blockElements,
            ];

            allElements.forEach(
                (element) => intersectionObserver.value ? .observe(element),
            );
        } else {
            intersectionObserver.value ? .observe(itemRef);
        }
    };

    const resetAnimationInEditor = () => {
        window.clearTimeout(activationTimeout.value);
        window.clearTimeout(displayTimeout.value);

        isAnimationDisplayedInEditor.value = false;
        isAnimationDisplayedInEditorActive.value = false;
    };

    const displayAnimationInEditor = ({
        animation,
        id,
    }) => {
        // reset previous animation preview
        resetAnimationInEditor();

        if (!animation === 'none') {
            return;
        }

        animationInEditorComponentId.value = id;
        animationInEditorName.value = animation;
        isAnimationDisplayedInEditor.value = true;
        animationInEditorClass.value = getDefaultAnimationClass(animationInEditorName.value);

        activationTimeout.value = setTimeout(() => {
            isAnimationDisplayedInEditorActive.value = true;
        }, 500);

        // to remove class from editor items after animation ended
        displayTimeout.value = setTimeout(() => {
            isAnimationDisplayedInEditor.value = false;
            isAnimationDisplayedInEditorActive.value = false;
            animationInEditorComponentId.value = null;
        }, 2000);
    };

    return {
        intersectionObserver,
        animationClass,
        animationInEditorClass,
        animationInEditorComponentId,
        isAnimationDisplayedInEditor,
        isAnimationDisplayedInEditorActive,
        animationInEditorName,
        addIntersectionObserver,
        observe,
        displayAnimationInEditor,
    };
};