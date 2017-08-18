import fetch from 'isomorphic-fetch';

const wechatConfigAPI = (href) => {
  const path = `https://atory.cc/wechat/config?href=${href}`;
  return fetch(path, {
    method: 'GET',
    credentials: 'same-origin',
  });
};

export default wechatConfigAPI;
