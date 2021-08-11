// file: sample.js
module.exports = {
    summary: 'a rule to hack response',
    *beforeSendResponse(requestDetail, responseDetail) {
        function filterVideoData(Data){
            // 判断是否需要处理
            delete Data.vip;
            delete Data.vprice;
            // 拿出来playUrl
            let playUrl = Data.list.data[0].plist;
            //  第二步拿出来视频url前缀
            let videoUrl_A = playUrl == undefined? null: playUrl[0].url.match(/(\S*)\//)[0]; ///bb/video/396/10000396/xxx.mp4
            let videoUrl_B = playUrl == undefined? null:  playUrl[1].url.match(/(\S*)\//)[0]; ///bb/video/396/10000396/xxx.mp4
            // 循环旧数据加工处理
            if(videoUrl_A){
                for(let i=0 ; i < Data.list.data.length; i++){
                    if(Data.list.data[i].vip){
                        delete Data.list.data[i].vip;
                        // 添加普通用户视频url
                        playUrl[0].url = videoUrl_A + Data.list.data[i].id + '.mp4';
                        playUrl[1].url = videoUrl_B + Data.list.data[i].id + '.mp4';
                        Data.list.data[i].plist = [
                            {vc: 1, vq: 1, url: playUrl[0].url},
                            {vc: 2, vq: 1, url: playUrl[1].url},
                            {vc: 2, vq: 4, showvip: 1}
                        ];
                    }else{
                        console.log("普通用户可看无需处理");
                    }
                
                }
            }
            return Data;
        }
       console.log("!!!!!!!!!!!!!!请求开始！！！！！！！！！")
        function getQueryString(name) {
            let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            let r = requestDetail.url.match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
        let hook_url  = "http://api.ergeduoduo.com/baby/v1/bb.php?type=list&";
        if(requestDetail.url.lastIndexOf(hook_url) == 0){
            console.log("============当前处理访问网址================")
            console.log(requestDetail.url);
            const newResponse = responseDetail.response;
            let resp = '';
            if (JSON.parse(newResponse.body.toString())){
                let Data = JSON.parse(newResponse.body.toString());
                resp = filterVideoData(Data);
                newResponse.body = JSON.stringify(resp);
                return new Promise((resolve, reject) => {
                    setTimeout(() => { // delay
                    resolve({ response: newResponse });
                    }, 1);
                });
            }else{
                console.log("============当前处理页面非标准格式建议加入黑名单================")
                console.log(requestDetail.url);
                return new Promise((resolve, reject) => {
                    setTimeout(() => { // delay
                    resolve({ response: newResponse });
                    }, 1);
                });
            }
        }else{
            console.log("============无需处理访问网址================")
            console.log(requestDetail.url);
        }
        console.log("!!!!!!!!!!!!!!请求结束！！！！！！！！！！")
    },
  };

  

//   anyproxy --intercept --rule sample.js
//  --ws-intercept 开启代理 websocket