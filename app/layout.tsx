import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';


const inter = Inter({ subsets: ['latin'] })

console.log('--- Debugging metadataBase ---');
console.log('process.env.NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL);
console.log('Derived SERVER_URL:', SERVER_URL);
// You might even try to construct the URL in a try-catch block to see the specific error
try {
  new URL(SERVER_URL);
  console.log('SERVER_URL is a valid URL:', SERVER_URL);
} catch (e) {
  console.error('SERVER_URL is NOT a valid URL:', SERVER_URL, e);
}
console.log('------------------------------');

export const metadata: Metadata = {
  title: {
    template: `%s | Prostore`,
    default: APP_NAME
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.className, "font-sans")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
