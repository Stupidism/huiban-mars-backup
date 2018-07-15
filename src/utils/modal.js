export default ({ onConfirm, onCancel, ...options }) =>
  new Promise((resolve, reject) => wx.showModal({
    cancelColor: '#000000',
    confirmColor: '#2692F0',
    ...options,
    success(res) {
      if (res.confirm) {
        resolve(onConfirm && onConfirm());
      } else {
        reject(onCancel ? onCancel() : 'Modal Cancelled');
      }
    },
  }));
