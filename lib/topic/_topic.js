class Topic extends Ultimate.Model {
	onInvalidInsert(userId, doc) {
		console.log('insert One', doc)
		this.testDog = 123;
		return false;
	}
	sluggify() {
		return 'title';
	}
	relations() {
		return {
			posts: {
				relation: 'has_many',
				model: 'Post',
				foreign_key: 'topic_id'
			}
		};
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