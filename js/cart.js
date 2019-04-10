$(function () {
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条，默认为True
  });

  function init() {
    $.ajax({
      type: 'get',
      url: 'my/cart/all',
      dataType: 'json',
      success: function (result) {
        var mytoken = sessionStorage.getItem('pyg_token')
        if (!mytoken) {
          sessionStorage.setItem('redirect', location.href)
          location.href = './login.html'
        } else {
          if (result.meta.status == 401) {
            sessionStorage.setItem('redirect', location.href)
            location.href = './login.html'
          } else {
            var data = JSON.parse(result.data.cart_info)
            var html = template('orderTemp', {
              list: data
            })
            $('.orderList').html(html)

            mui('.pyg_num').numbox()
            totalPrice()
          }
        }
      }
    })
  }
  init()

  $('.pyg_edit').on('tap', function () {
    $('body').toggleClass('eleToggle')
    if ($(this).text() == '编辑') {
      $(this).text('完成')
    } else {
      $(this).text('编辑')
      synccart($('.orderSingle'))
    }
  })

  $('.pyg_del').on('tap', function () {
    var list = $('.orderList').find('[type="checkbox"]').not(':checked').parents('.orderSingle')
    synccart(list)
    init()
  })

  // 获取总价格
  var total
  function totalPrice() {
    total = 0
    var allOrder = $('.orderSingle')
    allOrder.each(function (index, value) {
      console.log($(value).data('order'));
      var price = $(value).data('order').goods_price
      var num = $(value).find('#test').val()
      total += price * num

    })
    $('.totalPrice .price').text('￥ ' + total)
  }

  $('.orderList').on('tap', '.pyg_num .mui-btn', function () {
    totalPrice()
  })

  function synccart(orderList) {
    var list_obj = {};
    for (var i = 0; i < orderList.length; i++) {
      var data = $(orderList[i]).data('order')
      data.amount = $('.orderList').find('#test').val()
      list_obj[data.goods_id] = data
    }

    $.ajax({
      type: 'post',
      url: 'my/cart/sync',
      data: {
        "infos": JSON.stringify(list_obj)
      },
      dataType: 'json',
      success: function (result) {
        console.log(result);
        if(result.meta.status==200){
          init()
        }
      }
    })
  }

  // 生成订单
  $('.createOrder').on('tap',function(){
    var order = {
      "order_price": total,
      "consignee_addr": $('.pygAddress').text(),
      "goods": []
    }

    var allOrder = $('.orderSingle')
    allOrder.each(function (index, value) {
      var single = {}
      var temp = $(value).data('order')
      single.goods_id = temp.goods_id
      single.goods_number = temp.amount
      single.goods_price = temp.goods_price
      order.goods.push(single)
    })
    

    $.ajax({
      type:'post',
      url: 'my/orders/create',
      data:order,
      dataType:'json',
      success:function(result){
        console.log(result);
        location.href = './orderList.html'
      }
    })
  })

  $('.selectAddr').on('tap',function(){
    var picker = new mui.PopPicker({
      layer: 3
    });
    picker.setData(data)
    picker.show(function (items) {
      var addr = items[0].text + '-' + items[1].text
      console.log(items);
      if (items[2]){
        addr += '-' + items[2].text
        $('.pygAddress').text(addr)
      }else{
        $('.pygAddress').text(addr)
      }
    })
  })

})