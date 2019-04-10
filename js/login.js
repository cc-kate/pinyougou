$(function(){
  $('.mui-btn-primary').on('tap',function(){
    var obj = {
      username: " ",
      password: " "
    }
    obj.username = $('.username').val()
    obj.password = $('.password').val()
    if (!/^1[3-9]\d{9}$/.test(obj.username)){
      mui.toast('手机号码输入不正确')
      return false;
    }
    if (obj.password.length <6 ){
      mui.toast('密码长度小于6位')
      return false;
    }
    $.ajax({
      type:'post',
      url: 'login',
      data: obj,
      dataType:'json',
      success:function(result){
        console.log(result);
        if(result.meta.status==200){
          sessionStorage.setItem('pyg_token',result.data.token)
          var re = sessionStorage.getItem('redirect')
          if(re){
            location.href = re
          }else{
            location.href = '../index.html'
          }
        }else{
          mui.toast(result.meta.msg)
        }
      }
    })
  })
})