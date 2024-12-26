'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useClientOnce } from '@/hooks/useClientOnce';
import { useDidMount } from '@/hooks/useDidMount';
import { init } from '@/core/init';
// import { setLocale } from '@/core/i18n/locale'; // TODO: localization
import {
  // initData,
  miniApp,
  useLaunchParams,
  useSignal,
} from '@telegram-apps/sdk-react';

const manifestUrl = 'https://maxhofm.github.io/stepik-5-5/tonconnect-manifest.json';

function RootInner({ children }: PropsWithChildren) {
  const isDev = process.env.NODE_ENV === 'development';

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    useTelegramMock(); // eslint-disable-next-line react-hooks/rules-of-hooks
  }

  const lp = useLaunchParams();
  const debug = isDev || lp.startParam === 'debug';

  // Initialize the library.
  useClientOnce(() => {
    init(debug);
  });

  const isDark = useSignal(miniApp.isDark);
  // const initDataUser = useSignal(initData.user);

  // Set the user locale. // TODO: localization
  // useEffect(() => {
  //   initDataUser && setLocale(initDataUser.languageCode);
  // }, [initDataUser]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'}
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

  return didMount ? <RootInner {...props}/> : <div className="root__loading">Loading</div>; // TODO: loader before auth and check if tg
}