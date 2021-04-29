module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        
        '/ppd233': {
              //  在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
              //  将/api开头的url转发到target上。
          target: 'http://127.0.0.1:89',
   
          changeOrigin: true,
          ws: true
          ,
          pathRewrite: {
          // 顾名思义，将/api重写为 /   此时url变为 http://192.168.101.110:8888/ 而不是  http://192.168.101.110:8888/api
            '^/ppd233': '/'
          }
        },

      }
    }
  }
}