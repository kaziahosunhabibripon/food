import { Noto_Serif } from "next/font/google";
import "../styles/globals.css";
import GotoWhatspp from "@/components/common/GotoWhatspp";
import GoToTop from "@/components/common/GoToTop";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/common/Footer";
import GlobalProvider from "@/components/core/GlobalProvider";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import ToastProvider from "./toastify";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-serif",
});
export const metadata = {
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/assets/logo-2.png",
        href: "/assets/logo-2.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/assets/logo-1.png",
        href: "/assets/logo-1.png",
      },
    ],
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const message = await getMessages();
  const locale = await getLocale();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`${notoSerif.className} antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader
          color="var(--brand-color)"
          crawlSpeed={5}
          showSpinner={false}
          speed={5}
        />
        <Suspense fallback={null}>
          <NextIntlClientProvider messages={message}>
            <GlobalProvider>
              {children}
              <GotoWhatspp />
              <GoToTop />
              <Footer />
              <ToastProvider />
            </GlobalProvider>
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
