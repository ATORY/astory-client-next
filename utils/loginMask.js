export const hidenLoginMask = () => {
  const loginMask = document.getElementById('login-mask');
  const loginMaskBox = document.getElementById('login-mask-box');
  loginMask.className = 'login mask mask-fadeup mask-fadeout';
  loginMaskBox.className = 'mask-box mask-box-down';
  setTimeout(() => {
    loginMask.className = 'login mask';
  }, 280);
};

export const showLoginMask = () => {
  const loginMask = document.getElementById('login-mask');
  const loginMaskBox = document.getElementById('login-mask-box');
  loginMask.className = 'login mask';
  // loginMask.style.display = 'block';
  loginMask.className = 'login mask mask-fadeup';
  loginMaskBox.className = 'mask-box mask-box-up';
};
