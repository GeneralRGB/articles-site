import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts');
	return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
	const { data } = await axios.get('/tags');
	return data;
});

const initialState = {
	posts: {
		items: [],
		status: 'initialized',
	},
	tags: {
		items: [],
		status: 'initialized',
	},
};

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducer: {},
	extraReducers: {
		[fetchPosts.pending]: (state) => {
			state.posts.status = 'pending';
		},
		[fetchPosts.fulfilled]: (state, actions) => {
			state.posts.items = actions.payload;
			state.posts.status = 'fulfilled';
		},
		[fetchPosts.rejected]: (state, actions) => {
			state.posts.items = [];
			state.posts.status = 'rejected';
		},
		[fetchTags.pending]: (state) => {
			state.tags.status = 'pending';
		},
		[fetchTags.fulfilled]: (state, actions) => {
			state.tags.items = actions.payload;
			state.tags.status = 'fulfilled';
		},
		[fetchTags.rejected]: (state, actions) => {
			state.tags.items = [];
			state.tags.status = 'rejected';
		},
	},
});

export const postsReducer = postsSlice.reducer;
