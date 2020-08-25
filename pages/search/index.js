

/**
 * 1 输入框绑定 值改变事件 input事件
 *   1 获取到输入框的值
 *   2 合法性判断
 *   3 检验通过 吧输入的值 发送到后台
 *   4 返回的数据打印到页面上
 *   
 * 2 防抖 定时器
 *  1 定义qan
 *  
 */
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
  goods:[],
  isFocus:false,
  inpValue:''
  },
  TimeId:-1,
  // 输入框值改变触发
  handleInput(e){
   //获取输入框的值
   console.log(e);
   const {value}=e.detail;
  //  检测合法性
  if (!value.trim()) {
    // 值不合法
    this.setData({
      isFocus:false,
      goods:[]
    });
    return;
  }
  // 准备发送请求获取数据
  this.setData({
    isFocus:true
  });
  clearTimeout(this.TimeId);
  this.TimeId=setTimeout(()=>{

    this.qsearch(value);
  },1000);
  
  },
  // 发送请求获取搜索建议 数据
 async qsearch(query){
    const res=await request({url:'/goods/qsearch',data:{query}});
    console.log(res);
    this.setData({
      goods:res.data.message
    });
  },
  handleCancel(){ //点击取消按钮
    this.setData({
      isFocus:false,
      inpValue:'',
      goods:[]
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