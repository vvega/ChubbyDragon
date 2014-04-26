import ui.ImageView as ImageView;


exports = Class(ImageView, function(supr) {
    var parent;
    
    this.init = function(opts) {       
        opts = merge(opts, {
        });
        
        parent = opts.superview;
        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
    };
});

