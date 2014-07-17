import ui.View as View;
import ui.ImageScaleView as ImageScaleView;
import ui.ParticleEngine as ParticleEngine;

exports = Class(ImageScaleView, function(supr) {

	var FRAME_WIDTH;
	var FRAME_HEIGHT;
	var BOOST_FILL;
	var BOOST_X = 0;
	var BOOST_Y;
	var DEPLETION_MOD = 3;
	var SPARK_BOOST;

	var _parent;
	var _boostPct;
	var _boostTargetPct;
	var _random = Math.random;
	var _time = 0;

	this.init = function(opts) {
		FRAME_WIDTH = opts.width;
		FRAME_HEIGHT = opts.height;
		_parent = opts.superview;
		opts.y = _parent.style.height - FRAME_HEIGHT;
		opts.x = 0;
		opts.layout = 'box';
		opts.image = imageData.ui.boostBar.frame;

		supr(this, 'init', [opts]);

		BOOST_FILL = this.style.width;
		BOOST_Y = this.style.height*.95;
		SPARK_BOOST = imageData.particles.flames[0];
		this.PERCENT_INTERVAL = 10;

		this.build();
		this.reset();
	};

	this.build = function() {
		this.clipper = new View({
			parent: this,
			width: FRAME_WIDTH,
			height: FRAME_HEIGHT,
			clip: true,
			canHandleEvents: false
		});

		this.boostBar = new ImageScaleView({
			parent: this.clipper,
			width: FRAME_WIDTH,
			height: FRAME_HEIGHT,
			scaleMethod: 'tile',
			columns: this.columns,
			image: imageData.ui.boostBar.bar,
			canHandleEvents: false
		});

		this.pEngine = new ParticleEngine({
			parent: this,
			width: FRAME_WIDTH,
			height: FRAME_HEIGHT,
			initCount: 20,
			initImage: SPARK_BOOST
		});
	};

	this.reset = function(config) {
		_boostPct = 1;
		_boostTargetPct = 1;
		_time = 0;
		this.step(0);
	};

	//Changes fireboost bar. Constantly updates the boost bar based upon the target percent
	//specified in setBoostPercent. Depletion property decrements boost target until beginning of bar.
	//Handles activating/canceling fire boost mode based upon bar fill.
	this.step = function(dt) {
		_time += dt;
		if(this.depletion && _time % DEPLETION_MOD == 0) {
			_boostTargetPct--;
		}

		_boostPct = (_boostTargetPct + 5 * _boostPct) / 6;
		var initialBoost = this.clipper.style.width;

		if(_boostPct) {
			this.clipper.style.width = BOOST_X + (_boostPct/100) * BOOST_FILL;
		}

		var dBoost = this.clipper.style.width - initialBoost;
		if(dBoost > 0.05) {
			this.emitGainParticle(this.clipper.style.width, BOOST_Y, SPARK_BOOST);
		} 

		if((this.clipper.style.width >= ~~BOOST_FILL) && !_parent.character.fireBoostActive) {
			_boostTargetPct = 100;
			_parent.character.activateFireBoost();
		} else if(this.clipper.style.width <= BOOST_X) {
			_parent.character.cancelFireBoost();
		}

		this.pEngine.runTick(dt);
	};

	this.setBoostPercent = function(percent, instant) {
		_boostTargetPct = percent;
		instant && (_boostPct = percent);
	};

	this.emitGainParticle = function(x, y, img) {
		var data = this.pEngine.obtainParticleArray(1);
		var pObj = data[0],
			size = 10 + _random() * 20,
			ttl = 500,
			stop = -1000 / ttl;

		pObj.x = x - size / 2;
		pObj.y = y - size / 2 + _random() * 10 - 5;
		pObj.r = _random() * 6.28;
		pObj.dr = _random() * 6.28 - 3.14;
		pObj.ddr = stop * pObj.dr;
		pObj.anchorX = pObj.anchorY = size / 2;
		pObj.width = pObj.height = size;
		pObj.dscale = stop;
		pObj.dopacity = stop;
		pObj.image = img;
		pObj.ttl = ttl;

		this.pEngine.emitParticles(data);
	};
});