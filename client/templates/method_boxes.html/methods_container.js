class MethodsContainer extends Ultimate.Component {
	onRendered() {
		let throttleFunc = _.throttle(() => this.setActiveMethodId(), 300),
			firstNode = this.firstNode();
		
		this.setTimeout(function() {
			$(firstNode).parent().parent().on('scroll.methods', throttleFunc);
		}, 1200);
	}
	onDestroyed() {
		$('.task-container').off('scroll.methods');
	}
	
	

	setActiveMethodId() {
		if(Session.get('isMethodsAnimating')) return;
		Session.set('isScrolling', true); //block hash-triggered scroll animation
		
		var firstVisible = _.find($('.method-container'), el => this.elementIsVisible(el));		
		Toc.goToHash($(firstVisible).attr('hash'));

		this.setTimeout(() => Session.set('isScrolling', false), 100); //unblock
	}
	elementIsVisible(el) {
		var visibleTop = 64, //64 == nav height
			visibleBottom = $(window).height() - 30, //30 == footer height
			elTop = $(el).offset().top,
			elBottom = elTop + $(el).height();
			
		return (elTop >= visibleTop && elTop <= visibleBottom) ||
			(elBottom >= visibleTop && elBottom <= visibleBottom) ||
			(elTop <= visibleTop && elBottom >= visibleBottom);
	}
	
	
	
	//make absorbed table of contents from github #hash links work
	['click .method-container a'](e, $el) {
		Toc.goToHash($el.attr('href'));
	}
}