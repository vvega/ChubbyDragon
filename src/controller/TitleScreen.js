import ui.View;
import ui.ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.TextView as TextView;
import src.view.BaseView as BaseView;
import animate;

exports = Class(BaseView, function (supr) {

    var _textPosX;
    var _textPosY;
    var _textView;
    var _subtitleView;
    var _highScoreView;

    this.constructView = function() {
        supr(this, 'constructView');

        _textView.style.visible = true;
        _highScoreView.style.visible = true;

        animate(_textView)
            .now({ y: -HEIGHT/2.5, opacity: 1 }, 500, animate.easeIn)
            .then(function() {
                animate(_highScoreView)
                .now({ y: -HEIGHT/6.3, opacity: 1 }, 300, animate.easeIn)
            });
    };

    this.resetView = function() {
        _textView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibile: false,
            opacity: 0
        });
        _highScoreView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibile: false,
            opacity: 0
        });
        _highScoreView.setText("Current High Score: "+GC.app.highScore);
    };

    this.build = function() {

        this.mountainView = new ui.ImageView({
            image: "resources/images/mountains.png",
            superview: this,
            x: 0,
            width: WIDTH,
            height: HEIGHT/2,
            y: HEIGHT - HEIGHT/2
        });

        _textView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "ChubbyDragon",
            size: HEIGHT/6,
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
            cols: 3,
            rows: 6
        });

        var startButton = new ButtonView({
            superview: buttonGrid,
             text: {
                 fontFamily: 'tiptoe',
                 text: "Start",
                 verticalAlign: "middle",
                 horizontalAlign: "center",
                 padding: [0,0,65,0],
                 color: "#FFF"
                },
                backgroundColor: "#d2a734",
                opacity: 1,
                col: 1,
                row: 3,
                on: {
                    up: bind(this, function(){
                        GC.app.transitionViews(GC.app.gameView);
                    })
                }
        });

        _textPosX = _textView.style.x;
        _textPosY = _textView.style.y;
    };
});
