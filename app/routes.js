module.exports = function(app, passport) {

var User = require('../app/models/user');

// normal routes ===============================================================

	// route to test if the user is logged in or not 
	app.get('/loggedin', function(req, res) {
			if(req.isAuthenticated()){
				res.send(req.user)
			}else{
				res.send('0');
			}	    
	});

	// route to log out 
	app.get('/logout', function(req, res) {
	    req.logOut();
			res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// google ---------------------------------
		
		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { 
																					scope : ['https://mail.google.com/', 'profile', 'email','https://www.googleapis.com/auth/userinfo.profile', 'https://www.google.com/m8/feeds'],
                                      									accessType: 'offline', 
                                      									approvalPrompt: 'force' 
                                      								}
                                      					));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				failureRedirect : '/'
			}), function(req, res){
				var user = req.user;

				res.cookie('user_id', user.id, { expires: new Date(new Date().setYear(new Date().getFullYear() + 10))});
				console.log(req.cookies);
				
				checkOld();

				function checkOld(){
					if(req.cookies.oldPath){
						console.log("Old Path:", req.cookies.oldPath)
						res.redirect(req.cookies.oldPath);
					}else{
						res.redirect('/profile/make');
					}
				}
			});

};
