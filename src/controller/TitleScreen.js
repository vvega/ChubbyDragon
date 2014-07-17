import ui.View;
import ui.ImageView;
import ui.TextView as TextView;
import ui.ImageScaleView as ImageScaleView;
import src.view.BaseView as BaseView;
import src.view.ui.BaseButton as BaseButton;
import src.controller.GuideView as GuideView;
import animate;

exports = Class(BaseView, function (supr) {

    var _textPosX;
    var _textPosY;
    var _textView;
    var _logoView;
    var _subtitleView;
    var _highScoreView;
    var _guideView;
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

        animate(_logoView)
            .now({ y: -HEIGHT/50, opacity: 1 }, 700, animate.easeIn)
            .then(function() {
                this._runLogoAnimation();
                _startButton.startButtonAnim();
                _guideButton.startButtonAnim();
        }.bind(this));

        GC.app.sound.isPlaying('menu') || GC.app.sound.play('menu');
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
        _guideView = new GuideView({
            superview: this,
            height: HEIGHT,
            width: HEIGHT
        });

        _logoView = new ImageScaleView({
            superview: this,
            image: imageData.ui.logo,
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

        _startButton = new BaseButton({
            superview: buttonGrid,
            text: { text: "Start" },
            zIndex: this.style.zIndex,
            opacity: 1,
            col: 1,
            row: 3,
            on: {
                up: bind(this, function(){
                    GC.app.transitionViews(GC.app.gameView);
                    GC.app.sound.play('button', {loop: false});
                })
            }
        });

        _guideButton = new BaseButton({
            superview: buttonGrid,
            text: { text: "Guide" },
            opacity: 1,
            col: 1,
            row: 4,
            on: {
                up: bind(this, function(){
                   _guideView.openView();
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
                this.style.visible && this._runLogoAnimation();
            }.bind(this));
    };
});
