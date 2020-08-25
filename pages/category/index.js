// 引入用来发送请求的方法
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList:[],
    leftMenuList:[],//左边菜单数据
    rightContent:[],
    currentIndex:0,
    scrollTop:0
  },
//  接口返回的数据
 Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    /*
      0.web的本地存储和小程序的本地存储的区别
         1.写代码的方式不一样。
            web：localStorage.setItem("key","value") localStorage.getItem("key")
            小程序:wx.setStorageSync('key', Object/String); wx.getStorageInfoSync("key")
         2.存的时候，有没有做类型转换
           web：不管存入什么类型的数据，最终都会先调用toString(),把数据变成字符串，再存入进去
           小程序：不存在类型转换这个操作，存什么类型进去，获取的时候就是什么类型。
    */
    // 1.先判断本地存储有没有旧的数据
    const Cates=wx.getStorageSync('cates');
    console.log(Cates.time,'Cates');
    
    // 2.没有旧的数据直接发生新请求数据
    if (!Cates) {
        this.getCate();
    }else{
        // 有旧的数据，看有没有过期时间
        if (Date.now()-Cates.time>1000*10) {
            // 过期了，重新发生请求
            console.log('过期了，重新发生请求');
            this.getCate();
        }else{
            // 可以使用旧的数据
            console.log('可以使用旧的数据');
            this.Cates=Cates.data;
            let leftMenuList=this.Cates.map(v=>v.cat_name);

        // 构造右侧列表数据
          let rightContent=this.Cates[0].children

            this.setData({
                leftMenuList,
                rightContent
            })

        }
    }
    // 3、旧的数据同时旧的也没有过去，就用本地存储数据

    
   
  },
//   获取轮播图数据
 async getCate(){
    var that = this;
    // request({url: '/categories'}).then(res=>{
    //     console.log(res.data)
    //     that.Cates=res.data.message;
    //     // 把接口的数据存入本地存储中去
    //     wx.setStorageSync('cates', {time:Date.now,data:that.Cates})
    //     // 构造左侧大菜单数据
    //     let leftMenuList=that.Cates.map(v=>v.cat_name);

    //     // 构造右侧列表数据
    //     let rightContent=that.Cates[0].children

    //     that.setData({
    //         leftMenuList,
    //         rightContent
    //     })
    //  })

    // 使用es7的async awit 发送请求
     const res =await request({url: '/categories'})
             console.log(res.data)
        that.Cates=res.data.message;
        // 把接口的数据存入本地存储中去
        wx.setStorageSync('cates', {time:Date.now,data:that.Cates})
        // 构造左侧大菜单数据
        let leftMenuList=that.Cates.map(v=>v.cat_name);

        // 构造右侧列表数据
        let rightContent=that.Cates[0].children

        that.setData({
            leftMenuList,
            rightContent
        })

  },

//点击切换导航
handleItemTap(e){
// 获取被点击标题的索引
 console.log(e);
// 给data的currentIndex
  const {index}=e.currentTarget.dataset
   // 根据不同的索引渲染右侧列表数据
   let rightContent=this.Cates[index].children
 this.setData({
    currentIndex:index,
    rightContent:rightContent,
    scrollTop:0
 })
//  重新设置右侧内容高度

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