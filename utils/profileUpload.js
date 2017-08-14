import fetch from 'isomorphic-fetch';

/**
 * profileAPI: 图片上传
 * @param {*form} formData form包装file
 * @param {*} cb 
 * return: Promise<Response> 
 */

const isProd = process.env.NODE_ENV === 'production';

const profileAPI = (formData) => {
  const profilePath = isProd ? '/api/profile' : 'http://localhost:4000/profile';
  return fetch(profilePath, {
    body: formData,
    credentials: isProd ? 'same-origin' : 'include',
    method: 'PUT',
  });
};

export default profileAPI;
