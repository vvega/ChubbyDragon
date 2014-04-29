import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.View as View;
import ui.ViewPool as ViewPool;
import src.objects.TerrainBlock as TerrainBlock;
import src.objects.ParallaxView as ParallaxView;
import src.objects.ItemBlock as ItemBlock;
import animate;
import src.SpriteManager as SpriteManager;
import src.objects.Character as Character;
import math.geom.intersect as intersect;

exports = Class(View, function(supr) {
    var parent, 
    width, 
    height;
    
    var baseSpeed = 8;
    var speed = baseSpeed; 
    var groundElevation, startX;
    var level, items, character, characterElevation;
    var TERRAIN_BLOCK_SIZE, CHARACTER_WIDTH, CHARACTER_HEIGHT;
    var gameStarted;
    var flag_jump = true;
    var scrollX;
    
    var numTerrain = 20;
    var numItems = 10;

    this.init = function(opts) {        
        opts = merge(opts, {
            x:0,
            y:0
        });
        
        parent = opts.superview;
        width = opts.width;
        height = opts.height;

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
        
        scrollX = 0;
        
        gameStarted = false;

        supr(this, 'init', [opts]);
        this.build();
    };
    
    this.build = function(){
      
        //ViewPool for terrain
      this.level = new ViewPool({
            ctor: TerrainBlock,
            initCount: numTerrain,
            initOpts: {
                superview: this,
                width: TERRAIN_BLOCK_SIZE,
                height: TERRAIN_BLOCK_SIZE,
                y: height - TERRAIN_BLOCK_SIZE
            }
      });
      
      //ViewPool for items
      this.items = new ViewPool({
          ctor: ItemBlock,
            initCount: numItems,
            initOpts: {
                superview: this,
                width: TERRAIN_BLOCK_SIZE/1.5,
                height: TERRAIN_BLOCK_SIZE/1.5,
                y: height - TERRAIN_BLOCK_SIZE*1.6
            }
      });
 
      ///PARALLAX VIEW
      this.parallaxView = new ParallaxView({
          superview: this,
          width: this.style.width,
          height: this.style.height
      });
      
      this.parallaxView.addBackgroundView(new ImageScaleView({
          scaleMethod: 'cover',
          image: 'resources/images/forest-background.png'
      }));   
      
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
            
        character.on("character:ready", function() {
            gameStarted = true;
        });
                   
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
      
      itemLayer.scrollTo(0,0);

      this.render = bind(this, function(ctx) {
          character.updateCollisionPoints();
          
      });   

     this.tick = function(dt) {
         scrollX += speed;
         terrainLayer.scrollTo(scrollX, 0);
         if(gameStarted) {
         itemLayer.scrollTo(scrollX,0);       
         } else {
            
         }
     };   
    };     
    
    this.on('InputStart', function() {
        
        if(gameStarted && flag_jump) {
           //  var weight = character.getWeight();
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
        
    this.adjustSpeed = function(value) {
        //speed is equal to scrolling animation duration
        //it will increase with increased weight
      speed = baseSpeed + value;

    };
    
    this.getBaseSpeed = function() {
        return baseSpeed;
    };
    
    this.getChar = function() {
        return character;
    };
    
    this.gameStarted = function() {
        return gameStarted;
    };
});

