"use client";

import { useState } from "react";
import { UserPlus, Tag, Plus, Loader2, Trash2, AlertCircle, RefreshCcw, User, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/lib/data-context";

export default function Settings() {
    const { participants, categories, loading, refreshData } = useData();
    const [localLoading, setLocalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newParticipant, setNewParticipant] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const addParticipant = async () => {
        if (!newParticipant.trim()) return;
        setLocalLoading(true);
        try {
            const res = await fetch("/api/participants", {
                method: "POST",
                body: JSON.stringify({ name: newParticipant }),
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Failed to add");
            setNewParticipant("");
            await refreshData();
        } catch (error) {
            setError("Failed to add participant.");
        } finally {
            setLocalLoading(false);
        }
    };

    const addCategory = async () => {
        if (!newCategory.trim()) return;
        setLocalLoading(true);
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                body: JSON.stringify({ name: newCategory }),
                headers: { "Content-Type": "application/json" }
            });
            if (!res.ok) throw new Error("Failed to add");
            setNewCategory("");
            await refreshData();
        } catch (error) {
            setError("Failed to add category.");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="py-8 px-4 max-w-lg mx-auto pb-32">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mb-2 font-inter">
                    Trip <span className="text-sky-500">Settings</span>
                </h1>
                <p className="text-slate-500 font-medium tracking-tight uppercase text-[10px] tracking-[0.2em] opacity-70">Customization Center</p>
            </header>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-6 rounded-[2.5rem] mb-10 flex flex-col items-center text-center gap-4"
                >
                    <AlertCircle className="text-red-500" size={32} />
                    <div className="flex-1">
                        <h3 className="text-red-800 dark:text-red-400 font-black mb-1 text-lg">Oops!</h3>
                        <p className="text-red-600 dark:text-red-400/80 text-sm font-bold tracking-tight">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        Dismiss
                    </button>
                </motion.div>
            )}

            {loading && !participants.length ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
                    <Loader2 className="animate-spin text-sky-500" size={40} strokeWidth={4} />
                    <p className="font-black uppercase text-[10px] tracking-[0.2em]">Syncing Preferences...</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Participants Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Trip Squad</h2>
                        </div>

                        <div className="relative mb-6 group">
                            <input
                                type="text"
                                value={newParticipant}
                                onChange={e => setNewParticipant(e.target.value)}
                                placeholder="Add a friend..."
                                className="w-full bg-white dark:bg-slate-800/40 border-2 border-transparent focus:border-sky-500 rounded-[2.5rem] pl-8 pr-32 py-6 font-black text-lg focus:outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                            <button
                                onClick={addParticipant}
                                disabled={localLoading || !newParticipant.trim()}
                                className="absolute right-3 top-3 bottom-3 bg-sky-500 text-white px-8 rounded-[2rem] font-black shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all text-sm uppercase tracking-widest"
                            >
                                {localLoading ? "..." : "Add"}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none">
                            {!participants.length ? (
                                <div className="p-16 text-center text-slate-300 flex flex-col items-center gap-4">
                                    <User size={40} className="opacity-20" />
                                    <p className="font-bold uppercase text-[10px] tracking-widest">The squad is empty</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-slate-800/40 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {participants.map((p, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={p._id}
                                            className="p-6 flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all cursor-default"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 font-black text-lg uppercase shadow-sm">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <span className="font-black text-slate-800 dark:text-white text-lg tracking-tight group-hover:translate-x-1 transition-transform">{p.name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 px-2">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Expense Categories</h2>
                        </div>

                        <div className="relative mb-6 group">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={e => setNewCategory(e.target.value)}
                                placeholder="New category type..."
                                className="w-full bg-white dark:bg-slate-800/40 border-2 border-transparent focus:border-orange-500 rounded-[2.5rem] pl-8 pr-32 py-6 font-black text-lg focus:outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                            <button
                                onClick={addCategory}
                                disabled={localLoading || !newCategory.trim()}
                                className="absolute right-3 top-3 bottom-3 bg-orange-500 text-white px-8 rounded-[2rem] font-black shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all text-sm uppercase tracking-widest"
                            >
                                {localLoading ? "..." : "Add"}
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-800/40 rounded-[3rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-xl shadow-slate-200/40 dark:shadow-none">
                            <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40 custom-scrollbar">
                                {categories.map((c, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={c._id}
                                        className="p-6 flex justify-between items-center group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
                                                <Layers size={18} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <span className={`font-black text-lg tracking-tight ${c.isDefault ? 'text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-200'} group-hover:translate-x-1 transition-transform`}>
                                                {c.name}
                                            </span>
                                        </div>
                                        {c.isDefault && (
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 rounded-lg border border-slate-100 dark:border-slate-700">
                                                System
                                            </span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                }
            `}</style>
        </div>
    );
}
