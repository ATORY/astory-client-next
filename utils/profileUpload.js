import fetch from 'isomorphic-fetch';

/**
 * profileAPI: 图片上传
 * @param {*form} formData form包装file
 * @param {*} cb 
 * return: Promise<Response> 
 */
const profileAPI = (formData) => {
  const profilePath = 'http://localhost:4000/profile';
  return fetch(profilePath, {
    body: formData,
    // credentials: 'same-origin',
    credentials: 'include',
    method: 'PUT',
  });
};

export default profileAPI;
