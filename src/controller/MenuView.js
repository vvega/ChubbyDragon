import ui.ImageView as ImageView;
import src.view.ui.BaseButton as BaseButton;
import src.view.ui.BaseModal as BaseModal;
import ui.widget.ButtonView as ButtonView;
import animate; 

exports = Class(BaseModal, function(supr) {
	
	var SCALE_AMOUNT = 12;
	var TRANSITION_TIME = 300;

	this.init = function(opts) {
		opts = merge(opts, {
			image: imageData.ui.popups.blank,
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
            text: { text: "Resume", scale: .9, x: BUTTON_HEIGHT/3 },
            icon: {
            	image: imageData.ui.icons.play,
            	width: BUTTON_HEIGHT/2,
            	height: BUTTON_HEIGHT/2,
            	x: BUTTON_HEIGHT/4,
            	y: BUTTON_HEIGHT/4
            },
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
            text: { text: "Restart", scale: .9, x: BUTTON_HEIGHT/2.5 },
            icon: {
            	image: imageData.ui.icons.restart,
            	width: BUTTON_HEIGHT/2,
            	height: BUTTON_HEIGHT/2,
            	x: BUTTON_HEIGHT/4,
            	y: BUTTON_HEIGHT/4
            },
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
            icon: {
            	image: imageData.ui.icons.home,
            	width: BUTTON_HEIGHT/2,
            	height: BUTTON_HEIGHT/2,
            	x: BUTTON_HEIGHT/4,
            	y: BUTTON_HEIGHT/4
            },
            opacity: 1,
            x: this.style.width/5,
            y: BUTTON_HEIGHT*4,
            on: {
                up: bind(this, function(){
                	this.closeView(function() {
                		GC.app.gameScreen.exitGame();
                		GC.app.transitionViews(GC.app.titleScreen);
                	});
                   
                })
            }
		});

		supr(this, 'build', [this.style]);
	};

	this.exitButtonHandler = function(){
    	this.closeView(function() {
    		GC.app.gameScreen.resume();
    	});
    };

});