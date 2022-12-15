import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
	const { data } = await axios.post('/auth/login', params);
	return data;
});

export const fetchAuthMe = createAsyncThunk(
	'auth/fetchAuthMe',
	async (params) => {
		const { data } = await axios.get('/profile');
		return data;
	}
);

const initialState = {
	data: null,
	status: 'initialized',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.data = null;
		},
	},
	extraReducers: {
		// Fetching posts
		[fetchAuth.pending]: (state) => {
			state.data = null;
			state.status = 'pending';
		},
		[fetchAuth.fulfilled]: (state, actions) => {
			state.data = actions.payload;
			state.status = 'fulfilled';
		},
		[fetchAuth.rejected]: (state) => {
			state.data = null;
			state.status = 'rejected';
		},
		[fetchAuthMe.pending]: (state) => {
			state.data = null;
			state.status = 'pending';
		},
		[fetchAuthMe.fulfilled]: (state, actions) => {
			state.data = actions.payload;
			state.status = 'fulfilled';
		},
		[fetchAuthMe.rejected]: (state) => {
			state.data = null;
			state.status = 'rejected';
		},
	},
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
