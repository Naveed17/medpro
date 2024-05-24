window.UpscopeLoad =  function (w, u, d) {
    var i = function () {
        i.c(arguments);
    };
    i.q = [];
    i.c = function (args) {
        i.q.push(args);
    };
    var l = function () {
        var s = d.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://code.upscope.io/SSDWjxW5ho.js";
        var x = d.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
    };
    if (typeof u !== "function") {
        w.Upscope = i;
        l();
    }
}
