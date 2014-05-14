exports.getImageData = function() {
    var imageData = {
        sprites: {
            sheetData: {
              url: 'resources/images/wolfsheet.png',
              height: 31.5,
              width: 63.3,
              offsetX: 0,
              offsetY: 0,
              startX: 3,
              startY: 3
            },
            hero: {
              jump: [ [0, 2], [1, 2], [2, 2], [3, 2] ],
              eat: [ [0, 5], [1, 5], [2, 5], [3, 5], [4, 5] ],
              run: [ [0, 4], [1, 4], [2, 4], [3, 4], [4, 4] ]
            }
        }
    };
    return imageData;
};