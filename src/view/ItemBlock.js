import ui.ImageView as ImageView;
import math.geom.Circle as Circle;
import math.geom.intersect as intersect;
import ui.ViewPool;
import animate;

exports = Class(ImageView, function(supr) {

    var _parent;
    var _character;
    var _boundingCircle;
    var _crumbEngine;
    var _elevation;
    
    this.init = function(opts) {
        _parent = opts.superview;
        _character = opts.character;
        _crumbEngine = opts.crumbGen;

        supr(this, 'init', [opts]);

        _boundingCircle = new Circle(this.style.x, _parent.style.height - this.style.y, this.style.width/2);
        _elevation = this.style.y;
        this.flaggedForRemoval = false;
        this.activeAnim = false;
    };

    //animates up and down until view is removed
    this._runAnimation = function() {
        if(this.activeAnim) {
            animate(this)
                .now({y: _elevation - this.style.height/7}, 300, animate.linear)
                .then({y: _elevation + this.style.height/7}, 300, animate.linear)
                .then({y: _elevation}, 300, animate.linear)
                .then(function() {
                    this._runAnimation();
                }.bind(this));
        }
    };

    this.tick = function(dt) {
        if(!this.activeAnim && this.style.visible) {
            this.activeAnim = true;
            this._runAnimation();
        }
        //only proceed if this item hasn't already detected a collision
        if(!_character.isImmune() && !this._opts._flaggedForRemoval) {
            //update bounding circle & scale the onscreen x/y coordinates based on parent layer scaling
            _boundingCircle.x = this.getPosition().x / this.getPosition().scale;
            _boundingCircle.y = this.getPosition().y / this.getPosition().scale;
            if(intersect.circleAndLine(_boundingCircle, _character.collisionLine) === true) {
                //remove this view from the layer and add use the item's value to adjust the world speed
                _crumbEngine.emitParticles(this._opts.type);
                _character.addToScore(this._opts._pointValue);
                _character.addToSpeed(this._opts._value);
                this.activeAnim = false;
                this._opts._flaggedForRemoval = true;
                _parent.releaseLayerView(this);
            }
        }
    };
});
