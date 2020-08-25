import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
/**
 * 购物车逻辑
 *  1.先绑定点击事件
 *  2.获取缓存中的购物车数据，数组格式
 *  3.先判断当前商品是否存在于购物车中
 *  4.已经存在的商品，修改商品数据， 执行购物车数量++ 重新吧购物车数组填充缓存中，
 *  5.不存在于购物车的数组中，直接给购物车数据添加一个新的元素，新元素带上购物数量属性num ，重新吧购物车数据填充会缓存中
 *  6.弹出提示
 *  
 * 商品收藏
 * 1 页面onShow的时候 加载缓存中的商品收藏的数据
 * 2 判断当前商品是不是被收藏
 *  1 如果是 改变页面的图标
 * 3 点击商品收藏按钮 
 *   1 判断改商品是否存在缓存数组中
 *   2 已经存在 把商品删除
 *   3 没有存在 把商品添加到收藏数组中 存入缓存中即可
 * 
 */ 



  /**
   * 页面的初始数据
   */
  data: {
   goodsObj:{
   },
   isCollect:false //商品是否被收藏
  },

   
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);

  },
// 商品对象
GoodsInfo:{},

// 获取商品详情数据
async getGoodsDetail(goods_id){
      const res=await request({url:'/goods/detail',data:{goods_id}});
      this.GoodsInfo=res.data.message
      console.log(res.data);
  
    // 获取缓存中的商品收藏的数组
    let collect=wx.getStorageSync('collect')||[];
    // 判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);


      this.setData({
        // goodsObj:res.data.message
        goodsObj:{
            goods_name:res.data.message.goods_name,
            goods_price:res.data.message.goods_price,
            pics:res.data.message.pics,
            // iphone部分手机不识别 webp图片格式
            // 找后台修改
            // 临时自己改
            goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg')
        },
        isCollect
      })
  },
  handlePrevewIamge(e){ //点击查看大图
    // 先构造要预览图片数据组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    console.log(e);
    // 接受传递过来的图片
    const current=e.currentTarget.dataset.url
    wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
  },
  handleCartAdd(){ //添加购物车
   console.log("点击购物车");
     //    获取缓存中的购物车数据，数组格式
     let cart=wx.getStorageSync('cart')||[];
    //  判断商品对象是否存在于购物车数组中
    let index =cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index===-1) { //不存在，第一次添加
        this.GoodsInfo.num=1;
        this.GoodsInfo.checked=true;
        cart.push(this.GoodsInfo);
    } else { //已经存在购物车数据 执行num++
        cart[index].num++;
    }
    // 5把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart);
    // 6.弹窗提示
    wx.showToast({
        title: '加入成功',
        icon: 'success',
        mask:true
    })
  },
  handleCollect(e){  //点击商品图标收藏
    console.log(e);
    
    let isCollect=false;
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync('collect')||[];
    // 判断改商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 当index!==-1 表示已经收藏过
    if (index!==-1) {
      // 能找到 已经收藏过了 在数组中删除改商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消收藏',
      })
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      })
    }

    // 把数组存入缓存中
    wx.setStorageSync('collect', collect);
    // 修改data中的属性 isCollect
     this.setData({
      isCollect
     });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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
    console.log("fenz")
  }
})