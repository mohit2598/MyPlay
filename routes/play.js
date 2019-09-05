const express = require('express'),
    router = express.Router(),
    fs = require('fs')

router.get('/video', function(req, res) {
  const path = 'assets/sample.mp4'  // need to supplied here
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  //console.log(req.headers.range);
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    var end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    var chunksize = (end-start)+1
    var maxChunk = 1024 * 1024; // 1MB at a time
    if (chunksize > maxChunk) {
      end = start + maxChunk - 1;
      chunksize = (end - start) + 1;
    }
    const file = fs.createReadStream(path, {start, end})
    // console.log('start ' + start);
    // console.log('end ' + end);
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    console.log(head["Content-Range"]);
    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

module.exports = router;