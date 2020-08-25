import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tabs:[
         {
             id:0,
             value:"综合",
             isActive:true
         },
         {
            id:1,
            value:"销量",
            isActive:false
        },
        {
            id:2,
            value:"价格",
            isActive:false
        }
     ],
     goodsList:[]
  },
//   接口要的参数
// https://api-hmugo-web.itheima.net/api/public/v1/goods/search
queryParams:{
    query:"",
    cid:'',
    pagenum:1,
    pagesize:10
},
// 总页数
 totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid=options.cid
    console.log(this.queryParams,'this.queryParams');
    this.getGoodList()

     
      
     
  },
//   获取商品列表数据
async getGoodList(){
  const res=await request({url:'/goods/search',data:this.queryParams});
  console.log(res);
  const total=res.data.message.total
//   const goodsListData=res.data.message.goods
  this.totalPages=Math.ceil(total/this.queryParams.pagesize);
  console.log("总页数",this.totalPages);
//   下拉请求数据做数据拼接
   this.setData({
    goodsList:[...this.data.goodsList,...res.data.message.goods]
   })

//    关闭下拉刷新窗口
wx.stopPullDownRefresh();
},

//   标题点击事件
  handleTabItemChange(e){
    console.log(e,'父组件');
    // 获取被点击的索引
    const {index}=e.detail
    console.log(index,'父组件');
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
     console.log(options);
     
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
   console.log("上拉");
    //    重置数组
    this.setData({
        goodsList:[]
    })
   this.queryParams.pagenum=1
   this.getGoodList();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   console.log("下拉");
//    判断还有没有下页数据
   if (this.queryParams.pagenum>this.totalPages) {
       console.log("没有下一页");
       wx.showToast({
         title: '没有数据了',
       })
       
   }else{
       console.log("有下一页");
    //    有数据
    this.queryParams.pagenum++;
    this.getGoodList();
    console.log(this.queryParams.pagenum);
   }
 
//    this.getGoodList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})