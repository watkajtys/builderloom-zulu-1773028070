import React, { createContext, useContext, ReactNode } from 'react';
import PocketBase from 'pocketbase';

const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:8090`;
    }
    return 'http://loom-pocketbase:8090'; // Docker network default
};

const pb = new PocketBase(getApiUrl());

const PocketBaseContext = createContext<PocketBase>(pb);

export const PocketBaseProvider = ({ children }: { children: ReactNode }) => {
    return (
        <PocketBaseContext.Provider value={pb}>
            {children}
        </PocketBaseContext.Provider>
    );
};

export const usePocketBase = () => {
    return useContext(PocketBaseContext);
};
