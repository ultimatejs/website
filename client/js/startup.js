Startup = UltimateStartup.createClass({
	subscriptions: ['self'],
	windowResize: function() {
		Session.set('windowWidth', $(window).width());
		Session.set('windowHeight', $(window).height());
		
		$(window).on('resize', function() {
			Session.set('windowWidth', $(window).width());
			Session.set('windowHeight', $(window).height());
		});
		
		Template.registerHelper('windowWidth', function(subtractValue) {
			return Session.get('windowWidth') - (subtractValue || 0);
		});
		
		Template.registerHelper('windowHeight', function(subtractValue) {
			return Session.get('windowHeight') - (subtractValue || 0);
		});
		
		Template.registerHelper('activeRoute', function(route) {
			return Router.current().route.getName().indexOf(route) === 0 && 'active';	
		});
	},
	miscHelpers: function() {
		Template.registerHelper('isEqual', function(a, b) {
			return _.isEqual(a, b);
		});
	},
	marked: function() {
		marked.setOptions({
		  renderer: new marked.Renderer(),
		  gfm: true,
		  tables: true,
		  breaks: false,
		  pedantic: false,
		  sanitize: true,
		  smartLists: true,
		  smartypants: false,
			highlight: function (code) { return hljs.highlightAuto(code).value; }
		});
	},
	momentFromNow: function() {
		moment.locale('en', {
		    relativeTime : {
		        future: "in %s",
		        past:   "%s ago",
		        s:  "%ds",
		        m:  "%dm",
		        mm: "%dm",
		        h:  "%dh",
		        hh: "%dh",
		        d:  "%dd",
		        dd: "%dd",
		        M:  "%dm",
		        MM: "%dm",
		        y:  "%dy",
		        yy: "%dy"
		    }
		});
		
		
		this.setInterval(function() {
			Session.set('momentUpdate', new Date);
		}, 5000);
		
		Template.registerHelper('fromNow', function(date) {
			Session.get('momentUpdate');
			return moment(date).fromNow(true);
		});
	}
});