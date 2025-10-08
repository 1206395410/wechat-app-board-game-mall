import request from '../../utils/request'

Page({
  data: {
    nickName: '未登录'
  },

  getWxCode() {
    wx.login({
      success: res => {
        if (res.code) {
          // 获取当前小程序的 appid
          let appid = ''
          if (wx.getAccountInfoSync) {
            const accountInfo = wx.getAccountInfoSync()
            appid = accountInfo.miniProgram.appId || ''
            console.log('当前小程序的appid:', appid)
          }
          wx.showToast({
            title: 'code获取成功',
            icon: 'success',
            duration: 1500
          })
          console.log('微信code:', res.code)
          // 调用后端登录接口
          request('/login/login', {
            appid: appid,
            code: res.code
          }).then(res => {
            this.setData({
              nickName: res
            })
            console.log(res)
          }).catch(() => {})
        } else {
          wx.showToast({
            title: '获取code失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  }
})