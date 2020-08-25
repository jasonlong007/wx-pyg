/**
 * 0 onShow不同
 *   判断缓存中有没有token
 * 1 页面被打开的时候 onShow
 *   1 获取url上的参数type
 *   2 根据type去发送请求获取订单数据
 *   3 渲染页面
 * 2 点击不同的标题 重新发送请求来获取和渲染数据
 * 
 * 
 */
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
          id:0,
          value:"全部",
          isActive:true
      },
      {
         id:1,
         value:"待付款",
         isActive:false
     },
     {
         id:2,
         value:"待发货",
         isActive:false
     },
     {
         id:3,
         value:"退款/退货",
         isActive:false
     }
    ],
  },
  // 获取订单列表的方法
 async getOrders(type){
 const res=await request({url:"/my/orders/all",data:{type}});
 console.log(res.data);
 this.setData({
  orders:res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
 });
 console.log(this.data.orders);
 
 
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
  this.getOrders(index+1);
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // 判缓存有token，如果没有跳转到授权
    const token=wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }


    // 1 获取当前小程序的页面栈-数组 长度最大是10页面
    console.log(options);
     let pages=getCurrentPages();
     console.log(pages);
    //  2 数组中索引最大的页面就是当前页面
    let currentPage=pages[pages.length-1];
    console.log(currentPage.options);
    // 3 获取url上的type参数
    const {type}=currentPage.options
    // 激活选中页面标题
    this.changeTitleByIdex(type-1);
    this.getOrders(type);
     
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