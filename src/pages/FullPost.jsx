import React from 'react';
import { useParams } from 'react-router-dom';

import axios from '../axios';
import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import { API_URL } from '../axios';

export const FullPost = () => {
	const [data, setData] = React.useState();
	const [isLoading, setIsLoading] = React.useState(true);
	const { id } = useParams();

	React.useEffect(() => {
		axios
			.get(`/posts/${id}`)
			.then((res) => {
				setData(res.data);
				setIsLoading(false);
			})
			.catch((err) => {
				console.warn(err);
				alert('error');
			});
	}, [id]);

	if (isLoading) {
		return <Post isLoading={true} isFullPost />;
	}
	console.log(data);
	return (
		<>
			<Post
				id={data._id}
				title={data.title}
				imageUrl={data.imageUrl ? `${API_URL}${data.imageUrl}` : ''}
				// imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
				user={data.author}
				createdAt={data.createdAt}
				viewsCount={data.viewsCount}
				commentsCount={3}
				tags={data.tags}
				isFullPost
			>
				<ReactMarkdown children={data.text} />
			</Post>
			<CommentsBlock
				items={[
					{
						user: {
							fullName: 'Вася Пупкин',
							avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
						},
						text: 'Это тестовый комментарий 555555',
					},
					{
						user: {
							fullName: 'Иван Иванов',
							avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
						},
						text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
					},
				]}
				isLoading={false}
			>
				<Index />
			</CommentsBlock>
		</>
	);
};