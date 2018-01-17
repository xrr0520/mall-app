import path from 'path';
import Koa from 'koa';
import log4js from 'log4js';
import bodyParser from 'koa-bodyparser';
import appConfig from './config/index';
import yamlConfig from './config/yaml';
import router from './router/router';
import middleware from './middleware/index';
import views from 'koa-views';
import koaWebpack from 'koa-webpack';
import serve from 'koa-static';

let argv = process.argv.splice(2);
process.env.NODE_ENV = argv[0] !== 'production' ? 'development' : 'production';

const app = new Koa();
const logger = log4js.getLogger('app');

appConfig.session(app);

//koa-static
app.use(serve(path.join(path.resolve('./'))));

app.use(bodyParser());

app.use(middleware.handlebars.layouts);

app.use(middleware.handlebars.rawHelper);

app.use(middleware.catchError);

//模板渲染
app.use(views(__dirname + '/view', {
    extension: 'hbs',
    map: {
        hbs: 'handlebars'
    }
}));

//路由
app.use(router.routes(), router.allowedMethods());

//热加载
//如果是生产模式则不加载
if (process.env.NODE_ENV === 'development') {
    const webpack = require("webpack");
    const webpackConf = require("../build/webpack.dev.conf");
    const compiler = webpack(webpackConf);
    app.use(koaWebpack({
        compiler: compiler,
        hot: {
            reload: true
        },
        //https://github.com/webpack/webpack-dev-middleware
        dev: {
            lazy: false,
            watchOptions: {
                aggregateTimeout: 2000,
                poll: true
            }
        }
    }));
}

//日志
log4js.configure({
    appenders: [{
        type: 'console',
        layout: {
            type: 'basic'
        }
    }],
    replaceConsole: true
});

//监听
app.listen(yamlConfig.port, () => {
    logger.info('server listen on ' + yamlConfig.port);
});
