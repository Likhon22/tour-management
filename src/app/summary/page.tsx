"use client";

import { useMemo } from "react";
import { Users, Loader2, Landmark, RefreshCcw, AlertTriangle, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "@/lib/data-context";
import { getEmojiForCategory } from "@/lib/utils";

const Taka = () => <span className="mr-0.5">৳</span>;

export default function Summary() {
    const { expenses, participants, deposits, loading, refreshData } = useData();

    const stats = useMemo(() => {
        if (!expenses || !participants || !deposits) return null;

        const totalSpent = expenses.reduce((acc: number, e: any) => acc + (Number(e.amount) || 0), 0);
        const totalCollected = deposits.reduce((acc: number, d: any) => acc + (Number(d.amount) || 0), 0);
        const balance = totalCollected - totalSpent;
        const individualShare = participants.length > 0 ? totalSpent / participants.length : 0;

        const contributionsRecord: Record<string, number> = {};
        deposits.forEach((d: any) => {
            const pId = d.contributor?._id || d.contributor;
            if (pId) {
                contributionsRecord[pId] = (contributionsRecord[pId] || 0) + (Number(d.amount) || 0);
            }
        });

        const categoryCosts: Record<string, number> = {};
        expenses.forEach((e: any) => {
            const catName = e.category?.name || "Other";
            categoryCosts[catName] = (categoryCosts[catName] || 0) + (Number(e.amount) || 0);
        });

        return {
            totalSpent,
            totalCollected,
            balance,
            individualShare,
            categoryCosts,
            contributionsRecord
        };
    }, [expenses, participants, deposits]);

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-sky-500" size={40} strokeWidth={3} />
                <p className="text-slate-400 font-medium">Calculating Summary...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="py-24 px-6 text-center max-w-sm mx-auto">
                <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-[2.5rem] border border-red-100 dark:border-red-500/20 mb-8">
                    <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                    <h2 className="text-red-900 dark:text-red-400 font-black text-xl mb-2">No Data Available</h2>
                    <p className="text-red-600 dark:text-red-400/70 text-sm font-medium leading-relaxed">Please add some participants and expenses first.</p>
                </div>
                <button
                    onClick={refreshData}
                    className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black px-10 py-4 rounded-2xl shadow-lg active:scale-95 transition-all w-full"
                >
                    Check Again
                </button>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 max-w-lg mx-auto pb-32">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-1 font-inter">Trip <span className="text-sky-500">Summary</span></h1>
                    <p className="text-slate-500 font-medium italic text-xs uppercase tracking-widest">Live Group Fund Status</p>
                </div>
                <button onClick={refreshData} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:text-sky-500 transition-colors">
                    <RefreshCcw size={20} />
                </button>
            </header>

            <section className="space-y-6">
                {/* Cash in Hand Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 dark:bg-sky-500 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden ring-4 ring-slate-900/10 dark:ring-sky-500/10"
                >
                    <div className="absolute -top-6 -right-6 p-4 opacity-10">
                        <Landmark size={160} />
                    </div>
                    <p className="text-sky-200/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Cash In Hand</p>
                    <h2 className="text-5xl font-black mb-6 tracking-tighter"><Taka />{stats.balance}</h2>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 uppercase font-black text-[10px] tracking-widest">
                        <div>
                            <p className="opacity-40 mb-1">Total Collected</p>
                            <p className="text-emerald-400 text-sm font-black"><Taka />{stats.totalCollected}</p>
                        </div>
                        <div className="text-right">
                            <p className="opacity-40 mb-1">Total Spent</p>
                            <p className="text-rose-400 text-sm font-black"><Taka />{stats.totalSpent}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Per Person Share */}
                <div className="bg-sky-50 dark:bg-sky-500/5 p-6 rounded-[2rem] border border-sky-100 dark:border-sky-500/10 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Average Cost Per Person</p>
                        <p className="text-2xl font-black text-sky-900 dark:text-sky-100 tracking-tight"><Taka />{Math.round(stats.individualShare)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                        <Users className="text-sky-500" size={24} strokeWidth={3} />
                    </div>
                </div>

                {/* Members Status List */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                        <h3 className="font-black text-lg uppercase tracking-tight">Settlement Status</h3>
                    </div>
                    <div className="space-y-4">
                        {participants.map((p: any) => {
                            const contribution = Number(stats.contributionsRecord[p._id] || 0);
                            const status = contribution - (stats.individualShare || 0);
                            return (
                                <div key={p._id} className="bg-white dark:bg-slate-800/40 p-5 rounded-[2.2rem] border border-slate-100 dark:border-slate-800/50 flex justify-between items-center group shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center font-black text-sky-600 dark:text-sky-400 text-xl uppercase shadow-sm">
                                            {p.name ? p.name.charAt(0) : "?"}
                                        </div>
                                        <div>
                                            <span className="font-black text-slate-900 dark:text-white text-lg block leading-none mb-1.5">{p.name}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Gave <span className="text-emerald-500 font-black"><Taka />{contribution}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {status < 0 ? (
                                            <>
                                                <span className="text-[10px] font-black tracking-widest uppercase text-rose-500">
                                                    To Pay
                                                </span>
                                                <p className="font-black text-xl tracking-tighter text-rose-600">
                                                    <Taka />{Math.abs(Math.round(status))}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black tracking-widest uppercase text-emerald-500">
                                                    Settled
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mt-1">
                                                    <Check className="text-emerald-500" size={16} strokeWidth={4} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Breakdown */}
                <div>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                        <h3 className="font-black text-lg uppercase tracking-tight">Cost Breakdown</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {Object.entries(stats.categoryCosts || {}).map(([name, amount]: [string, any]) => (
                            <div key={name} className="bg-white dark:bg-slate-800/40 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 shadow-sm transition-all hover:border-orange-100">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{getEmojiForCategory(name)}</span>
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] leading-tight">{name}</span>
                                    </div>
                                    <span className="font-black text-xl tracking-tight"><Taka />{amount}</span>
                                </div>
                                <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-100 dark:border-slate-800/40">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(amount / (stats.totalSpent || 1)) * 100}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="bg-orange-500 h-full rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
