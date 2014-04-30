import ui.ImageView as ImageView;
import math.geom.Circle as Circle;
import math.geom.intersect as intersect;
import ui.ViewPool;

exports = Class(ImageView, function(supr) {

    var parent, character, boundingCircle;
    
    this.init = function(opts) {       
        opts = merge(opts, {
        });

        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
        parent = opts.superview;
        character = opts.character;

       //initialize collision detection elements
        boundingCircle = new Circle(this.style.x, parent.style.height - this.style.y, this.style.width/2);             
        this.flaggedForRemoval = false;

    };
    
    this.tick = function(dt) {
       //only proceed if this item hasn't already detected a collision
       if(!character.isImmune() && !this.flaggedForRemoval) {
           
           //update bounding circle
           boundingCircle = null;

           //scale the x/y coordinates based on parent layer transformations
           boundingCircle = new Circle(this.getPosition().x /this.getPosition().scale, 
                this.getPosition().y /this.getPosition().scale,
                this.style.width/2);
            
            //check for collision between this item's bounding circle and the character's collision line
            if(intersect.circleAndLine(boundingCircle, character.collisionLine) === true) {
              
                //remove this view from the layer and add use the item's value to adjust the world speed
                 parent.releaseLayerView(this);
                 character.addToWeight(this._opts.value);
                 parent.getSuperview().getSuperview().updateScoreBoard(this._opts.pointValue);

                 //flag for removal
                 this.flaggedForRemoval = true;
            }
        }
    };
});