$(function(){
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  $.ajax({
    type:'get',
    url: 'my/cart/all',
    dataType:'json',
    success:function(result){
      var data = JSON.parse(result.data.cart_info)
      var html = template('orderTemp',{list:data})
      $('.orderList').html(html)

      mui('.pyg_num').numbox()
      totalPrice()
    }
  })

  $('.pyg_edit').on('tap',function(){
    $('body').toggleClass('eleToggle')
    if($(this).text()=='编辑'){
      $(this).text('完成')
    }else{
      $(this).text('编辑')
      synccart($('.orderSingle'))
    }
  })

  

  function totalPrice(){
    var total = 0 
    var allOrder = $('.orderSingle')
    allOrder.each(function (index,value ) {
      console.log($(value).data('order'));
      var price = $(value).data('order').goods_price
      var num = $(value).find('#test').val()
      total += price*num
     
    })
     $('.totalPrice .price').text('￥ ' + total)
  }

  $('.orderList').on('tap', '.pyg_num .mui-btn',function(){
    totalPrice()
  })

  function synccart(orderList){
    var list_obj={};
    for (var i = 0; i < orderList.length; i++) {
      var data= $(orderList[i]).data('order')
      data.amount = $('.orderList').find('#test').val()
      list_obj[data.goods_id] = data
    }

    $.ajax({
      type:'post',
      url: 'my/cart/sync',
      data:{"infos":JSON.stringify(list_obj)},
      dataType:'json',
      success:function(result){
        console.log(result);
      }
    })
  }

})