import ui.SpriteView as SpriteView;
import src.SpriteManager as SpriteManager;
import math.geom.intersect as intersect;
import math.geom.Point as Point;
import math.geom.Rect as Rect;
import math.geom.Line as Line;
import animate;

exports = Class(SpriteView, function(supr) {

    var WIDTH, HEIGHT;
    var ORIG_X, ORIG_Y;
    var COLLISION_BOX_HEIGHT;
    var COLLISION_BOX_WIDTH;
    var IMMUNITY_TIMEOUT = 3000;

    var _parent;
    var _startX;
    var _endX;
    var _differenceInY;

    this.init = function(opts) {  

        var imageData = SpriteManager.getImageData();

        opts = merge(opts, {
            sheetData: 
                merge({ anims: imageData.sprites.hero }, imageData.sprites.sheetData)
        });     

        _parent = opts.superview;
                      
        WIDTH = opts.width;
        HEIGHT = opts.height;
        ORIG_Y = opts.y;
        ORIG_X = opts.x;
        COLLISION_BOX_WIDTH = WIDTH/2.5;
        COLLISION_BOX_HEIGHT = HEIGHT/2;

        supr(this, 'init', [opts]);

        this.build(opts);
    };
    
    this.build = function(opts) {
        
        //Create line from collisionPoints.
        //(From top right of sprite to halfway down in height with some x-cushion)
        var collisionPoints = {
           startPoint: new Point({
                x: opts.x + WIDTH/1.25,
                y: opts.y
             }),
            endPoint: new Point({
                x: opts.x + WIDTH/1.25,
                y: opts.y + HEIGHT/2
            })
        }
 
        this.collisionLine = new Line(collisionPoints.startPoint, collisionPoints.endPoint); 
        this.collisionBox = new Rect(opts.x + COLLISION_BOX_WIDTH/2, opts.y, COLLISION_BOX_WIDTH,  COLLISION_BOX_HEIGHT);
    };

    this.activate = function() {                       
        this.weight = 1;
        this.score = 0;
        this.initImmunityTimeout();
    };
    
    //handles immunity status
    this.initImmunityTimeout = function(){
      
        this.immune = true;    
        var animation;
        
        //scales animation duration based upon timeout length
        animation = animate(this)
            .now({ opacity: .4 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then({ opacity: 1 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then({ opacity: .4 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then({ opacity: 1 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then(function() {
                animation.clear();
                this.immune = false;
            }.bind(this));        
    };
    
    this.updateCollisionPoints = function(){
        
        //update collision line (for items)
        _differenceInY = ORIG_Y - this.style.y;
        _startX = this.collisionLine.start.x; 
        _endX = this.collisionLine.end.x;
       
        this.collisionLine.start.x = _startX;
        this.collisionLine.start.y = ORIG_Y - _differenceInY;
 
        this.collisionLine.end.x = _endX;
        this.collisionLine.end.y = (ORIG_Y - _differenceInY) + HEIGHT/2;
        
         //update collision box (for terrain)
        this.collisionBox.x = this.style.x + COLLISION_BOX_WIDTH/2;
        this.collisionBox.y = ORIG_Y - _differenceInY;
        this.collisionBox.width = COLLISION_BOX_WIDTH;
        this.collisionBox.height = COLLISION_BOX_HEIGHT;
    };
    
    //updates weight
    this.addToWeight = function(value) {
         
        if(!(this.weight + value > 60 || this.weight + value < -7)) {
            //limit speed max and min
            this.weight += value;
            _parent.adjustSpeed(this.weight);
        }
    };
    
    //adds score to scoreboard
    this.addToScore = function(value) {     
        _parent.updateScoreBoard(this.score + value);
    };
    
    //kills character
    this.kill = function() {

        this.immune = true;
        this.pause();

        animate(this)
           .now({ y: _parent.style.height/2 }, 200, animate.linear)
           .then({ y: _parent.style.height + (this.style.height) }, 500, animate.linear)
           .then(bind(this, function() {
              
               _parent.updateLives();
               
               if(_parent.getLives() > 0) {
                    this.updateOpts({
                        x: ORIG_X,
                        y: ORIG_Y
                    });
                    this.resume();
                    this.initImmunityTimeout();
              }             
        }));  
    };
    
    //gets immunity status
    this.isImmune = function() {
        return this.immune;
    };
});

