# 云盘界面

**路由**

- `/`，`/folder` 为同一个页面，定位到`IndexIndex` 组件
- `/progress` 上传进度界面



**上传**

使用`fineUploader`，上传逻辑写在 `Index.vue`里



**/src/components/apiUrl.js**  存储请求的url



**期望返回的数据结构**

~~~js
{
    status: 1,
    msg: '',
    data: {}
}
~~~



**csrf_token** 后端才有laravel，请求使用的是 $.ajax，需要全局设置，给每一次请求携带csrf_token。在`main.js`里：

~~~js
$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
~~~

在 `Index.vue` 的`fineUploader` 插件初始化里： 

~~~js
    customHeaders: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
~~~



api文档：https://www.showdoc.com.cn/clodedisk?page_id=6686245021457928