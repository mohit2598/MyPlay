const {dbUser,validate} = require('../dbModels/user');

function User(params){
    this.name = params.name;
    this.email = params.email;
    this.username = params.username;
    this.password = params.password;
    this.contactNo = params.contactNo;
};

User.prototype.signup = async function(newUser){
        // dbUser validation and return the corresponding error
        const error = validate(newUser);
        //console.log(dbUser.hashPassword);
        if(error.error){
            return {code:0,err:error.error.details[0].message};
        }
        var dbuser = await dbUser.find().or({username:this.username,email:this.email})  // returns an array and hence dbuser[0]
        if(dbuser[0]){
            return {code:-1,dbuser:dbuser};
        }else{
            dbuser = new dbUser({
                name : this.name,
                email : this.email,
                username : this.username,
                contactNo : this.contactNo,
            });
            dbuser.password = dbuser.hashPassword(this.password);
            let user = await dbuser.save();
            return {code:1};
        }
}   


User.prototype.login = function(req,res,next){
    // be careful this fucking passport.authenticate returns a function which needs to be called
    passport.authenticate('local',function(err,user,info){
        if(user){
             res.redirect('/user/dashboard');
        }else{
             res.send(info).redirect('/');
        }
    })(req,res,next);
}


User.prototype.logout  = function(req, res,next){
    req.logout();
    res.redirect('/');
};


User.prototype.constructor = User;
module.exports = User ;
