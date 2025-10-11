import request from '../../utils/request'
import loginRequest, { setToken } from '../../utils/loginRequest'

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
          request('/wx/login', {
            appid: appid,
            code: res.code
          }).then(res => {
            this.setData({
              nickName: res
            })
            setToken(res)
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
  },

  onPayTap() {
    loginRequest('/wx/pay', { }, 'GET').then(res => {
      console.log(res)
      let data = res.data.data
      wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.packageValue,
        signType: data.signType,
        paySign: data.paySign,
        success: function () {
          wx.showToast({ title: '支付成功', icon: 'success' });
        },
        fail: function (err) {
          wx.showToast({ title: '支付失败', icon: 'none' });
          console.error('支付失败原因:', err);
        }
      });
    }).catch(() => {
      wx.showToast({ title: '支付接口异常', icon: 'none' });
    });
  }
})