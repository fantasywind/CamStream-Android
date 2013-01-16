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
		if (token.value === false) {
			var auth_view = new AuthView();
			//self.add(stream_view);
			self.add(auth_view);
		} else {
			var tmpview = Ti.UI.createView();
			var tmplabel = Ti.UI.createLabel();
			tmpview.add(tmplabel);
			tmplabel.setText(Ti.Media.isCameraSupported);
			self.add(tmpview);
			/*Ti.Media.showCamera({
				success: function (e) {
					alert('finish')
					//alert(e.media);
				},
				cancel: function (e) {
					alert('cancel')
				},
				error: function (e) {
					alert('erte');
				}
			});*/
		}
	}
	
	//var firstView = new FirstView();
	//self.add(firstView);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
