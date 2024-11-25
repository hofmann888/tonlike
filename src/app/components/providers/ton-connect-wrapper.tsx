'use client'

import { TonConnectUIProvider } from "@tonconnect/ui-react"

const manifestUrl = 'https://maxhofm.github.io/stepik-5-5/tonconnect-manifest.json';

// TODO: Warning: Extra attributes from the server: ontouchstart,style

export default function TonConnectWrapper({children}: {children: React.ReactNode}) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  )
}