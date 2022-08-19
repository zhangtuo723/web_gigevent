$(function () {


    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date()

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据时候，
    // 将这个参数发送给服务器
    var q = {
        pagenum: 1,// 默认请求第一页数据
        pagesize: 10,// 默认每一页显示几条数据。
        cate_id: '',//文章分类id
        state: ''// 文章发布状态
    }

    function initTable() {

        // 获取文章数据
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页
                renderPage(res.total)
            }
        })
    }
    initTable()
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                // console.log($('[name=cate_id]').html());
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // console.log($('[name=cate_id]').html());
                // 这个下拉更改里面的数据后，layui并没有再次渲染，所以让他渲染一下
                // 但是表格里面的数据就不用重新渲染，这个layui会检测到吗？？
                form.render()
            }

        })
    }
    initCate()
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 对应的部分赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最先的q重新筛选数据
        initTable()
    })
    // 定义渲染分页方法
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [5, 10, 15, 20],
            layout: ['count', 'prev', 'page', 'next', 'skip', 'refresh', 'limit'],
            // 分页发生切换时候触发回调函数
            // 感觉这个回调绑定之后就触发了，应该是调用 laypage.render就会触发
            // laypage.render参数传递完毕后，执行内部代码时候会执行 参数里面的jump
            jump: function (obj, first) {
                // 如果是 laypage.render导致的触发回调函数 first为true
                // 所以这个first参数是用来标记是点击触发的还是第一次渲染触发的
                // console.log(obj.curr);
                // console.log(this);
                // 把最新的页码值赋值到q的对象中

                // 这个jump 在切换分页展示多少数据时候也会触发
                // 这个obj貌似就是这个 render里面的参数对象，所以初始的时候赋值了去。pagesize
                q.pagesize = obj.limit
                q.pagenum = obj.curr

                // 根据最新的q获取对应的数据列表并渲染列表
                // initTable()
                if (!first) {
                    initTable()
                }



            }
        });
    }

    // 通过代理的形式
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮格式
        var len = $('.btn-delete').length
        // console.log(len);
        var id = $(this).attr('data-id')
        // 询问用户是否删除数据
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method:'get',
                url:'/my/article/delete/'+ id,
                success:function(res){
                    // console.log($(this).attr('data-id'));
                    // console.log($(this));
                    // console.log(res);
                    if(res.status!==0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除完成后需要判断当前这一页中是否还有剩余数据
                    // 如果没有剩余数据则页码-1 在重新调用init
                    if(len===1){
                        q.pagenum =  q.pagenum==1?q.pagenum:q.pagenum-1
                    }
                    initTable()
                    layer.close(index);
                }
            })

            
        });
    })

    // 通过代码绑定修改

    $('tbody').on('click','.btn-edit',function(){
        var id = $(this).attr('data-id');
        
        location.href = `./art_pub.html?${id}`
    })


})