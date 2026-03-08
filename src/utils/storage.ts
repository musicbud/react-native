import { Platform } from 'react-native';
import { createMMKV, MMKV } from 'react-native-mmkv';

const isWeb = Platform.OS === 'web';
const isBrowser = typeof window !== 'undefined';

export const storage: MMKV | null =
    (!isWeb || isBrowser) ?
        createMMKV({
            id: 'musicbud-storage',
            ...(Platform.OS !== 'web' && { encryptionKey: 'musicbud-secure-key' }) // Optional, but good for auth tokens
        })
        : null;

/**
 * Persists a string value to local storage.
 * @param key Storage key
 * @param value String value
 */
export const setString = (key: string, value: string) => {
    storage?.set(key, value);
};

/**
 * Retrieves a string from local storage.
 * @param key Storage key
 * @returns String value or null if not found
 */
export const getString = (key: string): string | null => {
    if (!storage) return null;
    const value = storage.getString(key);
    return value !== undefined ? value : null;
};

/**
 * Persists a boolean value to local storage.
 * @param key Storage key
 * @param value Boolean value
 */
export const setBoolean = (key: string, value: boolean) => {
    storage?.set(key, value);
};

/**
 * Retrieves a boolean from local storage.
 * @param key Storage key
 * @returns Boolean value or null if not found
 */
export const getBoolean = (key: string): boolean | null => {
    if (!storage) return null;
    const value = storage.getBoolean(key);
    return value !== undefined ? value : null;
};

/**
 * Persists a JSON object to local storage.
 * @param key Storage key
 * @param value Object value
 */
export const setObject = (key: string, value: object) => {
    storage?.set(key, JSON.stringify(value));
};

/**
 * Retrieves a JSON object from local storage.
 * @param key Storage key
 * @returns Parsed object or null if not found
 */
export const getObject = <T>(key: string): T | null => {
    if (!storage) return null;
    const value = storage.getString(key);
    if (value) {
        try {
            return JSON.parse(value) as T;
        } catch (e) {
            console.error(`Error parsing storage string for key ${key}:`, e);
            return null;
        }
    }
    return null;
};

/**
 * Removes a specific key from local storage.
 * @param key Storage key
 */
export const removeKey = (key: string) => {
    storage?.remove(key);
};

/**
 * Clears all values in the storage instance.
 */
export const clearStorage = () => {
    storage?.clearAll();
};
