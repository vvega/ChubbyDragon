import ui.ImageView;

exports = Class(ui.ImageView, function (supr) {

    this.init = function(opts) {
        opts = merge(opts, {
            x:0,
            y:0,
            image: "resources/images/forest-background.png",
            visible: false,
            zIndex: Z_PREV
        });
        this.isBuilt = false;
        supr(this, 'init', [opts]);
    };

    this.constructView = function() {
        if(!this.isBuilt) {
            this.build();
            this.isBuilt = true;
        }
        this.style.visible = true;
        this.style.opacity = 1;
    };

    this.hideView = function() {
        this.style.visible = false;
        this.style.opacity = 0;
        this.style.zIndex = Z_PREV;
    };

    this.showView = function() {
        this.style.zIndex = Z_CURRENT; 
    };

    this.build = function() {
        //subclasses must implement
    };

    this.resetView = function() {
        //subclasses must implement
    };
});
