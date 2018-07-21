export default ({ nextTab, nextPage, showBackButton = true } = {}) =>
  wx[showBackButton ? 'navigateTo' : 'reLaunch']({
    url: `/pages/users/new/main?nextTab=${encodeURIComponent(nextTab || '')}&nextPage=${encodeURIComponent(nextPage || '')}`,
  });
