import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/constant/font";
import LastBet from "@/component/LastBet";

export const metadata: Metadata = {
  title: "Flip Coin",
  description: "Connect wallet and play flip coin game to win prizes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex justify-center min-h-screen p-12 relative`}
      >
        <div className="flex flex-col gap-12 items-start">{children}</div>
        <LastBet />
      </body>
    </html>
  );
}
