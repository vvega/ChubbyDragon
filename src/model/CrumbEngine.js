import ui.ParticleEngine;

exports = Class(ui.ParticleEngine, function(supr) {

	var CRUMB_WIDTH = 70;
	var CRUMB_HEIGHT = 70;
	var CRUMB_R = -Math.PI / 18;
    var NUM_CRUMBS = 35;
    var NUM_ASHES = 10;

    var _data = [];
    var _imageArr = [];
    var _numCrumbs;
    var _random = Math.random;

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

        this.updateParticleData(this._character.fireBoostActive);
	};

    //Update particles builds/rebuilds persistent particle data according to character fireboost flag.
    //This is called upon initialization, after particles are emitted, and when fireboost status changes.
    //Aimed at reducing particle property computation on the fly.
    this.updateParticleData = function (fireBoost) {
        _numCrumbs = (fireBoost) ? NUM_ASHES : NUM_CRUMBS;
        this._buildPersistentParticleData();
    };

    this._buildPersistentParticleData = function() {
        var wind;
        var width;
        var height;

        wind = (this._character.speed > 0) ? 50*this._character.speed : 50;
        width = _random() * CRUMB_WIDTH / 3 + 2 * CRUMB_WIDTH / 3;
        height = CRUMB_HEIGHT * width / CRUMB_WIDTH;
        _data = this.obtainParticleArray(_numCrumbs);

        for(var i = 0; i < _numCrumbs; i++) {
            pObj = _data[i];
            pObj.r = CRUMB_R*_random();
            pObj.width = width;
            pObj.height = height;
            pObj.dx = -_random()*300 - wind;
            pObj.dr = _random()*Math.PI;
            pObj.dheight = -height;
            pObj.dwidth = -width;
            pObj.ddx = _random()*30;
            pObj.ddy = _random()*30;
        }
    };

    this._buildParticles = function(type, at) {
        var ttl;
        var pObj;
        var imageArr;
        var deltaY;

        imageArr = imageData.particles['crumbs_'+type]  || imageData.particles['crumbs_apple'];

        for(var i = 0; i < _numCrumbs; i++) {
            ttl = (type === 'burnt') 
                ? _random()* 500 + 1800 
                : _random() * 1000 + 1800;
            deltaY = (type === 'burnt') 
                ? -_random()*200 + _random()*200
                : _random()*(this._character.getParent().style.height*0.75 + 200);
            pObj = _data[i];
            pObj.dy = deltaY;
            pObj.image = imageArr[~~(_random() * imageArr.length)];
            pObj.x = at.x + this._character.style.width/7;
            pObj.y = at.y + 40;
            pObj.ttl = ttl;
        }
    };

    this.emitParticles = function(type, at) {
        this._buildParticles(type, at);
        supr(this, 'emitParticles', [_data]);
        this.updateParticleData(this._character.fireBoostActive);
	};
});
