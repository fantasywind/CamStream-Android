function Auth() {
	var StreamView = require('ui/common/Stream');
	var stream_view = new StreamView();
	
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView({
		backgroundColor: '#222'
	});
	
	var submit_passcode = function (e) {
		var passcodeText = passcode.getValue(),
			deviceNameText = device_name.getValue();
		
		if (passcodeText.length < 6) {
			alert('請輸入 6 位數通行碼!');
			passcode.focus();
		} else if (!deviceNameText.length) {
			alert('請輸入裝置名稱');
			device_name.focus();
		} else if (passcodeText.length == 6) {
			var check_passcode = Ti.Network.createHTTPClient({
				onload: function (e) {
					result = JSON.parse(this.responseText);
					if (result.status === 'Success') {
						update_token(result.token);
						self.hide();
					} else {
						alert('認證失敗，請檢查通行碼')
					}
				}
			});
			check_passcode.open("POST", 'http://220.128.105.72/auth/' + passcodeText + '/' + deviceNameText);
			check_passcode.send();
		}
	}
	
	var update_token = function (token) {
		var appData = Ti.Filesystem.getApplicationDataDirectory(),
		tokenFile = Ti.Filesystem.getFile(appData + '/token.json'),
		data = JSON.parse(tokenFile.read().text);
		data.value = token;
		tokenFile.write( JSON.stringify(data) );
	}
		
	var status = Ti.UI.createLabel({
		color:'#FEFEFE',
		text:'與認證伺服器連線中...',
		height:'auto',
		width:'auto'
	});
	
	self.add(status);
	
	var refresh = Ti.UI.createButton({
		title: '重新取得序號',
		width: '35%',
		height: 40,
		bottom: '30%',
		visible: false
	});
	
	self.add(refresh);
	
	var passcode_label = Ti.UI.createLabel({
		text: '請輸入6位數認證碼',
		height: '40%',
		top: 0
	});
	
	var passcode = Ti.UI.createTextField({
		width: '30%',
		height: 'auto',
		top: '30%',
		maxLength: 6,
		keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
	});
	
	var device_label = Ti.UI.createLabel({
		text: '請輸入裝置名稱',
		top: '50%'
	});
	
	var device_name = Ti.UI.createTextField({
		top: '62%',
		width: '40%',
		minWidth: '40%'
	});
	
	var passcode_submit = Ti.UI.createButton({
		title: '取得授權',
		height: 'auto',
		width: 'auto',
		bottom: 0
	});
	
	var passcode_view = Ti.UI.createView({
		height: '65%',
		width: '100%',
		top: '20%',
		visible: false
	});
	
	
	passcode_view.add(passcode_label);
	passcode_view.add(passcode);
	passcode_view.add(device_label);
	passcode_view.add(device_name);
	passcode_view.add(passcode_submit);
	self.add(passcode_view);
	
	var get_passcode = Ti.Network.createHTTPClient({
		onload: function (e) {
			var res = JSON.parse(this.responseText);
			if (res.status === 'unavailable') {
				// 無可用序號
				alert('目前無可用序號，請聯絡系統管理員開通後重新連線。');
				status.setText('無可用序號');
				status.setColor('red');
				refresh.show();
			} else {
				// 要求認證碼
				status.hide();
				refresh.hide();
				passcode_view.show();
				device_name.addEventListener('return', submit_passcode);
			}
		},
		onerror: function (e) {
			alert('無法與伺服器連線，請確認伺服器狀態。');
			status.setText('伺服器離線中');
			status.setColor('red');
			refresh.show();
		},
		timeout: 5000
	})
	get_passcode.open("GET", 'http://220.128.105.72/auth/check');
	get_passcode.send();
	
	refresh.addEventListener('click', function () {
		get_passcode.send();
	});
	
	passcode_submit.addEventListener('click', submit_passcode);
	
	/*Ti.Media.showCamera({
		allowEditing: false,
		mediaTypes: Titanium.Media.MEDIA_TYPE_VIDEO,
		success: function (e) {
			alert('finish')
			alert(e.media);
		}
	});*/
	
	//Add behavior for UI
	/*label.addEventListener('click', function(e) {
		alert(e.source.text);
	});*/
	
	return self;
}

module.exports = Auth; //UI.createView
