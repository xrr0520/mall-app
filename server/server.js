const Koa = require('koa');
const middleware = require('./lib/middleware/index');
const setContext = require('./lib/set-context');
const server = new Koa();

setContext(server);

middleware.logger(server);

middleware.helmet(server);

middleware.bodyParser(server);

middleware.session(server);

middleware.handlebars(server);

middleware.catchError(server);

middleware.view(server);

middleware.staticServe(server);

middleware.stateContext(server);

middleware.router(server);

middleware.webpack(server);

middleware.proxy(server);

middleware.listen(server);