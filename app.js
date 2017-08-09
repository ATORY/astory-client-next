const express = require('express');
const next = require('next');
const winston = require('winston');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/article/:articleId', (req, res) => {
    const actualPage = '/article';
    const queryParams = { articleId: req.params.articleId };
    app.render(req, res, actualPage, queryParams);
  });

  server.get('/@/:userId', (req, res) => {
    const actualPage = '/user';
    const queryParams = { userId: req.params.userId };
    app.render(req, res, actualPage, queryParams);
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(3000, (err) => {
    if (err) throw err;
    winston.info('> Ready on http://localhost:3000');
  });
}).catch((ex) => {
  winston.error(ex.stack);
  process.exit(1);
});

