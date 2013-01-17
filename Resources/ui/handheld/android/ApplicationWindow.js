//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	//var FirstView = require('ui/common/FirstView');
	var AuthView = require('ui/common/Auth');
	var StreamView = require('ui/common/Stream');
	
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		navBarHidden:true,
		exitOnClose:true
	});
	
	// Create View instance
	var stream_view = new StreamView();
	
	// Check Token
	var appData = Ti.Filesystem.getApplicationDataDirectory(),
		tokenFile = Ti.Filesystem.getFile(appData + '/token.json');
	var tokenData = tokenFile.read().text;
	
	console.info('Check Token.')
	
	if (tokenData === '') {
		var token = {};
			token.auth = false;
			token.value = '';
			token.update_time = new Date().getTime();
		tokenFile.write( JSON.stringify(token) );
		var auth_view = new AuthView();
		self.add(auth_view);
	} else {
		try {
			var token = JSON.parse( tokenData );
		} catch (e) {
			console.error(e);
		}
		console.info('token type: ' + typeof token.value)
		console.info('token length: ' + token.value.length)
		if (token.value === false) {
			var auth_view = new AuthView();
			//self.add(stream_view);
			self.add(auth_view);
		} else {
			Ti.API.info('Token: ' + token.value);
			
			var position = {};
			Ti.Geolocation.getCurrentPosition( function (e) {
				if (e.error) {
					Ti.Android.createNotification({
						duration: Ti.UI.NOTIFICATION_DURATION_LONG,
						message: 'Error: ' + JSON.stringify(e.error)
					});
				}
				position.latitude = e.coords.latitude;
				position.longitude = e.coords.longitude;				
			});
			
			var intent = Ti.Android.createIntent({
				action: 'android.media.action.VIDEO_CAPTURE'
			});
			Ti.Android.currentActivity.startActivityForResult(intent, function (e) {
				if (e.error) {
					Ti.UI.createNotification({
						duration: Ti.UI.NOTIFICATION_DURATION_LONG,
						message: 'Error: ' + e.error
					});
				} else {
					console.info('Result Code: ' + e.resultCodr);
					if (e.resultCode === Ti.Android.RESULT_OK) {
						videoUri = e.intent.data;
						Ti.UI.createNotification({
							duration: Ti.UI.NOTIFICATION_DURATION_LONG,
							message: 'Video captured!'					
						}).show();
					} else {
						Ti.UI.createNotification({
							duration: Ti.UI.NOTIFICATION_DURATION_LONG,
							message: 'Canceled / Error ? Result Code: ' + e.resultCode
						}).show();
					}
				}
			});
		}
	}
	
	//var firstView = new FirstView();
	//self.add(firstView);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
