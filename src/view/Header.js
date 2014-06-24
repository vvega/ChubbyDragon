import ui.View as View;
import ui.ImageScaleView as ImageScaleView;
import ui.ScoreView as ScoreView;
import src.view.LivesView as LivesView;

exports = Class(ImageScaleView, function(supr) {

	this.init = function(opts) {
        //opts.image = imageData.ui.header;
        this.lives = opts.lifeViewProps.numLives;
        this.lifeViewProps = opts.lifeViewProps.style;

		supr(this, 'init', [opts]);

        this.build();
	};

	this.build = function() {

		 var svBox = new View({
            superview: this,
            x: WIDTH/30,
            y: HEIGHT/32,
            width: WIDTH/4,
            height: HEIGHT/10
        });

        this.scoreView = new ScoreView({
            superview: svBox,
            x:0,
            y:0,
            layout: "box",
            text: "0",
            characterData: this._nextCharData()
        });

        this.livesView = new LivesView({
            parent: this,
            numLives: this.lives,
            lifeViewProps : this.lifeViewProps
        });
	};

	this._nextCharData = function() {
        var d = {};
        for (var i = 0; i < 10; i++) {
            d[i] = { image: imageData.ui.scoreFont + i + '.png'};
        }
        return d;
    };

});