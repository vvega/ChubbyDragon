import ui.widget.ButtonView as ButtonView;
import animate;

exports = Class(ButtonView, function(supr){

	var SCALE_AMOUNT = 12;

	this.init = function(opts) {

		opts = merge(opts, {
			image: "resources/images/button.png",
			text: merge(opts.text, {
				fontFamily: 'tiptoe',
				verticalAlign: "middle",
				horizontalAlign: "center",
				padding: [0,0,65,0],
				color: "#FFF"
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
                y: origStyle.y + SCALE_AMOUNT/3
            }, 1000, animate.linear)
            .then({
                width: origStyle.width,
                y: origStyle.y
            }, 1000, animate.linear)
            .then(bind(this, function() {
                this.style.visible && this._runScaleAnim(view, origStyle);
            }));
    };
});