import ui.View;
import ui.ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.TextView as TextView;
import src.layouts.BaseView as BaseView;
import animate;

exports = Class(BaseView, function (supr) {
    
    var _textPosX;
    var _textPosY;
    var _textView;
    var _subtitleView;

    this.constructView = function() {
        supr(this, 'constructView');
        
        animate(_textView)
            .now({ y: -HEIGHT/2.5, opacity: 1 }, 500, animate.easeIn)
            .then(function() {
                animate(_subtitleView)
                .now({ y: -HEIGHT/6.3, opacity: 1 }, 300, animate.easeIn)    
            });  
    };

    this.resetView = function() {
        supr(this, 'resetView');

        _textView.updateOpts({
            x: _textPosX,
            y: _textPosY,
            visibility: false,
            opacity: 0
        });

        _subtitleView.updateOpts({
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
            text: "ChubbyDragon",
            size: HEIGHT/6,
            strokeColor: "#ffc600",
            strokeWidth: HEIGHT/18,
            opacity: .4,
            color: "#FFF",
            wrap: true
        });
        
        _subtitleView = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "(Wolf)",
            size: HEIGHT/10,
            strokeColor: "#ffc600",
            strokeWidth: HEIGHT/30,
            opacity: 0,
            color: "#FFF",
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

        //TODO: Make guide
        /*var guideButton = new ButtonView({
            superview: buttonGrid,
            title: "Guide",
            backgroundColor: "blue",
            opacity: 1,
            col: 1,
            row: 4,
            on: {
                up: bind(this, function(){
                })
            }
        });*/

        _textPosX = _textView.style.x;
        _textPosY = _textView.style.y;
    };
});



