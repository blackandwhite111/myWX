//app.js
const publicConfig = require('/utils/public.js');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.globalData.key = res.code
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      },
      fail: err=> {
        console.log(err)
      },
      complete: res=> {
        console.log(res)
        
      }
    })
  },
  globalData: {
    userInfo: null
  },
  request: function (method, url, params={}) {
    return new Promise((resolve,reject)=>{
      wx.request({
        method: method || 'post',
        url: publicConfig.hostPath + url,
        data: Object.assign(params, {
          userInfo: JSON.stringify(this.globalData.userInfo),
          key: this.globalData.key
          }),
        header: {
          'content-type': 'application/json'
        },
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          reject(err.data);
        }
      })
    })
  },
})