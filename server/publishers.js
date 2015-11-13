Ultimate('Publish').extends(UltimatePublish, {
	//roles: true,
	self: [
		'services.github.email', 'services.github.username', 'profile'
	]
});