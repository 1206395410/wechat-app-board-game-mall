import request from '../../utils/request'
import request, { setToken } from '../../utils/loginRequest'

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
    // 示例 orderId，实际可从订单列表或页面数据获取
    const orderId = 123;
    request('/order/pay', { orderId }, 'POST').then(res => {
      if (res && res.code === 0 && res.data) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function () {
            wx.showToast({ title: '支付成功', icon: 'success' });
          },
          fail: function () {
            wx.showToast({ title: '支付失败', icon: 'none' });
          }
        });
      } else {
        wx.showToast({ title: '获取支付信息失败', icon: 'none' });
      }
    }).catch(() => {
      wx.showToast({ title: '支付接口异常', icon: 'none' });
    });
  }
})