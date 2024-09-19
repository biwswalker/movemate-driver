declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL: string;
    EXPO_PUBLIC_WS_URL: string;
    EXPO_PUBLIC_SHARED_KEY: string;
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    EXPO_PUBLIC_GOOGLE_MAPS_ID: string;
  }
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}