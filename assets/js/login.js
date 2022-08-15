$(function(){
    
    //点击去注册账号
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
        // console.log(11);
    })  

    //点击去登录
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
        // console.log(11);
    }) 

    // 从layui上获取form对象
    var form = layui.form
    var layer = layui.layer
    // 通过form.varify()自定义校验规则

    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
            ],
            // 校验两次密码是否一样
        repwd:function(value){
            var pwd = $('.reg-box [name=password]').val()
            if(pwd!==value){
                return '两次密码不一致'
            }
        }
        })
    
        // 监听注册表单
        $('#form_reg').on('submit',function(e){
            e.preventDefault()
            var data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
            $.post('/api/reguser',data,function(res){

            if(res.status!==0){
                // return console.log('注册失败：',res.message);
                return layer.msg(res.message)

            }
            layer.msg('注册成功');
            $('#link_login').click()

            })
        })


        // 监听登录表单体检
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/api/login',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // console.log(res.token);
                // 将jwt认证的token存入本地
                localStorage.setItem('token',res.token)
                // 跳转后台
                location.href = 'index.html'

            }

        })
    })

})