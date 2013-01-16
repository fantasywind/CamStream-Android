//FirstView Component Constructor
function Stream() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	/*Ti.Media.showCamera({
		success: function (e) {
			alert('finish')
			//alert(e.media);
		},
		error: function (e) {
			alert('erte');
		}
	});*/

	return self;
}

module.exports = Stream; //UI.createView