'use client';

import { type PropsWithChildren, useEffect, useMemo } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useDidMount } from '@/hooks/useDidMount';
import { getWebApp } from '@/utils/getWebApp';

function RootInner({ children }: PropsWithChildren) {
  const webApp = getWebApp();
  const debug = webApp.initDataUnsafe.start_param === 'debug';
  const manifestUrl = useMemo(() => {
    return new URL('https://maxhofm.github.io/stepik-5-5/tonconnect-manifest.json', window.location.href).toString();
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

import { useUser } from '@/hooks/useUser';

export function TWARoot(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side Rendering.
  // That's why we are showing loader on the server side.
  const didMount = useDidMount();
  const { id } = useUser();

  return didMount && id ? <RootInner {...props}/> : <div className="root__loading">Loading</div>; // TODO: loader before auth and check if tg
}