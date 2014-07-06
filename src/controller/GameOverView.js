import ui.View as View;
import ui.TextView as TextView;
import ui.ImageView;
import ui.widget.GridView as GridView;
import ui.widget.ButtonView as ButtonView;
import src.view.BaseView as BaseView;
import src.view.BaseButton as BaseButton;
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
        animate(_textView)
            .now({ y: -HEIGHT/2.5, opacity: 1 }, 500, animate.easeIn)
            .then(function() {
                _replayButton.startButtonAnim();
                _exitButton.startButtonAnim();

                //insert high score view
                if(score > GC.app.highScore) {
                    GC.app.highScore = score;
                    _highScoreView.setText("New High Score!: "+score);
                    this.writeToFile(score);
                } else {
                    _highScoreView.setText("Your score: "+score);
                }

                animate(_highScoreView)
                        .now({ y: -HEIGHT/6.3, opacity: 1 }, 300, animate.easeIn)
        }.bind(this));
    };

    this.resetView = function() {
        _textView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibility: false,
            opacity: 0
        });
        _highScoreView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibility: false,
            opacity: 0
        });
    };

    this.build = function() {

        _textView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "Game Over!",
            size: HEIGHT/5,
            strokeColor: "#ffc600",
            strokeWidth: HEIGHT/18,
            opacity: .4,
            color: "#FFF",
            wrap: true
        });

        _highScoreView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "New High Score!",
            size: HEIGHT/10,
            strokeColor: "#FFF",
            strokeWidth: HEIGHT/30,
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

        _replayButton = new BaseButton({
            superview: buttonGrid,
            text: { text: "Replay" },
            opacity: 1,
            col: 1,
            row: 3,
            on: {
               up: function () {
                   GC.app.transitionViews(GC.app.gameView);
                }
              }
        });

        _exitButton = new BaseButton({
            superview: buttonGrid,
            text: { text: "Menu" },
            opacity: 1,
            col: 1,
            row: 4,
            on: {
               up: function () {
                 GC.app.transitionViews(GC.app.titleScreen);
                }
            }
        });

        _textPosX = _textView.style.x;
        _textPosY = _textView.style.y;
    }

    this.writeToFile = function(score) {
        dataManager.setData(KEY_HIGH_SCORE, score);
    };
});