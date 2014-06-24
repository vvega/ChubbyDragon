import ui.View as View;
import ui.ImageView as ImageView;
import src.view.ParallaxView as ParallaxView;
import src.view.TerrainBlock as TerrainBlock;
import src.view.ParallaxView as ParallaxView;
import src.view.ItemBlock as ItemBlock;
import src.view.BaseView as BaseView;
import src.view.TerrainLayer as TerrainLayer;
import src.view.ItemLayer as ItemLayer;
import src.view.Character as Character;
import src.view.BoostBar as BoostBar;
import src.view.Header as Header;
import src.model.CrumbEngine as CrumbEngine;
import src.model.FlameEngine as FlameEngine;
import src.model.SpriteManager as SpriteManager;
import ui.TextView as TextView;
import animate;

exports = Class(BaseView, function(supr) {

    var GROUND_ELEVATION;
    var CHARACTER_WIDTH;
    var CHARACTER_HEIGHT;
    var LIVES;
    var JUMP_ELEVATION;

    var _speed;
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

        supr(this, 'init', [opts]);

        this.character = new Character(merge({
            superview: this,
            name: "hero",
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
        this.header.scoreView.setText(_score);
        this.header.style.y = -this.header.style.height;
        this.boostBar.style.y = HEIGHT + this.boostBar.style.height;
        this.character.style.x = this.character.ORIG_X;
        this.character.style.y = this.character.ORIG_Y;
        this.character.style.zIndex = GC.app.rootView.terrainLayer.style.zIndex - 1;
        this.itemLayer.style.zIndex = this.character.style.zIndex - 1;
        this.itemLayer.style.visible = true;
    };

    this.adjustSpeed = function(value) {
        this.speed = GC.app.rootView.BASE_SPEED + value;
    };

    this.updateScoreBoard = function(value) {
        _score += value;
        this.header.scoreView.setText(_score);
    };

    this._startGame = function() {
        this.gameStarted = true;
        this._showUI();
        this.character.activate();
    }
    this._stopGame = function() {
        this.gameStarted = false;
        this.speed = GC.app.rootView.BASE_SPEED;
        this._hideUI();
    }
    this.constructView = function() {
        supr(this, 'constructView');
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
            GC.app.transitionViews(GC.app.gameOverView, _score);
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
            _fEngine.runTick(dt);
            this.character.updateCollisionPoints();
        } 
    };

    this.build = function() {

        var itemLayer = new ItemLayer({
            parent: this,
            distance: 1,
            populate: function (layer, x) {
                var v = layer.obtainView(ItemBlock, {
                    type: "apple",
                    character: this.character,
                    superview: layer,
                    crumbGen: this.cEngine,
                    x: x,
                    width: BLOCK_SIZE/1.5,
                    height: BLOCK_SIZE/1.5,
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
                    height: BLOCK_SIZE/1.6,
                    width: BLOCK_SIZE/1.6,
                    image: imageData.ui.life
                }
            },
            canHandleEvents: false,
            blockEvents: true
        });

        this.boostText = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "Fire Breath!",
            size: HEIGHT/6,
            strokeColor: '#e99338',
            strokeWidth: HEIGHT/18,
            opacity: 0,
            color: "#FFF",
            wrap: true
        });

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

        _fEngine = new FlameEngine({
            parent: this.character
        });

        //character animation manager
        this.spriteMgr = new SpriteManager({
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

        //this.itemLayer.style.visible = false;
        this.itemLayer.clear();
    };
 });
