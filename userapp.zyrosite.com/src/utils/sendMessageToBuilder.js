// ! We can't use any matching for origin, only explicit ones, which prevents messages being sent in dPreviews. So we use * for now.
// ! Do not send any sensitive data in messages, as they are not encrypted/allowed on all origins.
export const sendMessageToBuilder = ({
    payload
}) => window.top.postMessage(payload, '*');