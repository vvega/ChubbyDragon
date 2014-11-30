exports.getImageData = function() {
    var imageData = {
        ui: {
            logo: "resources/images/ui/logo.png",
            header: "resources/images/ui/header.png",
            scoreFont: "resources/fonts/scoreboard/",
            life: "resources/images/ui/life.png",
            guideBG: "resources/images/ui/guide/guide_bg.png",
            boostBar: {
                frame: "resources/images/ui/boost_frame.png",
                bar: "resources/images/ui/boost_bar.png"
            },
            guideImages: [
                "resources/images/ui/guide/guide_1.png",
                "resources/images/ui/guide/guide_2.png",
                "resources/images/ui/guide/guide_3.png"
            ],
            button: {
                up: "resources/images/ui/button.png",
                down: "resources/images/ui/button_selected.png"
            },
            sound : {
                sfx: {
                    on: "resources/images/ui/sound.png",
                    off: "resources/images/ui/sound_off.png"
                },
                music: {
                    on: "resources/images/ui/music.png",
                    off: "resources/images/ui/music_off.png"
                }
            }
        },
        environment: {
            sky: "resources/images/environment/sky.png",
            mountains: "resources/images/environment/mountains.png",
            clouds: [
                "resources/images/environment/cloud_000.png",
                "resources/images/environment/cloud_001.png"
            ],
            terrain: {
                grass: "resources/images/environment/terrain_block.png",
                brambles: "resources/images/environment/terrain_block_brambles.png"
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

exports.getSoundData = function() {
    var soundData = {
        basePath: "resources/audio/",
        files: {
            startButton: {
                volume: .5
            },
            death: {
                volume: .6
            },
            plusSpeed: {
                volume: .6
            },
            menu : {
                volume: 1,
                loop: true,
                background: true
            },
            game: {
                volume: 1,
                loop: true,
                background: true
            }
        }
    }
    return soundData;
};