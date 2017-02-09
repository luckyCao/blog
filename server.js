/**
 * Created by caolei on 2017/1/25.
 */
var express =require('express')
var webpack =require('webpack')
var webpackMiddleware =require('webpack-dev-middleware')
var webpackHotMiddleware =require('webpack-hot-middleware')
var ip =require('ip')
var http =require('http')
var config =require('./webpack.config.js')
var compression =require('compression')

var isProduction = process.env.ENV === 'production';

var app = express();
if (!isProduction) {
  var compiler = webpack(config)
  var middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'dist/',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  })
  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
  var server = http.createServer(app)
  server.listen(3000, ip.address(), (err) => {
    if (err) throw err
    var addr = server.address()
    console.log('==> 🌎 Listening on  http://%s:%d', addr.address, addr.port);
  })
} else {
  // app.use(compression());
  app.use(express.static('public'))
  app.get('/', function (req, res) {
    res.send('Hello World!');
  });
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
}