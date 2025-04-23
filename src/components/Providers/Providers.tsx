'use client'

import type { ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { I18nProvider } from "./I18nProvider";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { User } from "@/lib/definitions";
import UserProvider from "@/components/Providers/UserProvider";
import * as React from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  userData: User;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

// TODO: HeroUIProvider not working
// TODO: I18nProvider
export function Providers({ children, themeProps, userData }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider {...themeProps}>
        {/* <I18nProvider> */}
          <UserProvider userData={userData}>
            <ToastProvider placement="bottom-center" toastOffset={60} toastProps={{ timeout: 3000, classNames: { base: "z-50" } }} />
            {children}
          </UserProvider>
        {/* </I18nProvider> */}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
