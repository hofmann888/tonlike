import type { WebApp } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: {
      WebApp: WebApp;
    };
  }
}

export function getWebApp(): WebApp {
  // TODO: sometimes error on refresh page: 'Cannot read properties of undefined (reading 'WebApp')'
  return window.Telegram.WebApp;
}