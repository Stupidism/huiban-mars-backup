export default ({ nextTab, nextPage } = {}) => wx.navigateTo({
  url: `/pages/users/new/main?nextTab=${encodeURIComponent(nextTab || '')}&nextPage=${encodeURIComponent(nextPage || '')}`,
});
