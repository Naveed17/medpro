window.usetifulInit = function (w, d, s, k) {
    var a = d.getElementsByTagName('head')[0];
    var r = d.createElement('script');
    r.async = 1;
    r.src = s;
    r.setAttribute('id', 'usetifulScript');
    r.dataset.token = k;
    a.appendChild(r);
}
