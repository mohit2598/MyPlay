
const Fuse = require('fuse.js'),
    Video = require('../../dbModels/video.js')

module.exports = async function(str){ 

    list = await Video.find();
    var options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
        "title",
        "descirption"
    ]
    };
    var fuse = new Fuse(list, options); // "list" is the item array
    var result = fuse.search(str);
  //  console.log(result);
    return result;
}

