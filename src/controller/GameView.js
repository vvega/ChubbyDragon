import ui.View as View;
import ui.ImageView as ImageView;
import src.view.ParallaxView as ParallaxView;
import src.view.TerrainBlock as TerrainBlock;
import src.view.ParallaxView as ParallaxView;
import src.view.ItemBlock as ItemBlock;
import src.view.BaseView as BaseView;
import src.view.EnvironmentLayer as EnvironmentLayer;
import src.view.LivesView as LivesView;
import src.view.Character as Character;
import src.view.BoostBar as BoostBar;
import src.model.CrumbEngine as CrumbEngine;
import src.model.FlameEngine as FlameEngine;
import ui.ScoreView as ScoreView;
import ui.TextView as TextView;
import animate;

exports = Class(BaseView, function(supr) {

    var CHARACTER_ELEVATION;
    var GROUND_ELEVATION;
    var TERRAIN_BLOCK_SIZE;
    var CHARACTER_WIDTH;
    var CHARACTER_HEIGHT;
    var LIVES;
    var BASE_SPEED
    var START_X;
    var JUMP_ELEVATION;
    var MAX_DISTANCE;

    var _speed;
    var _character;
    var _score;
    var _lives;
    var _scoreView;
    var _livesView;
    var _gameStarted;
    var _scrollX;
    var _itemLayer;
    var _terrainLayer;
    var _mountainLayer;
    var _jumpCount;
    var _cEngine 
    var _boostText;

    this.init = function(opts) {
        //scale terrain blocks to device size
        TERRAIN_BLOCK_SIZE = HEIGHT/4.9;
        GROUND_ELEVATION = HEIGHT - TERRAIN_BLOCK_SIZE*2;
        //character is 3 blocks wide and ~1 block tall
        CHARACTER_WIDTH = TERRAIN_BLOCK_SIZE*4;
        CHARACTER_HEIGHT = TERRAIN_BLOCK_SIZE*2;
        //default lives count
        LIVES = 3;
        //calculate character's default y position (with some cushion)
        CHARACTER_ELEVATION = GROUND_ELEVATION - (CHARACTER_HEIGHT - (TERRAIN_BLOCK_SIZE*1.7));
        //sprite position based upon device width
        START_X = 0;
        //initialize scroll amount
        _scrollX = 0;
        //initialize speed
        BASE_SPEED = 8;
        //init jump elevation
        JUMP_ELEVATION = HEIGHT/7;
        //set max distance of background scrolling layer
        MAX_DISTANCE = 6;
        //initialize game instance dependent variables
        this._setGameVariables();
        supr(this, 'init', [opts]);
    }; 

    this._setGameVariables = function() {
        _score = 0;
        _lives = LIVES;
        _speed = BASE_SPEED;
    };

    this._setViews = function() {
        _scoreView.setText(_score);
        this.character.style.x = START_X;
        this.character.style.y = CHARACTER_ELEVATION;
        this.character.style.zIndex = _terrainLayer.style.zIndex - 1;
        _itemLayer.style.zIndex = this.character.style.zIndex - 1;
        this.character.activate();
    };

    this.adjustSpeed = function(value) {
        _speed = BASE_SPEED + value;
    };

    this.updateScoreBoard = function(value) {
        _score += value;
        _scoreView.setText(_score);
    };

    this.getLives = function(){
        return _lives;
    };

    this.getBaseSpeed = function() {
        return BASE_SPEED;
    };

    this.constructView = function() {
        supr(this, 'constructView');
        _gameStarted = true;
    };

    this.resetView = function() {
        _livesView.resetLives();
        this.boostBar.reset();
        this._setGameVariables();
        this._setViews();
    };

    this.updateLives = function() {
        _lives--;
        _livesView.updateLives(_lives);
        if(_lives == 0) {
            _gameStarted = false;
            GC.app.transitionViews(GC.app.gameOverView, _score);
        }
    };

    this._nextCharData = function() {
        var d = {};
        for (var i = 0; i < 10; i++) {
            d[i] = { image: 'resources/fonts/scoreboard/' + i + '.png'};
        }
        return d;
    };

    //Handles jumping. First jump will always be a jump animation immediately followed by a pause (to catch the first frame).
    //Following jumps will run a full jump animation followed by the first frame of the next jump.
    //Because jumps run at a constant framerate, the character framerate is reset accordingly after landing.
    this._setGameHandlers = function() {
        this.on('InputStart', function() {
            if(!this.character.isImmune() && this.character.numJumps > 0) {
                if(this.character.numJumps === this.character.getMaxJumps()) {
                    this._runHalfJump();
                } else {
                    this.character.resume();
                    this._runFullJump();
                }
                this.character.numJumps--;
                animate(this.character)
                    .now({ y: this.character.style.y - JUMP_ELEVATION }, 300, animate.easeOut)
                    .then({ y: CHARACTER_ELEVATION }, 550, animate.easeIn)
                    .then(bind(this, function() {
                        this.character.resetJumps();
                        this.character.resume();
                        this.character.updateFramerate();
                        this.character.resetAnimation();
                }));
            }
        });
    };

    this._runFullJump = function() {
        this.character.setFramerate(25);
        this.character.startAnimation('jump', {
            loop:false,
            frame: 0,
            callback: function() {
                this.character.startAnimation('jump', {loop:false}); 
                this.character.pause();
        }.bind(this)});
    }

    this._runHalfJump = function() {
        this.character.setFramerate(25);
        this.character.startAnimation('jump', {loop:false}); 
        this.character.pause(); 
    };

    this.tick = function(dt) {
        _scrollX += _speed/MAX_DISTANCE;
        if(_gameStarted) {
            this.boostBar.step(dt);
            _cEngine.runTick(dt);
            _fEngine.runTick(dt);
            this.character.updateCollisionPoints();
            _terrainLayer.scrollTo(_scrollX, 0);
            _itemLayer.scrollTo(_scrollX, 0);
            _mountainLayer.scrollTo(_scrollX, 0);
        } 
    };

    this.build = function() {
        this.parallaxView = new ParallaxView({
            superview: this,
            width: this.style.width,
            height: this.style.height
        });

        this.character = new Character(merge({
            superview: this,
            name: "hero",
            x: START_X,
            y: CHARACTER_ELEVATION,
            width: CHARACTER_WIDTH,
            height: CHARACTER_HEIGHT
        }));

        var terrainLayer = new EnvironmentLayer({
            parent: this,
            distance: 1,
            populate: function (layer, x) {
                var v = layer.obtainView(TerrainBlock, {
                      group: "terrain",
                      character: this.character,
                      superview: layer,
                      image: "resources/images/terrain_block.png",
                      x: x,
                      y: HEIGHT - TERRAIN_BLOCK_SIZE,
                      width: TERRAIN_BLOCK_SIZE,
                      height: TERRAIN_BLOCK_SIZE
                });
                return v.style.width;
            }.bind(this)
        });

        var itemLayer = new EnvironmentLayer({
            parent: this,
            distance: 1,
            populate: function (layer, x) {
                var v = layer.obtainView(ItemBlock, {
                    group: "items",
                    type: "apple",
                    character: this.character,
                    superview: layer,
                    crumbGen: _cEngine,
                    x: x,
                    width: TERRAIN_BLOCK_SIZE/1.5,
                    height: TERRAIN_BLOCK_SIZE/1.5,
                    y: HEIGHT - TERRAIN_BLOCK_SIZE*1.6
                });
                return v.style.width + Math.random()*WIDTH;
            }.bind(this)
        });

        var mountainLayer = new ParallaxView.Layer({
            parent: this,
            distance: MAX_DISTANCE,
            populate: function (layer, x) {
                var v = layer.obtainView(ImageView, {
                    image: "resources/images/mountains.png",
                    superview: layer,
                    x: x,
                    width: WIDTH,
                    height: HEIGHT/1.6,
                    y: HEIGHT - HEIGHT/1.6
                });
                return v.style.width;
            }
        });

        var cloudLayer = new EnvironmentLayer({
            parent: this,
            distance: MAX_DISTANCE - 1,
            populate: function (layer, x) {
                var v = layer.obtainView(ImageView, {
                    image: "resources/images/clouds/cloud_000.png",
                    group: "clouds",
                    superview: layer,
                    x: x,
                    width: TERRAIN_BLOCK_SIZE*2,
                    height: TERRAIN_BLOCK_SIZE,
                    y: (HEIGHT - HEIGHT/1.6) - TERRAIN_BLOCK_SIZE/1.5
                });
                return v.style.width + Math.random()*WIDTH/2;
            }
        });

        var svBox = new View({
            superview: this,
            x: WIDTH/30,
            y: HEIGHT/32,
            width: WIDTH/4,
            height: HEIGHT/6
        });

        _scoreView = new ScoreView({
            superview: svBox,
            x:0,
            y:0,
            layout: "box",
            text: "0",
            characterData: this._nextCharData()
        });

        _livesView = new LivesView({
            parent: this,
            numLives: LIVES,
            lifeViewProps : {
                height: TERRAIN_BLOCK_SIZE/1.3,
                width: TERRAIN_BLOCK_SIZE/1.3,
                image: "resources/images/life.png"
            }
        });

        this.boostText = new TextView({
            superview: this,
            layout: 'box',
            fontFamily: 'tiptoe',
            text: "Fire Breath!",
            size: HEIGHT/10,
            strokeColor: '#e99338',
            strokeWidth: HEIGHT/18,
            opacity: 0,
            color: "#FFF",
            wrap: true
        });

        this.boostBar = new BoostBar({
            superview: this,
            height: TERRAIN_BLOCK_SIZE/1.5,
            width: WIDTH,
            scaleMethod: 'tile',
            columns: Math.round(WIDTH/TERRAIN_BLOCK_SIZE),
            canHandleEvents: false,
            blockEvents: true
        });

        //particle engines
        _cEngine = new CrumbEngine({
            parent: this,
            character: this.character
        });

        _fEngine = new FlameEngine({
            parent: this.character
        });

        _itemLayer = this.parallaxView.addLayer(itemLayer);
        _terrainLayer = this.parallaxView.addLayer(terrainLayer);
        _mountainLayer = this.parallaxView.addLayer(mountainLayer);
        _cloudLayer = this.parallaxView.addLayer(cloudLayer);
        this.parallaxView.addSubview(this.character);

        this._setViews();
        this._setGameHandlers();
    };
 });
