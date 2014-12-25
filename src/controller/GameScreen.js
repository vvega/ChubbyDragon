import src.view.ParallaxView as ParallaxView;
import src.view.game.TerrainBlock as TerrainBlock;
import src.view.game.ItemBlock as ItemBlock;
import src.view.game.TerrainLayer as TerrainLayer;
import src.view.game.ItemLayer as ItemLayer;
import src.view.game.Character as Character;
import src.view.ui.BoostBar as BoostBar;
import src.view.ui.Header as Header;
import src.view.BaseView as BaseView;
import src.model.CrumbEngine as CrumbEngine;
import src.model.FlameEngine as FlameEngine;
import src.model.AnimManager as AnimManager;
import ui.TextView as TextView;
import ui.View as View;
import ui.ImageView as ImageView;
import animate;

exports = Class(BaseView, function(supr) {

    var GROUND_ELEVATION;
    var CHARACTER_WIDTH;
    var CHARACTER_HEIGHT;
    var LIVES;
    var JUMP_ELEVATION;

    var _character;
    var _score;
    var _lives;
    var _mountainLayer;
    var _jumpCount;

    this.init = function(opts) {
        GROUND_ELEVATION = HEIGHT - BLOCK_SIZE*2;
        CHARACTER_WIDTH = BLOCK_SIZE*4;
        CHARACTER_HEIGHT = BLOCK_SIZE*2;
        LIVES = 3;
        JUMP_ELEVATION = HEIGHT/7;
        BASE_MUSIC_SPEED = 1;

        supr(this, 'init', [opts]);

        this.character = new Character(merge({
            superview: this,
            width: CHARACTER_WIDTH,
            height: CHARACTER_HEIGHT,
            x: 0,
            elevation: (GROUND_ELEVATION - CHARACTER_HEIGHT) + BLOCK_SIZE*1.7
        }));

        this._setGameVariables();
    }; 

    this._setGameVariables = function() {
        _score = 0;
        this.lives = LIVES;
        this.speed = GC.app.rootView.BASE_SPEED;
    };

    this._setViews = function() {
        this.header.scoreText.setText(_score);
        this.header.style.y = -this.header.style.height;
        this.boostBar.style.y = HEIGHT + this.boostBar.style.height;
        this.character.style.x = this.character.ORIG_X;
        this.character.style.y = this.character.ORIG_Y;
        this.itemLayer.style.visible = true;
    };

    this.adjustSpeed = function(value) {
        this.speed = GC.app.rootView.BASE_SPEED + value;
        this.speed % 2 === 0 && this.adjustPlaybackSpeed(value);
    };

    this.adjustPlaybackSpeed = function(value) {
        if(value) {
            GC.app.sound.play('plusSpeed', {loop: false}); 
        } else {
            GC.app.sound.play('minusSpeed', {loop: false}); 
        }   
        var pbr = BASE_MUSIC_SPEED + value/(this.speed*2);
        GC.app.sound.setPlaybackRate('game', pbr);
        GC.app.sound.setPlaybackRate('death', pbr);
        GC.app.sound.setPlaybackRate('running', pbr);
    };

    this.resetPlaybackSpeed = function() {
        GC.app.sound.setPlaybackRate('game', 1);
        GC.app.sound.setPlaybackRate('death', 1);
        GC.app.sound.setPlaybackRate('running', 1);
    };

    this.updateScoreBoard = function(value) {
        _score += value;
        this.header.scoreText.setText(_score);
    };

    this._startGame = function() {
        this.gameStarted = true;
        this._showUI();
        this.character.activate();
        GC.app.sound.play('game');
    }

    this._stopGame = function() {
        this.gameStarted = false;
        this.speed = GC.app.rootView.BASE_SPEED;
        this._hideUI();
    }

    this.constructView = function() {
        supr(this, 'constructView');
        this.resetPlaybackSpeed();
        this._startGame();
    };

    this.resetView = function() {
        this.header.livesView.resetLives();
        this.boostBar.reset();
        this._setGameVariables();
        this._setViews();
    };

    this.updateLives = function() {
        this.lives--;
        this.header.livesView.updateLives(this.lives);
        if(this.lives == 0) {
            this._stopGame();
            GC.app.transitionViews(GC.app.gameOverScreen, _score);
        }
    };

    //Handles jumping. First jump will always be a jump animation immediately followed by a pause (to catch the first frame).
    //Following jumps will run a full jump animation followed by the first frame of the next jump.
    //Because jumps run at a constant framerate, the character framerate is reset accordingly after landing.
    this._setGameHandlers = function() {
        this.on('InputStart', function() {
            if(!this.character.isImmune() && this.character.numJumps > 0) {
                this.character.jumpActive = true;
                if(this.character.numJumps === this.character.getMaxJumps()) {
                    this.spriteMgr.runHalfJump();
                } else {
                    this.spriteMgr.runFullJump();
                }
                this.character.numJumps--;
                animate(this.character)
                    .now({ y: this.character.style.y - JUMP_ELEVATION }, 300, animate.easeOut)
                    .then({ y: this.character.elevation }, 550, animate.easeIn)
                    .then(bind(this, function() {
                        this.character.resetJumps();
                        this.spriteMgr.resumeRun();
                }));
            }
        });
    };

    this.tick = function(dt) {
        if(this.gameStarted) {
            this.boostBar.step(dt);
            this.cEngine.runTick(dt);
            this.fEngine.runTick(dt);
            this.character.updateCollisionPoints(dt);
        } 
    };

    this.build = function() {

        var itemLayer = new ItemLayer({
            parent: this,
            distance: GC.app.rootView.MAX_DISTANCE - 2,
            populate: function (layer, x) {
                var v = layer.obtainView(ItemBlock, {
                    type: "apple",
                    character: this.character,
                    superview: layer,
                    crumbGen: this.cEngine,
                    flameGen: this.fEngine,
                    x: x,
                    width: BLOCK_SIZE*.7,
                    height: BLOCK_SIZE*.7,
                    y: HEIGHT - BLOCK_SIZE*1.6
                });
                return v.style.width + Math.random()*WIDTH;
            }.bind(this)
        });

        this.header = new Header({
            superview: this,
            height: BLOCK_SIZE*.7,
            width: WIDTH,
            scaleMethod: 'tile',
            columns: Math.round(WIDTH/BLOCK_SIZE),
            lifeViewProps: {
                numLives: LIVES,
                style: {
                    image: imageData.ui.life
                }
            },
            canHandleEvents: false,
            blockEvents: true
        });

        this.boostText = new TextView({
            superview: this,
            layout: 'linear',
            fontFamily: 'bigbottom',
            text: "Flame Boost!",
            width: WIDTH*.8,
            height: HEIGHT/8,
            size: HEIGHT/8,
            strokeColor: '#e99338',
            strokeWidth: HEIGHT/18,
            opacity: 0,
            color: "#FFF",
            wrap: true
        });

        this.boostText.style.x = WIDTH/2 - this.boostText.style.width/2;
        this.boostText.style.y = HEIGHT/2;

        this.boostBar = new BoostBar({
            superview: this,
            height: BLOCK_SIZE/1.5,
            width: WIDTH,
            scaleMethod: 'tile',
            columns: Math.round(WIDTH/BLOCK_SIZE),
            canHandleEvents: false,
            blockEvents: true
        });

        //particle engines
        this.cEngine = new CrumbEngine({
            parent: this,
            character: this.character
        });

        this.fEngine = new FlameEngine({
            parent: this,
            character: this.character
        });

        //character animation manager
        this.spriteMgr = new AnimManager({
            sprite: this.character
        });

        this.itemLayer = GC.app.rootView.parallaxView.addLayer(itemLayer);
        GC.app.rootView.parallaxView.addSubview(this.character);

        this._setViews();
        this._setGameHandlers();
    };

    this._showUI = function() {
        this.boostBar.style.visible = true;
        this.header.style.visible = true;

        animate(this.boostBar)
            .now({y: HEIGHT - this.boostBar.style.height}, 500, animate.linear);
        animate(this.header)
            .now({y: 0}, 500, animate.linear);
        animate(GC.app.sound.muteMusic)
            .now({y: this.header.style.height + this.header.margin}, 500, animate.linear)
        animate(GC.app.sound.muteSound)
            .now({y: this.header.style.height + this.header.margin}, 500, animate.linear)

        this.itemLayer.style.visible = true;
    };

    this._hideUI = function() {
        animate(this.header)
            .now({y: -this.header.style.height}, 500, animate.linear)
            .then(function() {
                this.header.style.visible = false;
            }.bind(this));

        animate(this.boostBar)
            .now({y: HEIGHT + this.boostBar.style.height}, 500, animate.linear)
            .then(function() {
                this.boostBar.style.visible = false;
            }.bind(this));

        animate(GC.app.sound.muteMusic)
            .now({y: 10 }, 500, animate.linear)
        animate(GC.app.sound.muteSound)
            .now({y: 10 }, 500, animate.linear)

        //this.itemLayer.style.visible = false;
        this.itemLayer.clear();
    };
 });
