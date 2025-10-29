import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moola Coin Flip Challenge",
  description: "Can you turn $25 into $150 in 5 minutes? Play the biased coin flip challenge and learn smart risk management.",
  keywords: "investing, risk management, behavioral finance, coin flip, challenge, Moola",
  authors: [{ name: "Moola" }],
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
