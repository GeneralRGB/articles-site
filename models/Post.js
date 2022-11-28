import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
		},
		text: {
			type: String,
			required: true,
			unique: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		viewsCount: {
			type: Number,
			required: true,
			default: 0,
		},
		tags: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);

export default mongoose.model('Post', PostSchema);
