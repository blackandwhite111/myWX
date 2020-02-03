// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [{
      "text": "对话",
      "pagePath": "",
      "iconPath": "/page/weui/images/tabbar_icon_chat_default.png",
      "selectedIconPath": "/page/weui/images/tabbar_icon_chat_active.png",
      dot: true
    },
    {
      "text": "设置",
      "pagePath": "",
      "iconPath": "/page/weui/images/tabbar_icon_setting_default.png",
      "selectedIconPath": "/page/weui/images/tabbar_icon_setting_active.png",
      badge: 'New'
    }, {
      "text": "我的",
      "pagePath": "",
      "iconPath": "/page/weui/images/tabbar_icon_setting_default.png",
      "selectedIconPath": "/page/weui/images/tabbar_icon_setting_active.png",
      badge: 'New'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
