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

    var BOOST_MULTIPLIER = 2;
    
    this.init = function(opts) {
        _parent = opts.superview;
        _character = opts.character;
        _crumbEngine = opts.crumbGen;
        _flameEngine = opts.flameGen;

        supr(this, 'init', [opts]);

        _boundingCircle = new Circle(this.style.x, _parent.style.height - this.style.y, this.style.width/2);
        _elevation = this.style.y;

        this.activeAnim = false;
        this._flaggedForRemoval = false;
        this._opts._flaggedForRemoval = false;
        this._opts._active = false;
    };

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

    //This tick manages several aspects of the item objects:
    //  1) Activates item animation if it's visible.
    //  2) If the character isn't immune and the item hasn't already been eaten, check for collision using actual(unscaled) position relative to the screen.
    //  3) Upon collision, update character stats based upon item values and fire boost flag, then release the view back to the pool.
    this.tick = function(dt) {
        if(!this.activeAnim && this.style.visible) {
            this.activeAnim = true;
            this._runAnimation();
        }
        if(!_character.isImmune() && !this._opts._flaggedForRemoval) {

            _boundingCircle.x = this.getPosition().x / this.getPosition().scale;
            _boundingCircle.y = this.getPosition().y / this.getPosition().scale;

            if(intersect.circleAndLine(_boundingCircle, _character.collisionLine) === true) {
                var pointValue = (_flameEngine.active) ? this._opts._pointValue*BOOST_MULTIPLIER : this._opts._pointValue;
                this._opts.type = (_flameEngine.active) ? 'burnt' : this._opts.type;

                _flameEngine.active || _character.increaseBoostLevel(this._opts._boostValue);
                (_flameEngine.active && this._opts._value < 0) || _character.addToSpeed(this._opts._value);
                
                _character.addToScore(pointValue);
                this._opts.type && _crumbEngine.emitParticles(this._opts.type, _boundingCircle);
                this.activeAnim = false;
                this._opts._flaggedForRemoval = true;

                _parent.releaseLayerView(this);
            }
        }
    };
});
