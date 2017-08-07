export const showAuthorIntro = (evt) => {
  const rect = evt.target.getBoundingClientRect();
  const detail = { show: true, rect };
  const event = new CustomEvent('authorIntro', { detail });
  const authorIntro = document.getElementById('author-intro');
  authorIntro.dispatchEvent(event);
};

export const hideAuthorInfo = () => {
  const detail = { show: false, rect: {} };
  const event = new CustomEvent('authorIntro', { detail });
  const authorIntro = document.getElementById('author-intro');
  authorIntro.dispatchEvent(event);
};
