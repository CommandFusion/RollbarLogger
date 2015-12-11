(function(exports){

	exports.systemChangeTimeoutCollection = {};
	exports.connectionUpdateDelay = 1000; // Delay period to skip short lived connection changes

	/**
	 * Watch all system connections/disconnections. Watch suspend/resume events.
	 * This must be called by the CF.userMain function in your code: CFRollbar.init();
	 */
	exports.init = function(config) {

		//var transformer = function(payload) {
		//	payload.client.javascript.browser = CF.device
		//};

		var _rollbarConfig = {
			accessToken: config.accessToken,
			captureUncaught: true,
			payload: {
				environment: 'iviewer',
				person: {
					username: CF.device.name, // Use iViewer device name (name of your iPad for example)
					id: CF.device.uuid // Use iViewer UUID as the person ID so that logs from specific devices are grouped.
				}
			}
			//transform: transformer
		};

		if (!Rollbar) {
			CF.log("Rollbar init failed!");
			CF.setJoin("zmessages", "Rollbar init failed!");
		} else {
			CF.log("Rollbar init called.");
		}

		Rollbar.init(_rollbarConfig);

		Rollbar.info("Launched iViewer!", function(err, data) {
			if (err) {
				CF.log("Error while reporting log to Rollbar: " + data.responseText);
				CF.setJoin("zmessages", "Error while reporting log to Rollbar: " + data.responseText);
			} else {
				CF.log("Log successfully reported to Rollbar. Entry UUID: " + data.result.uuid);
				CF.setJoin("zmessages", "Log successfully reported to Rollbar. Entry UUID: " + data.result.uuid);
				CF.log("Entry URL: https://rollbar.com/occurrence/uuid/?uuid=" + data.result.uuid);
			}
		});

		if (config.watchSystems) {
			// Watch all systems for connection state changes
			// Send the state change message along with the full system data (name, address, port, connection list, etc);
			for (var systemName in CF.systems) {
				if (!CF.systems.hasOwnProperty(systemName)) continue;
				CF.watch(CF.ConnectionStatusChangeEvent, systemName, function (system, connected) {
					// Cancel and previous connection change update if it happened within the configured delay period
					exports.systemChangeTimeoutCollection[system] && clearTimeout(exports.systemChangeTimeoutCollection[system]);
					// Log the connection state to the server after a delay
					exports.systemChangeTimeoutCollection[system] = setTimeout(function (system, connected) {
						// Get full system details
						var systemInfo = CF.systems[system];
						if (connected) {
							Rollbar.info("System Connected: " + system, systemInfo);
						} else {
							Rollbar.warning("System Disconnected: " + system, systemInfo);
						}
					}, exports.connectionUpdateDelay, system, connected);
				}, false); // Don't request status immediately
			}
		}

		if (config.watchSuspend) {
			CF.watch(CF.GUISuspendedEvent, function () {
				Rollbar.info("Suspended iViewer.");
			});
		}

		if (config.watchResume) {
			CF.watch(CF.GUIResumedEvent, function () {
				Rollbar.info("Resumed iViewer.");
			});
		}
	};

})(typeof exports === 'undefined' ? this['CFRollbar']={} : exports);