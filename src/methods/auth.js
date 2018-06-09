export const getAccessToken = () => wx.getStorageSync('access_token');

export const getAuthHeader = () => {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const setAccessToken = accessToken => wx.setStorageSync('access_token', accessToken);
