import * as amplitude from '@amplitude/analytics-browser';

export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    try {
      amplitude.track(eventName, eventProperties);
    } catch (error) {
      console.error('Failed to track Amplitude event:', error);
    }
  }
};

export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    try {
      amplitude.setUserId(userId);
      if (userProperties) {
        amplitude.identify(new amplitude.Identify().set(userProperties));
      }
    } catch (error) {
      console.error('Failed to identify user in Amplitude:', error);
    }
  }
};

export { amplitude };