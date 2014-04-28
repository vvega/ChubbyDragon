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
    var num_terrain_tiles;
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
        console.log(opts);
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
        
        //number of terrain tiles to initialize on screen and to maintain during scrolling
        num_terrain_tiles = Math.ceil(width/TERRAIN_BLOCK_SIZE);
        
        scrollX = 0;

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
      
     var terrainLayer = this.parallaxView.addLayer({
          distance: 1,
          populate: function (layer, x) {
              var v = layer.obtainView(TerrainBlock, {
                    group: "terrain",
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
        
      this.render = bind(this, function(ctx) {
          character.updateCollisionPoints();
      });   

     this.tick = function(dt) {
         scrollX += speed;
         terrainLayer.scrollTo(scrollX, 0);
         itemLayer.scrollTo(scrollX,0);
       
     };
    };     
    
    this.on('InputStart', function() {
        
        if(flag_jump) {
           //  var weight = character.getWeight();
            flag_jump = false;
            character.pause();
           
            animate(character)
           .now({ y: 200 }, 500, animate.easeInOut)
           .then({ y: characterElevation }, 500, animate.easeIn)
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
          console.log("speed is now "+speed);
    };
    
    this.getBaseSpeed = function() {
        return baseSpeed;
    };
    
    this.getChar = function() {
        return character;
    };
    
    this.getItemPool = function() {
        return this.items;
    };
});

