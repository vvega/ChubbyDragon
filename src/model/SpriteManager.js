exports.getImageData = function() {
    var imageData = {
        sprites: {
            sheetData: {
                url: 'resources/images/spritesheet.png',
                height: 175,
                width: 250,
                offsetX: 0,
                offsetY: 0,
                startX: 0,
                startY: 0
            },
            hero: {
                jump: [ [0, 2], [1, 2], [2, 2], [3, 2] ],
                eat: [ [0, 5], [1, 5], [2, 5], [3, 5], [4, 5] ],
                run: [ [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0] , [0, 1], [1, 1], [3, 0],[2, 1] ]
            }
        },
        particles: {
            crumbs_cake: [ 
                "resources/images/crumbs/cake/crumb_1.png",
                "resources/images/crumbs/cake/crumb_2.png",
                "resources/images/crumbs/cake/crumb_3.png"
            ],
            crumbs_apple: [
                "resources/images/crumbs/apple/crumb_1.png",
                "resources/images/crumbs/apple/crumb_2.png",
                "resources/images/crumbs/apple/crumb_3.png",
                "resources/images/crumbs/apple/crumb_4.png"
            ]
        }
    };
    return imageData;
};
