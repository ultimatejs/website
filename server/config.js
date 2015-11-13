Config = Ultimate.createConfig({
	environments: {
		development: ['http://team.celeb.com','auto'],
		production: ['http://metrics.celebvidy.com', 'http://agents.celebvidy.com']
	},
	
	development: {
		github: function() {
			if(this.isLocalDevelopment() || this.envId() == "http://team.celeb.com") return {
				clientId: "736e051aa97a42708698", 
				secret: "492b125dbaff82d54ff0286c64980bff6465ce60"
			}
			else return {
				clientId: "5e9fe6d6fb1ce8522f3a", 
				secret: "50366164bfc967c0e044607b60ea75388c055f15"
			};
		},
	},
	production: {
		github: function() {
			return {
				clientId: "5e9fe6d6fb1ce8522f3a", 
				secret: "50366164bfc967c0e044607b60ea75388c055f15"
			};
		},
	}
});