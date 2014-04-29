import ui.ImageView as ImageView;
import math.geom.Circle as Circle;
import math.geom.intersect as intersect;
import ui.ViewPool;

exports = Class(ImageView, function(supr) {

    var badItemModifier = .5;
    var parent, boundingCircle, character, started;
 
    
    this.init = function(opts) {       
        opts = merge(opts, {
        });

        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
        parent = opts.superview;
        character = opts.character;
        
       /* character.on("character:ready", function() {
            started = true;
        });*/
       
       //initialize collision detection elements
        boundingCircle = new Circle(this.style.x, parent.style.height - this.style.y, this.style.width/2);             
        this.flaggedForRemoval = false;
        
        this.build();
    };
    
    this.build = function() {
        //initialize value and image at random
        if(this.getBGColor() === "green") {
            this.value = 1;
            this.pointValue = 100;
            this.updateOpts({
                backgroundColor: "green"
            });
        } else {
            this.value = -2;
            this.pointValue = 0;
            this.updateOpts({
                backgroundColor: "red"
            });
        }  
  
    };
    
    this.tick = function(dt) {
       //only proceed if this item hasn't already detected a collision
       if(!character.isImmune() && !this.flaggedForRemoval) {
       //    console.log("tracking..");
           boundingCircle = null;
           
           //scale the x/y coordinates based on parent layer transformations
           boundingCircle = new Circle(this.getPosition().x /this.getPosition().scale, 
                this.getPosition().y /this.getPosition().scale,
                this.style.width/2);
            
            //check for collision between this item's bounding circle and the character's collision line
            if(intersect.circleAndLine(boundingCircle, character.collisionLine) === true) {
              
                //remove this view from the layer and add use the item's value to adjust the world speed
                 parent.releaseLayerView(this);
                 character.addToWeight(this.value);

                 //flag for removal
                 this.flaggedForRemoval = true;
            }
        }
    };
    
    this.assignRandom = function(){
        
    };
    
    this.getBGColor = function(){
        if(Math.random() > badItemModifier) {
            return "green";
         } else {
            return "red";
        }
    };
    
    this.getValue = function() {
        return this.value;
    };
});