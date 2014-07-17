import AudioManager;
import ui.ImageView as ImageView;
import ui.widget.ButtonView as ButtonView;

exports = Class(AudioManager, function(supr) {
	
	var _rootView;

	this.init = function(opts) {
		opts = merge(opts, {
			path : soundData.basePath,
			files : soundData.files
		});
		_rootView = opts.superview;
		supr(this, 'init', [opts]);
		this.buildView();
	};

	this.buildView = function() {
		/*var muteAll = new ButtonView({
			backgroundColor: "red",
			height: 100,
			width: 100,
			x: WIDTH - 100,
			y: 0,
			zIndex: 10000,
			on: {
				up: function() {
					this.mute();
				}.bind(this)
			}
		});

		var muteMusic = new ButtonView({
			backgroundColor: "blue",
			height: 100,
			width: 100,
			x: WIDTH - 230,
			zIndex: 10000,
			y: 0
		});

		_rootView.addSubview(muteAll);
		_rootView.addSubview(muteMusic);*/
	};

	this.play = function(){};
});