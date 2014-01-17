/**
 * Created with IntelliJ IDEA.
 * User: fudongguang
 * Date: 13-8-30
 * Time: PM2:04
 * To change this template use File | Settings | File Templates.
 */


define(['./common'],function(com){
	return {
		/**
		 * 口袋用户中奖数据
		 * @param koudaiToken
		 * @param back
		 */
		randomGetAward:function(back){
			com.ajax({
				url: com.configs.apiHost + 'signIn2/randomGetAward.do',
				data: {koudaiToken: initData.koudaiToken},
				success: function (result) {
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			})
		},

		/**
		 * 访客中奖数据 (暂时不用)
		 * @param koudaiToken
		 * @param back
		 */
		guestRandomGetAward:function(back){
			com.ajax({
				url: com.configs.apiHost + 'signIn2/guestRandomGetAward.do',
				data: {koudaiToken: initData.koudaiToken},
				success: function (result) {
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			})
		},

		/**
		 * 获取所有奖品数据
		 * @param back
		 */
		loadAwardData:function(back){
			com.ajax({
				hideLoading:true,
				url: com.configs.apiHost + 'signIn2/loadAwardData.do',
				data:{dateTime:new Date().getTime()},
				success: function (result) {
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			})
		},

		/**
		 * 签到提交
		 */
		qiandaoSubmit:function(back){
			com.ajax({
				url: com.configs.apiHost + 'signIn2/sign.do',
				data: {koudaiToken: initData.koudaiToken},
				success: function(result){
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			});
		},

		/**
		 * 注册
		 * @param phone
		 * @param back
		 */
		register:function(phone,back){
			com.ajax({
				url: com.configs.apiHost+'signIn/register.do',
				data: {koudaiToken: initData.koudaiToken,phone:phone},
				success: function(result){
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			});
		},

		/**
		 * 显示最经一次的激励奖励信息
		 */
		loadSignContinuumRemind:function(back){
			com.ajax({
				hideLoading:true,
				url: com.configs.apiHost+'signIn/loadSignContinuumRemind.do',
				data: {koudaiToken: initData.koudaiToken},
				success: function(result){
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			});
		},

		/**
		 * 提交用户中奖后填写的信息
		 * @returns {boolean}
		 */
		submitGetAwardUserInfo:function(data,back){
			com.ajax({
				url: com.configs.apiHost+'signIn2/submitGetAwardUserInfo.do',
				data: data,
				success: function(result){
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			});
		},

		/**
		 * 分享朋友圈时加积分
		 * @param back
		 */
		shareWXPyqAddJFB:function(back){
			com.ajax({
				hideLoading:true,
				url: com.configs.apiHost+'signIn/shareWX_Pyq_addJFB.do',
				data: {koudaiToken: initData.koudaiToken},
				success: function(result){
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			});
		},

		/**
		 * 核对积分找回
		 */
		checkSendCode:function(code,phone,back){
			com.ajax({
				checkStatus:true,
				url:com.configs.apiHost+'sign/completeJfRetrieve.do',
				data: {koudaiToken: initData.koudaiToken,phone:phone,code:code,random:Math.random()},
				success:function(result){
					if(back && com.isFunction(back)){
						back(result);
					}
				}
			})
		},

		/**
		 * 请求发送验证码给手机
		 */
		sendSMSCode:function(phone,back){
			com.ajax({
				checkStatus:true,
				type: "POST",
				url: com.configs.apiHost+'sign/jfRetrieve.do?random=' + Math.random(),
				data: {koudaiToken: initData.koudaiToken, phone: phone},
				success:function(result){
					if(back && com.isFunction(back)){
						back(result.result);
					}
				}
			});
		}

	}
});



