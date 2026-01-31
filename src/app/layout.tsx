"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wallet, BarChart3, Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import "./globals.css";
import { Inter } from "next/font/google";
import { DataProvider } from "@/lib/data-context";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const navItems = [
    { href: "/", label: "Expenses", icon: Wallet },
    { href: "/summary", label: "Summary", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <body className={`${inter.className} min-h-screen bg-background text-foreground pb-24 overflow-x-hidden transition-colors duration-500`}>
        <DataProvider>
          <Toaster richColors position="top-center" />
          <div className="min-h-screen flex flex-col relative w-full">
            {/* Top Premium Navbar */}
            <header className="sticky top-0 w-full bg-white dark:bg-slate-900 border-b border-white dark:border-slate-800/50 z-50 shadow-sm">
              <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                  Tour <span className="text-sky-500">Manager</span>
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-sky-400 border border-slate-100 dark:border-slate-800 transition-colors shadow-sm"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
              </div>
            </header>

            <main className="flex-1 w-full pt-2">
              {children}
            </main>

            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-slate-900 border-t border-white dark:border-slate-800/50 pb-safe z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
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
