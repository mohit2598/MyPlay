

 const home = require('../routes/home'),
    user = require('../routes/user'),
    settings = require('../routes/settings'),
    forgot = require('../routes/forgot'),
    play = require('../routes/play')
//     auth = require('../routes/auth'),

 module.exports = function(app){
     console.log("vdfv");
    app.use('/play',play);
    app.use('/user',user);
    app.use('/settings',settings);
    app.use('/forgot',forgot);
    app.use('/',home);   
 }
