$(function () {
    var layer = layui.layer
    var form = layui.form

    // console.log();
    if(location.search){
        // var dt = $('#form-search').serialize()

        var art_id=location.search.substring(1)
        $.ajax({
            method:'get',
            url:'/my/article/'+art_id,
            success:function(res){
                if(res.status!==0){
                    layer.msg('获取数据失败')
                }
                var data = res.data
                form.val("form", data);
                // console.log(data);
                // 
            }
        })
        // console.log(dt);
    }
    

    
    // 定义加载文章分了的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {

                // console.log(res);

                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            },

        })


    }
    initCate()

    initEditor()


    // 裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮绑定点击事件处理函数
    $('#btn-ChooseImage').on('click', function () {
        $('#coverFile').click()
    })
    // 给input:file 的change事件
    $('#coverFile').on('change', function (e) {
        // console.log(1);
        // console.log(this.files);
        // console.log($(this).files); 这个不能获取，原生对象才有的files
        // console.log(e.target);
        var files = e.target.files
        // var file = this.files
        // var file = $(this)[0].files
        // 判断是否选择了问价
        if (files.length === 0) {
            return
        }
        // 根据文件创建url地址
        var newImgURL = URL.createObjectURL(files[0])
        // console.log(newImgURL,'0000000000000000000');
        // console.log(newImgURL);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定sub提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单快速创建formdata
        // FormData 以及传入的参数都是原生的
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        
        // fd.forEach(function(v,k){
        //     console.log(k,v);
        // })

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // blob 就是i那个文件封装过的对象，Blob
                
                fd.append('cover_img',blob)
                // 发起请求
                publishArticle(fd)
            })

    })
    // 定义发布文章方法
    function publishArticle(fd){
        var url = '/my/article/add'
        if(art_id){
            url = '/my/article/edit'
            fd.append('Id',parseInt(art_id))
        }
        $.ajax({
            method:'post',
            url:url,
            // 如果项服务器提交的是formdata格式的数据
            // 必须添加一下两个配置项
            contentType:false,
            processData:false,
            data:fd,
            success:function(res){
                
                // console.log(res);
                if(res.status!==0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                setTimeout(function(){
                    location.href = './art_list.html'
                },500)
                // 
            }

        })
    }


})