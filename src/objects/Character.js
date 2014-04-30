import ui.SpriteView as SpriteView;
import math.geom.Point as Point;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;
import math.geom.Line as Line;
import animate;


exports = Class(SpriteView, function(supr) {
    var parent;
    var width, height;
    var collisionBoxHeight, collisionBoxWidth, origX, origY;
    var IMMUNITY_TIMEOUT = 3000;

    this.init = function(opts) {       
        opts = merge(opts, {
        });
        
        parent = opts.superview;
                
        this.weight = 1;
        this.score = 0;
        this.immune = false;
        
        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
                      
        width = opts.width;
        height = opts.height;
        collisionBoxWidth = width/3;
        collisionBoxHeight = height/2;
        origY = opts.y;
        origX = opts.x;

        this.build(opts);
    };
    
    this.build = function(opts) {
        
        //Create line from collisionPoints.
        //(From top right of sprite to halfway down in height with some x-cushion)
        var collisionPoints = {
           startPoint: new Point({
                x: opts.x + width/1.25,
                y: opts.y
             }),
            endPoint: new Point({
                x: opts.x + width/1.25,
                y: opts.y + height/2
            })
        }
 
        this.collisionLine = new Line(collisionPoints.startPoint, collisionPoints.endPoint); 
        this.collisionBox = new Rect(opts.x + collisionBoxWidth, opts.y, collisionBoxWidth,  collisionBoxHeight);

        this.initImmunityTimeout();
    };
    
    //handles immunity status
    this.initImmunityTimeout = function(){
        
        this.immune = true;
        var char = this;
        
        var animation;
        
        setTimeout(function(){
            animation.clear();
            char.immune = false;
            char.emit("character:ready");
        }, IMMUNITY_TIMEOUT);
        
        //scales animation duration based upon timeout length
        animation = animate(char)
              .now({ opacity: .4 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
              .then({ opacity: 1 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
              .then({ opacity: .4 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
              .then({ opacity: 1 }, IMMUNITY_TIMEOUT/4, animate.easeIn );
        
    };
    
    this.updateCollisionPoints = function(){
        
        //update collision line (for items)
         var differenceInY = origY - this.style.y;
         var startX = this.collisionLine.start.x, 
               endX = this.collisionLine.end.x;
       
         this.collisionLine.start = this.collisionLine.end = null;
         this.collisionBox = null;
         
         this.collisionLine.start = new Point({
             x: startX,
             y: origY - differenceInY
         });
         
         this.collisionLine.end = new Point({
              x: endX,
              y: (origY - differenceInY) + height/2
         });
         
         //update collision box (for terrain)
         this.collisionBox = new Rect(this.style.x + collisionBoxWidth, origY - differenceInY, collisionBoxWidth,  collisionBoxHeight);

         startX = endX = differenceInY = null;
         
    };
    
    //updates weight
    this.addToWeight = function(value) {
         
        if(!(this.weight + value > 60 || this.weight + value < -7)) {
            //limit speed max and min
            this.weight += value;
            parent.adjustSpeed(this.weight);
        }
    };
    
    //adds score to scoreboard
    this.addToScore = function(value) {     
        parent.updateScoreBoard(this.score + value);
    };
    
    //kills character
    this.kill = function() {

        this.immune = true;
        this.pause();

        animate(this)
           .now({ y: parent.style.height/2 }, 200, animate.linear)
           .then({ y: parent.style.height + (this.style.height) }, 500, animate.linear)
           .then(bind(this, function() {
              
               this.emit("character:die");
               
               if(parent.getLives() > 0) {
                    this.updateOpts({
                        x: origX,
                        y: origY
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

