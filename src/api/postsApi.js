import baseApi from './baseApi';

export const getPosts = (page) => baseApi.get(`/posts?_page=${page}&limit=10&_expand=user`);

export const getPostsByUser = (userId, page) =>
	baseApi.get(`/posts?userId=${userId}&_page=${page}&limit=10&_expand=user`);

export const getPostsById = (postId) => baseApi.get(`/posts/postId=${postId}?_expand=user`);

export const getPostsSearch = (search, page) => baseApi.get(`/posts?q=${search}&_page=${page}&limit=10&_expand=user`);

export default {
	getPosts,
	getPostsByUser,
	getPostsById,
	getPostsSearch,
};
