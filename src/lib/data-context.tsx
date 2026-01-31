"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface DataContextType {
    participants: any[];
    categories: any[];
    expenses: any[];
    deposits: any[];
    loading: boolean;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState({
        participants: [],
        categories: [],
        expenses: [],
        deposits: []
    });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/init');
            if (!res.ok) throw new Error('Failed to load data');
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <DataContext.Provider value={{
            ...data,
            loading,
            refreshData: fetchData
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
