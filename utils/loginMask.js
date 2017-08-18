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

export const showShareMask = () => {
  const shareMask = document.getElementById('share-mask');
  const shareMaskBox = document.getElementById('share-mask-box');
  shareMask.className = 'shareqrcode mask';
  // shareMask.style.display = 'block';
  shareMask.className = 'shareqrcode mask mask-fadeup';
  shareMaskBox.className = 'mask-box mask-box-up';
};

export const hidenShareMask = () => {
  const shareMask = document.getElementById('share-mask');
  const shareMaskBox = document.getElementById('share-mask-box');
  shareMask.className = 'shareqrcode mask mask-fadeup mask-fadeout';
  shareMaskBox.className = 'mask-box mask-box-down';
  setTimeout(() => {
    shareMask.className = 'shareqrcode mask';
  }, 280);
};
