// 每次调用 get或者post 或ajax时候会先调用这个函数
// 在这函数中能那套Ajax的配置对象
$.ajaxPrefilter(function(options){
    // console.log(options.url);
    options.url = 'http://www.liulongbin.top:3007'+options.url
})