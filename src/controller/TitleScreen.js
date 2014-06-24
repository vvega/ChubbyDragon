import ui.View;
import ui.ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;
import src.view.BaseView as BaseView;
import animate;

exports = Class(BaseView, function (supr) {

    var _textPosX;
    var _textPosY;
    var _textView;
    var _logoView;
    var _subtitleView;
    var _highScoreView;
    var _startButton;
    var _guideButton;

    var LOGO_WIDTH;
    var LOGO_HEIGHT;

    this.init = function(opts) {
        LOGO_WIDTH = WIDTH*.95;
        LOGO_HEIGHT = HEIGHT*.95;
        supr(this, 'init', [opts]);
    };

    this.constructView = function() {
        supr(this, 'constructView');

        //_textView.style.visible = true;
        _highScoreView.style.visible = true;

        animate(_logoView)
            .now({ y: -HEIGHT/50, opacity: 1 }, 700, animate.easeIn)
            .then(function() {
                //animate(_highScoreView)
                //.now({ y: -HEIGHT/6.3, opacity: 1 }, 300, animate.easeIn)
                this._runLogoAnimation();
                //this._runButtonAnimation(_startButton, _startButton.style);
        }.bind(this));
    };

    this.resetView = function() {
        _logoView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibile: false,
            opacity: 0
        });
        _highScoreView.updateOpts({
            x: WIDTH - 300,
            y: 0,
            visibile: false,
            opacity: 0
        });
        _highScoreView.setText("Current High Score: "+GC.app.highScore);
    };

    this.build = function() {

        _logoView = new ImageScaleView({
            superview: this,
            image: "resources/images/logo.png",
            width: LOGO_WIDTH,
            height: LOGO_HEIGHT,
            x: (WIDTH - LOGO_WIDTH)/2,
            y: HEIGHT/5, 
            scaleMethod: "9slice",
            opacity: 0,
            sourceSlices: {
                horizontal: {left: 0, center: 100, right: 0},
                vertical: {top: 0, middle:100, bottom: 0}
            },
            destSlices: {
                horizontal: {left: WIDTH/30, right: WIDTH/30},
                vertical: {
                    top: HEIGHT/30, 
                    bottom: (GC.app.isTablet) ? HEIGHT/3 : HEIGHT/4
                }
            }
        });

        _highScoreView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "Current High Score: "+GC.app.highScore,
            size: HEIGHT/12,
            strokeColor: "#fff",
            strokeWidth: HEIGHT/40,
            opacity: 0,
            color: "#ffc600",
            wrap: true
        });

        var buttonGrid = new GridView({
            superview: this,
            width: this.style.width,
            height: this.style.height,
            verticalMargin: 10,
            cols: 3,
            rows: 6
        });

        _startButton = new ButtonView({
            superview: buttonGrid,
            image: "resources/images/button.png",
             text: {
                 fontFamily: 'tiptoe',
                 text: "Start",
                 verticalAlign: "middle",
                 horizontalAlign: "center",
                 padding: [0,0,65,0],
                 color: "#FFF"
                },
                opacity: 1,
                col: 1,
                row: 3,
                on: {
                    up: bind(this, function(){
                        GC.app.transitionViews(GC.app.gameView);
                    })
                }
        });

        _guideButton = new ButtonView({
            superview: buttonGrid,
            image: "resources/images/button.png",
             text: {
                 fontFamily: 'tiptoe',
                 text: "Guide",
                 verticalAlign: "middle",
                 horizontalAlign: "center",
                 padding: [0,0,65,0],
                 color: "#FFF"
                },
                opacity: 1,
                col: 1,
                row: 4,
                on: {
                    up: bind(this, function(){
                       // GC.app.transitionViews(GC.app.gameView);
                    })
                }
        });


        _textPosX = _logoView.style.x;
        _textPosY = _logoView.style.y;
    };

    this._runLogoAnimation = function() {
        animate(_logoView)
            .now({y: -20}, 300, animate.easeIn)
            .then({y: 5}, 300, animate.linear)
            .then({y: -20}, 300, animate.easeOut)
            .then(function() {
                this._runLogoAnimation();
            }.bind(this));
    };

    this._runButtonAnimation = function(button, origStyle) {
        animate(button) 
            .now({width: origStyle.width*.98, x: origStyle.x + origStyle.width*.02}, 300, animate.easeIn)
            .then({width: origStyle.width, x: origStyle.x}, 300, animate.linear)
            .then({width: origStyle.width*.98, x: origStyle.x + origStyle.width*.02}, 300, animate.easeOut)
            .then(function() {
                this._runButtonAnimation(button, origStyle);
            }.bind(this));
    };
});
