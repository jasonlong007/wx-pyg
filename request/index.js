// 定义一个变量表示同事发送异步请求的次数
let ajaxTimes=0;

export const request=(params)=>{
    // 判断url是否带有 /my/请求的是私有的路径 带上header token
    let header={...params.header};
    if (params.url.includes('/my/')) {
      // 拼接header 带上token
      header['Authorization']=wx.getStorageSync('token');
    }
    
    ajaxTimes++;
    // 定义公共baseUrl
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    // 显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask:true
      })
      


  return new Promise((resolve,reject)=>{
    wx.request({
       ...params,
       header,
       url:baseUrl+params.url,
       success: function(res) {
        resolve(res)
       },
       fail: function(err) {
        reject(err)
       },
       complete: function() {
        ajaxTimes--;
        if (ajaxTimes===0) {
            wx.hideLoading()
        }
        
       }
    })
  });
}