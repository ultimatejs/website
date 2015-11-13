Thread = Ultimate.Component.createClass({
	onRendered: function() {
		this.set('activePostId', this.model().posts().last()._id);
	},
	
	isExpanded: function() {
		return this.component().contains('expandedPostIds', this.model()._id);
	},
	activePost: function() {
		return this.get('activePostId') == this.model()._id ? 'active' : '';
	},
	
	
	'click .message-subject, click .message-body': function() {
		if(this.contains('expandedPostIds', this.model()._id)) this.without('expandedPostIds', this.model()._id);
		else this.push('expandedPostIds', this.model()._id);
			
		if(this.model()._id == this.get('activePostId')) this.set('activePostId', null);
		else this.set('activePostId', this.model()._id);
	},
	

	'click .glyphicon-minus': function() {
		this.set('expandedPostIds', []);
	},
	'click .glyphicon-align-justify': function() {
		this.set('expandedPostIds', Posts.find().fetchIds());
	},
	'click .support-messages a.reply': function() {
		if(!Meteor.user()) Meteor.loginWithGithub(() => this.postReply());
		else this.postReply();
	},
	postReply: function() {
		var content = $('.reply-box').val();
		if(_.isEmpty(content)) return alert('You forgot to provide a response.');
		
		$('.reply-box').val('');
		this.model().addPost(content);
		
		this.setTimeout(function() {
			$('.message-subject:last').click(); //expand the new message
		}, 30);
	}
});