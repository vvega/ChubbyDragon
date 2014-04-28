import ui.SpriteView as SpriteView;
import math.geom.Point as Point;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;
import math.geom.Line as Line;


exports = Class(SpriteView, function(supr) {
    var parent, collisionPoint;
    var width, height;
    var origY;

    this.init = function(opts) {       
        opts = merge(opts, {
        });
        
        parent = opts.superview;
        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
        
                   
        width = opts.width;
        height = opts.height;
        this.origY = opts.y;
 
        
        this.build(opts);

    };
    
    this.build = function(opts) {
        
        //Create line from collisionPoints.
        //(From top right of sprite to halfway down in height with some x-cushion)
        var collisionPoints = {
           startPoint: new Point({
                x: opts.x + width/1.25,
                y: origY
             }),
            endPoint: new Point({
                x: opts.x + width/1.25,
                y: origY + height/2
            })
        }
        
        this.collisionLine = new Line(collisionPoints.startPoint, collisionPoints.endPoint); 
                   
        //this.weight = 8;
      //  this.jumpHeight = this.weight*50;

    };

    this.updateCollisionPoints = function(){
 
         var differenceInY = this.origY - this.style.y;
         var startX = this.collisionLine.start.x, 
               endX = this.collisionLine.end.x;
       
         this.collisionLine.start = this.collisionLine.end = null;
         
         this.collisionLine.start = new Point({
             x: startX,
             y: this.origY - differenceInY
         });
         
         this.collisionLine.end = new Point({
              x: endX,
              y: (this.origY - differenceInY) + height/2
         });
         
         startX = endX = differenceInY = null;
         
    };
    
    this.addToWeight = function(value) {
         
        if(this.weight + value > 60) {
            //limit speed
           console.log("limiting speed");
            return;
        } else if(this.weight + value < 1) {
            console.log("too slow");
        } else {
            this.weight += value;
            console.log("new weight:"+this.weight);
            parent.adjustSpeed(this.weight);
        }
    };
});

