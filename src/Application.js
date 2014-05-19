import device;
import animate;
import ui.View as View;
import src.controller.TitleScreen as TitleScreen;
import src.controller.GameOverView as GameOverView;
import src.controller.GameView as GameView;
import src.model.DataManager as DataManager;
import src.model.SpriteManager as SpriteManager;
//import src.SoundController as SoundController;

exports = Class(GC.Application, function() {

    Z_CURRENT = 2;
    Z_PREV = 1;
    TRANSITION_TIME = 300;

	this.initUI = function() {
        this._initDimensions();
        this._obtainData();
        this.rootView = new View({
            superview: this.view,
            x: 0,
            y: 0,
            width: WIDTH,
            height: HEIGHT,
            scale: SCALE
        });
        this.titleScreen = new TitleScreen({
            superview: this.rootView,
            highScore: this.highScore,
            zIndex: Z_CURRENT,
            width: WIDTH,
            height: HEIGHT
        });
        this.gameView = new GameView({
            superview: this.rootView,
            width: WIDTH,
            height: HEIGHT
        });
        this.gameOverView = new GameOverView({
            superview: this.rootView,
            width: WIDTH,
            height: HEIGHT
        });
        //TODO: var sound = SoundController.getSound();
    };

    this.launchUI = function () {
        //go to the title screen
        this.transitionViews(this.titleScreen);
    };

    this.transitionViews = function(nextView, params) {
        //reset nextView
        if(nextView.isBuilt) {
            nextView.resetView();
        }
        //if activeView exists, fade it out and hide it
        if(this.activeView) {
            animate(this.activeView)
                .now({opacity:0}, TRANSITION_TIME, animate.linear)
                .then(bind(this, function() {
                    //reassign activeView once animation is done
                    this.activeView.hideView();
                    this.activeView = nextView;
                    this.activeView.showView();
            }));
            nextView.constructView(params);
        } else {
            setTimeout(function(){
                 nextView.constructView(params);
                 nextView.showView();
            }, TRANSITION_TIME);
            this.activeView = nextView;
        }
    };

    this._initDimensions = function() {
        //get landscape mode dimensions
        var deviceDimensions = device.getDimensions(true);
        //calculate dimensions to scale based on deviceDimensions
        var boundsWidth = 576;
        var boundsHeight = 1024;
        WIDTH = boundsWidth;
        WIDTH = deviceDimensions.width * (boundsHeight / deviceDimensions.height);
        HEIGHT = boundsHeight;
        SCALE = deviceDimensions.height / HEIGHT;
    };

    this._obtainData = function() {
        imageData = SpriteManager.getImageData();
        dataManager = new DataManager();
        this.highScore = dataManager.getData(KEY_HIGH_SCORE);
    };
});
