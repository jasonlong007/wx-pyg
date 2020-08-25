/*

1 点击“+”触发tap点击事件
  1 电泳小程序的内置选择图片的aqpi
  2 获取到图片的路径 数组
  3 把图片路径 存到data的变量中
  4 页面就可以根据图片数组 进行循环显示 自定义组件

2 点击 自定义图片组件
  1 获取点击的元素的索引
  2 获取data中的图片数组
  3 根据索引数组中删除对应的元素
  4 吧数据重新设置回data中

3 点击“提交”
  1 获取文本域的内容
  2 对这些内容 合法性验证
  3 验证通过用户选择的图片 上传到图片的服务器返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
     自己再维护图片数组
  4 文本域和外网图片的路径以前提交到服务器
  5 清空当前页面
  6 返回上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
          id:0,
          value:"体验问题",
          isActive:true
      },
      {
         id:1,
         value:"商品、商家投诉",
         isActive:false
     }
    ],
    chooseImgs:[],
    textVal:""
  },
  //点击选择图片
  handleChooseImg(){
    // 调用小程序内置的选择图片
    let self = this
    wx.chooseImage({
      //同时选择图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success (res) {
        
        
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(res,'sss',tempFilePaths);
        self.setData({
          // 图片数组 进行拼接
          chooseImgs:[...self.data.chooseImgs,...res.tempFilePaths]
        });
      }
    })
  },
  // 文本域的输入事件
  handleTextInput(e){
     this.setData({
      textVal:e.detail.value
     });

  },
  handleFormSubmit(){ //提交事件
    // 获取文本域的内容
    const {textVal,chooseImgs}=this.data;
    // 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        mask:true
      })
      return;
    }
    chooseImgs.forEach((v,i)=>{
      // 验证通过 准备上传到专门的图片服务器
      wx.uploadFile({
        filePath: v,//被上传的文件的路径
        name: 'file',//上传的文件的名称 后台获取文件 file
        url: 'https://sbimg.cn/jaosnlong/',//图片上传到哪里
        success:(res)=>{
         console.log(res);
         
        }
      })
    });
    
  },
  handleRemoveImg(e){ //点击自定义图片
    // 获取被点击的组件的索引
    console.log(e);
    
    const {index}=e.currentTarget.dataset
    console.log(index);
    // 获取data中的图片数组
    let {chooseImgs}=this.data;
    // 删除元素
    chooseImgs.splice(index,1);
    // 重新填充到data
    this.setData({
      chooseImgs
    });
  },
   // 根据标题索引选中 标题数组
   changeTitleByIdex(index){
     // 修改原数组
     let {tabs}=this.data;
     tabs.forEach((v,i) => {
         i===index?v.isActive=true:v.isActive=false;
     });
     // 复制到data中
     this.setData({
         tabs
     });
   },
   //   标题点击事件
   handleTabItemChange(e){
     console.log(e,'父组件');
     // 获取被点击的索引
     const {index}=e.detail
     console.log(index,'父组件');
     this.changeTitleByIdex(index);
     // 2 重新发送请求
    //  this.getOrders(index+1);
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})