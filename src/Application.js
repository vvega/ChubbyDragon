import device;
import animate;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.View as View;
import src.controller.TitleScreen as TitleScreen;
import src.controller.GameOverScreen as GameOverScreen;
import src.controller.GameScreen as GameScreen;
import src.controller.SoundController as SoundController;
import src.controller.MenuView as MenuView;
import src.model.BillingManager as BillingManager;
import src.model.StorageManager as StorageManager;
import src.model.ResourceManager as ResourceManager;
import src.view.ui.RootView as RootView;
import src.view.ui.BaseModal as BaseModal;
import GameKit;
import amplitude;
import leadbolt;
import facebook;
import billing;

facebook.onReady.run(function () {
    facebook.init({
        appId           : CONFIG.modules.facebook.facebookAppID,
        displayName     : CONFIG.modules.facebook.facebookDisplayName,
        status          : true,
        xfbml           : true,
        version         : 'v2.2'
    });
});

exports = Class(GC.Application, function() {

    Z_MODAL = 4;
    Z_CURRENT = 2;
    Z_PREV = 1;
    TRANSITION_TIME = 300;
    AMP = amplitude;
    LB = leadbolt;
    FB = facebook;
    GK = GameKit;
    BL = billing;

	this.initUI = function() {
        this._initDimensions();
        this._obtainData();
        this.device = device;
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
        this.gameScreen = new GameScreen({
            superview: this.rootView,
            visible: false,
            width: WIDTH,
            height: HEIGHT
        });
        this.gameOverScreen = new GameOverScreen({
            superview: this.rootView,
            visible: false,
            width: WIDTH,
            height: HEIGHT
        });
        this.menuView = new MenuView({
            superview: this.rootView,
            height: HEIGHT,
            width: HEIGHT
        });
        this.popup = new BaseModal({});
        this.modalScreen = new View({
            superview: this.rootView, 
            width: WIDTH,
            height: HEIGHT,
            zIndex: Z_MODAL - 1,
            x:0,
            backgroundColor: "#CCC",
            opacity: .4,
            visible: false,
            handleEvents: false
        });
        this.sound = new SoundController({
            superview: this.rootView,
            music: this.music,
            sfx: this.sfx
        });
        this.rootView.constructView();
        this.ads && LB.cacheInterstitial();
        GK.openGC = function() {
            this.showGameCenter(GC.app.syncScore(GC.app.loggedInPlayer));
        };
    };

    this.syncScore = function(err, player) {
        if(player && player.playerID) {
            GC.app.highScore && GK.submitScore({leaderboard: CONFIG.modules.gamekit.android.ladders.calories_burned, score: GC.app.highScore});
            GC.app.loggedInPlayer = player;
        } else {
            GK.registerAuthHandler(this.syncScore); 
            GK.showAuthDialog();
        }
    };

    this.launchUI = function () {
        //go to the title screen
        GC.app.sound.play('menu');
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
        var deviceDimensions = { width: device.width, height: device.height };
        var boundsWidth = 576;
        var boundsHeight = 1024;
        WIDTH = boundsWidth;
        WIDTH = deviceDimensions.width * (boundsHeight / deviceDimensions.height);
        HEIGHT = boundsHeight;
        BUTTON_WIDTH = WIDTH/3;
        BUTTON_HEIGHT = HEIGHT/6;
        SCALE = deviceDimensions.height / HEIGHT;
        this.isTablet = (deviceDimensions.height/deviceDimensions.width >= 3/4);
        BLOCK_SIZE = (this.isTablet) ? HEIGHT/6 : HEIGHT/4.9;
    };

    this._obtainData = function() {
        imageData = ResourceManager.getImageData();
        soundData = ResourceManager.getSoundData();
        billingManager = new BillingManager();
        storageManager = new StorageManager();
   
        this.highScore = storageManager.getData(KEY_HIGH_SCORE);
        this.sfx = (typeof storageManager.getData(KEY_SFX) == 'undefined') ? true : storageManager.getData(KEY_SFX);
        this.music = (typeof storageManager.getData(KEY_MUSIC) == 'undefined') ? true : storageManager.getData(KEY_MUSIC);
        this.ads = (typeof storageManager.getData(KEY_ADS) == 'undefined') ? true : storageManager.getData(KEY_ADS);
    };

    this.util = {
        cloneStyle: function(obj) {
            return Object.create({
                width: obj.width,
                height: obj.height,
                x: obj.x,
                y: obj.y,
                visible: obj.visible
            });
        }
    };
});
