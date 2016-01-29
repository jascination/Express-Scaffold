// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
	'googleAuth' : {
		'clientID' 		: process.env.GOOGLE_CLIENTID,
		'clientSecret': process.env.GOOGLE_CLIENTSECRET,
		'callback1' 	: process.env.GOOGLE_CALLBACK
	}
};

