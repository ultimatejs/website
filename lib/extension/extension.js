class Dog extends Ultimate.Model {
	onTest() {
		console.log(123)
		return 'sex'
	}
	yoyo() {
		return 77;
	}
	relations() {
		return {
			dogs: {
				relation: 'has_many',
				model: 'Topic',
				foreign_key: 'extension_id'
			},
			classes: {
				relation: 'has_many',
				model: 'Class',
				foreign_key: 'extension_id'
			}
		};
	}
}


class Bla extends Ultimate.Model {
	onTest() {
		console.log('test')
	}
	dobla() {
		return 'bla';
	}
	relations() {
		return {
			dogs: {
				relation: 'has_many',
				model: 'Post',
				foreign_key: 'extension_id'
			}
		};
	}
}

class Extension extends Bla {
	mixins() {
		return ['Dog']
	}
	collectionName() {
		return 'Extensions';
	}
	tableName() {
		return 'extensions';
	}
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
		};
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
			},
			bla: {
				keys: ['github_url']
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

Extension.extend({
	dog: function() {
		return 23;
	}
})