import ui.View as View;
import src.objects.TerrainBlock as TerrainBlock;
import src.layouts.ParallaxView as ParallaxView;
import src.objects.ItemBlock as ItemBlock;
import animate;
import src.objects.Character as Character;
import ui.ScoreView as ScoreView;
import src.layouts.BaseView as BaseView;

exports = Class(BaseView, function(supr) {
    
    var CHARACTER_ELEVATION;
    var GROUND_ELEVATION;
    var TERRAIN_BLOCK_SIZE;
    var CHARACTER_WIDTH;
    var CHARACTER_HEIGHT;
    var LIVES;
    var BASE_SPEED
    var START_X;
 
    var _speed;
    var _character;
    var _score;
    var _lives;
    var _scoreView;
    var _livesView;
    var _gameStarted;
    var _flag_jump;
    var _scrollX;
    var _itemLayer;
    var _terrainLayer;

    this.init = function(opts) {   

        //scale terrain blocks to device size
        TERRAIN_BLOCK_SIZE = HEIGHT/5;
        GROUND_ELEVATION = HEIGHT - TERRAIN_BLOCK_SIZE*2;
        
        //character is 2 blocks wide and 1 block tall
        CHARACTER_WIDTH = TERRAIN_BLOCK_SIZE*3;
        CHARACTER_HEIGHT = TERRAIN_BLOCK_SIZE*1.3;

        //default lives count
        LIVES = 3;
        
        //calculate character's default y position (with some cushion)
        CHARACTER_ELEVATION = GROUND_ELEVATION - (CHARACTER_HEIGHT - (TERRAIN_BLOCK_SIZE + HEIGHT/56));
        
        //sprite position based upon device width
        START_X = WIDTH/9;

        //initialize scroll amount
        _scrollX = 0;

        //initialize speed
        BASE_SPEED = 8;

        //initialize game instance dependent variables
        this._initGameVariables();

        supr(this, 'init', [opts]);

    }; 
     
    this._initGameVariables = function() {       
        _score = 0;
        _lives = LIVES;
        _speed = BASE_SPEED;
        _flag_jump = true;
    };   

    this._initViews = function() {
        _scoreView.setText(_score);
        _livesView.setText(_lives);
        _character.style.x = START_X;
        _character.style.y = CHARACTER_ELEVATION;
        _character.activate();
    };

    this.adjustSpeed = function(value) {
        //_speed is equal to scrolling animation duration
        //it will increase with increased weight
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

    this.constructView = function() {
        supr(this, 'constructView');
        _gameStarted = true;
    };

    this.resetView = function() {
        if(supr(this, "resetView")) {
            _character.resume();
            this._initGameVariables();
            this._initViews();
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

        //TERRAIN AND ITEMS
        _terrainLayer = this.parallaxView.addLayer({
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

        _itemLayer = this.parallaxView.addLayer({
            distance: 1,
            populate: function (layer, x) {
                var v = layer.obtainView(ItemBlock, {
                    group: "items",
                    character: _character,
                    superview: layer,
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

        var lvBox = new View({
            superview: this,
            x: WIDTH - HEIGHT/4,
            y: 0,
            width: HEIGHT/13,
            height: HEIGHT/9
        });

        _scoreView = new ScoreView({
            superview: svBox,
            x:0,
            y:0,
            layout: 'box',
            text: "0",
            characterData: this._nextCharData()
        });

        _livesView = new ScoreView({
            superview: lvBox,
            layout: 'box',
            layoutHeight: HEIGHT/4,
            layoutWidth: HEIGHT/4,
            text: _lives,
            characterData: this._nextCharData()
        });

        _character.startAnimation('run', {loop: true});
        
        this._initViews();
        this._initGameHandlers();
    };

    this.updateLives = function() {
        _lives--;
        if(_lives > 0) {
            _livesView.setText(_lives);
            _flag_jump = true;
        } else {
            _gameStarted = false;
            GC.app.transitionViews(GC.app.gameOverView, _score);
        }
    };

    this._nextCharData = function() {
        var d = {};
        for (var i = 0; i < 10; i++) {
            d[i] = { image: "resources/fonts/scoreboard/" + i + ".png"};
        }
        return d;
    };

    this._initGameHandlers = function() {

        this.tick = function(dt) {

            _scrollX += _speed;
            if(_gameStarted) {
                _terrainLayer.scrollTo(_scrollX, 0);
                _itemLayer.scrollTo(_scrollX, 0);
                _character.updateCollisionPoints();       
            } 
        }; 

        this.on('InputStart', function() {

            if(!_character.isImmune() && _flag_jump) {

                _flag_jump = false;
                _character.pause();

                animate(_character)
                .now({ y: HEIGHT/6 }, 500, animate.easeInOut)
                .then({ y: CHARACTER_ELEVATION }, 750, animate.easeIn)
                .then(bind(this, function() {

                    _flag_jump = true;
                    _character.resume();

                }));                     
            }
        });
    };    
 });