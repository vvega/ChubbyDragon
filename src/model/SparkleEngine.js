import ui.ParticleEngine;

exports = Class(ui.ParticleEngine, function(supr) {

    var SPARKLE_WIDTH;
    var SPARKLE_HEIGHT;
    var SPARKLE_R = Math.PI*2;

    var _data = [];
    var _random = Math.random;

	this.init = function(opts){
        opts.centerAnchor = true;
        this._parent = opts.parent;
        
        SPARKLE_WIDTH = 50;
        SPARKLE_HEIGHT = 50;

        supr(this, 'init', [opts]);

        this._buildParticles();
	};

    this._buildParticles = function() {

        var ttl = _random()* 500 + 1800;
        _data = this.obtainParticleArray(1);

        pObj = _data[0];
        pObj.r = SPARKLE_R*_random();
        pObj.width = SPARKLE_WIDTH;
        pObj.height = SPARKLE_HEIGHT;
        pObj.dheight = -pObj.height;
        pObj.dwidth = -pObj.width;
        pObj.x = this._parent.style.x;
        pObj.y = this._parent.style.y;
        pObj.ttl = ttl;
        pObj.image = imageData.particles.sparkles[0];
    };

    this.emitParticles = function() {
        supr(this, 'emitParticles', [_data]);
        this._buildParticles();
	};
});
