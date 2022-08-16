$(function(){
    getUserInfo()

    $('#btnLogout').on('click',function(){
        // console.log('ok');

        var layer = layui.layer
        // 提示用户是否退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            // 
            // console.log('ok');
            // 1.清空token
            localStorage.removeItem('token')
            // 2.跳转登录页面
            location.href = './login.html'


            layer.close(index);
            });
    })

})

// 获取用户基本信息
function getUserInfo(){

    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 请求头对象
        // headers:{Authorization:localStorage.getItem('token')},
        success:function(res){
            if(res.status!==0){
                console.log(res);
                return layui.layer.msg('获取用户信息失败')
            }
            // console.log(res);
            // 渲染图像
            renderAvatar(res.data)
        },
        // 无论成功还是失败，最后都会调用这个函数
        // 把这个函数可以写在ajaxPrefilter中
        // complete:function(res){
        //     console.log('执行了complete回调')
        //     // 通过responseJSON获取服务器返回的数据
        //     // console.log(res)
            
        //     if(res.responseJSON.status === 1&&res.responseJSON.message==='身份认证失败！'){
        //         // 强行清空token并且跳转
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
                
        //         location.href = './login.html'
        //     }
        // }
    })

}
// 渲染用户图像
function renderAvatar(user){
    var name = user.nickname||user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;'+name)
    // 按需渲染用户图像
    if(user.user_pic!==null){
        // 渲染图片图像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('text-avatar').hide()
    }else{
        // 渲染文本图像
        $('.layui-nav-img').hide()
        // 字符串转大写
        var first = name[0].toUpperCase()
        $('text-avatar').html(first).show()

    }
}