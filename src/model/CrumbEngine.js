import ui.ParticleEngine;

exports = Class(ui.ParticleEngine, function(supr) {
	var CRUMB_WIDTH = 70;
	var CRUMB_HEIGHT = 70;
    var NUMB_CRUMBS = 35;
	var CRUMB_R = -Math.PI / 18;

    var _data;

	this.init = function(opts){
        opts = merge(opts, {
            width: CRUMB_WIDTH,
            height: CRUMB_HEIGHT,
            centerAnchor: true
        });
        this._parent = opts.parent;
        supr(this, 'init', [opts]);
	};

    this._buildParticles = function(type, at) {
        var ttl;
        var width;
        var height;
        var pObj;
        var imageArr;
        var wind;

        _data = this.obtainParticleArray(NUMB_CRUMBS);
        imageArr = imageData.particles['crumbs_'+type]  || imageData.particles['crumbs_apple'];
        wind = (this._parent.speed > 0) ? 50*this._parent.speed : 50;

        for(var i = 0; i < NUMB_CRUMBS; i++) {
            pObj = _data[i];
            ttl = Math.random() * 1000 + 1800;
            width = Math.random() * CRUMB_WIDTH / 3 + 2 * CRUMB_WIDTH / 3;
            height = CRUMB_HEIGHT * width / CRUMB_WIDTH;
            pObj.image = imageArr[~~(Math.random() * imageArr.length)];
            pObj.x = at.start.x + this._parent.style.width/7;
            pObj.y = at.start.y - this._parent.style.height;
            pObj.r = CRUMB_R*Math.random();
            pObj.width = width;
            pObj.height = height;
            pObj.dx = -Math.random()*200 - wind;
            pObj.dy = Math.random()*(this._parent.getParent().style.height - this._parent.style.y),
            pObj.dr = Math.random()*Math.PI;
            pObj.dheight = -height;
            pObj.dwidth = -width;
            pObj.ddx = Math.random()*30;
            pObj.ddy = Math.random()*30;
            pObj.ttl = ttl;
        }
    };

    this.emitParticles = function(type, at) {
        this._buildParticles(type, at);
        supr(this, 'emitParticles', [_data]);
	};
});
