import ui.ImageView as ImageView;
import ui.GestureView as GestureView;
import ui.widget.ButtonView as ButtonView;
import src.view.ui.BaseModal as BaseModal;
import animate; 

exports = Class(BaseModal, function(supr) {
	
	var _surface;
	var _guideImages = [];
	var _guideImageViews = [];
	var _currentView;

	this.init = function(opts) {
		if(!opts) { opts = {}; }
		opts.image = imageData.ui.guideBG;
		opts.clip = true;

		supr(this, 'init', [opts]);

		_guideImages = imageData.ui.guideImages;

		this.build();
	};

	this.build = function() {
		this._populateGuide();
		this._createGestureHandlers();
        supr(this, 'build', []);
	};

	this._createGestureHandlers = function() {
		_surface = new GestureView({
			superview: this,
			layout: 'box',
			zIndex: this.style.zIndex,
			width: this.style.width,
			height: this.style.height
		});

		_surface.on('Swipe', bind(this, function(angle, direction, numberOfFingers) {
			if(direction === 'left' || direction === 'right') {
				this._transition(direction);
				return;
			}
			if(direction === 'down') {
				this.closeView();
			}
		}));

		_currentView = _guideImageViews[0];
	};

	this._populateGuide = function() {
		for(var idx in _guideImages) {
			_guideImageViews.push(new ImageView({
				superview: this,
				width: this.style.width,
				height: this.style.height,
				image: _guideImages[idx]
			}));
			_guideImageViews[idx].next = null;
			_guideImageViews[idx].previous = null;

			if(idx - 1 >= 0) {
				_guideImageViews[idx].style.x =	this.style.width + _guideImageViews[idx].style.width;
				_guideImageViews[idx].previous = _guideImageViews[idx-1];
				_guideImageViews[idx].previous.next = _guideImageViews[idx];
			}
		}
	};

	this._transition = function(direction) {
		var hideX = (direction === 'left') ? -_currentView.style.width : WIDTH + _currentView.style.width;
		var nextView = (direction === 'left') ? _currentView.next : _currentView.previous;

		if(nextView) {
			animate(_currentView) 
				.now({x: hideX, opacity: 0}, TRANSITION_TIME, animate.linear)
				.then(function() {
					_currentView.style.visible = false;
				});

			nextView.style.visible = true;
			
			animate(nextView)
				.now({x: 0, opacity: 1}, TRANSITION_TIME, animate.linear)
				.then(function() {
					_currentView = nextView;
				});
		}
	};
});