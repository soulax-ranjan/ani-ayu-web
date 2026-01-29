import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '81226a61b614c4ead9f5427e24ffa60a';

export const initMixpanel = () => {
    if (typeof window !== 'undefined') {
        mixpanel.init(MIXPANEL_TOKEN, {
            debug: process.env.NODE_ENV === 'development',
            track_pageview: true,
            persistence: 'localStorage',
            api_host: 'https://api-eu.mixpanel.com',
            record_sessions_percent: 100,
        });
    }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
        mixpanel.track(eventName, properties);
    }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
        mixpanel.identify(userId);
        if (traits) {
            mixpanel.people.set(traits);
        }
    }
};

export const resetMixpanel = () => {
    if (typeof window !== 'undefined') {
        mixpanel.reset();
    }
}
