(function () {
	chrome.runtime.onMessage.addListener(function(){

		var result = arguments[0];
		if(result && result['name']==='createData' && result['data']){
			var data = result['data'],check=false;

			if(!document.querySelector('#H5erweima')){
				var contentCss= chrome.extension.getURL("css/content.css");
				var cssEl = document.createElement('link');
				cssEl.rel='stylesheet';
				cssEl.href=contentCss;
				cssEl.id="H5erweima"
				document.head.appendChild(cssEl);
			}

			var str = '';

			if(data[0]){
				if(!data[1]){
					str+='<div class="imgContainer larger"><p title="'+data[0][0]+'">'+data[0][0]+'</p><img src="'+data[0][1]+'"></div>';
				}else{
					str+='<div class="imgContainer smaller"><p title="'+data[0][0]+'">'+data[0][0]+'</p><img src="'+data[0][1]+'"></div>';
				}
			}

			if(data[1]){
				str+='<div class="imgContainer larger"><p title="'+data[1][0]+'">'+data[1][0]+'</p><img src="'+data[1][1]+'"></div>';
			}


			var dEl = document.createElement('div');
			dEl.className = 'H5erweima';
			dEl.innerHTML = str;

			document.body.appendChild(dEl);



			var imgEl = document.querySelectorAll('.imgContainer>img');
			for(var i=0;i<imgEl.length;i++){
				imgEl[i].onclick = function(){
					var className = this.parentNode.className;
					if(className==='imgContainer larger'){
						var smallerObj = document.querySelector('.smaller');
						if(smallerObj){
							smallerObj.className='imgContainer larger';
							this.parentNode.className = 'imgContainer smaller'
						}
					}else{
						var largerObj=document.querySelector('.larger');
						if(largerObj){
							largerObj.className='imgContainer smaller';
							this.parentNode.className = 'imgContainer larger'
						}
					}

					check = true;

					return false;
				};
			}

			dEl.onclick=function(){
				if(!check){
					this.remove();
				}else{
					check =false;
				}
			};

		}
	});
}());

