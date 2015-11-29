Docs = Ultimate.ComponentModel.createClass({

	infiniteScroll: ['.task-list', 10, '.queue-container'],
	
	subscriptions: [
		{model: 'Extension', name: 'all', with: 'classes'},
		function() { return this.subscribeToMethods(); },
		{model: 'Bookmark', with: 'method', name: 'every'}
	],
	
	subscribeToMethods: function() {
		if(!Class.find().count()) return;
		
		let {extension_slug, class_slug} = this.params(),
			klass;

		//user entered on URL not tied to specific class & we need to pick an class+extension for them
		if(!class_slug) { 
			if(!extension_slug) klass = Extensions.findOne().one().classes();
			else if(!class_slug) klass = Extensions.findOne({slug: extension_slug}).one().classes();
			
			//send the user back to this autorun subscription method, but armed with both slugs ;)
			return this.go('DocsExtensionClass', {extension_slug: klass.extension().slug, class_slug: klass.slug});
		}	
		else {
			let classes = Class.find({slug: class_slug}).fetch()
			
			if(classes.length === 0) return;	
			else if(classes.length > 1) {
				klass = _.find(classes, (c) => {
					let extensions = Extension.find({slug: extension_slug}).fetch();
					return _.find(extensions, (e) => e._id == c.extension_id);
				});
			}
			else klass = classes[0];
		}
	
		Session.set('activeExtensionId', klass.extension_id);
		Session.set('activeClassId', klass._id);
		
		return Method.subscribe('all', {class_id: klass._id});
	},
	onReady: function() {
		this.setTimeout(() => Session.set('entranceComplete', true), 1600);
	},
	
	extensions: function() {
		return Extensions.find();
	},
	activeExtension: function() {
		return this._id == Session.get('activeExtensionId') && 'active';
	},
	showClass: function() {
		if(!Session.get('entranceComplete')) return;
		return this.extension_id == Session.get('activeExtensionId') && 'expanded-class';
	},
	activeClass: function() {
		return this._id == Session.get('activeClassId') && 'active';
	},
	
	'click .select-extension': function() {
		this.component().go('DocsExtensionClass', {extension_slug: this.slug, class_slug: this.one().classes().slug});
	},
	'click .select-class': function() {
		this.component().go('DocsExtensionClass', {extension_slug: this.extension().slug, class_slug: this.slug});
	},
	
	
	isSelectedClassAvailable: function() {
		return Session.get('activeClassId') && Class.find(Session.get('activeClassId')).count();
	},
	selectedClassAsCursor: function() {
		return Session.get('activeClassId') && Class.find(Session.get('activeClassId'));
	},
	
	
	highlight: function(code) {
		return hljs.fixMarkup(hljs.highlight('javascript', code, true).value);
	},
	someCode: function() {
		return Ultimate.Model.prototype.getMongoAttributes.toString();
		return "var dog = 123;";
	},
	onStartup: function() {
		hljs.configure({
			useBR: true,
			tabReplace: '<span style="display:inline-block; width: 10px;"></span>'
		});
	}
});

class CommunityExtensions extends Docs {

}


var renderDelay = -150,
	renderTimer = null;

ExtensionRow = Ultimate.createComponentModel({
	onRendered: function() {
		renderDelay += 250;
		var node = this.component().firstNode();
		
		this.setTimeout(function() {
			this.clearTimeout(renderTimer);
			$(node).show().velocity('transition.perspectiveRightIn');
			
			renderTimer = this.setTimeout(function() {
				renderDelay = 0;
			}, 300);
			
		}, renderDelay);
	}
	//'animateOnChildInsertAndRendered .task-list': ['transition.perspectiveRightIn', 500],
	//'animateOnChildRemoved .task-list': ['transition.perspectiveRightOut']
});


ClassSlider = Ultimate.createComponentModel({
	'animateOnChildInsertAndRendered .class-slider': [{translateZ: 0, opacity: [1, .4], translateX: [0, 'easeInOutQuart', $(window).width()]}, {duration: 1000, complete: function(el) {
		$(el).css('transform', ''); //translateZ needs to be removed so the element is immediately scrollable again
	}}],
	'animateOnChildRemoved .class-slider': [{translateZ: 0, opacity: [0, 1], translateX: [$(window).width()*-1, 'easeInOutQuart', 0]}, {duration: 1000}],
});


ProgressBar = Ultimate.createComponentModel({
	onRendered: function() {
		var duration = Session.get('isSearching') ? 5000 : 750;
		$('.progress-bar').velocity({width: ['100%', 'easeOutExpo', '35%']}, {duration: duration});
	},
	onDestroyed: function() {
		$('.progress-bar').css('width', '35%');
	}
});