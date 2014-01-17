function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}



function mix(target, source) {
	var tempSource = source,k;
	for (k in tempSource) {
		if (target.hasOwnProperty(k) && tempSource.hasOwnProperty(k) && tempSource[k]) {
			target[k] = tempSource[k];
		}
	}
	tempSource = null;
}

function createCanvas(config) {
	var tempConfig = {
		text: '',
		width:  260,
		height: 260
	};


	mix(tempConfig, config);

	//判断是否有汉字
	if(/[\u4E00-\u9FA5]/.test(tempConfig.text)){
		tempConfig.text=utf16to8(tempConfig.text);
	}

	var tempDiv = document.createElement('div');
	$(tempDiv).qrcode(tempConfig);
}


function showContextMenus(){

	chrome.contextMenus.removeAll();

	if(window.localStorage.getItem('showRightMenu')!=='false'){
		chrome.contextMenus.create({
			title: '生成二维码',
			onclick: function(info, tab) {

				if(!info.linkUrl && !info.selectionText && !info.srcUrl){
					return false;
				}

				var tempData1,tempData2;

				if(info.selectionText){
					createCanvas({text:info.selectionText,width:260,height:260});
					tempData1 = [info.selectionText,canvasUrlData];
				}else if(info.srcUrl){
					createCanvas({text:info.srcUrl,width:260,height:260});
					tempData1 = [info.srcUrl,canvasUrlData];
				}

				if(info.linkUrl){
					createCanvas({text:info.linkUrl,width:260,height:260});
					tempData2 = [info.linkUrl,canvasUrlData];
				}

				chrome.tabs.query({active:true},function(){
					var TabId = arguments[0][0].id;
					chrome.tabs.sendMessage(TabId,{name:'createData',data:[tempData1,tempData2]});

					tempData1=null;
					tempData2=null;
				});


			},
			contexts:["selection", "link", "editable", "image", "video", "audio"]
		});
	}
}


showContextMenus();

chrome.runtime.onMessage.addListener(function(){
	if(arguments[0]['menu']!=='showRightMenu'){
		return;
	}

	showContextMenus();
});
