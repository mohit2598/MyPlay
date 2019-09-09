
const Fuse = require('fuse.js'),
    {dbVideo} = require('../../dbModels/video.js')

module.exports = async function(str){ 

    list = await dbVideo.find();
    var options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
        "title",
        "description"
    ]
    };
   // console.log(list);
    var fuse = new Fuse(list, options); // "list" is the item array
    var result = fuse.search(str);
    console.log(result);
    return result;
}

