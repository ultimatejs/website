class Post extends Ultimate.Model {
	get avatar() {
		return 'https://avatars.githubusercontent.com/'+this.username;
	}
	
	static create(content, topicId) {
		return new Post({
			content: content,
			user_id: Meteor.userId(), 
			topic_id: topicId,
			username: Meteor.user().usernameFromService('github')
		}).save();
	}
}