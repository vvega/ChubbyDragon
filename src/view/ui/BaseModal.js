import ui.ImageView as ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.TextView as TextView;
import ui.View as View;
import animate;

exports = Class(ImageView, function(supr){
	var SCALE_AMOUNT = 12;
	var TRANSITION_TIME = 300;

	this.init = function(opts) {
		if(!opts) { opts = {}; }
		opts = merge(opts, {
			superview: GC.app.rootView,
			image: opts.image ? opts.image : imageData.ui.popups.blank,
			x: (WIDTH - HEIGHT)/2,
			y: HEIGHT*2,
			zIndex: Z_MODAL,
			width: HEIGHT,
			height: HEIGHT,
			visible : false
		});

		supr(this, 'init', [opts]);
		this.build(opts);
	};

	this._resetView = function() {
		this.style = merge(this.style, this.defaultStyle);
	};

	this.build = function(opts) {
		this.exitButton = new ButtonView({
			superview: this,
			images: {
				up: imageData.ui.exit.up,
				down:  imageData.ui.exit.up
			},
			width: HEIGHT/10,
			height: HEIGHT/10,
			zIndex: Z_MODAL,
			x: this.style.width - (HEIGHT/10 + HEIGHT/80),
			y: HEIGHT/40,
			on: {
                up: bind(this, function() {
                	this.exitButtonHandler();
                })
            }
        });       

		this.textView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: GC.app.device.isAndroid ? 'bigbottom' : 'big_bottom_cartoon',
            text: (opts && opts.text) ? opts.text : '',
            size: HEIGHT/14,
            width: HEIGHT,
            height: HEIGHT*.75,
            strokeColor: "#fff",
            visible: false,
            wrap: true,
            strokeWidth: (GC.app.isTablet) ? HEIGHT/90 : HEIGHT/65,
            color: "#432" 
        });
		
		this.defaultStyle = GC.app.util.cloneStyle(this.style);
	};

	this.exitButtonHandler = function() {
		this.closeView();
	};

	this.openView = function(opts, cb) {
		GC.app.modalScreen.style.visible = true;
		if(opts && opts.text) {
			this.textView.setText(opts.text);
			this.textView.style.visible = true;
		}
		opts && opts.image && this.setImage(opts.image);
		this.style.visible = true;

		animate(this)
			.now({y: -20}, 500, animate.linear)
			.then({y: 0}, 100, animate.easeIn)
			.then(bind(this, function() {
				if(!this.openedStyle) {
					this.openedStyle = GC.app.util.cloneStyle(this.style);
					cb && cb();
				}
        		this._runScaleAnim(this);
			}));
	};

	this.closeView = function(cb) {
		animate(this)
			.now({y: -20}, 100, animate.easeOut)
			.then({y: this.defaultStyle.y}, 500, animate.linear)
			.then(function() {
				GC.app.modalScreen.style.visible = false;
				this.textView.style.visible = false;
				this.setImage(imageData.ui.popups.blank);
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