Ultimate('navbar').extends(UltimateComponent, {
	'click nav .newsletter-signup': function(e) {
		new UltimatePrompt('create_agent', agent).show();
	},
	
	
	'click nav .make_sale': function(e) {
		new UltimatePrompt('make_sale', new Sale, {
			title: 'Make Sale To Braintree',
			template: 'braintree_sample_code',
			columnLayout: true
		}).show();
	},


	'click .create-extension': function() {
		new UltimatePrompt('create_extension', new Extension, {
			title: 'Create/Update Extension',
			description: "Adding an Ultimate Extension is as simple as adding an Atmosphere package you already made, and documenting its Classes, Methods and Properites in JSDOC style. The only difference is your package should be composed of Ultimate style classes, extending from at the very least Ultimate.Class."
		}).show();
	},


	'click .logout': function() {
		Meteor.user().set('online', false);
		Meteor.logout();
	}
});
