let timer = null;

export const showAuthorIntro = (evt, userId) => {
  const rect = {};
  const targetRect = evt.target.getBoundingClientRect();
  const articlesRect = document.getElementById('articles').getBoundingClientRect();
  rect.top = (targetRect.top - articlesRect.top) + 70;
  rect.left = targetRect.left;
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
  }, 700);
};
