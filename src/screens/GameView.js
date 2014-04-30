import ui.View as View;
import src.objects.TerrainBlock as TerrainBlock;
import src.objects.ParallaxView as ParallaxView;
import src.objects.ItemBlock as ItemBlock;
import animate;
import src.SpriteManager as SpriteManager;
import src.objects.Character as Character;
import ui.ScoreView as ScoreView;

exports = Class(View, function(supr) {
   
    var width, 
        height;
    
    var baseSpeed, speed;
    var groundElevation, startX;
    var character, characterElevation;
    var TERRAIN_BLOCK_SIZE, CHARACTER_WIDTH, CHARACTER_HEIGHT;
    var score, lives, scoreView, livesView;
    var gameStarted;
    var flag_jump;
    var scrollX;

    this.init = function(opts) {   
        opts = merge(opts, {
            x:0,
            y:0
        });

        width = opts.width;
        height = opts.height;
        
        supr(this, 'init', [opts]);

        //scale terrain blocks to device size
        TERRAIN_BLOCK_SIZE = height/6;
        groundElevation = height - TERRAIN_BLOCK_SIZE*2;
        
        //character is 2 blocks wide and 1 block tall
        CHARACTER_WIDTH = TERRAIN_BLOCK_SIZE*3;
        CHARACTER_HEIGHT = TERRAIN_BLOCK_SIZE*1.3;
        
        //calculate character's default y position (with some cushion)
        characterElevation = groundElevation - (CHARACTER_HEIGHT - (TERRAIN_BLOCK_SIZE + height/56));
        
        //sprite position based upon device width
        startX = width/9;
        
        //score 
        score = 0;
        
        //lives
        lives = 3;
        
        //initialize scroll amount
        scrollX = 0;
        
        //initialize jump flag
        flag_jump = true;
        
        //init speed amounts
        baseSpeed = 8;
        speed = baseSpeed;

        this.build();
    };
    
    this.build = function(){
        this.on('app:start', bind(this, start_game_flow)); 
    };     
        
    this.adjustSpeed = function(value) {
        //speed is equal to scrolling animation duration
        //it will increase with increased weight
        speed = baseSpeed + value;
    };
    
    this.updateScoreBoard = function(value) {
        score += value;
        scoreView.setText(score);
    };
    
    this.getLives = function(){
        return lives;
    };
    
    this.getBaseSpeed = function() {
        return baseSpeed;
    };
    
    this.getChar = function() {
        return character;
    };
    
    function start_game_flow() {
                
            gameStarted = true;
            ///PARALLAX VIEW
            this.parallaxView = new ParallaxView({
                superview: this,
                width: this.style.width,
                height: this.style.height
            });

            //character
            var imageData = SpriteManager.getImageData();
            character = new Character(merge({
                superview: this,
                name: "hero",
                x: startX,
                y: characterElevation,
                width: CHARACTER_WIDTH,
                height: CHARACTER_HEIGHT,
                visible: false,

                sheetData: merge({
                  anims: imageData.sprites.hero
                }, imageData.sprites.sheetData)
              }, imageData.sprites.creature));        

              character.startAnimation('run', {loop: true});

              character.on("character:die", function() {
                  lives--;
                  if(lives > 0) {
                      livesView.setText(lives);
                      flag_jump = true;
                  } else {
                      gameStarted = false;
                      this.emit("gameview:gameover", score);
                  }
              }.bind(this));


            //TERRAIN AND ITEMS
            var terrainLayer = this.parallaxView.addLayer({
                distance: 1,
                populate: function (layer, x) {
                    var v = layer.obtainView(TerrainBlock, {
                          group: "terrain",
                          character: character,
                          superview: layer,
                          image: "resources/images/terrain_block.png",
                          x: x,
                          y: height - TERRAIN_BLOCK_SIZE,
                          width: TERRAIN_BLOCK_SIZE,
                          height: TERRAIN_BLOCK_SIZE
                   });
                   return v.style.width;
                }
            });

            var itemLayer = this.parallaxView.addLayer({
                distance: 1,
                populate: function (layer, x) {
                    var v = layer.obtainView(ItemBlock, {
                          group: "items",
                          character: character,
                          superview: layer,
                          x: x,
                          width: TERRAIN_BLOCK_SIZE/1.5,
                          height: TERRAIN_BLOCK_SIZE/1.5,
                          y: height - TERRAIN_BLOCK_SIZE*1.6
                   });
                   //return random space between elements
                   return v.style.width + Math.random()*width;
                }
            }); 

            //SCORE
              var svBox = new View({
                  superview: this,
                  x: width/30,
                  y: height/32,
                  width: width/4,
                  height: height/6
              });

              var lvBox = new View({
                  superview: this,
                  x: width- height/4,
                  y: 0,
                  width: height/13,
                  height: height/9
              });

              var nextCharData = function() {
                var d = {};
                for (var i = 0; i < 10; i++) {
                  d[i] = {
                    image: "resources/fonts/scoreboard/" + i + ".png"
                  };
                }
                return d;
              };
                 
              scoreView = new ScoreView({
                superview: svBox,
                x:0,
                y:0,
                layout: 'box',
                text: "0",
                characterData: nextCharData()
              });

              livesView = new ScoreView({
                superview: lvBox,
                layout: 'box',
                layoutHeight: height/4,
                layoutWidth: height/4,
                text: lives,
                characterData: nextCharData()
              });
              

            this.render = bind(this, function(ctx) {
                character.updateCollisionPoints();

            });   

           this.tick = function(dt) {
               scrollX += speed;
              if(gameStarted) {
               terrainLayer.scrollTo(scrollX, 0);
               itemLayer.scrollTo(scrollX,0);       
              } 
           };   
           
             this.on('InputStart', function() {

                if(!character.isImmune() && flag_jump) {

                    flag_jump = false;
                    character.pause();

                    animate(character)
                   .now({ y: height/6 }, 500, animate.easeInOut)
                   .then({ y: characterElevation }, 750, animate.easeIn)
                   .then(bind(this, function() {

                       flag_jump = true;
                       character.resume();

                    }));         
                }
            });
      }   
 });


