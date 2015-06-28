import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView as ImageView;
import ui.widget.GridView as GridView;
import ui.widget.ButtonView as ButtonView;
import src.view.BaseView as BaseView;
import src.view.ui.BaseButton as BaseButton;
import src.view.ui.BaseModal as BaseModal;
import animate;

exports = Class(BaseView, function (supr){

    var _textPosX;
    var _textPosY;
    var _textView;
    var _highScoreView;
    var _replayButton;
    var _exitButton;
    var _shareButton;
    var _fbIcon;
    var _lbButton;
    var _shareButton;
    var _rand;

    this.constructView = function(score) {
        supr(this, 'constructView');
        GC.app.setRewardState(false);
        _rand = Math.random;

        var height = (GC.app.isTablet) ? HEIGHT/7 : HEIGHT/6;
        
        animate(_textView)
            .now({ y: -HEIGHT/9, opacity: 1 }, 500, animate.easeIn)
            .then(function() {

                if(_rand() > .4) { 
                    GC.app.ads && CB.showInterstitialIfAvailable();
                    GC.app.ads && CB.cacheInterstitial();
                } else {
                    CB.showRewardedVideoIfAvailable();
                    CB.cacheRewardedVideo();
                }

                //insert high score view
                if(score > GC.app.highScore) {
                    GC.app.highScore = score;
                    _highScoreView.setText("New High Score! "+score);
                    this.writeToFile(score);
                } else {
                    _highScoreView.setText("Your score: "+score);
                }

                AMP.setUserProperties({
                    "highestScore": GC.app.highScore
                });

                animate(_highScoreView)
                    .now({ y: HEIGHT/2 - height*1.3, opacity: 1 }, 300, animate.easeIn)
                    .then(function() {
                       this._runBounceAnimation(_highScoreView.style);
                    }.bind(this))

            }.bind(this));

        GC.app.sound.play('menu');
    };

    this.resetView = function() {
        _textView.updateOpts({
            x: _textPosX.gameOver,
            y: _textPosY.gameOver,
            visibility: false,
            opacity: 0
        });
        _highScoreView.updateOpts({
            x: _textPosX.highScore,
            y: _textPosY.highScore,
            visibility: false,
            opacity: 0
        });
        this.purchaseButton.style.visible = GC.app.ads;
    };

    this.build = function() {

        _textView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: GC.app.device.isAndroid ? 'bigbottom' : 'big_bottom_cartoon',
            text: "Game Over!",
            height: (GC.app.isTablet) ? HEIGHT/7 : HEIGHT/6,
            width: WIDTH*.8,
            size: (GC.app.isTablet) ? HEIGHT/7 : HEIGHT/6,
            strokeColor: "#ffc600",
            strokeWidth: (GC.app.isTablet) ? HEIGHT/40 : HEIGHT/18,
            opacity: .4,
            color: "#FFF"
        });

        _highScoreView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: GC.app.device.isAndroid ? 'bigbottom' : 'big_bottom_cartoon',
            text: "New High Score!",
            zIndex: this.style.zIndex,
            height: HEIGHT/15,
            width: WIDTH*.8,
            size: HEIGHT/15,
            strokeColor: "#FFF",
            strokeWidth: (GC.app.isTablet) ? HEIGHT/60 : HEIGHT/30,
            opacity: 0,
            color: "#ffc600"
        });

        _replayButton = new BaseButton({
            superview: this,
            text: { text: "Replay" },
            opacity: 1,
            x: WIDTH/3 - BUTTON_WIDTH/2,
            y: HEIGHT/2 + BUTTON_HEIGHT,
            on: {
               up: function () {
                    GC.app.sound.play('startButton', {loop: false});
                    GC.app.transitionViews(GC.app.gameScreen);
                }
              }
        });

        _exitButton = new BaseButton({
            superview: this,
            text: { text: "Menu" },
            opacity: 1,
            x: WIDTH/3 + BUTTON_WIDTH/2 + WIDTH/100,
            y: HEIGHT/2 + BUTTON_HEIGHT,
            on: {
               up: function () {
                 GC.app.transitionViews(GC.app.titleScreen);
                }
            }
        });

        _lbButton = new BaseButton({
            superview: this,
            text: { text: "Hi-Scores", x: HEIGHT/32, y: HEIGHT/70 },
            icon: {
                image: imageData.ui.icons.star,
                height: HEIGHT/16,
                width: HEIGHT/16,
                x: HEIGHT/32,
                y: HEIGHT/32
            },
            opacity: 1,
            width: WIDTH/4,
            height: HEIGHT/8,
            on: {
                up: bind(this, function(){
                    if(GK.authenticated) {
                        GK.openGC();
                    } else {
                        GK.showAuthDialog();
                    }
                })
            }
        });

        _shareButton = new BaseButton({
            superview: this,
            text: { text: "Share" },
            icon: { 
                image: imageData.ui.fb,
                width: HEIGHT/11,
                height: HEIGHT/11,
                x: WIDTH/60,
                y: HEIGHT/50
             },
            opacity: 1,
            width: WIDTH/4,
            height: HEIGHT/7,
            on: {
                up: this._doShare          
            }
        });

        this.purchaseButton = new BaseButton({
            superview: this,
            text: { text: "Ads", x: HEIGHT/32, y: HEIGHT/70, wrap: true },
            visible: GC.app.ads,
            icon: {
                image: imageData.ui.icons.not,
                height: HEIGHT/16,
                width: HEIGHT/16,
                x: HEIGHT/32,
                y: HEIGHT/32
            },
            width: WIDTH/6,
            height: HEIGHT/8,
            on: {
                up: bind(this, function() {
                    BL.purchase("no_ads");
                })
            }
        });
        this.purchaseButton.style.x = WIDTH/40;
        this.purchaseButton.style.y = HEIGHT - HEIGHT/7;


        _shareButton._text.style._padding.left = _shareButton.style.height*.5;
        _shareButton.style.x = WIDTH/2 - _shareButton.style.width/2;
        _shareButton.style.y = HEIGHT/2;
        _highScoreView.style.x = WIDTH/2 - _highScoreView.style.width/2;
        _lbButton.style.x = WIDTH - (_lbButton.style.width + WIDTH/40);
        _lbButton.style.y = HEIGHT - HEIGHT/7;
        _textView.style.x = WIDTH/2 - _textView.style.width/2;
        _textView.style.y, _highScoreView.style.y = HEIGHT/1.5;

        _textPosX = {
            gameOver : _textView.style.x,
            highScore : _highScoreView.style.x
        };

        _textPosY = {
            gameOver : _textView.style.y,
            highScore : _highScoreView.style.y
        };

         _shareButton.startButtonAnim();
    };

    this.writeToFile = function(score) {
        storageManager.setData(KEY_HIGH_SCORE, score);
    };

    this._runBounceAnimation = function(origStyle) {
        animate(_highScoreView)
            .now({y: origStyle.y-10}, 500, animate.easeIn)
            .then({y: origStyle.y}, 500, animate.easeOut)
            .then(function() {
                this.style.visible && this._runBounceAnimation(origStyle);
            }.bind(this));
    };

    this._fbLogin = function() { 
        if(!GC.app.device.isIOS) {
            FB.getLoginStatus(function(response) {
                if(response == "connected") {
                    this._doShare();
                } else {
                    FB.login(function(response) {
                        if (response.authResponse) {
                            this._doShare();
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                        }
                    }, {
                        scope: 'publish_actions',
                        return_scopes: true
                    });
                }
            }).bind(this);
        }
    };

    this._doShare = function() {
        FB.ui({
          method: 'share',
          href: 'https://play.google.com/store/apps/details?id=com.saucygames.ChubbyDragon',
          name: 'I burned '+GC.app.highScore+' calories in Chubby Dragon!',
          description: 'Can you beat my score?',
          caption: 'Download Chubby Dragon on Google Play!',
          picture: 'http://www.designethereal.com/cd/icon512.png'
        }, function(response){});
    };
});