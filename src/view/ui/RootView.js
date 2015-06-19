import ui.ImageView as ImageView;
import src.view.BaseView as BaseView;
import src.view.ParallaxView as ParallaxView;
import src.view.game.CloudLayer as CloudLayer;
import src.view.game.MountainLayer as MountainLayer;
import src.view.game.TerrainLayer as TerrainLayer;
import src.view.game.TerrainBlock as TerrainBlock;

exports = Class(BaseView, function(supr) {
	this.init = function(opts) {
		opts = merge(opts, {
			image: imageData.environment.sky,
			x: 0,
			y: 0,
			width: WIDTH,
			height: HEIGHT,
			scale: SCALE,
			visible: true
		});

		this.BASE_SPEED = 10;
		this.MAX_DISTANCE = 6;
		this.scrollX = 0;
		this.speed = this.BASE_SPEED;

		supr(this, 'init', [opts]);

		this.parallaxView = new ParallaxView({
            superview: this,
            width: this.style.width,
            height: this.style.height
        });
	};

	this.build = function() {

        this.mountainLayer = new MountainLayer({
            parent: this,
            distance: this.MAX_DISTANCE,
            populate: function (layer, x) {
                var v = layer.obtainView(ImageView, {
                    superview: layer,
                    x: x
                });
                return v.style.width;
            }
        });

		this.cloudLayer = new CloudLayer({
            parent: this,
            distance: this.MAX_DISTANCE - 1,
            populate: function (layer, x) {
                var v = layer.obtainView(ImageView, {
                    superview: layer,
                    x: x
                });
                return v.style.width + Math.random()*WIDTH/2;
            }
        });

        this.terrainLayer = new TerrainLayer({
            parent: this,
            distance: this.MAX_DISTANCE - 3,
            character: GC.app.gameScreen.character,
            populate: function (layer, x) {
                var v = layer.obtainView(TerrainBlock, {
                      superview: layer,
                      image: imageData.environment.terrain.grass,
                      x: x,
                      y: HEIGHT - BLOCK_SIZE,
                      width: BLOCK_SIZE,
                      height: BLOCK_SIZE
                });
                return v.style.width;
            }.bind(this)
        });

        this.parallaxView.addLayer(this.mountainLayer);
        this.parallaxView.addLayer(this.cloudLayer);
        this.parallaxView.addLayer(this.terrainLayer);
	};

	this.tick = function(dt) {
        this.speed = GC.app.gameScreen.speed || this.BASE_SPEED; 
        this.scrollX += this.speed;
        this.parallaxView && this.parallaxView.scrollTo(this.scrollX);
	};

    this.reset = function() {
        GC.app.gameScreen.speed = 100;
        setTimeout(bind(this, function() {
            GC.app.gameScreen.speed = this.BASE_SPEED;
        }), 350);
    };
});
