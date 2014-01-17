/**
 * Created with IntelliJ IDEA.
 * User: fudongguang
 * Date: 13-4-17
 * Time: AM10:26
 * To change this template use File | Settings | File Templates.
 */


$('#c-form-n1').submit(function () {
	return false;
});

$('#send').click(function () {

	var obj = $('#url'),
		val = obj.val();

	if (!val) {
		obj.val('请输入地址');
		obj.focus();
	} else {
		createQrCode(val);
	}
});

var windowid=1;

function runAtLoad(){

	chrome.windows.getCurrent({populate: true}, function (a) {
		windowid= a.id;

		if(a.tabs.length){
			tabs = a.tabs;
			for(var i=0;i<tabs.length;i++){
				if(tabs[i].selected){
					createQrCode(tabs[i].url);
					break;
				}
			}
		}
	});
}

runAtLoad();



var globalText = '';

function createQrCode(text,size){
	globalText = text || globalText;
	size=size || 250;
	var obj = $('#c-result');
	obj.html('');
	obj.qrcode({
		width:size,
		height:size,
		text	: utf16to8(globalText)
	});

	if(size===400){
		$('#wrapper').addClass('big');
	}else{
		$('#wrapper').removeClass('big');
	}
}





$(document).keydown(function(e){
	if(e.keyCode==13 && $('#url').is(':focus')){
		$('#send').click();
	}
});


function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
		}
	}
	return out;
}


$('#biger').click(function(){
	var obj = $('#c-result>canvas');
	if(parseInt(obj.css('width'))==400){
		createQrCode(false,250);
		$(this).text('放 大');
	}else{
		createQrCode(false,400);
		$(this).text('缩 小');
	}

	return false;
});

$('#download').click(function(){

	saveFile(canvasUrlData,new Date().getTime()+'.jpg');
	return false;
});


var canvasUrlData;
var saveFile = function(data, filename){
	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	save_link.href = data;
	save_link.download = filename;

	var event = document.createEvent('MouseEvents');
	event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	save_link.dispatchEvent(event);
};


chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	sendResponse({a:'aaa'});
});

chrome.contextMenus.create({
	title:'sdf',
	onclick:function(info,tab){
		console.log(info);
	}
})


