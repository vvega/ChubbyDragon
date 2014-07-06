import ui.ImageView as ImageView;
import ui.GestureView as GestureView;
import ui.widget.ButtonView as ButtonView;
import animate; 

exports = Class(ImageView, function(supr) {
	
	var ORIG_Y;
	var SCALE_AMOUNT = 12;
	var TRANSITION_TIME = 300;

	var _surface;
	var _guideImages = [];
	var _guideImageViews = [];
	var _currentView;

	this.init = function(opts) {
		opts.image = imageData.ui.guideBG;
		opts.y = HEIGHT + opts.height;
		opts.x = (WIDTH - opts.width)/2;
		opts.zIndex = Z_CURRENT;
		opts.visible = false;
		opts.clip = true;

		supr(this, 'init', [opts]);

		ORIG_Y = opts.y;
		_guideImages = imageData.ui.guideImages;

		this.build();
	};

	this.build = function() {
		this._populateGuide();
		this._createGestureHandlers();
	};

	this.openView = function() {
		this.style.visible = true;
		_currentView.style.visible = true;
		_currentView.style.opacity = 1;
		animate(this)
			.now({y: 0}, 700, animate.linear)
			.then(bind(this, function() {
        		this._runScaleAnim(this, this.style);
			}));
	};

	this.closeView = function() {
		animate(this)
			.now({y: ORIG_Y}, 700, animate.linear)
			.then(function() {
				for(idx in _guideImageViews) {
					_guideImageViews[idx].style.visible = false;
					_guideImageViews[idx].style.x = this.style.width + _guideImageViews[idx].style.width;
				}
				this.style.visible = false;
				_currentView = _guideImageViews[0];
				_currentView.style.x = 0;
			}.bind(this));
	};

	this._runScaleAnim = function(view, origStyle) {
		animate(view)
			.now({
				width: origStyle.width + SCALE_AMOUNT,
				y: origStyle.y + SCALE_AMOUNT/3
			}, 700, animate.linear)
			.then({
				width: origStyle.width,
				y: origStyle.y
			}, 700, animate.linear)
			.then(bind(this, function() {
				this._runScaleAnim(view, origStyle);
			}));
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
			//assign doubly-linked imageView retroactively
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