"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wallet, BarChart3, Settings as SettingsIcon } from "lucide-react";
import "./globals.css";
import { Inter } from "next/font/google";
import { DataProvider } from "@/lib/data-context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Expenses", icon: Wallet },
    { href: "/summary", label: "Summary", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground pb-24 overflow-x-hidden transition-colors duration-500`}>
        <DataProvider>
          <div className="max-w-md mx-auto min-h-screen flex flex-col relative">
            <main className="flex-1 w-full px-4 sm:px-6">
              {children}
            </main>

            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 pb-safe z-50">
              <div className="flex justify-around items-center h-16 px-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive
                        ? "text-sky-500 scale-105"
                        : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "opacity-100" : "opacity-60"}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </DataProvider>
      </body>
    </html>
  );
}
