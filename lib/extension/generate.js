Extension.extendHttp({
	generateDocumentation: function() {
		var reg = /github.com\/(.+)\/(.+)/,
			matches = reg.exec(this.github_url);
		
		this.user_name = matches[1];
		this.repo_name = matches[2];

		var commands = [
			'cd ~',
			'sudo git clone http://github.com/'+this.github_path,
			'cd '+this.repo_name,
			'sudo rm -f jsdoc.json',
			'sudo rm -f jsdoc-conf.json',
			'sudo meteor-jsdoc init',
			'sudo meteor-jsdoc build',
			'cd ~/myproject-docs/client/data',
			'pwd'
		],
			options = {
				combineCommands: true,
				onSuccess: this.bindEnvironment(function() {
					console.log('on SUCCESS');
					try {
						var packageInfo = Npm.require('fs').readFileSync(process.env.HOME+'/'+this.repo_name+'/package.js', 'utf-8');
						this.createExtensionFromPackageInfo(packageInfo);
					}
					catch(e) {
						console.log('ERROR', e, e.stack);
					}
					
					//previously name, subtitle, github_url, repo_name, user_name, etc was provided by user
					this.upsertSave({user_name: this.user_name, repo_name: this.repo_name, user_id: this.meteor().userId});
					
					try {
						var readme = Npm.require('fs').readFileSync(process.env.HOME+'/'+this.repo_name+'/README.md', 'utf-8');
						this.createSectionsFromReadme(readme);
					}
					catch(e) {
						console.log('ERROR', e, e.stack);
					}
						
						
					try {	
						var contents = Npm.require('fs').readFileSync(process.env.HOME+'/myproject-docs/client/data/docs-data.js', 'utf-8');
						this.createMethodsFromJSDOC(eval(contents));
					}
					catch(e) {
						console.log('ERROR', e, e.stack);
					}
					
					
					try {
						Ultimate.Exec.execute('sudo rm -R -f ~/'+this.repo_name);
						Ultimate.Exec.execute('sudo rm -R -f ~/myproject-docs');
					}
					catch(e) {}
				}),
				onFail: function(error) {
					console.log('on FAIL', error)
					
					try {
						Ultimate.Exec.execute('sudo rm -R ~/'+this.repo_name);
						Ultimate.Exec.execute('sudo rm -R ~/myproject-docs');
					}
					catch(e) {}
				}.bind(this)
			};
		
		Ultimate.Exec.execute(commands, options);
	}
})
.extendServer({
	createExtensionFromPackageInfo(packageInfo) {
		var matches = /name\:[\s]*['|"](.+)*['|"]/.exec(packageInfo);
		this.package_name = matches && matches[1];
	
		matches = /summary\:[\s]*['|"](.+)*['|"]/.exec(packageInfo);
		this.summary = matches && matches[1];
	
		matches = /version\:[\s]*['|"](.+)*['|"]/.exec(packageInfo);
		this.version = matches && matches[1];
	},
	
	
	createSectionsFromReadme: function(readme) {
		var name = 'Extension Overview',
			c = new Class({name: name, overview: true}).upsertSave({name: name, extension_id: this._id});
			
		this.createSectionsFromMarkdown(readme, c._id);
	},
	createSectionsFromMarkdown: function(markdown, classId) {
		let reg = /(^### (?:.+)$)/gm,
			subst = '___ULTIMATE_SECTION___$1',
			sections = markdown.replace(reg, subst).split('___ULTIMATE_SECTION___');
			
		_.chain(sections)
			.reject(section => _.isEmpty(section))
			.each(section => {
				let match = /^(.*)$/m.exec(section);
				this._newContentMethod(match && match[0], section, classId);
			});
	},
	_newContentMethod: function(name, content, classId) {
		if(!name) return;
		
		name = name.replace(/^#+ /g, '');
		
		let method = new Method({overview: true, content: content.replace('### '+name, '')});
		method.upsertSave({name: name, extension_id: this._id, class_id: classId});
	},
	
	
	createMethodsFromJSDOC(data) {
		var classes = {};
		
		_.each(data, (method, name) => {
			if(method.kind == 'class') {
				classes[name] = classes[name] || {};
				_.extend(classes[name], _.omit(method, 'name', 'scope', 'options', 'params', 'config', 'kind', 'longname')); //method is class info this case
				classes[name].extension_id = this._id;
			}
			else {
				var className = method.memberof,
					methodName = method.name,
					Class = classes[className] = classes[className] || {};
				
				Class.methods = Class.methods || {};
				method = Class.methods[methodName] = _.omit(method, 'longname', 'kind'); //reassign to method, so we can refrerence it

				if(method.new) method.new = true; //set these to true booleans rather than "true"
				if(method.configproperty) {
					method.config_property = true;
					delete method.configproperty;
				}
			
				Class.name = method.memberof; //set data to Class again just in case Class documentation was left out
			
				this._parseTypes(method.params);
				this._parseTypes(method.options);
				this._parseTypes(method.config);
			
				try {
					method.return_types = method.returns[0].type.names;
					method.return_description = method.returns[0].description;
				}
				catch(e) {}
			
				delete method.returns;
			}
		});
	
	
		//upsert classes and methods
		_.each(classes, (klass, name) => {
			var c = new Class(_.omit(klass, 'methods', 'summary', 'overview'));
			c.upsertSave({name: name, extension_id: this._id}); //guarantees availability of c._id
			
			if(!_.isEmpty(klass.summary)) this._newContentMethod('Summary', klass.summary, c._id);
			if(!_.isEmpty(klass.overview)) this.createSectionsFromMarkdown(klass.overview, c._id);
			
			_.each(klass.methods, (method, name) => {
				console.log('upsert', name);
				Method.upsert({name: name, extension_id: this._id, class_id:  c._id}, method);
			});
		});
	},

	_parseTypes(arr, name) {
		if(!_.isArray(arr)) return; 

		_.each(arr, (item) => {
			item.types = item.type.names;
			delete item.type;
		});	
	}
});