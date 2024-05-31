import type { Metadata } from "next";
import "@/dashboard/styles/globals.css";
import App from "./app";
import { inter, unbounded } from "@/dashboard/components/fonts"
import ClientBoundary from "@/dashboard/client-boundary";

export const metadata: Metadata = {
  title: "DotStack",
  description: "Sign In With Substrate",
  icons: "/favicon.ico",
  openGraph: {
    title: "DotStack",
    description: "Sign In With Substrate",
    images: [
      {
        url: "/dotstack-og.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DotStack",
    description: "Sign In With Substrate",
    images: ["/dotstack-og.png"],
    creator: "@headline_crypto",
  },
  metadataBase: new URL("https://dotstack.xyz"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${unbounded.variable} ${inter.className}`}>
        <ClientBoundary>
          <App />
        </ClientBoundary>
      </body>
    </html>
  );
}
