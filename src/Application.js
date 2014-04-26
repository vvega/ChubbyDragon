import ui.TextView as TextView;
import ui.ImageView as ImageView;
import ui.ScrollView as ScrollView;
import ui.StackView as StackView;
import src.screens.TitleScreen as TitleScreen;
import src.screens.GameScreen as GameScreen;
//import src.SoundController as SoundController;
import device;

//get landscape mode dimensions
var deviceDimensions = device.getDimensions(true);
device.screen.defaultOrientation = "landscape";

//TODO: lock in landscape

//calculate dimensions to scale based on deviceDimensions
var boundsWidth = 576,
    boundsHeight = 1024,
    baseWidth = boundsWidth,

    baseWidth = deviceDimensions.width * (boundsHeight / deviceDimensions.height),
	baseHeight = boundsHeight,
    scale = deviceDimensions.height / baseHeight,

    rightBoundary = baseWidth,
    leftBoundary = 0,
    vx = 0;

    console.log("height: "+deviceDimensions.height+", width:"+deviceDimensions.width);

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var titlescreen = new TitleScreen({
                    width: baseWidth,
                    height: baseHeight
                });
                var gamescreen = new GameScreen({
                    width: baseWidth,
                    height: baseHeight
                });
            
		this.view.style.scale = scale;
                
                var rootView = new StackView({
                    superview: this.view,
                    x: 0,
                    y: 0,
                    width: baseWidth,
                    height: baseHeight,
                    backgroundColor: "grey"
                });
                
                //rootView.push(titlescreen);
                
                 rootView.push(gamescreen);
                  gamescreen.emit('app:start');
                
                //TODO: var sound = SoundController.getSound();

                 //captures broadcast to start gamescreen via pushing onto the rootView
                 titlescreen.on('titlescreen:start', function () {
                  // sound.play('levelmusic');
                   rootView.push(gamescreen);
                   gamescreen.emit('app:start');
                 });

                 //captures broadcast to end gamescreen via popping the gamescreen off of the rootView
                 gamescreen.on('gamescreen:end', function () {
                   //sound.stop('levelmusic');
                   rootView.pop();
                 });
               };
	
        this.launchUI = function () {
	};
});
