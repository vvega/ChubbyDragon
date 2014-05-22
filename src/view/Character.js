import ui.SpriteView as SpriteView;
import ui.TextView as TextView;
import src.model.SpriteManager as SpriteManager;
import math.geom.intersect as intersect;
import math.geom.Point as Point;
import math.geom.Rect as Rect;
import math.geom.Line as Line;
import animate;

exports = Class(SpriteView, function(supr) {

    var WIDTH, HEIGHT;
    var ORIG_X, ORIG_Y;
    var COLLISION_BOX_HEIGHT;
    var COLLISION_BOX_WIDTH;
    var IMMUNITY_TIMEOUT = 3000;
    var BASE_FR = 8;
    var MAX_JUMPS = 3;
    var SPEED_LIMIT_UPPER;
    var SPEED_LIMIT_LOWER;

    var _parent;
    var _scoreText;
    var _speedText;

    this.init = function(opts) {  
        opts = merge(opts, {
            frameRate: BASE_FR,
           /* sheetData: 
                merge({ anims: imageData.sprites.hero }, imageData.sprites.sheetData)*/
            url: 'resources/images/dragon/dragon',
            defaultAnimation: 'run',
            autoStart: true
        });
        _parent = opts.superview;
        WIDTH = opts.width;
        HEIGHT = opts.height;
        ORIG_Y = opts.y;
        ORIG_X = opts.x;
        COLLISION_BOX_WIDTH = WIDTH/3;
        COLLISION_BOX_HEIGHT = HEIGHT/3;
        SPEED_LIMIT_LOWER = _parent.getBaseSpeed() + 82;
        SPEED_LIMIT_LOWER = 3 - _parent.getBaseSpeed();
        this.immune = true;
        this.numJumps = MAX_JUMPS;
        supr(this, 'init', [opts]);
        this.build(opts);
    };

    this.build = function(opts) {
        //Create line from collisionPoints.
        //(From top right of sprite to halfway down in height with some x-cushion)
        var collisionPoints = {
           startPoint: new Point({
                x: opts.x + WIDTH/1.25,
                y: opts.y
             }),
            endPoint: new Point({
                x: opts.x + WIDTH/1.25,
                y: opts.y + HEIGHT/2
            })
        }
        this.collisionLine = new Line(collisionPoints.startPoint, collisionPoints.endPoint); 
        this.collisionBox = new Rect(opts.x + COLLISION_BOX_WIDTH/1.5, opts.y, COLLISION_BOX_WIDTH,  COLLISION_BOX_HEIGHT);

        //build speed and point messages
        _scoreText = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            size: HEIGHT/4,
            opacity: .4,
            color: "#ffc600",
            strokeColor: "#FFF",
            strokeWidth: HEIGHT/18,
            opacity: 0,
            visible: false,
            x: this.style.width/2 + HEIGHT/4,
            y: -this.style.height/5
        });

        _speedText = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            size: HEIGHT/5,
            opacity: .4,
            strokeColor: "#FFF",
            strokeWidth: HEIGHT/18,
            opacity: 0,
            visible: false,
            x: -this.style.width/15,
            y: -this.style.height/5
        });
    };

    this.activate = function() {
        this.speed = 1;
        this.score = 0;
        this.setFramerate(BASE_FR);
        this.initImmunityTimeout();
        if(this.isPlaying) {
            this.resume();
        } else {
            this.startAnimation('run', {loop: true});
        }
    };

    //handles immunity status
    this.initImmunityTimeout = function(){
        this.immune = true;
        var animation;
        this.resetAnimation();
        //scales animation duration based upon timeout length
        animation = animate(this)
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

    this.updateCollisionPoints = function(){
        //update collision line (for items)
        var startX = this.collisionLine.start.x; 
        var endX = this.collisionLine.end.x;
        this.collisionLine.start.x = startX;
        this.collisionLine.start.y = this.style.y;
        this.collisionLine.end.x = endX;
        this.collisionLine.end.y = this.style.y + HEIGHT/2;
         //update collision box (for terrain)
        this.collisionBox.x = this.style.x + COLLISION_BOX_WIDTH*1.3;
        this.collisionBox.y = this.style.y;
    };

    //updates speed
    this.addToSpeed = function(value) {
        if(this.speed + value < SPEED_LIMIT_LOWER) {
            this.kill();
            this.speed = 1;
            _parent.adjustSpeed(this.speed);
        } else if(!(this.speed + value > SPEED_LIMIT_UPPER)) {
            this.speed += value;
            this.setFramerate(BASE_FR + this.speed);
            _parent.adjustSpeed(this.speed);
            this._showSpeedMessage(value);
        }
    };

    //adds score to scoreboard
    this.addToScore = function(value) {
        if(value) {
            value = (this.speed > 0) ? value + value*this.speed : value;
            _parent.updateScoreBoard(this.score + value);
            this._showPointMessage(value);
        }
    };

    this.resetJumps = function() {
        this.numJumps = MAX_JUMPS;
    };

    //kills character
    this.kill = function() {
        this.immune = true;
        this.pause();
        animate(this)
           .now({ y: _parent.style.height/2 }, 200, animate.linear)
           .then({ y: _parent.style.height + (this.style.height) }, 500, animate.linear)
           .then(bind(this, function() {
               _parent.updateLives();
               if(_parent.getLives() > 0) {
                    this.updateOpts({
                        x: ORIG_X,
                        y: ORIG_Y
                    });
                    this.resume();
                    this.initImmunityTimeout();
              }
        }));  
    };

    //gets immunity status4
    this.isImmune = function() {
        return this.immune;
    };

    this._showPointMessage = function(value) {
        _scoreText.setText("+"+value);
        animate(_scoreText)
            .now({opacity: 1, y: -this.style.height/1.5, visible: true}, 400, animate.linear)
            .then({opacity: 0, visible: false}, 200, animate.linear)
            .then(function() {
                _scoreText.style.y = -this.style.height/5;
            }.bind(this));
    };

    this._showSpeedMessage = function(value) {
        if(value > 0) {
            _speedText.updateOpts({ color:'#8cb453' });
            _speedText.setText('+Speed');
            animate(_speedText)
                .now({opacity: 1, visible: true}, 300, animate.linear)
                .then({opacity: 0, x: -this.style.width/3, visible: false}, 400, animate.easeOut)
                .then(function() {
                    _speedText.style.x = -this.style.width/15;
                }.bind(this));
        } else {
            _speedText.updateOpts({ color:'#d8632a' });
            _speedText.setText('-Speed');
            animate(_speedText)
                .then({opacity: 1, visible: true, x: -this.style.width/10, y: this.style.height/15}, 600, animate.linear)
                .then({opacity: 0, visible: false}, 300, animate.linear)
                .then(function() {
                    _speedText.style.x = -this.style.width/15;
                    _speedText.style.y = -this.style.height/5;
                }.bind(this));
        }
        
    };

    this._resetMessages = function() {
        _scoreText.updateOpts({
            x: this.style.width/2 + HEIGHT/4,
            y: -this.style.height/5
        });
        _speedText.updateOpts({
            x: -this.style.width/15,
            y: -this.style.height/5
        });
    };

    this.getParent = function() {
        return _parent;
    };
});
