import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView;
import ui.widget.GridView as GridView;
import ui.widget.ButtonView as ButtonView;
import src.view.BaseView as BaseView;
import src.view.ui.BaseButton as BaseButton;
import animate;

exports = Class(BaseView, function (supr){

    var _textPosX;
    var _textPosY;
    var _textView;
    var _highScoreView;
    var _replayButton;
    var _exitButton;

    this.constructView = function(score) {
        supr(this, 'constructView');

        var height = (GC.app.isTablet) ? HEIGHT/7 : HEIGHT/6;

        animate(_textView)
            .now({ y: -HEIGHT/9, opacity: 1 }, 500, animate.easeIn)
            .then(function() {
                _replayButton.startButtonAnim();
                _exitButton.startButtonAnim();

                //insert high score view
                if(score > GC.app.highScore) {
                    GC.app.highScore = score;
                    _highScoreView.setText("New High Score! "+score);
                    this.writeToFile(score);
                } else {
                    _highScoreView.setText("Your score: "+score);
                }

                animate(_highScoreView)
                    .now({ y: HEIGHT/2 - height*1.3, opacity: 1 }, 300, animate.easeIn)
                    .then(function() {
                       this._runBounceAnimation(_highScoreView.style);
                    }.bind(this))

            }.bind(this));

        GC.app.sound.play('menu');
        AMP.setUserProperties({
            "score": score
        });
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
    };

    this.build = function() {

        _textView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'bigbottom',
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
            fontFamily: 'bigbottom',
            text: "New High Score!",
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
            x: WIDTH/2 - BUTTON_WIDTH/2,
            y: HEIGHT/2,
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
            x: WIDTH/2 - BUTTON_WIDTH/2,
            y: HEIGHT/2 + BUTTON_HEIGHT + 25,
            on: {
               up: function () {
                 GC.app.transitionViews(GC.app.titleScreen);
                }
            }
        });

        _textView.style.x = WIDTH/2 - _textView.style.width/2;
        _highScoreView.style.x = WIDTH/2 - _highScoreView.style.width/2;
        _textView.style.y, _highScoreView.style.y = HEIGHT/2;

        _textPosX = {
            gameOver : _textView.style.x,
            highScore : _highScoreView.style.x
        };

        _textPosY = {
            gameOver : _textView.style.y,
            highScore : _highScoreView.style.y
        };
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
});