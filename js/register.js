$(function(){
  // 获取验证码
  $('#pyg_code').on('tap',function(){
    var mobile = $('[name="mobile"]').val()
    var reg = /^1[3-9]\d{9}$/
    if(!reg.test(mobile)){
      mui.toust('手机号码错误，请重新输入')
      return false;
    }
    $.ajax({
      type: 'post',
      url: 'users/get_reg_code',
      data: {mobile: mobile},
      dataType:'json',
      success:function(result){
        console.log(result);
        if(result.meta.status){
          $('[name="code"]').val(result.data)
        }
      }
    })
  })
  
  // 提交注册
  $('.pyg_reg').on('tap',function(){
    $.ajax({
      type:'post',
      url: 'users/reg',
      data: $('.reg').serialize(), //字符串
      dataType:'json',
      success:function(result){
        if (result.meta.status==200){
          setTimeout(() => {
            location.href= './login.html'
          }, 1000);
        }
      }
    })
  })
})