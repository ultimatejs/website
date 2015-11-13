class Topic extends Ultimate.Model {
	sluggify() {
		return 'title';
	}
	schema() {
		return {
			title: {
	  		type: String,
	  	},
			content: {
	  		type: String,
	  	},
		};
	}
	forms() {
		return {
			new_topic: {
				onSubmit() {
					this.createSelf();
				}
			}
		}
	}
	
	createSelf() {
		this.addPost(this.content, this._id);
		delete this.content;
		
		this.user_id = Meteor.userId();
		this.username = Meteor.user().usernameFromService('github');
		this.save();
	}
	addPost(content) {
		return Post.create(content, this._id);
	}
}