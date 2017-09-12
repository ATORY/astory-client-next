// const express = require('express');
const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const winston = require('winston');
const config = require('config');
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

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  registers: [register],
  // buckets for response time from 0.1ms to 500ms
  // buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500],
});
/** monitor up */

app.prepare().then(() => {
  // const server = express();
  const server = new Koa();
  const router = new Router();
  // server.use(compression());

  router.get('/article/:articleId', async (ctx) => {
    const actualPage = '/article';
    const queryParams = { articleId: ctx.params.articleId };
    await app.render(ctx.req, ctx.res, actualPage, queryParams);
    ctx.respond = false;
  });

  router.get('/@/:userId', async (ctx) => {
    const actualPage = '/user';
    const queryParams = { userId: ctx.params.userId };
    await app.render(ctx.req, ctx.res, actualPage, queryParams);
    ctx.respond = false;
  });

  router.get('/@/:userId/draft', async (ctx) => {
    const actualPage = '/user/draft';
    const queryParams = { userId: ctx.params.userId };
    await app.render(ctx.req, ctx.res, actualPage, queryParams);
    ctx.respond = false;
  });

  router.get('/@/:userId/collect', async (ctx) => {
    const actualPage = '/user/collect';
    const queryParams = { userId: ctx.params.userId };
    await app.render(ctx.req, ctx.res, actualPage, queryParams);
  });

  router.get('/@/:userId/mark', async (ctx) => {
    const actualPage = '/user/mark';
    const queryParams = { userId: ctx.params.userId };
    await app.render(ctx.req, ctx.res, actualPage, queryParams);
    ctx.respond = false;
  });

  router.get('/@edit/:articleId', async (ctx) => {
    const actualPage = '/edit';
    const queryParams = { articleId: ctx.params.articleId };
    await app.render(ctx.req, ctx.res, actualPage, queryParams);
    ctx.respond = false;
  });

  router.get(/\/wechat\/\*|\/weixincheck\/\*|\/MP_verify_B0Jt7DliJKfFC38K.txt/, (ctx) => {
    ctx.body = ctx.req.pipe(request(`${wechatHost}${ctx.req.url}`));
  });
  router.get(/\/pdf\/\*/, (ctx) => {
    ctx.body = request(`${apiServer}${ctx.req.url}`);
  });
  router.get(/\/metrics\*/, (ctx) => {
    ctx.set('Content-Type', Prometheus.register.contentType);
    ctx.body = register.metrics();
  });
  router.get('*', async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, n) => {
    ctx.res.statusCode = 200;
    const start = Date.now();
    await n();
    const end = Date.now();
    const responseTimeInMs = end - start;
    httpRequestDurationMicroseconds.labels(ctx.path).observe(responseTimeInMs);
  });
  server.use(router.routes());
  server.listen(SERVER_CONFIG.PORT, (err) => {
    if (err) throw err;
    winston.info(`> ${process.env.NODE_ENV}, server start at ${SERVER_CONFIG.PORT}`);
  });
}).catch((ex) => {
  winston.error(ex.stack);
  process.exit(1);
});

