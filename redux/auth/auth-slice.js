import { createSlice } from '@reduxjs/toolkit'
import * as operations from './auth-operations'
const initialState = {
    user: {
        id: null,
        login: null,
        email: null
    },
    error: null,
    loading: false,
    stateChange: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers:{
        [operations.signUp.pending]: (state)=> {
            state.loading = true;
            state.error = null;
        },
        [operations.signUp.fulfilled]: ((state, {payload}) => {
            state.loading = false;
            state.user.id = payload.uid;
            state.user.login =  payload.displayName;
            state.user.email = payload.email
        }),
        [operations.signUp.rejected]: ((state, {payload}) => {
            state.loading = false;
            state.error = payload;
        }),
        [operations.signIn.pending]: (state)=> {
            state.loading = true;
            state.error = null;
        },
        [operations.signIn.fulfilled]: ((state, {payload}) => {
            state.loading = false;
            state.user.id = payload.uid;
            state.user.login =  payload.displayName;
            state.user.email = payload.email
        }),
        [operations.signIn.rejected]: ((state, {payload}) => {
            state.loading = false;
            state.error = payload;
        }),
        [operations.stateChangeUser.pending]: (state)=> {
            state.loading = true;
            state.error = null;
        },
        [operations.stateChangeUser.fulfilled]: ((state, {payload}) => {
            state.loading = false;
            state.user.id = payload.user.uid;
            state.user.login =  payload.user.displayName;
            state.user.email = payload.user.email;
            state.stateChange = payload.stateChange
        }),
        [operations.stateChangeUser.rejected]: ((state, {payload}) => {
            state.loading = false;
            state.error = payload;
        }),
        [operations.signOutUser.pending]: (state => {
            state.loading = true;
            state.error = null;
        }),
        [operations.signOutUser.fulfilled]: (state => initialState),
        [operations.signOutUser.rejected]: ((state, {payload}) => {
            state.loading = false;
            state.error = payload;
        })

    }
})




