import {
    computed
} from 'vue';

export const useGridButton = (props, context, {
    href
} = {}) => ({
    href,
    // TODO: flatten 'settings.type' to 'theme' / 'variant'
    type: computed(() => props.data.settings ? .type),
    fontSizeMobile: computed(() => props.data.mobile ? .fontSize),
    fontSizeDesktop: computed(() => props.data.desktop ? .fontSize),
    fontFamily: computed(() => props.data.fontFamily),
    fontWeight: computed(() => props.data.fontWeight),
    borderWidth: computed(() => props.data.borderWidth),
    borderRadius: computed(() => props.data.borderRadius),
    backgroundColor: computed(() => props.data.backgroundColor),
    fontColor: computed(() => props.data.fontColor),
    borderColor: computed(() => props.data.borderColor),
    backgroundColorHover: computed(() => props.data.backgroundColorHover),
    fontColorHover: computed(() => props.data.fontColorHover),
    borderColorHover: computed(() => props.data.borderColorHover),
    // TODO: flatten 'settings.isFormButton'
    buttonType: computed(() => (props.data.settings.isFormButton ? 'submit' : null)),
    tagName: computed(() => (props.data.settings.isFormButton ? 'button' : 'a')),
    target: computed(() => props.data.target),
    rel: computed(() => props.data.rel),
    content: computed(() => props.data.content),
});