import ui.ImageView as ImageView;
import math.geom.Circle as Circle;
import math.geom.intersect as intersect;
import ui.ViewPool;

exports = Class(ImageView, function(supr) {

    var _parent;
    var _character;
    var _boundingCircle;
    
    this.init = function(opts) {       

        _parent = opts.superview;
        _character = opts.character;

        //call to super constructor with custom class options
        supr(this, 'init', [opts]);

        //initialize collision detection elements
        _boundingCircle = new Circle(this.style.x, _parent.style.height - this.style.y, this.style.width/2);             
        
        this.flaggedForRemoval = false;
    };
    
    this.tick = function(dt) {
        //only proceed if this item hasn't already detected a collision
        if(!_character.isImmune() && !this.flaggedForRemoval) {
           
            //update bounding circle
            //scale the onscreen x/y coordinates based on parent layer scaling
            _boundingCircle.x = this.getPosition().x / this.getPosition().scale;
            _boundingCircle.y = this.getPosition().y / this.getPosition().scale;

            //check for collision between this item's bounding circle and the character's collision line
            if(intersect.circleAndLine(_boundingCircle, _character.collisionLine) === true) {
              
                //remove this view from the layer and add use the item's value to adjust the world speed
                _parent.releaseLayerView(this);
                _character.addToWeight(this._opts.value);
                _parent.getSuperview().getSuperview().updateScoreBoard(this._opts.pointValue);

                //flag for removal
                this.flaggedForRemoval = true;
            }
        }
    };
});