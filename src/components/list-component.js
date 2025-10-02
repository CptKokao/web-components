import appConstants from '../common/constants';
import { goTo } from '../router';
import { randomColor, invertColor, getUserInitials, highlightText } from '../common/utils';
import { setPost } from '../service/posts';
import { setUser } from '../service/users';
import { setComment } from '../service/comments';
import { getPosts, getPostsByUser, getPostsSearch } from '../api/postsApi';
import { getUsers, getUsersSearch } from '../api/usersApi';
import { getCommentsSearch, getCommentsByPost, getCommentsByUser } from '../api/commentsApi';

class ListComponent extends HTMLElement {
	constructor() {
		super();
		this.search = '';
		this.page = 1;
		this.lastPage = false;
		this.listType = appConstants.list.types.post;
		console.log(this.listType);
		const shadow = this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'list-block');

		const title = document.createElement('h2');
		title.setAttribute('class', 'list-title');
		shadow.appendChild(title);

		//pagination
		const pagination = document.createElement('pagination-component');
		pagination.setAttribute('class', 'list-pagination');
		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		pagination.addEventListener('paginate-back', (e) => {
			e.stopPropagation();
			if (this.page > 1) {
				this.page = this.page - 1;
				if (this.listType === appConstants.list.types.post) {
					this.getPostsPage();
				}
				if (this.listType === appConstants.list.types.user) {
					this.getUsersPage();
				}
				if (this.listType === appConstants.list.types.comments) {
					this.getCommentsPage();
				}
			}
		});

		pagination.addEventListener('paginate-next', (e) => {
			e.stopPropagation();
			if (!this.lastPage) {
				this.page = this.page + 1;
				if (this.listType === appConstants.list.types.post) {
					this.getPostsPage();
				}
				if (this.listType === appConstants.list.types.user) {
					this.getUsersPage();
				}
				if (this.listType === appConstants.list.types.comments) {
					this.getCommentsPage();
				}
			}
		});

		shadow.appendChild(pagination);

		const style = document.createElement('style');

		style.textContent = `
           
           .list-block{
               display: flex;
               align-items: flex-start;
               justify-content: center;
               flex-wrap: wrap;
               padding: 5px;
           }

           .list-title{
               text-align: center;
           }

           .list-pagination{
            display: flex;
            justify-content: center;
           }

        `;

		shadow.appendChild(style);
		shadow.appendChild(wrapper);
	}

	updateComponent() {
		const search = this.getAttribute('search');
		const listType = this.getAttribute('list-type');

		if (search) {
			this.search = search;
		}
		if (listType) {
			this.listType = listType;
		}

		if (listType === appConstants.list.types.post) {
			this.getPostsPage();
		}

		if (listType === appConstants.list.types.user) {
			this.getUsersPage();
		}

		if (listType === appConstants.list.types.comments) {
			this.getCommentsPage();
		}
	}

	connectedCallback() {
		this.updateComponent();
	}

	static get observedAttributes() {
		return ['search', 'list-type'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'search') {
			this.search = newValue;
			this.updateComponent();
		}
	}

	getPostsPage() {
		const shadow = this.shadowRoot;
		const userId = this.getAttribute('user');
		const wrapper = shadow.querySelector('.list-block');
		const pagination = shadow.querySelector('pagination-component');

		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		const title = shadow.querySelector('.list-title');
		title.textContent = 'All posts';

		if (userId) {
			title.textContent = "Users' posts";
		}

		const apiCall = this.search
			? getPostsSearch(this.search, this.page)
			: userId
			? getPostsByUser(userId, this.page)
			: getPosts(this.page);

		apiCall
			.then((posts) => {
				this.lastPage = posts.length < 10;
				const count = posts.length;
				pagination.setAttribute('last', this.lastPage);
				wrapper.innerHTML = '';
				posts.forEach((post) => {
					setPost(post);
					const postElement = document.createElement('post-component');
					postElement.setAttribute('id', post.id);
					if (this.search) {
						postElement.setAttribute('search', this.search);
					}
					wrapper.appendChild(postElement);
				});
				if (count === 0 && this.page === 1) {
					//no data
					wrapper.innerHTML = '<h3>No posts yet</h3>';
				}
			})
			.catch((error) => console.log(error));
	}

	getUsersPage() {
		const shadow = this.shadowRoot;
		const wrapper = shadow.querySelector('.list-block');
		const pagination = shadow.querySelector('pagination-component');

		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		const title = shadow.querySelector('.list-title');
		title.textContent = 'All users';

		const apiCall = this.search ? getUsersSearch(this.search, this.page) : getUsers(this.page);

		apiCall
			.then((users) => {
				this.lastPage = users.length < 10;
				users.forEach((post) => {
					setUser(post);
					const listElement = document.createElement('user-component');
					listElement.setAttribute('id', post.id);
					if (this.search) {
						listElement.setAttribute('search', this.search);
					}
					wrapper.appendChild(listElement);
				});
			})
			.catch((error) => console.log(error));
	}

	getCommentsPage() {
		const shadow = this.shadowRoot;
		const userId = this.getAttribute('user');
		const postId = this.getAttribute('post');
		const wrapper = shadow.querySelector('.list-block');
		const pagination = shadow.querySelector('pagination-component');
		const title = shadow.querySelector('.list-title');

		title.textContent = 'All comments';
		if (userId) {
			title.textContent = "User's comments";
		}
		if (postId) {
			title.textContent = "Post's comments";
		}

		pagination.setAttribute('page', this.page);
		pagination.setAttribute('last', this.lastPage);

		const apiCall = this.search
			? getCommentsSearch(this.search, this.page)
			: userId
			? getCommentsByUser(userId, this.page)
			: postId
			? getCommentsByPost(postId, this.page)
			: null;

		if (apiCall) {
			apiCall
				.then((comments) => {
					const count = comments.length;
					this.lastPage = count < 10;
					pagination.setAttribute('last', this.lastPage);
					wrapper.innerHTML = '';
					console.log(comments);
					comments.forEach((comment) => {
						setComment(comment);
						const commentElement = document.createElement('comment-component');
						commentElement.setAttribute('id', comment.id);
						if (this.search) {
							commentElement.setAttribute('search', this.search);
						}
						if (userId) {
							commentElement.setAttribute('post-btn', 'true');
						}
						wrapper.appendChild(commentElement);
					});
					if (count === 0 && this.page === 1) {
						//no data
						wrapper.innerHTML = '<h3>No comments yet</h3>';
					}
				})
				.catch((error) => console.log(error));
		}
	}
}

customElements.define('list-component', ListComponent);
