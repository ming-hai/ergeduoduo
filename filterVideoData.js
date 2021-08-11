export function filterVideoData(Data){
    delete Data.vip;
    delete Data.vprice;
    // 拿出来playUrl
    let playUrl = Data.list.data[0].plist;
    //  第二步拿出来视频url前缀
    let videoUrl_A = playUrl[0].url.match(/(\S*)\//)[0]; ///bb/video/396/10000396/xxx.mp4
    let videoUrl_B = playUrl[1].url.match(/(\S*)\//)[0]; ///bb/video/396/10000396/xxx.mp4
    // 循环旧数据加工处理
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
    return Data;
}