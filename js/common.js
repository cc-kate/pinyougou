$(function(){
  // 默认情况下，MUI是不响应a的 click单击事件的，这是它的默认行为，默认不响应
  // 我们解决方式就是重新为所有a链接绑定tap事件 阻止它的默认不响应行为
  //通过委托方式 给所有a 绑定事件
  mui('body').on('tap','a',function(e){
    e.preventDefault()   //阻止默认行为
    // top:是指顶级容器 赋值给顶级父容器 通过冒泡 触发
    window.top.location.href = this.href;
  })

  // 基准路径
  const baseURL = 'http://157.122.54.189:9094/api/public/v1/'
  // 添加zepto拦截器：它的作用是可以让每个ajax请求都经过这个函数进行处理
  // beforeSend:每次发送ajax请求都必须经过的处理函数
  $.ajaxSettings.beforeSend = function(xhr,obj){  //xhr 异步对象
    // 拼接url地址  obj.url就是当前发送请求的url
    obj.url = baseURL + obj.url
  }
  // 请求完成后触发的函数
  $.ajaxSettings.complete = function () {
    $('body').removeClass('loadding')
  }
})