export const getAccessToken = () => wx.getStorageSync('access_token');

export const getAuthHeader = () => ({
  Authorization: `Bearer ${getAccessToken() || ''}`,
});

export const setAccessToken = accessToken => wx.setStorageSync('access_token', accessToken);
