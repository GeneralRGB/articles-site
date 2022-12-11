import PostSchema from '../models/Post.js';

export const create = async (req, res) => {
	try {
		const doc = new PostSchema({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			author: req.userId,
		});
		const post = await doc.save();

		res.status(201).json(post);
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: 'Server error!!!',
		});
	}
};

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostSchema.find().limit(5);
		const tags = posts
			.map((post) => post.tags)
			.flat()
			.slice(0, 5)
			.filter((post, index, self) => self.indexOf(post) === index);
		return res.status(200).json(tags);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Server error!!!' });
	}
};

export const getAll = async (req, res) => {
	try {
		const post = await PostSchema.find().populate('author');
		return res.status(200).json(post);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Server error!!!' });
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await PostSchema.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: 'after' }
			// (err, doc) => {
			// 	if (err) res.status(500).message("Couldn't get document");
			// 	if (!doc) res.status(404).message("Couldn't find document");
			// 	res.status(200).json(doc);
			// }
		);
		return res.status(200).json(doc);
	} catch (err) {
		return console.log(err);
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;
		const doc = await PostSchema.findOneAndRemove(
			{ _id: postId }
			// 	, (err, doc) => {
			// 	if (err) {
			// 		console.log(err);
			// 		return res.status(500).json({ message: 'Error while deleting' });
			// 	}
			// 	if (!doc) return res.status(404).json({ message: 'Post not found' });
			// 	return res.status(200).json({ message: 'success' });
			// }
		);
		if (!doc) return res.status(404).json({ message: 'Post not found' });
		return res.status(200).json({ doc, message: 'success' });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: 'Error while deleting' });
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;
		await PostSchema.updateOne(
			{ _id: postId },
			{
				title: req.body.title,
				text: req.body.text,
				imgUrl: req.body.imgUrl,
				author: req.body.author,
				tags: req.body.tags,
			}
		);
		return res.status(200).json({ status: 'success' });
	} catch (err) {
		return res.status(500);
	}
};
