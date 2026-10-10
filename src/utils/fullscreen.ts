/**
 * Fullscreen utilities for King Ludo web & mobile app.
 * Enables true native fullscreen across browsers and devices.
 */

export const isAppFullscreen = (): boolean => {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
    (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
    (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
};

export const requestAppFullscreen = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;
  if (isAppFullscreen()) return true;

  try {
    const docEl = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };

    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen();
      return true;
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
      return true;
    } else if (docEl.mozRequestFullScreen) {
      await docEl.mozRequestFullScreen();
      return true;
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
      return true;
    }
  } catch {
    // Browser may require direct user gesture or block in certain iframes
  }
  return false;
};

export const exitAppFullscreen = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;
  if (!isAppFullscreen()) return true;

  try {
    const doc = document as unknown as {
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
      return true;
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
      return true;
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
      return true;
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
      return true;
    }
  } catch {
    // Ignore error
  }
  return false;
};

export const toggleAppFullscreen = async (): Promise<boolean> => {
  if (isAppFullscreen()) {
    return exitAppFullscreen();
  } else {
    return requestAppFullscreen();
  }
};

/**
 * Initializes automatic always-fullscreen behavior.
 * Modern browsers require a user interaction (tap/click) to trigger fullscreen.
 * This ensures that on any tap or touch anywhere in the app, fullscreen is seamlessly engaged.
 */
export const initAlwaysFullscreen = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const tryEnterFullscreen = () => {
    if (!isAppFullscreen()) {
      requestAppFullscreen().catch(() => {});
    }
  };

  // Immediate attempt
  tryEnterFullscreen();

  // Listen on any interaction (touchstart, pointerdown, click)
  const events = ['click', 'touchstart', 'pointerdown'];
  events.forEach((ev) => {
    document.addEventListener(ev, tryEnterFullscreen, { passive: true });
  });

  // Re-request on visibility change or window focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      tryEnterFullscreen();
    }
  });

  window.addEventListener('focus', tryEnterFullscreen);

  return () => {
    events.forEach((ev) => {
      document.removeEventListener(ev, tryEnterFullscreen);
    });
    window.removeEventListener('focus', tryEnterFullscreen);
  };
};

