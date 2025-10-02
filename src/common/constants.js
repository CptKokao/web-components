const appConstants = {
	routes: {
		index: '/',
		posts: '/posts',
		postsSearch: '/posts/query/:query',
		users: '/users',
		usersSearch: '/users/query/:query',
		post: '/post/:post',
		user: '/user/:user',
		userPosts: '/user/:user/posts',
		userComments: '/user/:user/comments',
	},
	search: {
		types: {
			post: 'post',
			user: 'user',
		},
	},
	list: {
		types: {
			post: 'post',
			user: 'user',
			comments: 'comment',
		},
	},
};

export default appConstants;
