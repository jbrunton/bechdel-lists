module.exports = {
  "devServer": {
    "disableHostCheck": true,
    progress: false
  },
  "transpileDependencies": [
    "vuetify"
  ],
  "chainWebpack": config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'Bechdel Lists';
      return args;
    })
  },
  "configureWebpack": {
    devtool: 'source-map'
  }
}
