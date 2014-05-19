import ui.View as View;
import ui.ImageView as ImageView;
import src.view.TerrainBlock as TerrainBlock;
import src.view.ParallaxView as ParallaxView;
import src.view.ItemBlock as ItemBlock;
import src.view.BaseView as BaseView;
import src.view.EnvironmentLayer as EnvironmentLayer;
import src.view.LivesView as LivesView;
import src.view.Character as Character;
import src.model.CrumbEngine as CrumbEngine;
import ui.ScoreView as ScoreView;
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
    var _jumpCount;
    var _cEngine 

    this.init = function(opts) {
        //scale terrain blocks to device size
        TERRAIN_BLOCK_SIZE = HEIGHT/5;
        GROUND_ELEVATION = HEIGHT - TERRAIN_BLOCK_SIZE*2;
        //character is 3 blocks wide and ~1 block tall
        CHARACTER_WIDTH = TERRAIN_BLOCK_SIZE*3;
        CHARACTER_HEIGHT = TERRAIN_BLOCK_SIZE*1.3;
        //default lives count
        LIVES = 3;
        //calculate character's default y position (with some cushion)
        CHARACTER_ELEVATION = GROUND_ELEVATION - (CHARACTER_HEIGHT - (TERRAIN_BLOCK_SIZE + TERRAIN_BLOCK_SIZE/10));
        //sprite position based upon device width
        START_X = WIDTH/9;
        //initialize scroll amount
        _scrollX = 0;
        //initialize speed
        BASE_SPEED = 8;
        //init jump elevation
        JUMP_ELEVATION = HEIGHT/7;
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
        _character.style.x = START_X;
        _character.style.y = CHARACTER_ELEVATION;
        _character.activate();
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

    this.getChar = function() {
        return _character;
    };

    this.getBaseSpeed = function() {
        return BASE_SPEED;
    };

    this.constructView = function() {
        supr(this, 'constructView');
        _gameStarted = true;
    };

    this.resetView = function() {
        _character.resume();
        _livesView.resetLives();
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

    this._setGameHandlers = function() {
        this.on('InputStart', function() {
            if(!_character.isImmune() && _character.numJumps > 0) {
                _character.pause();
                _character.numJumps--;
                animate(_character)
                    .now({ y: _character.style.y - JUMP_ELEVATION }, 300, animate.easeOut)
                    .then({ y: CHARACTER_ELEVATION }, 550, animate.easeIn)
                    .then(bind(this, function() {
                        _character.resetJumps();
                        _character.resume();
                }));
            }
        });
    };

    this.tick = function(dt) {
        _scrollX += _speed;
        if(_gameStarted) {
            _cEngine.runTick(dt);
            _terrainLayer.scrollTo(_scrollX, 0);
            _itemLayer.scrollTo(_scrollX, 0);
            _character.updateCollisionPoints();
        } 
    };

    this.build = function() {
        this.parallaxView = new ParallaxView({
            superview: this,
            width: this.style.width,
            height: this.style.height
        });

        //character
        _character = new Character(merge({
            superview: this,
            name: "hero",
            x: START_X,
            y: CHARACTER_ELEVATION,
            width: CHARACTER_WIDTH,
            height: CHARACTER_HEIGHT
        }));

        //particle engine
        _cEngine = new CrumbEngine({
            parent: _character
        });

        //terrain and items
        var terrainLayer = new EnvironmentLayer({
            parent: this,
            distance: 1,
            populate: function (layer, x) {
                var v = layer.obtainView(TerrainBlock, {
                      group: "terrain",
                      character: _character,
                      superview: layer,
                      image: "resources/images/terrain_block.png",
                      x: x,
                      y: HEIGHT - TERRAIN_BLOCK_SIZE,
                      width: TERRAIN_BLOCK_SIZE,
                      height: TERRAIN_BLOCK_SIZE
                });
                return v.style.width;
            }
        });

        var itemLayer = new EnvironmentLayer({
            parent: this,
            distance: 1,
            populate: function (layer, x) {
                var v = layer.obtainView(ItemBlock, {
                    group: "items",
                    type: "apple",
                    character: _character,
                    superview: layer,
                    crumbGen: _cEngine,
                    x: x,
                    width: TERRAIN_BLOCK_SIZE/1.5,
                    height: TERRAIN_BLOCK_SIZE/1.5,
                    y: HEIGHT - TERRAIN_BLOCK_SIZE*1.6
                });
                //return random space between elements
                return v.style.width + Math.random()*WIDTH;
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

        _terrainLayer = this.parallaxView.addLayer(terrainLayer);
        _itemLayer = this.parallaxView.addLayer(itemLayer);
        _character.startAnimation('run', {loop: true});
        this._setViews();
        this._setGameHandlers();
    };
 });