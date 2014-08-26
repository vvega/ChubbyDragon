import ui.SpriteView as SpriteView;
import ui.TextView as TextView;
import src.model.AnimManager as AnimManager;
import math.geom.intersect as intersect;
import math.geom.Point as Point;
import math.geom.Rect as Rect;
import math.geom.Line as Line;
import animate;

exports = Class(SpriteView, function(supr) {

    var IMMUNITY_TIMEOUT = 2000;
    var BASE_FR = 8;
    var MAX_JUMPS = 3;

    var WIDTH, HEIGHT;
    var ORIG_X, ORIG_Y;
    var COLLISION_BOX_HEIGHT;
    var COLLISION_BOX_WIDTH;
    var SPEED_LIMIT_UPPER;
    var SPEED_LIMIT_LOWER;
    var LINE_X;
    var FIRE_OFFSET_X;
    var LINE_Y_OFFSET;
    var SCORE_TEXT_DATA;
    var SPEED_TEXT_DATA;

    var _parent;
    var _scoreText;
    var _speedText;

    this.init = function(opts) {  
        opts = merge(opts, {
            frameRate: BASE_FR,
            url: 'resources/images/dragon/dragon',
            defaultAnimation: 'run',
            autoStart: true
        });
        _parent = opts.superview;
        WIDTH = opts.width;
        HEIGHT = opts.height;
        COLLISION_BOX_WIDTH = WIDTH/3;
        COLLISION_BOX_HEIGHT = HEIGHT/3;
        SPEED_LIMIT_LOWER = GC.app.rootView.BASE_SPEED + 82;
        SPEED_LIMIT_LOWER = 3 - GC.app.rootView.BASE_SPEED;
        FIRE_OFFSET_X = WIDTH/1.5;
        LINE_X = opts.x + WIDTH/1.25;
        LINE_Y_OFFSET = HEIGHT*.27;

        this.immune = true;
        this.numJumps = MAX_JUMPS;
        this.boostLevel = 0;
        this.fireBoostActive = false;
        this.elevation = opts.elevation;
        
        supr(this, 'init', [opts]);

        SCORE_TEXT_DATA = {
            x: this.getPosition().x,
            y: this.style.y - this.style.height/4
        };

        this.ORIG_X = 0;
        this.ORIG_Y = _parent.style.height + this.style.height;

        SPEED_TEXT_DATA = {
            x: -this.style.width/15,
            y: -this.style.height/3
        };

        this.build(opts);
    };

    this.updateFramerate = function() {
        this.setFramerate(BASE_FR + this.speed);
    };

    this.resetJumps = function() {
        this.numJumps = MAX_JUMPS;
        this.jumpActive = false;
    };

    this.isImmune = function() {
        return this.immune;
    };

    this.getMaxJumps = function() {
        return MAX_JUMPS;
    };

    this.getParent = function() {
        return _parent;
    };

    this.build = function(opts) {
        //Create line from collisionPoints.
        //(From top right of sprite to halfway down in height with some x-cushion)
        var collisionPoints = {
            startPoint: new Point({
                x: LINE_X,
                y: this.elevation
             }),
            endPoint: new Point({
                x: LINE_X,
                y: this.elevation + LINE_Y_OFFSET
            })
        }
        this.collisionLine = new Line(collisionPoints.startPoint, collisionPoints.endPoint); 
        this.collisionBox = new Rect(opts.x + COLLISION_BOX_WIDTH/1.5, opts.y, COLLISION_BOX_WIDTH,  COLLISION_BOX_HEIGHT);

        //build speed and point messages
        _scoreText = new TextView({
            superview: _parent,
            layout: 'box',
            fontFamily: 'bigbottom',
            size: HEIGHT/4,
            color: "#ffc600",
            strokeColor: "#FFF",
            strokeWidth: HEIGHT/18,
            opacity: 0,
            visible: false,
            x: SCORE_TEXT_DATA.x,
            y: SCORE_TEXT_DATA.y
        });

        _speedText = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'bigbottom',
            size: HEIGHT/6,
            strokeColor: "#FFF",
            strokeWidth: HEIGHT/25,
            opacity: 0,
            visible: false,
            x: SPEED_TEXT_DATA.x,
            y: SPEED_TEXT_DATA.y
        });
    };

    this.activate = function() {
        this.speed = 1;
        this.score = 0;
        this.setFramerate(BASE_FR);
        _parent.spriteMgr.activateChar();
    };

    //Handles immunity status animation and resets associated character data
    this.initImmunityTimeout = function() {
        this.immune = true;
        this.resetAnimation();
        //scales animation duration based upon timeout length
        animate(this)
            .now({ opacity: .4 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then({ opacity: 1 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then({ opacity: .4 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then({ opacity: 1 }, IMMUNITY_TIMEOUT/4, animate.easeIn )
            .then(function() {
                this.immune = false;
                this._resetMessages();
                this.resetJumps();
            }.bind(this));
    };

    this.updateCollisionPoints = function(dt) {
        //update collision line (for items)
        this.collisionLine.start.x = LINE_X;
        this.collisionLine.start.y = (_parent.fEngine.active) ? this.style.y + LINE_Y_OFFSET : this.style.y;
        this.collisionLine.end.x = (_parent.fEngine.active) ? LINE_X + FIRE_OFFSET_X : LINE_X;
        this.collisionLine.end.y = this.style.y + LINE_Y_OFFSET;
         //update collision box (for terrain)
        this.collisionBox.x = this.style.x + COLLISION_BOX_WIDTH*1.3;
        this.collisionBox.y = this.style.y;
    };

    this.addToSpeed = function(value) {
        if(this.speed + value < SPEED_LIMIT_LOWER) {
            this.kill();
            this.speed = 1;
            _parent.adjustSpeed(this.speed);
        } else if(!(this.speed + value > SPEED_LIMIT_UPPER)) {
            this.speed += value;
            _parent.adjustSpeed(this.speed);
            this._showSpeedMessage(value);
        }
        this.updateFramerate();
    };

    this.addToScore = function(value) {
        _parent.fEngine.active || _parent.spriteMgr.runEatAnim();
        if(value) {
            value = (this.speed > 0) ? value + value*this.speed : value;
            _parent.updateScoreBoard(this.score + value);
            this._showPointMessage(value);
        }
    };

    //Performs kill animation and resets character position/animation.
    //Also calls the immunity timeout.
    this.kill = function() {
        this.immune = true;
        this.cancelFireBoost();
        this.updateFramerate();
        this.style.zIndex++;
        _parent.spriteMgr.killChar();
        animate(this)
           .now({ y: _parent.style.height/2 }, 200, animate.linear)
           .then({ y: _parent.style.height + (this.style.height)}, 500, animate.linear)
           .then(bind(this, function() {
                _parent.fEngine.cancelParticles();
                _parent.updateLives();
                if(_parent.lives > 0) {
                    this.updateOpts({
                        x: this.ORIG_X,
                        y: this.elevation,
                        zIndex: this.style.zIndex - 1
                    });
                    this.resume();
                    this.initImmunityTimeout();
                }
        }));  
    };

    this._showSpeedMessage = function(value) {
        _speedText.style.visible = true;
        if(value > 0) {
            _speedText.updateOpts({ color:'#8cb453' });
            _speedText.setText('+speed');
            animate(_speedText)
                .now({opacity: 1}, 300, animate.linear)
                .then({opacity: 0, x: -this.style.width/3, visible: false}, 400, animate.easeOut)
                .then(function() {
                    _speedText.style.visible = false;
                    this._resetMessages();
                }.bind(this));
        } else {
            _speedText.updateOpts({ color:'#d8632a' });
            _speedText.setText('-speed');
            _speedText.style.x = -this.style.width/10;
            animate(_speedText)
                .now({opacity: 1, visible: true, y: 0}, 600, animate.linear)
                .then({opacity: 0, visible: false}, 300, animate.linear)
                .then(function() {
                    _speedText.style.visible = false;
                    this._resetMessages();
                }.bind(this));
        }
    };

    this._showPointMessage = function(value) {
        _scoreText.setText("+"+value);
        _scoreText.updateOpts({ 
            color: (_parent.fEngine.active) ? '#e99338' : '#ffc600',
            size: (_parent.fEngine.active) ? HEIGHT/3 : HEIGHT/4
        });
        _scoreText.style.visible = true;
        animate(_scoreText)
            .now({opacity: 1, y: (GC.app.isTablet) ? -this.style.height/3 : -this.style.height/2}, 400, animate.linear)
            .then({opacity: 0 }, 100, animate.linear)
            .then(function() {
                _scoreText.style.visible = false;
                this._resetMessages();
            }.bind(this));
    };

    this._resetMessages = function() {
        _scoreText.updateOpts({
            x: SCORE_TEXT_DATA.x,
            y: SCORE_TEXT_DATA.y
        });
        _speedText.updateOpts({
            x: SPEED_TEXT_DATA.x,
            y: SPEED_TEXT_DATA.y
        });
    };

    this._showFireBreathText = function() {
        _parent.boostText.style.visible = true;
        var origY = _parent.boostText.style.y;
        animate(_parent.boostText)
            .now({ y: -_parent.style.height/3, opacity: 1 }, 700, animate.easeIn)
            .then({ opacity: 0 }, 1000, animate.easeOut)
            .then(function() {
                _parent.boostText.style.scale = 1;
                _parent.boostText.style.opacity = 0;
                _parent.boostText.style.visible = false;
                _parent.boostText.style.y = origY;
            });
    };

    //FIRE BOOST FUNCTIONS: Update fireBoostActive flags and communicates with the boostBar
    this.increaseBoostLevel = function(amt) {
        this.boostLevel += amt;
        _parent.boostBar.setBoostPercent(this.boostLevel*_parent.boostBar.PERCENT_INTERVAL);
    };

    this.cancelFireBoost = function() {
        this.boostLevel = 0;
        this.fireBoostActive = false;
        _parent.boostBar.depletion = false;
        _parent.boostBar.reset();
        _parent.spriteMgr.cancelBoost();
        _parent.cEngine.updateParticleData(this.fireBoostActive);
    };

    this.activateFireBoost = function() {
        this.boostLevel = 0;
        this.fireBoostActive = true;
        this._showFireBreathText();
        _parent.spriteMgr.setBoostRun();
        _parent.boostBar.depletion = true;
        _parent.cEngine.updateParticleData(this.fireBoostActive);
        _parent.fEngine.active = true;
    };
});
