import src.view.ParallaxView as ParallaxView;
import src.view.game.TerrainBlock as TerrainBlock;
import src.view.game.ItemBlock as ItemBlock;
import src.view.game.TerrainLayer as TerrainLayer;
import src.view.game.ItemLayer as ItemLayer;
import src.view.game.Character as Character;
import src.view.ui.BoostBar as BoostBar;
import src.view.ui.Header as Header;
import src.view.BaseView as BaseView;
import src.view.ui.BaseButton as BaseButton;
import src.model.CrumbEngine as CrumbEngine;
import src.model.FlameEngine as FlameEngine;
import src.model.AnimManager as AnimManager;
import ui.TextView as TextView;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.widget.ButtonView as ButtonView;
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
    var _jRumpCount;

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
    }; 

    this._initGameVariables = function() {
        _score = 0;
        this.lives = GC.app.reward ? LIVES + 1 : LIVES;
        this.header.scoreText.setText(_score);
        this.header.livesView.resetLives();
        this.boostBar.reset();
    };

    this._setViews = function() {
        this.header.style.y = -this.header.style.height;
        this.boostBar.style.y = HEIGHT + this.boostBar.style.height;
        this.character.style.x = this.character.ORIG_X;
        this.character.style.y = this.character.ORIG_Y;
        this.itemLayer.style.visible = true;
    };

    this.adjustSpeed = function(value) {
        this.speed = GC.app.rootView.BASE_SPEED + value;
    };

    this.updateScoreBoard = function(value) {
        _score += value;
        this.header.scoreText.setText(_score);
    };

    this._startGame = function() {
        this.character.activate();
        this.gameStarted = true;
    }

    this._stopGame = function() {
        GC.app.sound.stop('game');
        this.character.disable();
        this.gameStarted = false;
        this.speed = GC.app.rootView.BASE_SPEED;
        this._hideUI();
    }

    this.pause = function() {
        this.gameStarted = false;
        this.character.disable();
    };

    this.resume = function() {
        this.character.enable();
        this.gameStarted = true;
    };

    this.exitGame = function() {
        this.character.disable();
        this.resume();
        this._stopGame();
        GC.app.sound.play('menu');
    };

    this.restart = function() {
        this.character.immune = true;
        this._initGameVariables();
        this.resume();
        this._startGame();
        GC.app.rootView.reset();
    };

    this.constructView = function() {
        supr(this, 'constructView');
        this._showUI();
        this.restart();
        GC.app.sound.play('game');
    };

    this.resetView = function() {
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
        this.on('InputStart', function(e) {
            if(!this.character.immune && this.character.jumpsLeft > 0 && this.gameStarted) {
                this.character.jumpActive = true;
                if(this.character.jumpsLeft === this.character.getMaxJumps()) {
                    this.spriteMgr.runHalfJump();
                } else {
                    this.spriteMgr.runFullJump();
                }
                this.character.jumpsLeft--;
                this.jumpAnim = animate(this.character)
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

    this.toggleMenu = function(){
        if(GC.app.menuView.style.visible) {
            GC.app.menuView.closeView(this.resume());
        } else {
            this.pause();
            GC.app.menuView.openView();
        }
    }

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

        this.menuButton = new ButtonView({
            superview: GC.app.rootView,
            images: { 
                up: imageData.ui.menu.up,
                down: imageData.ui.menu.down
            },
            opacity: 1,
            height: 100,
            width: 100,
            x: this.header.margin/2,
            y: -this.header.style.height,
            zIndex: this.style.zIndex + 1,
            on: {
                up: bind(this, function(e){
                    this.toggleMenu();
                })
            }
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

        this._initGameVariables();
        this._setViews();
        this._setGameHandlers();
    };

    this._showUI = function() {
        this.boostBar.style.visible = true;
        this.header.style.visible = true;
        this.menuButton.style.visible = true;

        animate(this.boostBar)
            .now({y: HEIGHT - this.boostBar.style.height}, 500, animate.linear);
        animate(this.header)
            .now({y: 0}, 500, animate.linear);
        animate(GC.app.sound.muteMusic)
            .now({y: this.header.style.height + this.header.margin}, 500, animate.linear)
        animate(GC.app.sound.muteSound)
            .now({y: this.header.style.height + this.header.margin}, 500, animate.linear)
        animate(this.menuButton)
            .now({y: this.header.style.height + this.header.margin}, 500, animate.linear)

        this.itemLayer.style.visible = true;
    };

    this._hideUI = function() {
        GC.app.menuView.style.visible = false;
        GC.app.modalScreen.style.visible = false;
        this.character.style.visible = false;

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

        animate(this.menuButton)
            .now({y: -this.header.style.height}, 500, animate.linear)
            .then(function() {
                this.menuButton.style.visible = false;
            }.bind(this));

        animate(GC.app.sound.muteMusic)
            .now({y: 10 }, 500, animate.linear)
        animate(GC.app.sound.muteSound)
            .now({y: 10 }, 500, animate.linear)

        this.itemLayer.clear();
    };
 });
