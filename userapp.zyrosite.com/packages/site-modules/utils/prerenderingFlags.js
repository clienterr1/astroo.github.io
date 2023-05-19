export const PRERENDERING_FLAG = '_isAppPrerendering';
export const HYDRATING_FLAG = '_isAppHydrating';

export const isAppPrerendering = !!window[PRERENDERING_FLAG];
export const isAppHydrating = !!window[HYDRATING_FLAG];