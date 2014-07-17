import ui.widget.ButtonView as ButtonView;
import animate;

exports = Class(ButtonView, function(supr){

	var SCALE_AMOUNT = 22;

	this.init = function(opts) {

		opts = merge(opts, {
			images: {
				up: imageData.ui.button.up,
				down: imageData.ui.button.down
			},
			text: merge(opts.text, {
				fontFamily: 'tiptoe',
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
		this._runScaleAnim(this, this.style);
	};

	this._runScaleAnim = function(view, origStyle) {
        animate(view)
            .now({
                width: origStyle.width + SCALE_AMOUNT,
                x: origStyle.x - SCALE_AMOUNT/3
            }, 1000, animate.linear)
            .then({
                width: origStyle.width,
                x: origStyle.x
            }, 1000, animate.linear)
            .then(bind(this, function() {
                this.style.visible && this._runScaleAnim(view, origStyle);
            }));
    };
});