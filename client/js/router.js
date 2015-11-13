Ultimate('ClientRouter').extends(UltimateRouter, {
	layoutTemplate: 'layout', 
	simpleRoutes: [],
	/**
	onBeforeAction: function() {
		if(!Meteor.userId() && this._layout._template != 'public_layout') {
			this.redirect('home');
		}
		else this.next();
	},
	**/
	
	home: {
		path: '/'
  },
	'docs/:extension_slug/:class_slug': {
		name: 'DocsExtensionClass',
		template: 'Docs'
	},
	'docs/:extension_slug': {
		name: 'DocsExtension',
		template: 'Docs'
	},
	'docs': {},
	extensions: {},
	
	'discuss/:slug': {
		name: 'DiscussTopic',
		template: 'Discuss'
	},
	'discuss': {}
});