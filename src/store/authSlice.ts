import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getString, setString, removeKey } from '../utils/storage';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialToken = getString('userToken');

const initialState: AuthState = {
    token: initialToken,
    isAuthenticated: !!initialToken,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ token: string }>
        ) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            setString('userToken', action.payload.token);
        },
        hydrate: (state, action: PayloadAction<{ token: string | null }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = !!action.payload.token;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            removeKey('userToken');
        },
    },
});

export const { setCredentials, hydrate, logout } = authSlice.actions;
export default authSlice.reducer;
