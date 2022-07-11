import { createAsyncThunk } from '@reduxjs/toolkit'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";

import { auth } from '../../firebase/firebase-config'

export const signUp = createAsyncThunk(
    "auth/signUp",
    async ({ login, email, password }, { rejectWithValue }) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(auth.currentUser, { displayName: login })
            const user = auth.currentUser;
            return user;
        } catch (error) {
            return rejectWithValue(error);
        }
    })


export const signIn = createAsyncThunk(
    "auth/signIn",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password)
            return user;
        } catch (error) {
            return rejectWithValue(error)
        }
    })


export const signOutUser = createAsyncThunk(
    "auth/signOutUser",
    async(_, { rejectWithValue }) => {
        try {
            signOut(auth)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)



export const stateChangeUser = createAsyncThunk("auth/stateChangeUser", async (data, { rejectWithValue, }) => {
    try {
        const user = await auth.currentUser;
        return {user, stateChange: true}
    } catch (error) {
        return rejectWithValue(error)
    }
})