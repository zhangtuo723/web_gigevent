$(function () {
    var layer = layui.layer
    var form = layui.form
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    initArtCateList()
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的方式给form绑定事件，
    // 不能直接绑定，业务页面没有单出来之前不能获取到form
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            url: '/my/article/addcates',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理形式，给btn-edit绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        // console.log('ok');
        // 这是弹出一个修改文章分析信息的层
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        // console.log(id);
        // 发起请求获取分类数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val("form-edit", res.data);
            }
        })
    })

    // 通过代理给修改表单绑定事件

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新分类成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理为删除绑定事件
    $('tbody').on('click', '.btn-delete', function (e) {
        // console.log('ok');
        var id = $(this).attr('data-id')
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // console.log(id);
            $.ajax({
                method:'get',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!==0){
                        // console.log(res);
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    // 感觉这个可以不填
                    layer.close(index);
                    initArtCateList()
                }
            })
            
        });

    })













})