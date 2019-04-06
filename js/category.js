$(function(){
  // 调用 渲染页面动态结构
  render()
  // 创建全局变量 存放获取到的分类数据和时间
  var cateData;

  // 封装 渲染页面函数 实现数据的动态渲染
  function render(){
    // 获取本地数据
    cateData = JSON.parse(localStorage.getItem('pyg_cateData'))
    // 判断有没有本地数据，并判断是否超时，如果没有超时就直接使用本地数据进行数据结构的动态渲染
    if (cateData && Date.now() - cateData.time < 24*60*60*1000){
      // 使用本地存储进行数据的渲染
      leftList()
      // 第一次渲染要指定索引 默认为0
      rightList(0)
    }
    else{  //如果超时，则重新发请求
      getCateData()
    }
  };

  // 发送请求获取分类数据
  function getCateData(){
    // 发送请求时 先添加 页面加载的动画 类
    $('body').addClass('loadding')
    //发送get方式的ajax请求  （路径，回调函数）
    $.get('categories', function (result) {
      // 如果数据请求成功 才存到本地存储里
      if(result.meta.status == 200){
        // 将数据存储到本地存储
        // 1.客户端和服务器的数据交互只能是字符串
        // 2.文件的读取和写入只能是字符串
        // 3.本地存储的写入和获取也只能是字符串
        // 直接保存到变量是方便左右边数据动态生成 直接使用 不用传参 也不用再转parse
        cateData = {'list':result.data,time:Date.now()}
        localStorage.setItem('pyg_cateData',JSON.stringify(cateData))

        // 动态生成左侧导航项结构  一级分类
        leftList()
        // 动态生成右侧结构  二级分类
        rightList(0)
      }
    },'json') 
  }

  // 动态生成左侧导航项结构  一级分类
  function leftList(){
     var leftHtml = template('leftNavTemp', cateData)
     $('.left ul').html(leftHtml)

    //  动态结构生成完毕后 初始化iscroll
     var myScroll = new IScroll('.left')

    //  为左侧li绑定单击操作
     $('.left').on('tap', 'li', function () {
      //  给当前元素添加类 其他移除
       $(this).addClass('active').siblings().removeClass('active')
      //  实现 元素置顶  
      // 调用scrollToElement 方法  会滚动到当前元素的左上角
       myScroll.scrollToElement(this)

      //  动态渲染右侧 二级分类数据
      // 获取点击 当前元素的索引
       var index = $(this).index()
      //  传索引  渲染对应的二级分类数据
       rightList(index)
     })
  }

  // 动态生成右侧结构  二级分类
  function rightList(index){
    var rightHtml = template('rightListTemp',cateData.list[index])
    $('.rightList').html(rightHtml)

    // 动态生成的图片数据 还要发送二次请求src 所以需要判断图片是否全部加载完毕
    // 先获取所有图片的数量
    var imgcount = $('.rightList img').length
    // 加载完成一张图片就会触发一个onload事件
    $('.rightList img').on('load',function(){
      // 只要触发了这个事件，说明加载完一张图片 数量-1
      imgcount--;
      // 如果数量为0 说明全部图片都加载完毕了
      if(imgcount==0){
        // 这个时候 可以移除页面加载动画
        $('body').removeClass('loadding')
        // 图片全部加载完毕后 可以获取到正确的高度 实现滑动效果
        var iscroll = new IScroll('.right')
      }
    })
  }
})