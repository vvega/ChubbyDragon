import ui.ImageView as ImageView;
import math.geom.Circle as Circle;
import math.geom.intersect as intersect;

exports = Class(ImageView, function(supr) {

    var badItemModifier = .5;
    var parent, boundingCircle, character;
    
    this.init = function(opts) {       
        opts = merge(opts, {
        });

        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
        parent = opts.superview;
        character = opts.character;
       
         boundingCircle = new Circle(this.style.x, this.style.y, this.style.width/2);
        
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
    
    this.render = function(ctx) {
       
       //update boundingCircle
       boundingCircle.x = this.getPosition().x;
       boundingCircle.y = this.getPosition().y;
     //   console.log(character.collisionLine);
       //console.log(boundingCircle.x);
       //console.log(character.collisionLine);
        boundingCircle = new Circle(this.getPosition().x, this.getPosition().y, this.style.width/2);

        if(intersect.circleAndLine(boundingCircle, character.collisionLine) === true) {
            //console.log(parent);
        //  var v_pool =  parent.getViewPool();
         // console.log(v_pool);
         // v_pool.releaseView(this);
          //.releaseView(this);
           console.log("adding:" + this.value);
        // console.log(this.value);
            character.addToWeight(this.value);
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