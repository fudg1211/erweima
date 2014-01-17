/**
 * Created with IntelliJ IDEA.
 * User: fudongguang
 * Date: 2013/08/16
 * Time: 07:35 PM
 * To change this template use File | Settings | File Templates.
 */
define(['./global/common', './global/data'], function (com, data) {
	var IndexController = FishMvc.View.extend({
		init: function () {
			this.setRightMenu();
			this.createCurrentTabCanvas();
			this.changeButton();
			this.showTips();
		},
		elements: {
			'#canvasDiv': 'canvasDiv',
			'#doCreate': 'doCreate',
			'#download': 'download',
			'#small': 'small_rel',
			'#inputUrl': 'inputUrl',
			'#changeSize': 'changeSize',
			'canvas': 'canvas_rel',
			'#noNotice':'noNotice',
			'#notice':'notice',
			'#rightMenu':'rightMenu',
			'#stay':'stay'
		},

		events: {
			'click doCreate': 'doCreateInputUrl',
			'click changeSize': 'doChangeSize',
			'keydown inputUrl':'followInput',
			'click download':'doDownload',
			'click noNotice':'doNoNotice',
			'click rightMenu':'doRightMenu',
			'click stay':'doStay'
		},

		setRightMenu:function(){
			var showRightMenu = com.storage.local.get('showRightMenu');
			if(showRightMenu==='false'){
				this['rightMenu'].text('显示右键');
			}else{
				this['rightMenu'].text('取消右键');
			}
		},

		 /* 生成地址
		 * @param config
		 * @returns {boolean}
		 */
		createCanvas: function (config) {
			var tempConfig = {
				text: '',
				width: com.storage.session.get('canvasWidth') || 250,
				height: com.storage.session.get('canvasHeight') || 250
			};


			com.mix(tempConfig, config);

			//判断是否有汉字
			if(/[\u4E00-\u9FA5]/.test(tempConfig.text)){
				tempConfig.text=com.utf16to8(tempConfig.text);
			}

			com.storage.session.set('canvasText',tempConfig.text);
			com.storage.session.set('canvasWidth',tempConfig.width);
			com.storage.session.set('canvasHeight',tempConfig.width);

			this['canvasDiv'].html('').qrcode(tempConfig);


			this['remainCanvasText'] = tempConfig.text;
			this['remainCanvasData'] = initData.canvasUrlData;
		},

		/**
		 * 生成当前标签二维码
		 */
		createCurrentTabCanvas:function(){
			chrome.tabs.query({active:true},function(){
				var info = arguments[0][0];
				var url = info['url'], title = info['title'];


				if(!info['selected']){
					return false;
				}

				module.set('canvas', {text: url});
			});
		},

		/**
		 * 手工生成地址
		 */
		doCreateInputUrl: function () {
			var url = this['inputUrl'].val();
			if (!url) {
				this['inputUrl'].val('').attr('placeholder', '请输入地址或内容').focus();
				return false;
			}

			module.set('canvas', {text: url});
			return false;
		},

		/**
		 * 缩放
		 */
		doChangeSize:function(obj){
			var offsetWidth = parseInt(com.storage.session.get('canvasWidth')),
				width,height,config;
			if(offsetWidth===250){
				height=width=400;
			}else{
				height=width=250;
			}

			config={
				width:width,
				height:height,
				text:com.storage.session.get('canvasText')
			};

			module.set('canvas', config);
			this.changeButton();
		},

		/**
		 * 监听input随时响应输入内容
		 */
		followInput:function(obj){
			clearTimeout(this.followInputTimeout);

			this.followInputTimeout = setTimeout(function(){
				obj = $(obj);
				var text = $(obj).val();

				module.set('canvas', {text:text});
			},400);
		},

		/**
		 * 改变changsize buttong文本
		 */
		changeButton:function(){
			var width = parseInt(com.storage.session.get('canvasWidth')),text;

			if(width===400){
				text='缩 小'
			}else{
				text='放 大'
			}

			this['changeSize'].text(text);
		},

		/**
		 * 下载二维码图片
		 */
		doDownload:function(){
			var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = initData.canvasUrlData;
			save_link.download = 'No'+new Date().getTime()+'.jpg';

			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
		},

		/**
		 * 显示通知
		 */
		showTips:function(){
//			if(com.storage.local.get('noTips')!=='true'){
//				this['notice'].show();
//			}
		},

		/**
		 * 禁止显示插件
		 */
		doNoNotice:function(){
			com.storage.local.set('noTips','true');
			this['notice'].hide();
		},

		doRightMenu:function(obj){
			obj = $(obj);
			var text = obj.text();
			if(text==='显示右键'){
				com.storage.local.set('showRightMenu','true');
			}else{
				com.storage.local.set('showRightMenu','false');
			}

			this.setRightMenu();

			var config={
				menu:'showRightMenu'
			};

			chrome.runtime.sendMessage(config,function(){})
		},

		/**
		 * 固定显示回去
		 */
		doStay:function(){
			var tempData1 = [this['remainCanvasText'],this['remainCanvasData']];
			chrome.tabs.query({active:true},function(){
				var TabId = arguments[0][0].id;
				chrome.tabs.sendMessage(TabId,{name:'createData',data:[tempData1]});
				tempData1=null;
			});
		}
	});

	var indexController = new IndexController({el: $('#wrapper')});
	com.gather['indexController'] = indexController;

	var Module = FishMvc.Module.extend();
	var module = new Module();
	com.gather['module'] = module;

	module.on('change:canvas', function (result,config) {
		if (!config.text) {
			return false;
		}

		indexController.createCanvas(config);
	});

});

