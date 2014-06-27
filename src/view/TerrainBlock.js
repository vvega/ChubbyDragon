import ui.ImageView as ImageView;
import math.geom.Rect as Rect;
import math.geom.intersect as intersect;
import math.geom.Circle as Circle;
import src.model.SparkleEngine as SparkleEngine;


exports = Class(ImageView, function(supr) {

    var _parent;
    var _boundingCircle;
    var _pEngine;
    
    this.init = function(opts) {
        opts = merge(opts, {
             image: "resources/images/terrain_block.png"
        });
        _parent = opts.superview;
        opts._active = false;

        supr(this, 'init', [opts]);

        _boundingCircle = new Circle(this.style.x, _parent.style.height - this.style.y, this.style.width/1.7);
        _pEngine = new SparkleEngine({
            parent: this
        });
    };

    this._animateShine = function() {
        _pEngine.emitParticles();
    };

    //check for collision
    this.tick = function(dt) {
        if(dt % 3 === 0 && this._opts._harmful) {
            this._animateShine();
        }
        if(!_parent.character.isImmune() && this._opts._harmful === true) {
            _boundingCircle.x = this.getPosition().x / this.getPosition().scale;
            _boundingCircle.y = this.getPosition().y / this.getPosition().scale;
            if(intersect.circleAndRect(_boundingCircle, _parent.character.collisionBox) === true) {
                _parent.character.kill();
            }
        }
    };
});
