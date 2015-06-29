import ui.widget.ButtonView as ButtonView;
import animate;

exports = Class(ButtonView, function(supr){

	var SCALE_AMOUNT = 5;

	this.init = function(opts) {

		opts = merge(opts, {
			images: {
				up: imageData.ui.button.up,
				down: imageData.ui.button.down
			},
			width: GC.app.isTablet ? BUTTON_WIDTH*1.30 : BUTTON_WIDTH,
			height: BUTTON_HEIGHT,
			text: merge(opts.text, {
				fontFamily: GC.app.device.isIOS ? "d puntillas b to tiptoe" : 'tiptoe',
				verticalAlign: "middle",
				horizontalAlign: "center",
				padding: [0,0,65,0],
				color: "#FFF",
				stroke: "#fff"
			})
		});

		supr(this, 'init', [opts]);
	};

	this.startButtonAnim = function() {
		this.origStyle = GC.app.util.cloneStyle(this.style);
		this._runScaleAnim();
	};

	this._runScaleAnim = function() {
        animate(this)
            .now({
                scale: 1.04,
                x: this.origStyle.x - this.origStyle.x*.02,
                y: this.origStyle.y - this.origStyle.y*.02
            }, 1000, animate.easeOut)
            .then({
                scale: 1,
                x: this.origStyle.x,
                y: this.origStyle.y
            }, 700, animate.easeOut)
          
            .then(bind(this, function() {
                this.style.visible && this._runScaleAnim();
            }));
    };
});