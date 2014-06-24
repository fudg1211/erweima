requirejs.config({
	//By default load any module IDs from js/lib
	baseUrl:'js',
	deps:['./lib/Fish', './lib/json2','./lib/jquery.qrcode','./lib/qrcode']
//	,urlArgs: 'v=' + (new Date()).getTime()
});

// Start the main app logic.
requirejs(
	['./lib/Fish', './lib/json2','./lib/jquery.qrcode','./lib/qrcode', './app/index'],
	function () {
		//jQuery, canvas and the app/sub module are all
		//loaded and can be used here now.
	}
);
