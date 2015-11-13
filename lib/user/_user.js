class User extends Ultimate.User {
	get avatar() {
		return 'https://avatars.githubusercontent.com/'+this.usernameFromService('github');
	}
	hasBookmarkedMethod(methodId) {
		return Bookmark.find({method_id: methodId, user_id: this._id}).count();
	}
	relations() {
		return {
			bookmarks: {
				relation: 'has_many',
				model: 'Bookmark',
				foreign_key: 'user_id'
			}
		}
	}
}