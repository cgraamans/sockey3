const APP = {

	// LOGIN/LOGOUT/TOKEN TIMES
	SessionTimeout: 3600, //s
	TokenTTL: 100, //s,

	// OWASP PASSWORD CHECKER VARIABLES
	OWASP:{
		allowPassphrases       : true,
		maxLength              : 64,
		minLength              : 10,
		minPhraseLength        : 20,
		minOptionalTestsToPass : 3,
	},

	STATE:{

		refresh:3600000, //ms

	}

};
export default APP;