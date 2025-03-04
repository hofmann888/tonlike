import type { Metadata } from "next";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser(); // TODO?: from db?
  const defaultTheme = 'dark';

  if (getEnvBoolean(process.env.MAINTENANCE_MODE)) {
    return <Maintenance />;
  }

  return (
    <html lang="en" className={defaultTheme}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TWARoot>
          <Providers 
            userData={user}
            themeProps={{ attribute: "class", defaultTheme: defaultTheme }}
          >
            <div className="layout-grid grid grid-rows-[80px_1fr_60px] max-w-[500px] my-0 mx-auto min-h-screen font-[family-name:var(--font-geist-sans)]">
              <Header />
              
              <main className="layout-content">
                {children}
              </main>

              <Footer />
            </div>
          </Providers>
        </TWARoot>
      </body>
    </html>
  );
}
