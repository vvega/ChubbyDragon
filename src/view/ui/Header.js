import ui.View as View;
import ui.ImageScaleView as ImageScaleView;
import ui.TextView as TextView;
import ui.ScoreView as ScoreView;
import src.view.ui.BaseButton as BaseButton;
import src.view.ui.LivesView as LivesView;
import src.controller.MenuView as MenuView;

exports = Class(ImageScaleView, function(supr) {

	this.init = function(opts) {
        opts.image = imageData.ui.header;
        this.lives = opts.lifeViewProps.numLives;
        this.lifeViewProps = opts.lifeViewProps.style;

		supr(this, 'init', [opts]);

        this.build();
	};

	this.build = function() {
        this.margin = this.style.height/4;
        this.menuView = new MenuView({});
        this.livesView = new LivesView({
            parent: this,
            numLives: this.lives,
            lifeViewProps : merge(this.lifeViewProps, {
                height: this.style.height*.8,
                width: this.style.height*.8,
                margin: this.style.height/15
            })
        });

        this.scoreText = new TextView({
            superview: this,
            width: this.style.width,
            height: this.style.height*.8,
            layout: 'box',
            horizontalAlign: 'left',
            verticalAlign: 'top',
            fontFamily: GC.app.device.isIOS ? "big bottom cartoon" : 'bigbottom',
            text: "0",
            size: this.style.height*.35,
            color: "#FFF",
            strokeColor: "#322",
            strokeWidth: this.style.height*.1,
            wrap: true,
            x: this.style.height/5,
            y: -this.style.height/5
        });
	};
});