'use client';

import { type PropsWithChildren, useEffect } from 'react';
import { initData, miniApp, useLaunchParams, useSignal } from '@telegram-apps/sdk-react';
import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useTelegramMock } from '@/hooks/useTelegramMock';
import { ErrorPage } from '@/components/Error/ErrorPage';
import { AppEnv, AppEnvEnum } from '@/lib/definitions';
import { useClientOnce } from '@/hooks/useClientOnce';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { useDidMount } from '@/hooks/useDidMount';
import { getEnvBoolean } from '@/utils/helpers';
import { init } from '@/core/init';
import PageLoader from '@/components/Common/PageLoader';
// import { setLocale } from '@/core/i18n/locale'; // TODO: localization

const manifestUrl = 'https://maxhofm.github.io/stepik-5-5/tonconnect-manifest.json'; // TODO!: edit

function RootInner({ children }: PropsWithChildren) {
  const useMock = [AppEnvEnum.LOCAL, AppEnvEnum.DEV].includes(process.env.NEXT_PUBLIC_APP_ENV as AppEnv);
  if (useMock) {
    useTelegramMock(); // TODO: eslint-disable-next-line react-hooks/rules-of-hooks
  }

  const debug = getEnvBoolean(process.env.NEXT_PUBLIC_APP_DEBUG);
  useClientOnce(() => {
    init(debug);
  });

  const lp = useLaunchParams();
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
  ) : <div className="h-[100vh]"><PageLoader /></div>;
}