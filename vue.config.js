module.exports = {
  publicPath: '',
  productionSourceMap: false,
  parallel: true,
  chainWebpack: config =>  {
    config.optimization.minimize(false)
   },
  devServer: {
    https: false
  }
}