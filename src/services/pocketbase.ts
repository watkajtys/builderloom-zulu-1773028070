import PocketBase from 'pocketbase';

// Use window.location.hostname for browser context, fallback to localhost for tests
const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.protocol}//${window.location.hostname}:8090`;
    }
    return 'http://loom-pocketbase:8090'; // Docker network default
};

export const pb = new PocketBase(getApiUrl());
