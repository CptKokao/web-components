import baseApi from './baseApi';

export const getCommentsByPost = (postId, page) => {
	return baseApi.get(`/comments?_page=${page}&_limit=10&_embed=user&_sort=createAt`);
};

export const getCommentsByUser = (userId, page) => {
	return baseApi.get(`/comments?userId=${userId}&_page=${page}&_limit=10&_embed=user&_embed=post`);
};

export const getCommentsSearch = (search, page) => {
	return baseApi.get(`/comments?q=${search}&_page=${page}&_limit=10&_embed=user&_embed=post`);
};

export default {
	getCommentsByPost,
	getCommentsByUser,
};
