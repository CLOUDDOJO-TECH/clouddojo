"use client";

import React, { useEffect } from 'react';
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

interface AmplitudeProviderProps {
  children: React.ReactNode;
}

export const AmplitudeProvider: React.FC<AmplitudeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      try {
        // Add Session Replay plugin
        amplitude.add(sessionReplayPlugin({ sampleRate: 1 }));
        
        // Initialize Amplitude with API key and enhanced configuration
        amplitude.init('160da6bd605eaf864f2fdd081678974b', {
          autocapture: {
            attribution: true,
            fileDownloads: true,
            formInteractions: true,
            pageViews: true,
            sessions: true,
            elementInteractions: true,
            networkTracking: true,
            webVitals: true,
            frustrationInteractions: true
          }
        });
        
        console.log('Amplitude initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Amplitude:', error);
      }
    }
  }, []);

  return <>{children}</>;
};

export default AmplitudeProvider;