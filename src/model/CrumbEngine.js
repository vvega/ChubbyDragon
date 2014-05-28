import ui.ParticleEngine;

exports = Class(ui.ParticleEngine, function(supr) {

	var CRUMB_WIDTH = 70;
	var CRUMB_HEIGHT = 70;
	var CRUMB_R = -Math.PI / 18;
    var NUM_CRUMBS = 35;
    var NUM_ASHES = 10;

    var _data;
    var _numCrumbs;

	this.init = function(opts){
        opts = merge(opts, {
            width: CRUMB_WIDTH,
            height: CRUMB_HEIGHT,
            centerAnchor: true
        });
        this._character = opts.character;
        this._parent = opts.parent;
        _numCrumbs = NUM_CRUMBS;
        supr(this, 'init', [opts]);
	};

    this._buildParticles = function(type, at) {
        var ttl;
        var width;
        var height;
        var pObj;
        var imageArr;
        var wind;
        var deltaY;

        _numCrumbs = (type === 'burnt') ? NUM_ASHES : NUM_CRUMBS;
        _data = this.obtainParticleArray(_numCrumbs);
        imageArr = imageData.particles['crumbs_'+type]  || imageData.particles['crumbs_apple'];
        wind = (this._character.speed > 0) ? 50*this._character.speed : 50;

        for(var i = 0; i < _numCrumbs; i++) {
            pObj = _data[i];
            ttl = (type === 'burnt') 
                ? Math.random()* 500 + 1800 
                : Math.random() * 1000 + 1800;
            width = Math.random() * CRUMB_WIDTH / 3 + 2 * CRUMB_WIDTH / 3;
            height = CRUMB_HEIGHT * width / CRUMB_WIDTH;
            deltaY = (type === 'burnt') 
                ? -Math.random()*200 + Math.random()*200
                : Math.random()*(this._character.getParent().style.height*0.75 + 200);
            pObj.image = imageArr[~~(Math.random() * imageArr.length)];
            pObj.x = at.x + this._character.style.width/7;
            pObj.y = at.y + 40;
            pObj.r = CRUMB_R*Math.random();
            pObj.width = width;
            pObj.height = height;
            pObj.dx = -Math.random()*300 - wind;
            pObj.dy = deltaY;
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
