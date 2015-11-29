class Startup extends Ultimate.Startup {
	configureGithubService() {
		ServiceConfiguration.configurations.remove({service: "github"});

		ServiceConfiguration.configurations.insert({
			service: "github",
			clientId: Config.github().clientId,
			secret: Config.github().secret,
			loginStyle: "popup"
		});
	}
}

