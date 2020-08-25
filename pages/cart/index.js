// pages/cart/index.js

// 引入封装的js
// import {getSetting , chooseAddress , openSetting} from '../../utils/asyncWx.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  /**
     * 1.获取用户的收货地址
     *   1.调用小程序内置API，获取用户收货地址 wx.chooseAddress
     *   2.获取用户对小程序所授予获取地址的权限状态 scope authSetting
     *      1.
     * 
     *   ==2.页面加载完毕
     *    0.onload onShow
     *    1.把本地存储中地址数据。
     *    2.把数据设置给data中一个变量
     * 
     *  ===3.onShow
     * 0.回到商品详情页面第一次添加商品的时候，手动添加了属性
     *  
     * 4--总价格和总数量
     *   1.都需要商品被选中，我们才来计算
     *   2.获取购物车数组
     *   3.遍历，判断商品是否被选中
     * 
     * 5 商品的选中
     *  1.绑定change事件
     *  2.获取被修改的商品对象
     *  3.商品对象的选中状态取反
     *  4.重新填充回data中和缓存中
     *  5.重新计算全选，总价格和总数量
     * 
     * 6 全选和反选
     *  1.全选复选框绑定事件change
     *  2.获取data中的全选变量allChecked
     *  3.直接取反 allChecked!=allChecked
     *  4.遍历购物车数组让里面商品选中状态跟随allChecked改变而改变
     *  5.把购物车数据和allChecked重新设置回data 把购物车重新设置回缓存中
     * 
        7 商品数量的编辑
         1. “+”，“-”按钮绑定同一个点击事件 区分关键 自定义属性
         2.传递被点击的商品ID goods_id
         3.获取data中的购物车数据来获取需要被修改的商品对象
         4.直接修改商品对象的数量num
          1.当购物车的数据等于1 同时用户点击- 弹窗提示用户是否要删除
         5.把cart数据重新设置回 缓存中和data中
     *  8 点击结算
          1 判断有没有收获地址信息
          2 判断用户有没有选购商品
          3 经过以上的验证 跳转到 支付页面
     */

  /**
   * 页面的初始数据
   */
  data: {
   address:{},
   cart:[],
   allChecked:false,
   totalPrice:0,
   totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
 async handleChooseAddress(){ //点击收货地址
  try {
      // 1.获取权限状态
    wx.getSetting({
      success: (res) => {
        //  2获取权限状态 主要发现一些属性名比较怪异的时候，都要使用[]形式来获取属性值
        const scopeAddress=res.authSetting['scope.address'];
        console.log(scopeAddress);
        if (scopeAddress===false) {
          // 3.用户以前拒绝过授予权限，先诱导打开授权页面
          wx.openSetting({
            success: (res2) => {
              console.log(res2);
            },
          })
         
        }  // 调用地址
        wx.chooseAddress({
          success: (res1) => {
              console.log(res1);
              let address=res1;
              address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo
              // 存入缓存中
              wx.setStorageSync('address', res1)
          },
        })
        
      },
    })
  } catch (error) {
     console.log(error);
     
  }
   

    // // 1.获取权限状态
    //    const res1 = await getSetting();
    //   //  2获取权限状态 主要发现一些属性名比较怪异的时候，都要使用[]形式来获取属性值
    //   const scopeAddress=res.authSetting['scope.address'];
    //   // 判断权限状态
    //   if (scopeAddress===true||scopeAddress===undefined) {
    //     const res2=await chooseAddress();
    //     console.log(res2);
    //   }else{
    //     // 3.用户以前拒绝过授予权限，先诱导打开授权页面
    //    await openSetting();
    //     //  4.可以调用收货地址代码
    //    const res2=await chooseAddress();
    //    console.log(res2)

    //   }
  },
  handeItemChange(e){ //商品选中
    // 1.获取被修改商品的ID
    const goods_id=e.currentTarget.dataset.id
    console.log(goods_id);
    // 2.获取购物车数组
    let {cart}=this.data;
    // 3.找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 4.选中状态取反
    cart[index].checked=!cart[index].checked;
    
    // 传值封装
    this.setCart(cart);
  
  },
  // 商品全选
  handleItemAllChecked(){
    // 1 获取data中的数据
    let {cart,allChecked}=this.data;
    // 2 修改值
    allChecked=!allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 吧修改后的值填充到data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  handeItemNumEdit(e){
    console.log(e);
   
    
    // 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    console.log(operation,id);
    // 2 获取购物车数组
    let {cart}=this.data
    // 3 找到需要修改的商品索引
    const index=cart.findIndex(v=>v.goods_id===id);
    // 判断是否要执行删除
    if (cart[index].num===1&&operation===-1) {
      //  弹窗提示
      let self=this;
      wx.showModal({
        title: '提示',
        content: '是否要删除？',
        success (res) {
          if (res.confirm) {
           cart.splice(index,1);
           self.setCart(cart);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }else{
       // 4 进行数量修改
      cart[index].num+=operation;
      // 5 设置缓存和data中
      this.setCart(cart);
    }
   
  },
  handlePay(){ //点击结算
    // 判断收获地址
    const {address}=this.data;
    if (!address.userName) {
      wx.showToast({
        title: '你还没有选择收货地址',
      })
      return;
    }
    //判断用户没有选购商品
    if (this.data.totalNum==0) {
      wx.showToast({
        title: '你没有购买商品',
      })
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
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
    //  获取缓存中的收货地址
    const address=wx.getStorageSync('address')
    console.log(address,'address');
    

    // 获取缓存中的购物车数据
    const cart=wx.getStorageSync('cart')||[]
       // 传值封装
    this.setCart(cart);
    this.setData({
      address
    });
  },

  // 设置购物车状态同时重新计算底部工具栏的数据 全选 总价格 购买数量
  setCart(cart){
      

    let allChecked=true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    // 遍历添加总计价格和数量
    cart.forEach(v=>{
        if (v.checked) {
            totalPrice+=v.num*v.goods_price;
            totalNum+=v.num
        }else{
            allChecked=false;
        }
    })
    // 判断数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    console.log(cart,'cart','allChecked',allChecked);
    this.setData({
        cart,
        allChecked,
        totalPrice,
        totalNum
    });
    wx.setStorageSync('cart', cart);
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