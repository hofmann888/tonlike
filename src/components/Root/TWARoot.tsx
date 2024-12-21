'use client';

import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { ErrorBoundary } from '@/components/Root/ErrorBoundary';
import { ErrorPage } from '@/components/Root/ErrorPage';
import { useDidMount } from '@/hooks/useDidMount';
import { getWebApp } from '@/utils/getWebApp';
import { UserContext } from "../Providers/UserProvider";
import { useContext } from "react";

function RootInner({ children }: PropsWithChildren) {
  const webApp = getWebApp();
  const debug = webApp.initDataUnsafe.start_param === 'debug';
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  // TODO: remove?
  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import('eruda').then((lib) => lib.default.init());
    }
  }, [debug]);

  // TODO: move all providers from layaut to root?
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <AppRoot
        appearance={webApp.colorScheme}
        platform={['macos', 'ios'].includes(webApp.platform) ? 'ios' : 'base'}
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function TWARoot(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side Rendering.
  // That's why we are showing loader on the server side.
  const didMount = useDidMount();

  const { id } = useContext(UserContext);

  return didMount && id ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props}/>
    </ErrorBoundary>
  ) : <div className="root__loading">Loading</div>; // TODO: loader before auth and check if tg
}