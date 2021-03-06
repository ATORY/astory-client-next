const express = require('express');
const next = require('next');
const winston = require('winston');
const config = require('config');
const compression = require('compression');
const request = require('request');
const Prometheus = require('prom-client');
const PrometheusGCStats = require('prometheus-gc-stats');

const SERVER_CONFIG = config.get('server');
const wechatHost = config.get('wechat.host');
const apiServer = config.get('apiServer');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/**
 * monitor
 */
const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
const Registry = Prometheus.Registry;
const register = new Registry();
const defaultLabels = { serviceName: 'astory-client' };
register.setDefaultLabels(defaultLabels);

collectDefaultMetrics({ register });
PrometheusGCStats(register)();
/** monitor up */

app.prepare().then(() => {
  const server = express();
  server.use(compression());

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

  server.get('/@/:userId/draft', (req, res) => {
    const actualPage = '/user/draft';
    const queryParams = { userId: req.params.userId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('/@/:userId/collect', (req, res) => {
    const actualPage = '/user/collect';
    const queryParams = { userId: req.params.userId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('/@/:userId/mark', (req, res) => {
    const actualPage = '/user/mark';
    const queryParams = { userId: req.params.userId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('/@edit/:articleId', (req, res) => {
    const actualPage = '/edit';
    const queryParams = { articleId: req.params.articleId };
    return app.render(req, res, actualPage, queryParams);
  });

  server.get('*', (req, res) => {
    if (req.url.startsWith('/wechat') ||
        req.url.startsWith('/weixincheck') ||
        req.url === '/MP_verify_B0Jt7DliJKfFC38K.txt'
    ) {
      req.pipe(request(`${wechatHost}${req.url}`).on('error', (err) => {
        res.end(err.toString());
      })).pipe(res);
      return;
    }
    if (req.url.startsWith('/pdf')) {
      request(`${apiServer}${req.url}`).pipe(res);
      return;
    }
    if (req.url.startsWith('/metrics')) {
      res.append('Content-Type', Prometheus.register.contentType);
      res.send(register.metrics());
      return;
    }
    handle(req, res);
  });

  server.listen(SERVER_CONFIG.PORT, (err) => {
    if (err) throw err;
    winston.info(`> ${process.env.NODE_ENV}, server start at ${SERVER_CONFIG.PORT}`);
    // winston.info('> Ready on http://localhost:3000');
  });
}).catch((ex) => {
  winston.error(ex.stack);
  process.exit(1);
});

