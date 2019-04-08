$(function(){
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  var info = {
    cat_id:'',
    goods_id: '',
    goods_name: '',
    goods_number: '',
    goods_price: '',
    goods_small_logo: '',
    goods_weight: ''
  }

  $.ajax({
    type:'get',
    url: 'goods/detail',
    data: $.getPara(location.search),
    dataType:'json',
    success:function(result){
      console.log(result);
      info.cat_id = result.data.cat_id
      info.goods_id = result.data.goods_id
      info.goods_name = result.data.goods_name
      info.goods_number = result.data.goods_number
      info.goods_price = result.data.goods_price
      info.goods_small_logo = result.data.goods_small_logo
      info.goods_weight = result.data.goods_weight
     
      var html = template('gdTemp',result.data)
      $('.mui-scroll').html(html)

      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
    }
  })

  $('.pyg_cart').on('tap',function(){
    var mytoken = sessionStorage.getItem('pyg_token')
   if (!mytoken) {
     sessionStorage.setItem('redirect', location.href)
      location.href = './login.html' 
   }else{
     $.ajax({
       type: 'post',
       url: 'my/cart/add',
       data: JSON.stringify(info),
       dataType: 'json',
       success: function (result) {
         console.log(result);
         if(result.meta.status==401){
           sessionStorage.setItem('redirect',location.href)
            location.href = './login.html'
         }else{
           console.log('ok');
         }
       }
     })
   }
  })

})


