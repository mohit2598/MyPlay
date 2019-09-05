var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var {dbUser} = require('../dbModels/user');
const keys = require('../config/keys');



// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,             //GOOGLE_CLIENT_ID,
    clientSecret: keys.google.clientSecret,      //GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/login/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
        console.log(profile._json.email);
        console.log(accessToken);
         console.log(refreshToken);
       let dbuser = await dbUser.findOne({ email: profile._json.email })
       if(dbuser){
           return done(null,dbuser);
       }else{
            dbuser = new dbUser({
                name: profile._json.name,
                username: 'googleUser',
                password: 'googleUser',
                email: profile._json.email,
            })
            console.log(dbuser);
            let err = await dbuser.save()
            return done(err,dbuser);
        }
  }
));