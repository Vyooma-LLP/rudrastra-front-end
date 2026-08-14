import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/layout/AppProviders";
import { ToastContainer } from "@/components/ui/Toast";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rudraastra | India's Technical B2B Drone Hardware Marketplace",
  description:
    "Source authoritative drone components — motors, ESCs, flight controllers, GPS modules, batteries, and propellers — with verified specifications, compatibility data, and multi-vendor pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="suppress-extension-errors"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function suppressError(event) {
                  var filename = event.filename || '';
                  var message = event.message || '';
                  var stack = (event.error && event.error.stack) || '';
                  if (
                    filename.indexOf('chrome-extension://') !== -1 ||
                    filename.indexOf('safari-extension://') !== -1 ||
                    filename.indexOf('moz-extension://') !== -1 ||
                    message.indexOf('MetaMask') !== -1 ||
                    stack.indexOf('chrome-extension://') !== -1 ||
                    stack.indexOf('safari-extension://') !== -1 ||
                    stack.indexOf('moz-extension://') !== -1 ||
                    stack.indexOf('MetaMask') !== -1
                  ) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                  }
                }
                function suppressRejection(event) {
                  var reason = event.reason;
                  if (reason) {
                    var stack = reason.stack || String(reason);
                    var message = reason.message || '';
                    if (
                      stack.indexOf('chrome-extension://') !== -1 ||
                      stack.indexOf('safari-extension://') !== -1 ||
                      stack.indexOf('moz-extension://') !== -1 ||
                      stack.indexOf('MetaMask') !== -1 ||
                      message.indexOf('MetaMask') !== -1
                    ) {
                      event.preventDefault();
                      event.stopPropagation();
                      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                    }
                  }
                }
                window.addEventListener('error', suppressError, true);
                window.addEventListener('unhandledrejection', suppressRejection, true);
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProviders>
          {children}
          <ToastContainer />
        </AppProviders>
      </body>
    </html>
  );
}
