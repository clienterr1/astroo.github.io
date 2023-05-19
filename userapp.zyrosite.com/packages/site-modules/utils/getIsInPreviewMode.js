// This is different from utils/getIsInPreviewIframe as it checks the hostname and not the window.self !== window.top
// So it's not checking if the current window is an iframe, but if the current window is in builder preview mode
export const getIsInPreviewMode = () => window.location.hostname ? .includes('site-engine') || window.location.hostname ? .includes('latest-user-app');