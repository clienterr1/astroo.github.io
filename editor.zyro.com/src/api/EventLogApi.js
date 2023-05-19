/* eslint-disable no-underscore-dangle */

import amplitudeApi from 'amplitude-js';
import axios from 'axios';

import {
    getCookie
} from '@zyro-inc/site-modules/utils/cookies';
import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';
import {
    COOKIE_ZYRO_DEVICE_ID,
    COOKIE_ZYRO_SESSION_ID,
    BUILDER_BRAND_HOSTINGER,
    BUILDER_BRAND_ZYRO,
} from '@/constants';
import {
    trackEvent
} from '@/api/GoogleTagManagerApi';

import eventList from '@/data/analyticEventList';

const amplitudeInstance = amplitudeApi.getInstance();

amplitudeInstance.init(
    import.meta.env.VITE_AMPLITUDE_API_KEY);

export default {
    async logEvent({
        eventName,
        eventProperties = {},
        userProperties = {},
        isHostingerEvent = false,
        amplitude = true,
        googleTagManger = true,
        user = {},
    }) {
        if (isHostingerEvent && !isHostingerBrand) {
            return;
        }

        const event = eventList.getEvent(eventName);

        if (!event || !event.amplitude) {
            console.error(`[EVENT LOGGING ERROR] \nEvent with name - ${eventName} not found in event list or wrong event object structure`);

            return;
        }

        try {
            if (amplitude) {
                if (!amplitudeInstance.options.deviceId) {
                    amplitudeInstance.regenerateDeviceId();
                }

                const userDetails = amplitudeInstance;
                const updatedEventProperties = {
                    ...eventProperties,
                    gtmBlocked: !window.google_tag_manager,
                    brand: isHostingerBrand ? BUILDER_BRAND_HOSTINGER : BUILDER_BRAND_ZYRO,
                };
                const zyroDeviceId = getCookie(COOKIE_ZYRO_DEVICE_ID);
                const zyroSessionId = Number.parseInt(getCookie(COOKIE_ZYRO_SESSION_ID), 10);

                if (isHostingerEvent) {
                    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/v3/events/hostinger`, {
                        eventName: event.amplitude,
                        event: {
                            device_id: userDetails.options.deviceId,
                            event_properties: {
                                ...eventProperties,
                            },
                            user_properties: {
                                ...userProperties,
                            },
                        },
                    });
                } else {
                    await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/v3/events`, {
                        eventName: 'amplitude',
                        event: {
                            event_type: event.amplitude,
                            device_id: zyroDeviceId || userDetails.options.deviceId,
                            platform: userDetails.options.platform || '',
                            os_name: userDetails._ua.browser.name || '',
                            os_version: userDetails._ua.browser.version || '',
                            device_manufacturer: userDetails._ua.device.vendor || '',
                            device_model: userDetails._ua.os.name || '',
                            language: userDetails.options.language || '',
                            session_id: zyroSessionId || userDetails._sessionId || '',
                            event_properties: updatedEventProperties,
                            user_properties: {
                                email: user ? .email || '',
                                id: user ? .id || '',
                                paid: user ? .paid || '',
                                impersonating: user ? .impersonating || '',
                            },
                        },
                    });
                }
            }

            if (googleTagManger) {
                trackEvent({
                    ...event.gtm,
                    ...eventProperties,
                });
            }
        } catch {
            console.error('Error while sending event to analytics 3rd party API');
        }
    },
};