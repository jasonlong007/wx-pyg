// pages/cart/index.js

// 引入封装的js
// import {getSetting , chooseAddress , openSetting} from '../../utils/asyncWx.js'
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
/**
 * 1 页面加载的时候
 *  1.从缓存中获取购物车数据渲染到页面中
 *   这些数据 checked=true  
 * 
 * 2 微信支付 
 *  1 哪些人 哪些账号 可以实现微信支付
 *     1企业账号
 *     2 企业账号的小程序后台中 必须给开发者添加上白名单
 *        1 一个appid可以同时绑定多个开发者账号
 *        2 这些开发者就可以用这个appid和她的开发权限
 * 3 支付按钮
 *  1 先判断缓存中有没有token
 *  2 没有的话就跳转到授权页面 进行获取token
 *  3 有token 就进行...
 *  4 创建订单 获取订单编号
 *  5 已经完成微信支付
 *  6 手动删除缓存中 已经被选中的商品
 *  7 删除后的购物车数据填充回缓存中
 *  8 再跳转页面
 */

  /**
   * 页面的初始数据
   */
  data: {
   address:{},
   cart:[],
   totalPrice:0,
   totalNum:0
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
    //  获取缓存中的收货地址
    const address=wx.getStorageSync('address')
    console.log(address,'address');
    // 获取缓存中的购物车数据
    let cart=wx.getStorageSync('cart')||[];
    // 过滤后的购物车数组
      cart=cart.filter(v=>v.checked);   
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    // 遍历添加总计价格和数量
    cart.forEach(v=>{
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num
    })

    this.setData({
        cart,
        address,
        totalPrice,
        totalNum
    });
  },

  // 点击支付
  async handleOrderPay(){
   try {
          // 1先判断缓存中有没有token
    const token=wx.getStorageSync('token');
    // 2 判断存不存在
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    // 3 创建订单
    //  3.1准备 请求头参数
    // const header={Authorization:token};
    // 3.2准备 请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    let goods=[];
    const cart=this.data.cart;
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }));
    console.log(goods);
    // 准备发送请求 创建订单 获取订单编号
    const orderParams={order_price,consignee_addr,goods}
    const res=await request({url:"/my/orders/create",method:"post",data:orderParams});
    const order_number=res.data.message.order_number
    console.log(order_number);
    // 发起预支付请求接口
    const payRes=await request({url:"/my/orders/req_unifiedorder",method:"post",data:{order_number}});
    console.log(payRes);
    const params=payRes.data.message.pay;
    console.log(params,'params');
    // 发起内置微信支付
    wx.requestPayment({
      params,
      timeStamp: 'timeStamp',
      success:(res)=>{
       console.log('成功',res);
       wx.showToast({
        title: '支付成功'
      })
      // 手动删除缓存中 已经支付的商品
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);
      // 跳转到订单列表
      wx.navigateTo({
        url: '/pages/order/index',
      })
      },
      fail:(err)=>{
        console.log('失败',err);
        wx.showToast({
          title: '支付失败'
        });
          // 手动删除缓存中 已经支付的商品
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);
        wx.navigateTo({
          url: '/pages/order/index?type=1',
        })
      }
    })
    // 查询后台订单状态
    const resOrder=await request({url:"/my/orders/chkOrder",method:"post",data:{order_number}});
     console.log("支付状态",resOrder);
   } catch (error) {
     console.log(error);
     wx.showToast({
      title: '支付失败'
    })
   }
   
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