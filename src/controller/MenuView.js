import ui.ImageView as ImageView;
import src.view.ui.BaseButton as BaseButton;
import ui.widget.ButtonView as ButtonView;
import animate; 

exports = Class(ImageView, function(supr) {
	
	var SCALE_AMOUNT = 12;
	var TRANSITION_TIME = 300;

	this.init = function(opts) {
		opts = merge(opts, {
			image: imageData.ui.guideBG,
			x: WIDTH/4,
			y: HEIGHT + opts.height,
			zIndex : Z_MODAL,
			visible : false,
			scale : 1
		});
		
		supr(this, 'init', [opts]);
		this.build();
	};

	this._resetView = function() {
		this.style = merge(this.style, this.defaultStyle);
	};

	this.build = function() {
		this.resumeButton = new BaseButton({
			superview: this,
            text: { text: "Resume" },
            x: this.style.width/5,
            y: BUTTON_HEIGHT*.75,
            opacity: 1,
            on: {
                up: bind(this, function(){
                	this.closeView(function() {
                		GC.app.gameScreen.resume();
                	});
                })
            }
		});

		this.restartButton = new BaseButton({
			superview: this,
            text: { text: "Restart" },
            opacity: 1,
            x: this.style.width/5,
            y: BUTTON_HEIGHT*.75 + BUTTON_HEIGHT*2,
            on: {
                up: bind(this, function(){
                	this.closeView(function() {
                		GC.app.gameScreen.restart();
                	});
                })
            }
		});

		this.exitButton = new BaseButton({
			superview: this,
            text: { text: "Menu" },
            opacity: 1,
            x: this.style.width/5,
            y: BUTTON_HEIGHT*.75 + BUTTON_HEIGHT*3,
            on: {
                up: bind(this, function(){
                	this.closeView(function() {
                		GC.app.gameScreen.exitGame();
                		GC.app.transitionViews(GC.app.titleScreen);
                	});
                   
                })
            }
		});

		this.exitMenuButton = new ButtonView({
			superview: this,
			width: HEIGHT/10,
			height: HEIGHT/10,
			zIndex: Z_CURRENT,
			x: this.style.width - (HEIGHT/10 + HEIGHT/80),
			y: HEIGHT/40,
			backgroundColor: "#000",
			on: {
                up: bind(this, function(){
                	this.closeView(function() {
                		GC.app.gameScreen.resume();
                	});
                })
            }
		});

		this.defaultStyle = GC.app.util.cloneStyle(this.style);
	};

	this.openView = function() {
		this.style.visible = true;
		animate(this)
			.now({y: -20}, 500, animate.linear)
			.then({y: 0}, 100, animate.easeIn)
			.then(bind(this, function() {
				if(!this.openedStyle) {
					this.openedStyle = GC.app.util.cloneStyle(this.style);
				}
        		this._runScaleAnim(this);
			}));
	};

	this.closeView = function(cb) {
		animate(this)
			.now({y: -20}, 100, animate.easeOut)
			.then({y: this.defaultStyle.y}, 500, animate.linear)
			.then(function() {
				this.style.visible = false;
				this._resetView();
				cb && cb();
			}.bind(this));
	};

	this._runScaleAnim = function(view) {
		animate(view)
			.now({
				width: this.openedStyle.width + SCALE_AMOUNT,
				y: this.openedStyle.y + SCALE_AMOUNT/3,
				x: this.openedStyle.x - SCALE_AMOUNT
			}, 700, animate.linear)
			.then({
				width: this.openedStyle.width,
				y: this.openedStyle.y,
				x: this.openedStyle.x
			}, 700, animate.linear)
			.then(bind(this, function() {
				this._runScaleAnim(view);
			}));
	};

});