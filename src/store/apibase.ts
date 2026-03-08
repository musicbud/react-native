import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import { RootState } from './index';

// Determine Base URL based on environment/platform per ADR 001
export const getBaseUrl = () => {
    // If we're on device/emulator, localhost points to the device itself.
    // We need to point to the host machine for Android: 10.0.2.2
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
};

const baseQuery = fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
        // Use token from Redux state only to ensure deterministic headers.
        // Hydration is handled at the root layout level.
        const token = (getState() as RootState).auth?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        console.warn('Unauthorized. Token might be expired. Emitting logout action.');
        // Currently assuming we just force a logout until refresh token logic is mandated.
        api.dispatch({ type: 'auth/logout' });
    }
    return result;
};

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});
