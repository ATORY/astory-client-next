const express = require('express');
const next = require('next');
const winston = require('winston');
const config = require('config');

const SERVER_CONFIG = config.get('server');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('/article/:articleId', (req, res) => {
    const actualPage = '/article';
    const queryParams = { articleId: req.params.articleId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('/@/:userId', (req, res) => {
    const actualPage = '/user';
    const queryParams = { userId: req.params.userId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('/@edit/:articleId', (req, res) => {
    const actualPage = '/edit';
    const queryParams = { articleId: req.params.articleId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(SERVER_CONFIG.PORT, (err) => {
    if (err) throw err;
    winston.info(`> ${process.env.NODE_ENV}, server start at ${SERVER_CONFIG.PORT}`);
    // winston.info('> Ready on http://localhost:3000');
  });
}).catch((ex) => {
  winston.error(ex.stack);
  process.exit(1);
});

