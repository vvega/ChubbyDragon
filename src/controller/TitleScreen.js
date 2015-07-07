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
        }.bind(this));

        this._runBounceAnimation(_highScoreView.style);
    };

    this.resetView = function() {
        _logoView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibile: false,
            opacity: 0
        });
        _highScoreView.setText("Local High Score: "+GC.app.highScore);
        this.restoreButton.style.visible = GC.app.ads && GC.app.device.isIOS;
    };

    this.build = function() {
        _guideView = new GuideView();

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

        _startButton = new BaseButton({
            superview: this,
            text: { text: "Start" },
            opacity: 1,
            x: GC.app.isTablet ? WIDTH/2 - BUTTON_WIDTH/1.55 : WIDTH/2 - BUTTON_WIDTH/2,
            y: GC.app.isTablet ? HEIGHT/2.2 : HEIGHT/2,
            on: {
                up: bind(this, function(){
                    GC.app.transitionViews(GC.app.gameScreen);
                })
            }
        });

        _guideButton = new BaseButton({
            superview: this,
            text: { text: "Guide" },
            opacity: 1,
            x: GC.app.isTablet ? WIDTH/2 - BUTTON_WIDTH/1.55 : WIDTH/2 - BUTTON_WIDTH/2,
            y: GC.app.isTablet ? HEIGHT/2.2 + BUTTON_HEIGHT + 25 : HEIGHT/2 + BUTTON_HEIGHT + 25,
            on: {
                up: bind(this, function(){
                   _guideView.openView();
                })
            }
        });

        _lbButton = new BaseButton({
            superview: this,
            text: { 
                text: "Hi-Scores",
                x: GC.app.isTablet ? HEIGHT/16 : HEIGHT/32,
                y: GC.app.isTablet ? HEIGHT/50 : HEIGHT/70,
                scale: GC.app.isTablet ? .8 : 1 
            },
            icon: {
                image: imageData.ui.icons.star,
                height: HEIGHT/16,
                width: HEIGHT/16,
                x: HEIGHT/32,
                y: HEIGHT/32
            },
            opacity: 1,
            width: GC.app.isTablet ? WIDTH/3.5 : WIDTH/4,
            height: HEIGHT/8,
            on: {
                up: GC.app.openGC
            }
        });

        _highScoreView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: GC.app.device.isAndroid ? 'bigbottom' : 'big_bottom_cartoon',
            text: "Local High Score: "+GC.app.highScore,
            size: HEIGHT/15,
            width: WIDTH/3,
            height: HEIGHT/10,
            strokeColor: "#ffc600",
            strokeWidth: (GC.app.isTablet) ? HEIGHT/90 : HEIGHT/65,
            color: "#FFF"            
        });

        _highScoreView.style.y = HEIGHT - HEIGHT/6;
        _highScoreView.style.x = WIDTH/2 - _highScoreView.style.width/2;
        _lbButton.style.x = GC.app.isTablet 
                            ? WIDTH - _lbButton.style.width 
                            : WIDTH - (_lbButton.style.width + WIDTH/40);
        _lbButton.style.y = HEIGHT - HEIGHT/7;
        _textPosX = _logoView.style.x;
        _textPosY = _logoView.style.y;

        this.restoreButton = new BaseButton({
            superview: this,
            text: { 
                text: "Purchases",
                x: GC.app.isTablet ? HEIGHT/13 : HEIGHT/22,
                y: GC.app.isTablet ? HEIGHT/40 : HEIGHT/70,
                scale: GC.app.isTablet ? .7 : .9 
            },
            icon: {
                image: imageData.ui.icons.restart,
                height: GC.app.isTablet ? HEIGHT/18 : HEIGHT/16,
                width: GC.app.isTablet ? HEIGHT/18 : HEIGHT/16,
                x: HEIGHT/32,
                y: HEIGHT/32
            },
            width: GC.app.isTablet ? WIDTH/3.5 : WIDTH/4,
            height: HEIGHT/8,
            visible: GC.app.ads && GC.app.device.isIOS,
            on: {
                up: bind(this, function(){
                    if(!this.restoreButton.disabled) {
                        this.restoreButton.disabled = true;
                        BL.restore(function(err) {
                            GC.app.titleScreen.restoreButton.disabled = false;
                            if (err) {
                                AMP.track('restoreError', {err: err});
                                !GC.app.gameScreen.gameStarted && GC.app.popup.openView({text: 'No purchases to restore.'});
                            }
                        });
                    }                  
                })
            }
        });
        this.restoreButton.style.x = GC.app.isTablet ? 0 : WIDTH/40;
        this.restoreButton.style.y = HEIGHT - HEIGHT/7;
    
        _startButton.startButtonAnim();
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

    this._runBounceAnimation = function(origStyle) {
        animate(_highScoreView)
            .now({y: origStyle.y-10}, 500, animate.easeIn)
            .then({y: origStyle.y}, 500, animate.easeOut)
            .then(function() {
                this.style.visible && this._runBounceAnimation(origStyle);
            }.bind(this));
    };

});
