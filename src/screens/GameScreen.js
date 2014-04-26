import ui.View as View;
import ui.ImageView;
import ui.ImageScaleView;
import ui.TextView;
import ui.ScrollView;
import src.objects.TerrainBlock as TerrainBlock;
import ui.ViewPool as ViewPool;
import animate;

exports = Class(ui.ImageView, function (supr){
    var width;
    var height;
    
    var TERRAIN_BLOCK_SIZE;
    var speedModifier;
    var speed = 3000;
    
    this.init = function(opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            zIndex: 0,
            image: "resources/images/forest-background.png"
        });
    
        supr(this, 'init', [opts]);
        
        width = opts.width;
        height = opts.height;
        
        //scale to device size
        TERRAIN_BLOCK_SIZE = height/6;
        speedModifier = 3;
        
        this.build();
    };
    
    //override build function to add new components
    this.build = function(){
        this.on('app:start', bind(this, start_game_flow));
        
        this._scoreboard = new ui.TextView({
            superview: this,
            x: 0,
            y: 15,
            width: 100,
            height: 50,
            autoSize: false,
            size: 38,
            backgroundColor: "black",
            verticalAlign: 'middle',
            horizontalAlign: 'center',
            wrap: false,
            color: '#fff'
        });
        
        this._level = new ViewPool({
            ctor: TerrainBlock,
            initCount: 20,
            initOpts: {
                superview: this,
                width: TERRAIN_BLOCK_SIZE,
                height: TERRAIN_BLOCK_SIZE,
                image: "resources/images/terrain_block.png"
                
            }
        });
    
        this.tick = bind(this, function(dt) {
            console.log(dt);
             if (dt % 4 == 0) {
                var view = this._level.obtainView();
                
                //NEED to make a call to updateOpts for some reason(?)
                view.updateOpts({
                    superview: this,
                    width: TERRAIN_BLOCK_SIZE,
                    height: TERRAIN_BLOCK_SIZE,
                    x: width,
                    y: height - TERRAIN_BLOCK_SIZE,
                    visible: true
                 });

             animate(view)
                .now({ x: -TERRAIN_BLOCK_SIZE }, speed, animate.linear)
                .then(bind(this, function() {
                      this._level.releaseView(view);
                 }));
            }
            
        });
        
      /*  var i = 0;
        while(i <= width) {
            this.addSubview(new TerrainBlock({
                width: TERRAIN_BLOCK_SIZE,
                height: TERRAIN_BLOCK_SIZE,
                x: i,
                y: height - TERRAIN_BLOCK_SIZE
            }));
            i += TERRAIN_BLOCK_SIZE + 10;
        }*/
    };
    
    this.addToScoreboard = function(additionalValue) {
        this._scoreboard.setText(parseInt(this._scoreboard.getText) + additionalValue);
    };
    
    function getSpeed() {
        return TERRAIN_BLOCK_SIZE/speedModifier;
    }
    
    function setSpeed(value) {
        speed = value;
    }
    
     function buildGameFloor() {
       
    }
    
    function start_game_flow() {
        console.log("game started!");
        buildGameFloor();
              
    }
});

