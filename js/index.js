$(function(){
  banner()
  product()
})


function banner(){
  $.ajax({
    type:'get',
    url: 'http://157.122.54.189:9094/api/public/v1/home/swiperdata',
    dataType:'json',
    success:function(result){
      if(result.meta.status==200){
        var html = template('bannerTemp',result)
        $('.pyg_banner').html(html)
        var indiHtml = template('indicatorTemp', result)
        $('.mui-slider-indicator').html(indiHtml)

        mui('.mui-slider').slider({
          interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
        });
      }
    }
  })
}

function product(){
  $.ajax({
    type:'get',
    url: 'http://157.122.54.189:9094/api/public/v1/home/goodslist',
    dataType:'json',
    success:function(result){
      var proHtml = template('ProTemp',result)
      $('.goodsList').html(proHtml)
    }
  })
}