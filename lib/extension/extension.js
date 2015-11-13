class Extension extends Ultimate.Model {
	sluggify() {
		return 'name';
	}
	firstClassId() {
		return this.one().classes()._id;
	}
	hasMultipleClasses() {
		return this.classes().count() > 1;
	}
	
	subscriptions() {
		return {
			all: {}
		}
	}
	relations() {
		return {
			classes: {
				relation: 'has_many',
				model: 'Class',
				foreign_key: 'extension_id'
			},
			methods: {
				relation: 'has_many',
				model: 'Method',
				foreign_key: 'extension_id'
			}
		}
	}
	
	schema() {
		return {
			name: {
				type: String
			},
			github_url: {
				type: String,
				label: 'Github URL',
				regEx: SimpleSchema.RegEx.Url,
				custom: function() {
					var reg = /github.com\/(.+)\/(.+)/,
						matches = reg.exec(this.github_url);
		
					if(!matches || !matches[2]) return 'invalid github repo url' 
				}
			},
			subtitle: {
				type: String,
				optional: true,
				autoform: {
					placeholder: 'optional'
				}
			}
		}
	}
	
	forms() {
		return {
			create_extension: {
				onSubmit() {
					this.generateDocumentation(function(error, data) {
						if(error) alert('Something went wrong with adding your Package. Please try again; notify us if it continues.');
						else this.done();
					});
				}
			}
		}
	}
	
	get github_path() {
		return this.user_name+'/'+this.repo_name;
	}
	
	go() {
		Router.go('DocsExtension', {extension_slug: this.extension().slug});
	}
	static active() {
		return this.findOne(Session.get('activeExtensionId'));
	}
}