import fetch from 'isomorphic-fetch';

const isProd = process.env.NODE_ENV === 'production';

export const submitEmailAPI = (email) => {
  const submitEmailPath = isProd ? '/api/pwd' : 'http://localhost:4000/pwd';
  return fetch(submitEmailPath, {
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: isProd ? 'same-origin' : 'include',
    method: 'PUT',
  });
};

export const submitNewPWDAPI = (email, checkCode, password) => {
  const submitEmailPath = isProd ? '/api/pwd' : 'http://localhost:4000/pwd';
  return fetch(submitEmailPath, {
    body: JSON.stringify({ email, checkCode, password }),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: isProd ? 'same-origin' : 'include',
    method: 'POST',
  });
};

