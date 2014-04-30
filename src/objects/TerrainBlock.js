import ui.ImageView as ImageView;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;
import math.geom.Circle as Circle;


exports = Class(ImageView, function(supr) {
    
    var parent, character, boundingCircle;
    
    this.init = function(opts) {       
        opts = merge(opts, {
             image: "resources/images/terrain_block.png"
        });
        
        parent = opts.superview;
        character = opts.character;           

        supr(this, 'init', [opts]);
        
        boundingCircle = new Circle(this.style.x, parent.style.height - this.style.y, this.style.width/2);
    };
    
    //check for collision
     this.tick = function(dt) {
        if(!character.isImmune() && this._opts._harmful === true) {
            
            //update bounding circle
            boundingCircle = null;
            
            //scale the x/y coordinates based on parent layer transformations
            boundingCircle = new Circle(this.getPosition().x / this.getPosition().scale, 
               this.getPosition().y / this.getPosition().scale,
               this.style.width/2);

               if(intersect.circleAndRect(boundingCircle, character.collisionBox) === true) {
                   //kill character
                   character.kill();
               }
        }
    };
});

