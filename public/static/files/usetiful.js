(() => {
    "use strict";
    var t = {
            727: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                s(163).__exportStar(s(525), e);
            },
            820: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 }),
                    (e.getCookie = e.setCookie = void 0),
                    (e.setCookie = function (t, e, s) {
                        let i = "";
                        if (s) {
                            const t = new Date();
                            t.setTime(t.getTime() + 24 * s * 60 * 60 * 1e3), (i = `; expires=${t.toUTCString()}`);
                        }
                        document.cookie = `${t}=${e || ""}${i}; path=/`;
                    });
                e.getCookie = (t) => {
                    const e = `${t}=`,
                        s = document.cookie.split(";");
                    for (let t = 0; t < s.length; t += 1) {
                        let i = s[t];
                        for (; " " === i.charAt(0); ) i = i.substring(1, i.length);
                        if (0 === i.indexOf(e)) return i.substring(e.length, i.length);
                    }
                    return null;
                };
            },
            797: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                s(163).__exportStar(s(820), e);
            },
            525: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                const i = s(163);
                i.__exportStar(s(19), e), i.__exportStar(s(315), e), i.__exportStar(s(797), e);
            },
            42: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.Template = void 0);
                const i = s(19);
                class r {
                    constructor(t) {
                        (this.setTheme = (t) => {
                            this.themeClasses = (0, i.getThemeClasses)(t, this.classDefinition);
                        }),
                            (this.createButton = (t) => {
                                const { color: e = "Primary", label: s, attributes: i = {}, elementType: r = "button", onClick: n, href: o = "#" } = t,
                                    a = document.createElement(r);
                                return (
                                    "button" === r && (a.type = "button"),
                                    "a" === r && ((a.role = "button"), a.setAttribute("href", o)),
                                        (a.innerHTML = s),
                                        a.classList.add(this.themeClasses.button),
                                        a.classList.add(this.themeClasses[`button${e}`]),
                                        Object.keys(i).forEach((t) => {
                                            a.setAttribute(t, i[t]);
                                        }),
                                    "function" == typeof n &&
                                    a.addEventListener("click", (t) => {
                                        n(t);
                                    }),
                                        a
                                );
                            }),
                            (this.createActions = (t) => {
                                const { actions: e, alignment: s } = t,
                                    i = document.createElement("div");
                                return (
                                    i.classList.add(this.themeClasses.actions),
                                        i.classList.add(s),
                                        e.forEach((t) => {
                                            i.appendChild(t);
                                        }),
                                        i
                                );
                            }),
                            (this.createWatermarkBadge = (t) => {
                                const e = document.createElement("div");
                                e.classList.add(t);
                                const s = document.createElement("a");
                                return (s.innerHTML = "Powered by Usetiful"), s.setAttribute("href", "https://www.usetiful.com/?utm_source=banner_badge"), e.appendChild(s), e;
                            }),
                            (this.themeClasses = (0, i.getThemeClasses)(t, this.classDefinition));
                    }
                    classDefinition(t, e) {
                        return { overlay: `${e}-overlay`, actions: `${e}-actions`, button: `${t}-button`, buttonPrimary: `${t}-button-primary`, buttonSecondary: `${t}-button-secondary` };
                    }
                }
                (e.Template = r), (e.default = r);
            },
            315: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.Template = void 0);
                const i = s(163);
                var r = s(42);
                Object.defineProperty(e, "Template", {
                    enumerable: !0,
                    get: function () {
                        return i.__importDefault(r).default;
                    },
                }),
                    i.__exportStar(s(42), e);
            },
            125: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.getThemeClasses = e.getThemeHashFromURL = e.getClasses = void 0);
                e.getClasses = function (t, e) {
                    let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                    const i = `${t}${s ? `-${s}` : ""}`,
                        r = e(i, t);
                    return Object.assign({ prefix: i }, r);
                };
                e.getThemeHashFromURL = (t) => {
                    var e, s, i, r;
                    let n =
                        null === (r = null === (i = null === (s = null === (e = null == t ? void 0 : t.split("/")) || void 0 === e ? void 0 : e.pop()) || void 0 === s ? void 0 : s.split("-")) || void 0 === i ? void 0 : i.pop()) ||
                        void 0 === r
                            ? void 0
                            : r.replace(".css", "");
                    const o = n ? n.indexOf("?") : 0;
                    return o >= 0 && (n = null == n ? void 0 : n.substring(0, o)), n && "default" !== n ? n : null;
                };
                e.getThemeClasses = (t, s) => (0, e.getClasses)("uf", s, (0, e.getThemeHashFromURL)(t));
            },
            19: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                s(163).__exportStar(s(125), e);
            },
            107: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                s(163).__exportStar(s(642), e);
            },
            642: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                const i = s(163);
                i.__exportStar(s(609), e), i.__exportStar(s(337), e), i.__exportStar(s(474), e);
            },
            904: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.tagsLSKey = void 0), (e.tagsLSKey = "uf_tags");
            },
            337: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                s(163).__exportStar(s(449), e);
            },
            449: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.removeTagValue = e.updateTagValue = e.getTagValue = e.updateTagsFromLS = e.loadTagsFromLS = e.replaceTags = void 0);
                const i = s(904);
                e.replaceTags = (t) => {
                    const { usetifulTags: e } = window,
                        s = Object.keys(e || {});
                    return (
                        null == s ||
                        s.forEach((s) => {
                            t = null == t ? void 0 : t.replace(`{${s}}`, e[s]);
                        }),
                            t
                    );
                };
                e.loadTagsFromLS = () => {
                    const t = localStorage.getItem(i.tagsLSKey);
                    if (t) {
                        const e = JSON.parse(t);
                        Object.assign(window.usetifulTags, e);
                    }
                };
                e.updateTagsFromLS = () => {
                    const t = localStorage.getItem(i.tagsLSKey);
                    if (t) {
                        const e = JSON.parse(t);
                        Object.entries(e).forEach((t) => {
                            const [e, s] = t;
                            if (window.usetifulTags[e] && window.usetifulTags[e] !== s) window.usetifulTags[e] = s;
                            else if (!window.usetifulTags[e]) {
                                const t = {};
                                (t[e] = s), Object.assign(window.usetifulTags, t);
                            }
                        });
                    }
                };
                e.getTagValue = (t) => {
                    if (!t) return null;
                    const e = localStorage.getItem(i.tagsLSKey);
                    if (e) {
                        const s = JSON.parse(e);
                        if (null !== s[t]) return s[t];
                    }
                    return null;
                };
                e.updateTagValue = (t, s) => {
                    if (!t) return;
                    if (0 === s.length) return void (0, e.removeTagValue)(t);
                    const r = localStorage.getItem(i.tagsLSKey);
                    if (r) {
                        const n = JSON.parse(r);
                        null !== n[t] && s !== n[t] && ((n[t] = s), window.localStorage.setItem(i.tagsLSKey, JSON.stringify(n)), (0, e.updateTagsFromLS)());
                    } else {
                        const r = {};
                        (r[t] = s), window.localStorage.setItem(i.tagsLSKey, JSON.stringify(r)), (0, e.updateTagsFromLS)();
                    }
                };
                e.removeTagValue = (t) => {
                    const e = localStorage.getItem(i.tagsLSKey);
                    if (e) {
                        const s = JSON.parse(e);
                        null !== s[t] && (delete s[t], window.localStorage.setItem(i.tagsLSKey, JSON.stringify(s)));
                    }
                    window.usetifulTags && window.usetifulTags[t] && delete window.usetifulTags[t];
                };
            },
            474: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                s(163).__exportStar(s(39), e);
            },
            39: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
            },
            169: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                e.default = class {
                    constructor(t) {
                        this.scriptMode = null != t ? t : "";
                    }
                    isStandard() {
                        return "" === this.scriptMode;
                    }
                    isPlugin() {
                        return "plugin" === this.scriptMode;
                    }
                    isOffline() {
                        return "offline" === this.scriptMode;
                    }
                    getScriptElement() {
                        const t = `#usetiful${this.scriptMode.length > 0 ? this.scriptMode.charAt(0).toUpperCase() + this.scriptMode.slice(1) : ""}Script`,
                            e = null === document || void 0 === document ? void 0 : document.querySelector(t);
                        return e || (console.warn(`Usetiful plugin: script element ${t} does not exist in dom.`), null);
                    }
                };
            },
            711: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                const i = s(163).__importDefault(s(460));
                e.default = class {
                    constructor(t) {
                        (this.parser = new i.default(t.getScriptElement())),
                            (this.apiToken = this.parser.parseString("token")),
                            (this.sourceFile = this.parser.parseString("source-file")),
                            (this.themePath = this.parser.parseString("theme-path")),
                            (this.isDebug = this.parser.parseBool("debug")),
                            (this.withDrafts = this.parser.parseBool("with-drafts")),
                            (this.onlyTips = this.parser.parseBool("only-tips")),
                            (this.onlyChecklists = this.parser.parseBool("only-checklists")),
                            (this.previewTourId = this.parser.parseNumber("preview-tour-id")),
                            (this.isDev = this.parser.parseShortHostname().startsWith("dev."));
                    }
                };
            },
            460: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                e.default = class {
                    constructor(t) {
                        this.element = t;
                    }
                    parseBool(t) {
                        return !!this.element && 1 === this.parseNumber(t);
                    }
                    parseNumber(t) {
                        if (!this.element) return 0;
                        const e = this.element.getAttribute(`data-${t}`) || "0";
                        return parseInt(e, 10) || 0;
                    }
                    parseString(t) {
                        return (this.element && this.element.getAttribute(`data-${t}`)) || "";
                    }
                    parseHostname() {
                        var t;
                        return this.element
                            ? this.element.hasAttribute("data-hostname")
                                ? `${this.element.getAttribute("data-hostname")}/`
                                : (null === (t = 'https://www.usetiful.com/dist/usetiful.js') || void 0 === t ? void 0 : t.replace(/(\/\/.*?\/).*/g, "$1")) || ""
                            : "";
                    }
                    parseProtocol() {
                        return `${this.parseHostname().split("/")[0]}//`;
                    }
                    parseShortHostname() {
                        return this.parseHostname()
                            .replace(/(^\w+:|^)\/\//, "")
                            .replace("www.", "");
                    }
                };
            },
            336: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 });
                e.default = class {
                    constructor(t) {
                        let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                        (this.apiToken = t), (this.tokenLength = 32), (this.currentTime = e ? new Date(e) : new Date());
                    }
                    getCharsFromHash(t) {
                        let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        return [t.charAt(0), t.charAt(e ? 6 : t.length - 2), t.slice(-1)];
                    }
                    isSameCharsFromHash(t, e) {
                        return JSON.stringify(t) === JSON.stringify(e);
                    }
                    getHashedCharsFromString(t) {
                        let e = 0;
                        const s = t.length;
                        let i = 0;
                        if (s > 0) for (; i < s; ) e = ((e << 5) - e + t.charCodeAt(i++)) | 0;
                        return this.getCharsFromHash(e.toString());
                    }
                    validate() {
                        return this.apiToken.length === this.tokenLength && !0;
                    }
                };
            },
            646: (t, e) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.createScript = void 0);
                e.createScript = function (t) {
                    let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                        s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                    if (document && null === document.querySelector(`#${t}`)) {
                        const i = document.createElement("script");
                        (i.id = t), null !== e && (i.src = e), null !== s && ((i.type = "text/javascript"), (i.innerHTML = s));
                        const r = null === document || void 0 === document ? void 0 : document.querySelector("body");
                        return r && r.appendChild(i), i;
                    }
                    return document.querySelector(`#${t}`);
                };
            },
            609: (t, e, s) => {
                Object.defineProperty(e, "__esModule", { value: !0 }), (e.TokenSecurity = e.Settings = e.ContentResolver = void 0);
                const i = s(163);
                i.__exportStar(s(169), e), i.__exportStar(s(711), e), i.__exportStar(s(336), e), i.__exportStar(s(646), e);
                var r = s(169);
                Object.defineProperty(e, "ContentResolver", {
                    enumerable: !0,
                    get: function () {
                        return i.__importDefault(r).default;
                    },
                });
                var n = s(711);
                Object.defineProperty(e, "Settings", {
                    enumerable: !0,
                    get: function () {
                        return i.__importDefault(n).default;
                    },
                });
                var o = s(336);
                Object.defineProperty(e, "TokenSecurity", {
                    enumerable: !0,
                    get: function () {
                        return i.__importDefault(o).default;
                    },
                });
            },
            163: (t, e, s) => {
                s.r(e),
                    s.d(e, {
                        __assign: () => n,
                        __asyncDelegator: () => I,
                        __asyncGenerator: () => k,
                        __asyncValues: () => E,
                        __await: () => C,
                        __awaiter: () => g,
                        __classPrivateFieldGet: () => A,
                        __classPrivateFieldIn: () => _,
                        __classPrivateFieldSet: () => O,
                        __createBinding: () => f,
                        __decorate: () => a,
                        __esDecorate: () => c,
                        __exportStar: () => v,
                        __extends: () => r,
                        __generator: () => m,
                        __importDefault: () => P,
                        __importStar: () => x,
                        __makeTemplateObject: () => L,
                        __metadata: () => p,
                        __param: () => l,
                        __propKey: () => u,
                        __read: () => b,
                        __rest: () => o,
                        __runInitializers: () => h,
                        __setFunctionName: () => d,
                        __spread: () => w,
                        __spreadArray: () => S,
                        __spreadArrays: () => T,
                        __values: () => y,
                        default: () => $,
                    });
                var i = function (t, e) {
                    return (
                        (i =
                            Object.setPrototypeOf ||
                            ({ __proto__: [] } instanceof Array &&
                                function (t, e) {
                                    t.__proto__ = e;
                                }) ||
                            function (t, e) {
                                for (var s in e) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
                            }),
                            i(t, e)
                    );
                };
                function r(t, e) {
                    if ("function" != typeof e && null !== e) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
                    function s() {
                        this.constructor = t;
                    }
                    i(t, e), (t.prototype = null === e ? Object.create(e) : ((s.prototype = e.prototype), new s()));
                }
                var n = function () {
                    return (
                        (n =
                            Object.assign ||
                            function (t) {
                                for (var e, s = 1, i = arguments.length; s < i; s++) for (var r in (e = arguments[s])) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
                                return t;
                            }),
                            n.apply(this, arguments)
                    );
                };
                function o(t, e) {
                    var s = {};
                    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && e.indexOf(i) < 0 && (s[i] = t[i]);
                    if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                        var r = 0;
                        for (i = Object.getOwnPropertySymbols(t); r < i.length; r++) e.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[r]) && (s[i[r]] = t[i[r]]);
                    }
                    return s;
                }
                function a(t, e, s, i) {
                    var r,
                        n = arguments.length,
                        o = n < 3 ? e : null === i ? (i = Object.getOwnPropertyDescriptor(e, s)) : i;
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, s, i);
                    else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (o = (n < 3 ? r(o) : n > 3 ? r(e, s, o) : r(e, s)) || o);
                    return n > 3 && o && Object.defineProperty(e, s, o), o;
                }
                function l(t, e) {
                    return function (s, i) {
                        e(s, i, t);
                    };
                }
                function c(t, e, s, i, r, n) {
                    function o(t) {
                        if (void 0 !== t && "function" != typeof t) throw new TypeError("Function expected");
                        return t;
                    }
                    for (
                        var a,
                            l = i.kind,
                            c = "getter" === l ? "get" : "setter" === l ? "set" : "value",
                            h = !e && t ? (i.static ? t : t.prototype) : null,
                            u = e || (h ? Object.getOwnPropertyDescriptor(h, i.name) : {}),
                            d = !1,
                            p = s.length - 1;
                        p >= 0;
                        p--
                    ) {
                        var g = {};
                        for (var m in i) g[m] = "access" === m ? {} : i[m];
                        for (var m in i.access) g.access[m] = i.access[m];
                        g.addInitializer = function (t) {
                            if (d) throw new TypeError("Cannot add initializers after decoration has completed");
                            n.push(o(t || null));
                        };
                        var f = (0, s[p])("accessor" === l ? { get: u.get, set: u.set } : u[c], g);
                        if ("accessor" === l) {
                            if (void 0 === f) continue;
                            if (null === f || "object" != typeof f) throw new TypeError("Object expected");
                            (a = o(f.get)) && (u.get = a), (a = o(f.set)) && (u.set = a), (a = o(f.init)) && r.unshift(a);
                        } else (a = o(f)) && ("field" === l ? r.unshift(a) : (u[c] = a));
                    }
                    h && Object.defineProperty(h, i.name, u), (d = !0);
                }
                function h(t, e, s) {
                    for (var i = arguments.length > 2, r = 0; r < e.length; r++) s = i ? e[r].call(t, s) : e[r].call(t);
                    return i ? s : void 0;
                }
                function u(t) {
                    return "symbol" == typeof t ? t : "".concat(t);
                }
                function d(t, e, s) {
                    return "symbol" == typeof e && (e = e.description ? "[".concat(e.description, "]") : ""), Object.defineProperty(t, "name", { configurable: !0, value: s ? "".concat(s, " ", e) : e });
                }
                function p(t, e) {
                    if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(t, e);
                }
                function g(t, e, s, i) {
                    return new (s || (s = Promise))(function (r, n) {
                        function o(t) {
                            try {
                                l(i.next(t));
                            } catch (t) {
                                n(t);
                            }
                        }
                        function a(t) {
                            try {
                                l(i.throw(t));
                            } catch (t) {
                                n(t);
                            }
                        }
                        function l(t) {
                            var e;
                            t.done
                                ? r(t.value)
                                : ((e = t.value),
                                    e instanceof s
                                        ? e
                                        : new s(function (t) {
                                            t(e);
                                        })).then(o, a);
                        }
                        l((i = i.apply(t, e || [])).next());
                    });
                }
                function m(t, e) {
                    var s,
                        i,
                        r,
                        n,
                        o = {
                            label: 0,
                            sent: function () {
                                if (1 & r[0]) throw r[1];
                                return r[1];
                            },
                            trys: [],
                            ops: [],
                        };
                    return (
                        (n = { next: a(0), throw: a(1), return: a(2) }),
                        "function" == typeof Symbol &&
                        (n[Symbol.iterator] = function () {
                            return this;
                        }),
                            n
                    );
                    function a(a) {
                        return function (l) {
                            return (function (a) {
                                if (s) throw new TypeError("Generator is already executing.");
                                for (; n && ((n = 0), a[0] && (o = 0)), o; )
                                    try {
                                        if (((s = 1), i && (r = 2 & a[0] ? i.return : a[0] ? i.throw || ((r = i.return) && r.call(i), 0) : i.next) && !(r = r.call(i, a[1])).done)) return r;
                                        switch (((i = 0), r && (a = [2 & a[0], r.value]), a[0])) {
                                            case 0:
                                            case 1:
                                                r = a;
                                                break;
                                            case 4:
                                                return o.label++, { value: a[1], done: !1 };
                                            case 5:
                                                o.label++, (i = a[1]), (a = [0]);
                                                continue;
                                            case 7:
                                                (a = o.ops.pop()), o.trys.pop();
                                                continue;
                                            default:
                                                if (!((r = o.trys), (r = r.length > 0 && r[r.length - 1]) || (6 !== a[0] && 2 !== a[0]))) {
                                                    o = 0;
                                                    continue;
                                                }
                                                if (3 === a[0] && (!r || (a[1] > r[0] && a[1] < r[3]))) {
                                                    o.label = a[1];
                                                    break;
                                                }
                                                if (6 === a[0] && o.label < r[1]) {
                                                    (o.label = r[1]), (r = a);
                                                    break;
                                                }
                                                if (r && o.label < r[2]) {
                                                    (o.label = r[2]), o.ops.push(a);
                                                    break;
                                                }
                                                r[2] && o.ops.pop(), o.trys.pop();
                                                continue;
                                        }
                                        a = e.call(t, o);
                                    } catch (t) {
                                        (a = [6, t]), (i = 0);
                                    } finally {
                                        s = r = 0;
                                    }
                                if (5 & a[0]) throw a[1];
                                return { value: a[0] ? a[1] : void 0, done: !0 };
                            })([a, l]);
                        };
                    }
                }
                var f = Object.create
                    ? function (t, e, s, i) {
                        void 0 === i && (i = s);
                        var r = Object.getOwnPropertyDescriptor(e, s);
                        (r && !("get" in r ? !e.__esModule : r.writable || r.configurable)) ||
                        (r = {
                            enumerable: !0,
                            get: function () {
                                return e[s];
                            },
                        }),
                            Object.defineProperty(t, i, r);
                    }
                    : function (t, e, s, i) {
                        void 0 === i && (i = s), (t[i] = e[s]);
                    };
                function v(t, e) {
                    for (var s in t) "default" === s || Object.prototype.hasOwnProperty.call(e, s) || f(e, t, s);
                }
                function y(t) {
                    var e = "function" == typeof Symbol && Symbol.iterator,
                        s = e && t[e],
                        i = 0;
                    if (s) return s.call(t);
                    if (t && "number" == typeof t.length)
                        return {
                            next: function () {
                                return t && i >= t.length && (t = void 0), { value: t && t[i++], done: !t };
                            },
                        };
                    throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
                }
                function b(t, e) {
                    var s = "function" == typeof Symbol && t[Symbol.iterator];
                    if (!s) return t;
                    var i,
                        r,
                        n = s.call(t),
                        o = [];
                    try {
                        for (; (void 0 === e || e-- > 0) && !(i = n.next()).done; ) o.push(i.value);
                    } catch (t) {
                        r = { error: t };
                    } finally {
                        try {
                            i && !i.done && (s = n.return) && s.call(n);
                        } finally {
                            if (r) throw r.error;
                        }
                    }
                    return o;
                }
                function w() {
                    for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(b(arguments[e]));
                    return t;
                }
                function T() {
                    for (var t = 0, e = 0, s = arguments.length; e < s; e++) t += arguments[e].length;
                    var i = Array(t),
                        r = 0;
                    for (e = 0; e < s; e++) for (var n = arguments[e], o = 0, a = n.length; o < a; o++, r++) i[r] = n[o];
                    return i;
                }
                function S(t, e, s) {
                    if (s || 2 === arguments.length) for (var i, r = 0, n = e.length; r < n; r++) (!i && r in e) || (i || (i = Array.prototype.slice.call(e, 0, r)), (i[r] = e[r]));
                    return t.concat(i || Array.prototype.slice.call(e));
                }
                function C(t) {
                    return this instanceof C ? ((this.v = t), this) : new C(t);
                }
                function k(t, e, s) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var i,
                        r = s.apply(t, e || []),
                        n = [];
                    return (
                        (i = {}),
                            o("next"),
                            o("throw"),
                            o("return"),
                            (i[Symbol.asyncIterator] = function () {
                                return this;
                            }),
                            i
                    );
                    function o(t) {
                        r[t] &&
                        (i[t] = function (e) {
                            return new Promise(function (s, i) {
                                n.push([t, e, s, i]) > 1 || a(t, e);
                            });
                        });
                    }
                    function a(t, e) {
                        try {
                            (s = r[t](e)).value instanceof C ? Promise.resolve(s.value.v).then(l, c) : h(n[0][2], s);
                        } catch (t) {
                            h(n[0][3], t);
                        }
                        var s;
                    }
                    function l(t) {
                        a("next", t);
                    }
                    function c(t) {
                        a("throw", t);
                    }
                    function h(t, e) {
                        t(e), n.shift(), n.length && a(n[0][0], n[0][1]);
                    }
                }
                function I(t) {
                    var e, s;
                    return (
                        (e = {}),
                            i("next"),
                            i("throw", function (t) {
                                throw t;
                            }),
                            i("return"),
                            (e[Symbol.iterator] = function () {
                                return this;
                            }),
                            e
                    );
                    function i(i, r) {
                        e[i] = t[i]
                            ? function (e) {
                                return (s = !s) ? { value: C(t[i](e)), done: !1 } : r ? r(e) : e;
                            }
                            : r;
                    }
                }
                function E(t) {
                    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                    var e,
                        s = t[Symbol.asyncIterator];
                    return s
                        ? s.call(t)
                        : ((t = y(t)),
                            (e = {}),
                            i("next"),
                            i("throw"),
                            i("return"),
                            (e[Symbol.asyncIterator] = function () {
                                return this;
                            }),
                            e);
                    function i(s) {
                        e[s] =
                            t[s] &&
                            function (e) {
                                return new Promise(function (i, r) {
                                    (function (t, e, s, i) {
                                        Promise.resolve(i).then(function (e) {
                                            t({ value: e, done: s });
                                        }, e);
                                    })(i, r, (e = t[s](e)).done, e.value);
                                });
                            };
                    }
                }
                function L(t, e) {
                    return Object.defineProperty ? Object.defineProperty(t, "raw", { value: e }) : (t.raw = e), t;
                }
                var D = Object.create
                    ? function (t, e) {
                        Object.defineProperty(t, "default", { enumerable: !0, value: e });
                    }
                    : function (t, e) {
                        t.default = e;
                    };
                function x(t) {
                    if (t && t.__esModule) return t;
                    var e = {};
                    if (null != t) for (var s in t) "default" !== s && Object.prototype.hasOwnProperty.call(t, s) && f(e, t, s);
                    return D(e, t), e;
                }
                function P(t) {
                    return t && t.__esModule ? t : { default: t };
                }
                function A(t, e, s, i) {
                    if ("a" === s && !i) throw new TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === s ? i : "a" === s ? i.call(t) : i ? i.value : e.get(t);
                }
                function O(t, e, s, i, r) {
                    if ("m" === i) throw new TypeError("Private method is not writable");
                    if ("a" === i && !r) throw new TypeError("Private accessor was defined without a setter");
                    if ("function" == typeof e ? t !== e || !r : !e.has(t)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
                    return "a" === i ? r.call(t, s) : r ? (r.value = s) : e.set(t, s), s;
                }
                function _(t, e) {
                    if (null === e || ("object" != typeof e && "function" != typeof e)) throw new TypeError("Cannot use 'in' operator on non-object");
                    return "function" == typeof t ? e === t : t.has(e);
                }
                const $ = {
                    __extends: r,
                    __assign: n,
                    __rest: o,
                    __decorate: a,
                    __param: l,
                    __metadata: p,
                    __awaiter: g,
                    __generator: m,
                    __createBinding: f,
                    __exportStar: v,
                    __values: y,
                    __read: b,
                    __spread: w,
                    __spreadArrays: T,
                    __spreadArray: S,
                    __await: C,
                    __asyncGenerator: k,
                    __asyncDelegator: I,
                    __asyncValues: E,
                    __makeTemplateObject: L,
                    __importStar: x,
                    __importDefault: P,
                    __classPrivateFieldGet: A,
                    __classPrivateFieldSet: O,
                    __classPrivateFieldIn: _,
                };
            },
        },
        e = {};
    function s(i) {
        var r = e[i];
        if (void 0 !== r) return r.exports;
        var n = (e[i] = { exports: {} });
        return t[i](n, n.exports, s), n.exports;
    }
    (s.d = (t, e) => {
        for (var i in e) s.o(e, i) && !s.o(t, i) && Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
    }),
        (s.g = (function () {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || new Function("return this")();
            } catch (t) {
                if ("object" == typeof window) return window;
            }
        })()),
        (s.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
        (s.r = (t) => {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 });
        }),
        (() => {
            const t = "button",
                e = "nextStepTrigger",
                i = "tour",
                r = "inProgress",
                n = "closed",
                o = "showProductTour",
                a = "productTourStep",
                l = "ufTag-",
                c = "devkitCurrentChecklist",
                h = "EXAMPLE_USER_ID",
                u = "toursSelection",
                d = "pulsatingPoint",
                p = "questionMark",
                g = "infoPoint",
                m = "premium",
                f = "enterprise",
                v = "tour",
                y = "checklist",
                b = "assistant",
                w = "usetiful:toursEvent",
                T = "usetiful:tourEvent",
                S = "usetiful:checklist.dismissed",
                C = "usetiful:tour.closed",
                k = "usetiful:setDisplay",
                I = "usetiful:initContentLoader",
                E = "usetiful:placeAllButton",
                L = "usetiful:placeInitialTriggers",
                D = "usetiful:setCurrentTour",
                x = "usetiful:listenForRedirect",
                P = "usetiful:stopListeningForRedirect",
                A = "usetiful:goToNextStep",
                O = "usetiful:goToPreviousStep",
                _ = "usetiful:closeTour",
                $ = "usetiful:setTourTriggerToLocalStorage",
                B = "usetiful:moveToStep",
                R = "usetiful:setProgress",
                N = "usetiful:placeNextStepTrigger",
                j = "usetiful:tipHidden",
                M = "usetiful:reportProgress",
                U = "usetiful:pauseContentLoader",
                F = "usetiful:unpauseContentLoader",
                H = "usetiful:reportFormAnswer",
                W = "usetiful:reportError";
            var q = s(107);
            const V = new q.ContentResolver(!1),
                { apiToken: K, sourceFile: J, themePath: z, withDrafts: G, onlyTips: Q, onlyChecklists: X, previewTourId: Y, isDebug: Z, isDev: tt, parser: et } = new q.Settings(V),
                st = null !== window.localStorage.getItem("pauseProductionTour"),
                it = Y > 0,
                rt = {};
            let nt = "";
            if ((K && (nt = "/data.json"), G && (rt.withDrafts = Z.toString()), Q && (rt.onlyTips = Z.toString()), X && (rt.onlyChecklists = Z.toString()), it && (rt.previewTourId = Y.toString()), "" !== nt && Object.keys(rt).length > 0)) {
                const t = new URLSearchParams(rt);
                nt += `?${t.toString()}`;
            }
            const ot = "tours",
                at = "uf_smartTips",
                lt = "checklistsRedirects",
                ct = "checklistsDismiss",
                ht = "uf_completed",
                ut = "uf_triggerTour",
                dt = "uf_manualRedirectURL",
                pt = et.parseHostname(),
                gt = et.parseShortHostname(),
                mt = et.parseProtocol(),
                ft = [ht, ot, lt, ct],
                vt = function (t) {
                    Z && (arguments.length > 1 && void 0 !== arguments[1] && arguments[1] ? console.info(`%c Usetiful: ${t}`, "background: #387DFF; color: #edf3ff") : console.info(`Usetiful: ${t}`));
                },
                yt = (t) => {
                    Z && console.warn(`Usetiful: ${t}`);
                },
                bt = (t) => {
                    Z && console.log(t);
                },
                wt = (t) => {
                    let e = t;
                    try {
                        return !t || t instanceof Object || (e = JSON.parse(t)), e;
                    } catch (t) {
                        vt("Targets field is not JSON.");
                    }
                    return !1;
                };
            function Tt(t, e) {
                const { name: s, showEverytime: i, autoplay: r, trigger: o } = t,
                    a = !i && e.getObjectStatus(s) !== n,
                    l = r && i,
                    c = o && "once-then-manual" === o.type && e.getObjectStatus(s) === n;
                return vt(`manualTourShown = ${a ? a.toString() : ""}, automaticTourShow = ${l ? l.toString() : ""}, showEverytime = ${i ? i.toString() : ""}`), a || l || i || c;
            }
            function St() {
                Ct("clear waiting", "done");
            }
            function Ct(t) {
                let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                window.postMessage && window.postMessage({ type: t, text: e, resource: "USETIFUL_SCRIPT" }, "*");
            }
            const kt = class {
                constructor() {
                    this.instances = {};
                }
                findServices(t) {
                    const e = [];
                    return (
                        t.forEach((t) => {
                            const s = this.get(t);
                            e.push(s);
                        }),
                            e
                    );
                }
                registerClass(t, e) {
                    let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
                    null === this.get(t) && (this.instances[t] = new e(...this.findServices(s)));
                }
                registerConstant(t, e) {
                    null === this.get(t) && (this.instances[t] = e);
                }
                registerFunction(t, e) {
                    let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [];
                    null === this.get(t) && (this.instances[t] = e(...this.findServices(s)));
                }
                get(t) {
                    return Object.prototype.hasOwnProperty.call(this.instances, t) ? this.instances[t] : null;
                }
            };
            var It = s(797);
            const Et = class {
                    constructor() {
                        (this.cookieName = "usetiful-visitor-ident"),
                            (this.cookieLifeTimeDays = 365),
                            (this.isNewVisitor = !1),
                            (this.getIdent = () => {
                                let t = (0, It.getCookie)(this.cookieName);
                                return t || ((t = this.generateUUID()), (this.isNewVisitor = !0), (0, It.setCookie)(this.cookieName, t, this.cookieLifeTimeDays)), t;
                            }),
                            (this.generateUUID = () => {
                                let t = new Date().getTime(),
                                    e = (performance && performance.now && 1e3 * performance.now()) || 0;
                                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
                                    let i = 16 * Math.random();
                                    return t > 0 ? ((i = (t + i) % 16 | 0), (t = Math.floor(t / 16))) : ((i = (e + i) % 16 | 0), (e = Math.floor(e / 16))), ("x" === s ? i : i ? 3 : 8).toString(16);
                                });
                            });
                    }
                },
                Lt = "showSmartTip",
                Dt = "showStep",
                xt = "click",
                Pt = "show",
                At = "redirect",
                Ot = "delay",
                _t = "complete",
                $t = "dismiss",
                Bt = "triggerEvent",
                Rt = "pageAction",
                Nt = "pageLeft",
                jt = "closeTour",
                Mt = "Progressor",
                Ut = "Reports",
                Ft = "PageLeft",
                Ht = Object.freeze({
                    horizontalProgressBar: { title: "Horizontal Progress Bar", key: 1 },
                    dots: { title: "Dots", key: 2 },
                    stepNumber: { title: "Step Number", key: 3 },
                    circleProgressBar: { title: "Circle Progress Bar", key: 4 },
                }),
                Wt = "uf_reports_to_send",
                qt = "POST",
                Vt = "step",
                Kt = "checklist",
                Jt = "checklistItem",
                zt = "autoSegment",
                Gt = "tags",
                Qt = "form",
                Xt = "error";
            var Yt = function (t, e, s, i) {
                    return new (s || (s = Promise))(function (r, n) {
                        function o(t) {
                            try {
                                l(i.next(t));
                            } catch (t) {
                                n(t);
                            }
                        }
                        function a(t) {
                            try {
                                l(i.throw(t));
                            } catch (t) {
                                n(t);
                            }
                        }
                        function l(t) {
                            var e;
                            t.done
                                ? r(t.value)
                                : ((e = t.value),
                                    e instanceof s
                                        ? e
                                        : new s(function (t) {
                                            t(e);
                                        })).then(o, a);
                        }
                        l((i = i.apply(t, e || [])).next());
                    });
                },
                Zt = function (t, e) {
                    var s = {};
                    for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && e.indexOf(i) < 0 && (s[i] = t[i]);
                    if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                        var r = 0;
                        for (i = Object.getOwnPropertySymbols(t); r < i.length; r++) e.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[r]) && (s[i[r]] = t[i[r]]);
                    }
                    return s;
                };
            function te(t) {
                let { type: e, id: s, action: i, actionAt: r, visitorIdent: n, tags: o, debug: a, isDevKit: l } = t;
                return {
                    id: s,
                    type: e,
                    event: { [Lt]: "show", [Dt]: "show", [Pt]: "show", [xt]: "click", [jt]: "close", [At]: "redirect", [Ot]: "delay", [Bt]: "triggerEvent", [Rt]: "pageAction", [_t]: "complete", [$t]: "dismiss" }[i],
                    eventAt: "string" == typeof r ? r : null == r ? void 0 : r.toISOString(),
                    visitorIdent: n,
                    isPreview: a,
                    tags: o,
                    isDevKit: l,
                };
            }
            function ee(t) {
                let { entityId: e, tags: s, questionType: i, question: r, answer: n, formId: o } = t;
                return { formId: o, questionType: i, question: r, answer: n, tags: s, entityId: e, entityType: Vt };
            }
            function se(t) {
                let { entityId: e, entityType: s, tags: i, name: r, text: n, code: o, url: a, spaceId: l } = t;
                return { spaceId: l, text: n, name: r, code: o, url: a, tags: i, entityId: e.toString(), entityType: s };
            }
            function ie(t) {
                var { actionAt: e } = t,
                    s = Zt(t, ["actionAt"]);
                return delete s.tags, Object.assign(Object.assign({}, s), { actionAt: null == e ? void 0 : e.toString() });
            }
            const re = class {
                    constructor(t, e, s, i) {
                        var r = this;
                        (this.batchSize = 10),
                            (this.minSendInterval = 1e4),
                            (this.maxSendInterval = 6e4),
                            (this.sendIntervalId = null),
                            (this.syncToLS = () => {
                                window.localStorage.setItem(Wt, JSON.stringify(this.data));
                            }),
                            (this.getLSData = () => {
                                const t = window.localStorage.getItem(Wt),
                                    e = t ? JSON.parse(t) : [];
                                return this.data && this.data.length > 0 ? this.data : e;
                            }),
                            (this.add = (t) =>
                                Yt(this, void 0, void 0, function* () {
                                    const e = this.getLSData(),
                                        s = yield this.usetifulTags.getTags(),
                                        i = Object.assign(Object.assign({}, t), { actionAt: new Date().toISOString(), visitorIdent: this.visitor.getIdent(), debug: !!this.debug, tags: s });
                                    var r, n;
                                    (e.length >= 1 && ((r = t), (n = e[e.length - 1]), !["entityId", "stepIndex", "id", "action", "question", "answer", "name"].find((t) => r[t] !== n[t]))) || (this.data.push(i), this.send());
                                })),
                            (this.send = function () {
                                let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                                r.syncToLS();
                                const e = r.getLSData(),
                                    s = e.length && t,
                                    i = new Date().getMilliseconds();
                                if (!s && (e.length < r.batchSize || i < r.nextPossibleSend)) return;
                                const n = e.filter((t) => t.action !== Lt && t.type !== Jt && t.type !== Kt && t.reportType !== Qt && t.reportType !== Xt).map(ie),
                                    o = e.filter((t) => !t.reportType && t.action !== Nt).map(te),
                                    a = e.filter((t) => t.reportType === Qt).map(ee),
                                    l = e.filter((t) => t.reportType === Xt).map(se);
                                (r.nextPossibleSend = new Date().getMilliseconds() + r.minSendInterval),
                                    r.reschedule(),
                                n.length && r.api.post("/report", n),
                                o.length && r.reporterApi.postWithoutResponse(`${pt}${r.reporterApi.basePath}/entity-events/`, o, !0),
                                r.debug ||
                                (a.length &&
                                a.forEach((t) => {
                                    r.reporterApi.postWithoutResponse(`${pt}${r.reporterApi.basePath}/form-answers/`, t, !0);
                                }),
                                l.length &&
                                l.forEach((t) => {
                                    r.reporterApi.postWithoutResponse(`${pt}${r.reporterApi.basePath}/console-errors/`, t, !0);
                                })),
                                    r.clearData();
                            }),
                            (this.clearData = () => {
                                (this.data = []), this.syncToLS();
                            }),
                            (this.reschedule = () => {
                                this.sendIntervalId && clearInterval(this.sendIntervalId), (this.sendIntervalId = setInterval(() => this.send(!0), this.maxSendInterval));
                            }),
                            (this.beforeunloadEvent = () => {
                                this.send(!0);
                            }),
                            (this.init = () => {
                                this.beforeUnload.setAction(Ut, this.beforeunloadEvent), this.reschedule();
                            }),
                            (this.destroy = () => {
                                this.beforeUnload.removeAction(Ut), clearInterval(this.sendIntervalId);
                            }),
                            (this.api = t),
                            (this.reporterApi = e),
                            (this.usetifulTags = s),
                            (this.debug = Z),
                            (this.data = this.getLSData().length > 0 ? this.getLSData() : []),
                            this.syncToLS(),
                            (this.visitor = new Et()),
                            (this.beforeUnload = i);
                    }
                },
                ne = navigator.userAgent.indexOf("Opera") > -1,
                oe = navigator.userAgent.indexOf("Firefox") > -1,
                ae = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
                le = !!document.documentMode,
                ce = !le && !!window.StyleMedia,
                he = !ne && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
                ue = (he || ne) && !!window.CSS;
            const de = class {
                    constructor(t) {
                        let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "api-space";
                        (this.apiToken = t), (this.basePath = e);
                    }
                    request(t, e) {
                        let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                            i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];
                        const r = new XMLHttpRequest();
                        return (
                            r.open(t, `${pt}${this.basePath}${e}`, i),
                                r.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
                                r.setRequestHeader("Content-Type", "application/json; charset=utf-8"),
                                r.setRequestHeader("X-AUTH-TOKEN", this.apiToken),
                                null !== s ? r.send(JSON.stringify(s)) : r.send(),
                                r
                        );
                    }
                    requestWithPromise(t, e) {
                        let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                            i = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3];
                        return new Promise((r, n) => {
                            const o = this.request(t, e, s, i);
                            (o.onload = (t) => {
                                let {
                                    currentTarget: { status: e, response: s },
                                } = t;
                                e >= 200 && e < 300 ? r(s) : n();
                            }),
                                (o.onerror = () => {
                                    n();
                                });
                        });
                    }
                    get(t, e) {
                        return this.request("GET", t, e);
                    }
                    post(t, e) {
                        return this.request(qt, t, e);
                    }
                    postWithoutResponse(t) {
                        let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                            s = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                            i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
                        e &&
                        fetch(t, { keepalive: !0, method: qt, headers: Object.assign(Object.assign({ "Content-Type": "application/json" }, s ? { "X-AUTH-TOKEN": this.apiToken } : {}), i), body: JSON.stringify(e) }).catch((t) => {
                            if ("AbortError" === t.name) console.log("Fetch request was aborted");
                            else {
                                if (oe && "NetworkError when attempting to fetch resource." === t.message) return;
                                console.error("Fetch error:", t);
                            }
                        });
                    }
                },
                pe = (t) => {
                    let e = t.name;
                    t.tourId ? (e = T) : t.isToursContext && (e = w);
                    const s = new CustomEvent(e, { detail: { event: t.name, tourId: t.tourId, isToursContext: t.isToursContext, props: t.details } });
                    return document.dispatchEvent(s), vt(`Event name ${t.name} send to entityID: ${t.tourId}, toursContext: ${t.isToursContext}, and details ${t.details}`), s;
                };
            const ge = class {
                constructor(t) {
                    var e = this;
                    (this.activeTriggers = "[]"),
                        (this.clearTourTriggerAfterDelay = function (t) {
                            let s = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                                i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1500;
                            s && pe({ isToursContext: !0, name: x }),
                                setTimeout(() => {
                                    window.usetiful_isAboutToRefresh ? s && (pe({ isToursContext: !0, name: P }), (window.usetiful_isAboutToRefresh = null)) : e.removeTriggerFromLocalStorage(t);
                                }, i);
                        }),
                        (this.storage = t);
                    const s = this.storage.getItem(ut);
                    s ? this.setTriggers(s) : this.setTriggers("[]"), (this.tourTriggerFromURL = -1), (this.stepTriggerFromURL = -1);
                }
                getTriggers() {
                    return this.updateTriggers(), this.activeTriggers;
                }
                setTriggers(t) {
                    t && (this.activeTriggers = t);
                }
                updateTriggers() {
                    const t = this.storage.getItem(ut);
                    this.setTriggers(t);
                }
                hasTourTrigger(t) {
                    const e = this.getTriggers(),
                        s = JSON.parse(e);
                    return !!s && s.includes(t);
                }
                removeAllTriggersFromLocalStorage() {
                    this.storage.removeItem(ut), this.setTriggers("[]");
                }
                removeTriggerFromLocalStorage(t) {
                    const e = this.getTriggers(),
                        s = JSON.parse(e);
                    if (s) {
                        if (s.indexOf(t) >= 0) {
                            const e = s.filter((e) => e !== t);
                            e.length > 0 ? (this.storage.setItem(ut, JSON.stringify(e)), this.setTriggers(JSON.stringify(e))) : this.removeAllTriggersFromLocalStorage();
                        }
                    }
                }
                setTourTriggerToLocalStorage(t) {
                    let e = [];
                    const s = this.getTriggers(),
                        i = JSON.parse(s);
                    i && (e = i.filter((e) => e !== t)), e.push(t), e.length > 0 && (this.setTriggers(JSON.stringify(e)), this.storage.setItem(ut, JSON.stringify(e)));
                }
                hasTourTriggerInUrl() {
                    try {
                        this.tourTriggerFromURL = -1;
                        const t = window.location.search,
                            e = new URLSearchParams(t),
                            s = e.get(o);
                        if (s) {
                            const t = e.entries();
                            for (const [e, s] of t)
                                if (e.startsWith(l)) {
                                    const t = e.replace(l, "");
                                    window.usetifulTags || (window.usetifulTags = {}), (window.usetifulTags[t] = s);
                                }
                            this.tourTriggerFromURL = Number(s);
                            const i = e.get(a);
                            i && (this.stepTriggerFromURL = Number(i));
                        }
                        return -1 !== this.tourTriggerFromURL;
                    } catch (t) {
                        return !1;
                    }
                }
                checkTourTriggers() {
                    if (this.hasTourTriggerInUrl()) {
                        const t = this.tourTriggerFromURL;
                        this.removeAllTriggersFromLocalStorage(), this.setTourTriggerToLocalStorage(t);
                    }
                }
            };
            let me = window.location.href;
            const fe = "onPageChange",
                ve = "onElementHide",
                ye = () => {
                    const t = new CustomEvent(fe);
                    vt("change url event call"), window.dispatchEvent(t);
                },
                be = (t, e, i) =>
                    s.g.setInterval(
                        () =>
                            ((t, e, s) => {
                                var i;
                                let r = document.body;
                                if ((s && (r = null === (i = null === document || void 0 === document ? void 0 : document.querySelector(s)) || void 0 === i ? void 0 : i.shadowRoot), r && !r.contains(t))) {
                                    const t = new CustomEvent(ve, { detail: e });
                                    window.dispatchEvent(t);
                                }
                            })(t, e, i),
                        500
                    ),
                we = (t) => clearInterval(t),
                Te = () =>
                    setInterval(() => {
                        return (t = window.location.href) !== me && (ye(), (me = t)), void (me = window.location.href);
                        var t;
                    }, 500);
            const Se = class {
                constructor(t, e) {
                    (this.afterLoaded = (t, e) => {
                        t(e),
                            window.addEventListener(fe, () => {
                                vt("call page change event"), this.beforeUnload.beforeUnloadListener(), t(e);
                            });
                    }),
                        (this.loadConfig = (t) => {
                            if (new q.TokenSecurity(K).validate())
                                if (st) vt("Script is paused by plugin");
                                else {
                                    const e = this.api.get(nt);
                                    (e.onload = (e) => {
                                        let {
                                            currentTarget: { status: s, response: i },
                                        } = e;
                                        if ((Te(), s >= 200 && s < 400)) {
                                            const e = JSON.parse(i);
                                            this.afterLoaded(t, e);
                                        }
                                    }),
                                        (e.onerror = () => {
                                            yt("Usetiful: connection error");
                                        });
                                }
                            else console.error(`The usetiful token "${K}" has invalid format. Please check if you have inserted the script correctly.`);
                        }),
                        (this.loadCriticalCss = () => {
                            const t = document.getElementsByTagName("head")[0],
                                e = document.createElement("style");
                            (e.innerHTML = "[data-uf-content] {display: none}"), t.appendChild(e);
                        }),
                        (this.loadTheme = (t, e) =>
                            new Promise((e) => {
                                let s = t;
                                const i = document.querySelector(`link[href="${s}"]`);
                                if (null === i || i.getAttribute("href") !== s) {
                                    const t = document.getElementsByTagName("head")[0],
                                        i = document.createElement("link");
                                    (i.rel = "stylesheet"), (i.type = "text/css"), (i.href = s), (i.onload = () => e(s)), t.appendChild(i);
                                } else e(s);
                            })),
                        (this.api = t),
                        (this.beforeUnload = e);
                }
            };
            const Ce = class {
                    constructor() {
                        (this.init = () => {
                            this.isListenerPlaced || this.placeListener();
                        }),
                            (this.beforeUnloadListener = () => {
                                vt("beforeUnloadListener event called"),
                                    this.actions.forEach((t, e) => {
                                        t && (2 === e ? setTimeout(() => t(), 1) : t());
                                    });
                            }),
                            (this.placeListener = () => {
                                this.isListenerPlaced || (window.addEventListener("beforeunload", this.beforeUnloadListener), (this.isListenerPlaced = !0));
                            }),
                            (this.removeListener = () => {
                                this.isListenerPlaced && (window.removeEventListener("beforeunload", this.beforeUnloadListener), (this.isListenerPlaced = !1));
                            }),
                            (this.setAction = (t, e) => {
                                switch (t) {
                                    case Ft:
                                        this.actions[0] = e;
                                        break;
                                    case Ut:
                                        this.actions[1] = e;
                                        break;
                                    case Mt:
                                        this.actions[2] = e;
                                }
                            }),
                            (this.removeAction = (t) => {
                                this.setAction(t, () => {});
                            }),
                            (this.destroy = () => {
                                this.removeListener(), (this.actions = new Array(3));
                            }),
                            (this.isListenerPlaced = !1),
                            (this.actions = new Array(3));
                    }
                },
                ke = `${mt}${tt ? "progressor-" : "progressor."}${gt}`;
            const Ie = class {
                    constructor(t, e, s, i) {
                        let r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "api";
                        (this.loadedUserData = {}),
                            (this.dataChanged = !1),
                            (this.beforeunloadEvent = (t) => {
                                this.saveToApi(t);
                            }),
                            (this.apiToken = t),
                            (this.basePath = r),
                            (this.usetifulTags = e),
                            (this.beforeUnload = s),
                            (this.api = i),
                            this.loadFromApi();
                    }
                    init() {
                        this.setSaveInterval(), this.setUnloadListener();
                    }
                    destroy() {
                        this.beforeUnload.removeAction(Mt), clearInterval(this.sendIntervalId);
                    }
                    request(t, e) {
                        let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
                            i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                        const r = new XMLHttpRequest();
                        if ((r.open(t, `${ke}${this.basePath}/${e}`, i), r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), null !== s ? r.send(JSON.stringify(s)) : r.send(), 200 === r.status)) {
                            const { responseText: t } = r;
                            return JSON.parse(t);
                        }
                    }
                    getUserId() {
                        return this.usetifulTags.getUserId();
                    }
                    loadFromApi() {
                        const t = this.getUserId();
                        if (null === t) return;
                        const e = { userId: t, accountToken: this.apiToken },
                            s = this.request(qt, "get", e);
                        s && "string" == typeof s && ((this.loadedUserData = JSON.parse(s)), this.addAutoSegmentToUsetifulTags(), this.addUserTagsToUsetifulTags());
                    }
                    getUserData(t) {
                        return this.isLoadedDataSameAsLS(), Object.prototype.hasOwnProperty.call(this.loadedUserData, t) ? this.loadedUserData[t] : null;
                    }
                    saveUserData(t, e) {
                        null !== this.getUserId() && ("object" != typeof this.loadedUserData && (this.loadedUserData = {}), (this.loadedUserData[t] = e), (this.dataChanged = !0));
                    }
                    saveToApi(t) {
                        if (this.dataChanged) {
                            const e = {};
                            ft.forEach((t) => {
                                e[t] = window.localStorage.getItem(t) || "[]";
                            }),
                                (e[zt] = this.loadedUserData[zt]),
                                (e[Gt] = this.loadedUserData[Gt]);
                            const s = { userId: t, accountToken: this.apiToken, data: e };
                            this.api.postWithoutResponse(`${ke}${this.basePath}/save`, s, !1, { "x-requested-with": "XMLHttpRequest" }), (this.dataChanged = !1);
                        }
                    }
                    setSaveInterval() {
                        this.sendIntervalId = setInterval(() => {
                            const t = this.getUserId();
                            null !== t && this.saveToApi(t);
                        }, 1e4);
                    }
                    setUnloadListener() {
                        this.beforeUnload.setAction(Mt, () => {
                            const t = this.getUserId();
                            null !== t && this.beforeunloadEvent(t);
                        });
                    }
                    isLoadedDataSameAsLS() {
                        let t = !0;
                        const e = Object.keys(this.loadedUserData),
                            s = [];
                        return (
                            e.forEach((e) => {
                                this.loadedUserData[e] !== window.localStorage.getItem(e) && (t = !1),
                                s.length > 0 && console.warn(`Usetiful: Data from progressor and local storage are not equal for these keys: '${s.toString()}. It may result in wrong progress state.'`);
                            }),
                                t
                        );
                    }
                    addAutoSegmentToUsetifulTags() {
                        const t = this.getUserData(zt);
                        null !== t && (window.usetifulTags[zt] = t);
                    }
                    addUserTagsToUsetifulTags() {
                        const t = this.getUserData(Gt);
                        if (null === t) return;
                        JSON.parse(t).forEach((t) => {
                            window.usetifulTags[t.key] = t.value;
                        });
                    }
                },
                Ee = function () {
                    let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                        e = !1;
                    return (
                        ((s) => {
                            const i = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(s),
                                r =
                                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                                        s
                                    ) ||
                                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                                        s.substr(0, 4)
                                    );
                            (t ? i : r) && (e = !0);
                        })(navigator.userAgent || navigator.vendor || window.opera),
                            e
                    );
                },
                Le = Ee(),
                De = Ee(!0),
                xe = !De && !Le;
            var Pe = function (t, e, s, i) {
                return new (s || (s = Promise))(function (r, n) {
                    function o(t) {
                        try {
                            l(i.next(t));
                        } catch (t) {
                            n(t);
                        }
                    }
                    function a(t) {
                        try {
                            l(i.throw(t));
                        } catch (t) {
                            n(t);
                        }
                    }
                    function l(t) {
                        var e;
                        t.done
                            ? r(t.value)
                            : ((e = t.value),
                                e instanceof s
                                    ? e
                                    : new s(function (t) {
                                        t(e);
                                    })).then(o, a);
                    }
                    l((i = i.apply(t, e || [])).next());
                });
            };
            const Ae = class {
                constructor(t) {
                    (this.reportDataPrivacy = 0),
                        (this.setReportDataPrivacy = (t) => {
                            this.reportDataPrivacy = t;
                        }),
                        (this.api = t);
                }
                getTags() {
                    return Pe(this, void 0, void 0, function* () {
                        const { usetifulTags: t } = window,
                            e = Object.fromEntries(
                                Object.entries(t || {}).filter((t) => {
                                    let [e, s] = t;
                                    return "userId" === e || (null != s && "" !== s);
                                })
                            ),
                            s = "object" == typeof t ? e : {};
                        return (
                            s.autoGeneratedTags && delete s.autoGeneratedTags,
                                3 === this.reportDataPrivacy
                                    ? s
                                    : 1 === this.reportDataPrivacy
                                        ? Object.fromEntries(
                                            Object.entries(s).filter((t) => {
                                                let [e] = t;
                                                return "userId" === e;
                                            })
                                        )
                                        : 2 === this.reportDataPrivacy
                                            ? Object.fromEntries(
                                                Object.entries(s).filter((t) => {
                                                    let [e] = t;
                                                    return "userId" !== e;
                                                })
                                            )
                                            : 4 === this.reportDataPrivacy
                                                ? Object.assign({}, yield this.getAutoGenTags())
                                                : 5 === this.reportDataPrivacy
                                                    ? Object.assign(Object.assign({}, s), yield this.getAutoGenTags())
                                                    : {}
                        );
                    });
                }
                getTag(t) {
                    const { usetifulTags: e } = window;
                    return e && Object.prototype.hasOwnProperty.call(e, t) ? e[t] : null;
                }
                getUserId() {
                    const t = this.getTag("userId");
                    return t && t !== h ? t.toString() : null;
                }
                getAutoGenTags() {
                    return new Promise((t) => {
                        if ((window.usetifulTags || (window.usetifulTags = {}), window.usetifulTags.autoGeneratedTags && window.usetifulTags.autoGeneratedTags.country)) t(window.usetifulTags.autoGeneratedTags);
                        else {
                            const e = this.api.get("/geoip"),
                                s = Object.assign(
                                    Object.assign(
                                        {},
                                        (() => {
                                            const t = navigator.userAgent;
                                            let e,
                                                s = t.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                                            if (/trident/i.test(s[1])) return (e = /\brv[ :]+(\d+)/g.exec(t) || []), { browserName: "IE", browserVersion: e[1] || "" };
                                            if ("Chrome" === s[1] && ((e = t.match(/\bOPR|Edge\/(\d+)/)), null != e)) return { browserName: "Opera", browserVersion: e[1] };
                                            (s = s[2] ? [s[1], s[2]] : [navigator.appName, navigator.appVersion, "-?"]), (e = t.match(/version\/(\d+)/i)), null != e && s.splice(1, 1, e[1]);
                                            const i = { browserName: s[0], browserVersion: s[1] };
                                            return ne
                                                ? Object.assign(Object.assign({}, i), { browserName: "Opera" })
                                                : oe
                                                    ? Object.assign(Object.assign({}, i), { browserName: "Firefox" })
                                                    : ae
                                                        ? Object.assign(Object.assign({}, i), { browserName: "Safari" })
                                                        : le
                                                            ? Object.assign(Object.assign({}, i), { browserName: "IE" })
                                                            : ce
                                                                ? Object.assign(Object.assign({}, i), { browserName: "Edge" })
                                                                : he
                                                                    ? Object.assign(Object.assign({}, i), { browserName: "Chrome" })
                                                                    : ue
                                                                        ? Object.assign(Object.assign({}, i), { browserName: "Blink" })
                                                                        : i;
                                        })()
                                    ),
                                    {
                                        browserLanguage: window.navigator.userLanguage || window.navigator.language,
                                        deviceType: Le ? "Mobile" : De ? "Tablet" : "Desktop",
                                        screenSize: `${window.screen.width} x ${window.screen.height}`,
                                        domain: window.location.hostname,
                                        url: window.location.href,
                                    }
                                );
                            e.onload = (e) => {
                                let {
                                    currentTarget: { status: i, response: r },
                                } = e;
                                i >= 200 && i < 400 ? ((window.usetifulTags.autoGeneratedTags = Object.assign({ country: JSON.parse(r).country }, s)), t(window.usetifulTags.autoGeneratedTags)) : t(Object.assign({ country: "unknown" }, s));
                            };
                        }
                    });
                }
            };
            const Oe = class {
                constructor(t) {
                    (this.parseBoolean = (t) => !0 === (t && "string" == typeof t ? JSON.parse(t) : t)),
                        (this.saveToStorage = () => {
                            const t = localStorage.getItem(this.getLocalStorageKey());
                            this.progressorApi.saveUserData(this.getLocalStorageKey(), t);
                        }),
                        (this.progressorApi = t),
                        (this.alreadyParsed = !1),
                        (this.checklistData = []),
                        this.processParseData();
                }
                getLocalStorageKey() {
                    return ct;
                }
                processParseData() {
                    if (this.alreadyParsed) return;
                    const t = this.progressorApi.getUserData(this.getLocalStorageKey());
                    if (t && "string" == typeof t) {
                        const e = JSON.parse(t);
                        this.saveToLocalStorage(e), (this.checklistData = e);
                    } else this.loadFromLocalStorage(), this.saveToStorage();
                    this.alreadyParsed = !0;
                }
                loadFromLocalStorage() {
                    const t = localStorage.getItem(this.getLocalStorageKey());
                    t && (this.checklistData = JSON.parse(t));
                }
                isChecklistDismiss() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                    if (t && this.checklistData && this.checklistData.length > 0) {
                        const e = this.checklistData.find((e) => e.id === t);
                        if (e) return this.parseBoolean(e.value);
                    }
                    return !1;
                }
                clearParsedData() {
                    (this.checklistData = []), (this.alreadyParsed = !1);
                }
                isAllChecklistsDismissed(t) {
                    let e = !0;
                    for (const s of t) {
                        const { id: t } = s;
                        this.isChecklistDismiss(t) || (e = !1);
                    }
                    return e;
                }
                setDismissValue(t) {
                    let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
                    if (e) {
                        void 0 !== this.checklistData.find((t) => t.id === e)
                            ? (this.checklistData = this.checklistData.map((s) => (s.id === e ? Object.assign(Object.assign({}, s), { value: t }) : s)))
                            : this.checklistData.push({ id: e, value: t }),
                            this.saveToLocalStorage(this.checklistData),
                            this.saveToStorage();
                    }
                }
                saveToLocalStorage(t) {
                    localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(t));
                }
            };
            var _e = s(727);
            const $e = {
                    overlay: "overlay",
                    top: "top",
                    left: "left",
                    right: "right",
                    bottom: "bottom",
                    visible: "visible",
                    bubble: "bubble",
                    bubbleContent: "bubble-content",
                    bubbleContentWithoutTitle: "bubble-content--without-title",
                    beacon: "beacon",
                    beaconAround: "beacon__around",
                    beaconIconic: "beacon__iconic",
                    beaconIconicQuestion: "beacon__iconic-question",
                    beaconIconicInformation: "beacon__iconic-information",
                    bubbleInvisible: "bubble--invisible",
                    modal: "modal",
                    modalInner: "modal-inner",
                    dotProgressBPadding: "dot-progress--bpadding",
                    circleProgressBPadding: "circle-progress--bpadding",
                    title: "title",
                    titleWithoutProgress: "title--without-progress",
                    titleWithoutContent: "title--without-content",
                    contentWithDescription: "content--with-description",
                    description: "description",
                    slideout: "slideout",
                    slideoutInner: "slideout-inner",
                    articleInner: "article-inner",
                    actions: "actions",
                    searchBox: "search-box",
                    searchResults: "search-results",
                    actionsPaddingAround: "actions--padding-around",
                    redirect: "redirect",
                    delay: "delay",
                    redirectInner: "redirect-inner",
                    triggerEventInner: "trigger-event-inner",
                    pageActionInner: "page-action-inner",
                    buttonMain: "button-main",
                    buttonMainTourSelection: "button-selection",
                    buttonMainLeft: "button-main--left",
                    tourSelection: "tour-selection",
                    button: "button",
                    buttonIcon: "button-icon",
                    buttonIconRight: "button-icon--right",
                    buttonBlock: "btn-block",
                    buttonPrimary: "button-primary",
                    buttonClose: "close-button",
                    buttonBack: "back-button",
                    buttonGroup: "button-group",
                    badge: "badge",
                    badgeFree: "free-badge",
                    spaceMaker: "space-maker",
                    spaceMakerPlus: "space-maker--plus",
                    spaceMakerDouble: "space-maker--double",
                    done: "done",
                    content: "content",
                    contentWithoutTitle: "content--without-title",
                    feedback: "feedback",
                    reaction: "reaction",
                    feedbackTitle: "feedback-title",
                    npsTitles: "feedback-nps-titles",
                    inProgress: "inprogress",
                    progress: "progress",
                    progressValue: "progress-value",
                    dotProgress: "dot-progress",
                    dotProgressRight: "dot-progress--right",
                    dotProgressCenter: "dot-progress--center",
                    dotProgressLeft: "dot-progress--left",
                    dotProgressFree: "dot-progress--free",
                    dotProgressItem: "dot-progress__item",
                    dotProgressActiveItem: "dot-progress__item--active",
                    circleProgress: "circle-progress",
                    circleProgressRight: "circle-progress--right",
                    circleProgressLeft: "circle-progress--left",
                    circleProgressCenter: "circle-progress--center",
                    circleProgressFree: "circle-progress--free",
                    circleProgressInner: "circle-progress__inner",
                    circleProgressBar: "circle-progress__bar",
                    circleProgressBarLeft: "circle-progress__bar--left",
                    circleProgressBarRight: "circle-progress__bar--right",
                    circleProgressProgress: "circle-progress__progress",
                    numberProgress: "number-progress",
                    numberProgressRight: "number-progress--right",
                    numberProgressLeft: "number-progress--left",
                    numberProgressCenter: "number-progress--center",
                    numberProgressFree: "number-progress--free",
                    numberProgressDivider: "number-progress__divider",
                    progressTop: "progress--top",
                    progressBottom: "progress--bottom",
                    progressbar: "progress-bar",
                    notification: "notification",
                    notificationInner: "notification-inner",
                    notificationSearchInner: "notification-inner--search",
                    static: "static",
                    alert: "alert",
                    preview: "preview",
                    pointer: "pointer",
                    bottomAction: "bottom-action",
                    svgIcon: "svg-icon",
                    textLeft: "text-left",
                    textRight: "text-right",
                    scrollable: "scrollable",
                    congratulation: "congratulation",
                    errorShake: "error-shake",
                    formFieldset: "form-fieldset",
                    formQuestion: "form-question",
                    validationAlert: "validation-alert",
                    error: "error",
                },
                Be = ["overlay", "pointer"],
                Re = ["svg-icon"],
                Ne = (t, e) => {
                    const s = {};
                    return (
                        Object.keys($e).forEach((i) => {
                            Re.includes(i) ? (s[i] = $e[i]) : (s[i] = `${Be.includes(i) ? e : t}-${$e[i]}`);
                        }),
                            s
                    );
                },
                je = function () {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                    return (0, _e.getClasses)("uf", Ne, (0, _e.getThemeHashFromURL)(t));
                },
                Me = "ufp",
                Ue = (0, _e.getClasses)("uf", Ne),
                Fe = ((0, _e.getClasses)(Me, Ne), "pointer"),
                He = "modal",
                We = "slideout",
                qe = "redirect",
                Ve = "delay",
                Ke = "triggerEvent",
                Je = "pageAction",
                ze = "bottom",
                Ge = "fill",
                Qe = "click",
                Xe = "jsEvent",
                Ye = "webhook",
                Ze = "next",
                ts = "previous",
                es = "jump",
                ss = "goto",
                is = "gototour",
                rs = "close",
                ns = "Primary";
            function os(t, e) {
                t &&
                t.width &&
                e.setAttribute(
                    "style",
                    (function (t) {
                        return t && t.width ? `max-width: 100%; width: ${t.width}px; min-width: auto;` : "";
                    })(t)
                );
            }
            function as(t, e) {
                if (t && t.classes) {
                    t.classes.split(" ").forEach((t) => {
                        t && e.classList.add(t);
                    });
                }
            }
            const ls = /^UsetifulShadowDom\([^)]*\) /,
                cs = (t) => {
                    let e = !0;
                    if (!t) return !1;
                    ls.test(t) && (t = t.replace(ls, ""));
                    try {
                        document.createDocumentFragment().querySelector(t);
                    } catch (t) {
                        e = !1;
                    }
                    return e;
                },
                hs = (t) => {
                    var e;
                    if (t)
                        try {
                            const s = t.match(ls);
                            let i = s ? s[0] : void 0;
                            if (!i) return document.querySelector(t);
                            (i = i.replace("UsetifulShadowDom(", "")), (i = i.substring(0, i.length - 2));
                            const r = null === document || void 0 === document ? void 0 : document.querySelector(i);
                            return null === (e = null == r ? void 0 : r.shadowRoot) || void 0 === e ? void 0 : e.querySelector(ds(t));
                        } catch (e) {
                            console.error(`Usetiful: Your Usetiful content leads to an incorrect element selector ${t}. Please check it out inside the editor.`);
                        }
                },
                us = (t) => {
                    var e;
                    if (t)
                        try {
                            const s = t.match(ls);
                            let i = s ? s[0] : void 0;
                            if (!i) return document.querySelectorAll(t);
                            (i = i.replace("UsetifulShadowDom(", "")), (i = i.substring(0, i.length - 2));
                            const r = null === document || void 0 === document ? void 0 : document.querySelector(i);
                            return null === (e = null == r ? void 0 : r.shadowRoot) || void 0 === e ? void 0 : e.querySelectorAll(ds(t));
                        } catch (e) {
                            console.error(`Usetiful: Your Usetiful content leads to an incorrect element selector ${t}. Please check it out inside the editor.`);
                        }
                },
                ds = (t) => t.replace(ls, ""),
                ps = (t) => {
                    const e = t.match(ls),
                        s = e ? e[0] : void 0;
                    let i;
                    return s && ((i = s.replace("UsetifulShadowDom(", "")), (i = i.substring(0, i.length - 2))), { shadowDomSelector: i, childSelector: ds(t), isAShadowDomSelector: Boolean(s) };
                },
                gs = "attr changing",
                ms = (t, e) => null !== t && e in t,
                fs = (t, e) => t && ms(t, "nodeName") && t.nodeName.toLowerCase() === e,
                vs = (t) => {
                    var e;
                    vt("called destroyElement"), t instanceof HTMLElement && (null === (e = t.parentNode) || void 0 === e || e.removeChild(t));
                },
                ys = (t) => {
                    const e = hs(t);
                    e instanceof HTMLElement && (vt(`called destroyElementBySelector ${t}`), vs(e));
                },
                bs = (t, e) => null !== t.closest(ds(e)),
                ws = (t) => !((t && t.offsetWidth) || (null == t ? void 0 : t.offsetHeight) || (null == t ? void 0 : t.getClientRects().length)),
                Ts = (t, e, s) => {
                    let i = null;
                    if ((t && (i = hs(t)), !i && e && (i = hs(e)), !i && s && (i = s), !i)) return !0;
                    let r = i;
                    for (; r; ) {
                        const t = window.getComputedStyle(r);
                        if ("none" === t.display) return !0;
                        if (t.visibility && "visible" !== t.visibility) return console.log(r, `visi: ${t.visibility}`), !0;
                        if ("0" === t.opacity) return !0;
                        if ((r === i || (r !== i && "hidden" === t.overflow)) && (0 === r.offsetWidth || 0 === r.offsetHeight || 0 === r.getClientRects().length)) return !0;
                        r = r.parentElement;
                    }
                    return !1;
                };
            var Ss,
                Cs,
                ks,
                Is,
                Es,
                Ls = function (t, e, s, i) {
                    if ("a" === s && !i) throw new TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === s ? i : "a" === s ? i.call(t) : i ? i.value : e.get(t);
                };
            (Ss = new WeakMap()), (Cs = new WeakMap()), (ks = new WeakMap()), (Is = new WeakMap()), (Es = new WeakMap());
            const Ds = class {
                constructor() {
                    var t = this;
                    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                        s = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                    (this.createWrapper = (t) => {
                        const e = document.createElement("div");
                        return t && e.classList.add(t), e;
                    }),
                        (this.setTheme = (t) => {
                            this.themeClasses = je(t);
                        }),
                        (this.setIsWatermark = (t) => {
                            this.isWatermark = t;
                        }),
                        (this.appendButtonDataAttributes = (t) => {
                            t.classList.contains(this.themeClasses.button) && (t.dataset.ufButton = "button"),
                            t.classList.contains(this.themeClasses.buttonPrimary) && (t.dataset.ufButton = "button-primary"),
                            t.classList.contains(this.themeClasses.buttonClose) && (t.dataset.ufButton = "close"),
                            t.classList.contains(this.themeClasses.buttonMain) && (t.dataset.ufButton = "button-main");
                        }),
                        (this.createButton = function (e) {
                            let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                            const i = document.createElement("button");
                            return (i.type = "button"), (i.innerHTML = (0, q.replaceTags)(e)), "" !== s && i.classList.add(s), t.appendButtonDataAttributes(i), i;
                        }),
                        (this.createLink = function (e) {
                            let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t.themeClasses.button,
                                i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "#";
                            const r = document.createElement("a");
                            return r.setAttribute("href", i), (r.innerHTML = e), "" !== s && r.classList.add(s), t.appendButtonDataAttributes(r), r;
                        }),
                        (this.createTitle = function (e, s) {
                            let i = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                                r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : t.themeClasses.title;
                            if (!i) return;
                            const n = document.createElement(`h${e}`);
                            return (n.dataset.ufElement = "title"), (n.innerHTML = (0, q.replaceTags)(s)), "" !== r && n.classList.add(r), n;
                        }),
                        (this.createBubble = (t) => {
                            let { ident: e, contentHTML: s, title: i, progressBar: r, alignment: n, actionNumbers: o, progressType: a, closeButton: l, appendAdditionalContent: c, hotspot: h, customStyle: u } = t;
                            const d = document.querySelector(`.${this.themeClasses.prefix}-${e}`),
                                { body: p } = document;
                            if (d instanceof HTMLElement) return d;
                            if (!(p instanceof HTMLBodyElement)) return;
                            const g = document.createElement("div");
                            g.dataset.ufContent = "bubble";
                            const m = p.appendChild(g);
                            m.classList.add(this.themeClasses.bubble, `${this.themeClasses.prefix}-${e}`), m.setAttribute("id", e), u && (os(u, m), as(u, g));
                            const f = document.createElement("div");
                            f.classList.add(this.themeClasses.pointer),
                                f.setAttribute("data-floating-arrow", ""),
                                m.appendChild(f),
                            l instanceof HTMLButtonElement && m.appendChild(l),
                            i instanceof HTMLElement && ((i.dataset.ufElement = "title"), m.appendChild(i)),
                            r instanceof HTMLElement && m.appendChild(r);
                            const v = this.createWrapper(this.themeClasses.bubbleContent);
                            return (
                                null === i && v.classList.add(this.themeClasses.bubbleContentWithoutTitle),
                                    (v.innerHTML = (0, q.replaceTags)(s) || ""),
                                    m.appendChild(v),
                                c && c(m),
                                    m.appendChild(this.createSpaceMaker(n, o, a)),
                                this.isWatermark && m.appendChild(this.createWatermarkBadge()),
                                h && m.classList.add(this.themeClasses.bubbleInvisible),
                                    m
                            );
                        }),
                        (this.createWatermarkBadge = () => {
                            const t = this.createWrapper(this.themeClasses.badgeFree);
                            return t.appendChild(this.createLink("Powered by Usetiful", "", `${pt}?utm_source=tour_badge`)), t;
                        }),
                        (this.createSpaceMaker = function () {
                            let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                                s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                                i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
                            const r = t.createWrapper(t.themeClasses.spaceMaker);
                            return (
                                (s && "center" !== e) || i !== Ht.dots.key
                                    ? s || (i !== Ht.stepNumber.key && i !== Ht.circleProgressBar.key) || r.classList.add(t.themeClasses.spaceMakerDouble)
                                    : r.classList.add(t.themeClasses.spaceMakerPlus),
                                    r
                            );
                        }),
                        Ss.set(this, (t, e) => {
                            const s = this.createWrapper(this.themeClasses.progress),
                                i = this.createWrapper(this.themeClasses.progressbar);
                            return (
                                0 === t && s.classList.add("hidden"),
                                    "top" === e ? s.classList.add(this.themeClasses.progressTop) : "bottom" === e && s.classList.add(this.themeClasses.progressBottom),
                                    (i.style.width = `${t}%`),
                                    s.appendChild(i),
                                    s
                            );
                        }),
                        Cs.set(this, (t, e, s, i) => {
                            const r = this.createWrapper(this.themeClasses.dotProgress);
                            return (
                                i && "center" !== t
                                    ? "left" === t && i
                                        ? r.classList.add(this.themeClasses.dotProgressRight)
                                        : "right" === t && i && r.classList.add(this.themeClasses.dotProgressLeft)
                                    : r.classList.add(this.themeClasses.dotProgressCenter),
                                this.isWatermark && r.classList.add(this.themeClasses.dotProgressFree),
                                    [...Array(e)].forEach((t, e) => {
                                        const i = document.createElement("span");
                                        i.classList.add(this.themeClasses.dotProgressItem), e === s - 1 && i.classList.add(this.themeClasses.dotProgressActiveItem), r.appendChild(i);
                                    }),
                                    r
                            );
                        }),
                        ks.set(this, (t, e, s, i) => {
                            const r = this.createWrapper(this.themeClasses.numberProgress);
                            i ? "right" === s && i && r.classList.add(this.themeClasses.numberProgressLeft) : r.classList.add(this.themeClasses.numberProgressCenter),
                            this.isWatermark && r.classList.add(this.themeClasses.numberProgressFree),
                                (r.innerHTML = t.toString());
                            const n = document.createElement("span");
                            return (n.innerHTML = "/"), r.appendChild(n), (r.innerHTML += e.toString()), r;
                        }),
                        Is.set(this, (t, e, s) => {
                            let i = ((180 * t) / 100) * 2,
                                r = 0;
                            t > 50 && ((r = i - 180), (i = 180));
                            const n = this.createWrapper(this.themeClasses.circleProgress);
                            s ? "right" === e && s && n.classList.add(this.themeClasses.circleProgressLeft) : n.classList.add(this.themeClasses.circleProgressCenter),
                            this.isWatermark && n.classList.add(this.themeClasses.circleProgressFree);
                            const o = this.createWrapper(this.themeClasses.circleProgressInner),
                                a = document.createElement("div"),
                                l = this.createWrapper(this.themeClasses.circleProgressBar);
                            l.classList.add(this.themeClasses.circleProgressBarLeft);
                            const c = this.createWrapper(this.themeClasses.circleProgressProgress);
                            (c.style.transform = `rotate(${i}deg)`), l.appendChild(c);
                            const h = this.createWrapper(this.themeClasses.circleProgressBar);
                            h.classList.add(this.themeClasses.circleProgressBarRight);
                            const u = this.createWrapper(this.themeClasses.circleProgressProgress);
                            return (u.style.transform = `rotate(${r}deg)`), h.appendChild(u), a.appendChild(l), a.appendChild(h), n.appendChild(o), n.appendChild(a), n;
                        }),
                        (this.progressBarController = (t, e, s) => {
                            const { title: i, publicTitle: r, position: n, type: o, alignment: a, actions: l } = t,
                                c = "" !== i && !0 === r,
                                { progressType: h } = e,
                                u = Ls(this, Es, "f").call(this, e.steps, s),
                                d = u.activeStepIndex / (u.stepsLength / 100);
                            switch (h) {
                                case Ht.dots.key:
                                    return Ls(this, Cs, "f").call(this, a, u.stepsLength, u.activeStepIndex, l.length);
                                case Ht.stepNumber.key:
                                    return Ls(this, ks, "f").call(this, u.activeStepIndex, u.stepsLength, a, l.length);
                                case Ht.circleProgressBar.key:
                                    return Ls(this, Is, "f").call(this, d, a, l.length);
                                default: {
                                    let t = "";
                                    return c || o === Fe ? c || (t = n && "bottom" === n ? "bottom" : "top") : (t = "top"), Ls(this, Ss, "f").call(this, d, t);
                                }
                            }
                        }),
                        Es.set(this, (t, e) => {
                            const s = { stepsLength: 0, activeStepIndex: 0 };
                            return (
                                t.forEach((t, i) => {
                                    t.type !== qe && t.type !== Ve && ((s.stepsLength += 1), i <= e && (s.activeStepIndex += 1));
                                }),
                                    s
                            );
                        }),
                        (this.createBeacon = (t, e, s, i) => {
                            const r = this.createWrapper(this.themeClasses.beacon);
                            (r.dataset.ufElement = "beacon"),
                            s && s !== d && (r.classList.add(this.themeClasses.beaconIconic), s === p && r.classList.add(this.themeClasses.beaconIconicQuestion), s === g && r.classList.add(this.themeClasses.beaconIconicInformation));
                            const { body: n } = document;
                            if ((n.appendChild(r), !s || s === d)) {
                                const t = document.createElement("div");
                                t.classList.add(this.themeClasses.beaconAround), r.appendChild(t);
                            }
                            return r.setAttribute("id", t), (r.style.zIndex = e), i && i.classes && r.classList.add(i.classes), r;
                        }),
                        (this.removeAllBeacons = () => {
                            document.querySelectorAll(`.${this.themeClasses.beacon}`).forEach((t) => t.remove()),
                            window.usetiful_smartTipsObserver && window.usetiful_smartTipsObserver.length > 0 && window.usetiful_smartTipsObserver.forEach((t) => clearInterval(t));
                        }),
                        (this.notifyUser = function (e, s, i, r, n, o) {
                            let a,
                                l = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : "bottom-right",
                                c = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : null;
                            const h = document.createElement("div");
                            (h.dataset.ufContent = e), c && (h.dataset.id = c), h.setAttribute("style", "display: none"), n && h.classList.add(...n);
                            const u = document.createElement("div");
                            a = s instanceof HTMLElement ? s : t.createTitle(3, s);
                            const d = document.createElement("button");
                            (d.type = "button"), d.classList.add(t.themeClasses.buttonClose), (d.dataset.ufButton = "close");
                            const p = () => {
                                o && o(), vs(h);
                            };
                            if (
                                ("checklist" === e && (window.USETIFUL.checklist.close = p),
                                    d.addEventListener("click", p),
                                    (d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><path stroke="#000" stroke-width="2" d="M1 16L16 1M1 1l15 15"/></svg>'),
                                    u.appendChild(d),
                                a instanceof HTMLElement && u.appendChild(a),
                                    i)
                            ) {
                                const e = document.createElement("div");
                                e.classList.add(t.themeClasses.content), (e.innerHTML = i), u.appendChild(e);
                            }
                            if (r) {
                                const t = r();
                                u.append(t);
                            }
                            h.appendChild(u),
                                h.classList.add(t.themeClasses.notification),
                                u.classList.add(`${t.themeClasses.notificationInner}`),
                                "bottom-left" === l ? ((h.style.left = "0"), h.classList.add(t.themeClasses.left)) : ((h.style.right = "0"), h.classList.add(t.themeClasses.right)),
                                (h.style.bottom = "0"),
                            t.isWatermark && u.append(t.createWatermarkBadge()),
                                document.body.appendChild(h),
                            h.classList.contains(Ue.visible) || h.classList.add(Ue.visible);
                        }),
                        (this.confirmation = (t, e, s, i, r, n) => {
                            const o = `${Ue.prefix}-confirmation`,
                                a = `.${o}`;
                            document.querySelector(a) ||
                            this.notifyUser(
                                "confirm",
                                t,
                                e,
                                () => {
                                    const t = this.createWrapper(this.themeClasses.actions);
                                    t.classList.add("center");
                                    const e = this.createLink(s);
                                    e.addEventListener(
                                        "click",
                                        (t) => {
                                            r(), ys(a), t.preventDefault(), t.stopPropagation();
                                        },
                                        !1
                                    ),
                                        t.append(e);
                                    const n = this.createLink(i);
                                    return (
                                        n.addEventListener(
                                            "click",
                                            (t) => {
                                                ys(a), t.preventDefault(), t.stopPropagation();
                                            },
                                            !1
                                        ),
                                            t.append(n),
                                            t
                                    );
                                },
                                [o],
                                () => {},
                                n
                            );
                        }),
                        (this.showElement = (t) => {
                            document.body.appendChild(t), t.classList.contains(Ue.visible) || t.classList.add(Ue.visible);
                        }),
                        (this.changeItemToDoneStyle = (t) => {
                            const e = document.querySelector(`button[data-id='${t}']`);
                            if (e instanceof HTMLButtonElement) {
                                e.classList.add(this.themeClasses.done), (e.dataset.ufStatus = "done");
                                const t = e.querySelector(`.${this.themeClasses.svgIcon}`);
                                t &&
                                (t.innerHTML =
                                    '<svg class="svg-icon filled" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12z"/><path clip-rule="evenodd" d="M16.465 8.411a.75.75 0 01.124 1.054l-4.404 5.577a1.25 1.25 0 01-1.827.145l-2.866-2.635a.75.75 0 111.016-1.104l2.667 2.453 4.236-5.366a.75.75 0 011.054-.124z"/></svg>');
                            }
                        }),
                        (this.checklistProgressUpdate = () => {
                            var t;
                            const e = document.querySelectorAll(`.${this.themeClasses.notificationInner} .${this.themeClasses.actions} button`);
                            if (0 === e.length) return;
                            let s = 0;
                            e.forEach((t) => {
                                t.classList.contains(this.themeClasses.done) && (s += 1);
                            });
                            const i = Math.round(s / (e.length / 100));
                            if (!i) return;
                            null === (t = document.querySelector(`.${this.themeClasses.progressbar}`)) || void 0 === t || t.setAttribute("style", `width: ${i}%;`);
                            const r = document.querySelector(`.${this.themeClasses.progressValue}`);
                            r && (r.textContent = `${i}%`);
                        }),
                        (this.destructElement = (t) => {
                            const e = us(`.${this.themeClasses.prefix}-${t}`);
                            null == e ||
                            e.forEach((t) => {
                                var e;
                                null === (e = t.parentElement) || void 0 === e || e.removeChild(t);
                            });
                        }),
                        (this.checkScrollableClass = function (e) {
                            let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 4;
                            const i = window.innerHeight;
                            0 === e.clientHeight && s >= 0 && setTimeout(() => t.checkScrollableClass(e, s - 1), 50),
                                Le && e.clientHeight > 0.8 * i ? e.classList.add(t.themeClasses.scrollable) : e.classList.remove(t.themeClasses.scrollable);
                        }),
                        (this.themeClasses = je(e)),
                        (this.isWatermark = s);
                }
            };
            const xs = class {
                constructor(t) {
                    var e = this;
                    (this.setTheme = (t) => {
                        this.template.setTheme(t);
                    }),
                        (this.placeAllButtons = (t, e, s) => {
                            vt("placeAllButtons called"), this.setAvailableTours(t);
                            const i = [];
                            for (let r = 0; r < t.length; r += 1) t[r].tourData.button && e(t[r].tourData, s) && i.push(t[r]);
                            if (1 === i.length) this.placeUsetifulButton(i[0].tourData);
                            else if (i.length > 1) {
                                const t = ((t) => {
                                    if (t) {
                                        const e = Math.max(...t.map((t) => t.objectPriority));
                                        return t.filter((t) => t.objectPriority === e);
                                    }
                                })(i);
                                t &&
                                (1 === t.length
                                    ? this.placeUsetifulButton(t[0].tourData)
                                    : console.warn(
                                        `Usetiful: There are ${t.length} tours available on this page with usetiful button enabled: ${t
                                            .map((t) => `\n${t.tourData.name}`)
                                            .toString()} \n and we can't decide based on the targeting which button to display first.`
                                    ));
                            }
                        }),
                        (this.getButtonLabelContent = function (t) {
                            let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                                i = `${t}`;
                            return s && s > 0 && (i += `<span class="${e.template.themeClasses.badge}">${s}</span>`), i;
                        }),
                        (this.placeUsetifulButton = (t) => {
                            vt("placeUsetifulButton called"),
                                this.loader.loadTheme(t.theme, t.themeSlug).then((e) => {
                                    this.setTheme(e),
                                        this.prepareMainButton(`tour_${t.id}`, t.buttonLabel || "Usetiful Tour!", () => {
                                            window.USETIFUL.tour.start(t.id);
                                        });
                                });
                        }),
                        (this.buttonContent = ""),
                        (this.template = new Ds()),
                        (this.availableTours = []),
                        (this.loader = t);
                }
                setButtonContent(t) {
                    this.buttonContent = t;
                }
                getButtonContent() {
                    return this.buttonContent;
                }
                getButtonElement() {
                    return this.id ? document.querySelector(`[data-uf-id="${this.id}"][data-uf-button="button-main"]`) : document.querySelector('[data-uf-button="button-main"]');
                }
                setAvailableTours(t) {
                    this.availableTours = t;
                }
                destroy() {
                    vs(this.getButtonElement());
                }
                prepareMainButton(t, e, s) {
                    let i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : null;
                    if ((vt("prepareMainButton called"), document.querySelector(`[data-uf-button="button-main"][data-uf-id="${t}"]`))) return;
                    this.destroy(), (this.id = t), this.setButtonContent(e);
                    const r = this.template.createLink((0, q.replaceTags)(e), this.template.themeClasses.buttonMain);
                    (r.dataset.ufId = t),
                        r.setAttribute("style", "display:none"),
                    s &&
                    r.addEventListener(
                        "click",
                        (t) => {
                            s(), t.stopImmediatePropagation(), t.preventDefault();
                        },
                        !1
                    );
                    const n = document.body;
                    n && n.appendChild(r), r.classList.add(Ue.visible), i && "bottom-left" === i && r.classList.add(this.template.themeClasses.buttonMainLeft);
                }
            };
            class Ps {
                constructor(t, e) {
                    (this.placeAppearsTrigger = () => {
                        let t = !1;
                        return this.availableOnPage.checkTriggerURL(this.trigger) && this.isInitial && (t = this.setAppearTrigger()), t;
                    }),
                        (this.setAppearTrigger = () => {
                            vt(`setAppearTrigger called for ${this.elementSelector} ...`);
                            const t = 2 * this.loop;
                            let e = !1,
                                s = 1;
                            if (!this.availableOnPage.checkTriggerURL(this.trigger)) return !1;
                            const i = window.setInterval(() => {
                                vt(`${this.id}: ${s} / ${t}: Waiting on the element '${this.elementSelector}' to appear...`);
                                const i = this.availableOnPage.checkElement(this.elementSelector) && !ws(hs(this.elementSelector));
                                !e && i && this.triggerFunction
                                    ? (vt(`${this.id}: Element appeared`), (e = !0), this.triggerFunction(), this.isInitial || this.removeAppearTrigger())
                                    : -1 === this.loop || (t && s < t)
                                        ? (s += 1)
                                        : e
                                            ? this.isInitial && !i && ((e = !1), vt(`${this.id}: Element disappeared`))
                                            : t && (this.removeAppearTrigger(), this.failFunction ? this.failFunction() : this.altSolution && this.altSolution());
                            }, 500);
                            return (this.intervalId = i), !0;
                        }),
                        (this.removeAppearTrigger = () => {
                            vt(`${this.id}: remoteAppearTrigger called.`), this.intervalId && (clearInterval(this.intervalId), vt(`${this.id}: interval removed.`));
                        }),
                        (this.trigger = t),
                        (this.id = (+new Date()).toString(36)),
                        (this.eventType = t.type),
                        (this.eventName = this.eventType),
                    "custom" === this.eventType && (this.eventName = t.name),
                        (this.loop = t.loop ? parseInt(t.loop, 10) : 0),
                        (this.url = t.url),
                        (this.elementSelector = t.element),
                        (this.isInitial = !1),
                        (this.isChecklistItem = !1),
                        (this.isProgressOnClick = !1),
                        (this.failFunction = void 0),
                        (this.triggerFunction = () => {}),
                        (this.reverseTriggerFunction = () => {}),
                        (this.availableOnPage = e);
                }
            }
            const As = (t, e) => e.checkTriggerURL(t),
                Os = (t) => t.includes("#"),
                _s = (t, e) => {
                    const s = (0, q.replaceTags)(t);
                    setTimeout(() => {
                        if (e) {
                            const t = window.open(s, "_blank");
                            null == t || t.focus();
                        } else (window.location.href = s || ""), Os(s) && window.USETIFUL.reinitialize();
                    }, 1);
                },
                $s = (t, e) => !(!e.startsWith("/") && !e.startsWith(".")) || (t = new URL(t).hostname.replace("www.", "")) === (e = new URL(e).hostname.replace("www.", ""));
            class Bs {
                constructor(t) {
                    (this.placeTrigger = (t) => {
                        if ((vt(`placeTrigger: Event ${t.eventName} on url: ${t.url} and element: ${t.elementSelector} with loop:${t.loop}.`), this.isTriggerMissing(t))) {
                            if ("custom" === t.eventType) {
                                this.addToActiveTriggers(t);
                                if (t.elementSelector && hs(t.elementSelector) && "window" !== t.elementSelector) {
                                    const e = hs(t.elementSelector);
                                    e && e.addEventListener(t.eventName, this.centralEventListener);
                                } else this.placeCentralListener(t.eventName, t.elementSelector);
                                return;
                            }
                            switch ((this.addToActiveTriggers(t), t.eventName)) {
                                case "appears":
                                    t.placeAppearsTrigger() && window.usetiful_intervals.push(t.intervalId);
                                    break;
                                case "hover": {
                                    (t.eventName = "mouseover"), this.placeCentralListener(t.eventName, t.elementSelector);
                                    const e = new Ps(t.trigger, this.availableOnPage);
                                    (e.eventName = "mouseout"), (e.triggerFunction = t.reverseTriggerFunction), (e.stepId = t.stepId), this.addToActiveTriggers(e), this.placeCentralListener(e.eventName, t.elementSelector);
                                    break;
                                }
                                case "focus":
                                    (t.eventName = "focusin"), this.placeCentralListener(t.eventName, t.elementSelector);
                                    break;
                                case "mouseenter":
                                    (t.eventName = "mouseover"), this.placeCentralListener(t.eventName, t.elementSelector);
                                    break;
                                case "click":
                                    (t.eventName = "mouseup"), this.placeCentralListener(t.eventName, t.elementSelector);
                                    break;
                                default:
                                    this.placeCentralListener(t.eventName, t.elementSelector);
                            }
                        }
                    }),
                        (this.centralEventListener = (t) => {
                            const e = t.target || t.srcElement || t.currentTarget;
                            if ((vt(`centralEventListener: called with event ${t.type} on element: ${e}`, !0), !(e instanceof Element || e instanceof HTMLElement || e instanceof Window))) return;
                            const s = this.searchInActiveTriggers(t.type, e);
                            bt(e),
                                s.forEach((e) => {
                                    e.stepId ? e.triggerFunction(e.stepId) : e.isChecklistItem && e.checklistItemId ? e.triggerFunction(e.checklistItemId) : e.triggerFunction(t);
                                });
                        }),
                        (this.updateListeners = () => {
                            vt("Updating listeners on window.usetiful_activeTriggersOnElements..."),
                            window.usetiful_activeListeners &&
                            window.usetiful_activeListeners.forEach((t) => {
                                window.removeEventListener(t, this.centralEventListener);
                            }),
                                (window.usetiful_activeListeners = []),
                                window.usetiful_activeTriggersOnElements.forEach((t) => {
                                    this.placeCentralListener(t.eventName, t.elementSelector);
                                });
                        }),
                        (this.placeCentralListener = (t, e) => {
                            var s, i;
                            const r = ps(e || ""),
                                n = `${t}(${r.isAShadowDomSelector ? r.shadowDomSelector : "window"})`;
                            t &&
                            window.usetiful_activeListeners &&
                            -1 === window.usetiful_activeListeners.indexOf(n) &&
                            (window.usetiful_activeListeners.push(n),
                                r.isAShadowDomSelector && r.shadowDomSelector
                                    ? null === (i = null === (s = document.querySelector(r.shadowDomSelector)) || void 0 === s ? void 0 : s.shadowRoot) || void 0 === i || i.addEventListener(t, this.centralEventListener)
                                    : window.addEventListener(t, this.centralEventListener));
                        }),
                        (this.removeCentralListener = (t) => {
                            if (!window.usetiful_activeListeners) return;
                            const e = window.usetiful_activeListeners.indexOf(t);
                            e > -1 && window.usetiful_activeListeners.splice(e, 1);
                        }),
                        (this.hasProgressOnClickTrigger = (t) => {
                            const e = this.searchInActiveTriggers("mouseup", t);
                            for (let t = 0; t < e.length; t += 1) if (e[t].isProgressOnClick) return !0;
                            return !1;
                        }),
                        (this.isTriggerMissing = (t) => {
                            const e = this.searchInActiveTriggers(t.eventName, t.elementSelector);
                            let s = !1;
                            return (
                                e.forEach((e) => {
                                    e.isChecklistItem === t.isChecklistItem && e.isProgressOnClick === t.isProgressOnClick && e.isInitial === t.isInitial && (s = !0);
                                }),
                                    !s
                            );
                        }),
                        (this.searchInActiveTriggers = (t, e) => {
                            const s = window.usetiful_activeTriggersOnElements,
                                i = e,
                                r = [];
                            for (let e = 0; e < s.length; e += 1) {
                                const n = "hover" === t || "focus" === t || "mouseenter" === t || "click" === t ? s[e].eventType === t : s[e].eventName === t;
                                if (As(s[e], this.availableOnPage) && n) {
                                    const n = s[e].elementSelector;
                                    let o = !1;
                                    if ("string" == typeof i) o = n === i;
                                    else {
                                        const e = !n || "window" === n;
                                        (e ? window : hs(n)) === i
                                            ? (o = !0)
                                            : !i || i instanceof Window || e || ("click" !== t && "mouseup" !== t && "wheel" !== t && "mouseover" !== t) || ((o = bs(i, n)), !o && fs(i, "a") && (o = i && null !== i.querySelector(n)));
                                    }
                                    o && r.push(s[e]);
                                }
                            }
                            return r;
                        }),
                        (this.addToActiveTriggers = (t) => {
                            t && t.eventName && window.usetiful_activeTriggersOnElements.push(t);
                        }),
                        (this.removeFromActiveTriggers = (t) => {
                            const e = window.usetiful_activeTriggersOnElements.indexOf(t);
                            vt(`removing item on index ${e} from active triggers`), window.usetiful_activeTriggersOnElements.splice(e, 1);
                        }),
                        (this.removeAllTriggers = (t) => {
                            vt("removeAllTriggers called");
                            [...window.usetiful_activeTriggersOnElements].forEach((e, s) => {
                                if (!t && e.isInitial && e.isChecklistItem) return;
                                if ((vt(`item ${s}...`), "custom" === e.eventType)) {
                                    if ((this.removeFromActiveTriggers(e), window.removeEventListener(e.eventName, this.centralEventListener), e.elementSelector && "window" !== e.elementSelector)) {
                                        const t = document.querySelector(e.elementSelector);
                                        t && t.removeEventListener(e.eventName, this.centralEventListener);
                                    }
                                    return;
                                }
                                "appears" === e.eventName ? (this.removeFromActiveTriggers(e), e.removeAppearTrigger()) : this.removeFromActiveTriggers(e);
                            }),
                                this.updateListeners();
                        }),
                        (this.triggersClearance = (t) => {
                            vt("triggersClearance: Removing triggers from window.usetiful_activeTriggersOnElements..."),
                            window.usetiful_activeTriggersOnElements &&
                            window.usetiful_activeTriggersOnElements.length > 0 &&
                            (this.removeAllTriggers(t), t && window.usetiful_activeTriggersOnElements.length > 0 && yt("triggersClearance: No all active triggers were removed"));
                        }),
                    window.usetiful_activeTriggersOnElements || (window.usetiful_activeTriggersOnElements = []),
                    window.usetiful_activeListeners || (window.usetiful_activeListeners = []),
                        (this.availableOnPage = t);
                }
            }
            const Rs = "all-types",
                Ns = "desktop",
                js = "mobile",
                Ms = "tablet",
                Us = "tag-is-not",
                Fs = "tag-contain",
                Hs = "tag-not-contain",
                Ws = "tag-lower",
                qs = "tag-higher",
                Vs = "all-browsers",
                Ks = "chrome",
                Js = "firefox",
                zs = "edge",
                Gs = "safari",
                Qs = "opera",
                Xs = "blink",
                Ys = "all-systems",
                Zs = "windows",
                ti = "macos",
                ei = "android",
                si = "linux",
                ii = ["Win32", "Win64", "Windows", "WinCE"].indexOf(window.navigator.platform) > -1,
                ri = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(window.navigator.platform) > -1,
                ni = ["iPhone", "iPad", "iPod"].indexOf(window.navigator.platform) > -1,
                oi = /Android/.test(window.navigator.userAgent),
                ai = /Linux/.test(window.navigator.platform);
            class li {
                constructor(t) {
                    var e = this;
                    (this.getWildcardCharacter = () => this.wildcard),
                        (this.containWildcard = (t) => t.indexOf(this.wildcard) > -1),
                        (this.getWildcardIndexes = function (t) {
                            let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e.wildcard;
                            const i = [];
                            let r = t.indexOf(s, 0);
                            for (; r >= 0; ) i.push(r), (r = t.indexOf(s, r + 1));
                            return i;
                        }),
                        (this.checkWildcardURLExact = (t, e) => {
                            if ("" === t.replace(new RegExp(this.wildcard, "g"), "")) return !0;
                            const s = t.split(this.getWildcardCharacter()),
                                i = this.getWildcardIndexes(t),
                                r = t.indexOf(s[0]) > i[0] || s[0] === t.substring(0, i[0]),
                                n = t.indexOf(s[s.length - 1]) < i[0] || s[s.length - 1] === t.substring(i[i.length - 1] + this.wildcard.length);
                            return this.checkWildcardURLContains(t, e) && r && n;
                        }),
                        (this.checkWildcardURLContains = (t, e) => {
                            const s = t.split(this.getWildcardCharacter());
                            if (s.length > 2) {
                                const t = [];
                                for (let i = 0; i < s.length - 1; i++) {
                                    const r = `${s[i]}${this.getWildcardCharacter()}${s[i + 1]}`;
                                    t.push(this.checkWildcardStringContains(r, e));
                                }
                                return !t.includes(!1);
                            }
                            return this.checkWildcardStringContains(t, e);
                        }),
                        (this.checkWildcardStringContains = (t, e) => {
                            if ("" === t.replace(new RegExp(this.wildcard, "g"), "")) return !0;
                            const s = t.indexOf(this.wildcard),
                                i = t.substring(0, s),
                                r = t.substring(s + this.wildcard.length),
                                n = e.indexOf(i),
                                o = e.indexOf(r);
                            return !((i.length > 0 && -1 === n) || (r.length > 0 && -1 === o) || (i && r && n + i.length > o));
                        }),
                        (this.wildcard = t);
                }
            }
            class ci {
                constructor(t, e, s) {
                    var r = this;
                    (this.checkIfInputContainWildcard = (t) => this.wildcard.containWildcard(t)),
                        (this.checkWildcardURLExact = (t) => this.wildcard.checkWildcardURLExact(t, this.location)),
                        (this.checkWildcardURLContains = (t) => this.wildcard.checkWildcardURLContains(t, this.location)),
                        (this.checkURL = (t) => {
                            if (this.checkIfInputContainWildcard(t)) return this.checkWildcardURLExact(t);
                            try {
                                return new RegExp(t, "i").test(this.location);
                            } catch (e) {
                                return console.warn(`Entered regular expression'${t}' isn't valid.`), !1;
                            }
                        }),
                        (this.checkURLSimple = (t) => (this.checkIfInputContainWildcard(t) ? this.checkWildcardURLContains(t) : this.location.indexOf(t) > -1)),
                        (this.checkURLNotContain = (t) => (this.checkIfInputContainWildcard(t) ? !this.checkWildcardURLContains(t) : -1 === this.location.indexOf(t))),
                        (this.checkURLExact = (t) => (this.checkIfInputContainWildcard(t) ? this.checkWildcardURLExact(t) : this.location === t)),
                        (this.checkTag = (t, e, s) => {
                            var i, r;
                            if (!window.usetifulTags || void 0 === (null === (i = window.usetifulTags) || void 0 === i ? void 0 : i[t])) return !1;
                            const n = null === (r = window.usetifulTags) || void 0 === r ? void 0 : r[t],
                                o = parseInt(e, 10),
                                a = o.toString() === e;
                            switch (s) {
                                case Us:
                                    return n !== e || (n !== o && a);
                                case Fs:
                                    return n.toString().indexOf(e) >= 0;
                                case Hs:
                                    return -1 === n.toString().indexOf(e);
                                case qs:
                                    return "number" == typeof n ? n > parseInt(e, 10) : parseInt(n, 10) > parseInt(e, 10);
                                case Ws:
                                    return "number" == typeof n ? n < parseInt(e, 10) : parseInt(n, 10) < parseInt(e, 10);
                                default:
                                    return n === e || (n === o && a);
                            }
                        }),
                        (this.refreshURL = () => {
                            this.location = window.location.href;
                        }),
                        (this.checkElement = function (t) {
                            let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                            if (cs(t)) {
                                const s = hs(t);
                                if (s) return !e || !s.textContent || new RegExp(e).test(s.textContent.trim());
                            }
                            return !1;
                        }),
                        (this.checkAttribute = (t, e, s) => {
                            if (cs(t)) {
                                const i = hs(t);
                                if (i) {
                                    const t = i.getAttribute(e);
                                    return !(!t || !s) && new RegExp(s).test(t.trim());
                                }
                            }
                            return !1;
                        }),
                        (this.checkTriggerURL = (t) => !!t && (!t.url || ("" !== t.url && this.checkURL(t.url)))),
                        (this.checkDevice = (t) => {
                            let e = !1;
                            switch (t) {
                                case Rs:
                                    e = !0;
                                    break;
                                case Ns:
                                    e = xe;
                                    break;
                                case js:
                                    e = Le;
                                    break;
                                case Ms:
                                    e = De;
                            }
                            return e;
                        }),
                        (this.checkBrowser = (t) => {
                            let e = !1;
                            switch (t) {
                                case Vs:
                                    e = !0;
                                    break;
                                case Ks:
                                    e = he;
                                    break;
                                case Js:
                                    e = oe;
                                    break;
                                case Gs:
                                    e = ae;
                                    break;
                                case Qs:
                                    e = ne;
                                    break;
                                case "ie":
                                    e = le;
                                    break;
                                case zs:
                                    e = ce;
                                    break;
                                case Xs:
                                    e = ue;
                            }
                            return e;
                        }),
                        (this.checkOS = (t) => {
                            let e = !1;
                            switch (t) {
                                case Ys:
                                    e = !0;
                                    break;
                                case Zs:
                                    e = ii;
                                    break;
                                case ti:
                                    e = ri;
                                    break;
                                case "ios":
                                    e = ni;
                                    break;
                                case ei:
                                    e = oi;
                                    break;
                                case si:
                                    e = ai;
                            }
                            return e;
                        }),
                        (this.checkTargetEntity = (t, e, s, i) => {
                            if (t[e]) return !0;
                            const r = [];
                            return (
                                Object.keys(t).forEach((e) => {
                                    t[e] && r.push(s(e));
                                }),
                                    i ? r.every((t) => t) : r.some((t) => t)
                            );
                        }),
                        (this.checkBrowserLanguage = (t) => window.navigator && window.navigator.language.indexOf(t) > -1),
                        (this.checkLS = (t, e) => localStorage.getItem(t) === e),
                        (this.checkTourState = (t, e) => {
                            const s = "state",
                                r = this.api.getStoredObjectData(t);
                            switch (e) {
                                case "not-started":
                                    return !0;
                                case "completed":
                                    return this.completionApi.isCompleted(i, parseInt(t, 10));
                                default:
                                    if (r && r[s]) return r[s] === e;
                            }
                            return !1;
                        }),
                        (this.checkChecklistState = (t, e) => {
                            switch (e) {
                                case "dismissed":
                                    return this.dismiss.isChecklistDismiss(t);
                                case "completed":
                                    return this.completionApi.isCompleted("checklist", t);
                                default:
                                    return !1;
                            }
                        }),
                        (this.checkReferrerURL = (t, e) => (e ? document.referrer === t : document.referrer.indexOf(t) > -1)),
                        (this.evaluate = (t, e, s) => (t ? e && s : e || s)),
                        (this.checkByTargets = (t, e) => {
                            let s = !1;
                            const i = !e || 0 === e;
                            let r = !1,
                                n = !1,
                                o = !1;
                            const a = {},
                                l = {},
                                c = {};
                            return (
                                !t ||
                                0 === t.length ||
                                (Array.isArray(t) &&
                                (i && (s = !0),
                                    t.forEach((t) => {
                                        var e, h, u;
                                        switch (t.type) {
                                            case "address-exact":
                                                s = this.evaluate(i, s, this.checkURLExact(t.url));
                                                break;
                                            case "address-simple":
                                                s = this.evaluate(i, s, this.checkURLSimple(t.url));
                                                break;
                                            case "address-not-contain":
                                                s = this.evaluate(i, s, this.checkURLNotContain(t.url));
                                                break;
                                            case "address":
                                                s = this.evaluate(i, s, this.checkURL(t.url));
                                                break;
                                            case "tag":
                                                s = this.evaluate(i, s, this.checkTag(t.name, t.text, t.operator));
                                                break;
                                            case "element":
                                                s = this.evaluate(i, s, this.checkElement(t.element));
                                                break;
                                            case "not-element":
                                                s = this.evaluate(i, s, !this.checkElement(t.element));
                                                break;
                                            case "element-text":
                                                s = this.evaluate(i, s, this.checkElement(t.element, t.text));
                                                break;
                                            case "element-attr":
                                                s = this.evaluate(i, s, this.checkAttribute(t.element, t.attr, t.text));
                                                break;
                                            case "target-device":
                                                (null === (e = t.device) || void 0 === e ? void 0 : e.length) > 0 && ((r = !0), (a[t.device] = !0));
                                                break;
                                            case "audience-browser":
                                                (null === (h = t.browser) || void 0 === h ? void 0 : h.length) > 0 && ((n = !0), (l[t.browser] = !0));
                                                break;
                                            case "audience-os":
                                                (null === (u = t.os) || void 0 === u ? void 0 : u.length) > 0 && ((o = !0), (c[t.os] = !0));
                                                break;
                                            case "audience-language":
                                                s = this.evaluate(i, s, this.checkBrowserLanguage(t.text));
                                                break;
                                            case "device-ls-data":
                                                s = this.evaluate(i, s, this.checkLS(t.name, t.text));
                                                break;
                                            case "device-tour-finished":
                                                s = this.evaluate(i, s, this.checkTourState(t.tours, t.state));
                                                break;
                                            case "checklist-state":
                                                s = this.evaluate(i, s, this.checkChecklistState(t.checklist, t.state));
                                                break;
                                            case "referrer-exact":
                                                s = this.evaluate(i, s, this.checkReferrerURL(t.url, !0));
                                                break;
                                            case "referrer-contains":
                                                s = this.evaluate(i, s, this.checkReferrerURL(t.url, !1));
                                        }
                                    }),
                                r && (s = this.evaluate(i, s, this.checkTargetEntity(a, Rs, this.checkDevice, i))),
                                n && (s = this.evaluate(i, s, this.checkTargetEntity(l, Vs, this.checkBrowser, i))),
                                o && (s = this.evaluate(i, s, this.checkTargetEntity(c, Ys, this.checkOS, i)))),
                                    s)
                            );
                        }),
                        (this.checkTargetWithWaiting = function (t, e) {
                            let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 60;
                            return new Promise((i, n) => {
                                let o = 0;
                                const a = setInterval(() => {
                                    (o += 1), r.checkAvailableOnPage(t, e) && (i(null), clearInterval(a)), o >= s && (clearInterval(a), n());
                                }, 500);
                            });
                        }),
                        (this.getParsedConditions = (t) => {
                            let e = t;
                            try {
                                return !t || t instanceof Object || (e = JSON.parse(t)), e;
                            } catch (t) {
                                vt("Targets field is not JSON.");
                            }
                            return !1;
                        }),
                        (this.location = window.location.href),
                        (this.wildcard = new li("{}")),
                        (this.api = t),
                        (this.completionApi = e),
                        (this.dismiss = s);
                }
                checkAvailableOnPage(t, e) {
                    const s = this.getParsedConditions(t);
                    let i = s,
                        r = [];
                    s && ((i = s.filter((t) => !Object.keys(t).includes("targets"))), (r = s.filter((t) => Object.keys(t).includes("targets"))));
                    let n = this.checkByTargets(i, e);
                    r.length > 0 && (!i || 0 === i.length) && (n = 1 !== e);
                    const o = [n];
                    return (
                        r &&
                        r.forEach((t) => {
                            o.push(this.checkByTargets(t.targets, t.targetOperator));
                        }),
                            e ? o.some((t) => t) : o.every((t) => t)
                    );
                }
            }
            const hi = "click",
                ui = "tourCompletion",
                di = "pageEvent",
                pi = "startTour",
                gi = "immediately",
                mi = "openURL",
                fi = "nothing",
                vi = "done",
                yi = "open",
                bi = "inProgress",
                wi = "pageEvent";
            Object.assign(Object.assign({}, { url: "", type: "click", element: "", loop: "3" }), { tourId: 0, action: "start" });
            const Ti = class {
                    constructor(t, e) {
                        (this.saveToStorage = () => {
                            const t = localStorage.getItem(lt);
                            this.progressorApi.saveUserData(lt, t);
                        }),
                            (this.progressorApi = t),
                            (this.checklistData = []),
                            (this.alreadyParsed = !1),
                            this.processParseData(),
                            (this.completionApi = e);
                    }
                    processParseData() {
                        if (this.alreadyParsed) return;
                        const t = this.progressorApi.getUserData(lt);
                        if (t && "string" == typeof t) {
                            const e = JSON.parse(t);
                            this.saveToLocalStorage(e), (this.checklistData = e);
                        } else this.loadFromLocalStorage(), this.saveToStorage();
                        this.alreadyParsed = !0;
                    }
                    loadFromLocalStorage() {
                        const t = localStorage.getItem(lt);
                        t && (this.checklistData = JSON.parse(t));
                    }
                    isRedirected(t) {
                        if ((this.loadFromLocalStorage(), this.checklistData && this.checklistData.length > 0)) {
                            return void 0 !== this.checklistData.find((e) => e.id === t);
                        }
                        return !1;
                    }
                    markAsRedirected(t) {
                        (this.alreadyParsed = !1), this.processParseData();
                        void 0 !== this.checklistData.find((e) => e.id === t) || (this.checklistData.push({ id: t }), this.completionApi.completeItem(Jt, t, !0)), this.saveToLocalStorage(this.checklistData), this.saveToStorage();
                    }
                    saveToLocalStorage(t) {
                        localStorage.setItem(lt, JSON.stringify(t));
                    }
                },
                Si = (t, e, s, o) => {
                    const a = new Ti(e, s),
                        { id: l, onClickAction: c, tourId: h, completionOn: u, completionEvent: d } = t;
                    switch (u) {
                        case hi:
                            if (c === pi) {
                                const t = o.getObjectStatus(h.toString());
                                if (t === n) return vi;
                                if (t === r) return bi;
                            } else if ((c === mi || c === fi) && a.isRedirected(l)) return vi;
                            break;
                        case di:
                            return a.isRedirected(l) ? vi : wi;
                        case gi:
                            return vi;
                        case ui:
                            if (d) {
                                let t = "number" != typeof d.event.tourId ? parseInt(d.event.tourId, 10) : d.event.tourId;
                                if ((0 === t && (t = h), (t && "complete" === d.event.action && s.isCompleted(i, t)) || ("start" === d.event.action && o.getObjectStatus(t.toString()) === n))) return vi;
                            }
                    }
                    return yi;
                },
                Ci = ["uf_progressorLastSaveSuccessful"];
            const ki = class {
                    constructor(t, e, s) {
                        (this.keysToRemove = Ci), (this.toursData = []), (this.checklistsData = []), (this.api = t), (this.progressorApi = e), (this.completionApi = s);
                    }
                    init(t, e) {
                        (this.toursData = t), (this.checklistsData = e), this.permanentlyRemoveFromLS(), this.restartTours(), this.api.saveToLocalStorage(this.api.getStoredData()), this.migrateStatesToCompletions();
                    }
                    permanentlyRemoveFromLS() {
                        this.keysToRemove.forEach((t) => {
                            localStorage.removeItem(t);
                        });
                    }
                    restartTours() {
                        this.toursData
                            .filter((t) => {
                                const e = this.api.getStoredObjectData(t.id.toString()),
                                    s = t.lastRestartOn,
                                    i = null == e ? void 0 : e.updatedAt;
                                return (i && s && s > i) || (s && !i) ? t : null;
                            })
                            .forEach((t) => {
                                this.api.removeObject(t.id.toString()), this.completionApi.uncompleteItem(i, t.id);
                            });
                    }
                    migrateStatesToCompletions() {
                        var t;
                        if (null === window.localStorage.getItem(ht)) {
                            const e = [];
                            this.api.getDataByName(ot).forEach((t) => {
                                t.state === n && e.push({ type: i, id: t.id, migration: !0, updatedAt: t.updatedAt });
                            }),
                            null === (t = this.checklistsData) ||
                            void 0 === t ||
                            t.forEach((t) => {
                                const s = t.items;
                                let i = 0;
                                null == s ||
                                s.forEach((t) => {
                                    Si(t, this.progressorApi, this.completionApi, this.api) === vi && ((i += 1), e.push({ type: Jt, id: t.id, migration: !0, updatedAt: new Date().toISOString() }));
                                }),
                                i === s.length && e.push({ type: Kt, id: t.id, migration: !0, updatedAt: new Date().toISOString() });
                            }),
                                window.localStorage.setItem(ht, JSON.stringify(e)),
                                this.completionApi.saveToStorage();
                        }
                    }
                },
                Ii = "smart-tips-group";
            const Ei = class {
                constructor(t, e, s) {
                    var o = this;
                    (this.isGivenObject = (t, e) => {
                        var s;
                        return (null == t ? void 0 : t.name) === e || t.id === e || (null === (s = null == t ? void 0 : t.id) || void 0 === s ? void 0 : s.toString()) === e;
                    }),
                        (this.setProgressToLocalStorage = (t, e, s) => {
                            const { name: r, id: n } = e,
                                o = new Date().toISOString();
                            this.type === i ? (this.updateState(n, { state: t, name: r, currentStep: s || 0, updatedAt: o }), this.updatePreviewStep(t, s || 0)) : this.updateState(n, { state: t, id: n, updatedAt: o });
                        }),
                        (this.getCurrentStepIndexLS = (t) => this.getObjectState(t.toString(), "currentStep", 0)),
                        (this.getRunningToursFromLS = () => {
                            const t = this.getStoredData(),
                                e = [];
                            if (t && t.length)
                                for (const [s, i] of Object.entries(t)) {
                                    const t = i.id;
                                    t && s && i && i.state === r && e.push(parseInt(t, 10));
                                }
                            return e;
                        }),
                        (this.closeTourInLS = (t, e) => {
                            this.setProgressToLocalStorage(n, { name: e, id: t }, 0);
                        }),
                        (this.closeInProgressTour = (t, e) => {
                            this.getObjectState(t.toString(), "state") === r && this.closeTourInLS(t.toString(), e);
                        }),
                        (this.removeObject = (t) => {
                            let e = this.getStoredData();
                            (e = e.filter((e) => !this.isGivenObject(e, t)).map((t) => t)), this.progressor && this.saveToStorage(e), this.saveToLocalStorage(e);
                        }),
                        (this.removeDuplicities = function () {
                            let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : o.getStoredData(),
                                e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : (t, e) => void 0 !== e.id && void 0 !== t.id && e.id.toString() === t.id.toString();
                            if (t && t.length) {
                                const s = [];
                                return (
                                    t.forEach((t) => {
                                        const i = s.find((s) => e(t, s));
                                        if (i) {
                                            if (!i.updatedAt || t.updatedAt > i.updatedAt) {
                                                const i = s.findIndex((s) => e(t, s));
                                                s[i] = t;
                                            }
                                        } else s.push(t);
                                    }),
                                        s
                                );
                            }
                            return [];
                        }),
                        (this.type = t),
                        (this.loadedFromStorage = !1),
                        (this.progressorAPI = s),
                        (this.progressor = t === i ? this.progressorAPI : null),
                        (this.storageKeyName = e);
                }
                getStoredData() {
                    if (this.progressor && !this.loadedFromStorage) {
                        const t = this.progressor.getUserData(this.storageKeyName);
                        if (((this.loadedFromStorage = !0), t && "string" == typeof t)) {
                            const e = JSON.parse(t);
                            return this.saveToLocalStorage(e), e;
                        }
                    }
                    let t = [];
                    const e = window.localStorage.getItem(this.storageKeyName);
                    return e && (t = JSON.parse(e)), t;
                }
                getDataByName(t) {
                    let e = [];
                    const s = window.localStorage.getItem(t);
                    return s && (e = JSON.parse(s)), e;
                }
                getStoredObjectData(t) {
                    const e = this.getStoredData();
                    let s = null;
                    return e && e.length && (s = e.find((e) => this.isGivenObject(e, t)) || null), s;
                }
                getObjectState(t, e) {
                    let s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
                    const i = this.getStoredObjectData(t);
                    return i && i[e] ? i[e] : s;
                }
                setStateByProperty(t, e, s) {
                    const i = this.getStoredData().map((i) => (this.isGivenObject(i, t) ? Object.assign(Object.assign({}, i), { [e]: s }) : i));
                    this.saveToLocalStorage(i);
                }
                updateState(t, e) {
                    let s = this.getStoredData();
                    null === this.getStoredObjectData(t) && (this.type === i ? s.push(Object.assign({ id: t }, e)) : this.type === Ii && s.push(Object.assign({}, e))),
                        (s = s.map((s) => (this.isGivenObject(s, t) ? Object.assign(Object.assign({}, s), e) : s))),
                    this.progressor && this.saveToStorage(s),
                        this.saveToLocalStorage(s);
                }
                saveToLocalStorage(t) {
                    const e = this.getStoredData(),
                        s = this.removeDuplicities(t);
                    this.shouldUpdateLocalStorage(e, s) && window.localStorage.setItem(this.storageKeyName, JSON.stringify(s));
                }
                shouldUpdateLocalStorage(t, e) {
                    if (0 === t.length) return !0;
                    if (JSON.stringify(t) === JSON.stringify(e)) return !1;
                    if (t.some((t) => void 0 === t.id || void 0 === t.updatedAt)) return !0;
                    return (
                        !!e.some((e) => !t.some((t) => void 0 !== t.id && void 0 !== e.id && t.id.toString() === e.id.toString())) ||
                        e.some((e) => void 0 !== t.find((t) => void 0 !== t.id && void 0 !== e.id && t.id.toString() === e.id.toString() && e.updatedAt >= t.updatedAt))
                    );
                }
                addToLocalStorageByKey(t, e, s) {
                    const i = this.getDataByName(t).concat(e),
                        r = s ? this.removeDuplicities(i, s) : this.removeDuplicities(i);
                    window.localStorage.setItem(t, JSON.stringify(r));
                }
                saveToStorage(t) {
                    this.progressorAPI.saveUserData(this.storageKeyName, JSON.stringify(t));
                }
                getObjectStatus(t) {
                    return this.getObjectState(t, "state");
                }
                updatePreviewStep(t, e) {
                    let s = e;
                    t === n && (s = -1), window.dispatchEvent(new CustomEvent("updatePreviewStep", { detail: s }));
                }
                getRunningTour(t) {
                    const e = this.getStoredData();
                    if (e && e.length)
                        for (const [s, i] of Object.entries(e)) {
                            const e = i.id;
                            if (e && s && i && i.state === r && (!t || (t && t.find((t) => t.id === e)))) return e;
                        }
                    return null;
                }
                isTourReopenFromLS(t) {
                    return this.getObjectStatus(t) === n;
                }
            };
            const Li = class {
                    constructor(t) {
                        (this.saveToLocalStorage = (t) => {
                            localStorage.setItem(this.getStorageKey(), t);
                        }),
                            (this.isCompleted = (t, e) => void 0 !== this.api.getDataByName(this.getStorageKey()).find((s) => s.type === t && s.id === e)),
                            (this.uncompleteItem = (t, e) => {
                                if (!this.isCompleted(t, e)) return;
                                const s = this.api.getDataByName(this.getStorageKey()),
                                    i = s.findIndex((s) => s.type === t && s.id === e);
                                -1 !== i && (s.splice(i, 1), this.saveToLocalStorage(JSON.stringify(s)), this.saveToStorage());
                            }),
                            (this.getStorageKey = () => ht),
                            (this.saveToStorage = () => {
                                const t = this.api.getDataByName(this.getStorageKey());
                                this.api.progressorAPI.saveUserData(this.getStorageKey(), JSON.stringify(t));
                            }),
                            (this.api = t),
                            this.loadDataFromProgressor();
                    }
                    loadDataFromProgressor() {
                        const t = this.api.progressorAPI.getUserData(this.getStorageKey());
                        if (t && "string" == typeof t) {
                            const e = this.api.getDataByName(this.getStorageKey()),
                                s = JSON.parse(t);
                            this.api.shouldUpdateLocalStorage(e, s) && this.saveToLocalStorage(t);
                        }
                    }
                    completeItem(t, e) {
                        let s = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                        if (this.isCompleted(t, e)) return;
                        if (
                            (this.api.addToLocalStorageByKey(
                                this.getStorageKey(),
                                [{ type: t, id: e, updatedAt: new Date().toISOString() }],
                                (t, e) => void 0 !== e.id && void 0 !== t.id && e.id.toString() === t.id.toString() && void 0 !== e.type && void 0 !== t.type && e.type.toString() === t.type.toString()
                            ),
                                this.saveToStorage(),
                                s)
                        ) {
                            const s = new CustomEvent(M, { detail: { type: t, itemId: e, action: _t, isDevKit: !1 } });
                            document.dispatchEvent(s);
                        }
                    }
                },
                Di = "BeforeUnload",
                xi = "SpaceApi",
                Pi = "ReporterApi",
                Ai = "Report",
                Oi = "TourTriggersControl",
                _i = "CommonTriggersControl",
                $i = "Loader",
                Bi = "ProgressorApi",
                Ri = "UsetifulTags",
                Ni = "Dismiss",
                ji = "ButtonControl",
                Mi = "AvailableOnPage",
                Ui = "LocalStorageCleaner",
                Fi = "StorageApiTour",
                Hi = "StorageApiSmartTips",
                Wi = "CompletionApi",
                qi = {
                    LocalStorage: "LocalStorage",
                    apiToken: "apiToken",
                    reporterBasePath: "reporterBasePath",
                    license: "license",
                    watermark: "watermark",
                    assistantInstance: "assistantInstance",
                    checklistInstance: "checklistInstance",
                    toursInstance: "toursInstance",
                    tourType: i,
                    smartTipsType: Ii,
                    tourStorageKeyName: ot,
                    smartTipsGroupStorageKeyName: at,
                },
                Vi = new kt(),
                Ki = (t) => Vi.get(t),
                Ji = (t, e) => Vi.registerConstant(t, e);
            function zi(t) {
                return t.split("-")[0];
            }
            function Gi(t) {
                return t.split("-")[1];
            }
            function Qi(t) {
                return ["top", "bottom"].includes(zi(t)) ? "x" : "y";
            }
            function Xi(t) {
                return "y" === t ? "height" : "width";
            }
            function Yi(t, e, s) {
                let { reference: i, floating: r } = t;
                const n = i.x + i.width / 2 - r.width / 2,
                    o = i.y + i.height / 2 - r.height / 2,
                    a = Qi(e),
                    l = Xi(a),
                    c = i[l] / 2 - r[l] / 2,
                    h = "x" === a;
                let u;
                switch (zi(e)) {
                    case "top":
                        u = { x: n, y: i.y - r.height };
                        break;
                    case "bottom":
                        u = { x: n, y: i.y + i.height };
                        break;
                    case "right":
                        u = { x: i.x + i.width, y: o };
                        break;
                    case "left":
                        u = { x: i.x - r.width, y: o };
                        break;
                    default:
                        u = { x: i.x, y: i.y };
                }
                switch (Gi(e)) {
                    case "start":
                        u[a] -= c * (s && h ? -1 : 1);
                        break;
                    case "end":
                        u[a] += c * (s && h ? -1 : 1);
                }
                return u;
            }
            function Zi(t) {
                return "number" != typeof t
                    ? (function (t) {
                        return { top: 0, right: 0, bottom: 0, left: 0, ...t };
                    })(t)
                    : { top: t, right: t, bottom: t, left: t };
            }
            function tr(t) {
                return { ...t, top: t.y, left: t.x, right: t.x + t.width, bottom: t.y + t.height };
            }
            async function er(t, e) {
                var s;
                void 0 === e && (e = {});
                const { x: i, y: r, platform: n, rects: o, elements: a, strategy: l } = t,
                    { boundary: c = "clippingAncestors", rootBoundary: h = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: p = 0 } = e,
                    g = Zi(p),
                    m = a[d ? ("floating" === u ? "reference" : "floating") : u],
                    f = tr(
                        await n.getClippingRect({
                            element: null == (s = await (null == n.isElement ? void 0 : n.isElement(m))) || s ? m : m.contextElement || (await (null == n.getDocumentElement ? void 0 : n.getDocumentElement(a.floating))),
                            boundary: c,
                            rootBoundary: h,
                            strategy: l,
                        })
                    ),
                    v = tr(
                        n.convertOffsetParentRelativeRectToViewportRelativeRect
                            ? await n.convertOffsetParentRelativeRectToViewportRelativeRect({
                                rect: "floating" === u ? { ...o.floating, x: i, y: r } : o.reference,
                                offsetParent: await (null == n.getOffsetParent ? void 0 : n.getOffsetParent(a.floating)),
                                strategy: l,
                            })
                            : o[u]
                    );
                return { top: f.top - v.top + g.top, bottom: v.bottom - f.bottom + g.bottom, left: f.left - v.left + g.left, right: v.right - f.right + g.right };
            }
            const sr = Math.min,
                ir = Math.max;
            function rr(t, e, s) {
                return ir(t, sr(e, s));
            }
            const nr = { left: "right", right: "left", bottom: "top", top: "bottom" };
            function or(t) {
                return t.replace(/left|right|bottom|top/g, (t) => nr[t]);
            }
            function ar(t, e, s) {
                void 0 === s && (s = !1);
                const i = Gi(t),
                    r = Qi(t),
                    n = Xi(r);
                let o = "x" === r ? (i === (s ? "end" : "start") ? "right" : "left") : "start" === i ? "bottom" : "top";
                return e.reference[n] > e.floating[n] && (o = or(o)), { main: o, cross: or(o) };
            }
            const lr = { start: "end", end: "start" };
            function cr(t) {
                return t.replace(/start|end/g, (t) => lr[t]);
            }
            const hr = ["top", "right", "bottom", "left"],
                ur = hr.reduce((t, e) => t.concat(e, e + "-start", e + "-end"), []);
            const dr = function (t) {
                return (
                    void 0 === t && (t = 0),
                        {
                            name: "offset",
                            options: t,
                            async fn(e) {
                                const { x: s, y: i } = e,
                                    r = await (async function (t, e) {
                                        const { placement: s, platform: i, elements: r } = t,
                                            n = await (null == i.isRTL ? void 0 : i.isRTL(r.floating)),
                                            o = zi(s),
                                            a = Gi(s),
                                            l = "x" === Qi(s),
                                            c = ["left", "top"].includes(o) ? -1 : 1,
                                            h = n && l ? -1 : 1,
                                            u = "function" == typeof e ? e(t) : e;
                                        let { mainAxis: d, crossAxis: p, alignmentAxis: g } = "number" == typeof u ? { mainAxis: u, crossAxis: 0, alignmentAxis: null } : { mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...u };
                                        return a && "number" == typeof g && (p = "end" === a ? -1 * g : g), l ? { x: p * h, y: d * c } : { x: d * c, y: p * h };
                                    })(e, t);
                                return { x: s + r.x, y: i + r.y, data: r };
                            },
                        }
                );
            };
            function pr(t) {
                return "x" === t ? "y" : "x";
            }
            const gr = function (t) {
                return (
                    void 0 === t && (t = {}),
                        {
                            name: "shift",
                            options: t,
                            async fn(e) {
                                const { x: s, y: i, placement: r } = e,
                                    {
                                        mainAxis: n = !0,
                                        crossAxis: o = !1,
                                        limiter: a = {
                                            fn: (t) => {
                                                let { x: e, y: s } = t;
                                                return { x: e, y: s };
                                            },
                                        },
                                        ...l
                                    } = t,
                                    c = { x: s, y: i },
                                    h = await er(e, l),
                                    u = Qi(zi(r)),
                                    d = pr(u);
                                let p = c[u],
                                    g = c[d];
                                if (n) {
                                    const t = "y" === u ? "bottom" : "right";
                                    p = rr(p + h["y" === u ? "top" : "left"], p, p - h[t]);
                                }
                                if (o) {
                                    const t = "y" === d ? "bottom" : "right";
                                    g = rr(g + h["y" === d ? "top" : "left"], g, g - h[t]);
                                }
                                const m = a.fn({ ...e, [u]: p, [d]: g });
                                return { ...m, data: { x: m.x - s, y: m.y - i } };
                            },
                        }
                );
            };
            function mr(t) {
                return t && t.document && t.location && t.alert && t.setInterval;
            }
            function fr(t) {
                if (null == t) return window;
                if (!mr(t)) {
                    const e = t.ownerDocument;
                    return (e && e.defaultView) || window;
                }
                return t;
            }
            function vr(t) {
                return fr(t).getComputedStyle(t);
            }
            function yr(t) {
                return mr(t) ? "" : t ? (t.nodeName || "").toLowerCase() : "";
            }
            function br() {
                const t = navigator.userAgentData;
                return null != t && t.brands ? t.brands.map((t) => t.brand + "/" + t.version).join(" ") : navigator.userAgent;
            }
            function wr(t) {
                return t instanceof fr(t).HTMLElement;
            }
            function Tr(t) {
                return t instanceof fr(t).Element;
            }
            function Sr(t) {
                return "undefined" != typeof ShadowRoot && (t instanceof fr(t).ShadowRoot || t instanceof ShadowRoot);
            }
            function Cr(t) {
                const { overflow: e, overflowX: s, overflowY: i } = vr(t);
                return /auto|scroll|overlay|hidden/.test(e + i + s);
            }
            function kr(t) {
                return ["table", "td", "th"].includes(yr(t));
            }
            function Ir(t) {
                const e = /firefox/i.test(br()),
                    s = vr(t);
                return "none" !== s.transform || "none" !== s.perspective || "paint" === s.contain || ["transform", "perspective"].includes(s.willChange) || (e && "filter" === s.willChange) || (e && !!s.filter && "none" !== s.filter);
            }
            function Er() {
                return !/^((?!chrome|android).)*safari/i.test(br());
            }
            const Lr = Math.min,
                Dr = Math.max,
                xr = Math.round;
            function Pr(t, e, s) {
                var i, r, n, o;
                void 0 === e && (e = !1), void 0 === s && (s = !1);
                const a = t.getBoundingClientRect();
                let l = 1,
                    c = 1;
                e && wr(t) && ((l = (t.offsetWidth > 0 && xr(a.width) / t.offsetWidth) || 1), (c = (t.offsetHeight > 0 && xr(a.height) / t.offsetHeight) || 1));
                const h = Tr(t) ? fr(t) : window,
                    u = !Er() && s,
                    d = (a.left + (u && null != (i = null == (r = h.visualViewport) ? void 0 : r.offsetLeft) ? i : 0)) / l,
                    p = (a.top + (u && null != (n = null == (o = h.visualViewport) ? void 0 : o.offsetTop) ? n : 0)) / c,
                    g = a.width / l,
                    m = a.height / c;
                return { width: g, height: m, top: p, right: d + g, bottom: p + m, left: d, x: d, y: p };
            }
            function Ar(t) {
                return ((e = t), (e instanceof fr(e).Node ? t.ownerDocument : t.document) || window.document).documentElement;
                var e;
            }
            function Or(t) {
                return Tr(t) ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop } : { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
            }
            function _r(t) {
                return Pr(Ar(t)).left + Or(t).scrollLeft;
            }
            function $r(t, e, s) {
                const i = wr(e),
                    r = Ar(e),
                    n = Pr(
                        t,
                        i &&
                        (function (t) {
                            const e = Pr(t);
                            return xr(e.width) !== t.offsetWidth || xr(e.height) !== t.offsetHeight;
                        })(e),
                        "fixed" === s
                    );
                let o = { scrollLeft: 0, scrollTop: 0 };
                const a = { x: 0, y: 0 };
                if (i || (!i && "fixed" !== s))
                    if ((("body" !== yr(e) || Cr(r)) && (o = Or(e)), wr(e))) {
                        const t = Pr(e, !0);
                        (a.x = t.x + e.clientLeft), (a.y = t.y + e.clientTop);
                    } else r && (a.x = _r(r));
                return { x: n.left + o.scrollLeft - a.x, y: n.top + o.scrollTop - a.y, width: n.width, height: n.height };
            }
            function Br(t) {
                return "html" === yr(t) ? t : t.assignedSlot || t.parentNode || (Sr(t) ? t.host : null) || Ar(t);
            }
            function Rr(t) {
                return wr(t) && "fixed" !== getComputedStyle(t).position ? t.offsetParent : null;
            }
            function Nr(t) {
                const e = fr(t);
                let s = Rr(t);
                for (; s && kr(s) && "static" === getComputedStyle(s).position; ) s = Rr(s);
                return s && ("html" === yr(s) || ("body" === yr(s) && "static" === getComputedStyle(s).position && !Ir(s)))
                    ? e
                    : s ||
                    (function (t) {
                        let e = Br(t);
                        for (Sr(e) && (e = e.host); wr(e) && !["html", "body"].includes(yr(e)); ) {
                            if (Ir(e)) return e;
                            e = e.parentNode;
                        }
                        return null;
                    })(t) ||
                    e;
            }
            function jr(t) {
                if (wr(t)) return { width: t.offsetWidth, height: t.offsetHeight };
                const e = Pr(t);
                return { width: e.width, height: e.height };
            }
            function Mr(t) {
                const e = Br(t);
                return ["html", "body", "#document"].includes(yr(e)) ? t.ownerDocument.body : wr(e) && Cr(e) ? e : Mr(e);
            }
            function Ur(t, e) {
                var s;
                void 0 === e && (e = []);
                const i = Mr(t),
                    r = i === (null == (s = t.ownerDocument) ? void 0 : s.body),
                    n = fr(i),
                    o = r ? [n].concat(n.visualViewport || [], Cr(i) ? i : []) : i,
                    a = e.concat(o);
                return r ? a : a.concat(Ur(o));
            }
            function Fr(t, e, s) {
                return "viewport" === e
                    ? tr(
                        (function (t, e) {
                            const s = fr(t),
                                i = Ar(t),
                                r = s.visualViewport;
                            let n = i.clientWidth,
                                o = i.clientHeight,
                                a = 0,
                                l = 0;
                            if (r) {
                                (n = r.width), (o = r.height);
                                const t = Er();
                                (t || (!t && "fixed" === e)) && ((a = r.offsetLeft), (l = r.offsetTop));
                            }
                            return { width: n, height: o, x: a, y: l };
                        })(t, s)
                    )
                    : Tr(e)
                        ? (function (t, e) {
                            const s = Pr(t, !1, "fixed" === e),
                                i = s.top + t.clientTop,
                                r = s.left + t.clientLeft;
                            return { top: i, left: r, x: r, y: i, right: r + t.clientWidth, bottom: i + t.clientHeight, width: t.clientWidth, height: t.clientHeight };
                        })(e, s)
                        : tr(
                            (function (t) {
                                var e;
                                const s = Ar(t),
                                    i = Or(t),
                                    r = null == (e = t.ownerDocument) ? void 0 : e.body,
                                    n = Dr(s.scrollWidth, s.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0),
                                    o = Dr(s.scrollHeight, s.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0);
                                let a = -i.scrollLeft + _r(t);
                                const l = -i.scrollTop;
                                return "rtl" === vr(r || s).direction && (a += Dr(s.clientWidth, r ? r.clientWidth : 0) - n), { width: n, height: o, x: a, y: l };
                            })(Ar(t))
                        );
            }
            function Hr(t) {
                const e = Ur(t),
                    s = ["absolute", "fixed"].includes(vr(t).position) && wr(t) ? Nr(t) : t;
                return Tr(s)
                    ? e.filter(
                        (t) =>
                            Tr(t) &&
                            (function (t, e) {
                                const s = null == e.getRootNode ? void 0 : e.getRootNode();
                                if (t.contains(e)) return !0;
                                if (s && Sr(s)) {
                                    let s = e;
                                    do {
                                        if (s && t === s) return !0;
                                        s = s.parentNode || s.host;
                                    } while (s);
                                }
                                return !1;
                            })(t, s) &&
                            "body" !== yr(t)
                    )
                    : [];
            }
            const Wr = {
                getClippingRect: function (t) {
                    let { element: e, boundary: s, rootBoundary: i, strategy: r } = t;
                    const n = [...("clippingAncestors" === s ? Hr(e) : [].concat(s)), i],
                        o = n[0],
                        a = n.reduce((t, s) => {
                            const i = Fr(e, s, r);
                            return (t.top = Dr(i.top, t.top)), (t.right = Lr(i.right, t.right)), (t.bottom = Lr(i.bottom, t.bottom)), (t.left = Dr(i.left, t.left)), t;
                        }, Fr(e, o, r));
                    return { width: a.right - a.left, height: a.bottom - a.top, x: a.left, y: a.top };
                },
                convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
                    let { rect: e, offsetParent: s, strategy: i } = t;
                    const r = wr(s),
                        n = Ar(s);
                    if (s === n) return e;
                    let o = { scrollLeft: 0, scrollTop: 0 };
                    const a = { x: 0, y: 0 };
                    if ((r || (!r && "fixed" !== i)) && (("body" !== yr(s) || Cr(n)) && (o = Or(s)), wr(s))) {
                        const t = Pr(s, !0);
                        (a.x = t.x + s.clientLeft), (a.y = t.y + s.clientTop);
                    }
                    return { ...e, x: e.x - o.scrollLeft + a.x, y: e.y - o.scrollTop + a.y };
                },
                isElement: Tr,
                getDimensions: jr,
                getOffsetParent: Nr,
                getDocumentElement: Ar,
                getElementRects: (t) => {
                    let { reference: e, floating: s, strategy: i } = t;
                    return { reference: $r(e, Nr(s), i), floating: { ...jr(s), x: 0, y: 0 } };
                },
                getClientRects: (t) => Array.from(t.getClientRects()),
                isRTL: (t) => "rtl" === vr(t).direction,
            };
            function qr(t, e, s, i) {
                void 0 === i && (i = {});
                const { ancestorScroll: r = !0, ancestorResize: n = !0, elementResize: o = !0, animationFrame: a = !1 } = i,
                    l = r && !a,
                    c = n && !a,
                    h = l || c ? [...(Tr(t) ? Ur(t) : []), ...Ur(e)] : [];
                h.forEach((t) => {
                    l && t.addEventListener("scroll", s, { passive: !0 }), c && t.addEventListener("resize", s);
                });
                let u,
                    d = null;
                if (o) {
                    let i = !0;
                    (d = new ResizeObserver(() => {
                        i || s(), (i = !1);
                    })),
                    Tr(t) && !a && d.observe(t),
                        d.observe(e);
                }
                let p = a ? Pr(t) : null;
                return (
                    a &&
                    (function e() {
                        const i = Pr(t);
                        !p || (i.x === p.x && i.y === p.y && i.width === p.width && i.height === p.height) || s(), (p = i), (u = requestAnimationFrame(e));
                    })(),
                        s(),
                        () => {
                            var t;
                            h.forEach((t) => {
                                l && t.removeEventListener("scroll", s), c && t.removeEventListener("resize", s);
                            }),
                            null == (t = d) || t.disconnect(),
                                (d = null),
                            a && cancelAnimationFrame(u);
                        }
                );
            }
            const Vr = (t, e, s) =>
                    (async (t, e, s) => {
                        const { placement: i = "bottom", strategy: r = "absolute", middleware: n = [], platform: o } = s,
                            a = await (null == o.isRTL ? void 0 : o.isRTL(e));
                        let l = await o.getElementRects({ reference: t, floating: e, strategy: r }),
                            { x: c, y: h } = Yi(l, i, a),
                            u = i,
                            d = {},
                            p = 0;
                        for (let s = 0; s < n.length; s++) {
                            const { name: g, fn: m } = n[s],
                                { x: f, y: v, data: y, reset: b } = await m({ x: c, y: h, initialPlacement: i, placement: u, strategy: r, middlewareData: d, rects: l, platform: o, elements: { reference: t, floating: e } });
                            (c = null != f ? f : c),
                                (h = null != v ? v : h),
                                (d = { ...d, [g]: { ...d[g], ...y } }),
                            b &&
                            p <= 50 &&
                            (p++,
                            "object" == typeof b && (b.placement && (u = b.placement), b.rects && (l = !0 === b.rects ? await o.getElementRects({ reference: t, floating: e, strategy: r }) : b.rects), ({ x: c, y: h } = Yi(l, u, a))),
                                (s = -1));
                        }
                        return { x: c, y: h, placement: u, strategy: r, middlewareData: d };
                    })(t, e, { platform: Wr, ...s }),
                Kr = () => {
                    ((t) => {
                        const e = document.querySelectorAll(`.${Ue.overlay}`);
                        e &&
                        Array.prototype.forEach.call(e, (e) => {
                            e.classList.remove(t);
                        });
                    })(Ue.visible);
                },
                Jr = () => {
                    ((t) => {
                        const e = document.querySelectorAll(`.${Ue.overlay}`);
                        e &&
                        Array.prototype.forEach.call(e, (e) => {
                            e.classList.add(t);
                        });
                    })(Ue.visible);
                },
                zr = () => {
                    const t = document.querySelectorAll(`.${Ue.overlay}`);
                    t &&
                    Array.prototype.forEach.call(t, (t) => {
                        t.parentNode.removeChild(t);
                    });
                };
            function Gr(t) {
                t.setAttribute("data-show", "");
            }
            function Qr(t, e) {
                if ((t.removeAttribute("data-show"), e)) {
                    const t = document.getElementById(e);
                    null == t || t.classList.remove("max-zindex");
                }
                const s = new CustomEvent(j, { detail: { bubbleId: t.getAttribute("id") } });
                document.dispatchEvent(s);
            }
            const Xr = function () {
                    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "absolute";
                    const e = (() => {
                        const t = {};
                        return (
                            ["right", "left", "top", "bottom"].forEach((e) => {
                                let s = document.querySelector(`.${Ue.overlay}.${Ue[e]}`);
                                s || ((s = document.createElement("div")), s.classList.add(Ue.overlay, Ue[e]), document.body.appendChild(s)), (t[e] = s);
                            }),
                                t
                        );
                    })();
                    return (
                        Object.values(e).forEach((e) => {
                            e.style.position = t;
                        }),
                            Jr(),
                            e
                    );
                },
                Yr = (t) => ({
                    name: "backdrop",
                    options: t,
                    fn(e) {
                        var s, i;
                        if (t)
                            if (null === (i = null === (s = e.modifiersData) || void 0 === s ? void 0 : s.hide) || void 0 === i ? void 0 : i.isReferenceHidden) Kr();
                            else {
                                const { x: s, y: i, width: r, height: n } = e.rects.reference;
                                !(function (t, e, s) {
                                    let i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 5;
                                    const { top: r, left: n, right: o, bottom: a } = t,
                                        { x: l, y: c, width: h, height: u } = e || { x: 0, y: 0, width: 0, height: 0 },
                                        { max: d, min: p, floor: g } = Math,
                                        { clientHeight: m, scrollHeight: f, clientWidth: v, scrollWidth: y } = document.body,
                                        { innerHeight: b, innerWidth: w } = window,
                                        T = "fixed" === s ? b - 1 : d(b, m, f),
                                        S = "fixed" === s ? w - 1 : d(v, y, w),
                                        C = g(d(l - i, 0)),
                                        k = g(d(c - i, 0)),
                                        I = g(p(l + i + h, S)),
                                        E = g(p(c + i + u, T));
                                    (n.style.width = `${C}px`),
                                        (n.style.height = `${T}px`),
                                        (r.style.left = `${C}px`),
                                        (r.style.width = I - C + "px"),
                                        (r.style.height = `${k}px`),
                                        (a.style.left = `${C}px`),
                                        (a.style.top = `${E}px`),
                                        (a.style.width = I - C + "px"),
                                        (a.style.height = T - E + "px"),
                                        (o.style.left = `${I}px`),
                                        (o.style.height = `${T}px`),
                                        (o.style.width = S - I + "px");
                                })(t, { x: s, y: i, width: r, height: n }, e.strategy, 5),
                                    Jr();
                            }
                        return e;
                    },
                }),
                Zr = (t) =>
                    t
                        ? (function (t) {
                            return (
                                void 0 === t && (t = {}),
                                    {
                                        name: "autoPlacement",
                                        options: t,
                                        async fn(e) {
                                            var s, i, r, n, o;
                                            const { x: a, y: l, rects: c, middlewareData: h, placement: u, platform: d, elements: p } = e,
                                                { alignment: g = null, allowedPlacements: m = ur, autoAlignment: f = !0, ...v } = t,
                                                y = (function (t, e, s) {
                                                    return (t ? [...s.filter((e) => Gi(e) === t), ...s.filter((e) => Gi(e) !== t)] : s.filter((t) => zi(t) === t)).filter((s) => !t || Gi(s) === t || (!!e && cr(s) !== s));
                                                })(g, f, m),
                                                b = await er(e, v),
                                                w = null != (s = null == (i = h.autoPlacement) ? void 0 : i.index) ? s : 0,
                                                T = y[w];
                                            if (null == T) return {};
                                            const { main: S, cross: C } = ar(T, c, await (null == d.isRTL ? void 0 : d.isRTL(p.floating)));
                                            if (u !== T) return { x: a, y: l, reset: { placement: y[0] } };
                                            const k = [b[zi(T)], b[S], b[C]],
                                                I = [...(null != (r = null == (n = h.autoPlacement) ? void 0 : n.overflows) ? r : []), { placement: T, overflows: k }],
                                                E = y[w + 1];
                                            if (E) return { data: { index: w + 1, overflows: I }, reset: { placement: E } };
                                            const L = I.slice().sort((t, e) => t.overflows[0] - e.overflows[0]),
                                                D =
                                                    null ==
                                                    (o = L.find((t) => {
                                                        let { overflows: e } = t;
                                                        return e.every((t) => t <= 0);
                                                    }))
                                                        ? void 0
                                                        : o.placement,
                                                x = null != D ? D : L[0].placement;
                                            return x !== u ? { data: { index: w + 1, overflows: I }, reset: { placement: x } } : {};
                                        },
                                    }
                            );
                        })()
                        : (function (t) {
                            return (
                                void 0 === t && (t = {}),
                                    {
                                        name: "flip",
                                        options: t,
                                        async fn(e) {
                                            var s;
                                            const { placement: i, middlewareData: r, rects: n, initialPlacement: o, platform: a, elements: l } = e,
                                                { mainAxis: c = !0, crossAxis: h = !0, fallbackPlacements: u, fallbackStrategy: d = "bestFit", flipAlignment: p = !0, ...g } = t,
                                                m = zi(i),
                                                f =
                                                    u ||
                                                    (m !== o && p
                                                        ? (function (t) {
                                                            const e = or(t);
                                                            return [cr(t), e, cr(e)];
                                                        })(o)
                                                        : [or(o)]),
                                                v = [o, ...f],
                                                y = await er(e, g),
                                                b = [];
                                            let w = (null == (s = r.flip) ? void 0 : s.overflows) || [];
                                            if ((c && b.push(y[m]), h)) {
                                                const { main: t, cross: e } = ar(i, n, await (null == a.isRTL ? void 0 : a.isRTL(l.floating)));
                                                b.push(y[t], y[e]);
                                            }
                                            if (((w = [...w, { placement: i, overflows: b }]), !b.every((t) => t <= 0))) {
                                                var T, S;
                                                const t = (null != (T = null == (S = r.flip) ? void 0 : S.index) ? T : 0) + 1,
                                                    e = v[t];
                                                if (e) return { data: { index: t, overflows: w }, reset: { placement: e } };
                                                let s = "bottom";
                                                switch (d) {
                                                    case "bestFit": {
                                                        var C;
                                                        const t = null == (C = w.map((t) => [t, t.overflows.filter((t) => t > 0).reduce((t, e) => t + e, 0)]).sort((t, e) => t[1] - e[1])[0]) ? void 0 : C[0].placement;
                                                        t && (s = t);
                                                        break;
                                                    }
                                                    case "initialPlacement":
                                                        s = o;
                                                }
                                                if (i !== s) return { reset: { placement: s } };
                                            }
                                            return {};
                                        },
                                    }
                            );
                        })();
            function tn(t) {
                return window.innerWidth < 1e3 ? "auto" : t;
            }
            const en = (t) => {
                let { targetElement: e, bubble: s, orientation: i, extraModifier: r } = t;
                i = tn(i);
                const n = s.querySelector("[data-floating-arrow]");
                let o = [dr(25), Zr("auto" === i), gr({ padding: 5, crossAxis: !0 })];
                return (
                    r && r.length && (o = [...o, ...r]),
                    n &&
                    o.push(
                        ((t) => ({
                            name: "arrow",
                            options: t,
                            async fn(e) {
                                const { element: s, padding: i = 0 } = null != t ? t : {},
                                    { x: r, y: n, placement: o, rects: a, platform: l } = e;
                                if (null == s) return {};
                                const c = Zi(i),
                                    h = { x: r, y: n },
                                    u = Qi(o),
                                    d = Gi(o),
                                    p = Xi(u),
                                    g = await l.getDimensions(s),
                                    m = "y" === u ? "top" : "left",
                                    f = "y" === u ? "bottom" : "right",
                                    v = a.reference[p] + a.reference[u] - h[u] - a.floating[p],
                                    y = h[u] - a.reference[u],
                                    b = await (null == l.getOffsetParent ? void 0 : l.getOffsetParent(s));
                                let w = b ? ("y" === u ? b.clientHeight || 0 : b.clientWidth || 0) : 0;
                                0 === w && (w = a.floating[p]);
                                const T = v / 2 - y / 2,
                                    S = c[m],
                                    C = w - g[p] - c[f],
                                    k = w / 2 - g[p] / 2 + T,
                                    I = rr(S, k, C),
                                    E = ("start" === d ? c[m] : c[f]) > 0 && k !== I && a.reference[p] <= a.floating[p];
                                return { [u]: h[u] - (E ? (k < S ? S - k : C - k) : 0), data: { [u]: I, centerOffset: k - I } };
                            },
                        }))({ element: n })
                    ),
                        Vr(e, s, { placement: "auto" !== i ? i : void 0, middleware: o }).then((t) => {
                            let { x: e, y: i, placement: r, middlewareData: o } = t;
                            Object.assign(s.style, { left: `${e}px`, top: `${i}px` }), s.setAttribute("data-floating-placement", r);
                            const a = o.arrow;
                            n && Object.assign(n.style, { left: null != (null == a ? void 0 : a.x) ? `${null == a ? void 0 : a.x}px` : "", top: null != (null == a ? void 0 : a.y) ? `${null == a ? void 0 : a.y}px` : "", right: "", bottom: "" });
                        })
                );
            };
            const sn = class {
                    constructor(t, e) {
                        (this.getReverseEventName = (t) => {
                            let e;
                            switch (t) {
                                case "mouseover":
                                    e = "mouseleave";
                                    break;
                                case "focus":
                                    e = "blur";
                                    break;
                                default:
                                    e = null;
                            }
                            return e;
                        }),
                            (this.linkClickAction = (t) => {
                                t.target instanceof HTMLAnchorElement && t.target.href && window.open(t.target.href, t.target.target);
                            }),
                            (this.registerClickEventsInBubble = (t) => {
                                t.querySelectorAll("a").forEach((t) => {
                                    t.addEventListener("mousedown", this.linkClickAction);
                                });
                            }),
                            (this.unRegisterClickEventsInBubble = (t) => {
                                t.querySelectorAll("a").forEach((t) => {
                                    t.removeEventListener("mousedown", this.linkClickAction);
                                });
                            }),
                            (this.getTarget = (t, e) => {
                                const { target: s } = t;
                                try {
                                    const t = s.closest(e);
                                    if (t) return t;
                                } catch (t) {
                                    return s;
                                }
                                return s;
                            }),
                            (this.preActions = (t, e) => {
                                if ("focus" === t) {
                                    const t = hs(e);
                                    t instanceof Element && !t.hasAttribute("tabindex") && t.setAttribute("tabindex", "0");
                                }
                            }),
                            (this.processEvents = (t, e, s) => {
                                var i, r;
                                const n = ps(e);
                                n.isAShadowDomSelector && n.childSelector && (e = n.childSelector);
                                let o,
                                    a = this.getReverseEventName(t) || "";
                                this.preActions(t, e);
                                const l = (i) => {
                                    const r = this.getTarget(i, e);
                                    if (e && r && r instanceof HTMLElement && r.matches(e)) {
                                        switch (t) {
                                            case "mouseover":
                                                r.removeEventListener(a, this.hideCallbackFunction),
                                                    this.showPositionedElement(r, s, () => {
                                                        this.hideCallbackFunction(s);
                                                    }),
                                                    r.addEventListener(a, () => {
                                                        this.hideCallbackFunction(s);
                                                    });
                                                break;
                                            case "focus":
                                                (o = be(r, s, null == n ? void 0 : n.shadowDomSelector)),
                                                    this.showPositionedElement(r, s, () => {
                                                        we(o), this.unRegisterClickEventsInBubble(s), this.hideCallbackFunction(s);
                                                    }),
                                                    this.registerClickEventsInBubble(s),
                                                    r.addEventListener(a, () => {
                                                        we(o), this.unRegisterClickEventsInBubble(s), this.hideCallbackFunction(s);
                                                    });
                                                break;
                                            case "click":
                                                (o = be(r, s, null == n ? void 0 : n.shadowDomSelector)),
                                                    this.showPositionedElement(r, s, () => {
                                                        we(o), this.unRegisterClickEventsInBubble(s), this.hideCallbackFunction(s);
                                                    }),
                                                    this.registerClickEventsInBubble(s);
                                                break;
                                            default:
                                                a = "";
                                        }
                                        o &&
                                        window.addEventListener(ve, (t) => {
                                            let { detail: e } = t;
                                            we(o), this.unRegisterClickEventsInBubble(s), this.hideCallbackFunction(e);
                                        });
                                    }
                                };
                                window.usetiful_smartTipsAddedEvents || (window.usetiful_smartTipsAddedEvents = []),
                                    window.usetiful_smartTipsAddedEvents.push({ eventName: t, eventFunction: l }),
                                    n.isAShadowDomSelector && n.shadowDomSelector
                                        ? null === (r = null === (i = document.querySelector(n.shadowDomSelector)) || void 0 === i ? void 0 : i.shadowRoot) || void 0 === r || r.addEventListener(t, l, !0)
                                        : document.addEventListener(t, l, !0);
                            }),
                            (this.showPositionedElement = (t, e, s) => {
                                this.showCallbackFunction(t, e, !1, s),
                                    window.addEventListener("resize", () => {
                                        this.showCallbackFunction(t, e, !0);
                                    });
                            }),
                            (this.init = (t, e, s) => {
                                this.processEvents(t, e, s);
                            }),
                            (this.showCallbackFunction = t),
                            (this.hideCallbackFunction = e);
                    }
                },
                rn = "reaction",
                nn = { activeStepId: 0, values: { feedback: !1, surveyType: rn, surveyId: null, surveyQuestion: "", surveyMinimalValueLabel: "", surveyMaximalValueLabel: "" }, handleUpdateValue: () => {} },
                on = "Primary",
                an = "Secondary",
                ln = {};
            (ln[Ze] = { value: "Next", type: Ze, styleType: on }),
                (ln[ts] = { value: "Previous", type: ts, styleType: an }),
                (ln[es] = { value: "Go to", type: es, styleType: on, to: "" }),
                (ln[ss] = { value: "Go to", type: ss, styleType: on, url: "" }),
                (ln[is] = { value: "Another tour", type: is, styleType: an, url: "", tourId: 0 }),
                (ln[rs] = { value: "Close", type: rs, styleType: an });
            const cn = { actions: [ln[Ze]] },
                hn = { actions: [ln[ts], ln[Ze]] },
                un = "Manual",
                dn = "Automatic",
                pn = [qe, Ve, Je, Ke],
                gn =
                    ([
                        { name: Fe, label: "Pointer", category: un },
                        { name: He, label: "Modal", category: un },
                        { name: We, label: "Slideout", category: un },
                        { name: qe, label: "Redirect", category: dn },
                        { name: Ve, label: "Delay", category: dn },
                        { name: Ke, label: "Trigger event", category: dn, permissions: [m, f], helpMessage: "Send automated events when user reaches a certain step of the tour. This feature is available in premium plan or higher." },
                        {
                            name: Je,
                            label: "Page action",
                            category: dn,
                            permissions: [m, f],
                            helpMessage: "Perform automatic action on the page when user reaches a certain step of the tour. This feature is available in premium plan or higher.",
                        },
                    ].filter((t) => {
                        let { name: e } = t;
                        return !pn.includes(e);
                    }),
                        { title: "Step", content: "Write your content here...", publicTitle: !0, surveyData: nn.values }),
                mn = {};
            (mn[Fe] = Object.assign(Object.assign({ type: Fe, highlight: !0, coordinates: { left: 0, top: 0, right: 0, bottom: 0 }, element: "", progressOnClick: t, runDefaults: !1, position: "auto", positionType: "element" }, gn), hn)),
                (mn[He] = Object.assign(Object.assign({ type: He }, gn), cn)),
                (mn[We] = Object.assign(Object.assign({ type: We, element: "", progressOnClick: t, runDefaults: !1, position: "right" }, gn), cn)),
                (mn[qe] = { type: qe, title: "Redirect", automatic: !0 }),
                (mn[Ve] = { type: Ve, title: "Delay", delay: "3" }),
                (mn[Ke] = { type: Ke, title: "Trigger Event", eventType: Xe, webhookUrl: "", element: "", eventName: "", eventContent: "" }),
                (mn[Je] = { type: Je, title: "Page action", element: "", actionType: Qe, actionValue: "" });
            const fn = "element",
                vn = "beacon";
            var yn,
                bn = function (t, e, s, i) {
                    if ("a" === s && !i) throw new TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof e ? t !== e || !i : !e.has(t)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === s ? i : "a" === s ? i.call(t) : i ? i.value : e.get(t);
                };
            yn = new WeakMap();
            const wn = class {
                constructor(t) {
                    (this.init = () => {
                        window.usetiful_smartTipsAddedEvents &&
                        window.usetiful_smartTipsAddedEvents.length &&
                        window.usetiful_smartTipsAddedEvents.forEach((t) => {
                            document.removeEventListener(t.eventName, t.eventFunction, !0);
                        });
                        const t = Ki($i);
                        if ((vt("Start loading smart tips."), void 0 === this.smartTipsGroups)) return void vt("There is no smart tips here");
                        vt("Checking available smart tips...");
                        for (const e of this.smartTipsGroups) {
                            const { name: s, targets: i, tips: r, theme: n, themeSlug: o, targetOperator: a } = e;
                            this.template.removeAllBeacons();
                            let l = 0;
                            const c = setInterval(() => {
                                (l += 1),
                                Ki(Mi).checkAvailableOnPage(wt(i), a) &&
                                this.showToUser(e) &&
                                (t.loadTheme(n, o).then((t) => {
                                    this.template.setTheme(t);
                                    for (const t of r)
                                        (t.bubble = this.template.createBubble({
                                            ident: t.name,
                                            contentHTML: t.content,
                                            title: this.template.createTitle(4, t.title) || null,
                                            hotspot: t.hotspot,
                                            customStyle: t.customStyle || null,
                                        })),
                                            this.initSmartTip(t);
                                    r.length && (this.allAvailableSmarTipsWithBeacon.push(...r), this.hotspotController());
                                }),
                                    clearInterval(c),
                                    this.localStorageHandler.setProgressToLocalStorage("seen", e)),
                                l >= 60 && (clearInterval(c), vt(`smart tip ${s} stop loading (limit reached)`));
                            }, 500);
                            window.usetiful_intervals.push(c);
                        }
                        const e = setInterval(() => {
                            this.allAvailableSmarTipsWithBeacon.length && this.hotspotController();
                        }, 2e3);
                        window.usetiful_intervals.push(e);
                    }),
                        (this.showToUser = (t) => {
                            const { id: e, trigger: s } = t;
                            return !s || (s && ("everytime" === s.type || ("once" === s.type && !this.localStorageHandler.getObjectState(e, "state"))));
                        }),
                        (this.initSmartTip = (t) => {
                            const { id: e, name: s, element: i, displayOn: r, targetOn: n, hotspot: o, orientation: a, bubble: l } = t;
                            if ((vt(`smart tip ${s} loaded`), l instanceof HTMLElement)) {
                                const t = new sn((t, i, o, l) => this.showSmartTipEventListener(t, i, a, o, s, e, l, void 0, r, n), Qr);
                                (o && n === vn) || t.init(r, i, l);
                            }
                        }),
                        (this.showSmartTipEventListener = (t, e, s, i, r, n, o, a, l, c, h, u) => {
                            if ((vt(`Smart tip displayOn: ${l} and targetOn ${c}.`), i)) return;
                            Gr(e);
                            let d = h ? hs(h) : null;
                            if (
                                (d || (d = u ? hs(u) : null),
                                    en({ targetElement: d || t, bubble: e, orientation: s }),
                                this.waitingTips.indexOf(r.toString()) < 0 && this.waitingTips.push(r.toString()),
                                    window.setTimeout(() => {
                                        if (this.waitingTips.indexOf(r.toString()) > -1) {
                                            vt(`View of smart tip ${r.toString()} reported.`);
                                            const t = new CustomEvent(M, { detail: { type: "smartTip", entityId: r, stepIndex: 0, action: Lt, itemId: n, isDevKit: !1 } });
                                            document.dispatchEvent(t);
                                        } else yt(`Smart tip ${r.toString()} was displayed for less than 1 sec. Sending to reporter skipped.`);
                                        this.waitingTips = this.waitingTips.filter((t) => t !== r.toString());
                                    }, 1e3),
                                    a)
                            ) {
                                const t = document.getElementById(a);
                                null == t || t.classList.add("max-zindex");
                            }
                            if (o) {
                                const { body: s } = document;
                                s &&
                                setTimeout(() => {
                                    this.oldTarget && (this.oldTarget.removeEventListener("click", bn(this, yn, "f")), (this.oldTarget = void 0)),
                                    this.oldBeacon && (this.oldBeacon.removeEventListener("click", bn(this, yn, "f")), (this.oldBeacon = void 0)),
                                        s.addEventListener(
                                            "click",
                                            () => {
                                                o();
                                            },
                                            { once: !0 }
                                        ),
                                    "click" === l &&
                                    (vt(`Smart tip displayOn ${l} was displayed`),
                                        e.addEventListener("click", bn(this, yn, "f")),
                                        t.addEventListener("click", bn(this, yn, "f")),
                                        (this.oldTarget = t),
                                    a && ((this.oldBeacon = document.getElementById(a)), this.oldBeacon && this.oldBeacon.addEventListener("click", bn(this, yn, "f"))));
                                }, 0);
                            }
                        }),
                        (this.hotspotController = () => {
                            const t = this.allAvailableSmarTipsWithBeacon.filter((t) => t.hotspot),
                                e = [];
                            t.forEach((t) => {
                                const s = ((t) => {
                                    if (!t) return;
                                    const e = [];
                                    for (let s = 0; s < t.length; s += 1) {
                                        const i = t[s];
                                        Ts(void 0, void 0, i) || e.push(i);
                                    }
                                    return e;
                                })(us(t.element));
                                null == s ||
                                s.forEach((s) => {
                                    let i = s.getAttribute("data-beacon-id");
                                    if (!i) {
                                        const t = (function () {
                                            let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 30,
                                                e = "US";
                                            for (let s = 0; s < t; s += 1) e += Math.random().toString(36).substr(2, 1);
                                            return e;
                                        })();
                                        (i = t), s.setAttribute("data-beacon-id", t);
                                    }
                                    e.push({ element: s, beaconId: i, smartTip: t });
                                });
                            });
                            const { added: s, deleted: i } = (function (t, e) {
                                const s = e.filter((e) => !t.find((t) => t.beaconId === e.beaconId)),
                                    i = t.filter((t) => !e.find((e) => e.beaconId === t.beaconId));
                                return { added: s, deleted: i };
                            })(this.hotSpotMemoryList, e);
                            s.length &&
                            s.forEach((t) => {
                                const e = this.template.createBeacon(
                                    t.beaconId,
                                    (function (t) {
                                        var e;
                                        let s = t,
                                            i = "auto";
                                        for (; s; ) {
                                            const { position: t } = getComputedStyle(s);
                                            if ("static" !== t) {
                                                const t = parseInt(null === (e = getComputedStyle(s)) || void 0 === e ? void 0 : e.zIndex, 10);
                                                Number.isNaN(t) || (i = t.toString());
                                            }
                                            s = s.parentElement;
                                        }
                                        return i;
                                    })(t.element),
                                    t.smartTip.hotspot.type,
                                    t.smartTip.customStyle
                                );
                                if (
                                    t.smartTip.bubble &&
                                    (t.smartTip.bubble.classList.remove(this.template.themeClasses.bubbleInvisible),
                                        ((t, e, s, i, r) => {
                                            Qr(s),
                                            e.orientation || (e.orientation = "auto" !== i ? i : "right"),
                                            "top" !== e.orientation && 0 !== e.offsetVertical && (e.offsetVertical = e.offsetVertical < 0 ? Math.abs(e.offsetVertical) : -Math.abs(e.offsetVertical)),
                                            "left" === e.orientation && 0 !== e.offsetHorizontal && (e.offsetHorizontal = e.offsetHorizontal < 0 ? Math.abs(e.offsetHorizontal) : -Math.abs(e.offsetHorizontal));
                                            const n = "top" === e.orientation || "bottom" === e.orientation,
                                                o = { mainAxis: -15 + (n ? e.offsetVertical : e.offsetHorizontal), crossAxis: 0 + (n ? e.offsetHorizontal : e.offsetVertical) },
                                                a = (s) =>
                                                    Vr(t, r, { placement: e.orientation, middleware: [dr(o)] }).then((t) => {
                                                        let { x: e, y: i } = t;
                                                        Object.assign(r.style, { left: `${e}px`, top: `${i}px` }), s && s();
                                                    });
                                            qr(t, r, () => a(), { animationFrame: !0 }), qr(t, r, () => a(), { ancestorScroll: !0 });
                                        })(t.element, Object.assign({}, t.smartTip.hotspot), t.smartTip.bubble, t.smartTip.orientation, e),
                                    t.smartTip.hotspot && t.smartTip.targetOn !== fn)
                                ) {
                                    new sn(
                                        (e, s, i, r) => this.showSmartTipEventListener(t.element, s, t.smartTip.orientation, i, t.smartTip.name, t.smartTip.id, r, t.beaconId, t.smartTip.displayOn),
                                        (e) => Qr(e, t.beaconId)
                                    ).init(t.smartTip.displayOn, `#${t.beaconId}`, t.smartTip.bubble);
                                }
                            }),
                            i.length &&
                            i.forEach((t) => {
                                const e = hs(`#${t.beaconId}`);
                                null == e || e.remove();
                            }),
                                (this.hotSpotMemoryList = e);
                        }),
                        yn.set(this, (t) => {
                            t.stopPropagation();
                        }),
                        (this.registerListeners = () => {
                            document.addEventListener(j, (t) => {
                                this.waitingTips = this.waitingTips.filter((e) => e !== t.detail.bubbleId);
                            });
                        }),
                        (this.smartTipsGroups = t),
                        (this.isWatermark = Ki(qi.watermark)),
                        (this.template = new Ds(null, this.isWatermark)),
                        (this.localStorageHandler = Ki(Hi)),
                        (this.oldTarget = null),
                        (this.oldBeacon = null),
                        (this.waitingTips = []),
                        (this.hotSpotMemoryList = []),
                        (this.allAvailableSmarTipsWithBeacon = []),
                        this.registerListeners();
                }
            };
            var Tn = '<svg class="svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>';
            const Sn = class {
                    constructor(t, e, s, i) {
                        (this.checklistItemAction = (t) => {
                            const { id: e, onClickAction: s, tourId: i, url: r, urlOpenTargetBlank: n, completionOn: o } = this.checklistItem;
                            if ((s === pi && i > 0 && (r && "" !== r ? this.tourTriggers.setTourTriggerToLocalStorage(i) : this.runTourOnClickAction(t, i)), s !== fi && r && "" !== r)) {
                                o === hi && (this.redirects.markAsRedirected(e), this.processStateClasses());
                                const t = n || !1;
                                t && this.updateProgressorData(), _s((0, q.replaceTags)(r), t);
                            }
                            s === fi && o === hi && (this.redirects.markAsRedirected(e), this.processStateClasses());
                        }),
                            (this.updateProgressorData = () => {
                                const t = Ki(Bi);
                                t.saveToApi(t.getUserId());
                            }),
                            (this.computeItemState = () => (
                                ((t, e, s, i) => {
                                    const r = new Ti(e, s),
                                        { id: o, onClickAction: a, tourId: l, completionOn: c } = t;
                                    ((c === hi && a === pi && i.getObjectStatus(l.toString()) === n) || c === gi) && r.markAsRedirected(o);
                                })(this.checklistItem, Ki(Bi), this.completionApi, Ki(Fi)),
                                    Si(this.checklistItem, Ki(Bi), this.completionApi, Ki(Fi))
                            )),
                            (this.processStateClasses = () => {
                                const t = this.computeItemState();
                                t !== wi && this.changeItemStyle(t);
                            }),
                            (this.changeItemStyle = (t) => {
                                switch (t) {
                                    case vi:
                                        this.itemElement.classList.add(this.template.themeClasses.done),
                                            (this.itemElement.dataset.ufStatus = "done"),
                                            this.template.changeItemToDoneStyle(this.checklistItem.id),
                                            this.template.checklistProgressUpdate();
                                        break;
                                    case bi:
                                        this.itemElement.classList.add(this.template.themeClasses.inProgress), (this.itemElement.dataset.ufStatus = "in-progress");
                                        break;
                                    case yi:
                                        this.itemElement.classList.remove(this.template.themeClasses.done), (this.itemElement.dataset.ufStatus = "init"), this.itemElement.classList.remove(this.template.themeClasses.inProgress);
                                }
                            }),
                            (this.checklistItemIcon = () => {
                                switch (this.computeItemState()) {
                                    case yi:
                                        return Tn;
                                    case vi:
                                        return '<svg class="svg-icon filled" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5zM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12z"/><path clip-rule="evenodd" d="M16.465 8.411a.75.75 0 01.124 1.054l-4.404 5.577a1.25 1.25 0 01-1.827.145l-2.866-2.635a.75.75 0 111.016-1.104l2.667 2.453 4.236-5.366a.75.75 0 011.054-.124z"/></svg>';
                                    case bi:
                                        return '<svg class="svg-icon filled" width="20" height="20" viewBox="0 0 40 32" xmlns="http://www.w3.org/2000/svg"><path d="M3.968 12.061A3.965 3.965 0 000 16.027a3.965 3.965 0 003.968 3.967 3.966 3.966 0 100-7.933zm12.265 0a3.967 3.967 0 00-3.968 3.965c0 2.192 1.778 3.967 3.968 3.967s3.97-1.772 3.97-3.967a3.97 3.97 0 00-3.97-3.965zm11.857 0a3.967 3.967 0 10-.005 7.933 3.967 3.967 0 00.005-7.933z"/></svg>';
                                    default:
                                        return Tn;
                                }
                            }),
                            (this.render = () => ((this.itemElement.innerHTML = `${this.checklistItemIcon()}<span>${(0, q.replaceTags)(this.checklistItem.title)}</span>`), this.itemElement)),
                            (this.checklistItem = t),
                            (this.template = e),
                            (this.runTourOnClickAction = s),
                            (this.tourTriggers = i),
                            (this.itemElement = this.template.createButton("", this.template.themeClasses.button)),
                            this.itemElement.classList.add(this.template.themeClasses.buttonBlock),
                            (this.itemElement.dataset.id = this.checklistItem.id),
                            this.itemElement.addEventListener(
                                "click",
                                (t) => {
                                    if (t && t.target instanceof HTMLElement) {
                                        const e = t.target.closest('[data-uf-content="checklist"]'),
                                            s = null == e ? void 0 : e.dataset.id,
                                            i = new CustomEvent(M, { detail: { type: Jt, entityId: s, itemId: this.checklistItem.id, action: xt, isDevKit: !1 } });
                                        document.dispatchEvent(i);
                                    }
                                    this.checklistItemAction(t);
                                },
                                !1
                            ),
                            (this.completionApi = Ki(Wi)),
                            (this.redirects = new Ti(Ki(Bi), this.completionApi)),
                            this.processStateClasses();
                    }
                },
                Cn = (t, e) => {
                    const s = new CustomEvent(k, { detail: { type: t, id: e } });
                    document.dispatchEvent(s);
                };
            window.USETIFUL || (window.USETIFUL = {});
            class kn {
                constructor(t, e) {
                    (this.setTourSelection = (t) => {
                        window.localStorage.setItem(u, t);
                    }),
                        (this.isTourSelectionEnabled = (t) => {
                            const e = window.localStorage.getItem(u);
                            return "enabled" === e || (null === e && !t);
                        }),
                        (this.destroy = () => {
                            var t;
                            this.hideTourSelection(), (null === (t = this.mainButton.id) || void 0 === t ? void 0 : t.startsWith("checklist")) && this.mainButton.destroy();
                        }),
                        (this.init = () => {
                            this.hideTourSelection(),
                                ((t, e, s) => {
                                    const i = {
                                        start: (s) => {
                                            const i = t.find((t) => t.id === s);
                                            if (!i) throw new Error("Your checklist Id is not valid!");
                                            Cn(y, s),
                                                setTimeout(() => {
                                                    window.localStorage.setItem(c, i), window.localStorage.setItem(u, "enabled"), e(i);
                                                }, 500);
                                        },
                                        close: () => {},
                                        done: (i, r) => {
                                            const n = localStorage.getItem(c);
                                            if (r) r !== n && window.USETIFUL.checklist.close();
                                            else if (!(r = n)) throw new Error("Please send checklistId as a second parameter or run a checklist by start API");
                                            const o = t.find((t) => t.id === r);
                                            if (!o) throw new Error("Your checklist Id is not valid!");
                                            i.forEach((t) => {
                                                if (!o.items.length || !o.items[t - 1]) throw new Error("Your row number is not valid!");
                                                const e = o.items[t - 1];
                                                if ("startTour" === e.onClickAction && e.completionOn === hi) {
                                                    let t = [];
                                                    const s = localStorage.getItem(ot);
                                                    s && (t = JSON.parse(s)), t.push({ id: e.tourId, name: "", currentStep: 0, state: "closed" }), localStorage.setItem(ot, JSON.stringify(t));
                                                } else {
                                                    let t = [];
                                                    const s = localStorage.getItem(lt);
                                                    s && (t = JSON.parse(s)), t.push({ id: e.id }), localStorage.setItem(lt, JSON.stringify(t));
                                                }
                                            }),
                                                s(),
                                                window.localStorage.setItem(c, o),
                                                window.localStorage.setItem(u, "enabled"),
                                                e(o);
                                        },
                                    };
                                    window.USETIFUL.checklist = i;
                                })(this.checklists, this.runChecklist, this.hideTourSelection);
                        }),
                        (this.dismissChecklist = (t) => {
                            vt("dismiss checklist called");
                            const e = new CustomEvent(M, { detail: { type: Kt, entityId: t, action: $t, isDevKit: !1 } });
                            document.dispatchEvent(e), localStorage.removeItem(c), this.dismiss.setDismissValue(!0, t);
                            const s = new Event(S);
                            document.dispatchEvent(s);
                        }),
                        (this.getLiveChecklists = () => {
                            const t = [];
                            return (
                                this.checklists.forEach((e) => {
                                    (e.contentType = y), t.push(e);
                                }),
                                    t
                            );
                        }),
                        (this.checkAvailables = () => (
                            vt("Start loading checklist"),
                                vt("Checking available checklists..."),
                                new Promise((t, e) => {
                                    if (0 === this.checklists.length) vt("There is no checklists here"), e();
                                    else
                                        for (const e of this.checklists.sort((t, e) => e.objectPriority - t.objectPriority)) {
                                            const { id: s, targets: i, targetOperator: r } = e;
                                            this.dismiss.isChecklistDismiss(s) ||
                                            this.availableOnPage.checkTargetWithWaiting(wt(i), r).then(
                                                () => {
                                                    t(e);
                                                },
                                                () => {}
                                            );
                                        }
                                })
                        )),
                        (this.showTourSelection = (t, e) => {
                            this.setTourSelection("enabled"), (this.isLoaded = !0);
                            const { id: s, name: i, items: r, labels: n, progressBar: o, dismiss: a, alignment: l, showCompleteMessage: c, completionEvent: h, congratulation: u } = t,
                                {
                                    dismiss: { text: d, description: p, confirm: g, cancel: m },
                                } = n,
                                f = document.querySelector(`.${this.template.themeClasses.tourSelection}`),
                                v = new CustomEvent(M, { detail: { type: Kt, entityId: s, action: Pt, isDevKit: !1 } });
                            document.dispatchEvent(v);
                            const y = this.getCompletedItems(r);
                            if (f) return void f.classList.add(Ue.visible);
                            const b = y.length === r.length;
                            b && this.completionApi.completeItem(Kt, s, !0);
                            const w = ("message" === h || c) && b && u;
                            if (b && "dismiss" === h) return this.dismissChecklist(s), void this.mainButton.destroy();
                            const T = document.createElement("h3");
                            (T.dataset.ufElement = "title"), T.classList.add(this.template.themeClasses.title), o || T.classList.add(this.template.themeClasses.titleWithoutProgress), (T.innerHTML = (0, q.replaceTags)(w ? u.title : i));
                            const S = [this.template.themeClasses.tourSelection];
                            w && S.push(this.template.themeClasses.congratulation),
                                this.template.notifyUser(
                                    "checklist",
                                    T,
                                    o && !w
                                        ? `<span class="${this.template.themeClasses.progressValue}">${Math.round(y.length / (r.length / 100))}%</span><div class="${this.template.themeClasses.progress}"><div class="${
                                            this.template.themeClasses.progressbar
                                        }" style="width: ${Math.round(y.length / (r.length / 100))}%;"></div></div>`
                                        : null,
                                    () => {
                                        const t = this.template.createWrapper(this.template.themeClasses.actions);
                                        if (w) {
                                            t.classList.add(this.template.themeClasses.actionsPaddingAround);
                                            const e = document.createElement("div");
                                            (e.innerHTML = (0, q.replaceTags)(u.content)), t.append(e);
                                        } else
                                            for (const s of r) {
                                                const i = new Sn(
                                                    s,
                                                    this.template,
                                                    (t, s) =>
                                                        e(t, s, !0, () => {
                                                            this.hideTourSelection();
                                                        }),
                                                    this.tourTriggers
                                                );
                                                t.append(i.render());
                                            }
                                        if (a) {
                                            const e = this.template.createWrapper(this.template.themeClasses.bottomAction);
                                            e.classList.add(this.template.themeClasses.bottomAction);
                                            const i = this.template.createLink(d, "");
                                            i.addEventListener(
                                                "click",
                                                (t) => {
                                                    this.template.confirmation(
                                                        "",
                                                        p,
                                                        g,
                                                        m,
                                                        () => {
                                                            ys(`.${this.template.themeClasses.notification}`), ys(`.${this.template.themeClasses.buttonMain}`), this.dismissChecklist(s);
                                                        },
                                                        l
                                                    ),
                                                        t.stopImmediatePropagation(),
                                                        t.preventDefault();
                                                },
                                                !1
                                            ),
                                                e.append(i),
                                                t.append(e);
                                        }
                                        return t;
                                    },
                                    S,
                                    () => this.setTourSelection("disabled"),
                                    l,
                                    s
                                );
                        }),
                        (this.hideTourSelection = () => {
                            ys(`.${this.template.themeClasses.tourSelection}`), (this.selectedChecklist = null);
                        }),
                        (this.isAvailableChecklist = () => this.checklists && this.checklists.length > 0 && !this.dismiss.isAllChecklistsDismissed(this.checklists)),
                        (this.showChecklist = (t) => {
                            localStorage.setItem(c, t.id),
                                (this.selectedChecklist = t),
                                this.showTourSelection(t, (t, e) =>
                                    this.runTourOnClickAction(t, e, !0, () => {
                                        this.hideTourSelection();
                                    })
                                );
                        }),
                        (this.placeTriggers = () => {
                            this.isAvailableChecklist() &&
                            (this.selectedChecklist
                                ? this.placeChecklistItemsTriggers(this.selectedChecklist)
                                : this.checkAvailables().then((t) => {
                                    this.placeChecklistItemsTriggers(t);
                                }));
                        }),
                        (this.loadChecklist = () => {
                            this.isAvailableChecklist()
                                ? this.selectedChecklist
                                    ? this.showTourSelection(this.selectedChecklist, this.runTourOnClickAction)
                                    : this.checkAvailables().then((t) => {
                                        this.runChecklist(t);
                                    })
                                : (this.isLoaded = !1);
                        }),
                        (this.getCompletedItems = (t) => {
                            const e = Ki(Fi);
                            return t.filter((t) => Si(t, Ki(Bi), this.completionApi, e) === vi);
                        }),
                        (this.runChecklist = (t) => {
                            if (this.isDestroyed) return;
                            this.isLoaded = !0;
                            const { id: e, button: s, items: i, theme: r, themeSlug: n, alignment: o } = t;
                            this.loader.loadTheme(r, n).then((r) => {
                                if ((this.template.setTheme(r), this.mainButton.setTheme(r), null == s ? void 0 : s.visible)) {
                                    this.mainButton.setAvailableTours(i);
                                    const r = i.length - this.getCompletedItems(i).length;
                                    this.mainButton.prepareMainButton(
                                        `checklist_${e}`,
                                        this.mainButton.getButtonLabelContent((null == s ? void 0 : s.label) || "Get Started", r),
                                        () => {
                                            this.showChecklist(t);
                                        },
                                        o
                                    ),
                                    this.isTourSelectionEnabled(null == s ? void 0 : s.collapsed) && this.showChecklist(t);
                                } else this.showChecklist(t);
                            });
                        }),
                        (this.placeChecklistItemsTriggers = (t) => {
                            t.items.forEach((t) => {
                                const { completionEvent: e, id: s } = t;
                                if (t.completionOn === di && e.type === di) {
                                    const t = new Ps(e.event, this.availableOnPage);
                                    (t.isChecklistItem = !0), (t.triggerFunction = this.markAsDoneEvent), (t.checklistItemId = s);
                                    Ki(_i).placeTrigger(t), this.placedTriggers.push(t);
                                }
                            });
                        }),
                        (this.removeTriggers = () => {
                            if (this.placedTriggers.length > 0) {
                                const t = Ki(_i);
                                this.placedTriggers.forEach((e) => {
                                    t.removeFromActiveTriggers(e);
                                }),
                                    (this.placedTriggers = []);
                            }
                        }),
                        (this.markAsDoneEvent = (t) => {
                            new Ti(Ki(Bi), this.completionApi).markAsRedirected(t), this.template.changeItemToDoneStyle(t), this.template.checklistProgressUpdate();
                        }),
                        (this.destroyInstance = () => {
                            this.removeTriggers(), ys("[data-uf-button='button-main']"), ys("[data-uf-content='checklist']"), (this.isDestroyed = !0), (this.checklists = []);
                        }),
                        (this.checklists = t),
                        (this.runTourOnClickAction = e),
                        (this.tourTriggers = Ki(Oi)),
                        (this.loader = Ki($i)),
                        (this.selectedChecklist = null),
                        (this.mainButton = Ki(ji)),
                        (this.isWatermark = Ki(qi.watermark)),
                        (this.dismiss = Ki(Ni)),
                        (this.isLoaded = !1),
                        (this.template = new Ds(null, this.isWatermark)),
                        (this.availableOnPage = Ki(Mi)),
                        (this.isDestroyed = !1),
                        (this.placedTriggers = []),
                        (this.completionApi = Ki(Wi));
                }
            }
            var In = '<svg xmlns="http://www.w3.org/2000/svg"><path stroke="#000" stroke-width="2" d="M1 16L16 1M1 1l15 15"/></svg>',
                En =
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><path data-name="Rectangle 1" d="M25 21H4V0h21z" fill="none"/><path data-name="Path 1" d="M13.594 11.594l-5.16 5.16a.84.84 0 11-1.189-1.188L11.812 11 7.247 6.434a.84.84 0 011.188-1.188l5.16 5.16a.84.84 0 010 1.188z" fill="#1d1d1d"/></svg>';
            const Ln = class {
                    constructor() {
                        var t = this;
                        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                            s = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        (this.getThemeClasses = () => this.template.themeClasses),
                            (this.getTitle = (t) => {
                                const e = document.createElement("h3");
                                return e.classList.add(this.getThemeClasses().title), (e.dataset.ufElement = "title"), (e.innerHTML = t), e;
                            }),
                            (this.createLink = function (e) {
                                let s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "#",
                                    i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "_self";
                                const r = document.createElement("a");
                                return (
                                    r.classList.add(t.getThemeClasses().button, t.getThemeClasses().buttonBlock),
                                        (r.href = (0, q.replaceTags)(s)),
                                        (r.target = i),
                                        (r.innerHTML = `<span>${(0, q.replaceTags)(e)}</span><div class="${[t.template.themeClasses.buttonIcon, t.template.themeClasses.buttonIconRight].join(" ")}">${En}</div>`),
                                        r
                                );
                            }),
                            (this.createButton = (t, e) => {
                                const s = document.createElement("button");
                                return (
                                    s.classList.add(this.getThemeClasses().button, this.getThemeClasses().buttonBlock),
                                        (s.onclick = e),
                                        (s.innerHTML = `<span>${(0, q.replaceTags)(t)}</span><div class="${[this.getThemeClasses().buttonIcon, this.getThemeClasses().buttonIconRight].join(" ")}">${En}</div>`),
                                        s
                                );
                            }),
                            (this.createSearchResult = (t, e, s) => {
                                const i = document.createElement("span"),
                                    r = document.createElement("a");
                                return (r.href = "javascript:void(0);"), (r.onclick = s), (r.innerText = t), (i.innerHTML = `<p>${e}</p>`), i.prepend(r), i;
                            }),
                            (this.showArticle = (t, e, s, i, r) => {
                                const n = document.createElement("div");
                                (n.dataset.ufContent = "slideout"),
                                    n.classList.add(this.getThemeClasses().slideout),
                                    "bottom-left" === s ? ((n.style.left = "0px"), n.classList.add(this.getThemeClasses().left)) : ((n.style.right = "0px"), n.classList.add(this.getThemeClasses().right)),
                                    (n.style.bottom = "0px");
                                const o = document.createElement("div");
                                o.classList.add(this.getThemeClasses().articleInner);
                                const a = this.getTitle((0, q.replaceTags)(t)),
                                    l = document.createElement("div");
                                l.classList.add(this.getThemeClasses().content), (l.innerHTML = (0, q.replaceTags)(e));
                                const c = this.createBackButton((t) => {
                                        "function" == typeof i && (i(t), vs(n));
                                    }),
                                    h = this.createCloseButton((t) => {
                                        "function" == typeof i && (r(t), vs(n));
                                    });
                                o.appendChild(c), o.appendChild(h), o.appendChild(a), o.appendChild(l), n.appendChild(o), this.template.showElement(n);
                            }),
                            (this.createCloseButton = (t) => {
                                const e = document.createElement("button");
                                return (e.type = "button"), e.classList.add(this.getThemeClasses().buttonClose), e.addEventListener("click", t), (e.innerHTML = In), this.template.appendButtonDataAttributes(e), e;
                            }),
                            (this.createBackButton = (t) => {
                                const e = document.createElement("button");
                                return (
                                    (e.type = "button"),
                                        e.classList.add(this.getThemeClasses().buttonBack),
                                        e.addEventListener("click", t),
                                        (e.innerHTML =
                                            '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="currentcolor"><path d="M13.648 6.89c0 .09-.035.169-.101.235l-4.031 4.031 4.03 4.031a.323.323 0 010 .47l-.515.515a.323.323 0 01-.469 0l-4.78-4.781a.323.323 0 010-.47l4.78-4.78a.323.323 0 01.47 0l.515.515a.323.323 0 01.101.235zm0 0"/></svg>'),
                                        e
                                );
                            }),
                            (this.getSearchBox = () => document.querySelector(`.${this.getThemeClasses().searchBox}`)),
                            (this.createSearchBox = (t, e, s) => {
                                const i = document.createElement("div");
                                i.classList.add(this.getThemeClasses().searchBox);
                                const r = document.createElement("input");
                                (r.type = "text"),
                                    (r.placeholder = (0, q.replaceTags)(t)),
                                    r.addEventListener("keyup", (t) => {
                                        var s;
                                        const i = t.target.value,
                                            r = null === (s = this.getSearchBox()) || void 0 === s ? void 0 : s.querySelector('button[role="reset"]');
                                        i.length ? null == r || r.removeAttribute("style") : null == r || r.setAttribute("style", "display:none"), e(i);
                                    });
                                const n = document.createElement("button");
                                return (
                                    n.setAttribute("role", "reset"),
                                        n.setAttribute("style", "display:none"),
                                        (n.innerHTML = In),
                                        (n.onclick = () => {
                                            var t, e;
                                            (r.value = ""), s(), null === (e = null === (t = this.getSearchBox()) || void 0 === t ? void 0 : t.querySelector('button[role="reset"]')) || void 0 === e || e.setAttribute("style", "display:none");
                                        }),
                                        i.appendChild(r),
                                        i.appendChild(n),
                                        i
                                );
                            }),
                            (this.showBox = (t) => {
                                const { title: e, content: s, createActions: i, closeAction: r, alignment: n = "bottom-right", search: o, classes: a } = t;
                                let l;
                                const c = document.createElement("div");
                                (c.dataset.ufContent = "assistant"), c.setAttribute("style", "display: none"), a && c.classList.add(...a.split(" "));
                                const h = document.createElement("div");
                                h.classList.add(this.getThemeClasses().notificationInner), (l = e instanceof HTMLElement ? e : this.getTitle(e));
                                const u = this.createCloseButton(() => {
                                    "function" == typeof r && r(c);
                                });
                                h.appendChild(u), h.appendChild(l);
                                const d = document.createElement("div");
                                d.classList.add(this.getThemeClasses().content), s instanceof HTMLElement ? d.appendChild(s) : (d.innerHTML = s);
                                const p = o(c);
                                if (
                                    ("" !== s && null !== p && d.classList.add(this.template.themeClasses.contentWithDescription),
                                    "" === s && null === p && l.classList.add(this.template.themeClasses.titleWithoutContent),
                                    p instanceof HTMLElement && (d.appendChild(p), h.classList.add(this.getThemeClasses().notificationSearchInner)),
                                        h.appendChild(d),
                                        i)
                                ) {
                                    const t = i(c);
                                    h.append(t);
                                }
                                c.appendChild(h),
                                    c.classList.add(this.getThemeClasses().notification, this.getThemeClasses().tourSelection),
                                    "bottom-left" === n ? ((c.style.left = "0px"), c.classList.add(this.getThemeClasses().left)) : ((c.style.right = "0px"), c.classList.add(this.getThemeClasses().right)),
                                    (c.style.bottom = "0px"),
                                this.template.isWatermark && h.append(this.template.createWatermarkBadge()),
                                    this.template.showElement(c);
                            }),
                            (this.template = new Ds(e, s));
                    }
                    setTheme(t) {
                        this.template.setTheme(t);
                    }
                },
                Dn = "Search in the knowledge base…",
                xn = "reset";
            const Pn = class {
                constructor(t, e, s) {
                    (this.initSearchBox = (t) => {
                        if (((this.assistantElement = t), this.options.search)) {
                            const t = this.makeDelay();
                            return this.template.createSearchBox(
                                this.options.searchPlaceholder,
                                (e) => {
                                    e.length || this.triggerCallbackFunction(xn, null), t(e);
                                },
                                () => {
                                    this.triggerCallbackFunction(xn, null);
                                }
                            );
                        }
                        return null;
                    }),
                        (this.isCallbackDefined = () => "function" == typeof this.callback),
                        (this.triggerCallbackFunction = (t, e) => {
                            if (null === this.callback) throw new Error("call must be initialized first");
                            if (null === this.assistantElement) throw new Error("assistantElement must be initialized first");
                            this.isCallbackDefined() && this.callback(this.assistantElement, t, e);
                        }),
                        (this.makeDelay = () => {
                            let t;
                            return (e) => {
                                clearTimeout(t),
                                    (t = setTimeout(() => {
                                        if (this.isCallbackDefined() && e.length >= 3) {
                                            this.api.get(`/search?query=${e}`).onload = (t) => {
                                                let {
                                                    currentTarget: { status: e, response: s },
                                                } = t;
                                                if (e >= 200 && e < 400) {
                                                    const t = JSON.parse(s);
                                                    this.triggerCallbackFunction("result", t);
                                                }
                                            };
                                        }
                                    }, this.options.delay));
                            };
                        }),
                        (this.api = Ki(xi)),
                        (this.template = t),
                        (this.assistantElement = null),
                        (this.callback = s);
                    const i = { search: !1, delay: 500, searchPlaceholder: Dn };
                    this.options = Object.assign(Object.assign({}, i), e);
                }
            };
            var An = function (t, e) {
                var s = {};
                for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && e.indexOf(i) < 0 && (s[i] = t[i]);
                if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                    var r = 0;
                    for (i = Object.getOwnPropertySymbols(t); r < i.length; r++) e.indexOf(i[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, i[r]) && (s[i[r]] = t[i[r]]);
                }
                return s;
            };
            const On = "assistantSelection";
            const _n = class {
                constructor(t, e) {
                    var s = this;
                    (this.getElementSelector = () => `.${this.template.getThemeClasses().tourSelection}[data-uf-content="assistant"]`),
                        (this.disabledAssistantSelection = () => {
                            window.localStorage.setItem(On, "disabled");
                        }),
                        (this.enableAssistantSelection = () => {
                            window.localStorage.setItem(On, "enabled");
                        }),
                        (this.isAssistantSelectionEnabled = (t) => {
                            const e = window.localStorage.getItem(On);
                            return "enabled" === e || (null === e && !t);
                        }),
                        (this.getAvailable = () => (
                            vt("Checking available assistant..."),
                                new Promise((t, e) => {
                                    if (0 === this.assistants.length) return vt("There is no checklists here"), void e();
                                    this.assistants.forEach((e) => {
                                        Ki(Mi)
                                            .checkTargetWithWaiting(wt(e.targets), e.targetOperator)
                                            .then(
                                                () => {
                                                    t(e);
                                                },
                                                () => {}
                                            );
                                    });
                                })
                        )),
                        (this.getLiveAssistants = () => {
                            const t = [];
                            return (
                                this.assistants.forEach((e) => {
                                    (e.contentType = b), e.objectPriority || (e.objectPriority = 1), t.push(e);
                                }),
                                    t
                            );
                        }),
                        (this.showArticle = (t, e, s, i) => {
                            t.classList.remove(Ue.visible),
                                this.template.showArticle(
                                    e,
                                    s,
                                    i,
                                    () => {
                                        t.classList.add(Ue.visible);
                                    },
                                    () => this.closeAssistant(t)
                                );
                        }),
                        (this.loadArticle = (t, e, s, i) => {
                            if (e in this.cache) this.showArticle(t, s, this.cache[e], i);
                            else {
                                this.api.requestWithPromise("GET", `/article/${e}`).then((r) => {
                                    const { content: n } = JSON.parse(r);
                                    (this.cache[e] = n), this.showArticle(t, s, this.cache[e], i);
                                });
                            }
                        }),
                        (this.fetchSearchItems = (t, e, s, i) => {
                            const r = document.createElement("div");
                            return (
                                r.classList.add(this.template.getThemeClasses().searchResults),
                                    e.articles.length > 0
                                        ? e.articles.forEach((e) => {
                                            let { id: i, name: n, description: o } = e;
                                            r.appendChild(
                                                this.template.createSearchResult(n, o, () => {
                                                    this.loadArticle(t, i, n, s);
                                                })
                                            );
                                        })
                                        : (r.innerText = i),
                                    r
                            );
                        }),
                        (this.createActions = (t, e, s) => {
                            const i = document.createElement("div");
                            return (
                                i.classList.add(this.template.getThemeClasses().actions),
                                    e.forEach((e) => {
                                        var { type: r } = e,
                                            n = An(e, ["type"]);
                                        let o;
                                        if ("link" === r) {
                                            const { title: t, url: e, urlOpenTargetBlank: s } = n;
                                            o = this.template.createLink(t, e, s ? "_blank" : "_self");
                                        } else if ("article" === r) {
                                            const {
                                                title: e,
                                                article: { id: i, name: r },
                                            } = n;
                                            o = this.template.createButton(e, () => {
                                                r && this.loadArticle(t, i, r, s);
                                            });
                                        } else if ("tour" === r) {
                                            const { title: t, tourId: e } = n;
                                            o = this.template.createButton(t, (t) => {
                                                e &&
                                                e > 0 &&
                                                this.runTourOnClickAction(t, e, !0, () => {
                                                    this.closeAssistant(), this.enableAssistantSelection();
                                                });
                                            });
                                        }
                                        o && i.appendChild(o);
                                    }),
                                    i
                            );
                        }),
                        (this.closeAssistant = function () {
                            let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
                            (!(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]) && s.disabledAssistantSelection(), (s.selectedAssistant = null), t ? vs(t) : ys(s.getElementSelector());
                        }),
                        (this.destroy = () => {
                            var t;
                            this.closeAssistant(null, !1), ys(this.getElementSelector()), (null === (t = this.mainButton.id) || void 0 === t ? void 0 : t.startsWith("assistant")) && this.mainButton.destroy();
                        }),
                        (this.showAssistant = (t) => {
                            const { id: e, name: s, description: i, isPublicDescription: r, items: n, alignment: o, search: a, searchAttributes: l } = t;
                            if (this.selectedAssistant) {
                                if (this.selectedAssistant && this.selectedAssistant.id !== t.id) this.closeAssistant();
                                else if (document.querySelector(this.getElementSelector())) return;
                            } else this.selectedAssistant = t;
                            this.enableAssistantSelection();
                            const c = document.createElement("span");
                            c.classList.add(this.template.getThemeClasses().description), (c.innerHTML = (0, q.replaceTags)(i));
                            const h = { search: a };
                            (null == l ? void 0 : l.placeholder) && (h.searchPlaceholder = l.placeholder);
                            const u = new Pn(this.template, h, (t, e, s) => {
                                var i;
                                const r = document.querySelector(`.${this.template.getThemeClasses().actions}`);
                                if (r)
                                    if (((r.innerHTML = ""), "result" === e)) {
                                        const e = this.fetchSearchItems(t, s, o, l.emptyResults);
                                        r.appendChild(e);
                                    } else if ("reset" === e) {
                                        const e = this.createActions(t, n, o);
                                        null === (i = r.parentNode) || void 0 === i || i.replaceChild(e, r);
                                    }
                            });
                            this.template.showBox({
                                id: e,
                                type: "assistant",
                                title: (0, q.replaceTags)(s),
                                content: r ? c : "",
                                alignment: o,
                                search: (t) => u.initSearchBox(t),
                                closeAction: this.closeAssistant,
                                createActions: (t) => this.createActions(t, n, o),
                            });
                        }),
                        (this.runAssistant = (t) => {
                            if (this.isDestroyed) return;
                            const { id: e, theme: s, themeSlug: i, description: r, button: n, alignment: o } = t;
                            this.loader.loadTheme(s, i).then((s) => {
                                this.template.setTheme(s), this.mainButton.setTheme(s);
                                const i = document.createElement("span");
                                i.classList.add(this.template.getThemeClasses().description),
                                    (i.innerHTML = r),
                                    (null == n ? void 0 : n.visible)
                                        ? (this.mainButton.prepareMainButton(
                                            `assistant_${e}`,
                                            this.mainButton.getButtonLabelContent((null == n ? void 0 : n.label) || "Need Help?"),
                                            () => {
                                                this.showAssistant(t);
                                            },
                                            o
                                        ),
                                        this.isAssistantSelectionEnabled(null == n ? void 0 : n.collapsed) && this.showAssistant(t))
                                        : this.showAssistant(t);
                            });
                        }),
                        (this.init = () => {
                            this.destroy();
                        }),
                        (this.destroyInstance = () => {
                            ys("[data-uf-button='button-main']"), ys("[data-uf-content='assistant']"), (this.isDestroyed = !0), (this.assistants = []);
                        }),
                        (this.assistants = t),
                        (this.runTourOnClickAction = e),
                        (this.loader = Ki($i)),
                        (this.mainButton = Ki(ji)),
                        (this.api = Ki(xi)),
                        (this.template = new Ln(null, !1)),
                        (this.isDestroyed = !1),
                        (this.cache = {}),
                        (this.selectedAssistant = null);
                }
            };
            const $n = class {
                    constructor(t, e) {
                        (this.entity = e), (this.type = t);
                    }
                    destroy() {
                        this.entity.destroy();
                    }
                    init() {
                        this.entity.init();
                    }
                    destroyInstance() {
                        this.entity.destroyInstance();
                    }
                    getLiveContent() {
                        switch (this.type) {
                            case v:
                                return this.entity.getLiveTours();
                            case y:
                                return this.entity.getLiveChecklists();
                            case b:
                                return this.entity.getLiveAssistants();
                        }
                    }
                },
                Bn = "Conflict",
                Rn = "MissingElement",
                Nn = "UserIdIssue",
                jn = "DuplicateScript",
                Mn = "ConflictWarning",
                Un = (t) => {
                    let { name: e, text: s, code: i = 0, id: r, type: n = Vt } = t;
                    const o = new CustomEvent(W, { detail: { reportType: Xt, name: e, text: s, code: i, url: window.location.href, entityId: r, entityType: n } });
                    document.dispatchEvent(o);
                };
            const Fn = class {
                constructor(t, e, s, i) {
                    var r = this;
                    let o = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
                    (this.waitForAvailableContent = () =>
                        new Promise((t) => {
                            if (this.availableContent.length > 0) t(!0);
                            else {
                                const e = setInterval(() => {
                                    this.getAvailableContent(), this.availableContent.length > 0 && (clearInterval(e), t(!0));
                                }, 250);
                            }
                        })),
                        (this.filterEntities = (t) => t.objectPriority >= this.maxPriority),
                        (this.filterByPriority = (t, e) => t.filter((t) => t.objectPriority >= e)),
                        (this.filterByType = (t, e) => t.filter((t) => t.contentType === e)),
                        (this.filterAvailableTours = (t) => {
                            const { targets: e, targetOperator: s } = t.tourData;
                            return this.availableOnPage.checkAvailableOnPage(wt(e), s) || (it && Y === t.id);
                        }),
                        (this.filterRunnableTour = (t) => {
                            if ("tour" === t.contentType) {
                                const { autoplay: e, showEverytime: s, id: i } = t.tourData;
                                return e && (s || this.localStorageTourHandler.getObjectStatus(i) !== n);
                            }
                            return !0;
                        }),
                        (this.filterAvailableChecklists = (t) => {
                            const { id: e, targets: s, targetOperator: i } = t;
                            return this.availableOnPage.checkAvailableOnPage(wt(s), i) && !this.dismiss.isChecklistDismiss(e);
                        }),
                        (this.filterOutDismissedChecklists = (t) => {
                            const { id: e } = t;
                            return !this.dismiss.isChecklistDismiss(e);
                        }),
                        (this.filterAvailableAssistants = (t) => {
                            const { targets: e, targetOperator: s } = t;
                            return this.availableOnPage.checkAvailableOnPage(wt(e), s);
                        }),
                        (this.filterOutHidden = (t) => void 0 === this.hiddenContent.find((e) => e.contentType === t.contentType && e.id === t.id)),
                        (this.setLiveContent = () => {
                            for (const t in this.loaders)
                                if (Object.hasOwnProperty.call(this.loaders, t)) {
                                    const e = this.loaders[t].getLiveContent();
                                    e && (this.liveContent[t] = e);
                                }
                        }),
                        (this.getAvailableContent = () => {
                            let t = [];
                            (this.availableTours = this.liveContent[v].filter(this.filterAvailableTours)),
                                (this.tours.availableTours = this.availableTours),
                                (this.availableChecklists = this.liveContent[y].filter(this.filterAvailableChecklists)),
                                (this.availableAssistants = this.liveContent[b].filter(this.filterAvailableAssistants)),
                                (t = [...this.availableTours, ...this.availableChecklists, ...this.availableAssistants]),
                                vt("ContentLoader: Available content:"),
                                bt(t),
                                (this.availableContent = t);
                        }),
                        (this.placeTriggers = () => {
                            this.tours.availableTours.length > 0 && (this.tours.placeAllButtonEvent(), this.tours.placeInitialTriggersEvent()), this.availableChecklists.length > 0 && this.placeChecklistItemsTriggers();
                        }),
                        (this.placeChecklistItemsTriggers = () => {
                            this.availableChecklists.forEach((t) => {
                                this.checklist.placeChecklistItemsTriggers(t);
                            });
                        }),
                        (this.checkInProgressTours = () => {
                            const t = [],
                                e = this.localStorageTourHandler.getRunningToursFromLS();
                            return (
                                !!(
                                    e &&
                                    e.length > 0 &&
                                    (e.forEach((e) => {
                                        const s = this.availableTours.find((t) => t.id === e);
                                        if (s) t.push(s);
                                        else {
                                            const t = this.liveContent[v].find((t) => t.id === e);
                                            t && this.localStorageTourHandler.closeInProgressTour(t.id, t.name);
                                        }
                                    }),
                                    t.length > 0)
                                ) && (this.displayContent(t), !0)
                            );
                        }),
                        (this.checkTourTriggers = () => {
                            const t = this.tours.tourTriggers.getTriggers(),
                                e = JSON.parse(t),
                                s = [];
                            return (
                                e.forEach((t) => {
                                    const e = window.localStorage.getItem(dt);
                                    if ((e && this.availableOnPage.checkURL(e)) || !e) {
                                        const e = this.liveContent[v].find((e) => e.id === parseInt(t, 10));
                                        e && s.push(e);
                                    }
                                    e &&
                                    setTimeout(() => {
                                        window.localStorage.removeItem(dt);
                                    }, 500);
                                }),
                                s.length > 0 &&
                                (this.displayContent(s, () => {
                                    this.tours.tourTriggers.clearTourTriggerAfterDelay(e[0], !0, 500);
                                }),
                                    !0)
                            );
                        }),
                        (this.checkPriorityTours = () => {
                            let t = !1;
                            return t || (t = this.checkTourTriggers()), t || (t = this.checkInProgressTours()), t;
                        }),
                        (this.prioritizeContent = () => {
                            if (this.checkPriorityTours()) return;
                            if (!this.availableContent || 0 === this.availableContent.length)
                                return void this.waitForAvailableContent().then((t) => {
                                    t && this.checkContent();
                                });
                            const t = this.availableContent.filter(this.filterRunnableTour).filter(this.filterOutHidden);
                            if (((this.contentToDisplay = []), this.isPriorityAcrossEntities)) (this.maxPriority = Math.max(...t.map((t) => t.objectPriority))), (this.contentToDisplay = t.filter(this.filterEntities));
                            else
                                for (const e of this.contentPriorities) {
                                    const s = this.filterByType(t, e),
                                        i = Math.max(...s.map((t) => t.objectPriority)),
                                        r = this.filterByPriority(s, i);
                                    if (1 === r.length) {
                                        this.contentToDisplay = r;
                                        break;
                                    }
                                    r.length > 1 && this.reportConflict(r);
                                }
                            this.contentToDisplay.length > 0 ? (this.clearRefreshProp(), this.displayContent(this.contentToDisplay)) : this.isAnyPotentialRunnableContent() && setTimeout(() => this.checkContent(), 500);
                        }),
                        (this.displayContent = function (t) {
                            let e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : () => {};
                            if ((vt("ContentLoader: displayContent called"), bt(t), r.clearRefreshProp(), (r.conflictReported = !1), 1 === t.length)) {
                                const e = t[0];
                                if (r.isTheDisplayContent(e.contentType, e.contentType === v ? e.tourData.id : e.id)) return;
                                switch ((r.setDisplayedContentType(e.contentType), e.contentType)) {
                                    case v:
                                        r.destroyPreviousContent(v), r.setDisplayedContentId(e.tourData.id), r.tours.runTourById(e.tourData.id), e.tourData.autoplay && r.hideFromAvailable(e);
                                        break;
                                    case y:
                                        r.destroyPreviousContent(y), r.setDisplayedContentId(e.id), r.checklist.runChecklist(e);
                                        break;
                                    case b:
                                        r.destroyPreviousContent(b), r.setDisplayedContentId(e.id), r.assistant.runAssistant(e);
                                }
                            } else t.length > 1 ? r.resolveConflict(t) : console.warn("No content to run");
                            e();
                        }),
                        (this.resolveConflict = (t) => {
                            vt("ContentLoader: resolveConflict called"),
                                bt(t),
                                this.contentPriorities.forEach((e) => {
                                    const s = t.filter((t) => t.contentType === e);
                                    1 === s.length ? this.displayContent([s[0]]) : s.length > 0 && this.reportConflict(s);
                                });
                        }),
                        (this.destroyPreviousContent = (t) => {
                            var e, s;
                            switch (t) {
                                case v:
                                    this.checklist.destroy(), this.assistant.destroy();
                                    break;
                                case y:
                                    null === (e = this.tours.currentTour) || void 0 === e || e.closeTour(), this.assistant.destroy();
                                    break;
                                case b:
                                    null === (s = this.tours.currentTour) || void 0 === s || s.closeTour(), this.checklist.destroy();
                            }
                        }),
                        (this.hideFromAvailable = (t) => {
                            this.hiddenContent.push({ contentType: t.contentType, id: t.id });
                        }),
                        (this.checkContentReferenceFunction = () => {
                            this.checkContent();
                        }),
                        (this.closeTourEvent = () => {
                            this.setDisplayedContentId(null);
                        }),
                        (this.pauseLoader = () => {
                            vt("ContentLoader paused"), (this.isPaused = !0);
                        }),
                        (this.unPauseLoader = () => {
                            vt("ContentLoader unpaused"), (this.isPaused = !1), this.checkContent();
                        }),
                        (this.setDisplayFunction = (t) => {
                            this.isDestroyed || (this.setDisplayedContentType(t.detail.type), this.setDisplayedContentId(t.detail.id), this.destroyPreviousContent(this.displayedContentType));
                        }),
                        (this.registerLoadersByPriority = (t) => {
                            t.forEach((t) => {
                                switch (t) {
                                    case v:
                                        this.registerLoader(v, this.tours);
                                        break;
                                    case y:
                                        this.registerLoader(y, this.checklist);
                                        break;
                                    case b:
                                        this.registerLoader(b, this.assistant);
                                }
                            });
                        }),
                        (this.registerLoader = (t, e) => {
                            null === this.getLoader(t) && (this.loaders[t] = new $n(t, e));
                        }),
                        (this.contentPriorities = i),
                        (this.isPriorityAcrossEntities = o),
                        (this.loaders = {}),
                        (this.assistant = t),
                        (this.checklist = e),
                        (this.tours = s),
                        this.registerLoadersByPriority(this.contentPriorities),
                        (this.isDestroyed = !1),
                        (this.isPaused = !1),
                        (this.availableOnPage = Ki(Mi)),
                        (this.localStorageTourHandler = Ki(Fi)),
                        (this.dismiss = Ki(Ni));
                    const [a] = this.contentPriorities;
                    (this.displayedContentId = null),
                        (this.displayedContentType = a),
                        (this.maxPriority = 1),
                        (this.availableContent = []),
                        (this.liveContent = {}),
                        (this.availableTours = []),
                        (this.availableChecklists = []),
                        (this.availableAssistants = []),
                        (this.hiddenContent = []),
                        (this.contentToDisplay = []),
                        (this.conflictReported = !1);
                }
                checkContent() {
                    this.isDestroyed || this.isPaused || (this.getAvailableContent(), this.placeTriggers(), this.prioritizeContent());
                }
                init() {
                    this.checkingContentInterval && window.clearTimeout(this.timeoutID),
                        this.removeEventListeners(),
                        this.getLoaders().forEach((t) => {
                            t.destroy();
                        }),
                        (this.hiddenContent = []),
                        this.resetDisplayContent(),
                        this.getLoaders().forEach((t) => {
                            t.init();
                        }),
                        this.setLiveContent(),
                        this.checkContent(),
                    this.isDestroyed || (this.checklist.placeTriggers(), this.placeEventListeners());
                }
                placeEventListeners() {
                    document.addEventListener(S, this.checkContentReferenceFunction, !1),
                        document.addEventListener(k, this.setDisplayFunction, !1),
                        document.addEventListener(I, this.checkContentReferenceFunction, !1),
                        document.addEventListener(C, this.closeTourEvent, !1),
                        document.addEventListener(U, this.pauseLoader, !1),
                        document.addEventListener(F, this.unPauseLoader, !1);
                }
                removeEventListeners() {
                    document.removeEventListener(S, this.checkContentReferenceFunction, !1),
                        document.removeEventListener(I, this.checkContentReferenceFunction, !1),
                        document.removeEventListener(C, this.closeTourEvent, !1),
                        document.removeEventListener(U, this.pauseLoader, !1),
                        document.removeEventListener(F, this.unPauseLoader, !1);
                }
                reinit() {
                    this.resetDisplayContent(), this.init();
                }
                destroy() {
                    this.removeEventListeners();
                    const [t] = this.contentPriorities;
                    (this.displayedContentType = t),
                        (this.isDestroyed = !0),
                        this.getLoaders().forEach((t) => {
                            t.destroyInstance();
                        }),
                    this.timeoutID && window.clearTimeout(this.timeoutID);
                }
                getLoader(t) {
                    return Object.prototype.hasOwnProperty.call(this.loaders, t) ? this.loaders[t] : null;
                }
                getLoaders() {
                    return Object.values(this.loaders);
                }
                clearRefreshProp() {
                    window.usetiful_isAboutToRefresh = null;
                }
                isAnyPotentialRunnableContent() {
                    const t = this.liveContent[v].length > 0 && this.liveContent[v].filter(this.filterRunnableTour).filter(this.filterOutHidden).length > 0,
                        e = this.liveContent[y].length > 0 && this.liveContent[y].filter(this.filterOutDismissedChecklists).length > 0,
                        s = this.liveContent[b].length > 0;
                    return t || e || s;
                }
                setDisplayedContentId(t) {
                    this.displayedContentId = t;
                }
                setDisplayedContentType(t) {
                    this.displayedContentType = t;
                }
                isTheDisplayContent(t, e) {
                    return this.displayedContentType === t && this.displayedContentId === e;
                }
                resetDisplayContent() {
                    const [t] = this.contentPriorities;
                    this.setDisplayedContentType(t), this.setDisplayedContentId(null);
                }
                reportConflict(t) {
                    if (this.conflictReported) return;
                    const e = t.map((t) => `\n${t.id.toString()}: ${t.name}`);
                    console.warn(`Usetiful: There are ${t.length} ${t[0].contentType}s available on this page with the same priority: ${e} \n and we can't decide which one to display first.`),
                        setTimeout(() => {
                            t.forEach((e) => {
                                const s = t.filter((t) => t.id !== e.id).map((t) => `${t.id.toString()}: ${t.name}`);
                                Un({ name: Bn, text: `There is a conflict in priorities. Other ${e.contentType}${t.length - 1 > 1 ? "s" : ""} with the same priority: ${s}`, id: e.id.toString(), type: e.contentType });
                            });
                        }, 500),
                        (this.conflictReported = !0);
                }
            };
            const Hn = class {
                    constructor(s, i, r, n) {
                        (this.placeTrigger = () => {
                            this.shouldPlaceTrigger() ? this.setProgressOnClickTrigger() : this.type === e && pe({ name: N, tourId: this.tourId });
                        }),
                            (this.removeTrigger = () => {
                                this.removeProgressOnClickTrigger();
                            }),
                            (this.shouldPlaceTrigger = () => this.type && this.type !== e && this.type !== t),
                            (this.setProgressOnClickTrigger = () => {
                                if ((vt(`setProgressOnClickTrigger: Setting click trigger on ${this.pointerSelector}...`), this.commonTriggerController.hasProgressOnClickTrigger(this.pointerSelector))) return;
                                const t = { type: this.eventName, element: this.pointerSelector, url: "", loop: "-1" },
                                    e = new Ps(t, Ki(Mi));
                                (e.isProgressOnClick = !0),
                                this.commonTriggerController.isTriggerMissing(e) &&
                                ((e.triggerFunction = this.elementTrigger), this.commonTriggerController.addToActiveTriggers(e), this.commonTriggerController.placeCentralListener(e.eventName, e.elementSelector));
                            }),
                            (this.removeProgressOnClickTrigger = () => {
                                if ((vt(`Removing progress trigger ${this.eventName} on ${this.pointerSelector} ...`), cs(this.pointerSelector))) {
                                    if (hs(this.pointerSelector)) {
                                        this.commonTriggerController.searchInActiveTriggers(this.eventName, this.pointerSelector).forEach((t) => {
                                            t.isProgressOnClick && this.commonTriggerController.removeFromActiveTriggers(t);
                                        });
                                    }
                                }
                            });
                        switch (
                            ((this.type = s || ""),
                                (this.pointerSelector = i || ""),
                                (this.elementTrigger =
                                    r ||
                                    (() => {
                                        yt("ProgressOnClickControl doesn't contain functions for elementTrigger.");
                                    })),
                                (this.commonTriggerController = Ki(_i)),
                                (this.eventName = ""),
                                (this.tourId = n),
                                s)
                            ) {
                            case "element":
                                this.eventName = "mouseup";
                                break;
                            case "screen":
                                (this.eventName = "mouseup"), (this.pointerSelector = "body");
                        }
                    }
                },
                Wn = (t) => {
                    vt(t);
                };
            const qn = class {
                constructor(t, e) {
                    (this.runTriggerEvent = () => {
                        switch (this.stepData.eventType) {
                            case Xe:
                                this.runJsEvent();
                                break;
                            case Ye:
                                this.runWebhookCall();
                        }
                    }),
                        (this.runJsEvent = () => {
                            if (this.stepData.eventName) {
                                let t;
                                try {
                                    if ("" !== this.stepData.eventContent) {
                                        t = (0, q.replaceTags)(this.stepData.eventContent);
                                        const [e] = JSON.parse(`[{ "bubbles": true, "detail": {${t}}}]`);
                                        (this.options = e), (this.event = new CustomEvent(this.stepData.eventName, this.options));
                                    }
                                } catch (t) {
                                    console.warn(`Trigger event step contains this error: ${t}`);
                                }
                                this.event &&
                                this.element &&
                                (Z &&
                                this.element.addEventListener(this.stepData.eventName, () => {
                                    console.log(this.event);
                                }),
                                    this.element.dispatchEvent(this.event));
                            }
                        }),
                        (this.runWebhookCall = () => {
                            if (this.stepData.webhookUrl)
                                try {
                                    const t = (0, q.replaceTags)(this.stepData.webhookUrl),
                                        e = (0, q.replaceTags)(this.stepData.eventContent),
                                        s = JSON.parse(`{${e}}`);
                                    s &&
                                    ((t, e, s) => {
                                        let i = t,
                                            r = "POST",
                                            n = [];
                                        const o = new URL(i);
                                        if (s) {
                                            const { username: t, password: e, port: o, type: a, headers: l } = s;
                                            if (t && e) {
                                                const s = `${encodeURIComponent(t)}:${encodeURIComponent(e)}@`;
                                                i = i.replace(/^(https?:\/\/)/, `$1${s}`);
                                            }
                                            if (o) {
                                                const t = new URL(i);
                                                (t.port = o), (i = t.toString());
                                            }
                                            a && (r = a), l && (n = l.map((t) => ({ key: t.key, value: (0, q.replaceTags)(t.value) })));
                                        }
                                        const a = o.searchParams.get("x-auth-token");
                                        if ((a && (o.searchParams.delete("x-auth-token"), (i = o.toString())), i.includes("webhook.office.com"))) {
                                            let t = [];
                                            n.length > 0 && (t = n.reduce((t, e) => ((t[e.key] = e.value), t), {})),
                                                fetch(i, { method: r, mode: "no-cors", headers: Object.assign({}, t), body: JSON.stringify(e) }).catch((t) => console.error("Error:", t));
                                        } else {
                                            const t = new XMLHttpRequest();
                                            (t.onreadystatechange = () => {
                                                4 === t.readyState && Wn(t.response);
                                            }),
                                                t.open(r, i, !0),
                                            i.includes("zapier.com") || t.setRequestHeader("Content-Type", "application/json"),
                                            a && t.setRequestHeader("x-auth-token", a),
                                                n.forEach((e) => {
                                                    t.setRequestHeader(e.key, e.value);
                                                }),
                                                e ? t.send(JSON.stringify(e)) : t.send();
                                        }
                                    })(t, s, this.stepData.webhookSettings);
                                } catch (t) {
                                    console.warn(`Trigger event step contains this error: ${t}`);
                                }
                        }),
                        (this.runPageAction = () => {
                            if (this.stepData.actionType) {
                                if (!this.stepData.element) return void console.warn("Element for automated action is empty");
                                switch (this.stepData.actionType) {
                                    case Ge: {
                                        const t = us(this.stepData.element);
                                        null == t ||
                                        t.forEach((t) => {
                                            t instanceof HTMLInputElement && this.stepData.actionValue && (t.value = (0, q.replaceTags)(this.stepData.actionValue));
                                        });
                                        break;
                                    }
                                    case Qe: {
                                        const t = hs(this.stepData.element);
                                        if (t && t instanceof HTMLElement) {
                                            t.click();
                                            const e = new MouseEvent("mouseup", { bubbles: !0, cancelable: !0, view: window });
                                            t.dispatchEvent(e);
                                        }
                                        break;
                                    }
                                }
                            }
                        }),
                        (this.makeAutoRedirect = () => {
                            var t;
                            const e = At;
                            if (!this.currentTour) return !1;
                            if (this.stepData.automatic && this.stepData.url) {
                                const s = !$s(window.location.href, this.stepData.url);
                                this.step.modifyURLBeforeRedirect(this.stepData);
                                const i = this.currentTour.getTour(),
                                    r = null === (t = this.currentTour.getCurrentStep()) || void 0 === t ? void 0 : t.id;
                                if (i && r) {
                                    const t = new CustomEvent(M, { detail: { type: Vt, entityId: i.id, stepIndex: this.currentTour.getCurrentStepIndex(), action: e, itemId: r, isDevKit: !1 } });
                                    document.dispatchEvent(t);
                                } else console.error(`Could not send data to reporter before auto refirect for tour: ${i.id} and step: ${r}`);
                                return "self" === this.stepData.tourName && this.currentTour.goToNextStep(!1), (s || "self" !== this.stepData.tourName) && this.currentTour.closeTour(Nt), _s(this.stepData.url, !1), !0;
                            }
                            return !1;
                        }),
                        (this.step = t),
                        (this.stepData = t.stepData),
                    this.stepData.eventName && (this.event = new CustomEvent(this.stepData.eventName)),
                        (this.element = window),
                    this.stepData.element && "" !== this.stepData.element && hs(this.stepData.element) && (this.element = hs(this.stepData.element)),
                    this.stepData.type === qe && (this.currentTour = e);
                }
            };
            const Vn = [
                    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" stroke-width="2"><circle cx="16" cy="16" r="14"/><path d="M8.5 12.5c.5-.833 2.5-2 4.5 0M19 12.5c.5-.833 2.5-2 4.5 0" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 25c5.85 0 8.438-4.667 9-7 0 0-5.458 1.273-9 1.273S7 18 7 18c.563 2.333 3.15 7 9 7z" stroke-linejoin="round"/></g></svg>',
                    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="#000" stroke-width="2"/><rect x="8" y="19" width="16" height="2" rx="1" fill="#000"/><ellipse cx="11.5" cy="12.5" rx="1.5" ry="2.5" fill="#000"/><ellipse cx="20.5" cy="12.5" rx="1.5" ry="2.5" fill="#000"/></svg>',
                    '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="#000" stroke-width="2"><circle cx="16" cy="16" r="14"/><path d="M19.91 13.495c.061-.97 2.649-2.496 3.997-2.067M12.59 13.495c-.061-.97-2.649-2.496-3.997-2.067" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 18c-4.55 0-6.563 2.667-7 4 0 0 4.245-.727 7-.727S23 22 23 22c-.438-1.333-2.45-4-7-4z" stroke-linejoin="round"/></g></svg>',
                ],
                Kn = "js-feedback";
            const Jn = class {
                    constructor(t, e, s) {
                        (this.send = (t) => {
                            const e = new Date(),
                                s = { stepId: this.stepId, option: t, respondedAt: e.toISOString(), debug: this.debug, isPreview: it, isDev: tt },
                                i = this.usetifulTags.getUserId();
                            return (
                                null !== i && (s.userId = i),
                                    (0, q.updateTagValue)(`${this.stepId}-survey`, t.toString()),
                                    new Promise((t) => {
                                        const e = "/surveys/{survey_id}/responses/".replace("{survey_id}", this.surveyData.surveyId.toString(10)),
                                            i = this.reporterApi.post(e, s);
                                        i.onload = () => {
                                            t(i.response);
                                        };
                                    })
                            );
                        }),
                            (this.clickButtonHandle = (t) => {
                                t.preventDefault();
                                const e = t.target;
                                if (e) {
                                    const t = e.closest("button"),
                                        s = null == t ? void 0 : t.dataset.value;
                                    if (s) {
                                        const t = Number(s);
                                        Number.isNaN(t) ||
                                        (this.disabledAllButtonElements(),
                                            this.send(t).then(() => {
                                                const t = document.querySelector(`.${Kn}`);
                                                if (t) {
                                                    t.innerHTML = "";
                                                    const e = this.template.createWrapper("");
                                                    e.innerHTML =
                                                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><style>.cls-tick-1{fill:none;stroke:inherit;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px}</style></defs><g id="tick-_tick" data-name="tick"><circle class="cls-tick-1" cx="12" cy="12" r="11"/><path class="cls-tick-1" d="M6 13l3 3 8-8"/></g></svg>';
                                                    const s = this.template.createWrapper(this.template.themeClasses.feedbackTitle);
                                                    (s.innerHTML = this.surveyData.surveyThankYouMessage), t.appendChild(e), t.appendChild(s);
                                                }
                                            }));
                                    }
                                }
                            }),
                            (this.init = () => {
                                const t = document.querySelectorAll(`.${this.template.themeClasses.feedback} button`);
                                t &&
                                t.forEach((t) => {
                                    t.addEventListener("click", this.clickButtonHandle);
                                });
                            }),
                            (this.disabledAllButtonElements = () => {
                                const t = document.querySelectorAll(`.${this.template.themeClasses.feedback} button`);
                                t &&
                                t.forEach((t) => {
                                    t instanceof HTMLButtonElement && (t.disabled = !0);
                                });
                            }),
                            (this.getContent = () => ("nps" === this.surveyData.surveyType ? this.getNpsContent() : this.getEmojiesContent())),
                            (this.getEmojiesContent = () => {
                                const t = this.template.createWrapper(this.template.themeClasses.feedback);
                                (t.dataset.ufElement = "feedback"), t.classList.add(Kn), t.classList.add(this.template.themeClasses.reaction);
                                const e = this.template.createWrapper(this.template.themeClasses.feedbackTitle);
                                return (
                                    (e.innerHTML = this.surveyData.surveyQuestion),
                                        t.appendChild(e),
                                        Vn.forEach((e, s) => {
                                            const i = document.createElement("button");
                                            (i.dataset.value = (s + 1).toString(10)), (i.type = "button"), (i.innerHTML = e), t.appendChild(i);
                                        }),
                                        t
                                );
                            }),
                            (this.getNpsContent = () => {
                                const t = this.template.createWrapper(this.template.themeClasses.content),
                                    e = this.template.createWrapper(this.template.themeClasses.feedback);
                                (e.dataset.ufElement = "feedback"), e.classList.add(Kn), t.appendChild(e);
                                const s = this.template.createWrapper(this.template.themeClasses.feedbackTitle);
                                (s.innerHTML = this.surveyData.surveyQuestion), e.appendChild(s);
                                const i = this.template.createWrapper(this.template.themeClasses.buttonGroup);
                                [...Array(11)].forEach((t, e) => {
                                    const s = e.toString(10),
                                        r = document.createElement("button");
                                    r.classList.add(this.template.themeClasses.button), (r.dataset.value = s), (r.type = "button"), (r.innerHTML = s), i.appendChild(r);
                                }),
                                    e.appendChild(i);
                                const r = this.template.createWrapper(this.template.themeClasses.npsTitles);
                                if (this.surveyData.surveyMinimalValueLabel) {
                                    const t = document.createElement("span");
                                    t.classList.add(this.template.themeClasses.textLeft), (t.innerHTML = this.surveyData.surveyMinimalValueLabel), r.appendChild(t);
                                }
                                if (this.surveyData.surveyMaximalValueLabel) {
                                    const t = document.createElement("span");
                                    t.classList.add(this.template.themeClasses.textRight), (t.innerHTML = this.surveyData.surveyMaximalValueLabel), r.appendChild(t);
                                }
                                return e.appendChild(r), t;
                            }),
                            (this.stepId = e),
                            (this.surveyData = s),
                            (this.template = t),
                            (this.debug = Z),
                            (this.reporterApi = Ki(Pi)),
                            (this.usetifulTags = Ki(Ri));
                    }
                },
                zn = "previewTour",
                Gn = (t) => {
                    const e = t.target;
                    if (!e) return;
                    const s = e.closest(`.${Ue.formQuestion}`);
                    if (null !== s) {
                        const t = s.getAttribute("id");
                        switch ((e.classList.remove(Ue.error), s.classList.remove(Ue.error), e.tagName.toLowerCase())) {
                            case "input":
                                switch (e.getAttribute("type")) {
                                    case "radio":
                                        (0, q.updateTagValue)(t, e.value);
                                        break;
                                    case "checkbox":
                                        setTimeout(() => {
                                            (0, q.updateTagValue)(t, Qn(s));
                                        }, 100);
                                        break;
                                    default:
                                        Xn("focusout", t, e);
                                }
                                break;
                            case "select":
                                Xn("change", t, e);
                                break;
                            case "textarea":
                                Xn("focusout", t, e);
                        }
                    }
                },
                Qn = (t) => {
                    const e = [],
                        s = t.querySelectorAll("input");
                    return (
                        s.length > 0 &&
                        s.forEach((t) => {
                            t.checked && e.push(t.value);
                        }),
                            e.toString()
                    );
                },
                Xn = (t, e, s) => {
                    s.addEventListener(
                        t,
                        () => {
                            (0, q.updateTagValue)(e, s.value);
                        },
                        { once: !0 }
                    );
                };
            const Yn = class {
                constructor(t) {
                    (this.isEmpty = (t) => !t.value || "" === t.value),
                        (this.isValidEmail = (t) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.value)),
                        (this.hasSelectedInput = (t) => Array.from(t).some((t) => t.checked)),
                        (this.validateForm = () => {
                            this.loadFormsData();
                            let t = !0;
                            return (
                                this.fieldSets.forEach((e, s) => {
                                    if (!this.formElement || null === !this.formElement[s]) return void (t = !0);
                                    const i = [];
                                    for (let t = 0; t < e.length; t += 1) {
                                        const s = e[t];
                                        s.classList.remove(Ue.error);
                                        let r = !0;
                                        switch (s.tagName.toLowerCase()) {
                                            case "select":
                                                r = !this.isEmpty(s);
                                                break;
                                            case "input": {
                                                const t = s;
                                                (r = !t.required || (t.required && !this.isEmpty(t))), (r = "email" !== s.getAttribute("type") || (!t.required && "" === t.value) ? r : this.isValidEmail(t));
                                                break;
                                            }
                                            case "div": {
                                                const t = s.querySelectorAll("input");
                                                t.length > 0 && (r = this.hasSelectedInput(t));
                                                break;
                                            }
                                        }
                                        r || i.push(s);
                                    }
                                    if (i.length > 0) {
                                        let e = `${this.formElement[s].dataset.validationMessage || "Update values in the following fields"}<ul>`;
                                        i.forEach((t) => {
                                            var s, i;
                                            t.classList.add(Ue.error);
                                            let r = null === (i = null === (s = t.closest(`.${Ue.formQuestion}`)) || void 0 === s ? void 0 : s.querySelector("label")) || void 0 === i ? void 0 : i.textContent;
                                            r || (r = "<i>Empty label</i>"), (e += `<li>${r}</li>`);
                                        }),
                                            (e += "</ul>"),
                                            this.placeValidationMessage(e, this.formElement[s]),
                                            (t = !1);
                                    } else this.removeValidationMessage(this.formElement[s]);
                                }),
                                    t
                            );
                        }),
                        (this.removeValidationMessage = (t) => {
                            const e = t.querySelector(`section.${Ue.validationAlert}`);
                            e && e.parentNode && e.parentNode.removeChild(e);
                        }),
                        (this.placeValidationMessage = (t, e) => {
                            this.wasValidated && this.removeValidationMessage(e);
                            const s = document.createElement("section");
                            s.classList.add(Ue.validationAlert);
                            const i = document.createElement("span");
                            (i.textContent = "⚠ "), s.appendChild(i);
                            const r = document.createElement("span");
                            (r.innerHTML = t), s.appendChild(r), e.append(s), (this.wasValidated = !0);
                        }),
                        (this.storeDefaultValues = () => {
                            this.loadFormsData();
                            this.getAllQuestions().forEach((t) => {
                                const e = this.getFieldValue(this.getField(t));
                                e && (0, q.updateTagValue)(t.getAttribute("id"), e);
                            });
                        }),
                        (this.getFieldValue = (t) => {
                            var e, s;
                            const i = t.tagName.toLowerCase(),
                                r = t.querySelector("input");
                            if ("div" === i || "p" === i) {
                                if ("checkbox" === (null == r ? void 0 : r.type)) return Qn(t);
                                if ("radio" === (null == r ? void 0 : r.type)) {
                                    const i = t.querySelector("input[checked]");
                                    return null !== (s = null !== (e = null == i ? void 0 : i.value) && void 0 !== e ? e : (0, q.getTagValue)(t.id)) && void 0 !== s ? s : "";
                                }
                            }
                            return t.value;
                        }),
                        (this.reportAnswers = (t) => {
                            if (!this.formElement) return;
                            this.getAllQuestions().forEach((e) => {
                                var s, i, r;
                                const n = null !== (i = null === (s = e.querySelector("label")) || void 0 === s ? void 0 : s.textContent) && void 0 !== i ? i : e.getAttribute("id"),
                                    o = null !== (r = this.getFieldValue(this.getField(e))) && void 0 !== r ? r : "",
                                    a = ((t) => {
                                        switch (t.tagName.toLowerCase()) {
                                            case "select":
                                                return "radio";
                                            case "input":
                                                if ("checkbox" === t.getAttribute("type")) return "checkbox";
                                                break;
                                            default: {
                                                const e = t.querySelector("input");
                                                if (e && ("checkbox" === e.getAttribute("type") || "radio" === e.getAttribute("type"))) return e.getAttribute("type");
                                                break;
                                            }
                                        }
                                        return "text";
                                    })(this.getField(e)),
                                    l = new CustomEvent(H, { detail: { reportType: Qt, questionType: a, question: n, entityId: t, entityType: Vt, answer: o } });
                                document.dispatchEvent(l);
                            });
                        }),
                        (this.stepElementClass = t),
                        (this.formElement = null),
                        (this.stepElement = null),
                        (this.fieldSets = []),
                        (this.wasValidated = !1),
                        this.storeDefaultValues();
                }
                loadFormsData() {
                    var t;
                    (this.stepElement = document.querySelector(`.${this.stepElementClass}`)),
                    this.stepElement &&
                    ((this.formElement = Array.from(null === (t = this.stepElement) || void 0 === t ? void 0 : t.querySelectorAll(`.${Ue.formFieldset}`))),
                        this.formElement.forEach((t, e) => {
                            (this.fieldSets[e] = []), (this.fieldSets[e] = this.getFieldsToValidate(t));
                        }));
                }
                getAllQuestions() {
                    var t;
                    const e = [];
                    return (
                        null === (t = this.formElement) ||
                        void 0 === t ||
                        t.forEach((t) => {
                            const s = t.querySelectorAll(`.${Ue.formQuestion}`);
                            e.push(...s);
                        }),
                            e
                    );
                }
                getField(t) {
                    const e = t.querySelector("input"),
                        s = t.querySelector("textarea"),
                        i = t.querySelector("select"),
                        r = t.querySelectorAll('input[type="checkbox"]').length > 1,
                        n = t.querySelectorAll('input[type="radio"]').length > 1;
                    return !e || r || n ? (!s || r || n ? i || t : s) : e;
                }
                getFieldsToValidate(t) {
                    if (!t) return [];
                    const e = [];
                    return (
                        t.querySelectorAll(`.${Ue.formQuestion}`).forEach((t) => {
                            const s = t.dataset.required,
                                i = t.querySelector("[required]"),
                                r = t.querySelector("[type='email']"),
                                n = t.querySelector("input"),
                                o = t.querySelector("select");
                            ((s || i || r) && ((n && n.closest(`.${Ue.formQuestion}`) !== t) || (o && o.closest(`.${Ue.formQuestion}`) !== t))) || (s ? e.push(t) : i ? e.push(i) : r && e.push(r));
                        }),
                            e
                    );
                }
            };
            const Zn = class {
                constructor(t, e, s, i, r) {
                    (this.prepareAction = (t, e) => {
                        const s = this.template.createButton(this.actionData.value),
                            i = new Yn(e),
                            r = this.shouldValidateForm
                                ? () => {
                                    if (!i.validateForm())
                                        return (
                                            s.classList.add(Ue.errorShake),
                                                setTimeout(() => {
                                                    s.classList.remove(Ue.errorShake);
                                                }, 500),
                                                !1
                                        );
                                    i.reportAnswers(this.stepId), pe({ tourId: this.tourId, name: A });
                                }
                                : () => {
                                    pe({ tourId: this.tourId, name: A });
                                };
                        switch (this.actionData.type) {
                            case Ze:
                                s.addEventListener("click", () => {
                                    r();
                                }),
                                    s.classList.add(this.template.themeClasses.button);
                                break;
                            case ts:
                                s.addEventListener("click", () => {
                                    pe({ tourId: this.tourId, name: O });
                                }),
                                    s.classList.add(this.template.themeClasses.button);
                                break;
                            case ss:
                                s.addEventListener("click", () => {
                                    this.actionData.url && (it && Ct("stop preview"), _s(this.actionData.url, !0));
                                }),
                                    s.classList.add(this.template.themeClasses.button);
                                break;
                            case is:
                                s.addEventListener("click", () => {
                                    if (!this.actionData.tourId) return void console.warn("TourId in another tour button doesn't exist");
                                    const e = parseInt(this.actionData.tourId, 10);
                                    if ((this.isCurrentTour(e) && pe({ name: A, details: { display: !1 }, tourId: this.tourId }), this.actionData.url)) {
                                        window.usetiful_isAboutToRefresh = !0;
                                        !$s(window.location.href, this.actionData.url) || pe({ name: $, details: { tourId: e }, tourId: this.tourId }), this.isCurrentTour(e) || this.sendCloseTourEvent();
                                        const s = Object.assign({}, this.actionData);
                                        t(s), s.url && _s(s.url, !1);
                                    } else if ((this.isCurrentTour(e) || (pe({ name: $, details: { tourId: e }, tourId: this.tourId }), this.sendCloseTourEvent()), it)) {
                                        const e = Object.assign({}, this.actionData);
                                        t(e), e.url && ((s = e.url), window.history.replaceState ? window.history.replaceState(void 0, "", s) : (window.location.hash = s), window.location.reload());
                                    }
                                    var s;
                                }),
                                    s.classList.add(this.template.themeClasses.button);
                                break;
                            case rs:
                                s.addEventListener("click", () => {
                                    pe({ tourId: this.tourId, name: _ });
                                }),
                                    s.classList.add(this.template.themeClasses.button);
                                break;
                            default:
                                s.addEventListener("click", () => {
                                    pe({ name: B, details: { stepId: this.actionData.to, display: !0 }, tourId: this.tourId });
                                }),
                                    s.classList.add(this.template.themeClasses.button);
                        }
                        return (
                            (this.actionData.styleType ? this.actionData.styleType === ns : this.actionData.type === Ze || this.actionData.type === is) && s.classList.add(this.template.themeClasses.buttonPrimary),
                                this.template.appendButtonDataAttributes(s),
                                s
                        );
                    }),
                        (this.sendCloseTourEvent = () => {
                            pe({ name: _, details: { reason: Nt }, tourId: this.tourId });
                        }),
                        (this.isCurrentTour = (t) => t === this.tourId),
                        (this.actionData = t),
                        (this.template = s),
                        (this.tourName = e),
                        (this.tourId = i),
                        (this.shouldValidateForm = !1),
                        (this.stepId = r);
                }
            };
            class to {
                constructor(e, s, i) {
                    var n = this;
                    (this.doesStepElementExist = (t) => null !== hs(`.${this.template.themeClasses.prefix}-${t}`)),
                        (this.destructStep = (t) => {
                            vt(`DestructStep: stepName ${this.stepData.name}`), bt(this.stepData);
                            const e = null == t ? void 0 : t.stepData;
                            if (this.stepData) {
                                const t = this.stepData.progressOnClick || "",
                                    s = this.stepData.element || "",
                                    i = new Hn(t, s, this.elementTrigger, this.tourId);
                                switch (this.stepData.type) {
                                    case He:
                                        this.template.destructElement(this.stepData.name);
                                        break;
                                    case We:
                                        this.template.destructElement(this.stepData.name), i.removeTrigger();
                                        break;
                                    case Fe:
                                        i.removeTrigger(), this.destroy(), this.template.destructElement(this.stepData.name);
                                }
                                !this.stepData.highlight || !e || (e.highlight && "pointer" === e.type) || setTimeout(() => Kr(), 10);
                            }
                        }),
                        (this.placeStepProgressTrigger = () => {
                            const { stepData: t } = this,
                                e = new Hn((null == t ? void 0 : t.progressOnClick) || "", t.element || "", this.elementTrigger, this.tourId);
                            t.type === Fe && this.isPositionTypeScreen() && (e.pointerSelector = "body"), e.placeTrigger();
                        }),
                        (this.isAppearsTrigger = () => {
                            var t, e, s;
                            return (
                                (null === (t = this.stepData) || void 0 === t ? void 0 : t.trigger) &&
                                "appears" === (null === (e = this.stepData) || void 0 === e ? void 0 : e.trigger.type) &&
                                "" !== (null === (s = this.stepData) || void 0 === s ? void 0 : s.trigger.element)
                            );
                        }),
                        (this.waitForStep = (t, e, s) => {
                            var i, r;
                            if ((vt(`WaitForStep called - ${t}`), !t || !(null === (i = this.stepData) || void 0 === i ? void 0 : i.trigger))) return;
                            Kr();
                            const n = new Ps(null === (r = this.stepData) || void 0 === r ? void 0 : r.trigger, this.availableOnPage);
                            (n.triggerFunction = e),
                                (n.failFunction = s),
                                (n.altSolution = () => {
                                    this.showAlternativeSolution(!0);
                                });
                            n.setAppearTrigger() && (window.usetiful_intervals.push(n.intervalId), n.intervalId && this.tour.waiters.push(n.intervalId));
                        }),
                        (this.constructStep = function (t) {
                            let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                                s = Dt;
                            if (((n.isDevKit = e), vt(`constructStep: step index ${n.tour.getCurrentStepIndex()}, display: ${t}`), t && pe({ name: R, details: { status: r }, tourId: n.tourId }), n.doesStepElementExist(n.stepData.name))) {
                                const t = hs(`.${n.template.themeClasses.prefix}-${n.stepData.name}`);
                                return t && ws(t) ? void n.showCurrentStep() : void 0;
                            }
                            switch ((it && !n.isAppearsTrigger() && St(), n.stepData.type)) {
                                case He:
                                    n.isAppearsTrigger()
                                        ? n.waitForStep(t, () => {
                                            n.prepareModal(t), it && St();
                                        })
                                        : n.prepareModal(t);
                                    break;
                                case We:
                                    n.isAppearsTrigger()
                                        ? n.waitForStep(t, () => {
                                            n.prepareSlideout(t), it && St();
                                        })
                                        : n.prepareSlideout(t);
                                    break;
                                case Fe:
                                    if (!n.isCreatingIntervalRunning && null == n.prepareStepPointer(t)) return;
                                    break;
                                case qe:
                                    (s = At), n.stepData.tourName && "" !== n.stepData.tourName && pe({ name: $, details: { tourId: "self" !== n.stepData.tourName ? n.stepData.tourId : n.tourId }, tourId: n.tourId });
                                    if (new qn(n, n.tour).makeAutoRedirect()) return;
                                    "self" === n.stepData.tourName ? pe({ name: A, details: { display: !1 }, tourId: n.tourId }) : pe({ name: _, tourId: n.tourId }), n.stepData.url && window.localStorage.setItem(dt, n.stepData.url);
                                    break;
                                case Ve:
                                    if (n.stepData.delay) {
                                        (s = Ot), vt(`constructStep: Delay step. Waiting for ${n.stepData.delay}sec.`);
                                        const t = 1e3 * n.stepData.delay;
                                        window.usetiful_tourDelayTimeoutVar = setTimeout(() => {
                                            (window.usetiful_tourDelayTimeoutVar = void 0), pe({ tourId: n.tourId, name: A });
                                        }, t);
                                    }
                                    break;
                                case Ke:
                                    s = Bt;
                                    new qn(n, n.tour).runTriggerEvent(), pe({ tourId: n.tourId, name: A });
                                    break;
                                case Je: {
                                    (s = Rt), n.tourId && pe({ tourId: n.tourId, name: $ });
                                    const t = new qn(n, n.tour);
                                    n.tourTriggers.clearTourTriggerAfterDelay(n.tourId, !0, n.getTimeout()), n.performActionWithPotentialRedirect(n.tour.goToNextStep), t.runPageAction();
                                    break;
                                }
                            }
                            if (!t || (n.localStorageTourHandler.isTourReopenFromLS(n.tour.name) && 0 !== n.tour.getCurrentStepIndex()) || window.usetiful_isAboutToRefresh) vt("constructStep: reopen action is not send into report");
                            else {
                                const t = new CustomEvent(M, { detail: { type: Vt, entityId: n.tourId, stepIndex: n.tour.getCurrentStepIndex(), action: s, itemId: n.stepData.id, isDevKit: n.isDevKit } });
                                document.dispatchEvent(t);
                            }
                        }),
                        (this.showAlternativeSolution = (t) => {
                            var e;
                            if (Z) {
                                ys(`.${this.template.themeClasses.notification}`);
                                const s = t
                                    ? `Step '${this.stepData.title}' can't be shown because the element <b>'${
                                        null === (e = this.stepData.trigger) || void 0 === e ? void 0 : e.element
                                    }' didn't appear in given time limit</b> so the trigger timed out. <a href="https://usetiful.freshdesk.com/support/solutions/articles/77000481466-triggering-by-element-appears" target="_blank">Learn more</a>`
                                    : `Step '${this.stepData.title}' can't be shown. Pointing element <b>'${this.stepData.element}' doesn't exist on this page or is hidden</b>. <a href="https://usetiful.freshdesk.com/support/solutions/articles/77000488290-why-is-my-pointer-showing-in-right-bottom-corner-" target="_blank">Learn more</a>`;
                                this.template.notifyUser(
                                    "tour",
                                    "Alert",
                                    s,
                                    () => {
                                        const t = this.template.createWrapper(this.template.themeClasses.actions),
                                            e = this.template.createLink("Close tour");
                                        e.addEventListener(
                                            "click",
                                            (t) => {
                                                ys(`.${this.template.themeClasses.notification}`), this.tour.closeTour(), t.stopImmediatePropagation(), t.preventDefault();
                                            },
                                            !1
                                        );
                                        const s = this.template.createLink("< Previous step");
                                        return (
                                            s.addEventListener(
                                                "click",
                                                (t) => {
                                                    ys(`.${this.template.themeClasses.notification}`), this.tour.goToPreviousStep(), t.stopImmediatePropagation(), t.preventDefault();
                                                },
                                                !1
                                            ),
                                                t.append(s),
                                                t.append(e),
                                                t
                                        );
                                    },
                                    [Ue.alert],
                                    () => {}
                                );
                            } else {
                                vt(`constructAborted.Element ${this.stepData.element} doesn't exist`),
                                    Un({ name: Rn, text: `Element '${this.stepData.element}' doesn't exist. Step displayed as slideout.`, id: this.stepData.id }),
                                    this.tour.currentStep.destructStep();
                                const t = new to(Object.assign({}, this.stepData), this.tour, this.template);
                                (t.stepData.type = We),
                                    (t.stepData.trigger = {}),
                                t.stepData.actions ||
                                (t.stepData.actions = [
                                    { type: "previous", value: "<" },
                                    { type: "next", value: ">" },
                                ]);
                                const e = this.tour.getStepIndex(this.id);
                                this.tour.updateCurrentStep(e), t.constructStep(!0);
                            }
                        }),
                        (this.prepareModal = (t) => {
                            const e = this.template.createWrapper(this.template.themeClasses.modal);
                            (e.dataset.ufContent = "modal"), t && e.classList.add(Ue.visible), e.classList.add(`${this.template.themeClasses.prefix}-${this.stepData.name}`);
                            const s = this.template.createWrapper(this.template.themeClasses.modalInner),
                                i = document.body.appendChild(e);
                            this.stepData.customStyle && (os(this.stepData.customStyle, s), as(this.stepData.customStyle, s));
                            const r = i.appendChild(s);
                            this.appendInnerElement(r), t && window.scrollTo({ top: 0 }), this.setStepElement(i);
                        }),
                        (this.prepareSlideout = (t) => {
                            const e = this.template.createWrapper(this.template.themeClasses.slideout);
                            (e.dataset.ufContent = "slideout"),
                                e.classList.add(`${this.template.themeClasses.prefix}-${this.stepData.position}`, `${this.template.themeClasses.prefix}-${this.stepData.name}`),
                            t && e.classList.add(Ue.visible);
                            const s = this.template.createWrapper(this.template.themeClasses.slideoutInner),
                                i = document.body.appendChild(e),
                                r = i.appendChild(s);
                            this.stepData.customStyle && (os(this.stepData.customStyle, r), as(this.stepData.customStyle, r)), this.appendInnerElement(r), this.placeStepProgressTrigger(), this.setStepElement(i);
                        }),
                        (this.failToDisplayPointer = () => {
                            Kr(), this.stepData.autoskip && this.tour.autoSkip(this.stepData.autoskip);
                        }),
                        (this.prepareStepPointer = (t) => {
                            if (this.isPositionTypeElement() && this.stepData.element) {
                                const e = hs(this.stepData.element),
                                    s = this.isAppearsTrigger();
                                if (!e || ws(e))
                                    return this.stepData.autoskip
                                        ? (s
                                            ? (vt("prepareStepPointer: Step has trigger elementAppears. Waiting on the step element..."),
                                                this.waitForStep(
                                                    t,
                                                    () => {
                                                        it && St(), this.createPointer(!0);
                                                    },
                                                    this.failToDisplayPointer
                                                ))
                                            : (vt(`prepareStepPointer: Step index ${this.tour.getCurrentStepIndex()} will be skipped.`), this.failToDisplayPointer()),
                                            null)
                                        : (s || this.stepData.trigger
                                            ? (vt("prepareStepPointer: Step has trigger elementAppears. Waiting on the step element..."),
                                                this.waitForStep(t, () => {
                                                    it && St(), this.createPointer(!0);
                                                }),
                                                (this.isCreatingIntervalRunning = !1))
                                            : (Kr(), yt(`prepareStepPointer: We couldn't find element of step ${this.stepData.name}. Showing alternative solution...`), this.doubleDelay()),
                                            null);
                                this.createPointer();
                            } else this.isPositionTypeScreen() && this.createPointer();
                            return !0;
                        }),
                        (this.createPointer = function () {
                            let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            if ((n.prepareBubble(), n.placeStepProgressTrigger(), t)) {
                                const t = new CustomEvent(M, { detail: { type: Vt, entityId: n.tourId, stepIndex: n.tour.getCurrentStepIndex(), action: Dt, itemId: n.stepData.id, isDevKit: n.isDevKit } });
                                document.dispatchEvent(t);
                            }
                        }),
                        (this.prepareBubble = () => {
                            var e, s, i, r;
                            if (this.stepData && this.stepData.element) {
                                const t = hs(this.stepData.element);
                                this.setTargetElement(t);
                            }
                            if (this.isPositionTypeElement() && !this.getTargetElement()) return void vt("Element doesn't exist");
                            const n = "" !== (null === (e = this.stepData) || void 0 === e ? void 0 : e.title) && !0 === (null === (s = this.stepData) || void 0 === s ? void 0 : s.publicTitle),
                                o = this.template.createTitle(4, this.stepData.title, n);
                            let a = null;
                            this.tour.isProgress() && (a = this.getProgressBar());
                            const l = this.tour.tourData,
                                { progressType: c } = l,
                                h = this.template.createBubble({
                                    ident: this.stepData.name,
                                    contentHTML: this.stepData.content ? this.stepData.content : "",
                                    title: o || null,
                                    progressBar: a,
                                    alignment: this.stepData.alignment ? this.stepData.alignment : "down",
                                    actionNumbers: (null === (i = this.stepData.actions) || void 0 === i ? void 0 : i.length) ? (null === (r = this.stepData.actions) || void 0 === r ? void 0 : r.length) : 0,
                                    progressType: c,
                                    closeButton: this.createCloseButton(),
                                    appendAdditionalContent: (e) => {
                                        this.prepareFeedback(e), (!this.stepData.progressOnClick || this.stepData.progressOnClick === t) && this.stepData.actions && this.stepData.actions.length > 0 && e.appendChild(this.prepareActions());
                                    },
                                    hotspot: !1,
                                    customStyle: this.stepData.customStyle ? this.stepData.customStyle : null,
                                    theme: this.tour.theme,
                                });
                            this.positionPointerElement(),
                                (window.onresize = () => {
                                    this.onResizeActions(h);
                                }),
                                this.setStepElement(h);
                            const u = setInterval(() => {
                                const t = this.getStepElement();
                                t && t.offsetHeight > 0 && (this.scrollIntoView(), clearInterval(u));
                            }, 100);
                        }),
                        (this.onResizeActions = (t) => {
                            this.isPositionTypeElement() && this.getTargetElement() && t && !ws(this.getTargetElement()) && !ws(t) && this.scrollIntoView();
                        }),
                        (this.scrollIntoView = () => {
                            var t, e, s;
                            vt("scroll bubble into view");
                            try {
                                const i = null === (t = this.getStepElement()) || void 0 === t ? void 0 : t.getAttribute("data-floating-placement");
                                if (
                                    i &&
                                    (function (t, e, s) {
                                        return !(!s || !e) && (t === ze || "top" === t ? e.offsetHeight + s.offsetHeight > 0.9 * window.innerHeight : e.offsetHeight > 0.9 * window.innerHeight);
                                    })(i, this.getTargetElement(), this.getStepElement())
                                ) {
                                    const t = i === ze ? "end" : "start";
                                    null === (e = this.getStepElement()) || void 0 === e || e.scrollIntoView({ behavior: "smooth", block: t });
                                } else {
                                    const t = window.innerWidth <= 600 ? "end" : "center";
                                    null === (s = this.getTargetElement()) || void 0 === s || s.scrollIntoView({ behavior: "smooth", block: t });
                                }
                            } catch (t) {}
                        }),
                        (this.positionPointerElement = () => {
                            const { stepData: t } = this,
                                e = `.${this.template.themeClasses.prefix}-${t.name}`;
                            return t.type === Fe && this.availableOnPage.checkElement(e)
                                ? (vt(`positionPointerElement: Checking position: ${t.name}`),
                                this.isPositionTypeElement() && t.element && this.availableOnPage.checkElement(t.element) && this.setTargetElement(hs(t.element)),
                                    this.setStepElement(hs(e)),
                                    this.create())
                                : (vt("positionPointerElement: Element disappeared..."), !1);
                        }),
                        (this.appendInnerElement = (e) => {
                            const { title: s, publicTitle: i, content: r, progressOnClick: n, actions: o, alignment: a } = this.stepData,
                                l = "" !== s && !0 === i,
                                c = e,
                                h = this.template.createWrapper(this.template.themeClasses.content),
                                u = this.template.createTitle(3, s, l);
                            l || h.classList.add(this.template.themeClasses.contentWithoutTitle),
                            h && r && (h.innerHTML = (0, q.replaceTags)(r)),
                                c.appendChild(this.createCloseButton()),
                            u && c.appendChild(u),
                            this.tour.isProgress() && c.appendChild(this.getProgressBar()),
                                c.appendChild(h),
                                this.prepareFeedback(c),
                            (!n || (n === t && o && o.length > 0)) && c.appendChild(this.prepareActions());
                            const { progressType: d } = this.tour.tourData;
                            c.appendChild(this.template.createSpaceMaker(a, null == o ? void 0 : o.length, d));
                            Ki(qi.watermark) && c.appendChild(this.template.createWatermarkBadge()), this.template.checkScrollableClass(h);
                        }),
                        (this.createCloseButton = () => {
                            const t = this.template.createButton('<svg xmlns="http://www.w3.org/2000/svg"><path stroke="#000" stroke-width="2" d="M1 16L16 1M1 1l15 15"/></svg>', this.template.themeClasses.buttonClose);
                            return (
                                t.addEventListener("click", () => {
                                    this.tour.closeTour();
                                }),
                                    t
                            );
                        }),
                        (this.prepareFeedback = (t) => {
                            var e;
                            if (null === (e = this.stepData.surveyData) || void 0 === e ? void 0 : e.feedback) {
                                const e = new Jn(this.template, this.stepData.id, this.stepData.surveyData);
                                t.appendChild(e.getContent()), e.init();
                            }
                        }),
                        (this.prepareActions = () => {
                            if (!this.stepData) return;
                            const t = this.template.createWrapper(this.template.themeClasses.actions);
                            if ((this.stepData.alignment && t.classList.add(this.stepData.alignment), this.stepData.actions))
                                for (const e of this.stepData.actions) {
                                    const s = new Zn(e, this.tour.name, this.template, this.tourId, this.stepData.id);
                                    s.shouldValidateForm = this.isForm();
                                    const i = s.prepareAction(this.modifyURLBeforeRedirect, `${this.template.themeClasses.prefix}-${this.stepData.name}`);
                                    i && t.appendChild(i);
                                }
                            return t;
                        }),
                        (this.getProgressBar = () => {
                            const t = this.tour.getTour(),
                                e = this.localStorageTourHandler.getCurrentStepIndexLS(this.tour.id);
                            return this.template.progressBarController(this.stepData, t, e);
                        }),
                        (this.modifyURLBeforeRedirect = (t) => {
                            let e = t;
                            t || (e = this.stepData), e.url || (e.url = window.location.href);
                            let s = !1;
                            if (!$s(window.location.href, e.url) && e.tourId) {
                                const t = this.tour.getNextStep(),
                                    i = !t,
                                    r = e.tourId.toString() !== this.tour.id.toString();
                                if ((r || (!i && !r)) && ((e.url += `${it ? `${Os(e.url) ? "&" : "#"}${zn}-` : `?${o}=`}${e.tourId}`), (s = !0), !i && !r)) {
                                    const s = this.tour.getStepIndex(t.name);
                                    e.url += it ? `-${s}-${"self" === e.tourName ? this.tour.name : e.tourName}` : `&${a}=${s}`;
                                }
                            }
                            s || "self" === e.tourName || (it && e.tourId && (e.url += `${Os(e.url) ? "&" : "#"}${zn}-${e.tourId}`));
                        }),
                        (this.elementTrigger = (t) => {
                            var e;
                            bt(t);
                            const s = [t.target];
                            t.target && t.target.parentElement && (s.push(t.target.parentElement), t.target.parentElement.parentElement && s.push(t.target.parentElement.parentElement));
                            for (let t = 0; t < s.length; t += 1) {
                                const e = s[t];
                                if (e && e.classList.contains(this.template.themeClasses.buttonClose)) return;
                            }
                            vt("elementTrigger: trigger called", !0);
                            const i = null === (e = this.tour.getCurrentStep()) || void 0 === e ? void 0 : e.stepData;
                            if ((!(!!i && i.runDefaults) && t && (yt(`elementTrigger: Preventing default ${t.type} action.`), t.preventDefault()), !this.tour)) return !1;
                            this.tourTriggers.setTourTriggerToLocalStorage(this.tour.id), this.tourTriggers.clearTourTriggerAfterDelay(this.tour.id, !0, this.getTimeout()), this.performActionWithPotentialRedirect(this.tour.goToNextStep);
                        }),
                        (this.getTimeout = () => {
                            let t = 1500;
                            const e = this.tour.getNextStep();
                            return e && e.stepData.type === Ve && e.stepData.delay && (t += 1e3 * e.stepData.delay), t;
                        }),
                        (this.performActionWithPotentialRedirect = (t) => {
                            pe({ tourId: this.tourId, name: x }),
                                setTimeout(() => {
                                    t();
                                }, 1);
                        }),
                        (this.isPositionTypeElement = () => {
                            var t;
                            return !((!this.stepData || this.stepData.positionType) && "element" !== (null === (t = this.stepData) || void 0 === t ? void 0 : t.positionType));
                        }),
                        (this.isPositionTypeScreen = () => {
                            var t;
                            return "screen" === (null === (t = this.stepData) || void 0 === t ? void 0 : t.positionType);
                        }),
                        (this.isForm = () => {
                            var t;
                            return null !== (null === (t = this.stepElement) || void 0 === t ? void 0 : t.querySelector(`.${Ue.formFieldset}`));
                        }),
                        (this.id = e.id),
                        (this.name = e.name),
                        (this.stepData = e),
                        (this.stepElement = null),
                        (this.targetElement = null),
                        (this.tour = s),
                        (this.tourId = s.id),
                        (this.template = i || new Ds()),
                        (this.tourTriggers = Ki(Oi)),
                        (this.isCreatingIntervalRunning = !1),
                        (this.localStorageTourHandler = Ki(Fi)),
                        (this.availableOnPage = Ki(Mi)),
                        (this.isDevKit = !1);
                }
                setStepData(t) {
                    this.stepData = t;
                }
                getStepData() {
                    return this.stepData;
                }
                setStepElement(t) {
                    this.stepElement = t;
                }
                getStepElement() {
                    return this.stepElement;
                }
                setTargetElement(t) {
                    this.targetElement = t;
                }
                getTargetElement() {
                    return this.targetElement;
                }
                update() {
                    this.floatingInstance && this.floatingInstance();
                }
                destroy() {
                    var t;
                    window.usetiful_floatUpdateCanceler && window.usetiful_floatUpdateCanceler(),
                    window.usetiful_floatScrollUpdateCanceler && window.usetiful_floatScrollUpdateCanceler(),
                        (this.floatingInstance = null),
                    null === (t = this.unsubscribeElementRemove) || void 0 === t || t.call(this),
                        (this.unsubscribeElementRemove = void 0);
                }
                create() {
                    vt("StepControl::create called.");
                    const t = this.isPositionTypeScreen(),
                        e = t
                            ? ((t) => {
                                var e;
                                if (!t || !t.coordinates) return null;
                                let { top: s, left: i, right: r, bottom: n } = t.coordinates;
                                "number" != typeof s && (s = parseInt(s, 10)), "number" != typeof i && (i = parseInt(i, 10)), "number" != typeof r && (r = parseInt(r, 10)), "number" != typeof n && (n = parseInt(n, 10));
                                const { width: o, height: a } = (null === (e = document.body) || void 0 === e ? void 0 : e.getBoundingClientRect()) || {},
                                    l = (t, e, s) => (t || e ? t || s - e : s / 2),
                                    c = l(s, n, a),
                                    h = l(i, r, o);
                                return {
                                    getBoundingClientRect: () => {
                                        var t, e, s;
                                        const i = (null === (t = document.body) || void 0 === t ? void 0 : t.getBoundingClientRect()) || {},
                                            r = h + (null !== (e = null == i ? void 0 : i.left) && void 0 !== e ? e : 0),
                                            n = c + (null !== (s = null == i ? void 0 : i.top) && void 0 !== s ? s : 0);
                                        return { x: h, y: c, width: 0, height: 0, top: n, right: i.width - r, bottom: i.height - n, left: r };
                                    },
                                };
                            })(this.stepData)
                            : this.getTargetElement(),
                        s = this.getStepElement();
                    if (!e || !s) return;
                    const i = !t && ws(e);
                    if (i) return vt("Target element is hidden."), void this.hideCurrentStep();
                    if (
                        (!i && null !== this.getStepElement() && ws(this.getStepElement()) && (vt("Showing step element."), this.showCurrentStep()),
                            vt("Updating current coordinates because target element and step element aren't hidden."),
                        (this.floatingInstance || this.unsubscribeElementRemove) && (this.destroy(), vt("Destroying floatingInstance just before creating new one - may be destroy should be called explicitly before")),
                            vt("Start calculation of new coordinates"),
                        this.stepData && s && e)
                    ) {
                        const i = "absolute",
                            r = tn(this.stepData.position),
                            n = !t && this.stepData.highlight ? Xr(i) : void 0;
                        (this.floatingInstance = () => en({ targetElement: e, bubble: s, orientation: r, extraModifier: [Yr(n)] })),
                            (window.usetiful_floatScrollUpdateCanceler = qr(e, s, this.floatingInstance, { ancestorScroll: !0 })),
                            (window.usetiful_floatUpdateCanceler = qr(e, s, this.floatingInstance, { animationFrame: !0 })),
                            (this.unsubscribeElementRemove = ((t) => {
                                let e,
                                    { targetElement: s, removeCallback: i, AddedCallback: r, selector: n, baseSelector: o } = t;
                                try {
                                    const t = [s];
                                    let a = s.parentNode;
                                    for (; a; ) t.push(a), (a = a.parentNode);
                                    e = new MutationObserver((e) => {
                                        e.forEach((e) => {
                                            "childList" === e.type
                                                ? (i && Array.from(e.removedNodes).find((e) => t.includes(e)) && i("remove element"),
                                                r && Array.from(e.addedNodes).find((e) => t.includes(e) || (n && e.matches && e.matches(n))) && r("add element"))
                                                : "attributes" === e.type &&
                                                setTimeout(() => {
                                                    const a = e.target;
                                                    if (a === s || t.includes(a)) {
                                                        const t = Ts(n, o, s);
                                                        i && t && i(gs), r && !t && r(gs);
                                                    }
                                                }, 600);
                                        });
                                    });
                                    const l = { attributes: !0, attributeFilter: ["class", "style"], childList: !0, subtree: !0 };
                                    t.length && e.observe(t[t.length - 1], l);
                                } catch (t) {}
                                return function () {
                                    null == e || e.disconnect();
                                };
                            })({
                                targetElement: e,
                                removeCallback: (t) => {
                                    t !== gs && (this.hideCurrentStep(), zr());
                                },
                                AddedCallback: (t) => {
                                    if (t !== gs && this.stepData && this.stepData.element) {
                                        const t = hs(this.stepData.element);
                                        t && (this.setTargetElement(t), this.create());
                                    }
                                },
                                selector: this.stepData.element,
                            }));
                    }
                }
                showCurrentStep() {
                    this.stepElement && Gr(this.stepElement);
                }
                hideCurrentStep() {
                    this.stepElement && Qr(this.stepElement);
                }
                doubleDelay() {
                    window.usetiful_tourPointerWaitingForElement = setTimeout(() => {
                        const { element: t } = this.stepData;
                        t && this.availableOnPage.checkElement(t) && !ws(hs(t))
                            ? this.createPointer(!0)
                            : (window.usetiful_tourPointerWaitingForElement = setTimeout(() => {
                                t && this.availableOnPage.checkElement(t) && !ws(hs(t)) ? this.createPointer(!0) : this.showAlternativeSolution(!1);
                            }, 1500));
                    }, 1500);
                }
            }
            const eo = to;
            const so = class {
                constructor(t, e) {
                    var s,
                        o = this;
                    (this.contentType = "tour"),
                        (this.goToNextStepEvent = (t) => {
                            this.goToNextStep(t.detail.props && void 0 !== t.detail.props.display ? t.detail.props.display : void 0);
                        }),
                        (this.goToPreviousStepEvent = () => {
                            this.goToPreviousStep();
                        }),
                        (this.closeTourEvent = (t) => {
                            this.closeTour(t.detail.props && t.detail.props.reason ? t.detail.props.reason : void 0);
                        }),
                        (this.setTourTriggerToLocalStorageEvent = (t) => {
                            this.tourTriggers.setTourTriggerToLocalStorage(t.detail.props && t.detail.props.tourId ? t.detail.props.tourId : this.id);
                        }),
                        (this.moveToStepEvent = (t) => {
                            if (!t.detail.props) return;
                            let { stepId: e } = t.detail.props;
                            if ("string" == typeof t.detail.props.stepId) {
                                const s = parseInt(t.detail.props.stepId, 10);
                                s && s.toString() === e && (e = s);
                            }
                            this.moveToStep({ display: t.detail.props.display, stepIdent: e });
                        }),
                        (this.setProgressEvent = (t) => {
                            this.localStorageTourHandler.setProgressToLocalStorage(t, this.getTour(), this.getCurrentStepIndex()), (this.state = t);
                        }),
                        (this.eventHandler = (t) => {
                            if (t.detail.tourId && t.detail.tourId === this.id)
                                switch (t.detail.event) {
                                    case A:
                                        this.goToNextStepEvent(t);
                                        break;
                                    case O:
                                        this.goToPreviousStepEvent();
                                        break;
                                    case _:
                                        this.closeTourEvent(t);
                                        break;
                                    case $:
                                        this.setTourTriggerToLocalStorageEvent(t);
                                        break;
                                    case B:
                                        this.moveToStepEvent(t);
                                        break;
                                    case R:
                                        t.detail.props && t.detail.props.status && this.setProgressEvent(t.detail.props.status);
                                        break;
                                    case N:
                                        this.placeNextStepTrigger();
                                }
                        }),
                        (this.placeTourListeners = () => {
                            document.addEventListener(T, this.eventHandler);
                        }),
                        (this.removeTourListeners = () => {
                            document.removeEventListener(T, this.eventHandler);
                        }),
                        (this.runTour = (t) => {
                            let { display: e = !1, startStep: s, isDevKit: i = !1, runByParent: o } = t,
                                a = e;
                            window.usetiful_isAboutToRefresh && (a = !1), vt(`runTour: Starting tour = ${this.tourData.name}, display = ${a}, licence = ${Ki(qi.license)}, startStep = ${s}`, !0), this.placeTourListeners();
                            const l = this.localStorageTourHandler.getObjectStatus(this.tourData.id.toString());
                            if (i) {
                                if (l === r) return void yt("Tour that you want to launch is already running");
                                this.closeTour();
                            }
                            const { id: c, steps: h, theme: u, themeSlug: d, showEverytime: p, autoplay: g } = this.tourData;
                            Cn(v, c),
                                pe({ isToursContext: !0, name: D, details: { value: this } }),
                                this.loader.loadTheme(u, d).then((t) => {
                                    var e, r, u, d, m, f;
                                    null === (e = this.getCurrentStep()) || void 0 === e || e.update(), this.template.setTheme(t), this.template.setIsWatermark(Ki(qi.watermark));
                                    let v = this.localStorageTourHandler.getCurrentStepIndexLS(c);
                                    if (s && s > 0) v = s;
                                    else {
                                        const t = this.localStorageTourHandler.getObjectState(this.tourData.id.toString(), "currentStep");
                                        v = t || 0;
                                    }
                                    const y = null === (r = this.getCurrentStep()) || void 0 === r ? void 0 : r.getStepData();
                                    if (
                                        (y && y.type === qe && v > 0 && "self" !== y.tourName && (vt("runTour: Current step is redirect. Moving to the previous step."), vt(`runTour: ${y.tourName}`), (v -= 1)),
                                            !o && this.isButton() && Tt(this.tourData, this.localStorageTourHandler) && (Ki(Mi).checkAvailableOnPage(this.tourData.targets, this.tourData.targetOperator) || it)
                                                ? this.currentMainButton.placeUsetifulButton(this.tourData)
                                                : this.currentMainButton.getButtonElement() && this.currentMainButton.destroy(),
                                        a || p || l !== n)
                                    ) {
                                        if (a)
                                            this.stepTriggersController.placeTourTriggers(h, this.triggerEvent, this.reverseTriggerEvent),
                                                this.updateCurrentStep(v),
                                            null === (u = this.getCurrentStep()) || void 0 === u || u.placeStepProgressTrigger();
                                        else if (!g) return console.warn("Shouldn't be displayed and is manual tour"), void (null === (d = this.getCurrentStep()) || void 0 === d || d.stepData);
                                        (null === (m = this.getCurrentStep()) || void 0 === m ? void 0 : m.isAppearsTrigger())
                                            ? null === (f = this.getCurrentStep()) ||
                                            void 0 === f ||
                                            f.waitForStep(a, () => {
                                                St(), this.moveToStep({ stepIndex: v, display: a, isDevKitDirect: !1, isDevKitIndirect: i });
                                            })
                                            : this.moveToStep({ stepIndex: v, display: a, isDevKitDirect: !1, isDevKitIndirect: i });
                                    } else console.warn("Tour has been seen and shouldn't be displayed");
                                });
                        }),
                        (this.destroy = () => {
                            this.removeTourListeners(), this.clearWaiters();
                        }),
                        (this.closeTour = function (t) {
                            let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                            var s, a, l, c, h, u, d, p;
                            it && Ct("close tour"), ((o.tourTriggers && !o.tourTriggers.hasTourTrigger(o.id)) || 0 === o.currentStepIndex) && Cn("", null);
                            let g = t;
                            const m = o.getTour();
                            if (!m || o.localStorageTourHandler.getObjectStatus(m.id.toString()) !== r)
                                return vt("call closeTour but there is no running tour at this moment."), zr(), void (null === (s = o.getCurrentStep()) || void 0 === s || s.destructStep());
                            if ((vt(`closeTour: tour: ${m.name}, with reason: ${t}`, !0), g || (g = jt), o.isLastStep() || o.isLastStepReached)) {
                                Ki(Wi).completeItem(i, o.id);
                            }
                            const f = new CustomEvent(M, {
                                detail: { type: Vt, entityId: m.id, stepIndex: o.getCurrentStepIndex(), action: g, itemId: null === (a = o.getCurrentStep()) || void 0 === a ? void 0 : a.stepData.id, isDevKit: e },
                            });
                            document.dispatchEvent(f),
                                zr(),
                            o.triggers && o.triggers.triggersClearance(!0),
                                o.clearWaiters(),
                            null === (l = o.getCurrentStep()) || void 0 === l || l.destructStep(),
                            ((t === Nt && !(null === (c = o.getCurrentStep()) || void 0 === c ? void 0 : c.stepData.tourName)) ||
                                void 0 === t ||
                                ((null === (u = null === (h = o.getCurrentStepData()) || void 0 === h ? void 0 : h.getStepData()) || void 0 === u ? void 0 : u.type) === qe &&
                                    "self" !== (null === (p = null === (d = o.getCurrentStepData()) || void 0 === d ? void 0 : d.getStepData()) || void 0 === p ? void 0 : p.tourName))) &&
                            (o.tourTriggers.removeTriggerFromLocalStorage(m.name), o.tourTriggers.removeTriggerFromLocalStorage(m.id)),
                            (!o.isLastStep() && m.rememberLastStep) || o.resetCurrentStep(),
                                o.setProgressEvent(n),
                                (o.isLastStepReached = !1),
                                vt(`closeTour: ${m.name} has been closed.`, !0),
                                (() => {
                                    const t = new CustomEvent(I);
                                    document.dispatchEvent(t);
                                })(),
                                o.removeTourListeners(),
                                pe({ isToursContext: !0, name: L }),
                                pe({ isToursContext: !0, name: E });
                        }),
                        (this.clearWaiters = () => {
                            this.waiters &&
                            this.waiters.length > 0 &&
                            (this.waiters.forEach((t) => {
                                clearInterval(t);
                            }),
                                (this.waiters = []));
                        }),
                        (this.destructStepByName = (t) => {
                            const e = this.steps.find((e) => e.stepData.name === t);
                            e && e.destructStep();
                        }),
                        (this.triggerEvent = (t) => {
                            vt(`triggerEvent called with param ${t}`, !0), "" !== t && this.moveToStep({ stepIdent: t, display: !0 });
                        }),
                        (this.reverseTriggerEvent = (t) => {
                            vt(`reverseTriggerEvent called with param ${t}`), this.destructStepByName(t);
                        }),
                        (this.placeNextStepTrigger = () => {
                            if (this.hasNextStep()) {
                                const t = this.getNextStepWithTrigger();
                                if (!t) return;
                                if (t && t.isAppearsTrigger()) this.placeNextStepAppearTrigger(t);
                                else {
                                    const e = this.currentStepIndex + 1;
                                    if (!t.stepData.trigger) return;
                                    let s = null;
                                    s = window.usetiful_activeTriggersOnElements.find((e) => e.stepId === t.name);
                                    const i = this.getStepByIndex(e);
                                    let r = !1;
                                    s || ((s = new Ps(t.stepData.trigger, Ki(Mi))), (r = !0)),
                                        (s.stepId = null == i ? void 0 : i.name),
                                        (s.triggerFunction = () => {
                                            this.moveToStep({ stepIndex: e, display: !0 });
                                        }),
                                    r && this.triggers.addToActiveTriggers(s);
                                }
                            }
                        }),
                        (this.placeNextStepAppearTrigger = (t) => {
                            const e = this.getStepIndex(t.stepData.name),
                                s = this.currentStepIndex + 1;
                            e &&
                            s &&
                            t.waitForStep(
                                true,
                                () => {
                                    this.moveToStep({ stepIndex: s, display: true });
                                },
                                () => {
                                    var s;
                                    t.stepData.autoskip ? (null === (s = this.getCurrentStep()) || void 0 === s || s.destructStep(t), Kr(), this.updateCurrentStep(e), this.autoSkip(t.stepData.autoskip)) : t.showAlternativeSolution(!1);
                                }
                            );
                        }),
                        (this.autoSkip = (t) => {
                            var e;
                            if (t) {
                                vt("call autoSkip");
                                const t = null === (e = this.getNextStep(!1)) || void 0 === e ? void 0 : e.stepData;
                                t && (t.type === He || t.type === We || (t.element && hs(t.element)))
                                    ? t.trigger
                                        ? "appears" === t.trigger.type && hs(t.trigger.element) && this.goToNextStep()
                                        : this.goToNextStep()
                                    : t
                                        ? this.goToNextStep()
                                        : (yt("The last step of your tour has been autoskiped. Closing tour... "), this.closeTour());
                            }
                        }),
                        (this.goToPreviousStep = function () {
                            let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            vt("call goToPreviousStep"), o.moveToStep({ stepIndex: o.getCurrentStepIndex() - 1, display: !0, isDevKitDirect: t });
                        }),
                        (this.goToNextStep = function () {
                            let t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
                                e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                            vt("call goToNextStep"), vt(`current step index is ${o.getCurrentStepIndex()}`);
                            let s = t;
                            window.usetiful_isAboutToRefresh && (s = !1), o.moveToStep({ stepIndex: o.getCurrentStepIndex() + 1, display: s, isDevKitDirect: e });
                        }),
                        (this.getStepIndex = (t) => {
                            let e = -1;
                            const s = this.getStepByIdent(t);
                            return s && (e = this.steps.indexOf(s)), e;
                        }),
                        (this.getStepByIdent = (t) => {
                            let e;
                            return (e = "string" == typeof t ? this.getStepByName(t) : this.getStepById(t)), e;
                        }),
                        (this.getStepById = (t) => {
                            let e;
                            return this.steps && (e = this.steps.find((e) => e.id === t)), e;
                        }),
                        (this.getStepByName = (t) => {
                            let e;
                            return this.steps && (e = this.steps.find((e) => e.name === t)), e;
                        }),
                        (this.moveToStep = (t) => {
                            var e, s, i, n, o, a, l;
                            if (window.usetiful_tourDelayTimeoutVar) return;
                            const { stepIdent: c, stepIndex: h, display: u, isDevKitDirect: d, isDevKitIndirect: p } = t;
                            d && this.checkRunningTour(),
                            window.usetiful_tourDelayTimeoutVar && (clearTimeout(window.usetiful_tourDelayTimeoutVar), (window.usetiful_tourDelayTimeoutVar = void 0)),
                            window.usetiful_tourPointerWaitingForElement && (clearTimeout(window.usetiful_tourPointerWaitingForElement), (window.usetiful_tourPointerWaitingForElement = void 0));
                            let g = -1;
                            if (void 0 !== c) {
                                vt(`Move to stepId: ${c}`, !0);
                                const t = this.getStepIndex(c);
                                t >= 0 && (g = t);
                            } else void 0 !== h && (vt(`Move to stepIndex: ${h}`, !0), (g = h));
                            const m = g - this.currentStepIndex,
                                f = m < 0,
                                v = Math.abs(m) > 1;
                            let y = c ? this.getStepByIdent(c) : this.getStepByIndex(g);
                            if (y) {
                                let t = y.stepData;
                                if (0 === g && this.stepTriggersController.isAutomatedStep(t)) {
                                    this.getNextStep();
                                }
                                const l = `.${this.template.themeClasses.prefix}-${null === (e = this.getCurrentStep()) || void 0 === e ? void 0 : e.stepData.name}`,
                                    c = hs(l),
                                    h = `.${this.template.themeClasses.prefix}-${t.name}`,
                                    m = hs(h);
                                if (
                                    ((null === (s = this.getCurrentStep()) || void 0 === s ? void 0 : s.stepData.name) !== t.name &&
                                    c &&
                                    (vt("JumpTo: Previous step is still visible so need to be destructed."), null === (i = this.getCurrentStep()) || void 0 === i || i.destructStep(y)),
                                    g && m)
                                )
                                    return;
                                const b = t && t.element ? hs(t.element) : null;
                                if (f && (((!b || ws(b)) && (null == t ? void 0 : t.autoskip)) || (this.stepTriggersController.isAutomatedStep(t) && !v)) && (vt("Moving to previous step"), g - 1 >= 0)) {
                                    const e = this.getStepByIndex(g - 1);
                                    (t =
                                        null ===
                                        (n = ((t, e) => {
                                            if (e.isTour()) {
                                                if ("string" == typeof t) {
                                                    const s = e.getStepIndex(t);
                                                    if (s && s >= 0) return e.getStepByIndex(s);
                                                }
                                                if ("number" == typeof t) return e.getStepByIndex(t);
                                            }
                                            return null;
                                        })(null == e ? void 0 : e.stepData.name, this)) || void 0 === n
                                            ? void 0
                                            : n.stepData),
                                        (y = e),
                                        (g -= 1);
                                }
                                vt(`Move to step: ${null == t ? void 0 : t.name}, display:${u}`),
                                y &&
                                "number" == typeof g &&
                                (u &&
                                !this.localStorageTourHandler.isTourReopenFromLS(this.name) &&
                                (this.getCurrentStepIndex() !== g
                                    ? null === (o = this.getCurrentStep()) || void 0 === o || o.destructStep(y)
                                    : null === (a = this.getStepByIndex(this.localStorageTourHandler.getCurrentStepIndexLS(this.id))) || void 0 === a || a.destructStep(y)),
                                    this.updateCurrentStep(g),
                                    u ? (y.constructStep(u, d || p), this.updateTriggers()) : this.setProgressEvent(r));
                            } else {
                                if (d) throw new Error("Step not found");
                                vt("JumpTo: Step not found"),
                                null === (l = this.getCurrentStep()) || void 0 === l || l.destructStep(),
                                this.isLastStep() && (this.isLastStepReached = !0),
                                    this.resetCurrentStep(),
                                this.getTour() && this.isButton() && this.moveToStep({ stepIndex: 0, display: !1 }),
                                    this.closeTour();
                            }
                        }),
                        (this.updateTriggers = () => {
                            this.stepTriggersController.placeTourTriggers(this.tourData.steps, this.triggerEvent, this.reverseTriggerEvent);
                        }),
                        (this.tourData = t),
                        (this.name = t.name),
                        (this.id = t.id),
                        (this.objectPriority = t.objectPriority),
                        (this.steps = []),
                        (this.triggers = Ki(_i)),
                        (this.loader = Ki($i)),
                        (this.currentMainButton = Ki(ji)),
                        (this.tourTriggers = Ki(Oi)),
                        (this.template = new Ds()),
                        t.steps.forEach((t) => {
                            this.steps.push(new eo(t, this, this.template));
                        }),
                        (this.localStorageTourHandler = Ki(Fi)),
                        (this.currentStepIndex = 0),
                        (this.currentStep = null !== (s = this.steps[0]) && void 0 !== s ? s : null),
                        (this.state = n),
                        (this.waiters = []),
                        (this.stepTriggersController = e),
                        (this.isLastStepReached = !1);
                }
                setTour(t) {
                    this.tourData = t;
                }
                getTour() {
                    return this.tourData;
                }
                isTour() {
                    return null !== this.tourData;
                }
                isProgress() {
                    var t;
                    return null == (null === (t = this.tourData) || void 0 === t ? void 0 : t.progress) || this.tourData.progress;
                }
                isButton() {
                    var t;
                    return null == (null === (t = this.tourData) || void 0 === t ? void 0 : t.button) || this.tourData.button;
                }
                getStepByIndex(t) {
                    return (this.getStepsLength() > 0 && "number" == typeof t && this.steps[t]) || null;
                }
                getSteps() {
                    var t;
                    return (null === (t = this.tourData) || void 0 === t ? void 0 : t.steps) || [];
                }
                getCurrentStep() {
                    return this.currentStep;
                }
                getCurrentStepData() {
                    return this.getStepByIndex(this.currentStepIndex);
                }
                getCurrentStepIndex() {
                    return this.currentStepIndex ? this.currentStepIndex : 0;
                }
                setCurrentStepIndex(t) {
                    this.currentStepIndex = t;
                }
                updateCurrentStep(t) {
                    this.setCurrentStepIndex(t);
                    const e = this.steps[t];
                    e && (this.currentStep = e);
                }
                resetCurrentStep() {
                    this.currentStepIndex = 0;
                }
                isFirstStep() {
                    return 0 === this.currentStepIndex;
                }
                isLastStep() {
                    return !(!this.tourData || !this.tourData.steps) && this.currentStepIndex >= this.tourData.steps.length - 1;
                }
                getPreviousStep() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    return t && this.currentStepIndex > 0 && (this.currentStepIndex -= 1), this.getStepByIndex(t ? this.currentStepIndex : this.currentStepIndex - 1);
                }
                getNextStep() {
                    let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                    return t && (this.currentStepIndex += 1), this.getStepByIndex(t ? this.currentStepIndex : this.currentStepIndex + 1);
                }
                getNextStepWithTrigger() {
                    for (let t = this.currentStepIndex + 1; t < this.steps.length; t += 1) if (this.steps[t].stepData.trigger) return this.steps[t];
                    return null;
                }
                hasPreviousStep() {
                    return null !== this.getPreviousStep();
                }
                hasNextStep() {
                    return this.currentStepIndex + 1 < this.getStepsLength();
                }
                getStepsLength() {
                    return this.tourData && this.tourData.steps ? this.tourData.steps.length : 0;
                }
                isSteps() {
                    return !!this.tourData && this.tourData.steps && this.getStepsLength() > 0;
                }
                checkRunningTour() {
                    if (this.localStorageTourHandler.getObjectStatus(this.id.toString()) !== r) throw new Error("You should run a tour first");
                }
            };
            const io = class {
                constructor(t) {
                    (this.placeTourTriggers = (t, e, s) => {
                        vt("placeTourTriggers: Placing tour triggers..."),
                            t.forEach((t, i) => {
                                let { trigger: r, name: n } = t;
                                if (!r || 0 === i) return;
                                const o = new Ps(r, this.availableOnPage);
                                (o.triggerFunction = e), (o.stepId = n), (o.isInitial = !1), (o.reverseTriggerFunction = s), this.CommonTriggersControl.placeTrigger(o);
                            }),
                            vt("placeTourTriggers: Placed triggers:"),
                            bt(window.usetiful_activeTriggersOnElements);
                    }),
                        (this.placeInitialTriggers = (t, e) => {
                            var s, i;
                            vt("placeInitialTriggers");
                            for (const r of t) {
                                let t = null === (i = null === (s = null == r ? void 0 : r.steps[0]) || void 0 === s ? void 0 : s.stepData) || void 0 === i ? void 0 : i.trigger;
                                t = !t && r.steps[1] && this.isAutomatedStep(r.steps[0].stepData) ? r.steps[1].stepData.trigger : t;
                                const { id: n } = r.tourData;
                                if (t && n && Tt(r.tourData, this.localStorageHandler)) {
                                    const s = new Ps(t, this.availableOnPage);
                                    (s.isInitial = !0),
                                        (s.triggerFunction = (t) => {
                                            e(t, n);
                                        }),
                                        (s.reverseTriggerFunction = r.reverseTriggerEvent),
                                        this.CommonTriggersControl.placeTrigger(s);
                                }
                            }
                        }),
                        (this.isAutomatedStep = (t) => !!(t && t.type && [Ve, qe, Ke, Je].indexOf(t.type) > -1)),
                        (this.CommonTriggersControl = Ki(_i)),
                        (this.localStorageHandler = Ki(Fi)),
                        (window.usetiful_activeTriggersOnElements = []),
                        (window.usetiful_activeListeners = []),
                        (this.availableOnPage = t);
                }
            };
            window.USETIFUL || (window.USETIFUL = {});
            window.USETIFUL.reinitialize = () => {
                window.USETIFUL.user && window.USETIFUL.user.getProgress(), ye();
            };
            class ro {
                constructor(t) {
                    var e = this;
                    (this.setTours = (t) => {
                        for (const e of t) this.tours.push(new so(e, this.stepTriggersController));
                    }),
                        (this.placeAllButtonEvent = () => {
                            this.currentMainButton.placeAllButtons(this.availableTours, Tt, this.localStorageTourHandler);
                        }),
                        (this.placeInitialTriggersEvent = () => {
                            this.stepTriggersController.placeInitialTriggers(this.availableTours, this.runTourOnClick);
                        }),
                        (this.setCurrentTour = (t) => {
                            t.detail.props.value instanceof so && (this.currentTour = t.detail.props.value);
                        }),
                        (this.beforeUnloadListener = () => {
                            (window.usetiful_isAboutToRefresh = !0), pe({ name: P, isToursContext: !0 });
                        }),
                        (this.beforeUnloadEvent = () => {
                            this.beforeUnload.setAction(Ft, this.beforeUnloadListener);
                        }),
                        (this.stopBeforeUnloadEvent = () => {
                            this.beforeUnload.removeAction(Ft);
                        }),
                        (this.eventHandler = (t) => {
                            if (t.detail.isToursContext)
                                switch (t.detail.event) {
                                    case E:
                                        this.placeAllButtonEvent();
                                        break;
                                    case L:
                                        this.placeInitialTriggersEvent();
                                        break;
                                    case D:
                                        this.setCurrentTour(t);
                                        break;
                                    case x:
                                        this.beforeUnloadEvent();
                                        break;
                                    case P:
                                        this.stopBeforeUnloadEvent();
                                }
                        }),
                        (this.addTourEventsListeners = () => {
                            document.addEventListener(w, this.eventHandler);
                        }),
                        (this.removeTourEventsListeners = () => {
                            document.removeEventListener(w, this.eventHandler);
                        }),
                        (this.destroy = () => {
                            if (this.currentTour && this.currentTour.isTour() && this.currentTour.getCurrentStep()) {
                                const t = this.currentTour.currentStep;
                                t.destructStep(), ((t && t.stepData.highlight) || (!t.stepData.highlight && document.querySelectorAll(Ue.overlay).length > 0)) && Kr();
                            }
                        }),
                        (this.destroyInstance = () => {
                            vt("destroy tours object"),
                                this.tourInitClearExistingTimeouts(),
                            this.checkingTargetsInterval && window.clearInterval(this.checkingTargetsInterval),
                                (this.availableTours = []),
                                this.availableOnPage.refreshURL(),
                                ys("[data-uf-button='button-main']"),
                                this.commonTriggers.triggersClearance(!0);
                            const t = document.querySelectorAll("[data-uf-content]");
                            t.length > 0 &&
                            t.forEach((t) => {
                                vs(t);
                            }),
                                this.removeTourEventsListeners(),
                            this.tours.length > 0 &&
                            (this.tours.forEach((t) => {
                                t.destroy();
                            }),
                                (this.tours = [])),
                                this.destroy();
                        }),
                        (this.init = () => {
                            this.addTourEventsListeners(),
                                vt(`toursInit: Customer's license: ${Ki(qi.license)}`),
                                this.tourTriggers.checkTourTriggers(),
                                ((t) => {
                                    const e = {
                                        start: function (e) {
                                            let s = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                                            const i = t.tours.find((t) => t.id === e);
                                            if (!i) throw new Error("Your tour Id is not valid!");
                                            const r = t.localStorageTourHandler.getRunningTour();
                                            if (r) {
                                                if (e === r) return void console.warn("Tour that you want to run is already running.");
                                                if (s) return void t.showTourSwitcher({ tour: i, runningTourId: r, runOptions: { isDevKit: !0 } });
                                                {
                                                    const e = t.getTourByID(r);
                                                    null == e || e.closeTour(void 0, !0);
                                                }
                                            }
                                            i.runTour({ display: !0, isDevkit: !0 });
                                        },
                                        nextStep: () => {
                                            var e;
                                            null === (e = t.currentTour) || void 0 === e || e.goToNextStep(void 0, !0);
                                        },
                                        preStep: () => {
                                            var e;
                                            null === (e = t.currentTour) || void 0 === e || e.goToPreviousStep(!0);
                                        },
                                        close: () => {
                                            var e;
                                            null === (e = t.currentTour) || void 0 === e || e.closeTour(void 0, !0);
                                        },
                                        jumpTo: (e) => {
                                            var s;
                                            null === (s = t.currentTour) || void 0 === s || s.moveToStep({ stepIndex: e - 1, display: !0, isDevKitDirect: !0 });
                                        },
                                        getState: () => {
                                            const e = localStorage.getItem(ot);
                                            let s = [];
                                            e && (s = JSON.parse(e));
                                            const i = [];
                                            return (
                                                t.availableTours.forEach((t) => {
                                                    const e = s.find((e) => e.id === t.id),
                                                        r = { name: t.name, id: t.id, isAvailable: !0, state: e ? e.state : "never run" };
                                                    e && "inProgress" === e.state && (r.currentStep = null == e ? void 0 : e.currentStep), i.push(r);
                                                }),
                                                    s.forEach((e) => {
                                                        t.availableTours.find((t) => e.id === t.id) || ((e.isAvailable = !1), "inProgress" !== e.state && delete e.currentStep, i.push(e));
                                                    }),
                                                    i
                                            );
                                        },
                                    };
                                    window.USETIFUL.tour = e;
                                })(this),
                                window.addEventListener("click", Gn),
                                window.addEventListener("focusin", Gn);
                        }),
                        (this.getLiveTours = () => {
                            const t = [];
                            return (
                                this.tours.forEach((e) => {
                                    (e.contentType = v), t.push(e);
                                }),
                                    t
                            );
                        }),
                        (this.tourInitClearExistingTimeouts = () => {
                            window.usetiful_tourDelayTimeoutVar && (clearTimeout(window.usetiful_tourDelayTimeoutVar), (window.usetiful_tourDelayTimeoutVar = void 0)),
                            window.usetiful_tourPointerWaitingForElement && (clearTimeout(window.usetiful_tourPointerWaitingForElement), (window.usetiful_tourPointerWaitingForElement = void 0));
                        }),
                        (this.runTourOnClick = function (t, s) {
                            let i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : () => {};
                            const o = e.getTourByID(s);
                            if (!o) return void yt("Tour that you want to run does not exist.");
                            if ((vt("runTourOnClick called"), vt(o.tourData.name), o.state === r)) return void yt("Tour that you want to run is already running.");
                            "function" == typeof n && n();
                            const a = e.localStorageTourHandler.getRunningTour(e.availableTours);
                            var l;
                            null !== a && e.localStorageTourHandler.getObjectStatus(s.toString()) !== r ? e.showTourSwitcher({ tour: o, runningTourId: a, runByParent: i, parentHideFunction: n }) : o.runTour({ display: !0, runByParent: i }),
                            t && (t.stopImmediatePropagation(), "wheel" !== (l = t).type && "scroll" !== l.type && t.preventDefault());
                        }),
                        (this.runTourById = (t) => {
                            const e = this.getTourByID(t);
                            e ? e.runTour({ display: !0 }) : console.warn(`runTourById: Tour with id ${t} not found`);
                        }),
                        (this.getTourByID = (t) => this.tours.find((e) => e.id === t)),
                        (this.showTourSwitcher = (t) => {
                            let { tour: e, runningTourId: s, runByParent: i = !1, parentHideFunction: r = () => {}, runOptions: n = {} } = t;
                            Un({ name: Mn, text: `User attempts to force-switch from tour ${s} to tour ${e.id}`, type: "tour", id: s }),
                                this.template.confirmation(
                                    "Switch to another tour",
                                    `Do you want to switch to the tour '${e.tourData.name}'?`,
                                    "Yes",
                                    "No",
                                    () => {
                                        var t;
                                        if (s && (!this.currentTour || (this.currentTour && this.currentTour.id.toString() !== s))) {
                                            const t = this.getTourByID(parseInt(s, 10));
                                            t && (this.currentTour = t);
                                        }
                                        null === (t = this.currentTour) || void 0 === t || t.closeTour(), "function" == typeof r && r(), e.runTour(Object.assign({ display: !0, runByParent: i }, n));
                                    },
                                    ""
                                );
                        }),
                        (this.toursData = t),
                        (this.currentTour = null),
                        (this.availableTours = []),
                        (this.commonTriggers = Ki(_i)),
                        (this.tourTriggers = Ki(Oi)),
                        (this.localStorageTourHandler = Ki(Fi)),
                        (this.currentMainButton = Ki(ji)),
                        (this.template = new Ds()),
                        (this.availableOnPage = Ki(Mi)),
                        (this.stepTriggersController = new io(this.availableOnPage)),
                        (this.tours = []),
                        this.setTours(this.toursData),
                        (this.beforeUnload = Ki(Di));
                }
            }
            const no = (t) => {
                    let { type: e, entityId: s = 0, stepIndex: i = 0, action: r, itemId: n = 0, isDevKit: o } = t;
                    {
                        const t = Ki(Ai);
                        if (!t) return;
                        vt(`report of ${e} for entity ${n || s} with action ${r}`), t.add({ type: e, id: n || s, entityId: s, tourId: "number" == typeof s ? s : 0, stepIndex: i, action: r, isDevKit: o });
                    }
                },
                oo = (t) => {
                    no(t.detail);
                },
                ao = (t) => {
                    ((t) => {
                        let { reportType: e = "form", question: s = "", questionType: i = "", answer: r = "", formId: n, entityId: o = 0 } = t;
                        {
                            const t = Ki(Ai);
                            if (!t) return;
                            vt(`report of form for entity ${o} with question ${s} with answer ${r}`), t.add({ reportType: e, formId: n, questionType: i, question: s, answer: r, entityId: o });
                        }
                    })(t.detail);
                },
                lo = (t) => {
                    ((t) => {
                        let { reportType: e = "error", name: s = "", text: i = "", code: r = 0, url: n = "", entityId: o = "0", entityType: a = "", spaceId: l = 0 } = t;
                        {
                            const t = Ki(Ai);
                            if (!t) return;
                            vt(`report of form for entity ${o} with question ${s} with answer ${i}`), t.add({ reportType: e, name: s, text: i, code: r, url: n, entityType: a, entityId: o, spaceId: l });
                        }
                    })(t.detail);
                };
            const co = class {
                constructor() {
                    (this.visibilityAPI = this.getVisibilityAPI()), (this.boundVisibilityHandler = this.handleVisibilityChange.bind(this));
                }
                init() {
                    this.visibilityAPI.visibilityChange && document.addEventListener(this.visibilityAPI.visibilityChange, this.boundVisibilityHandler, !1);
                }
                destroy() {
                    document.removeEventListener(this.visibilityAPI.visibilityChange, this.boundVisibilityHandler, !1);
                }
                getVisibilityAPI() {
                    if (void 0 !== document.hidden) return { hidden: "hidden", visibilityChange: "visibilitychange", state: "visibilityState" };
                    if (void 0 !== document.msHidden) return { hidden: "msHidden", visibilityChange: "msvisibilitychange", state: "msVisibilityState" };
                    if (void 0 !== document.webkitHidden) return { hidden: "webkitHidden", visibilityChange: "webkitvisibilitychange", state: "webkitVisibilityState" };
                    throw new Error("Page Visibility API is not supported.");
                }
                handleVisibilityChange() {
                    if ("visible" === document[this.visibilityAPI.state]) {
                        const t = new CustomEvent(F);
                        document.dispatchEvent(t);
                    } else {
                        const t = new CustomEvent(U);
                        document.dispatchEvent(t);
                    }
                }
            };
            window.USETIFUL || (window.USETIFUL = {});
            const ho = (t, e) => {
                (0, q.createScript)("u-banners-data", null, `window.uBanners = ${JSON.stringify(e)};`);
                ((0, q.createScript)("u-banners", `${t}dist/u-banners.js?t=${Date.now()}`).onload = () => {
                    var t;
                    null === (t = window.USETIFUL) || void 0 === t || t.bannersInit();
                }),
                    window.addEventListener(fe, () => {
                        var t;
                        null === (t = window.USETIFUL) || void 0 === t || t.bannersInit();
                    });
            };
            !(function () {
                if (window.usetiful_instance)
                    return (
                        console.warn(
                            "The Usetiful script cannot be initialized because another Usetiful instance is already running. Check the implementation of the Usetiful code and prevent it from being called multiple times when page is loading."
                        ),
                            void Un({ name: jn, type: "account" })
                    );
                (window.usetiful_instance = Date.now().toString()),
                    (() => {
                        const { localStorage: t } = window;
                        Vi.registerConstant(qi.apiToken, K),
                            Vi.registerConstant(qi.reporterBasePath, "reporter/api"),
                            Vi.registerClass(xi, de, [qi.apiToken]),
                            Vi.registerClass(Pi, de, [qi.apiToken, qi.reporterBasePath]),
                            Vi.registerConstant(qi.LocalStorage, t),
                            Vi.registerClass(Di, Ce, [Di]),
                            Vi.registerClass($i, Se, [xi, Di]),
                            Vi.registerClass(Ri, Ae, [xi]),
                            Vi.registerClass(Ai, re, [xi, Pi, Ri, Di]),
                            Vi.registerClass(Oi, ge, [qi.LocalStorage]),
                            Vi.registerClass(Bi, Ie, [qi.apiToken, Ri, Di, xi]),
                            Vi.registerConstant(qi.tourType, i),
                            Vi.registerConstant(qi.smartTipsType, Ii),
                            Vi.registerConstant(qi.tourStorageKeyName, ot),
                            Vi.registerConstant(qi.smartTipsGroupStorageKeyName, at),
                            Vi.registerClass(Fi, Ei, [qi.tourType, qi.tourStorageKeyName, Bi]),
                            Vi.registerClass(Hi, Ei, [qi.smartTipsType, qi.smartTipsGroupStorageKeyName, Bi]),
                            Vi.registerClass(Ni, Oe, [Bi]),
                            Vi.registerClass(ji, xs, [$i]),
                            Vi.registerClass(Wi, Li, [Fi]),
                            Vi.registerClass(Mi, ci, [Fi, Wi, Ni]),
                            Vi.registerClass(_i, Bs, [Mi]),
                            Vi.registerClass(Ui, ki, [Fi, Bi, Wi]);
                    })();
                const t = Ki($i),
                    e = Ki(Ri),
                    s = Ki(Di),
                    r = Ki(Bi),
                    n = Ki(Ui),
                    o = Ki(Ai);
                window.usetiful_intervals = [];
                let a = null,
                    l = null,
                    c = null,
                    u = null,
                    d = null,
                    p = null;
                const g = (t) => {
                    let { tours: i = [], smartTipsGroups: g = [], checklists: m = [], assistants: f = [], banners: w = [], licence: T, reportPrivacyMode: S, watermark: C } = t;
                    var k;
                    n.init(i, m),
                        Ji(qi.license, T),
                        Ji(qi.watermark, C),
                        (() => {
                            const t = Ki(Ri).getTag("userId");
                            vt(`Identified userId is: ${t}`),
                            t &&
                            t === h &&
                            (console.error(
                                "Invalid UserID provided to Usetiful. Replace sample value with unique identificator for each logged-in user. Read more about how to use userIDs on https://help.usetiful.com/support/solutions/articles/77000514872-user-id-for-cross-device-support"
                            ),
                                Un({ name: Nn, text: "You are using an example userId.", type: "account" }));
                        })(),
                        e.setReportDataPrivacy(parseInt(S, 10)),
                    window.usetiful_intervals.length > 0 &&
                    ((k = window.usetiful_intervals),
                        vt(`Cleaning ${k.length} intervals...`),
                        k.forEach((t) => {
                            clearInterval(t);
                        }),
                        (window.usetiful_intervals = [])),
                    u && (u = null),
                    c && (c = null),
                    l && (l = null),
                    p && (p.destroy(), (p = null)),
                    a && (a.destroy(), (a = null)),
                    o && (document.removeEventListener(M, oo), document.removeEventListener(H, ao), document.removeEventListener(W, lo), o.destroy()),
                    r && r.destroy(),
                    s && s.destroy(),
                    window.usetifulTags || (window.usetifulTags = {}),
                        window.removeEventListener("click", Gn),
                        window.removeEventListener("focusin", Gn),
                        (0, q.loadTagsFromLS)(),
                    w.length && ho(pt, w),
                        (d = new wn(g)),
                        (l = new ro(i)),
                        (u = new _n(f, l.runTourOnClick)),
                        (c = new kn(m, l.runTourOnClick)),
                        (p = new co()),
                        (a = new Fn(u, c, l, [v, y, b], !1)),
                        s.init(),
                        r.init(),
                        d.init(),
                        p.init(),
                        a.init(),
                        document.addEventListener(M, oo),
                        document.addEventListener(H, ao),
                        document.addEventListener(W, lo),
                        o.init();
                    const I = Ki(Fi),
                        E = Ki(Ni);
                    ((t, e, s) => {
                        const i = {
                            getProgress: () => {
                                (t.loadedUserData = {}), t.loadFromApi(), (e.loadedFromStorage = !1), s.clearParsedData(), s.processParseData();
                            },
                            setId: (t) => {
                                window.usetifulTags || (window.usetifulTags = {}), (window.usetifulTags.userId = t);
                            },
                            clearProgress: () => {
                                window.localStorage.removeItem(ot),
                                    window.localStorage.removeItem(ht),
                                    window.localStorage.removeItem(at),
                                    window.localStorage.removeItem(lt),
                                    window.localStorage.removeItem(ct),
                                    window.localStorage.removeItem(ut),
                                    window.localStorage.removeItem(dt);
                            },
                        };
                        window.USETIFUL.user = i;
                    })(r, I, E);
                };
                t.loadCriticalCss(), t.loadConfig((t) => g(t));
            })();
        })();
})();
