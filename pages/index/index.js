// 引入用来发送请求的方法
import {request} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    swiperList:[],// 轮播图数据
    catesList:[],//导航数据
    floorList:[] //楼层数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    // 开始异步请求轮播图数据
    // 优化请求：通过es6promise解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata', 
    //   success:(res)=> {
    //     console.log(res.data)
    //     that.setData({
    //       swiperList: res.data.message
    //     })
        
    //   }
    // })
    this.getSwiperList()
    this.getCatesList()
    this.getFloorList()
  },
//   获取轮播图数据
  getSwiperList(){
    var that = this;
    request({url: '/home/swiperdata'}).then(res=>{
        console.log(res.data)
        that.setData({
        swiperList: res.data.message
        })
     })
  },
//   获取轮播图数据
 getCatesList(){
    var that = this;
    request({url: '/home/catitems'}).then(res=>{
        console.log(res.data)
        that.setData({
            catesList: res.data.message
        })
     })
  },
  //   获取楼层数据
  getFloorList(){
    var that = this;
    request({url: '/home/floordata'}).then(res=>{
        console.log(res.data)
        that.setData({
            floorList: res.data.message
        })
     })
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