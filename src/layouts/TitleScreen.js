import ui.View;
import ui.ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.TextView as TextView;
import animate;

exports = Class(ui.View, function (supr) {
    
    var height, width;

    this.init = function(opts) {        
        opts = merge(opts, {
            x:0,
            y:0
        });
        
    height = opts.height;
    width = opts.width;
    

    supr(this, 'init', [opts]);
    this.build();
  };
  
  
  this.build = function() {
      this.on("app:start", bind(this, buildView));
  };
  
 function buildView() {
     var textView = new TextView({
                superview: this,
                layout: 'box',
                fontFamily: 'tiptoe',
                text: "ChubbyDragon",
                size: height/6,
                strokeColor: "#ffc600",
                strokeWidth: height/18,
                opacity: .4,
                color: "#FFF",
                wrap: true
    });
    
     var subtitleView = new TextView({
                    superview: this,
                    layout: 'box',
                    fontFamily: 'tiptoe',
                    text: "(Wolf)",
                    size: height/10,
                    strokeColor: "#ffc600",
                    strokeWidth: height/30,
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
                //TODO: go to game
                this.emit('titlescreen:start');
            })
        }
    });
    
    //TODO: Make guide
  /*  var guideButton = new ButtonView({
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
    
      
    animate(textView)
     .now({ y: -height/2.5, opacity: 1 }, 500, animate.easeIn)
     .then(function() {
          animate(subtitleView)
          .now({ y: -height/6.3, opacity: 1 }, 300, animate.easeIn)    
      });  
   };
 });



