class Toc extends Ultimate.ComponentModel {
	onRendered() {
		let firstNode = this.component().firstNode();
		
		this.setTimeout(function() {
			$(firstNode).velocity('slideDown', {
				duration: 500, 
				easing: 'easeInOutQuad',
				complete: () => {
					if(!this.component().hash()) {
						let hash = Class.active().orderedTocMethods(1).hash;
						Toc.goToHash(hash);
					}	
					else this.component()._scrollToChapter(this.component().hash());
				}
			});
		}, 900);
	}
	autoruns() {
		return [
			function() {
				let hash = this.hash(),
					meth = Method.findByHash(hash), //this.hash() is reactive		
					scrolling = Tracker.nonreactive(() => Session.get('isScrolling'));

				if(meth) Session.set('activeMethodId', meth._id);
				if(!scrolling && hash) this._scrollToChapter(hash);
			}
		];
	}
	_scrollToChapter(hash) {
		hash = Method.cleanHash(hash);
		var $section = $('.section-title[hash="'+hash+'"]');
		if($section.length === 0) return;
		
		Session.set('isMethodsAnimating', true);
		
		$('.task-container').animate({
			scrollTop: $section.offset().top - 30 - $section.parent().parent().offset().top
		}, 500, 'easeInOutCirc', function() {
			this.setTimeout(function() {
				Session.set('isMethodsAnimating', false);
			}, 150);
		}.bind(this));  
	}
	
	
	static goToHash(hash) {
		if(hash) window.location.hash = hash;
	}
	
	
	active() {
		if(Meteor.userId() && Meteor.user().hasBookmarkedMethod(this._id)) {
			return Session.get('activeMethodId') == this._id ? 'active bookmarked' : 'bookmarked';
		}
		else return Session.get('activeMethodId') == this._id && 'active';
	}
	disabled(control) {
		let methods = Class.active().orderedTocMethods(),
			activeId = Session.get('activeMethodId');

		if(_.isEmpty(methods)) return 'disabled';
		
		if(control == 'backward') return activeId == _.first(methods)._id && 'disabled';
		if(control == 'forward') return activeId == _.last(methods)._id && 'disabled';
	}
	disabledStep(control) {
		let classes = Class.find().fetch(),
			activeId = Session.get('activeClassId');

		if(_.isEmpty(classes)) return 'disabled';
		
		if(control == 'step-backward') return activeId == _.first(classes)._id && 'disabled';
		if(control == 'step-forward') return activeId == _.last(classes)._id && 'disabled';
	}
	hasBookmarks() {
		return Bookmark.find().count()
	}
	bookmarked() {
		return Meteor.userId() && Meteor.user().hasBookmarkedMethod(Session.get('activeMethodId')) && 'active';
	}
	
	
	bookmark() {
		if(!this.component().hasBookmarks()) this.component().set('showBookmarks', true); //show bookmarks pane only on first usage
		Bookmark.toggle(Session.get('activeExtensionId'), Session.get('activeClassId'), Session.get('activeMethodId'));
	}
	
	['click .method-toc']() { 
		this.go();
	}
	
	['click .glyphicon-step-backward']() {
		Class.active().prev().go();
	}
	['click .glyphicon-step-forward']() {
		Class.active().next().go();
	}
	['click .glyphicon-backward']() {
		Method.active().prev().go();
	}
	['click .glyphicon-forward']() {
		Method.active().next().go();
	}
	
	['click .glyphicon-arrow-right']() {
		this.component().set('showBookmarks', false);
	}
	['click .glyphicon-bookmark.toc-switch']() {
		this.component().set('showBookmarks', true);
	}
	['click #bookmark']() {
		if(!Meteor.userId()) Meteor.loginWithGithub(() => this.component().bookmark());
		else this.component().bookmark();
	}
}