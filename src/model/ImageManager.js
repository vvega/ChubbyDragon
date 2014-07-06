exports.getImageData = function() {
    var imageData = {
        ui: {
            header: "resources/images/header.png",
            scoreFont: "resources/fonts/scoreboard/",
            life: "resources/images/life.png",
            sky: "resources/images/sky.png",
            guideBG: "resources/images/ui/guide/guide_bg.png",
            guideImages: [
                "resources/images/ui/guide/guide_1.png",
                "resources/images/ui/guide/guide_2.png",
                "resources/images/ui/guide/guide_3.png"
            ]
        },
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
        food: {
            base_path : "resources/images/food/",
            num_crumbs : 4,
            healthy: [
                "apple",
                "spinach",
                "broccoli",
                "beet",
                "grapes"
            ],
            fatty: [
                "cake",
                "donut",
                "lollipop",
                "icecream",
                "fries"
            ]
        },
        particles: {
            flames : [
                "resources/images/particles/flames/flame_1.png",
                "resources/images/particles/flames/flame_2.png",
                "resources/images/particles/flames/flame_3.png",
                "resources/images/particles/flames/flame_4.png"
            ],
            sparkles : [
                "resources/images/particles/crumbs/apple/crumb_1.png"
            ]
        }
    };
    return imageData;
};
