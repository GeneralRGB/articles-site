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

export const fetchRemovePost = createAsyncThunk(
	'posts/fetchRemovePost',
	async (id) => {
		const { data } = await axios.delete(`/posts/${id}`);
		return data;
	}
);

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
		// Fetching posts
		[fetchPosts.pending]: (state) => {
			state.posts.status = 'pending';
		},
		[fetchPosts.fulfilled]: (state, actions) => {
			state.posts.items = actions.payload;
			state.posts.status = 'fulfilled';
		},
		[fetchPosts.rejected]: (state) => {
			state.posts.items = [];
			state.posts.status = 'rejected';
		},

		// Fetching tags
		[fetchTags.pending]: (state) => {
			state.tags.status = 'pending';
		},
		[fetchTags.fulfilled]: (state, actions) => {
			state.tags.items = actions.payload;
			state.tags.status = 'fulfilled';
		},
		[fetchTags.rejected]: (state) => {
			state.tags.items = [];
			state.tags.status = 'rejected';
		},

		// Removing post
		[fetchRemovePost.pending]: (state, { meta }) => {
			state.posts.items = state.posts.items.filter((el) => el._id !== meta.arg);
		},
	},
});

export const postsReducer = postsSlice.reducer;
