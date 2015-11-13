class Method extends Ultimate.Model {
	tocName() {
		if(this.overview) return Utilities.cleanMarkdown(this.name);
		else {
			let name = this.new ? 'new '+this.memberof.replace('Ultimate.', '') : this.name;
			return this.config_property ? name : name+'()';
		}
	}
	get title() {
		return this.overview ? Utilities.cleanMarkdown(this.name.capitalizeFirstLetter()) : 'Usage';
	}
	get hash() {
		return this.tocName().toLowerCase().replace(/ /g, '-').replace(/#|\?|\(\)/g, '');
	}
	static findByHash(hash) {
		hash = this.cleanHash(hash);
		return _.find(this.find().fetch(), (meth) => meth.hash == hash);
	}
	static cleanHash(hash) {
		return hash.replace(/#|\?||\(\)/g, '');
	}
	
	get kind() {
		let kind = this.config_property ? 'Property' : 'Method';
		return this.scope == 'static' ? 'Static '+kind : kind;
	}
	get return_type() {
		return this.return_types ? this.return_types.join(', ') : '';
	}
	paramTypes(types) {
		return types.join(', ');
	}
	paramDescription(description) {
		return description.replace('<p>', '').replace('</p>', '');
	}
	signature() {
    let signature = this.new ? 'new '+this.memberof.replace('Ultimate.', '') : this.name;

    if(!this.config_property) {
      let paramNames = _.map(this.params, p => p.optional ? `[${p.name}]` : p.name);
      signature += "(" + paramNames.join(", ") + ")";
    }
		
    return signature;
  }
	
	
	subscriptions() {
		return {
			all: {}
		}
	}
	relations() {
		return {
			klass: {
				relation: 'belongs_to',
				model: 'Class',
				foreign_key: 'class_id'
			},
			extension: {
				relation: 'belongs_to',
				model: 'Extension',
				foreign_key: 'extension_id'
			}
		}
	}
	
	go() {
		this.setTimeout(function() {
			Router.go('DocsExtensionClass', {
				extension_slug: this.extension().slug, 
				class_slug: this.klass().slug}, 
				{hash: this.hash}
			);
		}, 20);
	}
	prev() {
		let methods = this.siblings(),
			index = this.index(methods);
		
		return methods[index - 1];
	}
	next() {
		let methods = this.siblings(),
			index = this.index(methods);
		
		return methods[index + 1];
	}
	siblings() {
		return this.klass().orderedTocMethods();
	}
	index(methods) {
		methods = methods || this.siblings();
		return _.findIndex(methods, (m) => m._id == this._id);
	}
	static active() {
		return this.findOne(Session.get('activeMethodId'));
	}
}