const inBrowser = typeof window !== 'undefined';

export const trackEvent = ({
    event = null,
    category = null,
    action = null,
    label = null,
    value = null,
    noninteraction = false,
    ...rest
} = {}) => {
    if (!inBrowser || !window.dataLayer) {
        return;
    }

    window.dataLayer.push({
        event: event || 'interaction',
        target: category,
        action,
        'target-properties': label,
        value,
        'interaction-type': noninteraction,
        ...rest,
    });
};