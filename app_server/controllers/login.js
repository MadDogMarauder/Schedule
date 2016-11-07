// login controller

// Login form for the site
module.exports.userLogin = function(req,res){
    res.render('login',{
        csrfToken: req.csrfToken()
    });
};
