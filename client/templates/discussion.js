Discuss = Ultimate.Component.createClass({
	//infiniteScroll: ['.task-list', 10, '.queue-container'],

	subscriptions: [
		{model: 'Topic', limit: 10},
		{model: 'Topic', with: 'posts', params: 'slug'},
	],
	
	
	autoruns: [
		function() {
			let topic = this.params('slug') && Topic.findOne({slug: this.params('slug')});
			if(topic) this.set('activeTopicId', topic._id);
			else this.set('activeTopicId', null);
		}
	],
	
	sidebarWidth: function() {
		let windowWidth = Session.get('windowWidth');
		return (windowWidth * .75) - 70;
	},
	contentWidth: function() {
		let windowWidth = Session.get('windowWidth');
		return windowWidth * .25;
	},
	topics: function() {
		return Topic.find();
	},
	activeTopic: function() {
		return this.model()._id == this.get('activeTopicId') && 'active';
	},

	
	'click .sidebar-row': function() {
		this.go('DiscussTopic', {slug: this.model().slug});
	},
	
	
	isSelectedTopicAvailable: function() {
		return this.get('activeTopicId') && Topic.find(this.get('activeTopicId')).count() && this.ready(1);
	},
	selectedTopicAsCursor: function() {
		let c = this.get('activeTopicId') && Topic.find(this.get('activeTopicId'));
		return c;
	},
	
	
	activeKind: function() {
		return this.props('title') == this.get('activeKind') && 'active';
	},
	'click ul.kind-sidebar li': function() {
		this.set('activeKind', this.props('title'));
	}
});


var renderDelay = -150,
	renderTimer = null;

TopicRow = Ultimate.createComponentModel({
	onRendered: function() {
		renderDelay += 250;
		var node = this.component().firstNode();
		
		this.setTimeout(function() {
			this.clearTimeout(renderTimer);
			$(node).show().velocity('transition.slideRightBigIn');
			
			renderTimer = this.setTimeout(function() {
				renderDelay = 0;
			}, 300);		
		}, renderDelay);
	}
});


TopicSlider = Ultimate.createComponentModel({
	'animateOnChildInsertAndRendered .topic-slider': [{translateZ: 0, opacity: [1, .4], translateX: [0, 'easeInOutQuart', $(window).width()]}, {duration: 1000, complete: function(el) {
		$(el).css('transform', ''); //translateZ needs to be removed so the element is immediately scrollable again
	}}],
	'animateOnChildRemoved .topic-slider': [{translateZ: 0, opacity: [0, 1], translateX: [$(window).width()*-1, 'easeInOutQuart', 0]}, {duration: 1000}],
});