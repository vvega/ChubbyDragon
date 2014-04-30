import ui.View as View;
import ui.TextView as TextView;
import ui.widget.GridView as GridView;
import ui.widget.ButtonView as ButtonView;
import animate;

exports = Class(View, function (supr){
    var width, height, parent; 
    
    this.init = function(opts) {
            opts = merge(opts, {
                x: 0,
                y: 0
            });

            supr(this, 'init', [opts]);

            width = opts.width;
            height = opts.height;
            parent = opts.superview;

            this.build();
        };

        //override build function to add new components
        this.build = function(){   
            this.on('gameover:gameover', bind(this, buildView)); 
        };
        
        function buildView(hi_score_flag, score) {

            var textView = new TextView({
                superview: this,
                layout: 'box',
                fontFamily: 'tiptoe',
                text: "Game Over!",
                size: height/5,
                strokeColor: "#ffc600",
                strokeWidth: height/18,
                opacity: .4,
                color: "#FFF",
                wrap: true
            });

            if(hi_score_flag) {
        
                var highScoreView = new TextView({
                    superview: this,
                    layout: 'box',
                    fontFamily: 'tiptoe',
                    text: "New High Score!",
                    size: height/10,
                    strokeColor: "#FFF",
                    strokeWidth: height/30,
                    opacity: 0,
                    color: "#ffc600",
                    wrap: true
                });

              //  this.writeToFile(score);
             }

            var buttonGrid = new GridView({
                superview: this,
                width: this.style.width,
                height: this.style.height,
                verticalMargin: 20,
                cols: 3,
                rows: 6
            });

            var replayButton = new ButtonView({
                superview: buttonGrid,
                title: "Play Again",
                width: 200,
                height: 100,
                backgroundColor: "blue",
                opacity: 1,
                col: 1,
                row: 3,
                on: {
                   up: function () {
                       this.emit("gameover:replay");
                    }.bind(this)
                  }
            });

            var exitButton = new ButtonView({
                 superview: buttonGrid,
                title: "Back to Menu",
                backgroundColor: "blue",
                opacity: 1,
                col: 1,
                row: 4,
                on: {
                   up: function () {
                     this.emit("gameover:menu");
                    }.bind(this)
                }
            });

           // this.addSubview(buttonGrid);
           // this.addSubview(textView);

            animate(textView)
               .now({ y: -height/2.5, opacity: 1 }, 500, animate.easeIn)
               .then(function() {
                   //insert high score view
                   if(highScoreView) {
                        highScoreView.setText("New High Score: "+score);
                         animate(highScoreView)
                         .now({ y: -height/6.3, opacity: 1 }, 300, animate.easeIn)
                   }
               });   
  
        };
        this.writeToFile = function(score) {
       /*  var fs = require('fs');
         fs.writeFile('../../resources/cache/data.json', 
           '{highscore: '+score+'}', function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
          });*/
        };
});