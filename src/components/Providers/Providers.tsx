"use client";

import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { User } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "@/components/Providers/UserProvider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  userData: User;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps, userData }: ProvidersProps) {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <NextUIProvider navigate={router.push}>
      <ThemeProvider {...themeProps}>
        <QueryClientProvider client={queryClient}>
          <UserProvider userData={userData}>
            {children}
          </UserProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
}
