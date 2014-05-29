exports = new Class(function(){

	var _sprite;

	this.init = function(opts) {
		_sprite = opts.sprite;
	};

    this.runFullJump = function() {
        var jumpAnim = (_sprite.fireBoostActive) ? 'boostJump' : 'jump';
        _sprite.isPaused && _sprite.resume();
        _sprite.setFramerate(25);
        _sprite.startAnimation(jumpAnim, {
            loop:false,
            callback: function() {
                _sprite.startAnimation(jumpAnim, {loop: false}); 
                _sprite.pause();
        }});
    }

    this.runHalfJump = function() {
        var jumpAnim = (_sprite.fireBoostActive) ? 'boostJump' : 'jump';
        _sprite.isPlaying && _sprite.stopAnimation();
        _sprite.setFramerate(25);
        _sprite.startAnimation(jumpAnim, {loop: false}); 
        _sprite.pause(); 
    };

    this.runEatAnim = function() {
        _sprite.isPlaying && _sprite.stopAnimation();
        _sprite.setFramerate(15);
        _sprite.startAnimation('eat', {loop: false, callback: bind(this, function() {
                _sprite.updateFramerate();
                _sprite.jumpActive && this.runHalfJump();
            })
        });
    };

    this.killChar = function() {
        _sprite.isPlaying && _sprite.stopAnimation();
        _sprite.startAnimation('die', {loop: false});
        _sprite.pause();
    };

    this.resumeRun = function() {
        _sprite.resume();
        _sprite.updateFramerate();
        _sprite.fireBoostActive && _sprite.startAnimation('boostRun', {loop: true});
        !_sprite.fireBoostActive && _sprite.resetAnimation();
    };

    this.activateChar = function() {
    	if(_sprite.isPlaying) {
            _sprite.resume();
        } else {
            _sprite.startAnimation('run', {loop: true});
        }
    };

    this.setBoostRun = function() {
        _sprite.jumpActive && this.runHalfJump();
    	_sprite.startAnimation('boostRun', {loop: true});
    };

    this.cancelBoost = function() {
        _sprite.jumpActive && this.runHalfJump();
        _sprite.jumpActive || _sprite.resetAnimation();
    };
});
