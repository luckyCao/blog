/**
 * Created by caolei on 2017/1/25.
 */
import express from 'express'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import ip from 'ip'
import http from 'http'
import config from './webpack.config.js'

var app = express();
const compiler = webpack(config)
const middleware = webpackMiddleware(compiler, {
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
// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });


const server = http.createServer(app)
server.listen(3000, ip.address(), (err) => {
  if (err) throw err
  const addr = server.address()
  console.log('==> 🌎 Listening on  http://%s:%d', addr.address, addr.port);
})