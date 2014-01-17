/**
 * Created with IntelliJ IDEA.
 * User: fudongguang
 * Date: 13-1-17
 * Time: 下午3:46
 * 通用函数.
 */
define(['./configs', './storage',  './hack'], function (configs, storage, hack) {
	var toString = {}.toString,
		$ = window.$,
		UA = window.navigator.userAgent;


	window.com = common = {

		isFunction: function (it) {
			return toString.call(it) == "[object Function]";
		},

		isString: function (it) {
			return toString.call(it) == "[object String]";
		},

		isArray: function (it) {
			return toString.call(it) == "[object Array]";
		},

		isObject: function (it) {
			return toString.call(it) == "[object Object]";
		},

		isIOS: function () {
			if (/ipad/i.test(UA) || /iphone/i.test(UA)) {
				return true;
			} else {
				return false;
			}
		},

		storage: storage,
		configs: configs,


		render: function (source, data, dest) {
			dest = dest ? dest : source + "Dest";
			new EJS({element: source}).update(dest, {md: data});
		},

		getRender: function (source, data) {
			return new EJS({element: source}).render({md: data});
		},

		showLoading: function () {
			var config = {
				url: 'loading',
				className: 'loadingDialog'
			};

			dialog(config);
		},

		removeLoading: function () {
			$('.loadingDialog').remove();
		},

		ajax: function (configs) {
			var self = this;

			if (!configs.hideLoading) {
				this.showLoading();
			}

			var checkStatus = function (result) {
				if(configs.checkStatus){
					return true;
				}

				var status_code = 0 , status_desc;
				if (result.status && result.status.code) {
					status_code = result.status.code;
					status_desc = result.status.description;
				}

				if (status_code) {
					if (status_desc) {
						alert('网络超时');
						initData.onDataError = true;
					}
					return false;
				} else {
					initData.onDataError = false;
					return true;
				}
			};

			var a = {
				type: 'POST',
				dataType: 'json',
				url: self.configs.host,
				data: '',
				success: function (result) {
				},
				error: function () {
					initData.onDataError=true;
				},
				complete: function (result) {
					self.removeLoading();
				}
			};


			this.mix(a, configs);
			a.success = function (result) {
				if (checkStatus(result)) {
					configs.success(result);
				}
			};

			$.ajax(a);
		},


		/**
		 * 合并对象
		 * @param target
		 * @param source
		 */
		mix: function (target, source) {
			var tempSource = this.clon(source),k;
			for (k in tempSource) {
				if (target.hasOwnProperty(k) && tempSource.hasOwnProperty(k) && tempSource[k]) {
					target[k] = tempSource[k];
				}
			}
			tempSource = null;
		},

		utf16to8: function (str) {
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
		},

		/**
		 * 克隆对象和数组
		 * @param obj
		 * @returns {{}}
		 */
		clon: function (obj) {
			var newObj = {}, self = this;

			var cloneObject = (function (a, b) {
				if (self.isObject(a)) {
					for (k in a) {
						if (a.hasOwnProperty(k)) {
							if (self.isObject(a[k])) {
								b[k] = {};
								arguments.callee(a[k], b[k]);
							} else if (self.isArray(a[k])) {
								b[k] = [];
								arguments.callee(a[k], b[k]);
							} else {
								b[k] = a[k];
							}
						}
					}
				} else if (self.isArray(a)) {
					for (k in a) {
						if (self.isObject(a[k])) {
							b[k] = {};
							arguments.callee(a[k], b[k]);
						} else if (self.isArray(a[k])) {
							b[k] = [];
							arguments.callee(a[k], b[k]);
						} else {
							b[k] = a[k];
						}
					}
				}
			}(obj, newObj));

			return newObj;
		},

		showTip: function (obj, lang, className, delay) {
			var showingTip = obj.attr('showingTip');
			if (showingTip === 'true') {
				return;
			} else {
				obj.attr('showingTip', 'true');
			}


			var left = obj.offset().left - com.gather['indexController']['el'].offset().left,
				top = obj.offset().top,
				width = parseInt(obj.css('width')),
				height = parseInt(obj.css('height')),
				html = this.configs.qiandao.f(lang),
				htmlObj = $(html);

			if (className) {
				htmlObj.addClass(className);
			}

			com.gather['indexController']['el'].append(htmlObj);
			var tipJiantou_rel = htmlObj.find('.tipJiantou'),
				dWidth = parseInt(width) + parseInt(obj.css('margin-left')),
				jWidth = parseInt(tipJiantou_rel.css('width'));

			(function () {
				var offset = htmlObj.offset(), w = offset.width, h = offset.height;
				if (!w || !h) {
					setTimeout(arguments.callee, 100);
				} else {
					top = top - h - 10;
					if ((left + w) > 640) {
						htmlObj.addClass('tipRight');
						tipJiantou_rel.css({'right': 640 - left - (jWidth + dWidth) / 2, left: 'auto'});
					} else {
						left = left - dWidth / 2;
						left = left < 0 ? 0 : left;
						htmlObj.css('left', left);
						tipJiantou_rel.css({left: (jWidth + dWidth) / 2});
					}

					var tempTop = parseInt(obj.attr('top'));
					if(tempTop && !isNaN(tempTop)){
						top = top+tempTop;
					}

					htmlObj.css({top: top, 'opacity': 1});


					if (delay !== 0) {
						delay = delay || 5000;
						setTimeout(function () {
							htmlObj.css('opacity', 0);
							obj.removeAttr('showingTip');
							setTimeout(function () {
								htmlObj.remove();
							}, 500);
						}, delay);
					}
				}
			}())
		},

		/**
		 * 弹出警告
		 * @param config
		 */
		alert: function (text,config) {
			config = config || {};

				if (config.className) {
					config.className += ' alert'
				} else {
					config.className = 'alert';
				}

				if(!config.tpl){
					config.url='alert';
				}

			config.content=text;


			dialog(config);
		},

		gather: {},

		queryArray: [],
		query: function (name) {
			if (!name) {
				return false;
			}

			if (this.queryArray.length) {
				return this.queryArray[name];
			} else {
				var href = window.location.href;
				href = href.replace(/#[^&]*$/, '');//去除锚点

				var reg = /\?(.+)/,
					m = href.match(reg);

				if (m && m[1]) {
					var s = m[1].split('&');
					for (a in s) {
						var b = s[a].split('='),
							k = b[0],
							v = b[1];

						this.queryArray[k] = v;
					}

					return this.queryArray[name];

				} else {
					return '';
				}
			}
		}

	};

	init(common);

	return common;
});

function init(com) {
	window.initData={};
}



