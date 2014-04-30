import ui.ImageView as ImageView;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;
import math.geom.Circle as Circle;


exports = Class(ImageView, function(supr) {
    var parent, character, boundingCircle, started;
    
    this.init = function(opts) {       
        opts = merge(opts, {
             image: "resources/images/terrain_block.png"
        });
        
        parent = opts.superview;
        character = opts.character;           
        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
        boundingCircle = new Circle(this.style.x, parent.style.height - this.style.y, this.style.width/2);
        
                
       /* character.on("character:ready", function() {
            started = true;
        });*/

    };

     this.tick = function(dt) {
        if(!character.isImmune() && this._opts._harmful === true) {

         boundingCircle = null;

         boundingCircle = new Circle(this.getPosition().x / this.getPosition().scale, 
            this.getPosition().y / this.getPosition().scale,
            this.style.width/2);

            if(intersect.circleAndRect(boundingCircle, character.collisionBox) === true) {
                //kill character
                character.kill();
            }
            /* The following will return false:  
             * 
             * var collisionBox = new Rect(100, 100, 50, 50);
             * 
             * var boundingBox = new Rect(collisionBox.x,
                                      collisionBox.y,
                                      50, 50);

              if(intersect.rectAndRect(collisionBox, boundingBox) === true) {

                 console.log("collision!");

             }*/
        }
    };
});

