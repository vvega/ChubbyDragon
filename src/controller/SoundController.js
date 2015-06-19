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

		this.music = opts.music;
		this.sfx = opts.sfx;
		this.sfx || this.setEffectsMuted(true);
		this.music || this.setMusicMuted(true);
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
				}),
				unselected: bind(this, function() {
					this.setMusicMuted(false);
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
				}),
				unselected: bind(this, function() {
					this.muteAll(false);
					this.muteMusic.setState(ButtonView.states.UNSELECTED);
				})
			}
		});

		this.muteSound.style.update({ zIndex: Z_CURRENT + 1});
		this.muteMusic.style.update({ zIndex: Z_CURRENT + 1});
		this.music || this.muteMusic.setState(ButtonView.states.SELECTED);
		this.sfx || this.muteSound.setState(ButtonView.states.SELECTED);
	};

	this.setMusicMuted = function(muted) {
		var vol = muted ? 0 : soundData.files.game.volume;
		if(GC.app.device.isAndroid) {
			supr(this, 'setVolume', ['game', vol]);
			supr(this, 'setVolume', ['menu', vol]);
		} else {
			supr(this, 'setMusicMuted', [muted]);
		}
		this.music = !muted;
		storageManager.setData(KEY_MUSIC, this.music);
	};

	this.setEffectsMuted = function(muted) {
		supr(this, 'setEffectsMuted', [muted]);
		this.sfx = !muted;
		storageManager.setData(KEY_SFX, this.sfx);
	};

	this.muteAll = function(muted) {
		this.setMusicMuted(muted);
		this.setEffectsMuted(muted);
	};
});