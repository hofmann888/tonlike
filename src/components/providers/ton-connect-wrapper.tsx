'use client'

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useMemo } from "react";

// const manifestUrl = 'https://maxhofm.github.io/stepik-5-5/tonconnect-manifest.json';

// TODO: Warning: Extra attributes from the server: ontouchstart,style

export default function TonConnectWrapper({children}: {children: React.ReactNode}) {
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  )
}