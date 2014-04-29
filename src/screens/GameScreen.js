import ui.View as View;
import ui.ImageView;
import ui.ImageScaleView;
import ui.TextView;
import ui.ScrollView;
import src.screens.GameView as GameView;

exports = Class(ui.ImageView, function (supr){
    var width;
    var height;
    
    this.init = function(opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            zIndex: 0
        });
    
        supr(this, 'init', [opts]);
        
        width = opts.width;
        height = opts.height;
        
        this.build();
    };
    
    //override build function to add new components
    this.build = function(){
        
        this.on('app:start', bind(this, start_game_flow));
       
    };
    
    this.addToScoreboard = function(additionalValue) {
        this._scoreboard.setText(parseInt(this._scoreboard.getText) + additionalValue);
    };
    
    function start_game_flow() {
        console.log("game started!");
              //gameView will handle generation of scrolling objects    
        var gameView = new GameView({
            superview: this,
            width: width,
            height: height
        });     
    }
});

