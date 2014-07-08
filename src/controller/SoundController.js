import AudioManager;

exports = Class(AudioManager, function(supr) {
	this.init = function(opts) {
		opts = merge(opts, {
			path : soundData.basePath,
			files : soundData.files
		});
		supr(this, 'init', [opts]);
	};
});