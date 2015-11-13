ActionButtons = Ultimate.Component.createClass({
	onRendered: function() {	
		$('.float-large').on('mouseenter', function() {
			if(Session.get('actions_open')) return;
			
			$(this).addClass('spin');
			
			var  buttons = _.toArray($('.small-action-buttons .float-small')).reverse();
			
			$(buttons).velocity('transition.whirlIn', {duration: 40, stagger: 30, complete: function() {
				Session.set('actions_open', true);
				$('[data-toggle="tooltip"]').tooltip(); 
				$('.float-large').trigger('mouseenter');
				$('.floating-action-button').attr('style', 'display:block;'); //remove transform style, so css transition from transorm still works
			}});
		});
		
		$('.action-button-container').on('mouseleave', function() {
			$('.float-large').removeClass('spin');
			
			$('.small-action-buttons .float-small')
				.velocity('transition.slideDownBigOut', {duration: 100, stagger: 20, drag: true, complete: function() {
					Session.set('actions_open', false);
					$('[data-toggle="tooltip"]').tooltip('destroy'); 
				}});
		});
	},

	
	showBackButton: function() {
		return !_.isEmpty(Session.get('previous_tasks'));
	},

	'click .back': function() {
		Meteor.user().back();
	},
	'click  .skip': function() {
		Meteor.user().skip();
	},
	'click #new-topic': function() {
		new Ultimate.ModalPrompt('new_topic', new Topic, {
			title: "New Topic"
		}).show();
	}
});