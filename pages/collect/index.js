// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[], 
    tabs:[
      {
          id:0,
          value:"商品收藏",
          isActive:true
      },
      {
         id:1,
         value:"品牌收藏",
         isActive:false
     },
     {
         id:2,
         value:"店铺收藏",
         isActive:false
     },
     {
         id:3,
         value:"浏览器足迹",
         isActive:false
     }
    ],
  },
//   标题点击事件
handleTabItemChange(e){
  console.log(e,'父组件');
  // 获取被点击的索引
  const {index}=e.detail
  console.log(index,'父组件');
  this.changeTitleByIdex(index);

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
    const collect=wx.getStorageSync('collect')||[];
    console.log(collect);
    this.setData({collect});

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