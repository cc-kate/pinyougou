$(function(){
  // 单击搜索实现侧滑效果
  $('.mui-icon-search').on('tap',function(){
    mui('.mui-off-canvas-wrap').offCanvas('show');
  })
  
  // 参数  全局变量  
  var data = {
    cid: $.getPara(location.search).cid,
    pagenum:1,
    pagesize:10
  }

  // 封装获取数据的函数  后期下拉和上拉都需要重新加载数据
  function renderMainData(callback,obj){
    $.ajax({
      type:'get',
      url:'goods/search',
      data: $.extend(data,obj),
      dataType:'json',
      success:function(result){
        callback(result)
      }
    })
  }

  // 下拉刷新和上拉加载的mui初始化
  mui.init({
    // swipeBack:false,  //实现禁用侧滑返回 (右滑)
    pullRefresh: {
      container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      down: {
        height: 50,//可选,默认50.触发下拉刷新拖动距离,
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
        contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
        contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          data.pagenum = 1  //重置页码为1
          renderMainData(function(result){
            var html = template('goodslistTemp', result.data)
            $('.goodslist').html(html)
            //数据加载完毕 必须执行如下代码 关闭“正在刷新”的样式提示，内容区域回滚顶部位置
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            // 为了防止切换分类的时候，无法再上拉，所以在每次刷新的时候将上拉加载重新启用
            mui('#refreshContainer').pullRefresh().refresh(true)
          })
        } 
      },
      // 上拉加载更多数据
      up: {
        height: 50,//可选.默认50.触发上拉加载拖动距离
        auto: false,//可选,默认false.自动上拉加载一次
        contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
        contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
        callback: function () {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
           data.pagenum++  //上拉 翻页 页码++
           renderMainData(function (result) {
            //  如果还有数据返回，则渲染追加
             if(result.data.goods.length >0){
               var html = template('goodslistTemp', result.data)
               $('.goodslist').append(html)  //追加 不能用html()覆盖
               mui('#refreshContainer').pullRefresh().endPullupToRefresh();
             } else {
              //  如果没有数据了 则显示 没有更多数据了 不再刷新
               mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
             }
           })
        } 
    }
    }
  });


  $('.query_btn').on('tap',function(){
    var obj = {}
    obj.query = $('.query_txt').val()
    renderMainData(function(result){
      var html = template('searchListTemp',result.data)
      $('.searchList ul').html(html)
    },obj)
  })


})