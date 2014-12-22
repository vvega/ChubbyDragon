import AudioManager;
import ui.ImageView as ImageView;
import ui.widget.ButtonView as ButtonView;
import ui.View as View;

exports = Class(AudioManager, function(supr) {
	
	var _rootView;
	var _header;

	this.init = function(opts) {
		opts = merge(opts, {
			path : soundData.basePath,
			files : soundData.files
		});
		_rootView = opts.superview;
		supr(this, 'init', [opts]);
		GC.app.sfx || this.setEffectsMuted(true);
		GC.app.music || this.setMusicMuted(true);
		this.buildView();
	};

	this.buildView = function() {

		this.muteMusic = new ButtonView({
			superview: _rootView,
			images: {
				selected: imageData.ui.sound.music.off,
				unselected: imageData.ui.sound.music.on
			},
			toggleSelected: true,
			height: 100,
			width: 100,
			x: WIDTH - 230,
			y: 10,
			on: {
				selected: bind(this, function() {
					this.setMusicMuted(true);
					GC.app.music = false;
				}),
				unselected: bind(this, function() {
					this.setMusicMuted(false);
					GC.app.music = true;
				})
			}
		});

		this.muteSound = new ButtonView({
			superview: _rootView,
			images: {
				selected: imageData.ui.sound.sfx.off,
				unselected: imageData.ui.sound.sfx.on
			},
			toggleSelected: true,
			height: 100,
			width: 100,
			x: WIDTH - 110,
			y: 10,
			on: {
				selected: bind(this, function() {
					this.muteAll(true);
					this.muteMusic.setState(ButtonView.states.SELECTED);
					GC.app.sfx = true;
					GC.app.music = true;
				}),
				unselected: bind(this, function() {
					this.muteAll(false);
					this.muteMusic.setState(ButtonView.states.UNSELECTED);
					GC.app.sfx = false;
					GC.app.music = false;
				})
			}
		});


		this.muteSound.style.update({ zIndex: Z_CURRENT + 1});
		this.muteMusic.style.update({ zIndex: Z_CURRENT + 1});
		GC.app.music || this.muteMusic.setState(ButtonView.states.SELECTED);
		GC.app.sfx || this.muteSound.setState(ButtonView.states.SELECTED);
	};

	this.setMusicMuted = function(muted) {
		var vol = muted ? 0 : soundData.files.game.volume;
		supr(this, 'setVolume', ['game', vol]);
		supr(this, 'setVolume', ['menu', vol]);
		GC.app.music = !muted;
		storageManager.setData(KEY_MUSIC, GC.app.music);
	};

	this.setEffectsMuted = function(muted) {
		supr(this, 'setEffectsMuted', [muted]);
		storageManager.setData(KEY_SFX, GC.app.sfx);
		GC.app.sfx = !muted;
	};

	this.muteAll = function(muted) {
		this.setMusicMuted(muted);
		this.setEffectsMuted(muted);
	};
});