import baseApi from './baseApi';

export const getCommentsByPosts = (postId, page) =>
	baseApi.get(`/posts/${postId}/comments?_page=${page}&limit=10&_expand=user&_sort=createAt`);

export const getCommentsByUser = (userId, page) =>
	baseApi.get(`/comments?userId=${userId}&_page=${page}&_expand=user&_expand=post`);

export default {
	getCommentsByPosts,
	getCommentsByUser,
};
