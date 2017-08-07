let timer = null;

export const showAuthorIntro = (evt, userId) => {
  const rect = evt.target.getBoundingClientRect();
  const detail = { show: true, rect, userId };
  const event = new CustomEvent('authorIntro', { detail });
  const authorIntro = document.getElementById('author-intro');
  if (timer) clearTimeout(timer);
  authorIntro.dispatchEvent(event);
};

export const hideAuthorInfo = () => {
  // console.log('hiden')
  const detail = { show: false, rect: {} };
  const event = new CustomEvent('authorIntro', { detail });
  const authorIntro = document.getElementById('author-intro');
  timer = setTimeout(() => {
    if (timer) clearTimeout(timer);
    authorIntro.dispatchEvent(event);
  }, 1500);
};
