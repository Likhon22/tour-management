"use client";

import { useState, useRef } from "react";
import { Plus, Wallet, Loader2, Coins, ArrowUpRight, ArrowDownLeft, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/lib/data-context";
import { getEmojiForCategory } from "@/lib/utils";

const Taka = () => <span className="mr-0.5">৳</span>;

export default function Home() {
  const { expenses, deposits, loading, refreshData, participants, categories } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<"expense" | "deposit">("expense");

  const activity = [
    ...expenses.map(e => ({ ...e, type: "expense" })),
    ...deposits.map(d => ({ ...d, type: "deposit" }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="py-8 px-6 lg:px-10 max-w-7xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
            Group <span className="text-sky-500">Fund</span>
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Cox's Bazar 2026</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setModalType("deposit"); setShowAddModal(true); }}
            className="bg-emerald-500 text-white p-4 rounded-2xl shadow-lg ring-4 ring-emerald-500/10 shadow-emerald-500/20"
          >
            <Coins size={24} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setModalType("expense"); setShowAddModal(true); }}
            className="bg-sky-500 text-white p-4 rounded-2xl shadow-lg ring-4 ring-sky-500/10 shadow-sky-500/20"
          >
            <Plus size={24} strokeWidth={3} />
          </motion.button>
        </div>
      </header>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Activity Log</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-sky-500" size={40} strokeWidth={3} />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">Updating log...</p>
          </div>
        ) : activity.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800/50 px-8 shadow-xl shadow-slate-200/60 dark:shadow-none">
            <Wallet className="text-sky-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">No activity yet</h3>
            <p className="text-slate-500 text-sm italic">Add some deposits or expenses to begin!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.map((item: any, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                key={item._id}
                className="bg-white dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/50 flex items-center gap-4 hover:border-sky-300 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${item.type === "deposit" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : "bg-sky-50 dark:bg-sky-500/10 text-sky-500"
                  }`}>
                  {item.type === "deposit" ? <ArrowUpRight size={24} /> : getEmojiForCategory(item.category?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate">
                    {item.type === "deposit" ? `Fund from ${item.contributor?.name}` : (item.description || item.category?.name || "Expense")}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {item.type === "deposit" ? "Deposit" : `${item.category?.name || "General"} • Paid from Fund`}
                  </p>
                </div>
                <div className="text-right ml-2 font-mono">
                  <span className={`font-black text-xl ${item.type === "deposit" ? "text-emerald-500" : "text-slate-900 dark:text-white"}`}>
                    {item.type === "deposit" ? "+" : "-"}<Taka />{item.amount}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl relative z-10 sm:m-4 overflow-visible border border-white dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                  {modalType === "expense" ? "Log Expense" : "Add Transfer"}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">✕</button>
              </div>

              {modalType === "expense" ? (
                <AddExpenseForm categories={categories} onSuccess={() => { refreshData(); setShowAddModal(false); }} />
              ) : (
                <AddDepositForm participants={participants} onSuccess={() => { refreshData(); setShowAddModal(false); }} />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


// --- Custom Premium Select Component ---
function PremiumSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option"
}: {
  label?: string,
  options: { label: string, value: string }[],
  value: string,
  onChange: (val: string) => void,
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 300px below, open upward
      setOpenUpward(spaceBelow < 300);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={containerRef}>
      {label && <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>}
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl px-6 py-4 flex items-center justify-between transition-all group"
      >
        <span className={`font-bold text-left mr-2 ${selectedOption ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: openUpward ? -10 : 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: openUpward ? -10 : 10, scale: 0.95 }}
              className={`absolute left-0 right-0 z-50 bg-white dark:bg-slate-800 rounded-3xl p-2 shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden max-h-[280px] overflow-y-auto ${openUpward ? "bottom-full mb-2" : "top-full mt-2"
                }`}
            >
              <div className="space-y-1">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`w-full text-left px-5 py-4 rounded-2xl flex items-center justify-between transition-colors ${value === opt.value
                      ? "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-medium"
                      }`}
                  >
                    <span className="flex-1 pr-4 leading-tight">{opt.label}</span>
                    {value === opt.value && <Check size={18} strokeWidth={3} className="shrink-0" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddExpenseForm({ onSuccess, categories }: { onSuccess: () => void, categories: any[] }) {
  const [formData, setFormData] = useState({ amount: "", description: "", category: categories[0]?._id || "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify({ ...formData, amount: Number(formData.amount) }),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Post failed");
      onSuccess();
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-center">Amount</label>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300">৳</span>
          <input
            required type="number" value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-sky-500 rounded-[2.5rem] pl-16 pr-8 py-8 text-5xl font-black text-center focus:outline-none transition-all placeholder:text-slate-200"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Description (Optional)</label>
        <input
          type="text" value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-3xl px-6 py-5 font-bold focus:outline-none border-2 border-transparent focus:border-sky-500 transition-all"
          placeholder="e.g. Rickshaw fare to Sugandha beach"
        />
      </div>

      <PremiumSelect
        label="Trip Category"
        options={categories.map(c => ({ label: c.name, value: c._id }))}
        value={formData.category}
        onChange={(val) => setFormData({ ...formData, category: val })}
        placeholder="Select a category"
      />

      <div className="py-8 px-6 lg:px-10 max-w-7xl mx-auto">
        <button type="submit" disabled={submitting} className="w-full bg-sky-500 text-white font-black py-8 rounded-[2.5rem] shadow-xl shadow-sky-500/20 active:scale-95 transition-all text-xl">
          {submitting ? "Processing..." : "Deduct From Fund"}
        </button>
        <p className="text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4 opacity-70">Withdrawal from shared wallet</p>
      </div>
    </form>
  );
}

function AddDepositForm({ onSuccess, participants }: { onSuccess: () => void, participants: any[] }) {
  const [formData, setFormData] = useState({ amount: "", contributor: participants[0]?._id || "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/deposits", {
        method: "POST",
        body: JSON.stringify({ ...formData, amount: Number(formData.amount) }),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Post failed");
      onSuccess();
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 text-center">Fund Amount</label>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-emerald-300">৳</span>
          <input
            required type="number" value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500 rounded-[2.5rem] pl-16 pr-8 py-8 text-5xl font-black text-emerald-500 text-center focus:outline-none transition-all"
            placeholder="0.00"
          />
        </div>
      </div>

      <PremiumSelect
        label="Who gave this?"
        options={participants.map(p => ({ label: p.name, value: p._id }))}
        value={formData.contributor}
        onChange={(val) => setFormData({ ...formData, contributor: val })}
        placeholder="Select person"
      />

      <div className="pt-2">
        <button type="submit" disabled={submitting} className="w-full bg-emerald-500 text-white font-black py-8 rounded-[2.5rem] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-xl">
          {submitting ? "depositing..." : "Confirm Deposit"}
        </button>
      </div>
    </form>
  );
}
