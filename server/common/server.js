import Express from 'express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import * as http from 'http';
import * as os from 'os';
import l from './logger';
import mongo from './mongo';
import errorHandler from '../api/middlewares/error.handler';

const app = new Express();
const exit = process.exit;

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));

  }

  router(routes) {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    mongo().then(() => {
      l.info(`Database loaded!`);
      http.createServer(app).listen(port, welcome(port));
    })
    .catch((e) => {
      l.error(e);
      exit(1);
    });

    return app;
  }
}
