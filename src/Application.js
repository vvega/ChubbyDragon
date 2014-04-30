import ui.StackView as StackView;
import src.layouts.TitleScreen as TitleScreen;
import ui.ImageScaleView as ImageScaleView;
import src.layouts.GameOverView as GameOverView;
import src.layouts.GameView as GameView;
//import src.SoundController as SoundController;
import device;

//get landscape mode dimensions
var deviceDimensions = device.getDimensions(true);

//calculate dimensions to scale based on deviceDimensions
var boundsWidth = 576,
    boundsHeight = 1024,
    baseWidth = boundsWidth;
    
baseWidth = deviceDimensions.width * (boundsHeight / deviceDimensions.height);

var baseHeight = boundsHeight;
var scale = deviceDimensions.height / baseHeight;


exports = Class(GC.Application, function () {
        
        var rootView, 
            backgroundView,
            gameView,
            gameOverView,
            titleScreen,
            highScore;
        
	this.initUI = function () {
                
                //TODO: read/write mechanism for local highScore. Default is set to 0;
                highScore = JSON.parse(CACHE['resources/cache/data.json']).highscore;                                   
            
		this.view.style.scale = scale;               
                
                rootView = new StackView({
                    superview: this.view,
                    x: 0,
                    y: 0,
                    width: baseWidth,
                    height: baseHeight
                });
                
                backgroundView = new ImageScaleView({
                    width: baseWidth,
                    height: baseHeight,
                    image: 'resources/images/forest-background.png'           
                });
               
                titleScreen = new TitleScreen({
                    highScore: highScore,
                    width: baseWidth,
                    height: baseHeight
                });
                 
                gameView = this.getNewGameView();
                gameOverView = this.getNewGameOverView();
                                    
                //TODO: var sound = SoundController.getSound();
        };
        
        
        this.launchUI = function () {
            
            //captures broadcast to start gamescreen via pushing onto the rootView
           titleScreen.on('titlescreen:start', function () {
               gameView.emit("gameview:start");
               rootView.push(gameView);
           });
 
            //push the titlescreen
            rootView.addSubview(backgroundView);
            titleScreen.emit("app:start");
            rootView.push(titleScreen);
	};
        
        //creates new gameview
        this.getNewGameView = function() {

            var newGameView = new GameView({
                        width: baseWidth,
                        height: baseHeight
            });
            
            newGameView.on('gameview:gameover', function (score) {
              
                gameOverView = this.getNewGameOverView();
                
                //push highscore if present
                if(score > highScore) {
                    highScore = score;
                    var flag_newHighScore = true;
                }
                
                gameOverView.emit("gameover:gameover", flag_newHighScore, highScore);
                rootView.push(gameOverView);
                
            }.bind(this));  

            return newGameView;
        };
        
        //creates new gameoverview
        this.getNewGameOverView = function() {

            var newGameOverView = new GameOverView({
                        width: baseWidth,
                        height: baseHeight
            });
            
            newGameOverView.on('gameover:replay', function(){
                  
                  //remove and clear game layer
                  rootView.remove(gameView);
                  this.clearGameView();
                  
                  titleScreen.style.visible = false;
                  //pop off the game over menu                 
                  
                  //generate a new game layer
                  gameView = this.getNewGameView();
                 
                  //emit start and push new view onto stack
                  gameView.emit("gameview:start");
                  rootView.push(gameView, false, true);                  

                 //then clear the game over view 
                  rootView.remove(gameOverView);
                  this.clearGameOverView();

                 //reinitialize
                 gameOverView = this.getNewGameOverView();

            }.bind(this));

            newGameOverView.on('gameover:menu', function(){
                  
                  //remove and clear game layer
                  rootView.remove(gameView);
                  this.clearGameView();
                  
                  //pop the game over view off of the stack
                  rootView.pop();
                  
                  //then clear the game over view
                  rootView.remove(gameOverView);
                  this.clearGameOverView();
                  
                  //reinitialize
                  gameView = this.getNewGameView();
                  gameOverView = this.getNewGameOverView();

            }.bind(this));

            return newGameOverView;
        };
        
        //clears gameview
        this.clearGameView = function() {    
             gameView.removeAllSubviews();
             gameView = null;
        };
        
        //clearsgameview
        this.clearGameOverView = function() {
            gameOverView.removeAllSubviews();
            gameOverView = null;
        };
});
