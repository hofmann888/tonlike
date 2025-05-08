import type { Metadata } from "next";
import { I18nProvider } from "@/components/Providers/I18nProvider";
import { Providers } from "@/components/Providers/Providers";
import { TWARoot } from "@/components/TWA/TWARoot";
import { getEnvBoolean } from "@/utils/helpers";
import { getAuthUser } from "@/core/session";
import Maintenance from "@/components/Common/Maintenance";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import localFont from "next/font/local";
import "@/css/globals.scss";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = { // TODO: icon
  title: "TonLike",
  applicationName: "TonLike",
  description: "TonLike is a mini app in Telegram for promoting social media.",
  icons: "/img/logo-circle.png",
};

// TODO: move to I18nProvider to Rroviders
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultTheme = 'dark';
  const user = await getAuthUser(); // TODO?: from db?
  const ad = !!process.env.NEXT_PUBLIC_ADSGRAM_PLATFORM_ID?.length;

  if (getEnvBoolean(process.env.MAINTENANCE_MODE)) {
    return <Maintenance />;
  }

  return (
    <html lang="en" className={defaultTheme}>
      {ad &&
        <head>
          <script src="https://sad.adsgram.ai/js/sad.min.js"></script>
        </head>
      }
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-main`}>
        <TWARoot>
          <I18nProvider>
            <Providers 
              userData={user}
              themeProps={{ attribute: "class", defaultTheme: defaultTheme }}
            >
              <div className="layout-grid grid grid-rows-[80px_1fr_60px] max-w-[500px] my-0 mx-auto min-h-screen font-[family-name:var(--font-geist-sans)] relative">
                <Header />
                
                <main className="layout-content">
                  {children}
                </main>

                <Footer />
              </div>
            </Providers>
          </I18nProvider>
        </TWARoot>
      </body>
    </html>
  );
}
