// 每次调用 get或者post 或ajax时候会先调用这个函数
// 在这函数中能那套Ajax的配置对象
$.ajaxPrefilter(function(options){
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007'+options.url

    // 同意为有权限的接口设置请求头
    // console.log(111);
    if(options.url.indexOf('/my/')!==-1){
        options.headers = { Authorization: localStorage.getItem('token')||''}
    }
    options.complete =function(res){
        console.log('执行了complete回调')
        // 通过responseJSON获取服务器返回的数据
        // console.log(res)
        
        if(res.responseJSON.status === 1&&res.responseJSON.message==='身份认证失败！'){
            // 强行清空token并且跳转
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            
            location.href = './login.html'
        }
    }
    
    

})