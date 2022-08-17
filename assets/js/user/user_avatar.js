$(function () {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        // 裁剪框比例
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 文件被更换后触发
    $('#file').on('change', function (e) {
        // console.log(e);
        // 获取用户选择的文件
        var filelist = e.target.files
        // console.log(filelist);
        // console.log(111);
        if (filelist.length === 0) {
            // console.log(11);
            return layer.msg('请选择照片')
        }
        // 拿到文件选择路径
        var file = e.target.files[0]
        // 将文件转化为路径
        var imageURL = URL.createObjectURL(file)
        // 重新初始化裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imageURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })
    // 确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 拿到用户裁剪之后的图像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 把图片上传服务器
        $.ajax({
            method:'post',
            url:'/my/update/avatar',
            data:{
                avatar:dataURL
            },
            success:function(res){
                if(res.sataus===0){
                    return layer.msg('更换图像失败')
                }
                layer.msg('更换图像成功')
                window.parent.getUserInfo()

            }
        })


    })



})