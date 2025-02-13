'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import { ErrorPage } from '@/components/Error/ErrorPage';
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
  console.log('process.env.NEXT_PUBLIC_APP_ENV', process.env.NEXT_PUBLIC_APP_ENV);
  const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development';

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    useTelegramMock(); // eslint-disable-next-line react-hooks/rules-of-hooks
  }

  const lp = useLaunchParams();
  const debug = !!process.env.NEXT_PUBLIC_APP_DEBUG || lp.startParam === 'debug';

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

  // TODO: move TonConnectUIProvider to providers?
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

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props}/>
    </ErrorBoundary>
  ) : <div className="flex items-center justify-center absolute top-0 left-0 w-full h-full">Loading</div>;
}