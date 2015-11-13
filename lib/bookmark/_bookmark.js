class Bookmark extends Ultimate.Model {
	static toggle(extensionid, classId, methodId) {
		let selector = {
			user_id: Meteor.userId(), 
			extension_id: extensionid,
			class_id: classId,
			method_id: methodId
		};
		
		this.toggleRemoveInsert(selector);
	}
	
	subscriptions() {
		return {
			every: function(userId) {
				return {selector: {user_id: userId}};
			}
		}
	}
	relations() {
		return {
			user: {
				relation: 'belongs_to',
				model: 'User',
				key: 'user_id'
			},
			method: {
				relation: 'belongs_to',
				model: 'Method',
				key: 'method_id'
			}
		}
	}
}