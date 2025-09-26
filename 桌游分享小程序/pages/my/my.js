import request from '../../utils/request'

Page({
  data: {
    avatarUrl: '../../images/icon/user.png',
    nickName: '未登录',
    gender: 0, // 0:保密 1:男 2:女
    orderCount: {
      all: 0,
      delivery: 0,
      take: 0,
      comment: 0
    }
  },

  onLoad() {
    this.getUserInfo()
    this.getOrderCount()
  },

  getUserInfo() {
    request('/user/info').then(res => {
      if (res && res.code === 0) {
        this.setData({
          avatarUrl: res.data.avatarUrl || '../../images/icon/user.png',
          nickName: res.data.nickName || '未登录',
          gender: res.data.gender || 0
        })
      }
    }).catch(() => {})
  },

  getOrderCount() {
    request('/order/count').then(res => {
      if (res && res.code === 0) {
        this.setData({
          orderCount: res.data
        })
      }
    }).catch(() => {})
  },

  toOrderList(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/orderList/orderList?type=${type}`
    })
  }
})