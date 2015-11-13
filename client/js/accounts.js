(function(login) { 
	Meteor.loginWithGithub = function(requestRepo, callback) { 
		let perms = requestRepo ? {requestPermissions: ['user']} : {requestPermissions: ['user', 'repo']};
			
		if(_.isFunction(requestRepo)) callback = requestRepo;
		 
		login(perms, function(error) {
			if(!error) callback();
			else alert("Something went wrong with your Github login. Please report the issue displayed in the console if it continues.");
		}); 
	};
})(Meteor.loginWithGithub);