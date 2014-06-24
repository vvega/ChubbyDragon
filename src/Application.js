import device;
import animate;
import ui.ImageView as ImageView;
import src.controller.TitleScreen as TitleScreen;
import src.controller.GameOverView as GameOverView;
import src.controller.GameView as GameView;
import src.model.DataManager as DataManager;
import src.model.ImageManager as ImageManager;
import src.view.RootView as RootView;
//import src.SoundController as SoundController;

exports = Class(GC.Application, function() {

    Z_CURRENT = 2;
    Z_PREV = 1;
    TRANSITION_TIME = 300;

	this.initUI = function() {
        this._initDimensions();
        this._obtainData();
        this.rootView = new RootView({
            superview: this.view
        });
        this.titleScreen = new TitleScreen({
            superview: this.rootView,
            highScore: this.highScore,
            zIndex: Z_CURRENT,
            visible: false,
            width: WIDTH,
            height: HEIGHT
        });
        this.gameView = new GameView({
            superview: this.rootView,
            visible: false,
            width: WIDTH,
            height: HEIGHT
        });
        this.gameOverView = new GameOverView({
            superview: this.rootView,
            visible: false,
            width: WIDTH,
            height: HEIGHT
        });
        
        this.rootView.constructView();
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

    //initialize dimensions based on device dimensions. Check for iPad and large ~4:3 WxH ratios.
    this._initDimensions = function() {
        var deviceDimensions = device.getDimensions(true);
        var boundsWidth = 576;
        var boundsHeight = 1024;
        WIDTH = boundsWidth;
        WIDTH = deviceDimensions.width * (boundsHeight / deviceDimensions.height);
        HEIGHT = boundsHeight;
        SCALE = deviceDimensions.height / HEIGHT;
        BLOCK_SIZE = HEIGHT/4.9;
        this.isTablet = (deviceDimensions.height/deviceDimensions.width >= 3/4);
    };

    this._obtainData = function() {
        imageData = ImageManager.getImageData();
        dataManager = new DataManager();
        this.highScore = dataManager.getData(KEY_HIGH_SCORE);
    };
});
