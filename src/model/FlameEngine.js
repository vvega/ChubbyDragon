import ui.ParticleEngine;

exports = Class(ui.ParticleEngine, function(supr) {

	var FLAME_WIDTH;
	var FLAME_HEIGHT;
    var NUMB_FLAMES = 2;
	var FLAME_R = Math.PI / 2;

	var _character;
	var _time = 0;
    var _random = Math.random;

	this.init = function(opts) {
		_character = opts.character;
		supr(this, 'init', [opts]);
        this._buildParticles();
        this.active = false;
        FLAME_HEIGHT = _character.style.width/4;
        FLAME_WIDTH = FLAME_HEIGHT*.5;
	};

	this.runTick = function(dt) {
		_time += dt;
		if(_character.fireBoostActive && _time % 3 == 0) {
			this.emitParticles();
		}
        _character.fireBoostActive || this._finish(dt);
		supr(this, 'runTick', [dt]);
	};

    //This function is called in order to keep flame boost collision active until most particles have deceased.
    //Will also clean up all particles once the last particle rendered is gone.
    this._finish = function(dt) {
        if(this.active) {
            var lastParticle = this.activeParticles[~~(this.activeParticles.length*.2)];
            if(lastParticle) {
                var data = lastParticle.pData;
                if(data && (data.elapsed + dt > data.ttl)) {
                    //last active particle is dead
                    this.active = false;
                    this.killAllParticles();
                }
            }
        }
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
            ttl = _random() * 1000 + 1800;
            width = _random() * FLAME_WIDTH / 3 + 2 * FLAME_WIDTH / 3;
            height = FLAME_HEIGHT * width / FLAME_WIDTH;
            pObj.image = imageArr[~~(_random() * imageArr.length)];
            pObj.x = _character.collisionLine.start.x + _character.style.width/3.3;
            pObj.y = _character.collisionLine.end.y;
            pObj.r = FLAME_R;
            pObj.width = width;
            pObj.height = height;
            pObj.dx = _character.collisionLine.end.x - _character.collisionLine.start.x;
            pObj.dy = _random()*_character.style.height/2 + _random()*-_character.style.height/5;
            pObj.dr = _random()*Math.PI/8;
            pObj.dheight = -height/1.5;
            pObj.dwidth = -width/1.5;
            pObj.ddx = _random()*30;
            pObj.ddy = _random()*30;
            pObj.ttl = ttl;
        }
    };

    this.emitParticles = function() {
        supr(this, 'emitParticles', [_data]);
        this._buildParticles();
	};
});