CF.userMain = function() {

	// Make sure Rollbar was added to the guiDesigner project via script manager
	if (!CFRollbar) {
		CF.log("CFRollbar.js missing from project!");
		CF.setJoin("zmessages", "CFRollbar.js missing from project!");
	} else {
		// Setup Rollbar by pasting the Client Project Access Token from your Rollbar account below.
		// Without this access token, Rollbar won't get your logs!
		CFRollbar.init({accessToken: "YOUR CLIENT ACCESS TOKEN HERE", watchSystems: true, watchSuspend: true, watchResume: true});
	}

	// Now anywhere in your code, or even from commands in your project, you can call Rollbar to send logs.
	// Rollbar.info("log some info message");
	// Rollbar.error("log some error message");
	// For more examples, see Rollbar docs:
	// https://rollbar.com/docs/notifier/rollbar.js/#usage
};