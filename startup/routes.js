

const home = require('../routes/home'),
   user = require('../routes/user'),
   settings = require('../routes/settings'),
   forgot = require('../routes/forgot'),
   play = require('../routes/play'),
   player = require('../routes/player'),
   search = require('../routes/search'),
   video = require('../routes/video'),
   index = require('../routes/index'),
   admin = require('../routes/admin'),
   playlist = require('../routes/playlist'),
   subscribe = require('../routes/subscribe'),
   adminPanel = require('../routes/adminPanel');
   

module.exports = function (app) {
   app.use('/subscribe',subscribe);
   app.use('/playlist', playlist);
   app.use('/search', search);
   app.use('/video', video);
   app.use('/play', play);
   app.use('/player', player);
   app.use('/user', user);
   app.use('/settings', settings);
   app.use('/forgot', forgot);
   app.use('/index', index);
   app.use('/adminPanel',adminPanel);
   app.use('/admin', admin);
   app.use('/', home);

}
