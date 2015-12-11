# Logging to Rollbar with CommandFusion iViewer

This sample project shows how you can log any data from your iViewer projects to a remote logging service called Rollbar.  
Rollbar offer various pricing tiers for their service, starting with **FREE logging for up to 5,000 log calls a month**.

## Getting Started

1. Signup for an account at [Rollbar.com](https://rollbar.com/signup/)
1. Create a project in your Rollbar account. You could create separate projects for each iViewer project you want to monitor, or just have them all logging to a single project.
1. Change the token in [main.js](blob/master/main.js#L9) to use the access token Rollbar assigned to your project.
1. Open the logging_example.gui in guiDesigner
1. Add your iViewer license code to the project (logging won't work without a license as it uses our CF.request JS API that is only available for licensed devices!)
1. Load the guiDesigner project into iViewer on your device and watch logs appear in your Rollbar account.

## Init Options

When initialising the Rollbar script, you can have it automatically watch all system connections, and app suspend/resume events.  

See [main.js](blob/master/main.js#L9) for how this is done:

```javascript
CFRollbar.init({
	accessToken: "YOUR CLIENT ACCESS TOKEN HERE",
	watchSystems: true,
	watchSuspend: true,
	watchResume: true
});
```

## Usage

Once initialized, you can call `Rollbar` from anywhere in your code, commands, buttons, etc. Some examples:


```javascript
// Standard log calls
Rollbar.info("log some info message");
Rollbar.error("log some error message");
Rollbar.warning("simple warning message");

// Add advanced data that will appear within the logs
Rollbar.info("some log message", { data: "hello", example: "more data" });

// Log with an entire JavaScript object as additional data
// This example will log the entire iViewer device details as per our JS API
// http://www.commandfusion.com/docs/scripting/globals.html#cF.device
Rollbar.info("Sending iViewer details...", CF.device);
```

For more examples, see Rollbar docs for browser JS:  
https://rollbar.com/docs/notifier/rollbar.js/#usage