// pages/map2/map.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: {
      longitude: 116.4965075,
      latitude: 40.006103,
    },
    longitude: 116.4965075,
    latitude: 40.006103,
    setting: {
      "enable-scroll": false
    },
    markers: [
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getLocation();
    // that.sendPos()
    console.log(wx)
    // that.scoket();
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
    this.__sendPos && clearInterval(this.__sendPos); 
    this.__getMarkers && clearInterval(this.__getMarkers);
    this.delMarker();
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

  },

  onLocationChange: function(data) {
    console.log('onLocationChange', data)
    let that = this;
    wx.onLocationChange(function (res) {
      console.log('location change', res);
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy

      // var markers = [
      //   {
      //     iconPath: "/resources/timg.jpg",
      //     id: 0,
      //     latitude: res.latitude + 100,
      //     longitude: res.longitude + 100,
      //     width: 50,
      //     height: 50
      //   }
      // ]
      that.setData({
        map: {
          longitude: longitude,
          latitude: latitude,
        },
      },()=>{
        console.log(longitude,latitude)
        // that.sendScoket(latitude);
      })
    })
  },

  intervalSendPos: function() {
    var that = this;
    if(!that.__sendPos) {
      that.__sendPos = setInterval(()=>{
        that.sendPos();
      },3000)
    }
  },

  intervalGetMarkers: function() {
    var that = this;
    if(!that.__getMarkers) {
      that.__getMarkers = setInterval(()=>{
        that.getMarkers();
      },10000)
    }
  },

  sendPos: function() {
    console.log('sendPos')
    var that = this;
    let params = {
      iconPath: app.globalData.userInfo.avatarUrl,
      longitude: that.data.map.longitude,
      latitude: that.data.map.latitude,
    }
    app.request('post', '/logistics/sendPos', params).then(e=>{
      wx.showToast({
        title: "发送定位" + params.longitude + ',' + params.latitude,
        icon: "none",
      })
    }).catch(err=>{
      wx.showToast({
        title: '发送失败',
      })
    })
    // wx.request({
    //   url: that.hostPath + '/logistics/sendPos',
    //   method: "POST",
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     console.log(res.data);
    //   },
    // })
    
  },

  getMarkers: function() {
    console.log('getMarkers');
    var that = this;
    let params = {
      iconPath: app.globalData.userInfo.avatarUrl,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }
    app.request('post', '/logistics/getMarkers', params).then(result=>{
      // wx.showToast({
      //   title: "获取人员信息"+result.markers.length,
      //   icon: "none"
      // })
      var res = result.markers;
      var markers = [];
      for (let i = 0; i < res.length; i++ ) {
        markers.push({
          iconPath: res[i].iconPath,
          id: i,
          latitude: res[i].position.latitude,
          longitude: res[i].position.longitude,
          width: 20,
          height: 20
        })
      }

      console.log(markers)
      that.setData({
        markers: markers
      })
    }).catch(err=>{
      console.log(err)
    })
  },

  delMarker: function () {
    console.log('delMarkers');
    var that = this;
    let params = {
      iconPath: app.globalData.userInfo.avatarUrl,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
    }
    app.request('post', '/logistics/delMarker', params).then(result => {
      console.log(result)
    }).catch(err => {
      console.log(err)
    })
  },

  // scoket: function() {
  //   var that = this;
  //   //建立连接
  //   console.log('开始连接webscoket')
  //   wx.connectSocket({
  //     url: "ws://192.168.23.1:8091",
  //   })
  //   // wx.connectSocket({
  //   //   url: "ws://localhost:8091",
  //   // })
  //   console.log(wx)

  //   //连接成功
  //   wx.onSocketOpen(function () {
  //     console.log('连接成功');
  //     that.getLocation();
  //   })

  //   //接收服务端信息
  //   wx.onSocketMessage(function (data) {
  //     console.log('接收到服务端信息：' + data);
  //   })

  //   //连接失败
  //   wx.onSocketError(function () {
  //     console.log('websocket连接失败！');
  //     wx.showToast({
  //       title: '服务器连接失败！',
  //       icon: 'none',
  //     })
  //   })
  // },
  // sendScoket: function() {
  //   var that = this;
  //   console.log('send data,', that.data)
  //   wx.sendSocketMessage({
  //     data: that.data.latitude
  //   })
  // },

  //获取定位
  getLocation: function(callback) {
    var that = this;
    wx.showLoading({
      title: "定位中",
      mask: true
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true,//高精度定位
      //定位成功，更新定位结果
      success: function (res) {
        console.log('定位成功', res)
        that.startUpdate(res);
      },
      //定位失败回调
      fail: function () {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },

      complete: function () {
        //隐藏定位中信息进度
        wx.hideLoading()
        wx.showToast({
          title: "定位complete",
          icon: "none"
        })
      }

    })
  },

  // 定位完成后开始更新数据，并且开启后台监听
  startUpdate: function(res) {
    var that = this;
    var latitude = res.latitude
    var longitude = res.longitude

    console.log(res, 'startUpdate')

    that.setData({
      longitude: longitude,
      latitude: latitude,
    }, () => {
      // that.sendScoket(latitude);
      // that.scoket();
      that.intervalSendPos();
      that.intervalGetMarkers();

      that.onLocationChange(latitude);
      // startLocationUpdateBackground
      
      wx.startLocationUpdate({
        success(res) {
          console.log('开启后台定位', res)
          that.onLocationChange(latitude);
        },
        fail(res) {
          that.onLocationChange(latitude);
          console.log('开启后台定位失败', res);
        }
      })
    })
  },
  
})