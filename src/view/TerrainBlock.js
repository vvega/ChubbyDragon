import ui.ImageView as ImageView;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;
import math.geom.Circle as Circle;


exports = Class(ImageView, function(supr) {

    var _parent;
    var _character;
    var _boundingCircle;
    
    this.init = function(opts) {
        opts = merge(opts, {
             image: "resources/images/terrain_block.png"
        });
        _parent = opts.superview;
        _character = opts.character;
        opts._active = false;

        supr(this, 'init', [opts]);

        _boundingCircle = new Circle(this.style.x, _parent.style.height - this.style.y, this.style.width/1.5);
    };
    
    //check for collision
    this.tick = function(dt) {
        if(!_character.isImmune() && this._opts._harmful === true) {
            _boundingCircle.x = this.getPosition().x / this.getPosition().scale;
            _boundingCircle.y = this.getPosition().y / this.getPosition().scale;
            if(intersect.circleAndRect(_boundingCircle, _character.collisionBox) === true) {
                _character.kill();
            }
        }
    };
});
