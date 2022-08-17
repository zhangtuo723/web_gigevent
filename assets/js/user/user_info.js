$(function(){
    var form = layui.form
    var layer = layui.layer
    // layui矿建提供的验证规则
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return '长度必须在1-6之间'
            }
        }

    })

    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo(){
        $.ajax({
            method:'get',
            url:'/my/userinfo',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                form.val("formUserInfo", res.data);
                //给表单赋值
                // form.val("formUserInfo", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                //     "username": "asa", // "name": "value"
                //     "nickname": "ss"
                    
                // });
                
                //获取表单区域所有值
                // var data1 = form.val("formUserInfo");
                // console.log(data1);
            }
        })
    }

    // 重置表单数据
    $('#btnReset').click(function(e){
        e.preventDefault()
        initUserInfo()

    })

    // 监听提交事件
    $('.layui-form').on("submit",function(e){
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            method:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    console.log(res);
                    return layer.msg('更新用户信息失败')
                    
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法重新渲染用户信息
                // window依旧是当前页面，parent iframe的是父页面
                window.parent.getUserInfo()

            }
        })
    })












})