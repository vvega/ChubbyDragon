import ui.ParticleEngine;

exports = Class(ui.ParticleEngine, function(supr) {

	var FLAME_WIDTH = 100;
	var FLAME_HEIGHT = 170;
    var NUMB_FLAMES = 2;
	var FLAME_R = Math.PI / 2;

	var _character;
	var _time = 0;

	this.init = function(opts) {
		_character = opts.parent;
		supr(this, 'init', [opts]);
	};

	this.runTick = function(dt) {
		_time += dt;
		if(_character.fireBoostActive && _time % 3 == 0) {
			this.emitParticles();
		}
		supr(this, 'runTick', [dt]);
	};

	this._buildParticles = function() {
        var ttl;
        var width;
        var height;
        var pObj;
        var imageArr;
        var wind;

        _data = this.obtainParticleArray(NUMB_FLAMES);
        imageArr = imageData.particles['flames'];

        for(var i = 0; i < NUMB_FLAMES; i++) {
            pObj = _data[i];
            ttl = Math.random() * 1000 + 1800;
            width = Math.random() * FLAME_WIDTH / 3 + 2 * FLAME_WIDTH / 3;
            height = FLAME_HEIGHT * width / FLAME_WIDTH;
            pObj.image = imageArr[~~(Math.random() * imageArr.length)];
            pObj.x = _character.collisionLine.start.x + _character.style.width/3;
            pObj.y = _character.style.height/4;
            pObj.r = FLAME_R;
            pObj.width = width;
            pObj.height = height;
            pObj.dx =  _character.collisionLine.end.x - _character.collisionLine.start.x;
            pObj.dy = Math.random()*_character.style.height/2;
            pObj.dr = Math.random()*Math.PI/8;
            pObj.dheight = -height/1.5;
            pObj.dwidth = -width/1.5;
            pObj.ddx = Math.random()*30;
            pObj.ddy = Math.random()*30;
            pObj.ttl = ttl;
        }
    };

    this.emitParticles = function() {
        this._buildParticles();
        supr(this, 'emitParticles', [_data]);
	};
});