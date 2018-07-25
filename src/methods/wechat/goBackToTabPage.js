export default () => {
  // eslint-disable-next-line no-undef
  const currentPages = getCurrentPages();
  if (currentPages.length > 1) {
    wx.navigateBack({
      delta: currentPages.length - 1,
    });
  }
};
