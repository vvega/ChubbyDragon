import ui.ImageView as ImageView;


exports = Class(ImageView, function(supr) {
    var parent;
    
    this.init = function(opts) {       
        opts = merge(opts, {
             image: "resources/images/terrain_block.png"
        });
        
        parent = opts.superview;
        
       /* if(Math.random() > .5) {
            this.image = "";
            this.backgroundColor = "red";
        }*/
        //call to super constructor with custom class options
        supr(this, 'init', [opts]);
    };
});

