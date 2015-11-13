class Class extends Ultimate.Model {
	sluggify() {
		return 'name';
	}
	methodsByType(key, val) {
		return this.methods({[key]: val});
	}
	isMethodsByType() {
		return this.methodsByType(...arguments).count();
	}
	isContentOnlyClass() {
		return !(this.isMethodsByType('scope', 'instance') || this.isMethodsByType('scope', 'static'));
	}
	
	relations() {
		return {
			extension: {
				relation: 'belongs_to',
				model: 'Extension',
				foreign_key: 'extension_id'
			},
			methods: {
				relation: 'has_many',
				model: 'Method',
				foreign_key: 'class_id'
			}
		}
	}
	
	go() {
		Router.go('DocsExtensionClass', {extension_slug: this.extension().slug, class_slug: this.slug});
	}
	prev() {
		let classes = this.class.find().fetch(),
		index = _.findIndex(classes, (c) => c._id == this._id);
		
		return classes[index - 1];
	}
	next() {
		let classes = this.class.find().fetch(),
		index = _.findIndex(classes, (c) => c._id == this._id);
		
		return classes[index + 1];
	}
	orderedTocMethods(one) {
		let methods = this.methodsByType('overview', true).fetch()
				.concat(this.methodsByType('scope', 'instance').fetch())
				.concat(this.methodsByType('scope', 'static').fetch());
				
		return one ? methods[0] : methods;
	}
	static active() {
		return this.findOne(Session.get('activeClassId'));
	}
}