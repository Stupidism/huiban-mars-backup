export const onModalOpen = () =>
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#666666',
  });

export const onModalClose = () =>
  wx.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#ffffff',
  });
