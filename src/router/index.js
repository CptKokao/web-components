import appConstants from '../common/constants';
import Route from 'route-parser';

import MainPage from '../pages/main.template';
import PostsPage from '../pages/posts.template';
import UsersPage from '../pages/users.template';

export const routers = {
	Main: new Route(appConstants.routes.index),
	Posts: new Route(appConstants.routes.posts),
	Users: new Route(appConstants.routes.users),
};

export const render = (path) => {
	let result = '<h1>404</h1>';

	if (routers.Main.match(path)) {
		result = MainPage();
	} else if (routers.Posts.match(path)) {
		result = PostsPage();
	} else if (routers.Users.match(path)) {
		result = UsersPage();
	}

	document.querySelector('#app').innerHTML = result;
};

export const goTo = (path) => {
	window.history.pushState({ path }, path, path);
	render(path);
};

const initRouter = () => {
	// window.addEventListener('popstate', () => {
	// 	console.log('popstate');
	// 	render(new URL(window.location.href).pathname);
	// });

	// document.querySelectorAll('[href^="/"]').forEach((e) => {
	// 	e.preventDefault();
	// 	console.log('href');

	// 	const { pathname: path } = new URL(e.target.href);
	// 	goTo(path);
	// });

	render(new URL(window.location.href).pathname);
};

export default initRouter;
