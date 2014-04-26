import ui.View;
import ui.ImageView;
import ui.widget.ButtonView as ButtonView;

//TitleScreen will be a class that extends ui.ImageView
exports = Class(ui.ImageView, function (supr) {
    
    //init method is constructor for each class
    //"merge" overrides default superclass values with "options" object if desired
    this.init = function(opts) {        
        opts = merge(opts, {
            x:0,
            y:0
            //todo: image:
        });
    
    //call to super constructor with custom class options
    supr(this, 'init', [opts]);
          
    var _startButton = new ButtonView({
        superview: this,
        x: 200,
        y: 200,
        width: 200,
        height: 100,
        backgroundColor: "blue",
        title: "Start",
        on: {
            up: bind(this, function(){
                //TODO: go to game
                this.emit('titlescreen:start');
            })
        }
    });
    
    var _guideButton = new ButtonView({
        superview: this,
        x: _startButton.getPosition.x,
        y: _startButton.getPosition.y 
                - _startButton.getHeight,
        width: 200,
        height: 100,
        backgroundColor: "blue",
        title: "Guide",
        on: {
            up: bind(this, function(){
                //TODO: go to guide
            })
        }
    });
    
   /* startButton.on('selected', bind(this, function() {
        this.emit('titlescreen:start');
    }));  */
    
  };
 
});

