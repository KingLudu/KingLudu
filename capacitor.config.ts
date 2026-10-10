import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kingludo.app',
  appName: 'King Ludo',
  webDir: 'dist',
  backgroundColor: '#0a0518',
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a0518',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#0a0518',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0518',
      overlaysWebView: false,
    },
  },
  server: {
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
