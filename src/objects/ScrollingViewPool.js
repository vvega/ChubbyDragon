import ui.ImageView as ImageView;
import ui.View as View;
import ui.ViewPool as ViewPool;

exports = Class(ViewPool, function(supr) {
    this.init = function(opts) {        
        opts = merge(opts, {
            ctor: View
        });
    
        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
    };
});