

 const home = require('../routes/home'),
    user = require('../routes/user'),
    settings = require('../routes/settings'),
    forgot = require('../routes/forgot'),
    play = require('../routes/play'),
    player = require('../routes/player'),
    search = require('../routes/search'),
    video = require('../routes/video'),
    index = require('../routes/index'),
    admin = require('../routes/admin')

//     auth = require('../routes/auth'),

 module.exports = function(app){
    app.use('/search',search);
    app.use('/video',video);
    app.use('/play',play);
    app.use('/player',player);
    app.use('/user',user);
    app.use('/settings',settings);
    app.use('/forgot',forgot);
    app.use('/index',index);  
    app.use('/admin',admin);
    app.use('/',home);

 }
