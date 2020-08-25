import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
// import {login} from "@/utils/asyncWx"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户信息
  async handleGetUserInfo(e){
    console.log(e);
    // 获取用户信息
  try {
    const{ encryptedData,iv,rawData,signature}=e.detail;
    //  获取小程序登录成功后的code
    let self=this;
    wx.login({
      timeout: 1000,
      success: (result) => {
          const {code}=result;
          console.log(code);
          self.getWxLogin(encryptedData,iv,rawData,signature,code);
      }
      
    })
  } catch (error) {
    console.log(error);
    
  }
 

  },
  async getWxLogin(encryptedData,iv,rawData,signature,code){
    const loginParams={encryptedData,iv,rawData,signature,code}
    //  发送请求获取用户的token
    const {res}=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    console.log(res);
    const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";

    // 把token存入缓存中，同时跳转回上一个页面。
    wx.setStorageSync('token', token);
    wx.navigateBack({
      delta: 1
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