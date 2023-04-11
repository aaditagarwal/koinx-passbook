import examplesRouter from './api/controllers/examples/router';
import passbookRouter from "./api/controllers/passbook/router";

export default function routes(app) {
  app.use('/api/v1/examples', examplesRouter);
  app.use("/passbook", passbookRouter);
}
