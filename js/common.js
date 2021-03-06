var requirejs, require, define;
!function (global, setTimeout) {
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = "2.3.4", commentRegExp = /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty,
        isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document),
        isWebWorker = !isBrowser && "undefined" != typeof importScripts,
        readyRegExp = isBrowser && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/,
        defContextName = "_", isOpera = "undefined" != typeof opera && "[object Opera]" === opera.toString(),
        contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = !1;

    function commentReplace(e, t) {
        return t || ""
    }

    function isFunction(e) {
        return "[object Function]" === ostring.call(e)
    }

    function isArray(e) {
        return "[object Array]" === ostring.call(e)
    }

    function each(e, t) {
        var n;
        if (e) for (n = 0; n < e.length && (!e[n] || !t(e[n], n, e)); n += 1) ;
    }

    function eachReverse(e, t) {
        var n;
        if (e) for (n = e.length - 1; -1 < n && (!e[n] || !t(e[n], n, e)); --n) ;
    }

    function hasProp(e, t) {
        return hasOwn.call(e, t)
    }

    function getOwn(e, t) {
        return hasProp(e, t) && e[t]
    }

    function eachProp(e, t) {
        var n;
        for (n in e) if (hasProp(e, n) && t(e[n], n)) break
    }

    function mixin(n, e, i, r) {
        return e && eachProp(e, function (e, t) {
            !i && hasProp(n, t) || (!r || "object" != typeof e || !e || isArray(e) || isFunction(e) || e instanceof RegExp ? n[t] = e : (n[t] || (n[t] = {}), mixin(n[t], e, i, r)))
        }), n
    }

    function bind(e, t) {
        return function () {
            return t.apply(e, arguments)
        }
    }

    function scripts() {
        return document.getElementsByTagName("script")
    }

    function defaultOnError(e) {
        throw e
    }

    function getGlobal(e) {
        if (!e) return e;
        var t = global;
        return each(e.split("."), function (e) {
            t = t[e]
        }), t
    }

    function makeError(e, t, n, i) {
        var r = new Error(t + "\nhttp://requirejs.org/docs/errors.html#" + e);
        return r.requireType = e, r.requireModules = i, n && (r.originalError = n), r
    }

    if (void 0 === define) {
        if (void 0 !== requirejs) {
            if (isFunction(requirejs)) return;
            cfg = requirejs, requirejs = void 0
        }
        void 0 === require || isFunction(require) || (cfg = require, require = void 0), req = requirejs = function (e, t, n, i) {
            var r, o, a = defContextName;
            return isArray(e) || "string" == typeof e || (o = e, isArray(t) ? (e = t, t = n, n = i) : e = []), o && o.context && (a = o.context), r = (r = getOwn(contexts, a)) || (contexts[a] = req.s.newContext(a)), o && r.configure(o), r.require(e, t, n)
        }, req.config = function (e) {
            return req(e)
        }, req.nextTick = void 0 !== setTimeout ? function (e) {
            setTimeout(e, 4)
        } : function (e) {
            e()
        }, require = require || req, req.version = version, req.jsExtRegExp = /^\/|:|\?|\.js$/, req.isBrowser = isBrowser, s = req.s = {
            contexts: contexts,
            newContext: newContext
        }, req({}), each(["toUrl", "undef", "defined", "specified"], function (t) {
            req[t] = function () {
                var e = contexts[defContextName];
                return e.require[t].apply(e, arguments)
            }
        }), isBrowser && (head = s.head = document.getElementsByTagName("head")[0], baseElement = document.getElementsByTagName("base")[0], baseElement && (head = s.head = baseElement.parentNode)), req.onError = defaultOnError, req.createNode = function (e, t, n) {
            var i = e.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
            return i.type = e.scriptType || "text/javascript", i.charset = "utf-8", i.async = !0, i
        }, req.load = function (t, n, i) {
            var e, r = t && t.config || {};
            if (isBrowser) return (e = req.createNode(r, n, i)).setAttribute("data-requirecontext", t.contextName), e.setAttribute("data-requiremodule", n), r.crossorigin && e.setAttribute("crossorigin", "anonymous"), !e.attachEvent || e.attachEvent.toString && e.attachEvent.toString().indexOf("[native code") < 0 || isOpera ? (e.addEventListener("load", t.onScriptLoad, !1), e.addEventListener("error", t.onScriptError, !1)) : (useInteractive = !0, e.attachEvent("onreadystatechange", t.onScriptLoad)), e.src = i, r.onNodeCreated && r.onNodeCreated(e, r, n, i), currentlyAddingScript = e, baseElement ? head.insertBefore(e, baseElement) : head.appendChild(e), currentlyAddingScript = null, e;
            if (isWebWorker) try {
                setTimeout(function () {
                }, 0), importScripts(i), t.completeLoad(n)
            } catch (e) {
                t.onError(makeError("importscripts", "importScripts failed for " + n + " at " + i, e, [n]))
            }
        }, isBrowser && !cfg.skipDataMain && eachReverse(scripts(), function (e) {
            if (head = head || e.parentNode, dataMain = e.getAttribute("data-main")) return mainScript = dataMain, cfg.baseUrl || -1 !== mainScript.indexOf("!") || (mainScript = (src = mainScript.split("/")).pop(), subPath = src.length ? src.join("/") + "/" : "./", cfg.baseUrl = subPath), mainScript = mainScript.replace(jsSuffixRegExp, ""), req.jsExtRegExp.test(mainScript) && (mainScript = dataMain), cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript], !0
        }), define = function (e, n, t) {
            var i, r;
            "string" != typeof e && (t = n, n = e, e = null), isArray(n) || (t = n, n = null), !n && isFunction(t) && (n = [], t.length && (t.toString().replace(commentRegExp, commentReplace).replace(cjsRequireRegExp, function (e, t) {
                n.push(t)
            }), n = (1 === t.length ? ["require"] : ["require", "exports", "module"]).concat(n))), useInteractive && (i = currentlyAddingScript || getInteractiveScript()) && (e = e || i.getAttribute("data-requiremodule"), r = contexts[i.getAttribute("data-requirecontext")]), r ? (r.defQueue.push([e, n, t]), r.defQueueMap[e] = !0) : globalDefQueue.push([e, n, t])
        }, define.amd = {jQuery: !0}, req.exec = function (text) {
            return eval(text)
        }, req(cfg)
    }

    function newContext(u) {
        var n, e, p, l, f, m = {waitSeconds: 7, baseUrl: "./", paths: {}, bundles: {}, pkgs: {}, shim: {}, config: {}},
            c = {}, d = {}, i = {}, h = [], g = {}, r = {}, v = {}, y = 1, x = 1;

        function b(e, t, n) {
            var i, r, o, a, s, u, l, f, c, d, p = t && t.split("/"), h = m.map, g = h && h["*"];
            if (e && (u = (e = e.split("/")).length - 1, m.nodeIdCompat && jsSuffixRegExp.test(e[u]) && (e[u] = e[u].replace(jsSuffixRegExp, "")), "." === e[0].charAt(0) && p && (e = p.slice(0, p.length - 1).concat(e)), function (e) {
                var t, n;
                for (t = 0; t < e.length; t++) if ("." === (n = e[t])) e.splice(t, 1), --t; else if (".." === n) {
                    if (0 === t || 1 === t && ".." === e[2] || ".." === e[t - 1]) continue;
                    0 < t && (e.splice(t - 1, 2), t -= 2)
                }
            }(e), e = e.join("/")), n && h && (p || g)) {
                e:for (o = (r = e.split("/")).length; 0 < o; --o) {
                    if (s = r.slice(0, o).join("/"), p) for (a = p.length; 0 < a; --a) if (i = (i = getOwn(h, p.slice(0, a).join("/"))) && getOwn(i, s)) {
                        l = i, f = o;
                        break e
                    }
                    !c && g && getOwn(g, s) && (c = getOwn(g, s), d = o)
                }
                !l && c && (l = c, f = d), l && (r.splice(0, f, l), e = r.join("/"))
            }
            return getOwn(m.pkgs, e) || e
        }

        function w(t) {
            isBrowser && each(scripts(), function (e) {
                if (e.getAttribute("data-requiremodule") === t && e.getAttribute("data-requirecontext") === p.contextName) return e.parentNode.removeChild(e), !0
            })
        }

        function E(e) {
            var t = getOwn(m.paths, e);
            if (t && isArray(t) && 1 < t.length) return t.shift(), p.require.undef(e), p.makeRequire(null, {skipMap: !0})([e]), !0
        }

        function C(e) {
            var t, n = e ? e.indexOf("!") : -1;
            return -1 < n && (t = e.substring(0, n), e = e.substring(n + 1, e.length)), [t, e]
        }

        function T(e, t, n, i) {
            var r, o, a, s, u = null, l = t ? t.name : null, f = e, c = !0, d = "";
            return e || (c = !1, e = "_@r" + (y += 1)), u = (s = C(e))[0], e = s[1], u && (u = b(u, l, i), o = getOwn(g, u)), e && (u ? d = n ? e : o && o.normalize ? o.normalize(e, function (e) {
                return b(e, l, i)
            }) : -1 === e.indexOf("!") ? b(e, l, i) : e : (u = (s = C(d = b(e, l, i)))[0], d = s[1], n = !0, r = p.nameToUrl(d))), {
                prefix: u,
                name: d,
                parentMap: t,
                unnormalized: !!(a = !u || o || n ? "" : "_unnormalized" + (x += 1)),
                url: r,
                originalName: f,
                isDefine: c,
                id: (u ? u + "!" + d : d) + a
            }
        }

        function S(e) {
            var t = e.id, n = getOwn(c, t);
            return n = n || (c[t] = new p.Module(e))
        }

        function _(e, t, n) {
            var i = e.id, r = getOwn(c, i);
            !hasProp(g, i) || r && !r.defineEmitComplete ? (r = S(e)).error && "error" === t ? n(r.error) : r.on(t, n) : "defined" === t && n(g[i])
        }

        function k(n, e) {
            var t = n.requireModules, i = !1;
            e ? e(n) : (each(t, function (e) {
                var t = getOwn(c, e);
                t && (t.error = n, t.events.error && (i = !0, t.emit("error", n)))
            }), i || req.onError(n))
        }

        function A() {
            globalDefQueue.length && (each(globalDefQueue, function (e) {
                var t = e[0];
                "string" == typeof t && (p.defQueueMap[t] = !0), h.push(e)
            }), globalDefQueue = [])
        }

        function D(e) {
            delete c[e], delete d[e]
        }

        function N() {
            var e, i, t = 1e3 * m.waitSeconds, r = t && p.startTime + t < (new Date).getTime(), o = [], a = [], s = !1,
                u = !0;
            if (!n) {
                if (n = !0, eachProp(d, function (e) {
                    var t = e.map, n = t.id;
                    if (e.enabled && (t.isDefine || a.push(e), !e.error)) if (!e.inited && r) E(n) ? s = i = !0 : (o.push(n), w(n)); else if (!e.inited && e.fetched && t.isDefine && (s = !0, !t.prefix)) return u = !1
                }), r && o.length) return (e = makeError("timeout", "Load timeout for modules: " + o, null, o)).contextName = p.contextName, k(e);
                u && each(a, function (e) {
                    !function r(o, a, s) {
                        var e = o.map.id;
                        o.error ? o.emit("error", o.error) : (a[e] = !0, each(o.depMaps, function (e, t) {
                            var n = e.id, i = getOwn(c, n);
                            !i || o.depMatched[t] || s[n] || (getOwn(a, n) ? (o.defineDep(t, g[n]), o.check()) : r(i, a, s))
                        }), s[e] = !0)
                    }(e, {}, {})
                }), r && !i || !s || !isBrowser && !isWebWorker || f || (f = setTimeout(function () {
                    f = 0, N()
                }, 50)), n = !1
            }
        }

        function a(e) {
            hasProp(g, e[0]) || S(T(e[0], null, !0)).init(e[1], e[2])
        }

        function o(e, t, n, i) {
            e.detachEvent && !isOpera ? i && e.detachEvent(i, t) : e.removeEventListener(n, t, !1)
        }

        function s(e) {
            var t = e.currentTarget || e.srcElement;
            return o(t, p.onScriptLoad, "load", "onreadystatechange"), o(t, p.onScriptError, "error"), {
                node: t,
                id: t && t.getAttribute("data-requiremodule")
            }
        }

        function L() {
            var e;
            for (A(); h.length;) {
                if (null === (e = h.shift())[0]) return k(makeError("mismatch", "Mismatched anonymous define() module: " + e[e.length - 1]));
                a(e)
            }
            p.defQueueMap = {}
        }

        return l = {
            require: function (e) {
                return e.require ? e.require : e.require = p.makeRequire(e.map)
            }, exports: function (e) {
                if (e.usingExports = !0, e.map.isDefine) return e.exports ? g[e.map.id] = e.exports : e.exports = g[e.map.id] = {}
            }, module: function (e) {
                return e.module ? e.module : e.module = {
                    id: e.map.id, uri: e.map.url, config: function () {
                        return getOwn(m.config, e.map.id) || {}
                    }, exports: e.exports || (e.exports = {})
                }
            }
        }, (e = function (e) {
            this.events = getOwn(i, e.id) || {}, this.map = e, this.shim = getOwn(m.shim, e.id), this.depExports = [], this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0
        }).prototype = {
            init: function (e, t, n, i) {
                i = i || {}, this.inited || (this.factory = t, n ? this.on("error", n) : this.events.error && (n = bind(this, function (e) {
                    this.emit("error", e)
                })), this.depMaps = e && e.slice(0), this.errback = n, this.inited = !0, this.ignore = i.ignore, i.enabled || this.enabled ? this.enable() : this.check())
            }, defineDep: function (e, t) {
                this.depMatched[e] || (this.depMatched[e] = !0, --this.depCount, this.depExports[e] = t)
            }, fetch: function () {
                if (!this.fetched) {
                    this.fetched = !0, p.startTime = (new Date).getTime();
                    var e = this.map;
                    if (!this.shim) return e.prefix ? this.callPlugin() : this.load();
                    p.makeRequire(this.map, {enableBuildCallback: !0})(this.shim.deps || [], bind(this, function () {
                        return e.prefix ? this.callPlugin() : this.load()
                    }))
                }
            }, load: function () {
                var e = this.map.url;
                r[e] || (r[e] = !0, p.load(this.map.id, e))
            }, check: function () {
                if (this.enabled && !this.enabling) {
                    var t, e, n = this.map.id, i = this.depExports, r = this.exports, o = this.factory;
                    if (this.inited) {
                        if (this.error) this.emit("error", this.error); else if (!this.defining) {
                            if (this.defining = !0, this.depCount < 1 && !this.defined) {
                                if (isFunction(o)) {
                                    if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) try {
                                        r = p.execCb(n, o, i, r)
                                    } catch (e) {
                                        t = e
                                    } else r = p.execCb(n, o, i, r);
                                    if (this.map.isDefine && void 0 === r && ((e = this.module) ? r = e.exports : this.usingExports && (r = this.exports)), t) return t.requireMap = this.map, t.requireModules = this.map.isDefine ? [this.map.id] : null, t.requireType = this.map.isDefine ? "define" : "require", k(this.error = t)
                                } else r = o;
                                if (this.exports = r, this.map.isDefine && !this.ignore && (g[n] = r, req.onResourceLoad)) {
                                    var a = [];
                                    each(this.depMaps, function (e) {
                                        a.push(e.normalizedMap || e)
                                    }), req.onResourceLoad(p, this.map, a)
                                }
                                D(n), this.defined = !0
                            }
                            this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, this.emit("defined", this.exports), this.defineEmitComplete = !0)
                        }
                    } else hasProp(p.defQueueMap, n) || this.fetch()
                }
            }, callPlugin: function () {
                var u = this.map, l = u.id, e = T(u.prefix);
                this.depMaps.push(e), _(e, "defined", bind(this, function (e) {
                    var o, t, n, i = getOwn(v, this.map.id), r = this.map.name,
                        a = this.map.parentMap ? this.map.parentMap.name : null,
                        s = p.makeRequire(u.parentMap, {enableBuildCallback: !0});
                    return this.map.unnormalized ? (e.normalize && (r = e.normalize(r, function (e) {
                        return b(e, a, !0)
                    }) || ""), _(t = T(u.prefix + "!" + r, this.map.parentMap, !0), "defined", bind(this, function (e) {
                        this.map.normalizedMap = t, this.init([], function () {
                            return e
                        }, null, {enabled: !0, ignore: !0})
                    })), void ((n = getOwn(c, t.id)) && (this.depMaps.push(t), this.events.error && n.on("error", bind(this, function (e) {
                        this.emit("error", e)
                    })), n.enable()))) : i ? (this.map.url = p.nameToUrl(i), void this.load()) : ((o = bind(this, function (e) {
                        this.init([], function () {
                            return e
                        }, null, {enabled: !0})
                    })).error = bind(this, function (e) {
                        this.inited = !0, (this.error = e).requireModules = [l], eachProp(c, function (e) {
                            0 === e.map.id.indexOf(l + "_unnormalized") && D(e.map.id)
                        }), k(e)
                    }), o.fromText = bind(this, function (e, t) {
                        var n = u.name, i = T(n), r = useInteractive;
                        t && (e = t), r && (useInteractive = !1), S(i), hasProp(m.config, l) && (m.config[n] = m.config[l]);
                        try {
                            req.exec(e)
                        } catch (e) {
                            return k(makeError("fromtexteval", "fromText eval for " + l + " failed: " + e, e, [l]))
                        }
                        r && (useInteractive = !0), this.depMaps.push(i), p.completeLoad(n), s([n], o)
                    }), void e.load(u.name, s, o, m))
                })), p.enable(e, this), this.pluginMaps[e.id] = e
            }, enable: function () {
                (d[this.map.id] = this).enabled = !0, this.enabling = !0, each(this.depMaps, bind(this, function (e, t) {
                    var n, i, r;
                    if ("string" == typeof e) {
                        if (e = T(e, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), this.depMaps[t] = e, r = getOwn(l, e.id)) return void (this.depExports[t] = r(this));
                        this.depCount += 1, _(e, "defined", bind(this, function (e) {
                            this.undefed || (this.defineDep(t, e), this.check())
                        })), this.errback ? _(e, "error", bind(this, this.errback)) : this.events.error && _(e, "error", bind(this, function (e) {
                            this.emit("error", e)
                        }))
                    }
                    n = e.id, i = c[n], hasProp(l, n) || !i || i.enabled || p.enable(e, this)
                })), eachProp(this.pluginMaps, bind(this, function (e) {
                    var t = getOwn(c, e.id);
                    t && !t.enabled && p.enable(e, this)
                })), this.enabling = !1, this.check()
            }, on: function (e, t) {
                var n = this.events[e];
                (n = n || (this.events[e] = [])).push(t)
            }, emit: function (e, t) {
                each(this.events[e], function (e) {
                    e(t)
                }), "error" === e && delete this.events[e]
            }
        }, (p = {
            config: m,
            contextName: u,
            registry: c,
            defined: g,
            urlFetched: r,
            defQueue: h,
            defQueueMap: {},
            Module: e,
            makeModuleMap: T,
            nextTick: req.nextTick,
            onError: k,
            configure: function (e) {
                if (e.baseUrl && "/" !== e.baseUrl.charAt(e.baseUrl.length - 1) && (e.baseUrl += "/"), "string" == typeof e.urlArgs) {
                    var n = e.urlArgs;
                    e.urlArgs = function (e, t) {
                        return (-1 === t.indexOf("?") ? "?" : "&") + n
                    }
                }
                var i = m.shim, r = {paths: !0, bundles: !0, config: !0, map: !0};
                eachProp(e, function (e, t) {
                    r[t] ? (m[t] || (m[t] = {}), mixin(m[t], e, !0, !0)) : m[t] = e
                }), e.bundles && eachProp(e.bundles, function (e, t) {
                    each(e, function (e) {
                        e !== t && (v[e] = t)
                    })
                }), e.shim && (eachProp(e.shim, function (e, t) {
                    isArray(e) && (e = {deps: e}), !e.exports && !e.init || e.exportsFn || (e.exportsFn = p.makeShimExports(e)), i[t] = e
                }), m.shim = i), e.packages && each(e.packages, function (e) {
                    var t;
                    t = (e = "string" == typeof e ? {name: e} : e).name, e.location && (m.paths[t] = e.location), m.pkgs[t] = e.name + "/" + (e.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "")
                }), eachProp(c, function (e, t) {
                    e.inited || e.map.unnormalized || (e.map = T(t, null, !0))
                }), (e.deps || e.callback) && p.require(e.deps || [], e.callback)
            },
            makeShimExports: function (t) {
                return function () {
                    var e;
                    return t.init && (e = t.init.apply(global, arguments)), e || t.exports && getGlobal(t.exports)
                }
            },
            makeRequire: function (o, a) {
                function s(e, t, n) {
                    var i, r;
                    return a.enableBuildCallback && t && isFunction(t) && (t.__requireJsBuild = !0), "string" == typeof e ? isFunction(t) ? k(makeError("requireargs", "Invalid require call"), n) : o && hasProp(l, e) ? l[e](c[o.id]) : req.get ? req.get(p, e, o, s) : (i = T(e, o, !1, !0).id, hasProp(g, i) ? g[i] : k(makeError("notloaded", 'Module name "' + i + '" has not been loaded yet for context: ' + u + (o ? "" : ". Use require([])")))) : (L(), p.nextTick(function () {
                        L(), (r = S(T(null, o))).skipMap = a.skipMap, r.init(e, t, n, {enabled: !0}), N()
                    }), s)
                }

                return a = a || {}, mixin(s, {
                    isBrowser: isBrowser, toUrl: function (e) {
                        var t, n = e.lastIndexOf("."), i = e.split("/")[0];
                        return -1 !== n && (!("." === i || ".." === i) || 1 < n) && (t = e.substring(n, e.length), e = e.substring(0, n)), p.nameToUrl(b(e, o && o.id, !0), t, !0)
                    }, defined: function (e) {
                        return hasProp(g, T(e, o, !1, !0).id)
                    }, specified: function (e) {
                        return e = T(e, o, !1, !0).id, hasProp(g, e) || hasProp(c, e)
                    }
                }), o || (s.undef = function (n) {
                    A();
                    var e = T(n, o, !0), t = getOwn(c, n);
                    t.undefed = !0, w(n), delete g[n], delete r[e.url], delete i[n], eachReverse(h, function (e, t) {
                        e[0] === n && h.splice(t, 1)
                    }), delete p.defQueueMap[n], t && (t.events.defined && (i[n] = t.events), D(n))
                }), s
            },
            enable: function (e) {
                getOwn(c, e.id) && S(e).enable()
            },
            completeLoad: function (e) {
                var t, n, i, r = getOwn(m.shim, e) || {}, o = r.exports;
                for (A(); h.length;) {
                    if (null === (n = h.shift())[0]) {
                        if (n[0] = e, t) break;
                        t = !0
                    } else n[0] === e && (t = !0);
                    a(n)
                }
                if (p.defQueueMap = {}, i = getOwn(c, e), !t && !hasProp(g, e) && i && !i.inited) {
                    if (!(!m.enforceDefine || o && getGlobal(o))) return E(e) ? void 0 : k(makeError("nodefine", "No define call for " + e, null, [e]));
                    a([e, r.deps || [], r.exportsFn])
                }
                N()
            },
            nameToUrl: function (e, t, n) {
                var i, r, o, a, s, u, l = getOwn(m.pkgs, e);
                if (l && (e = l), u = getOwn(v, e)) return p.nameToUrl(u, t, n);
                if (req.jsExtRegExp.test(e)) a = e + (t || ""); else {
                    for (i = m.paths, o = (r = e.split("/")).length; 0 < o; --o) if (s = getOwn(i, r.slice(0, o).join("/"))) {
                        isArray(s) && (s = s[0]), r.splice(0, o, s);
                        break
                    }
                    a = r.join("/"), a = ("/" === (a += t || (/^data\:|^blob\:|\?/.test(a) || n ? "" : ".js")).charAt(0) || a.match(/^[\w\+\.\-]+:/) ? "" : m.baseUrl) + a
                }
                return m.urlArgs && !/^blob\:/.test(a) ? a + m.urlArgs(e, a) : a
            },
            load: function (e, t) {
                req.load(p, e, t)
            },
            execCb: function (e, t, n, i) {
                return t.apply(i, n)
            },
            onScriptLoad: function (e) {
                if ("load" === e.type || readyRegExp.test((e.currentTarget || e.srcElement).readyState)) {
                    interactiveScript = null;
                    var t = s(e);
                    p.completeLoad(t.id)
                }
            },
            onScriptError: function (e) {
                var n = s(e);
                if (!E(n.id)) {
                    var i = [];
                    return eachProp(c, function (e, t) {
                        0 !== t.indexOf("_@r") && each(e.depMaps, function (e) {
                            if (e.id === n.id) return i.push(t), !0
                        })
                    }), k(makeError("scripterror", 'Script error for "' + n.id + (i.length ? '", needed by: ' + i.join(", ") : '"'), e, [n.id]))
                }
            }
        }).require = p.makeRequire(), p
    }

    function getInteractiveScript() {
        return interactiveScript && "interactive" === interactiveScript.readyState || eachReverse(scripts(), function (e) {
            if ("interactive" === e.readyState) return interactiveScript = e
        }), interactiveScript
    }
}(this, "undefined" == typeof setTimeout ? void 0 : setTimeout), function (e) {
    !function (C, e) {
        var c = [], h = C.document, f = c.slice, g = c.concat, s = c.push, r = c.indexOf, n = {}, t = n.toString,
            m = n.hasOwnProperty, v = {}, i = "1.12.4", T = function (e, t) {
                return new T.fn.init(e, t)
            }, o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, a = /^-ms-/, u = /-([\da-z])/gi, l = function (e, t) {
                return t.toUpperCase()
            };
        if (T.fn = T.prototype = {
            jquery: i, constructor: T, selector: "", length: 0, toArray: function () {
                return f.call(this)
            }, get: function (e) {
                return e != null ? e < 0 ? this[e + this.length] : this[e] : f.call(this)
            }, pushStack: function (e) {
                var t = T.merge(this.constructor(), e);
                t.prevObject = this;
                t.context = this.context;
                return t
            }, each: function (e) {
                return T.each(this, e)
            }, map: function (n) {
                return this.pushStack(T.map(this, function (e, t) {
                    return n.call(e, t, e)
                }))
            }, slice: function () {
                return this.pushStack(f.apply(this, arguments))
            }, first: function () {
                return this.eq(0)
            }, last: function () {
                return this.eq(-1)
            }, eq: function (e) {
                var t = this.length, n = +e + (e < 0 ? t : 0);
                return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
            }, end: function () {
                return this.prevObject || this.constructor()
            }, push: s, sort: c.sort, splice: c.splice
        }, T.extend = T.fn.extend = function () {
            var e, t, n, i, r, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = false;
            if (typeof a === "boolean") {
                l = a;
                a = arguments[s] || {};
                s++
            }
            if (typeof a !== "object" && !T.isFunction(a)) {
                a = {}
            }
            if (s === u) {
                a = this;
                s--
            }
            for (; s < u; s++) {
                if ((r = arguments[s]) != null) {
                    for (i in r) {
                        e = a[i];
                        n = r[i];
                        if (a === n) {
                            continue
                        }
                        if (l && n && (T.isPlainObject(n) || (t = T.isArray(n)))) {
                            if (t) {
                                t = false;
                                o = e && T.isArray(e) ? e : []
                            } else {
                                o = e && T.isPlainObject(e) ? e : {}
                            }
                            a[i] = T.extend(l, o, n)
                        } else if (n !== undefined) {
                            a[i] = n
                        }
                    }
                }
            }
            return a
        }, T.extend({
            expando: "jQuery" + (i + Math.random()).replace(/\D/g, ""), isReady: true, error: function (e) {
                throw new Error(e)
            }, noop: function () {
            }, isFunction: function (e) {
                return T.type(e) === "function"
            }, isArray: Array.isArray || function (e) {
                return T.type(e) === "array"
            }, isWindow: function (e) {
                return e != null && e == e.window
            }, isNumeric: function (e) {
                var t = e && e.toString();
                return !T.isArray(e) && t - parseFloat(t) + 1 >= 0
            }, isEmptyObject: function (e) {
                var t;
                for (t in e) {
                    return false
                }
                return true
            }, isPlainObject: function (e) {
                var t;
                if (!e || T.type(e) !== "object" || e.nodeType || T.isWindow(e)) {
                    return false
                }
                try {
                    if (e.constructor && !m.call(e, "constructor") && !m.call(e.constructor.prototype, "isPrototypeOf")) {
                        return false
                    }
                } catch (e) {
                    return false
                }
                if (!v.ownFirst) {
                    for (t in e) {
                        return m.call(e, t)
                    }
                }
                for (t in e) {
                }
                return t === undefined || m.call(e, t)
            }, type: function (e) {
                if (e == null) {
                    return e + ""
                }
                return typeof e === "object" || typeof e === "function" ? n[t.call(e)] || "object" : typeof e
            }, globalEval: function (e) {
                if (e && T.trim(e)) {
                    (C.execScript || function (e) {
                        C["eval"].call(C, e)
                    })(e)
                }
            }, camelCase: function (e) {
                return e.replace(a, "ms-").replace(u, l)
            }, nodeName: function (e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            }, each: function (e, t) {
                var n, i = 0;
                if (d(e)) {
                    n = e.length;
                    for (; i < n; i++) {
                        if (t.call(e[i], i, e[i]) === false) {
                            break
                        }
                    }
                } else {
                    for (i in e) {
                        if (t.call(e[i], i, e[i]) === false) {
                            break
                        }
                    }
                }
                return e
            }, trim: function (e) {
                return e == null ? "" : (e + "").replace(o, "")
            }, makeArray: function (e, t) {
                var n = t || [];
                if (e != null) {
                    if (d(Object(e))) {
                        T.merge(n, typeof e === "string" ? [e] : e)
                    } else {
                        s.call(n, e)
                    }
                }
                return n
            }, inArray: function (e, t, n) {
                var i;
                if (t) {
                    if (r) {
                        return r.call(t, e, n)
                    }
                    i = t.length;
                    n = n ? n < 0 ? Math.max(0, i + n) : n : 0;
                    for (; n < i; n++) {
                        if (n in t && t[n] === e) {
                            return n
                        }
                    }
                }
                return -1
            }, merge: function (e, t) {
                var n = +t.length, i = 0, r = e.length;
                while (i < n) {
                    e[r++] = t[i++]
                }
                if (n !== n) {
                    while (t[i] !== undefined) {
                        e[r++] = t[i++]
                    }
                }
                e.length = r;
                return e
            }, grep: function (e, t, n) {
                var i, r = [], o = 0, a = e.length, s = !n;
                for (; o < a; o++) {
                    i = !t(e[o], o);
                    if (i !== s) {
                        r.push(e[o])
                    }
                }
                return r
            }, map: function (e, t, n) {
                var i, r, o = 0, a = [];
                if (d(e)) {
                    i = e.length;
                    for (; o < i; o++) {
                        r = t(e[o], o, n);
                        if (r != null) {
                            a.push(r)
                        }
                    }
                } else {
                    for (o in e) {
                        r = t(e[o], o, n);
                        if (r != null) {
                            a.push(r)
                        }
                    }
                }
                return g.apply([], a)
            }, guid: 1, proxy: function (e, t) {
                var n, i, r;
                if (typeof t === "string") {
                    r = e[t];
                    t = e;
                    e = r
                }
                if (!T.isFunction(e)) {
                    return undefined
                }
                n = f.call(arguments, 2);
                i = function () {
                    return e.apply(t || this, n.concat(f.call(arguments)))
                };
                i.guid = e.guid = e.guid || T.guid++;
                return i
            }, now: function () {
                return +new Date
            }, support: v
        }), typeof Symbol === "function") {
            T.fn[Symbol.iterator] = c[Symbol.iterator]
        }

        function d(e) {
            var t = !!e && "length" in e && e.length, n = T.type(e);
            if (n === "function" || T.isWindow(e)) {
                return false
            }
            return n === "array" || t === 0 || typeof t === "number" && t > 0 && t - 1 in e
        }

        T.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
            n["[object " + t + "]"] = t.toLowerCase()
        });
        var p = function (n) {
            var e, h, b, o, r, g, c, m, w, u, l, E, C, a, T, v, s, f, y, S = "sizzle" + 1 * new Date, x = n.document,
                _ = 0, i = 0, d = oe(), p = oe(), k = oe(), A = function (e, t) {
                    if (e === t) {
                        l = true
                    }
                    return 0
                }, D = 1 << 31, N = {}.hasOwnProperty, t = [], L = t.pop, M = t.push, q = t.push, O = t.slice,
                j = function (e, t) {
                    var n = 0, i = e.length;
                    for (; n < i; n++) {
                        if (e[n] === t) {
                            return n
                        }
                    }
                    return -1
                },
                R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                B = "[\\x20\\t\\r\\n\\f]", P = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                H = "\\[" + B + "*(" + P + ")(?:" + B + "*([*^$|!~]?=)" + B + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + P + "))|)" + B + "*\\]",
                I = ":(" + P + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + H + ")*)|" + ".*" + ")\\)|)",
                F = new RegExp(B + "+", "g"), $ = new RegExp("^" + B + "+|((?:^|[^\\\\])(?:\\\\.)*)" + B + "+$", "g"),
                W = new RegExp("^" + B + "*," + B + "*"), J = new RegExp("^" + B + "*([>+~]|" + B + ")" + B + "*"),
                U = new RegExp("=" + B + "*([^\\]'\"]*?)" + B + "*\\]", "g"), z = new RegExp(I),
                X = new RegExp("^" + P + "$"), Q = {
                    ID: new RegExp("^#(" + P + ")"),
                    CLASS: new RegExp("^\\.(" + P + ")"),
                    TAG: new RegExp("^(" + P + "|[*])"),
                    ATTR: new RegExp("^" + H),
                    PSEUDO: new RegExp("^" + I),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + B + "*(even|odd|(([+-]|)(\\d*)n|)" + B + "*(?:([+-]|)" + B + "*(\\d+)|))" + B + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + R + ")$", "i"),
                    needsContext: new RegExp("^" + B + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + B + "*((?:-\\d)?\\d*)" + B + "*\\)|)(?=[^-]|$)", "i")
                }, G = /^(?:input|select|textarea|button)$/i, V = /^h\d$/i, Y = /^[^{]+\{\s*\[native \w/,
                K = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Z = /[+~]/, ee = /'|\\/g,
                te = new RegExp("\\\\([\\da-f]{1,6}" + B + "?|(" + B + ")|.)", "ig"), ne = function (e, t, n) {
                    var i = "0x" + t - 65536;
                    return i !== i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, i & 1023 | 56320)
                }, ie = function () {
                    E()
                };
            try {
                q.apply(t = O.call(x.childNodes), x.childNodes);
                t[x.childNodes.length].nodeType
            } catch (e) {
                q = {
                    apply: t.length ? function (e, t) {
                        M.apply(e, O.call(t))
                    } : function (e, t) {
                        var n = e.length, i = 0;
                        while (e[n++] = t[i++]) {
                        }
                        e.length = n - 1
                    }
                }
            }

            function re(e, t, n, i) {
                var r, o, a, s, u, l, f, c, d = t && t.ownerDocument, p = t ? t.nodeType : 9;
                n = n || [];
                if (typeof e !== "string" || !e || p !== 1 && p !== 9 && p !== 11) {
                    return n
                }
                if (!i) {
                    if ((t ? t.ownerDocument || t : x) !== C) {
                        E(t)
                    }
                    t = t || C;
                    if (T) {
                        if (p !== 11 && (l = K.exec(e))) {
                            if (r = l[1]) {
                                if (p === 9) {
                                    if (a = t.getElementById(r)) {
                                        if (a.id === r) {
                                            n.push(a);
                                            return n
                                        }
                                    } else {
                                        return n
                                    }
                                } else {
                                    if (d && (a = d.getElementById(r)) && y(t, a) && a.id === r) {
                                        n.push(a);
                                        return n
                                    }
                                }
                            } else if (l[2]) {
                                q.apply(n, t.getElementsByTagName(e));
                                return n
                            } else if ((r = l[3]) && h.getElementsByClassName && t.getElementsByClassName) {
                                q.apply(n, t.getElementsByClassName(r));
                                return n
                            }
                        }
                        if (h.qsa && !k[e + " "] && (!v || !v.test(e))) {
                            if (p !== 1) {
                                d = t;
                                c = e
                            } else if (t.nodeName.toLowerCase() !== "object") {
                                if (s = t.getAttribute("id")) {
                                    s = s.replace(ee, "\\$&")
                                } else {
                                    t.setAttribute("id", s = S)
                                }
                                f = g(e);
                                o = f.length;
                                u = X.test(s) ? "#" + s : "[id='" + s + "']";
                                while (o--) {
                                    f[o] = u + " " + ge(f[o])
                                }
                                c = f.join(",");
                                d = Z.test(e) && pe(t.parentNode) || t
                            }
                            if (c) {
                                try {
                                    q.apply(n, d.querySelectorAll(c));
                                    return n
                                } catch (e) {
                                } finally {
                                    if (s === S) {
                                        t.removeAttribute("id")
                                    }
                                }
                            }
                        }
                    }
                }
                return m(e.replace($, "$1"), t, n, i)
            }

            function oe() {
                var n = [];

                function i(e, t) {
                    if (n.push(e + " ") > b.cacheLength) {
                        delete i[n.shift()]
                    }
                    return i[e + " "] = t
                }

                return i
            }

            function ae(e) {
                e[S] = true;
                return e
            }

            function se(e) {
                var t = C.createElement("div");
                try {
                    return !!e(t)
                } catch (e) {
                    return false
                } finally {
                    if (t.parentNode) {
                        t.parentNode.removeChild(t)
                    }
                    t = null
                }
            }

            function ue(e, t) {
                var n = e.split("|"), i = n.length;
                while (i--) {
                    b.attrHandle[n[i]] = t
                }
            }

            function le(e, t) {
                var n = t && e,
                    i = n && e.nodeType === 1 && t.nodeType === 1 && (~t.sourceIndex || D) - (~e.sourceIndex || D);
                if (i) {
                    return i
                }
                if (n) {
                    while (n = n.nextSibling) {
                        if (n === t) {
                            return -1
                        }
                    }
                }
                return e ? 1 : -1
            }

            function fe(n) {
                return function (e) {
                    var t = e.nodeName.toLowerCase();
                    return t === "input" && e.type === n
                }
            }

            function ce(n) {
                return function (e) {
                    var t = e.nodeName.toLowerCase();
                    return (t === "input" || t === "button") && e.type === n
                }
            }

            function de(a) {
                return ae(function (o) {
                    o = +o;
                    return ae(function (e, t) {
                        var n, i = a([], e.length, o), r = i.length;
                        while (r--) {
                            if (e[n = i[r]]) {
                                e[n] = !(t[n] = e[n])
                            }
                        }
                    })
                })
            }

            function pe(e) {
                return e && typeof e.getElementsByTagName !== "undefined" && e
            }

            h = re.support = {};
            r = re.isXML = function (e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return t ? t.nodeName !== "HTML" : false
            };
            E = re.setDocument = function (e) {
                var t, n, i = e ? e.ownerDocument || e : x;
                if (i === C || i.nodeType !== 9 || !i.documentElement) {
                    return C
                }
                C = i;
                a = C.documentElement;
                T = !r(C);
                if ((n = C.defaultView) && n.top !== n) {
                    if (n.addEventListener) {
                        n.addEventListener("unload", ie, false)
                    } else if (n.attachEvent) {
                        n.attachEvent("onunload", ie)
                    }
                }
                h.attributes = se(function (e) {
                    e.className = "i";
                    return !e.getAttribute("className")
                });
                h.getElementsByTagName = se(function (e) {
                    e.appendChild(C.createComment(""));
                    return !e.getElementsByTagName("*").length
                });
                h.getElementsByClassName = Y.test(C.getElementsByClassName);
                h.getById = se(function (e) {
                    a.appendChild(e).id = S;
                    return !C.getElementsByName || !C.getElementsByName(S).length
                });
                if (h.getById) {
                    b.find["ID"] = function (e, t) {
                        if (typeof t.getElementById !== "undefined" && T) {
                            var n = t.getElementById(e);
                            return n ? [n] : []
                        }
                    };
                    b.filter["ID"] = function (e) {
                        var t = e.replace(te, ne);
                        return function (e) {
                            return e.getAttribute("id") === t
                        }
                    }
                } else {
                    delete b.find["ID"];
                    b.filter["ID"] = function (e) {
                        var n = e.replace(te, ne);
                        return function (e) {
                            var t = typeof e.getAttributeNode !== "undefined" && e.getAttributeNode("id");
                            return t && t.value === n
                        }
                    }
                }
                b.find["TAG"] = h.getElementsByTagName ? function (e, t) {
                    if (typeof t.getElementsByTagName !== "undefined") {
                        return t.getElementsByTagName(e)
                    } else if (h.qsa) {
                        return t.querySelectorAll(e)
                    }
                } : function (e, t) {
                    var n, i = [], r = 0, o = t.getElementsByTagName(e);
                    if (e === "*") {
                        while (n = o[r++]) {
                            if (n.nodeType === 1) {
                                i.push(n)
                            }
                        }
                        return i
                    }
                    return o
                };
                b.find["CLASS"] = h.getElementsByClassName && function (e, t) {
                    if (typeof t.getElementsByClassName !== "undefined" && T) {
                        return t.getElementsByClassName(e)
                    }
                };
                s = [];
                v = [];
                if (h.qsa = Y.test(C.querySelectorAll)) {
                    se(function (e) {
                        a.appendChild(e).innerHTML = "<a id='" + S + "'></a>" + "<select id='" + S + "-\r\\' msallowcapture=''>" + "<option selected=''></option></select>";
                        if (e.querySelectorAll("[msallowcapture^='']").length) {
                            v.push("[*^$]=" + B + "*(?:''|\"\")")
                        }
                        if (!e.querySelectorAll("[selected]").length) {
                            v.push("\\[" + B + "*(?:value|" + R + ")")
                        }
                        if (!e.querySelectorAll("[id~=" + S + "-]").length) {
                            v.push("~=")
                        }
                        if (!e.querySelectorAll(":checked").length) {
                            v.push(":checked")
                        }
                        if (!e.querySelectorAll("a#" + S + "+*").length) {
                            v.push(".#.+[+~]")
                        }
                    });
                    se(function (e) {
                        var t = C.createElement("input");
                        t.setAttribute("type", "hidden");
                        e.appendChild(t).setAttribute("name", "D");
                        if (e.querySelectorAll("[name=d]").length) {
                            v.push("name" + B + "*[*^$|!~]?=")
                        }
                        if (!e.querySelectorAll(":enabled").length) {
                            v.push(":enabled", ":disabled")
                        }
                        e.querySelectorAll("*,:x");
                        v.push(",.*:")
                    })
                }
                if (h.matchesSelector = Y.test(f = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) {
                    se(function (e) {
                        h.disconnectedMatch = f.call(e, "div");
                        f.call(e, "[s!='']:x");
                        s.push("!=", I)
                    })
                }
                v = v.length && new RegExp(v.join("|"));
                s = s.length && new RegExp(s.join("|"));
                t = Y.test(a.compareDocumentPosition);
                y = t || Y.test(a.contains) ? function (e, t) {
                    var n = e.nodeType === 9 ? e.documentElement : e, i = t && t.parentNode;
                    return e === i || !!(i && i.nodeType === 1 && (n.contains ? n.contains(i) : e.compareDocumentPosition && e.compareDocumentPosition(i) & 16))
                } : function (e, t) {
                    if (t) {
                        while (t = t.parentNode) {
                            if (t === e) {
                                return true
                            }
                        }
                    }
                    return false
                };
                A = t ? function (e, t) {
                    if (e === t) {
                        l = true;
                        return 0
                    }
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    if (n) {
                        return n
                    }
                    n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1;
                    if (n & 1 || !h.sortDetached && t.compareDocumentPosition(e) === n) {
                        if (e === C || e.ownerDocument === x && y(x, e)) {
                            return -1
                        }
                        if (t === C || t.ownerDocument === x && y(x, t)) {
                            return 1
                        }
                        return u ? j(u, e) - j(u, t) : 0
                    }
                    return n & 4 ? -1 : 1
                } : function (e, t) {
                    if (e === t) {
                        l = true;
                        return 0
                    }
                    var n, i = 0, r = e.parentNode, o = t.parentNode, a = [e], s = [t];
                    if (!r || !o) {
                        return e === C ? -1 : t === C ? 1 : r ? -1 : o ? 1 : u ? j(u, e) - j(u, t) : 0
                    } else if (r === o) {
                        return le(e, t)
                    }
                    n = e;
                    while (n = n.parentNode) {
                        a.unshift(n)
                    }
                    n = t;
                    while (n = n.parentNode) {
                        s.unshift(n)
                    }
                    while (a[i] === s[i]) {
                        i++
                    }
                    return i ? le(a[i], s[i]) : a[i] === x ? -1 : s[i] === x ? 1 : 0
                };
                return C
            };
            re.matches = function (e, t) {
                return re(e, null, null, t)
            };
            re.matchesSelector = function (e, t) {
                if ((e.ownerDocument || e) !== C) {
                    E(e)
                }
                t = t.replace(U, "='$1']");
                if (h.matchesSelector && T && !k[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t))) {
                    try {
                        var n = f.call(e, t);
                        if (n || h.disconnectedMatch || e.document && e.document.nodeType !== 11) {
                            return n
                        }
                    } catch (e) {
                    }
                }
                return re(t, C, null, [e]).length > 0
            };
            re.contains = function (e, t) {
                if ((e.ownerDocument || e) !== C) {
                    E(e)
                }
                return y(e, t)
            };
            re.attr = function (e, t) {
                if ((e.ownerDocument || e) !== C) {
                    E(e)
                }
                var n = b.attrHandle[t.toLowerCase()],
                    i = n && N.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !T) : undefined;
                return i !== undefined ? i : h.attributes || !T ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            };
            re.error = function (e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            };
            re.uniqueSort = function (e) {
                var t, n = [], i = 0, r = 0;
                l = !h.detectDuplicates;
                u = !h.sortStable && e.slice(0);
                e.sort(A);
                if (l) {
                    while (t = e[r++]) {
                        if (t === e[r]) {
                            i = n.push(r)
                        }
                    }
                    while (i--) {
                        e.splice(n[i], 1)
                    }
                }
                u = null;
                return e
            };
            o = re.getText = function (e) {
                var t, n = "", i = 0, r = e.nodeType;
                if (!r) {
                    while (t = e[i++]) {
                        n += o(t)
                    }
                } else if (r === 1 || r === 9 || r === 11) {
                    if (typeof e.textContent === "string") {
                        return e.textContent
                    } else {
                        for (e = e.firstChild; e; e = e.nextSibling) {
                            n += o(e)
                        }
                    }
                } else if (r === 3 || r === 4) {
                    return e.nodeValue
                }
                return n
            };
            b = re.selectors = {
                cacheLength: 50,
                createPseudo: ae,
                match: Q,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {dir: "parentNode", first: true},
                    " ": {dir: "parentNode"},
                    "+": {dir: "previousSibling", first: true},
                    "~": {dir: "previousSibling"}
                },
                preFilter: {
                    ATTR: function (e) {
                        e[1] = e[1].replace(te, ne);
                        e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne);
                        if (e[2] === "~=") {
                            e[3] = " " + e[3] + " "
                        }
                        return e.slice(0, 4)
                    }, CHILD: function (e) {
                        e[1] = e[1].toLowerCase();
                        if (e[1].slice(0, 3) === "nth") {
                            if (!e[3]) {
                                re.error(e[0])
                            }
                            e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * (e[3] === "even" || e[3] === "odd"));
                            e[5] = +(e[7] + e[8] || e[3] === "odd")
                        } else if (e[3]) {
                            re.error(e[0])
                        }
                        return e
                    }, PSEUDO: function (e) {
                        var t, n = !e[6] && e[2];
                        if (Q["CHILD"].test(e[0])) {
                            return null
                        }
                        if (e[3]) {
                            e[2] = e[4] || e[5] || ""
                        } else if (n && z.test(n) && (t = g(n, true)) && (t = n.indexOf(")", n.length - t) - n.length)) {
                            e[0] = e[0].slice(0, t);
                            e[2] = n.slice(0, t)
                        }
                        return e.slice(0, 3)
                    }
                },
                filter: {
                    TAG: function (e) {
                        var t = e.replace(te, ne).toLowerCase();
                        return e === "*" ? function () {
                            return true
                        } : function (e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    }, CLASS: function (e) {
                        var t = d[e + " "];
                        return t || (t = new RegExp("(^|" + B + ")" + e + "(" + B + "|$)")) && d(e, function (e) {
                            return t.test(typeof e.className === "string" && e.className || typeof e.getAttribute !== "undefined" && e.getAttribute("class") || "")
                        })
                    }, ATTR: function (n, i, r) {
                        return function (e) {
                            var t = re.attr(e, n);
                            if (t == null) {
                                return i === "!="
                            }
                            if (!i) {
                                return true
                            }
                            t += "";
                            return i === "=" ? t === r : i === "!=" ? t !== r : i === "^=" ? r && t.indexOf(r) === 0 : i === "*=" ? r && t.indexOf(r) > -1 : i === "$=" ? r && t.slice(-r.length) === r : i === "~=" ? (" " + t.replace(F, " ") + " ").indexOf(r) > -1 : i === "|=" ? t === r || t.slice(0, r.length + 1) === r + "-" : false
                        }
                    }, CHILD: function (h, e, t, g, m) {
                        var v = h.slice(0, 3) !== "nth", y = h.slice(-4) !== "last", x = e === "of-type";
                        return g === 1 && m === 0 ? function (e) {
                            return !!e.parentNode
                        } : function (e, t, n) {
                            var i, r, o, a, s, u, l = v !== y ? "nextSibling" : "previousSibling", f = e.parentNode,
                                c = x && e.nodeName.toLowerCase(), d = !n && !x, p = false;
                            if (f) {
                                if (v) {
                                    while (l) {
                                        a = e;
                                        while (a = a[l]) {
                                            if (x ? a.nodeName.toLowerCase() === c : a.nodeType === 1) {
                                                return false
                                            }
                                        }
                                        u = l = h === "only" && !u && "nextSibling"
                                    }
                                    return true
                                }
                                u = [y ? f.firstChild : f.lastChild];
                                if (y && d) {
                                    a = f;
                                    o = a[S] || (a[S] = {});
                                    r = o[a.uniqueID] || (o[a.uniqueID] = {});
                                    i = r[h] || [];
                                    s = i[0] === _ && i[1];
                                    p = s && i[2];
                                    a = s && f.childNodes[s];
                                    while (a = ++s && a && a[l] || (p = s = 0) || u.pop()) {
                                        if (a.nodeType === 1 && ++p && a === e) {
                                            r[h] = [_, s, p];
                                            break
                                        }
                                    }
                                } else {
                                    if (d) {
                                        a = e;
                                        o = a[S] || (a[S] = {});
                                        r = o[a.uniqueID] || (o[a.uniqueID] = {});
                                        i = r[h] || [];
                                        s = i[0] === _ && i[1];
                                        p = s
                                    }
                                    if (p === false) {
                                        while (a = ++s && a && a[l] || (p = s = 0) || u.pop()) {
                                            if ((x ? a.nodeName.toLowerCase() === c : a.nodeType === 1) && ++p) {
                                                if (d) {
                                                    o = a[S] || (a[S] = {});
                                                    r = o[a.uniqueID] || (o[a.uniqueID] = {});
                                                    r[h] = [_, p]
                                                }
                                                if (a === e) {
                                                    break
                                                }
                                            }
                                        }
                                    }
                                }
                                p -= m;
                                return p === g || p % g === 0 && p / g >= 0
                            }
                        }
                    }, PSEUDO: function (e, o) {
                        var t,
                            a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || re.error("unsupported pseudo: " + e);
                        if (a[S]) {
                            return a(o)
                        }
                        if (a.length > 1) {
                            t = [e, e, "", o];
                            return b.setFilters.hasOwnProperty(e.toLowerCase()) ? ae(function (e, t) {
                                var n, i = a(e, o), r = i.length;
                                while (r--) {
                                    n = j(e, i[r]);
                                    e[n] = !(t[n] = i[r])
                                }
                            }) : function (e) {
                                return a(e, 0, t)
                            }
                        }
                        return a
                    }
                },
                pseudos: {
                    not: ae(function (e) {
                        var i = [], r = [], s = c(e.replace($, "$1"));
                        return s[S] ? ae(function (e, t, n, i) {
                            var r, o = s(e, null, i, []), a = e.length;
                            while (a--) {
                                if (r = o[a]) {
                                    e[a] = !(t[a] = r)
                                }
                            }
                        }) : function (e, t, n) {
                            i[0] = e;
                            s(i, null, n, r);
                            i[0] = null;
                            return !r.pop()
                        }
                    }), has: ae(function (t) {
                        return function (e) {
                            return re(t, e).length > 0
                        }
                    }), contains: ae(function (t) {
                        t = t.replace(te, ne);
                        return function (e) {
                            return (e.textContent || e.innerText || o(e)).indexOf(t) > -1
                        }
                    }), lang: ae(function (n) {
                        if (!X.test(n || "")) {
                            re.error("unsupported lang: " + n)
                        }
                        n = n.replace(te, ne).toLowerCase();
                        return function (e) {
                            var t;
                            do {
                                if (t = T ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) {
                                    t = t.toLowerCase();
                                    return t === n || t.indexOf(n + "-") === 0
                                }
                            } while ((e = e.parentNode) && e.nodeType === 1);
                            return false
                        }
                    }), target: function (e) {
                        var t = n.location && n.location.hash;
                        return t && t.slice(1) === e.id
                    }, root: function (e) {
                        return e === a
                    }, focus: function (e) {
                        return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    }, enabled: function (e) {
                        return e.disabled === false
                    }, disabled: function (e) {
                        return e.disabled === true
                    }, checked: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && !!e.checked || t === "option" && !!e.selected
                    }, selected: function (e) {
                        if (e.parentNode) {
                            e.parentNode.selectedIndex
                        }
                        return e.selected === true
                    }, empty: function (e) {
                        for (e = e.firstChild; e; e = e.nextSibling) {
                            if (e.nodeType < 6) {
                                return false
                            }
                        }
                        return true
                    }, parent: function (e) {
                        return !b.pseudos["empty"](e)
                    }, header: function (e) {
                        return V.test(e.nodeName)
                    }, input: function (e) {
                        return G.test(e.nodeName)
                    }, button: function (e) {
                        var t = e.nodeName.toLowerCase();
                        return t === "input" && e.type === "button" || t === "button"
                    }, text: function (e) {
                        var t;
                        return e.nodeName.toLowerCase() === "input" && e.type === "text" && ((t = e.getAttribute("type")) == null || t.toLowerCase() === "text")
                    }, first: de(function () {
                        return [0]
                    }), last: de(function (e, t) {
                        return [t - 1]
                    }), eq: de(function (e, t, n) {
                        return [n < 0 ? n + t : n]
                    }), even: de(function (e, t) {
                        var n = 0;
                        for (; n < t; n += 2) {
                            e.push(n)
                        }
                        return e
                    }), odd: de(function (e, t) {
                        var n = 1;
                        for (; n < t; n += 2) {
                            e.push(n)
                        }
                        return e
                    }), lt: de(function (e, t, n) {
                        var i = n < 0 ? n + t : n;
                        for (; --i >= 0;) {
                            e.push(i)
                        }
                        return e
                    }), gt: de(function (e, t, n) {
                        var i = n < 0 ? n + t : n;
                        for (; ++i < t;) {
                            e.push(i)
                        }
                        return e
                    })
                }
            };
            b.pseudos["nth"] = b.pseudos["eq"];
            for (e in {radio: true, checkbox: true, file: true, password: true, image: true}) {
                b.pseudos[e] = fe(e)
            }
            for (e in {submit: true, reset: true}) {
                b.pseudos[e] = ce(e)
            }

            function he() {
            }

            he.prototype = b.filters = b.pseudos;
            b.setFilters = new he;
            g = re.tokenize = function (e, t) {
                var n, i, r, o, a, s, u, l = p[e + " "];
                if (l) {
                    return t ? 0 : l.slice(0)
                }
                a = e;
                s = [];
                u = b.preFilter;
                while (a) {
                    if (!n || (i = W.exec(a))) {
                        if (i) {
                            a = a.slice(i[0].length) || a
                        }
                        s.push(r = [])
                    }
                    n = false;
                    if (i = J.exec(a)) {
                        n = i.shift();
                        r.push({value: n, type: i[0].replace($, " ")});
                        a = a.slice(n.length)
                    }
                    for (o in b.filter) {
                        if ((i = Q[o].exec(a)) && (!u[o] || (i = u[o](i)))) {
                            n = i.shift();
                            r.push({value: n, type: o, matches: i});
                            a = a.slice(n.length)
                        }
                    }
                    if (!n) {
                        break
                    }
                }
                return t ? a.length : a ? re.error(e) : p(e, s).slice(0)
            };

            function ge(e) {
                var t = 0, n = e.length, i = "";
                for (; t < n; t++) {
                    i += e[t].value
                }
                return i
            }

            function me(s, e, t) {
                var u = e.dir, l = t && u === "parentNode", f = i++;
                return e.first ? function (e, t, n) {
                    while (e = e[u]) {
                        if (e.nodeType === 1 || l) {
                            return s(e, t, n)
                        }
                    }
                } : function (e, t, n) {
                    var i, r, o, a = [_, f];
                    if (n) {
                        while (e = e[u]) {
                            if (e.nodeType === 1 || l) {
                                if (s(e, t, n)) {
                                    return true
                                }
                            }
                        }
                    } else {
                        while (e = e[u]) {
                            if (e.nodeType === 1 || l) {
                                o = e[S] || (e[S] = {});
                                r = o[e.uniqueID] || (o[e.uniqueID] = {});
                                if ((i = r[u]) && i[0] === _ && i[1] === f) {
                                    return a[2] = i[2]
                                } else {
                                    r[u] = a;
                                    if (a[2] = s(e, t, n)) {
                                        return true
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function ve(r) {
                return r.length > 1 ? function (e, t, n) {
                    var i = r.length;
                    while (i--) {
                        if (!r[i](e, t, n)) {
                            return false
                        }
                    }
                    return true
                } : r[0]
            }

            function ye(e, t, n) {
                var i = 0, r = t.length;
                for (; i < r; i++) {
                    re(e, t[i], n)
                }
                return n
            }

            function xe(e, t, n, i, r) {
                var o, a = [], s = 0, u = e.length, l = t != null;
                for (; s < u; s++) {
                    if (o = e[s]) {
                        if (!n || n(o, i, r)) {
                            a.push(o);
                            if (l) {
                                t.push(s)
                            }
                        }
                    }
                }
                return a
            }

            function be(p, h, g, m, v, e) {
                if (m && !m[S]) {
                    m = be(m)
                }
                if (v && !v[S]) {
                    v = be(v, e)
                }
                return ae(function (e, t, n, i) {
                    var r, o, a, s = [], u = [], l = t.length, f = e || ye(h || "*", n.nodeType ? [n] : n, []),
                        c = p && (e || !h) ? xe(f, s, p, n, i) : f, d = g ? v || (e ? p : l || m) ? [] : t : c;
                    if (g) {
                        g(c, d, n, i)
                    }
                    if (m) {
                        r = xe(d, u);
                        m(r, [], n, i);
                        o = r.length;
                        while (o--) {
                            if (a = r[o]) {
                                d[u[o]] = !(c[u[o]] = a)
                            }
                        }
                    }
                    if (e) {
                        if (v || p) {
                            if (v) {
                                r = [];
                                o = d.length;
                                while (o--) {
                                    if (a = d[o]) {
                                        r.push(c[o] = a)
                                    }
                                }
                                v(null, d = [], r, i)
                            }
                            o = d.length;
                            while (o--) {
                                if ((a = d[o]) && (r = v ? j(e, a) : s[o]) > -1) {
                                    e[r] = !(t[r] = a)
                                }
                            }
                        }
                    } else {
                        d = xe(d === t ? d.splice(l, d.length) : d);
                        if (v) {
                            v(null, t, d, i)
                        } else {
                            q.apply(t, d)
                        }
                    }
                })
            }

            function we(e) {
                var r, t, n, i = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0,
                    u = me(function (e) {
                        return e === r
                    }, a, true), l = me(function (e) {
                        return j(r, e) > -1
                    }, a, true), f = [function (e, t, n) {
                        var i = !o && (n || t !== w) || ((r = t).nodeType ? u(e, t, n) : l(e, t, n));
                        r = null;
                        return i
                    }];
                for (; s < i; s++) {
                    if (t = b.relative[e[s].type]) {
                        f = [me(ve(f), t)]
                    } else {
                        t = b.filter[e[s].type].apply(null, e[s].matches);
                        if (t[S]) {
                            n = ++s;
                            for (; n < i; n++) {
                                if (b.relative[e[n].type]) {
                                    break
                                }
                            }
                            return be(s > 1 && ve(f), s > 1 && ge(e.slice(0, s - 1).concat({value: e[s - 2].type === " " ? "*" : ""})).replace($, "$1"), t, s < n && we(e.slice(s, n)), n < i && we(e = e.slice(n)), n < i && ge(e))
                        }
                        f.push(t)
                    }
                }
                return ve(f)
            }

            function Ee(m, v) {
                var y = v.length > 0, x = m.length > 0, e = function (e, t, n, i, r) {
                    var o, a, s, u = 0, l = "0", f = e && [], c = [], d = w, p = e || x && b.find["TAG"]("*", r),
                        h = _ += d == null ? 1 : Math.random() || .1, g = p.length;
                    if (r) {
                        w = t === C || t || r
                    }
                    for (; l !== g && (o = p[l]) != null; l++) {
                        if (x && o) {
                            a = 0;
                            if (!t && o.ownerDocument !== C) {
                                E(o);
                                n = !T
                            }
                            while (s = m[a++]) {
                                if (s(o, t || C, n)) {
                                    i.push(o);
                                    break
                                }
                            }
                            if (r) {
                                _ = h
                            }
                        }
                        if (y) {
                            if (o = !s && o) {
                                u--
                            }
                            if (e) {
                                f.push(o)
                            }
                        }
                    }
                    u += l;
                    if (y && l !== u) {
                        a = 0;
                        while (s = v[a++]) {
                            s(f, c, t, n)
                        }
                        if (e) {
                            if (u > 0) {
                                while (l--) {
                                    if (!(f[l] || c[l])) {
                                        c[l] = L.call(i)
                                    }
                                }
                            }
                            c = xe(c)
                        }
                        q.apply(i, c);
                        if (r && !e && c.length > 0 && u + v.length > 1) {
                            re.uniqueSort(i)
                        }
                    }
                    if (r) {
                        _ = h;
                        w = d
                    }
                    return f
                };
                return y ? ae(e) : e
            }

            c = re.compile = function (e, t) {
                var n, i = [], r = [], o = k[e + " "];
                if (!o) {
                    if (!t) {
                        t = g(e)
                    }
                    n = t.length;
                    while (n--) {
                        o = we(t[n]);
                        if (o[S]) {
                            i.push(o)
                        } else {
                            r.push(o)
                        }
                    }
                    o = k(e, Ee(r, i));
                    o.selector = e
                }
                return o
            };
            m = re.select = function (e, t, n, i) {
                var r, o, a, s, u, l = typeof e === "function" && e, f = !i && g(e = l.selector || e);
                n = n || [];
                if (f.length === 1) {
                    o = f[0] = f[0].slice(0);
                    if (o.length > 2 && (a = o[0]).type === "ID" && h.getById && t.nodeType === 9 && T && b.relative[o[1].type]) {
                        t = (b.find["ID"](a.matches[0].replace(te, ne), t) || [])[0];
                        if (!t) {
                            return n
                        } else if (l) {
                            t = t.parentNode
                        }
                        e = e.slice(o.shift().value.length)
                    }
                    r = Q["needsContext"].test(e) ? 0 : o.length;
                    while (r--) {
                        a = o[r];
                        if (b.relative[s = a.type]) {
                            break
                        }
                        if (u = b.find[s]) {
                            if (i = u(a.matches[0].replace(te, ne), Z.test(o[0].type) && pe(t.parentNode) || t)) {
                                o.splice(r, 1);
                                e = i.length && ge(o);
                                if (!e) {
                                    q.apply(n, i);
                                    return n
                                }
                                break
                            }
                        }
                    }
                }
                (l || c(e, f))(i, t, !T, n, !t || Z.test(e) && pe(t.parentNode) || t);
                return n
            };
            h.sortStable = S.split("").sort(A).join("") === S;
            h.detectDuplicates = !!l;
            E();
            h.sortDetached = se(function (e) {
                return e.compareDocumentPosition(C.createElement("div")) & 1
            });
            if (!se(function (e) {
                e.innerHTML = "<a href='#'></a>";
                return e.firstChild.getAttribute("href") === "#"
            })) {
                ue("type|href|height|width", function (e, t, n) {
                    if (!n) {
                        return e.getAttribute(t, t.toLowerCase() === "type" ? 1 : 2)
                    }
                })
            }
            if (!h.attributes || !se(function (e) {
                e.innerHTML = "<input/>";
                e.firstChild.setAttribute("value", "");
                return e.firstChild.getAttribute("value") === ""
            })) {
                ue("value", function (e, t, n) {
                    if (!n && e.nodeName.toLowerCase() === "input") {
                        return e.defaultValue
                    }
                })
            }
            if (!se(function (e) {
                return e.getAttribute("disabled") == null
            })) {
                ue(R, function (e, t, n) {
                    var i;
                    if (!n) {
                        return e[t] === true ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
                    }
                })
            }
            return re
        }(C);
        T.find = p, T.expr = p.selectors, T.expr[":"] = T.expr.pseudos, T.uniqueSort = T.unique = p.uniqueSort, T.text = p.getText, T.isXMLDoc = p.isXML, T.contains = p.contains;
        var y = function (e, t, n) {
            var i = [], r = n !== undefined;
            while ((e = e[t]) && e.nodeType !== 9) {
                if (e.nodeType === 1) {
                    if (r && T(e).is(n)) {
                        break
                    }
                    i.push(e)
                }
            }
            return i
        }, x = function (e, t) {
            var n = [];
            for (; e; e = e.nextSibling) {
                if (e.nodeType === 1 && e !== t) {
                    n.push(e)
                }
            }
            return n
        }, b = T.expr.match.needsContext, w = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/, E = /^.[^:#\[\.,]*$/;

        function S(e, n, i) {
            if (T.isFunction(n)) {
                return T.grep(e, function (e, t) {
                    return !!n.call(e, t, e) !== i
                })
            }
            if (n.nodeType) {
                return T.grep(e, function (e) {
                    return e === n !== i
                })
            }
            if (typeof n === "string") {
                if (E.test(n)) {
                    return T.filter(n, e, i)
                }
                n = T.filter(n, e)
            }
            return T.grep(e, function (e) {
                return T.inArray(e, n) > -1 !== i
            })
        }

        T.filter = function (e, t, n) {
            var i = t[0];
            if (n) {
                e = ":not(" + e + ")"
            }
            return t.length === 1 && i.nodeType === 1 ? T.find.matchesSelector(i, e) ? [i] : [] : T.find.matches(e, T.grep(t, function (e) {
                return e.nodeType === 1
            }))
        }, T.fn.extend({
            find: function (e) {
                var t, n = [], i = this, r = i.length;
                if (typeof e !== "string") {
                    return this.pushStack(T(e).filter(function () {
                        for (t = 0; t < r; t++) {
                            if (T.contains(i[t], this)) {
                                return true
                            }
                        }
                    }))
                }
                for (t = 0; t < r; t++) {
                    T.find(e, i[t], n)
                }
                n = this.pushStack(r > 1 ? T.unique(n) : n);
                n.selector = this.selector ? this.selector + " " + e : e;
                return n
            }, filter: function (e) {
                return this.pushStack(S(this, e || [], false))
            }, not: function (e) {
                return this.pushStack(S(this, e || [], true))
            }, is: function (e) {
                return !!S(this, typeof e === "string" && b.test(e) ? T(e) : e || [], false).length
            }
        });
        var _, k = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A;
        (T.fn.init = function (e, t, n) {
            var i, r;
            if (!e) {
                return this
            }
            n = n || _;
            if (typeof e === "string") {
                if (e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3) {
                    i = [null, e, null]
                } else {
                    i = k.exec(e)
                }
                if (i && (i[1] || !t)) {
                    if (i[1]) {
                        t = t instanceof T ? t[0] : t;
                        T.merge(this, T.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : h, true));
                        if (w.test(i[1]) && T.isPlainObject(t)) {
                            for (i in t) {
                                if (T.isFunction(this[i])) {
                                    this[i](t[i])
                                } else {
                                    this.attr(i, t[i])
                                }
                            }
                        }
                        return this
                    } else {
                        r = h.getElementById(i[2]);
                        if (r && r.parentNode) {
                            if (r.id !== i[2]) {
                                return _.find(e)
                            }
                            this.length = 1;
                            this[0] = r
                        }
                        this.context = h;
                        this.selector = e;
                        return this
                    }
                } else if (!t || t.jquery) {
                    return (t || n).find(e)
                } else {
                    return this.constructor(t).find(e)
                }
            } else if (e.nodeType) {
                this.context = this[0] = e;
                this.length = 1;
                return this
            } else if (T.isFunction(e)) {
                return typeof n.ready !== "undefined" ? n.ready(e) : e(T)
            }
            if (e.selector !== undefined) {
                this.selector = e.selector;
                this.context = e.context
            }
            return T.makeArray(e, this)
        }).prototype = T.fn, _ = T(h);
        var D = /^(?:parents|prev(?:Until|All))/, N = {children: true, contents: true, next: true, prev: true};

        function L(e, t) {
            do {
                e = e[t]
            } while (e && e.nodeType !== 1);
            return e
        }

        T.fn.extend({
            has: function (e) {
                var t, n = T(e, this), i = n.length;
                return this.filter(function () {
                    for (t = 0; t < i; t++) {
                        if (T.contains(this, n[t])) {
                            return true
                        }
                    }
                })
            }, closest: function (e, t) {
                var n, i = 0, r = this.length, o = [],
                    a = b.test(e) || typeof e !== "string" ? T(e, t || this.context) : 0;
                for (; i < r; i++) {
                    for (n = this[i]; n && n !== t; n = n.parentNode) {
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : n.nodeType === 1 && T.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
                    }
                }
                return this.pushStack(o.length > 1 ? T.uniqueSort(o) : o)
            }, index: function (e) {
                if (!e) {
                    return this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                }
                if (typeof e === "string") {
                    return T.inArray(this[0], T(e))
                }
                return T.inArray(e.jquery ? e[0] : e, this)
            }, add: function (e, t) {
                return this.pushStack(T.uniqueSort(T.merge(this.get(), T(e, t))))
            }, addBack: function (e) {
                return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
            }
        }), T.each({
            parent: function (e) {
                var t = e.parentNode;
                return t && t.nodeType !== 11 ? t : null
            }, parents: function (e) {
                return y(e, "parentNode")
            }, parentsUntil: function (e, t, n) {
                return y(e, "parentNode", n)
            }, next: function (e) {
                return L(e, "nextSibling")
            }, prev: function (e) {
                return L(e, "previousSibling")
            }, nextAll: function (e) {
                return y(e, "nextSibling")
            }, prevAll: function (e) {
                return y(e, "previousSibling")
            }, nextUntil: function (e, t, n) {
                return y(e, "nextSibling", n)
            }, prevUntil: function (e, t, n) {
                return y(e, "previousSibling", n)
            }, siblings: function (e) {
                return x((e.parentNode || {}).firstChild, e)
            }, children: function (e) {
                return x(e.firstChild)
            }, contents: function (e) {
                return T.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : T.merge([], e.childNodes)
            }
        }, function (i, r) {
            T.fn[i] = function (e, t) {
                var n = T.map(this, r, e);
                if (i.slice(-5) !== "Until") {
                    t = e
                }
                if (t && typeof t === "string") {
                    n = T.filter(t, n)
                }
                if (this.length > 1) {
                    if (!N[i]) {
                        n = T.uniqueSort(n)
                    }
                    if (D.test(i)) {
                        n = n.reverse()
                    }
                }
                return this.pushStack(n)
            }
        });
        var M = /\S+/g, q, O;

        function j(e) {
            var n = {};
            T.each(e.match(M) || [], function (e, t) {
                n[t] = true
            });
            return n
        }

        function R() {
            if (h.addEventListener) {
                h.removeEventListener("DOMContentLoaded", B);
                C.removeEventListener("load", B)
            } else {
                h.detachEvent("onreadystatechange", B);
                C.detachEvent("onload", B)
            }
        }

        function B() {
            if (h.addEventListener || C.event.type === "load" || h.readyState === "complete") {
                R();
                T.ready()
            }
        }

        for (O in T.Callbacks = function (i) {
            i = typeof i === "string" ? j(i) : T.extend({}, i);
            var n, e, t, r, o = [], a = [], s = -1, u = function () {
                r = i.once;
                t = n = true;
                for (; a.length; s = -1) {
                    e = a.shift();
                    while (++s < o.length) {
                        if (o[s].apply(e[0], e[1]) === false && i.stopOnFalse) {
                            s = o.length;
                            e = false
                        }
                    }
                }
                if (!i.memory) {
                    e = false
                }
                n = false;
                if (r) {
                    if (e) {
                        o = []
                    } else {
                        o = ""
                    }
                }
            }, l = {
                add: function () {
                    if (o) {
                        if (e && !n) {
                            s = o.length - 1;
                            a.push(e)
                        }
                        (function n(e) {
                            T.each(e, function (e, t) {
                                if (T.isFunction(t)) {
                                    if (!i.unique || !l.has(t)) {
                                        o.push(t)
                                    }
                                } else if (t && t.length && T.type(t) !== "string") {
                                    n(t)
                                }
                            })
                        })(arguments);
                        if (e && !n) {
                            u()
                        }
                    }
                    return this
                }, remove: function () {
                    T.each(arguments, function (e, t) {
                        var n;
                        while ((n = T.inArray(t, o, n)) > -1) {
                            o.splice(n, 1);
                            if (n <= s) {
                                s--
                            }
                        }
                    });
                    return this
                }, has: function (e) {
                    return e ? T.inArray(e, o) > -1 : o.length > 0
                }, empty: function () {
                    if (o) {
                        o = []
                    }
                    return this
                }, disable: function () {
                    r = a = [];
                    o = e = "";
                    return this
                }, disabled: function () {
                    return !o
                }, lock: function () {
                    r = true;
                    if (!e) {
                        l.disable()
                    }
                    return this
                }, locked: function () {
                    return !!r
                }, fireWith: function (e, t) {
                    if (!r) {
                        t = t || [];
                        t = [e, t.slice ? t.slice() : t];
                        a.push(t);
                        if (!n) {
                            u()
                        }
                    }
                    return this
                }, fire: function () {
                    l.fireWith(this, arguments);
                    return this
                }, fired: function () {
                    return !!t
                }
            };
            return l
        }, T.extend({
            Deferred: function (e) {
                var o = [["resolve", "done", T.Callbacks("once memory"), "resolved"], ["reject", "fail", T.Callbacks("once memory"), "rejected"], ["notify", "progress", T.Callbacks("memory")]],
                    r = "pending", a = {
                        state: function () {
                            return r
                        }, always: function () {
                            s.done(arguments).fail(arguments);
                            return this
                        }, then: function () {
                            var r = arguments;
                            return T.Deferred(function (i) {
                                T.each(o, function (e, t) {
                                    var n = T.isFunction(r[e]) && r[e];
                                    s[t[1]](function () {
                                        var e = n && n.apply(this, arguments);
                                        if (e && T.isFunction(e.promise)) {
                                            e.promise().progress(i.notify).done(i.resolve).fail(i.reject)
                                        } else {
                                            i[t[0] + "With"](this === a ? i.promise() : this, n ? [e] : arguments)
                                        }
                                    })
                                });
                                r = null
                            }).promise()
                        }, promise: function (e) {
                            return e != null ? T.extend(e, a) : a
                        }
                    }, s = {};
                a.pipe = a.then;
                T.each(o, function (e, t) {
                    var n = t[2], i = t[3];
                    a[t[1]] = n.add;
                    if (i) {
                        n.add(function () {
                            r = i
                        }, o[e ^ 1][2].disable, o[2][2].lock)
                    }
                    s[t[0]] = function () {
                        s[t[0] + "With"](this === s ? a : this, arguments);
                        return this
                    };
                    s[t[0] + "With"] = n.fireWith
                });
                a.promise(s);
                if (e) {
                    e.call(s, s)
                }
                return s
            }, when: function (e) {
                var t = 0, n = f.call(arguments), i = n.length, r = i !== 1 || e && T.isFunction(e.promise) ? i : 0,
                    o = r === 1 ? e : T.Deferred(), a = function (t, n, i) {
                        return function (e) {
                            n[t] = this;
                            i[t] = arguments.length > 1 ? f.call(arguments) : e;
                            if (i === s) {
                                o.notifyWith(n, i)
                            } else if (!--r) {
                                o.resolveWith(n, i)
                            }
                        }
                    }, s, u, l;
                if (i > 1) {
                    s = new Array(i);
                    u = new Array(i);
                    l = new Array(i);
                    for (; t < i; t++) {
                        if (n[t] && T.isFunction(n[t].promise)) {
                            n[t].promise().progress(a(t, u, s)).done(a(t, l, n)).fail(o.reject)
                        } else {
                            --r
                        }
                    }
                }
                if (!r) {
                    o.resolveWith(l, n)
                }
                return o.promise()
            }
        }), T.fn.ready = function (e) {
            T.ready.promise().done(e);
            return this
        }, T.extend({
            isReady: false, readyWait: 1, holdReady: function (e) {
                if (e) {
                    T.readyWait++
                } else {
                    T.ready(true)
                }
            }, ready: function (e) {
                if (e === true ? --T.readyWait : T.isReady) {
                    return
                }
                T.isReady = true;
                if (e !== true && --T.readyWait > 0) {
                    return
                }
                q.resolveWith(h, [T]);
                if (T.fn.triggerHandler) {
                    T(h).triggerHandler("ready");
                    T(h).off("ready")
                }
            }
        }), T.ready.promise = function (e) {
            if (!q) {
                q = T.Deferred();
                if (h.readyState === "complete" || h.readyState !== "loading" && !h.documentElement.doScroll) {
                    C.setTimeout(T.ready)
                } else if (h.addEventListener) {
                    h.addEventListener("DOMContentLoaded", B);
                    C.addEventListener("load", B)
                } else {
                    h.attachEvent("onreadystatechange", B);
                    C.attachEvent("onload", B);
                    var n = false;
                    try {
                        n = C.frameElement == null && h.documentElement
                    } catch (e) {
                    }
                    if (n && n.doScroll) {
                        (function t() {
                            if (!T.isReady) {
                                try {
                                    n.doScroll("left")
                                } catch (e) {
                                    return C.setTimeout(t, 50)
                                }
                                R();
                                T.ready()
                            }
                        })()
                    }
                }
            }
            return q.promise(e)
        }, T.ready.promise(), T(v)) {
            break
        }
        v.ownFirst = O === "0", v.inlineBlockNeedsLayout = false, T(function () {
            var e, t, n, i;
            n = h.getElementsByTagName("body")[0];
            if (!n || !n.style) {
                return
            }
            t = h.createElement("div");
            i = h.createElement("div");
            i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            n.appendChild(i).appendChild(t);
            if (typeof t.style.zoom !== "undefined") {
                t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
                v.inlineBlockNeedsLayout = e = t.offsetWidth === 3;
                if (e) {
                    n.style.zoom = 1
                }
            }
            n.removeChild(i)
        }), function () {
            var e = h.createElement("div");
            v.deleteExpando = true;
            try {
                delete e.test
            } catch (e) {
                v.deleteExpando = false
            }
            e = null
        }();
        var P = function (e) {
            var t = T.noData[(e.nodeName + " ").toLowerCase()], n = +e.nodeType || 1;
            return n !== 1 && n !== 9 ? false : !t || t !== true && e.getAttribute("classid") === t
        }, H = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, I = /([A-Z])/g;

        function F(e, t, n) {
            if (n === undefined && e.nodeType === 1) {
                var i = "data-" + t.replace(I, "-$1").toLowerCase();
                n = e.getAttribute(i);
                if (typeof n === "string") {
                    try {
                        n = n === "true" ? true : n === "false" ? false : n === "null" ? null : +n + "" === n ? +n : H.test(n) ? T.parseJSON(n) : n
                    } catch (e) {
                    }
                    T.data(e, t, n)
                } else {
                    n = undefined
                }
            }
            return n
        }

        function $(e) {
            var t;
            for (t in e) {
                if (t === "data" && T.isEmptyObject(e[t])) {
                    continue
                }
                if (t !== "toJSON") {
                    return false
                }
            }
            return true
        }

        function W(e, t, n, i) {
            if (!P(e)) {
                return
            }
            var r, o, a = T.expando, s = e.nodeType, u = s ? T.cache : e, l = s ? e[a] : e[a] && a;
            if ((!l || !u[l] || !i && !u[l].data) && n === undefined && typeof t === "string") {
                return
            }
            if (!l) {
                if (s) {
                    l = e[a] = c.pop() || T.guid++
                } else {
                    l = a
                }
            }
            if (!u[l]) {
                u[l] = s ? {} : {toJSON: T.noop}
            }
            if (typeof t === "object" || typeof t === "function") {
                if (i) {
                    u[l] = T.extend(u[l], t)
                } else {
                    u[l].data = T.extend(u[l].data, t)
                }
            }
            o = u[l];
            if (!i) {
                if (!o.data) {
                    o.data = {}
                }
                o = o.data
            }
            if (n !== undefined) {
                o[T.camelCase(t)] = n
            }
            if (typeof t === "string") {
                r = o[t];
                if (r == null) {
                    r = o[T.camelCase(t)]
                }
            } else {
                r = o
            }
            return r
        }

        function J(e, t, n) {
            if (!P(e)) {
                return
            }
            var i, r, o = e.nodeType, a = o ? T.cache : e, s = o ? e[T.expando] : T.expando;
            if (!a[s]) {
                return
            }
            if (t) {
                i = n ? a[s] : a[s].data;
                if (i) {
                    if (!T.isArray(t)) {
                        if (t in i) {
                            t = [t]
                        } else {
                            t = T.camelCase(t);
                            if (t in i) {
                                t = [t]
                            } else {
                                t = t.split(" ")
                            }
                        }
                    } else {
                        t = t.concat(T.map(t, T.camelCase))
                    }
                    r = t.length;
                    while (r--) {
                        delete i[t[r]]
                    }
                    if (n ? !$(i) : !T.isEmptyObject(i)) {
                        return
                    }
                }
            }
            if (!n) {
                delete a[s].data;
                if (!$(a[s])) {
                    return
                }
            }
            if (o) {
                T.cleanData([e], true)
            } else if (v.deleteExpando || a != a.window) {
                delete a[s]
            } else {
                a[s] = undefined
            }
        }

        T.extend({
            cache: {},
            noData: {"applet ": true, "embed ": true, "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},
            hasData: function (e) {
                e = e.nodeType ? T.cache[e[T.expando]] : e[T.expando];
                return !!e && !$(e)
            },
            data: function (e, t, n) {
                return W(e, t, n)
            },
            removeData: function (e, t) {
                return J(e, t)
            },
            _data: function (e, t, n) {
                return W(e, t, n, true)
            },
            _removeData: function (e, t) {
                return J(e, t, true)
            }
        }), T.fn.extend({
            data: function (e, t) {
                var n, i, r, o = this[0], a = o && o.attributes;
                if (e === undefined) {
                    if (this.length) {
                        r = T.data(o);
                        if (o.nodeType === 1 && !T._data(o, "parsedAttrs")) {
                            n = a.length;
                            while (n--) {
                                if (a[n]) {
                                    i = a[n].name;
                                    if (i.indexOf("data-") === 0) {
                                        i = T.camelCase(i.slice(5));
                                        F(o, i, r[i])
                                    }
                                }
                            }
                            T._data(o, "parsedAttrs", true)
                        }
                    }
                    return r
                }
                if (typeof e === "object") {
                    return this.each(function () {
                        T.data(this, e)
                    })
                }
                return arguments.length > 1 ? this.each(function () {
                    T.data(this, e, t)
                }) : o ? F(o, e, T.data(o, e)) : undefined
            }, removeData: function (e) {
                return this.each(function () {
                    T.removeData(this, e)
                })
            }
        }), T.extend({
            queue: function (e, t, n) {
                var i;
                if (e) {
                    t = (t || "fx") + "queue";
                    i = T._data(e, t);
                    if (n) {
                        if (!i || T.isArray(n)) {
                            i = T._data(e, t, T.makeArray(n))
                        } else {
                            i.push(n)
                        }
                    }
                    return i || []
                }
            }, dequeue: function (e, t) {
                t = t || "fx";
                var n = T.queue(e, t), i = n.length, r = n.shift(), o = T._queueHooks(e, t), a = function () {
                    T.dequeue(e, t)
                };
                if (r === "inprogress") {
                    r = n.shift();
                    i--
                }
                if (r) {
                    if (t === "fx") {
                        n.unshift("inprogress")
                    }
                    delete o.stop;
                    r.call(e, a, o)
                }
                if (!i && o) {
                    o.empty.fire()
                }
            }, _queueHooks: function (e, t) {
                var n = t + "queueHooks";
                return T._data(e, n) || T._data(e, n, {
                    empty: T.Callbacks("once memory").add(function () {
                        T._removeData(e, t + "queue");
                        T._removeData(e, n)
                    })
                })
            }
        }), T.fn.extend({
            queue: function (t, n) {
                var e = 2;
                if (typeof t !== "string") {
                    n = t;
                    t = "fx";
                    e--
                }
                if (arguments.length < e) {
                    return T.queue(this[0], t)
                }
                return n === undefined ? this : this.each(function () {
                    var e = T.queue(this, t, n);
                    T._queueHooks(this, t);
                    if (t === "fx" && e[0] !== "inprogress") {
                        T.dequeue(this, t)
                    }
                })
            }, dequeue: function (e) {
                return this.each(function () {
                    T.dequeue(this, e)
                })
            }, clearQueue: function (e) {
                return this.queue(e || "fx", [])
            }, promise: function (e, t) {
                var n, i = 1, r = T.Deferred(), o = this, a = this.length, s = function () {
                    if (!--i) {
                        r.resolveWith(o, [o])
                    }
                };
                if (typeof e !== "string") {
                    t = e;
                    e = undefined
                }
                e = e || "fx";
                while (a--) {
                    n = T._data(o[a], e + "queueHooks");
                    if (n && n.empty) {
                        i++;
                        n.empty.add(s)
                    }
                }
                s();
                return r.promise(t)
            }
        }), function () {
            var i;
            v.shrinkWrapBlocks = function () {
                if (i != null) {
                    return i
                }
                i = false;
                var e, t, n;
                t = h.getElementsByTagName("body")[0];
                if (!t || !t.style) {
                    return
                }
                e = h.createElement("div");
                n = h.createElement("div");
                n.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
                t.appendChild(n).appendChild(e);
                if (typeof e.style.zoom !== "undefined") {
                    e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;" + "padding:1px;width:1px;zoom:1";
                    e.appendChild(h.createElement("div")).style.width = "5px";
                    i = e.offsetWidth !== 3
                }
                t.removeChild(n);
                return i
            }
        }();
        var U = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, z = new RegExp("^(?:([+-])=|)(" + U + ")([a-z%]*)$", "i"),
            X = ["Top", "Right", "Bottom", "Left"], Q = function (e, t) {
                e = t || e;
                return T.css(e, "display") === "none" || !T.contains(e.ownerDocument, e)
            };

        function G(e, t, n, i) {
            var r, o = 1, a = 20, s = i ? function () {
                    return i.cur()
                } : function () {
                    return T.css(e, t, "")
                }, u = s(), l = n && n[3] || (T.cssNumber[t] ? "" : "px"),
                f = (T.cssNumber[t] || l !== "px" && +u) && z.exec(T.css(e, t));
            if (f && f[3] !== l) {
                l = l || f[3];
                n = n || [];
                f = +u || 1;
                do {
                    o = o || ".5";
                    f = f / o;
                    T.style(e, t, f + l)
                } while (o !== (o = s() / u) && o !== 1 && --a)
            }
            if (n) {
                f = +f || +u || 0;
                r = n[1] ? f + (n[1] + 1) * n[2] : +n[2];
                if (i) {
                    i.unit = l;
                    i.start = f;
                    i.end = r
                }
            }
            return r
        }

        var V = function (e, t, n, i, r, o, a) {
                var s = 0, u = e.length, l = n == null;
                if (T.type(n) === "object") {
                    r = true;
                    for (s in n) {
                        V(e, t, s, n[s], true, o, a)
                    }
                } else if (i !== undefined) {
                    r = true;
                    if (!T.isFunction(i)) {
                        a = true
                    }
                    if (l) {
                        if (a) {
                            t.call(e, i);
                            t = null
                        } else {
                            l = t;
                            t = function (e, t, n) {
                                return l.call(T(e), n)
                            }
                        }
                    }
                    if (t) {
                        for (; s < u; s++) {
                            t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)))
                        }
                    }
                }
                return r ? e : l ? t.call(e) : u ? t(e[0], n) : o
            }, Y = /^(?:checkbox|radio)$/i, K = /<([\w:-]+)/, Z = /^$|\/(?:java|ecma)script/i, ee = /^\s+/,
            te = "abbr|article|aside|audio|bdi|canvas|data|datalist|" + "details|dialog|figcaption|figure|footer|header|hgroup|main|" + "mark|meter|nav|output|picture|progress|section|summary|template|time|video";

        function ne(e) {
            var t = te.split("|"), n = e.createDocumentFragment();
            if (n.createElement) {
                while (t.length) {
                    n.createElement(t.pop())
                }
            }
            return n
        }

        (function () {
            var e = h.createElement("div"), t = h.createDocumentFragment(), n = h.createElement("input");
            e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
            v.leadingWhitespace = e.firstChild.nodeType === 3;
            v.tbody = !e.getElementsByTagName("tbody").length;
            v.htmlSerialize = !!e.getElementsByTagName("link").length;
            v.html5Clone = h.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";
            n.type = "checkbox";
            n.checked = true;
            t.appendChild(n);
            v.appendChecked = n.checked;
            e.innerHTML = "<textarea>x</textarea>";
            v.noCloneChecked = !!e.cloneNode(true).lastChild.defaultValue;
            t.appendChild(e);
            n = h.createElement("input");
            n.setAttribute("type", "radio");
            n.setAttribute("checked", "checked");
            n.setAttribute("name", "t");
            e.appendChild(n);
            v.checkClone = e.cloneNode(true).cloneNode(true).lastChild.checked;
            v.noCloneEvent = !!e.addEventListener;
            e[T.expando] = 1;
            v.attributes = !e.getAttribute(T.expando)
        })();
        var ie = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: v.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        };

        function re(e, t) {
            var n, i, r = 0,
                o = typeof e.getElementsByTagName !== "undefined" ? e.getElementsByTagName(t || "*") : typeof e.querySelectorAll !== "undefined" ? e.querySelectorAll(t || "*") : undefined;
            if (!o) {
                for (o = [], n = e.childNodes || e; (i = n[r]) != null; r++) {
                    if (!t || T.nodeName(i, t)) {
                        o.push(i)
                    } else {
                        T.merge(o, re(i, t))
                    }
                }
            }
            return t === undefined || t && T.nodeName(e, t) ? T.merge([e], o) : o
        }

        function oe(e, t) {
            var n, i = 0;
            for (; (n = e[i]) != null; i++) {
                T._data(n, "globalEval", !t || T._data(t[i], "globalEval"))
            }
        }

        ie.optgroup = ie.option, ie.tbody = ie.tfoot = ie.colgroup = ie.caption = ie.thead, ie.th = ie.td;
        var ae = /<|&#?\w+;/, se = /<tbody/i;

        function ue(e) {
            if (Y.test(e.type)) {
                e.defaultChecked = e.checked
            }
        }

        function le(e, t, n, i, r) {
            var o, a, s, u, l, f, c, d = e.length, p = ne(t), h = [], g = 0;
            for (; g < d; g++) {
                a = e[g];
                if (a || a === 0) {
                    if (T.type(a) === "object") {
                        T.merge(h, a.nodeType ? [a] : a)
                    } else if (!ae.test(a)) {
                        h.push(t.createTextNode(a))
                    } else {
                        u = u || p.appendChild(t.createElement("div"));
                        l = (K.exec(a) || ["", ""])[1].toLowerCase();
                        c = ie[l] || ie._default;
                        u.innerHTML = c[1] + T.htmlPrefilter(a) + c[2];
                        o = c[0];
                        while (o--) {
                            u = u.lastChild
                        }
                        if (!v.leadingWhitespace && ee.test(a)) {
                            h.push(t.createTextNode(ee.exec(a)[0]))
                        }
                        if (!v.tbody) {
                            a = l === "table" && !se.test(a) ? u.firstChild : c[1] === "<table>" && !se.test(a) ? u : 0;
                            o = a && a.childNodes.length;
                            while (o--) {
                                if (T.nodeName(f = a.childNodes[o], "tbody") && !f.childNodes.length) {
                                    a.removeChild(f)
                                }
                            }
                        }
                        T.merge(h, u.childNodes);
                        u.textContent = "";
                        while (u.firstChild) {
                            u.removeChild(u.firstChild)
                        }
                        u = p.lastChild
                    }
                }
            }
            if (u) {
                p.removeChild(u)
            }
            if (!v.appendChecked) {
                T.grep(re(h, "input"), ue)
            }
            g = 0;
            while (a = h[g++]) {
                if (i && T.inArray(a, i) > -1) {
                    if (r) {
                        r.push(a)
                    }
                    continue
                }
                s = T.contains(a.ownerDocument, a);
                u = re(p.appendChild(a), "script");
                if (s) {
                    oe(u)
                }
                if (n) {
                    o = 0;
                    while (a = u[o++]) {
                        if (Z.test(a.type || "")) {
                            n.push(a)
                        }
                    }
                }
            }
            u = null;
            return p
        }

        (function () {
            var e, t, n = h.createElement("div");
            for (e in {submit: true, change: true, focusin: true}) {
                t = "on" + e;
                if (!(v[e] = t in C)) {
                    n.setAttribute(t, "t");
                    v[e] = n.attributes[t].expando === false
                }
            }
            n = null
        })();
        var fe = /^(?:input|select|textarea)$/i, ce = /^key/, de = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            pe = /^(?:focusinfocus|focusoutblur)$/, he = /^([^.]*)(?:\.(.+)|)/;

        function ge() {
            return true
        }

        function me() {
            return false
        }

        function ve() {
            try {
                return h.activeElement
            } catch (e) {
            }
        }

        function ye(e, t, n, i, r, o) {
            var a, s;
            if (typeof t === "object") {
                if (typeof n !== "string") {
                    i = i || n;
                    n = undefined
                }
                for (s in t) {
                    ye(e, s, n, i, t[s], o)
                }
                return e
            }
            if (i == null && r == null) {
                r = n;
                i = n = undefined
            } else if (r == null) {
                if (typeof n === "string") {
                    r = i;
                    i = undefined
                } else {
                    r = i;
                    i = n;
                    n = undefined
                }
            }
            if (r === false) {
                r = me
            } else if (!r) {
                return e
            }
            if (o === 1) {
                a = r;
                r = function (e) {
                    T().off(e);
                    return a.apply(this, arguments)
                };
                r.guid = a.guid || (a.guid = T.guid++)
            }
            return e.each(function () {
                T.event.add(this, t, r, i, n)
            })
        }

        if (T.event = {
            global: {},
            add: function (e, t, n, i, r) {
                var o, a, s, u, l, f, c, d, p, h, g, m = T._data(e);
                if (!m) {
                    return
                }
                if (n.handler) {
                    u = n;
                    n = u.handler;
                    r = u.selector
                }
                if (!n.guid) {
                    n.guid = T.guid++
                }
                if (!(a = m.events)) {
                    a = m.events = {}
                }
                if (!(f = m.handle)) {
                    f = m.handle = function (e) {
                        return typeof T !== "undefined" && (!e || T.event.triggered !== e.type) ? T.event.dispatch.apply(f.elem, arguments) : undefined
                    };
                    f.elem = e
                }
                t = (t || "").match(M) || [""];
                s = t.length;
                while (s--) {
                    o = he.exec(t[s]) || [];
                    p = g = o[1];
                    h = (o[2] || "").split(".").sort();
                    if (!p) {
                        continue
                    }
                    l = T.event.special[p] || {};
                    p = (r ? l.delegateType : l.bindType) || p;
                    l = T.event.special[p] || {};
                    c = T.extend({
                        type: p,
                        origType: g,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: r,
                        needsContext: r && T.expr.match.needsContext.test(r),
                        namespace: h.join(".")
                    }, u);
                    if (!(d = a[p])) {
                        d = a[p] = [];
                        d.delegateCount = 0;
                        if (!l.setup || l.setup.call(e, i, h, f) === false) {
                            if (e.addEventListener) {
                                e.addEventListener(p, f, false)
                            } else if (e.attachEvent) {
                                e.attachEvent("on" + p, f)
                            }
                        }
                    }
                    if (l.add) {
                        l.add.call(e, c);
                        if (!c.handler.guid) {
                            c.handler.guid = n.guid
                        }
                    }
                    if (r) {
                        d.splice(d.delegateCount++, 0, c)
                    } else {
                        d.push(c)
                    }
                    T.event.global[p] = true
                }
                e = null
            },
            remove: function (e, t, n, i, r) {
                var o, a, s, u, l, f, c, d, p, h, g, m = T.hasData(e) && T._data(e);
                if (!m || !(f = m.events)) {
                    return
                }
                t = (t || "").match(M) || [""];
                l = t.length;
                while (l--) {
                    s = he.exec(t[l]) || [];
                    p = g = s[1];
                    h = (s[2] || "").split(".").sort();
                    if (!p) {
                        for (p in f) {
                            T.event.remove(e, p + t[l], n, i, true)
                        }
                        continue
                    }
                    c = T.event.special[p] || {};
                    p = (i ? c.delegateType : c.bindType) || p;
                    d = f[p] || [];
                    s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)");
                    u = o = d.length;
                    while (o--) {
                        a = d[o];
                        if ((r || g === a.origType) && (!n || n.guid === a.guid) && (!s || s.test(a.namespace)) && (!i || i === a.selector || i === "**" && a.selector)) {
                            d.splice(o, 1);
                            if (a.selector) {
                                d.delegateCount--
                            }
                            if (c.remove) {
                                c.remove.call(e, a)
                            }
                        }
                    }
                    if (u && !d.length) {
                        if (!c.teardown || c.teardown.call(e, h, m.handle) === false) {
                            T.removeEvent(e, p, m.handle)
                        }
                        delete f[p]
                    }
                }
                if (T.isEmptyObject(f)) {
                    delete m.handle;
                    T._removeData(e, "events")
                }
            },
            trigger: function (e, t, n, i) {
                var r, o, a, s, u, l, f, c = [n || h], d = m.call(e, "type") ? e.type : e,
                    p = m.call(e, "namespace") ? e.namespace.split(".") : [];
                a = l = n = n || h;
                if (n.nodeType === 3 || n.nodeType === 8) {
                    return
                }
                if (pe.test(d + T.event.triggered)) {
                    return
                }
                if (d.indexOf(".") > -1) {
                    p = d.split(".");
                    d = p.shift();
                    p.sort()
                }
                o = d.indexOf(":") < 0 && "on" + d;
                e = e[T.expando] ? e : new T.Event(d, typeof e === "object" && e);
                e.isTrigger = i ? 2 : 3;
                e.namespace = p.join(".");
                e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                e.result = undefined;
                if (!e.target) {
                    e.target = n
                }
                t = t == null ? [e] : T.makeArray(t, [e]);
                u = T.event.special[d] || {};
                if (!i && u.trigger && u.trigger.apply(n, t) === false) {
                    return
                }
                if (!i && !u.noBubble && !T.isWindow(n)) {
                    s = u.delegateType || d;
                    if (!pe.test(s + d)) {
                        a = a.parentNode
                    }
                    for (; a; a = a.parentNode) {
                        c.push(a);
                        l = a
                    }
                    if (l === (n.ownerDocument || h)) {
                        c.push(l.defaultView || l.parentWindow || C)
                    }
                }
                f = 0;
                while ((a = c[f++]) && !e.isPropagationStopped()) {
                    e.type = f > 1 ? s : u.bindType || d;
                    r = (T._data(a, "events") || {})[e.type] && T._data(a, "handle");
                    if (r) {
                        r.apply(a, t)
                    }
                    r = o && a[o];
                    if (r && r.apply && P(a)) {
                        e.result = r.apply(a, t);
                        if (e.result === false) {
                            e.preventDefault()
                        }
                    }
                }
                e.type = d;
                if (!i && !e.isDefaultPrevented()) {
                    if ((!u._default || u._default.apply(c.pop(), t) === false) && P(n)) {
                        if (o && n[d] && !T.isWindow(n)) {
                            l = n[o];
                            if (l) {
                                n[o] = null
                            }
                            T.event.triggered = d;
                            try {
                                n[d]()
                            } catch (e) {
                            }
                            T.event.triggered = undefined;
                            if (l) {
                                n[o] = l
                            }
                        }
                    }
                }
                return e.result
            },
            dispatch: function (e) {
                e = T.event.fix(e);
                var t, n, i, r, o, a = [], s = f.call(arguments), u = (T._data(this, "events") || {})[e.type] || [],
                    l = T.event.special[e.type] || {};
                s[0] = e;
                e.delegateTarget = this;
                if (l.preDispatch && l.preDispatch.call(this, e) === false) {
                    return
                }
                a = T.event.handlers.call(this, e, u);
                t = 0;
                while ((r = a[t++]) && !e.isPropagationStopped()) {
                    e.currentTarget = r.elem;
                    n = 0;
                    while ((o = r.handlers[n++]) && !e.isImmediatePropagationStopped()) {
                        if (!e.rnamespace || e.rnamespace.test(o.namespace)) {
                            e.handleObj = o;
                            e.data = o.data;
                            i = ((T.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, s);
                            if (i !== undefined) {
                                if ((e.result = i) === false) {
                                    e.preventDefault();
                                    e.stopPropagation()
                                }
                            }
                        }
                    }
                }
                if (l.postDispatch) {
                    l.postDispatch.call(this, e)
                }
                return e.result
            },
            handlers: function (e, t) {
                var n, i, r, o, a = [], s = t.delegateCount, u = e.target;
                if (s && u.nodeType && (e.type !== "click" || isNaN(e.button) || e.button < 1)) {
                    for (; u != this; u = u.parentNode || this) {
                        if (u.nodeType === 1 && (u.disabled !== true || e.type !== "click")) {
                            i = [];
                            for (n = 0; n < s; n++) {
                                o = t[n];
                                r = o.selector + " ";
                                if (i[r] === undefined) {
                                    i[r] = o.needsContext ? T(r, this).index(u) > -1 : T.find(r, this, null, [u]).length
                                }
                                if (i[r]) {
                                    i.push(o)
                                }
                            }
                            if (i.length) {
                                a.push({elem: u, handlers: i})
                            }
                        }
                    }
                }
                if (s < t.length) {
                    a.push({elem: this, handlers: t.slice(s)})
                }
                return a
            },
            fix: function (e) {
                if (e[T.expando]) {
                    return e
                }
                var t, n, i, r = e.type, o = e, a = this.fixHooks[r];
                if (!a) {
                    this.fixHooks[r] = a = de.test(r) ? this.mouseHooks : ce.test(r) ? this.keyHooks : {}
                }
                i = a.props ? this.props.concat(a.props) : this.props;
                e = new T.Event(o);
                t = i.length;
                while (t--) {
                    n = i[t];
                    e[n] = o[n]
                }
                if (!e.target) {
                    e.target = o.srcElement || h
                }
                if (e.target.nodeType === 3) {
                    e.target = e.target.parentNode
                }
                e.metaKey = !!e.metaKey;
                return a.filter ? a.filter(e, o) : e
            },
            props: ("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " + "metaKey relatedTarget shiftKey target timeStamp view which").split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "), filter: function (e, t) {
                    if (e.which == null) {
                        e.which = t.charCode != null ? t.charCode : t.keyCode
                    }
                    return e
                }
            },
            mouseHooks: {
                props: ("button buttons clientX clientY fromElement offsetX offsetY " + "pageX pageY screenX screenY toElement").split(" "),
                filter: function (e, t) {
                    var n, i, r, o = t.button, a = t.fromElement;
                    if (e.pageX == null && t.clientX != null) {
                        i = e.target.ownerDocument || h;
                        r = i.documentElement;
                        n = i.body;
                        e.pageX = t.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0);
                        e.pageY = t.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)
                    }
                    if (!e.relatedTarget && a) {
                        e.relatedTarget = a === e.target ? t.toElement : a
                    }
                    if (!e.which && o !== undefined) {
                        e.which = o & 1 ? 1 : o & 2 ? 3 : o & 4 ? 2 : 0
                    }
                    return e
                }
            },
            special: {
                load: {noBubble: true}, focus: {
                    trigger: function () {
                        if (this !== ve() && this.focus) {
                            try {
                                this.focus();
                                return false
                            } catch (e) {
                            }
                        }
                    }, delegateType: "focusin"
                }, blur: {
                    trigger: function () {
                        if (this === ve() && this.blur) {
                            this.blur();
                            return false
                        }
                    }, delegateType: "focusout"
                }, click: {
                    trigger: function () {
                        if (T.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                            this.click();
                            return false
                        }
                    }, _default: function (e) {
                        return T.nodeName(e.target, "a")
                    }
                }, beforeunload: {
                    postDispatch: function (e) {
                        if (e.result !== undefined && e.originalEvent) {
                            e.originalEvent.returnValue = e.result
                        }
                    }
                }
            },
            simulate: function (e, t, n) {
                var i = T.extend(new T.Event, n, {type: e, isSimulated: true});
                T.event.trigger(i, null, t);
                if (i.isDefaultPrevented()) {
                    n.preventDefault()
                }
            }
        }, T.removeEvent = h.removeEventListener ? function (e, t, n) {
            if (e.removeEventListener) {
                e.removeEventListener(t, n)
            }
        } : function (e, t, n) {
            var i = "on" + t;
            if (e.detachEvent) {
                if (typeof e[i] === "undefined") {
                    e[i] = null
                }
                e.detachEvent(i, n)
            }
        }, T.Event = function (e, t) {
            if (!(this instanceof T.Event)) {
                return new T.Event(e, t)
            }
            if (e && e.type) {
                this.originalEvent = e;
                this.type = e.type;
                this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && e.returnValue === false ? ge : me
            } else {
                this.type = e
            }
            if (t) {
                T.extend(this, t)
            }
            this.timeStamp = e && e.timeStamp || T.now();
            this[T.expando] = true
        }, T.Event.prototype = {
            constructor: T.Event,
            isDefaultPrevented: me,
            isPropagationStopped: me,
            isImmediatePropagationStopped: me,
            preventDefault: function () {
                var e = this.originalEvent;
                this.isDefaultPrevented = ge;
                if (!e) {
                    return
                }
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false
                }
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this.isPropagationStopped = ge;
                if (!e || this.isSimulated) {
                    return
                }
                if (e.stopPropagation) {
                    e.stopPropagation()
                }
                e.cancelBubble = true
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = ge;
                if (e && e.stopImmediatePropagation) {
                    e.stopImmediatePropagation()
                }
                this.stopPropagation()
            }
        }, T.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function (e, o) {
            T.event.special[e] = {
                delegateType: o, bindType: o, handle: function (e) {
                    var t, n = this, i = e.relatedTarget, r = e.handleObj;
                    if (!i || i !== n && !T.contains(n, i)) {
                        e.type = r.origType;
                        t = r.handler.apply(this, arguments);
                        e.type = o
                    }
                    return t
                }
            }
        }), !v.submit) {
            T.event.special.submit = {
                setup: function () {
                    if (T.nodeName(this, "form")) {
                        return false
                    }
                    T.event.add(this, "click._submit keypress._submit", function (e) {
                        var t = e.target,
                            n = T.nodeName(t, "input") || T.nodeName(t, "button") ? T.prop(t, "form") : undefined;
                        if (n && !T._data(n, "submit")) {
                            T.event.add(n, "submit._submit", function (e) {
                                e._submitBubble = true
                            });
                            T._data(n, "submit", true)
                        }
                    })
                }, postDispatch: function (e) {
                    if (e._submitBubble) {
                        delete e._submitBubble;
                        if (this.parentNode && !e.isTrigger) {
                            T.event.simulate("submit", this.parentNode, e)
                        }
                    }
                }, teardown: function () {
                    if (T.nodeName(this, "form")) {
                        return false
                    }
                    T.event.remove(this, "._submit")
                }
            }
        }
        if (!v.change) {
            T.event.special.change = {
                setup: function () {
                    if (fe.test(this.nodeName)) {
                        if (this.type === "checkbox" || this.type === "radio") {
                            T.event.add(this, "propertychange._change", function (e) {
                                if (e.originalEvent.propertyName === "checked") {
                                    this._justChanged = true
                                }
                            });
                            T.event.add(this, "click._change", function (e) {
                                if (this._justChanged && !e.isTrigger) {
                                    this._justChanged = false
                                }
                                T.event.simulate("change", this, e)
                            })
                        }
                        return false
                    }
                    T.event.add(this, "beforeactivate._change", function (e) {
                        var t = e.target;
                        if (fe.test(t.nodeName) && !T._data(t, "change")) {
                            T.event.add(t, "change._change", function (e) {
                                if (this.parentNode && !e.isSimulated && !e.isTrigger) {
                                    T.event.simulate("change", this.parentNode, e)
                                }
                            });
                            T._data(t, "change", true)
                        }
                    })
                }, handle: function (e) {
                    var t = e.target;
                    if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox") {
                        return e.handleObj.handler.apply(this, arguments)
                    }
                }, teardown: function () {
                    T.event.remove(this, "._change");
                    return !fe.test(this.nodeName)
                }
            }
        }
        if (!v.focusin) {
            T.each({focus: "focusin", blur: "focusout"}, function (n, i) {
                var r = function (e) {
                    T.event.simulate(i, e.target, T.event.fix(e))
                };
                T.event.special[i] = {
                    setup: function () {
                        var e = this.ownerDocument || this, t = T._data(e, i);
                        if (!t) {
                            e.addEventListener(n, r, true)
                        }
                        T._data(e, i, (t || 0) + 1)
                    }, teardown: function () {
                        var e = this.ownerDocument || this, t = T._data(e, i) - 1;
                        if (!t) {
                            e.removeEventListener(n, r, true);
                            T._removeData(e, i)
                        } else {
                            T._data(e, i, t)
                        }
                    }
                }
            })
        }
        T.fn.extend({
            on: function (e, t, n, i) {
                return ye(this, e, t, n, i)
            }, one: function (e, t, n, i) {
                return ye(this, e, t, n, i, 1)
            }, off: function (e, t, n) {
                var i, r;
                if (e && e.preventDefault && e.handleObj) {
                    i = e.handleObj;
                    T(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler);
                    return this
                }
                if (typeof e === "object") {
                    for (r in e) {
                        this.off(r, t, e[r])
                    }
                    return this
                }
                if (t === false || typeof t === "function") {
                    n = t;
                    t = undefined
                }
                if (n === false) {
                    n = me
                }
                return this.each(function () {
                    T.event.remove(this, e, n, t)
                })
            }, trigger: function (e, t) {
                return this.each(function () {
                    T.event.trigger(e, t, this)
                })
            }, triggerHandler: function (e, t) {
                var n = this[0];
                if (n) {
                    return T.event.trigger(e, t, n, true)
                }
            }
        });
        var xe = / jQuery\d+="(?:null|\d+)"/g, be = new RegExp("<(?:" + te + ")[\\s/>]", "i"),
            we = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
            Ee = /<script|<style|<link/i, Ce = /checked\s*(?:[^=]|=\s*.checked.)/i, Te = /^true\/(.*)/,
            Se = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, _e, ke = ne(h).appendChild(h.createElement("div"));

        function Ae(e, t) {
            return T.nodeName(e, "table") && T.nodeName(t.nodeType !== 11 ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
        }

        function De(e) {
            e.type = (T.find.attr(e, "type") !== null) + "/" + e.type;
            return e
        }

        function Ne(e) {
            var t = Te.exec(e.type);
            if (t) {
                e.type = t[1]
            } else {
                e.removeAttribute("type")
            }
            return e
        }

        function Le(e, t) {
            if (t.nodeType !== 1 || !T.hasData(e)) {
                return
            }
            var n, i, r, o = T._data(e), a = T._data(t, o), s = o.events;
            if (s) {
                delete a.handle;
                a.events = {};
                for (n in s) {
                    for (i = 0, r = s[n].length; i < r; i++) {
                        T.event.add(t, n, s[n][i])
                    }
                }
            }
            if (a.data) {
                a.data = T.extend({}, a.data)
            }
        }

        function Me(e, t) {
            var n, i, r;
            if (t.nodeType !== 1) {
                return
            }
            n = t.nodeName.toLowerCase();
            if (!v.noCloneEvent && t[T.expando]) {
                r = T._data(t);
                for (i in r.events) {
                    T.removeEvent(t, i, r.handle)
                }
                t.removeAttribute(T.expando)
            }
            if (n === "script" && t.text !== e.text) {
                De(t).text = e.text;
                Ne(t)
            } else if (n === "object") {
                if (t.parentNode) {
                    t.outerHTML = e.outerHTML
                }
                if (v.html5Clone && (e.innerHTML && !T.trim(t.innerHTML))) {
                    t.innerHTML = e.innerHTML
                }
            } else if (n === "input" && Y.test(e.type)) {
                t.defaultChecked = t.checked = e.checked;
                if (t.value !== e.value) {
                    t.value = e.value
                }
            } else if (n === "option") {
                t.defaultSelected = t.selected = e.defaultSelected
            } else if (n === "input" || n === "textarea") {
                t.defaultValue = e.defaultValue
            }
        }

        function qe(n, i, r, o) {
            i = g.apply([], i);
            var e, t, a, s, u, l, f = 0, c = n.length, d = c - 1, p = i[0], h = T.isFunction(p);
            if (h || c > 1 && typeof p === "string" && !v.checkClone && Ce.test(p)) {
                return n.each(function (e) {
                    var t = n.eq(e);
                    if (h) {
                        i[0] = p.call(this, e, t.html())
                    }
                    qe(t, i, r, o)
                })
            }
            if (c) {
                l = le(i, n[0].ownerDocument, false, n, o);
                e = l.firstChild;
                if (l.childNodes.length === 1) {
                    l = e
                }
                if (e || o) {
                    s = T.map(re(l, "script"), De);
                    a = s.length;
                    for (; f < c; f++) {
                        t = l;
                        if (f !== d) {
                            t = T.clone(t, true, true);
                            if (a) {
                                T.merge(s, re(t, "script"))
                            }
                        }
                        r.call(n[f], t, f)
                    }
                    if (a) {
                        u = s[s.length - 1].ownerDocument;
                        T.map(s, Ne);
                        for (f = 0; f < a; f++) {
                            t = s[f];
                            if (Z.test(t.type || "") && !T._data(t, "globalEval") && T.contains(u, t)) {
                                if (t.src) {
                                    if (T._evalUrl) {
                                        T._evalUrl(t.src)
                                    }
                                } else {
                                    T.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Se, ""))
                                }
                            }
                        }
                    }
                    l = e = null
                }
            }
            return n
        }

        function Oe(e, t, n) {
            var i, r = t ? T.filter(t, e) : e, o = 0;
            for (; (i = r[o]) != null; o++) {
                if (!n && i.nodeType === 1) {
                    T.cleanData(re(i))
                }
                if (i.parentNode) {
                    if (n && T.contains(i.ownerDocument, i)) {
                        oe(re(i, "script"))
                    }
                    i.parentNode.removeChild(i)
                }
            }
            return e
        }

        T.extend({
            htmlPrefilter: function (e) {
                return e.replace(we, "<$1></$2>")
            }, clone: function (e, t, n) {
                var i, r, o, a, s, u = T.contains(e.ownerDocument, e);
                if (v.html5Clone || T.isXMLDoc(e) || !be.test("<" + e.nodeName + ">")) {
                    o = e.cloneNode(true)
                } else {
                    ke.innerHTML = e.outerHTML;
                    ke.removeChild(o = ke.firstChild)
                }
                if ((!v.noCloneEvent || !v.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !T.isXMLDoc(e)) {
                    i = re(o);
                    s = re(e);
                    for (a = 0; (r = s[a]) != null; ++a) {
                        if (i[a]) {
                            Me(r, i[a])
                        }
                    }
                }
                if (t) {
                    if (n) {
                        s = s || re(e);
                        i = i || re(o);
                        for (a = 0; (r = s[a]) != null; a++) {
                            Le(r, i[a])
                        }
                    } else {
                        Le(e, o)
                    }
                }
                i = re(o, "script");
                if (i.length > 0) {
                    oe(i, !u && re(e, "script"))
                }
                i = s = r = null;
                return o
            }, cleanData: function (e, t) {
                var n, i, r, o, a = 0, s = T.expando, u = T.cache, l = v.attributes, f = T.event.special;
                for (; (n = e[a]) != null; a++) {
                    if (t || P(n)) {
                        r = n[s];
                        o = r && u[r];
                        if (o) {
                            if (o.events) {
                                for (i in o.events) {
                                    if (f[i]) {
                                        T.event.remove(n, i)
                                    } else {
                                        T.removeEvent(n, i, o.handle)
                                    }
                                }
                            }
                            if (u[r]) {
                                delete u[r];
                                if (!l && typeof n.removeAttribute !== "undefined") {
                                    n.removeAttribute(s)
                                } else {
                                    n[s] = undefined
                                }
                                c.push(r)
                            }
                        }
                    }
                }
            }
        }), T.fn.extend({
            domManip: qe, detach: function (e) {
                return Oe(this, e, true)
            }, remove: function (e) {
                return Oe(this, e)
            }, text: function (e) {
                return V(this, function (e) {
                    return e === undefined ? T.text(this) : this.empty().append((this[0] && this[0].ownerDocument || h).createTextNode(e))
                }, null, e, arguments.length)
            }, append: function () {
                return qe(this, arguments, function (e) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var t = Ae(this, e);
                        t.appendChild(e)
                    }
                })
            }, prepend: function () {
                return qe(this, arguments, function (e) {
                    if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                        var t = Ae(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            }, before: function () {
                return qe(this, arguments, function (e) {
                    if (this.parentNode) {
                        this.parentNode.insertBefore(e, this)
                    }
                })
            }, after: function () {
                return qe(this, arguments, function (e) {
                    if (this.parentNode) {
                        this.parentNode.insertBefore(e, this.nextSibling)
                    }
                })
            }, empty: function () {
                var e, t = 0;
                for (; (e = this[t]) != null; t++) {
                    if (e.nodeType === 1) {
                        T.cleanData(re(e, false))
                    }
                    while (e.firstChild) {
                        e.removeChild(e.firstChild)
                    }
                    if (e.options && T.nodeName(e, "select")) {
                        e.options.length = 0
                    }
                }
                return this
            }, clone: function (e, t) {
                e = e == null ? false : e;
                t = t == null ? e : t;
                return this.map(function () {
                    return T.clone(this, e, t)
                })
            }, html: function (e) {
                return V(this, function (e) {
                    var t = this[0] || {}, n = 0, i = this.length;
                    if (e === undefined) {
                        return t.nodeType === 1 ? t.innerHTML.replace(xe, "") : undefined
                    }
                    if (typeof e === "string" && !Ee.test(e) && (v.htmlSerialize || !be.test(e)) && (v.leadingWhitespace || !ee.test(e)) && !ie[(K.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = T.htmlPrefilter(e);
                        try {
                            for (; n < i; n++) {
                                t = this[n] || {};
                                if (t.nodeType === 1) {
                                    T.cleanData(re(t, false));
                                    t.innerHTML = e
                                }
                            }
                            t = 0
                        } catch (e) {
                        }
                    }
                    if (t) {
                        this.empty().append(e)
                    }
                }, null, e, arguments.length)
            }, replaceWith: function () {
                var n = [];
                return qe(this, arguments, function (e) {
                    var t = this.parentNode;
                    if (T.inArray(this, n) < 0) {
                        T.cleanData(re(this));
                        if (t) {
                            t.replaceChild(e, this)
                        }
                    }
                }, n)
            }
        }), T.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function (e, a) {
            T.fn[e] = function (e) {
                var t, n = 0, i = [], r = T(e), o = r.length - 1;
                for (; n <= o; n++) {
                    t = n === o ? this : this.clone(true);
                    T(r[n])[a](t);
                    s.apply(i, t.get())
                }
                return this.pushStack(i)
            }
        });
        var je, Re = {HTML: "block", BODY: "block"};

        function Be(e, t) {
            var n = T(t.createElement(e)).appendTo(t.body), i = T.css(n[0], "display");
            n.detach();
            return i
        }

        function Pe(e) {
            var t = h, n = Re[e];
            if (!n) {
                n = Be(e, t);
                if (n === "none" || !n) {
                    je = (je || T("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement);
                    t = (je[0].contentWindow || je[0].contentDocument).document;
                    t.write();
                    t.close();
                    n = Be(e, t);
                    je.detach()
                }
                Re[e] = n
            }
            return n
        }

        var He = /^margin/, Ie = new RegExp("^(" + U + ")(?!px)[a-z%]+$", "i"), Fe = function (e, t, n, i) {
            var r, o, a = {};
            for (o in t) {
                a[o] = e.style[o];
                e.style[o] = t[o]
            }
            r = n.apply(e, i || []);
            for (o in t) {
                e.style[o] = a[o]
            }
            return r
        }, $e = h.documentElement;
        (function () {
            var i, r, o, a, s, u, l = h.createElement("div"), f = h.createElement("div");
            if (!f.style) {
                return
            }
            f.style.cssText = "float:left;opacity:.5";
            v.opacity = f.style.opacity === "0.5";
            v.cssFloat = !!f.style.cssFloat;
            f.style.backgroundClip = "content-box";
            f.cloneNode(true).style.backgroundClip = "";
            v.clearCloneStyle = f.style.backgroundClip === "content-box";
            l = h.createElement("div");
            l.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" + "padding:0;margin-top:1px;position:absolute";
            f.innerHTML = "";
            l.appendChild(f);
            v.boxSizing = f.style.boxSizing === "" || f.style.MozBoxSizing === "" || f.style.WebkitBoxSizing === "";
            T.extend(v, {
                reliableHiddenOffsets: function () {
                    if (i == null) {
                        e()
                    }
                    return a
                }, boxSizingReliable: function () {
                    if (i == null) {
                        e()
                    }
                    return o
                }, pixelMarginRight: function () {
                    if (i == null) {
                        e()
                    }
                    return r
                }, pixelPosition: function () {
                    if (i == null) {
                        e()
                    }
                    return i
                }, reliableMarginRight: function () {
                    if (i == null) {
                        e()
                    }
                    return s
                }, reliableMarginLeft: function () {
                    if (i == null) {
                        e()
                    }
                    return u
                }
            });

            function e() {
                var e, t, n = h.documentElement;
                n.appendChild(l);
                f.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;" + "position:relative;display:block;" + "margin:auto;border:1px;padding:1px;" + "top:1%;width:50%";
                i = o = u = false;
                r = s = true;
                if (C.getComputedStyle) {
                    t = C.getComputedStyle(f);
                    i = (t || {}).top !== "1%";
                    u = (t || {}).marginLeft === "2px";
                    o = (t || {width: "4px"}).width === "4px";
                    f.style.marginRight = "50%";
                    r = (t || {marginRight: "4px"}).marginRight === "4px";
                    e = f.appendChild(h.createElement("div"));
                    e.style.cssText = f.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
                    e.style.marginRight = e.style.width = "0";
                    f.style.width = "1px";
                    s = !parseFloat((C.getComputedStyle(e) || {}).marginRight);
                    f.removeChild(e)
                }
                f.style.display = "none";
                a = f.getClientRects().length === 0;
                if (a) {
                    f.style.display = "";
                    f.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
                    f.childNodes[0].style.borderCollapse = "separate";
                    e = f.getElementsByTagName("td");
                    e[0].style.cssText = "margin:0;border:0;padding:0;display:none";
                    a = e[0].offsetHeight === 0;
                    if (a) {
                        e[0].style.display = "";
                        e[1].style.display = "none";
                        a = e[0].offsetHeight === 0
                    }
                }
                n.removeChild(l)
            }
        })();
        var We, Je, Ue = /^(top|right|bottom|left)$/;
        if (C.getComputedStyle) {
            We = function (e) {
                var t = e.ownerDocument.defaultView;
                if (!t || !t.opener) {
                    t = C
                }
                return t.getComputedStyle(e)
            };
            Je = function (e, t, n) {
                var i, r, o, a, s = e.style;
                n = n || We(e);
                a = n ? n.getPropertyValue(t) || n[t] : undefined;
                if ((a === "" || a === undefined) && !T.contains(e.ownerDocument, e)) {
                    a = T.style(e, t)
                }
                if (n) {
                    if (!v.pixelMarginRight() && Ie.test(a) && He.test(t)) {
                        i = s.width;
                        r = s.minWidth;
                        o = s.maxWidth;
                        s.minWidth = s.maxWidth = s.width = a;
                        a = n.width;
                        s.width = i;
                        s.minWidth = r;
                        s.maxWidth = o
                    }
                }
                return a === undefined ? a : a + ""
            }
        } else if ($e.currentStyle) {
            We = function (e) {
                return e.currentStyle
            };
            Je = function (e, t, n) {
                var i, r, o, a, s = e.style;
                n = n || We(e);
                a = n ? n[t] : undefined;
                if (a == null && s && s[t]) {
                    a = s[t]
                }
                if (Ie.test(a) && !Ue.test(t)) {
                    i = s.left;
                    r = e.runtimeStyle;
                    o = r && r.left;
                    if (o) {
                        r.left = e.currentStyle.left
                    }
                    s.left = t === "fontSize" ? "1em" : a;
                    a = s.pixelLeft + "px";
                    s.left = i;
                    if (o) {
                        r.left = o
                    }
                }
                return a === undefined ? a : a + "" || "auto"
            }
        }

        function ze(e, t) {
            return {
                get: function () {
                    if (e()) {
                        delete this.get;
                        return
                    }
                    return (this.get = t).apply(this, arguments)
                }
            }
        }

        var Xe = /alpha\([^)]*\)/i, Qe = /opacity\s*=\s*([^)]*)/i, Ge = /^(none|table(?!-c[ea]).+)/,
            Ve = new RegExp("^(" + U + ")(.*)$", "i"),
            Ye = {position: "absolute", visibility: "hidden", display: "block"},
            Ke = {letterSpacing: "0", fontWeight: "400"}, Ze = ["Webkit", "O", "Moz", "ms"],
            et = h.createElement("div").style;

        function tt(e) {
            if (e in et) {
                return e
            }
            var t = e.charAt(0).toUpperCase() + e.slice(1), n = Ze.length;
            while (n--) {
                e = Ze[n] + t;
                if (e in et) {
                    return e
                }
            }
        }

        function nt(e, t) {
            var n, i, r, o = [], a = 0, s = e.length;
            for (; a < s; a++) {
                i = e[a];
                if (!i.style) {
                    continue
                }
                o[a] = T._data(i, "olddisplay");
                n = i.style.display;
                if (t) {
                    if (!o[a] && n === "none") {
                        i.style.display = ""
                    }
                    if (i.style.display === "" && Q(i)) {
                        o[a] = T._data(i, "olddisplay", Pe(i.nodeName))
                    }
                } else {
                    r = Q(i);
                    if (n && n !== "none" || !r) {
                        T._data(i, "olddisplay", r ? n : T.css(i, "display"))
                    }
                }
            }
            for (a = 0; a < s; a++) {
                i = e[a];
                if (!i.style) {
                    continue
                }
                if (!t || i.style.display === "none" || i.style.display === "") {
                    i.style.display = t ? o[a] || "" : "none"
                }
            }
            return e
        }

        function it(e, t, n) {
            var i = Ve.exec(t);
            return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
        }

        function rt(e, t, n, i, r) {
            var o = n === (i ? "border" : "content") ? 4 : t === "width" ? 1 : 0, a = 0;
            for (; o < 4; o += 2) {
                if (n === "margin") {
                    a += T.css(e, n + X[o], true, r)
                }
                if (i) {
                    if (n === "content") {
                        a -= T.css(e, "padding" + X[o], true, r)
                    }
                    if (n !== "margin") {
                        a -= T.css(e, "border" + X[o] + "Width", true, r)
                    }
                } else {
                    a += T.css(e, "padding" + X[o], true, r);
                    if (n !== "padding") {
                        a += T.css(e, "border" + X[o] + "Width", true, r)
                    }
                }
            }
            return a
        }

        function ot(e, t, n) {
            var i = true, r = t === "width" ? e.offsetWidth : e.offsetHeight, o = We(e),
                a = v.boxSizing && T.css(e, "boxSizing", false, o) === "border-box";
            if (r <= 0 || r == null) {
                r = Je(e, t, o);
                if (r < 0 || r == null) {
                    r = e.style[t]
                }
                if (Ie.test(r)) {
                    return r
                }
                i = a && (v.boxSizingReliable() || r === e.style[t]);
                r = parseFloat(r) || 0
            }
            return r + rt(e, t, n || (a ? "border" : "content"), i, o) + "px"
        }

        if (T.extend({
            cssHooks: {
                opacity: {
                    get: function (e, t) {
                        if (t) {
                            var n = Je(e, "opacity");
                            return n === "" ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: true,
                columnCount: true,
                fillOpacity: true,
                flexGrow: true,
                flexShrink: true,
                fontWeight: true,
                lineHeight: true,
                opacity: true,
                order: true,
                orphans: true,
                widows: true,
                zIndex: true,
                zoom: true
            },
            cssProps: {float: v.cssFloat ? "cssFloat" : "styleFloat"},
            style: function (e, t, n, i) {
                if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
                    return
                }
                var r, o, a, s = T.camelCase(t), u = e.style;
                t = T.cssProps[s] || (T.cssProps[s] = tt(s) || s);
                a = T.cssHooks[t] || T.cssHooks[s];
                if (n !== undefined) {
                    o = typeof n;
                    if (o === "string" && (r = z.exec(n)) && r[1]) {
                        n = G(e, t, r);
                        o = "number"
                    }
                    if (n == null || n !== n) {
                        return
                    }
                    if (o === "number") {
                        n += r && r[3] || (T.cssNumber[s] ? "" : "px")
                    }
                    if (!v.clearCloneStyle && n === "" && t.indexOf("background") === 0) {
                        u[t] = "inherit"
                    }
                    if (!a || !("set" in a) || (n = a.set(e, n, i)) !== undefined) {
                        try {
                            u[t] = n
                        } catch (e) {
                        }
                    }
                } else {
                    if (a && "get" in a && (r = a.get(e, false, i)) !== undefined) {
                        return r
                    }
                    return u[t]
                }
            },
            css: function (e, t, n, i) {
                var r, o, a, s = T.camelCase(t);
                t = T.cssProps[s] || (T.cssProps[s] = tt(s) || s);
                a = T.cssHooks[t] || T.cssHooks[s];
                if (a && "get" in a) {
                    o = a.get(e, true, n)
                }
                if (o === undefined) {
                    o = Je(e, t, i)
                }
                if (o === "normal" && t in Ke) {
                    o = Ke[t]
                }
                if (n === "" || n) {
                    r = parseFloat(o);
                    return n === true || isFinite(r) ? r || 0 : o
                }
                return o
            }
        }), T.each(["height", "width"], function (e, r) {
            T.cssHooks[r] = {
                get: function (e, t, n) {
                    if (t) {
                        return Ge.test(T.css(e, "display")) && e.offsetWidth === 0 ? Fe(e, Ye, function () {
                            return ot(e, r, n)
                        }) : ot(e, r, n)
                    }
                }, set: function (e, t, n) {
                    var i = n && We(e);
                    return it(e, t, n ? rt(e, r, n, v.boxSizing && T.css(e, "boxSizing", false, i) === "border-box", i) : 0)
                }
            }
        }), !v.opacity) {
            T.cssHooks.opacity = {
                get: function (e, t) {
                    return Qe.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
                }, set: function (e, t) {
                    var n = e.style, i = e.currentStyle, r = T.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "",
                        o = i && i.filter || n.filter || "";
                    n.zoom = 1;
                    if ((t >= 1 || t === "") && T.trim(o.replace(Xe, "")) === "" && n.removeAttribute) {
                        n.removeAttribute("filter");
                        if (t === "" || i && !i.filter) {
                            return
                        }
                    }
                    n.filter = Xe.test(o) ? o.replace(Xe, r) : o + " " + r
                }
            }
        }

        function at(e, t, n, i, r) {
            return new at.prototype.init(e, t, n, i, r)
        }

        T.cssHooks.marginRight = ze(v.reliableMarginRight, function (e, t) {
            if (t) {
                return Fe(e, {display: "inline-block"}, Je, [e, "marginRight"])
            }
        }), T.cssHooks.marginLeft = ze(v.reliableMarginLeft, function (e, t) {
            if (t) {
                return (parseFloat(Je(e, "marginLeft")) || (T.contains(e.ownerDocument, e) ? e.getBoundingClientRect().left - Fe(e, {marginLeft: 0}, function () {
                    return e.getBoundingClientRect().left
                }) : 0)) + "px"
            }
        }), T.each({margin: "", padding: "", border: "Width"}, function (r, o) {
            T.cssHooks[r + o] = {
                expand: function (e) {
                    var t = 0, n = {}, i = typeof e === "string" ? e.split(" ") : [e];
                    for (; t < 4; t++) {
                        n[r + X[t] + o] = i[t] || i[t - 2] || i[0]
                    }
                    return n
                }
            };
            if (!He.test(r)) {
                T.cssHooks[r + o].set = it
            }
        }), T.fn.extend({
            css: function (e, t) {
                return V(this, function (e, t, n) {
                    var i, r, o = {}, a = 0;
                    if (T.isArray(t)) {
                        i = We(e);
                        r = t.length;
                        for (; a < r; a++) {
                            o[t[a]] = T.css(e, t[a], false, i)
                        }
                        return o
                    }
                    return n !== undefined ? T.style(e, t, n) : T.css(e, t)
                }, e, t, arguments.length > 1)
            }, show: function () {
                return nt(this, true)
            }, hide: function () {
                return nt(this)
            }, toggle: function (e) {
                if (typeof e === "boolean") {
                    return e ? this.show() : this.hide()
                }
                return this.each(function () {
                    if (Q(this)) {
                        T(this).show()
                    } else {
                        T(this).hide()
                    }
                })
            }
        }), ((T.Tween = at).prototype = {
            constructor: at, init: function (e, t, n, i, r, o) {
                this.elem = e;
                this.prop = n;
                this.easing = r || T.easing._default;
                this.options = t;
                this.start = this.now = this.cur();
                this.end = i;
                this.unit = o || (T.cssNumber[n] ? "" : "px")
            }, cur: function () {
                var e = at.propHooks[this.prop];
                return e && e.get ? e.get(this) : at.propHooks._default.get(this)
            }, run: function (e) {
                var t, n = at.propHooks[this.prop];
                if (this.options.duration) {
                    this.pos = t = T.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration)
                } else {
                    this.pos = t = e
                }
                this.now = (this.end - this.start) * t + this.start;
                if (this.options.step) {
                    this.options.step.call(this.elem, this.now, this)
                }
                if (n && n.set) {
                    n.set(this)
                } else {
                    at.propHooks._default.set(this)
                }
                return this
            }
        }).init.prototype = at.prototype, (at.propHooks = {
            _default: {
                get: function (e) {
                    var t;
                    if (e.elem.nodeType !== 1 || e.elem[e.prop] != null && e.elem.style[e.prop] == null) {
                        return e.elem[e.prop]
                    }
                    t = T.css(e.elem, e.prop, "");
                    return !t || t === "auto" ? 0 : t
                }, set: function (e) {
                    if (T.fx.step[e.prop]) {
                        T.fx.step[e.prop](e)
                    } else if (e.elem.nodeType === 1 && (e.elem.style[T.cssProps[e.prop]] != null || T.cssHooks[e.prop])) {
                        T.style(e.elem, e.prop, e.now + e.unit)
                    } else {
                        e.elem[e.prop] = e.now
                    }
                }
            }
        }).scrollTop = at.propHooks.scrollLeft = {
            set: function (e) {
                if (e.elem.nodeType && e.elem.parentNode) {
                    e.elem[e.prop] = e.now
                }
            }
        }, T.easing = {
            linear: function (e) {
                return e
            }, swing: function (e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }, _default: "swing"
        }, T.fx = at.prototype.init, T.fx.step = {};
        var st, ut, lt = /^(?:toggle|show|hide)$/, ft = /queueHooks$/;

        function ct() {
            C.setTimeout(function () {
                st = undefined
            });
            return st = T.now()
        }

        function dt(e, t) {
            var n, i = {height: e}, r = 0;
            t = t ? 1 : 0;
            for (; r < 4; r += 2 - t) {
                n = X[r];
                i["margin" + n] = i["padding" + n] = e
            }
            if (t) {
                i.opacity = i.width = e
            }
            return i
        }

        function pt(e, t, n) {
            var i, r = (mt.tweeners[t] || []).concat(mt.tweeners["*"]), o = 0, a = r.length;
            for (; o < a; o++) {
                if (i = r[o].call(n, t, e)) {
                    return i
                }
            }
        }

        function ht(t, e, n) {
            var i, r, o, a, s, u, l, f, c = this, d = {}, p = t.style, h = t.nodeType && Q(t), g = T._data(t, "fxshow");
            if (!n.queue) {
                s = T._queueHooks(t, "fx");
                if (s.unqueued == null) {
                    s.unqueued = 0;
                    u = s.empty.fire;
                    s.empty.fire = function () {
                        if (!s.unqueued) {
                            u()
                        }
                    }
                }
                s.unqueued++;
                c.always(function () {
                    c.always(function () {
                        s.unqueued--;
                        if (!T.queue(t, "fx").length) {
                            s.empty.fire()
                        }
                    })
                })
            }
            if (t.nodeType === 1 && ("height" in e || "width" in e)) {
                n.overflow = [p.overflow, p.overflowX, p.overflowY];
                l = T.css(t, "display");
                f = l === "none" ? T._data(t, "olddisplay") || Pe(t.nodeName) : l;
                if (f === "inline" && T.css(t, "float") === "none") {
                    if (!v.inlineBlockNeedsLayout || Pe(t.nodeName) === "inline") {
                        p.display = "inline-block"
                    } else {
                        p.zoom = 1
                    }
                }
            }
            if (n.overflow) {
                p.overflow = "hidden";
                if (!v.shrinkWrapBlocks()) {
                    c.always(function () {
                        p.overflow = n.overflow[0];
                        p.overflowX = n.overflow[1];
                        p.overflowY = n.overflow[2]
                    })
                }
            }
            for (i in e) {
                r = e[i];
                if (lt.exec(r)) {
                    delete e[i];
                    o = o || r === "toggle";
                    if (r === (h ? "hide" : "show")) {
                        if (r === "show" && g && g[i] !== undefined) {
                            h = true
                        } else {
                            continue
                        }
                    }
                    d[i] = g && g[i] || T.style(t, i)
                } else {
                    l = undefined
                }
            }
            if (!T.isEmptyObject(d)) {
                if (g) {
                    if ("hidden" in g) {
                        h = g.hidden
                    }
                } else {
                    g = T._data(t, "fxshow", {})
                }
                if (o) {
                    g.hidden = !h
                }
                if (h) {
                    T(t).show()
                } else {
                    c.done(function () {
                        T(t).hide()
                    })
                }
                c.done(function () {
                    var e;
                    T._removeData(t, "fxshow");
                    for (e in d) {
                        T.style(t, e, d[e])
                    }
                });
                for (i in d) {
                    a = pt(h ? g[i] : 0, i, c);
                    if (!(i in g)) {
                        g[i] = a.start;
                        if (h) {
                            a.end = a.start;
                            a.start = i === "width" || i === "height" ? 1 : 0
                        }
                    }
                }
            } else if ((l === "none" ? Pe(t.nodeName) : l) === "inline") {
                p.display = l
            }
        }

        function gt(e, t) {
            var n, i, r, o, a;
            for (n in e) {
                i = T.camelCase(n);
                r = t[i];
                o = e[n];
                if (T.isArray(o)) {
                    r = o[1];
                    o = e[n] = o[0]
                }
                if (n !== i) {
                    e[i] = o;
                    delete e[n]
                }
                a = T.cssHooks[i];
                if (a && "expand" in a) {
                    o = a.expand(o);
                    delete e[i];
                    for (n in o) {
                        if (!(n in e)) {
                            e[n] = o[n];
                            t[n] = r
                        }
                    }
                } else {
                    t[i] = r
                }
            }
        }

        function mt(a, e, t) {
            var n, s, i = 0, r = mt.prefilters.length, u = T.Deferred().always(function () {
                delete o.elem
            }), o = function () {
                if (s) {
                    return false
                }
                var e = st || ct(), t = Math.max(0, l.startTime + l.duration - e), n = t / l.duration || 0, i = 1 - n,
                    r = 0, o = l.tweens.length;
                for (; r < o; r++) {
                    l.tweens[r].run(i)
                }
                u.notifyWith(a, [l, i, t]);
                if (i < 1 && o) {
                    return t
                } else {
                    u.resolveWith(a, [l]);
                    return false
                }
            }, l = u.promise({
                elem: a,
                props: T.extend({}, e),
                opts: T.extend(true, {specialEasing: {}, easing: T.easing._default}, t),
                originalProperties: e,
                originalOptions: t,
                startTime: st || ct(),
                duration: t.duration,
                tweens: [],
                createTween: function (e, t) {
                    var n = T.Tween(a, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
                    l.tweens.push(n);
                    return n
                },
                stop: function (e) {
                    var t = 0, n = e ? l.tweens.length : 0;
                    if (s) {
                        return this
                    }
                    s = true;
                    for (; t < n; t++) {
                        l.tweens[t].run(1)
                    }
                    if (e) {
                        u.notifyWith(a, [l, 1, 0]);
                        u.resolveWith(a, [l, e])
                    } else {
                        u.rejectWith(a, [l, e])
                    }
                    return this
                }
            }), f = l.props;
            gt(f, l.opts.specialEasing);
            for (; i < r; i++) {
                n = mt.prefilters[i].call(l, a, f, l.opts);
                if (n) {
                    if (T.isFunction(n.stop)) {
                        T._queueHooks(l.elem, l.opts.queue).stop = T.proxy(n.stop, n)
                    }
                    return n
                }
            }
            T.map(f, pt, l);
            if (T.isFunction(l.opts.start)) {
                l.opts.start.call(a, l)
            }
            T.fx.timer(T.extend(o, {elem: a, anim: l, queue: l.opts.queue}));
            return l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
        }

        T.Animation = T.extend(mt, {
            tweeners: {
                "*": [function (e, t) {
                    var n = this.createTween(e, t);
                    G(n.elem, e, z.exec(t), n);
                    return n
                }]
            }, tweener: function (e, t) {
                if (T.isFunction(e)) {
                    t = e;
                    e = ["*"]
                } else {
                    e = e.match(M)
                }
                var n, i = 0, r = e.length;
                for (; i < r; i++) {
                    n = e[i];
                    mt.tweeners[n] = mt.tweeners[n] || [];
                    mt.tweeners[n].unshift(t)
                }
            }, prefilters: [ht], prefilter: function (e, t) {
                if (t) {
                    mt.prefilters.unshift(e)
                } else {
                    mt.prefilters.push(e)
                }
            }
        }), T.speed = function (e, t, n) {
            var i = e && typeof e === "object" ? T.extend({}, e) : {
                complete: n || !n && t || T.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !T.isFunction(t) && t
            };
            i.duration = T.fx.off ? 0 : typeof i.duration === "number" ? i.duration : i.duration in T.fx.speeds ? T.fx.speeds[i.duration] : T.fx.speeds._default;
            if (i.queue == null || i.queue === true) {
                i.queue = "fx"
            }
            i.old = i.complete;
            i.complete = function () {
                if (T.isFunction(i.old)) {
                    i.old.call(this)
                }
                if (i.queue) {
                    T.dequeue(this, i.queue)
                }
            };
            return i
        }, T.fn.extend({
            fadeTo: function (e, t, n, i) {
                return this.filter(Q).css("opacity", 0).show().end().animate({opacity: t}, e, n, i)
            }, animate: function (t, e, n, i) {
                var r = T.isEmptyObject(t), o = T.speed(e, n, i), a = function () {
                    var e = mt(this, T.extend({}, t), o);
                    if (r || T._data(this, "finish")) {
                        e.stop(true)
                    }
                };
                a.finish = a;
                return r || o.queue === false ? this.each(a) : this.queue(o.queue, a)
            }, stop: function (r, e, o) {
                var a = function (e) {
                    var t = e.stop;
                    delete e.stop;
                    t(o)
                };
                if (typeof r !== "string") {
                    o = e;
                    e = r;
                    r = undefined
                }
                if (e && r !== false) {
                    this.queue(r || "fx", [])
                }
                return this.each(function () {
                    var e = true, t = r != null && r + "queueHooks", n = T.timers, i = T._data(this);
                    if (t) {
                        if (i[t] && i[t].stop) {
                            a(i[t])
                        }
                    } else {
                        for (t in i) {
                            if (i[t] && i[t].stop && ft.test(t)) {
                                a(i[t])
                            }
                        }
                    }
                    for (t = n.length; t--;) {
                        if (n[t].elem === this && (r == null || n[t].queue === r)) {
                            n[t].anim.stop(o);
                            e = false;
                            n.splice(t, 1)
                        }
                    }
                    if (e || !o) {
                        T.dequeue(this, r)
                    }
                })
            }, finish: function (a) {
                if (a !== false) {
                    a = a || "fx"
                }
                return this.each(function () {
                    var e, t = T._data(this), n = t[a + "queue"], i = t[a + "queueHooks"], r = T.timers,
                        o = n ? n.length : 0;
                    t.finish = true;
                    T.queue(this, a, []);
                    if (i && i.stop) {
                        i.stop.call(this, true)
                    }
                    for (e = r.length; e--;) {
                        if (r[e].elem === this && r[e].queue === a) {
                            r[e].anim.stop(true);
                            r.splice(e, 1)
                        }
                    }
                    for (e = 0; e < o; e++) {
                        if (n[e] && n[e].finish) {
                            n[e].finish.call(this)
                        }
                    }
                    delete t.finish
                })
            }
        }), T.each(["toggle", "show", "hide"], function (e, i) {
            var r = T.fn[i];
            T.fn[i] = function (e, t, n) {
                return e == null || typeof e === "boolean" ? r.apply(this, arguments) : this.animate(dt(i, true), e, t, n)
            }
        }), T.each({
            slideDown: dt("show"),
            slideUp: dt("hide"),
            slideToggle: dt("toggle"),
            fadeIn: {opacity: "show"},
            fadeOut: {opacity: "hide"},
            fadeToggle: {opacity: "toggle"}
        }, function (e, i) {
            T.fn[e] = function (e, t, n) {
                return this.animate(i, e, t, n)
            }
        }), T.timers = [], T.fx.tick = function () {
            var e, t = T.timers, n = 0;
            st = T.now();
            for (; n < t.length; n++) {
                e = t[n];
                if (!e() && t[n] === e) {
                    t.splice(n--, 1)
                }
            }
            if (!t.length) {
                T.fx.stop()
            }
            st = undefined
        }, T.fx.timer = function (e) {
            T.timers.push(e);
            if (e()) {
                T.fx.start()
            } else {
                T.timers.pop()
            }
        }, T.fx.interval = 13, T.fx.start = function () {
            if (!ut) {
                ut = C.setInterval(T.fx.tick, T.fx.interval)
            }
        }, T.fx.stop = function () {
            C.clearInterval(ut);
            ut = null
        }, T.fx.speeds = {slow: 600, fast: 200, _default: 400}, T.fn.delay = function (i, e) {
            i = T.fx ? T.fx.speeds[i] || i : i;
            e = e || "fx";
            return this.queue(e, function (e, t) {
                var n = C.setTimeout(e, i);
                t.stop = function () {
                    C.clearTimeout(n)
                }
            })
        }, function () {
            var e, t = h.createElement("input"), n = h.createElement("div"), i = h.createElement("select"),
                r = i.appendChild(h.createElement("option"));
            n = h.createElement("div");
            n.setAttribute("className", "t");
            n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
            e = n.getElementsByTagName("a")[0];
            t.setAttribute("type", "checkbox");
            n.appendChild(t);
            e = n.getElementsByTagName("a")[0];
            e.style.cssText = "top:1px";
            v.getSetAttribute = n.className !== "t";
            v.style = /top/.test(e.getAttribute("style"));
            v.hrefNormalized = e.getAttribute("href") === "/a";
            v.checkOn = !!t.value;
            v.optSelected = r.selected;
            v.enctype = !!h.createElement("form").enctype;
            i.disabled = true;
            v.optDisabled = !r.disabled;
            t = h.createElement("input");
            t.setAttribute("value", "");
            v.input = t.getAttribute("value") === "";
            t.value = "t";
            t.setAttribute("type", "radio");
            v.radioValue = t.value === "t"
        }();
        var vt = /\r/g, yt = /[\x20\t\r\n\f]+/g;
        T.fn.extend({
            val: function (n) {
                var i, e, r, t = this[0];
                if (!arguments.length) {
                    if (t) {
                        i = T.valHooks[t.type] || T.valHooks[t.nodeName.toLowerCase()];
                        if (i && "get" in i && (e = i.get(t, "value")) !== undefined) {
                            return e
                        }
                        e = t.value;
                        return typeof e === "string" ? e.replace(vt, "") : e == null ? "" : e
                    }
                    return
                }
                r = T.isFunction(n);
                return this.each(function (e) {
                    var t;
                    if (this.nodeType !== 1) {
                        return
                    }
                    if (r) {
                        t = n.call(this, e, T(this).val())
                    } else {
                        t = n
                    }
                    if (t == null) {
                        t = ""
                    } else if (typeof t === "number") {
                        t += ""
                    } else if (T.isArray(t)) {
                        t = T.map(t, function (e) {
                            return e == null ? "" : e + ""
                        })
                    }
                    i = T.valHooks[this.type] || T.valHooks[this.nodeName.toLowerCase()];
                    if (!i || !("set" in i) || i.set(this, t, "value") === undefined) {
                        this.value = t
                    }
                })
            }
        }), T.extend({
            valHooks: {
                option: {
                    get: function (e) {
                        var t = T.find.attr(e, "value");
                        return t != null ? t : T.trim(T.text(e)).replace(yt, " ")
                    }
                }, select: {
                    get: function (e) {
                        var t, n, i = e.options, r = e.selectedIndex, o = e.type === "select-one" || r < 0,
                            a = o ? null : [], s = o ? r + 1 : i.length, u = r < 0 ? s : o ? r : 0;
                        for (; u < s; u++) {
                            n = i[u];
                            if ((n.selected || u === r) && (v.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !T.nodeName(n.parentNode, "optgroup"))) {
                                t = T(n).val();
                                if (o) {
                                    return t
                                }
                                a.push(t)
                            }
                        }
                        return a
                    }, set: function (e, t) {
                        var n, i, r = e.options, o = T.makeArray(t), a = r.length;
                        while (a--) {
                            i = r[a];
                            if (T.inArray(T.valHooks.option.get(i), o) > -1) {
                                try {
                                    i.selected = n = true
                                } catch (e) {
                                    i.scrollHeight
                                }
                            } else {
                                i.selected = false
                            }
                        }
                        if (!n) {
                            e.selectedIndex = -1
                        }
                        return r
                    }
                }
            }
        }), T.each(["radio", "checkbox"], function () {
            T.valHooks[this] = {
                set: function (e, t) {
                    if (T.isArray(t)) {
                        return e.checked = T.inArray(T(e).val(), t) > -1
                    }
                }
            };
            if (!v.checkOn) {
                T.valHooks[this].get = function (e) {
                    return e.getAttribute("value") === null ? "on" : e.value
                }
            }
        });
        var xt, bt, wt = T.expr.attrHandle, Et = /^(?:checked|selected)$/i, Ct = v.getSetAttribute, Tt = v.input;
        if (T.fn.extend({
            attr: function (e, t) {
                return V(this, T.attr, e, t, arguments.length > 1)
            }, removeAttr: function (e) {
                return this.each(function () {
                    T.removeAttr(this, e)
                })
            }
        }), T.extend({
            attr: function (e, t, n) {
                var i, r, o = e.nodeType;
                if (o === 3 || o === 8 || o === 2) {
                    return
                }
                if (typeof e.getAttribute === "undefined") {
                    return T.prop(e, t, n)
                }
                if (o !== 1 || !T.isXMLDoc(e)) {
                    t = t.toLowerCase();
                    r = T.attrHooks[t] || (T.expr.match.bool.test(t) ? bt : xt)
                }
                if (n !== undefined) {
                    if (n === null) {
                        T.removeAttr(e, t);
                        return
                    }
                    if (r && "set" in r && (i = r.set(e, n, t)) !== undefined) {
                        return i
                    }
                    e.setAttribute(t, n + "");
                    return n
                }
                if (r && "get" in r && (i = r.get(e, t)) !== null) {
                    return i
                }
                i = T.find.attr(e, t);
                return i == null ? undefined : i
            }, attrHooks: {
                type: {
                    set: function (e, t) {
                        if (!v.radioValue && t === "radio" && T.nodeName(e, "input")) {
                            var n = e.value;
                            e.setAttribute("type", t);
                            if (n) {
                                e.value = n
                            }
                            return t
                        }
                    }
                }
            }, removeAttr: function (e, t) {
                var n, i, r = 0, o = t && t.match(M);
                if (o && e.nodeType === 1) {
                    while (n = o[r++]) {
                        i = T.propFix[n] || n;
                        if (T.expr.match.bool.test(n)) {
                            if (Tt && Ct || !Et.test(n)) {
                                e[i] = false
                            } else {
                                e[T.camelCase("default-" + n)] = e[i] = false
                            }
                        } else {
                            T.attr(e, n, "")
                        }
                        e.removeAttribute(Ct ? n : i)
                    }
                }
            }
        }), bt = {
            set: function (e, t, n) {
                if (t === false) {
                    T.removeAttr(e, n)
                } else if (Tt && Ct || !Et.test(n)) {
                    e.setAttribute(!Ct && T.propFix[n] || n, n)
                } else {
                    e[T.camelCase("default-" + n)] = e[n] = true
                }
                return n
            }
        }, T.each(T.expr.match.bool.source.match(/\w+/g), function (e, t) {
            var o = wt[t] || T.find.attr;
            if (Tt && Ct || !Et.test(t)) {
                wt[t] = function (e, t, n) {
                    var i, r;
                    if (!n) {
                        r = wt[t];
                        wt[t] = i;
                        i = o(e, t, n) != null ? t.toLowerCase() : null;
                        wt[t] = r
                    }
                    return i
                }
            } else {
                wt[t] = function (e, t, n) {
                    if (!n) {
                        return e[T.camelCase("default-" + t)] ? t.toLowerCase() : null
                    }
                }
            }
        }), !Tt || !Ct) {
            T.attrHooks.value = {
                set: function (e, t, n) {
                    if (T.nodeName(e, "input")) {
                        e.defaultValue = t
                    } else {
                        return xt && xt.set(e, t, n)
                    }
                }
            }
        }
        if (!Ct) {
            xt = {
                set: function (e, t, n) {
                    var i = e.getAttributeNode(n);
                    if (!i) {
                        e.setAttributeNode(i = e.ownerDocument.createAttribute(n))
                    }
                    i.value = t += "";
                    if (n === "value" || t === e.getAttribute(n)) {
                        return t
                    }
                }
            };
            wt.id = wt.name = wt.coords = function (e, t, n) {
                var i;
                if (!n) {
                    return (i = e.getAttributeNode(t)) && i.value !== "" ? i.value : null
                }
            };
            T.valHooks.button = {
                get: function (e, t) {
                    var n = e.getAttributeNode(t);
                    if (n && n.specified) {
                        return n.value
                    }
                }, set: xt.set
            };
            T.attrHooks.contenteditable = {
                set: function (e, t, n) {
                    xt.set(e, t === "" ? false : t, n)
                }
            };
            T.each(["width", "height"], function (e, n) {
                T.attrHooks[n] = {
                    set: function (e, t) {
                        if (t === "") {
                            e.setAttribute(n, "auto");
                            return t
                        }
                    }
                }
            })
        }
        if (!v.style) {
            T.attrHooks.style = {
                get: function (e) {
                    return e.style.cssText || undefined
                }, set: function (e, t) {
                    return e.style.cssText = t + ""
                }
            }
        }
        var St = /^(?:input|select|textarea|button|object)$/i, _t = /^(?:a|area)$/i;
        if (T.fn.extend({
            prop: function (e, t) {
                return V(this, T.prop, e, t, arguments.length > 1)
            }, removeProp: function (e) {
                e = T.propFix[e] || e;
                return this.each(function () {
                    try {
                        this[e] = undefined;
                        delete this[e]
                    } catch (e) {
                    }
                })
            }
        }), T.extend({
            prop: function (e, t, n) {
                var i, r, o = e.nodeType;
                if (o === 3 || o === 8 || o === 2) {
                    return
                }
                if (o !== 1 || !T.isXMLDoc(e)) {
                    t = T.propFix[t] || t;
                    r = T.propHooks[t]
                }
                if (n !== undefined) {
                    if (r && "set" in r && (i = r.set(e, n, t)) !== undefined) {
                        return i
                    }
                    return e[t] = n
                }
                if (r && "get" in r && (i = r.get(e, t)) !== null) {
                    return i
                }
                return e[t]
            }, propHooks: {
                tabIndex: {
                    get: function (e) {
                        var t = T.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : St.test(e.nodeName) || _t.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            }, propFix: {for: "htmlFor", class: "className"}
        }), !v.hrefNormalized) {
            T.each(["href", "src"], function (e, t) {
                T.propHooks[t] = {
                    get: function (e) {
                        return e.getAttribute(t, 4)
                    }
                }
            })
        }
        if (!v.optSelected) {
            T.propHooks.selected = {
                get: function (e) {
                    var t = e.parentNode;
                    if (t) {
                        t.selectedIndex;
                        if (t.parentNode) {
                            t.parentNode.selectedIndex
                        }
                    }
                    return null
                }, set: function (e) {
                    var t = e.parentNode;
                    if (t) {
                        t.selectedIndex;
                        if (t.parentNode) {
                            t.parentNode.selectedIndex
                        }
                    }
                }
            }
        }
        if (T.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
            T.propFix[this.toLowerCase()] = this
        }), !v.enctype) {
            T.propFix.enctype = "encoding"
        }
        var kt = /[\t\r\n\f]/g;

        function At(e) {
            return T.attr(e, "class") || ""
        }

        T.fn.extend({
            addClass: function (t) {
                var e, n, i, r, o, a, s, u = 0;
                if (T.isFunction(t)) {
                    return this.each(function (e) {
                        T(this).addClass(t.call(this, e, At(this)))
                    })
                }
                if (typeof t === "string" && t) {
                    e = t.match(M) || [];
                    while (n = this[u++]) {
                        r = At(n);
                        i = n.nodeType === 1 && (" " + r + " ").replace(kt, " ");
                        if (i) {
                            a = 0;
                            while (o = e[a++]) {
                                if (i.indexOf(" " + o + " ") < 0) {
                                    i += o + " "
                                }
                            }
                            s = T.trim(i);
                            if (r !== s) {
                                T.attr(n, "class", s)
                            }
                        }
                    }
                }
                return this
            }, removeClass: function (t) {
                var e, n, i, r, o, a, s, u = 0;
                if (T.isFunction(t)) {
                    return this.each(function (e) {
                        T(this).removeClass(t.call(this, e, At(this)))
                    })
                }
                if (!arguments.length) {
                    return this.attr("class", "")
                }
                if (typeof t === "string" && t) {
                    e = t.match(M) || [];
                    while (n = this[u++]) {
                        r = At(n);
                        i = n.nodeType === 1 && (" " + r + " ").replace(kt, " ");
                        if (i) {
                            a = 0;
                            while (o = e[a++]) {
                                while (i.indexOf(" " + o + " ") > -1) {
                                    i = i.replace(" " + o + " ", " ")
                                }
                            }
                            s = T.trim(i);
                            if (r !== s) {
                                T.attr(n, "class", s)
                            }
                        }
                    }
                }
                return this
            }, toggleClass: function (r, t) {
                var o = typeof r;
                if (typeof t === "boolean" && o === "string") {
                    return t ? this.addClass(r) : this.removeClass(r)
                }
                if (T.isFunction(r)) {
                    return this.each(function (e) {
                        T(this).toggleClass(r.call(this, e, At(this), t), t)
                    })
                }
                return this.each(function () {
                    var e, t, n, i;
                    if (o === "string") {
                        t = 0;
                        n = T(this);
                        i = r.match(M) || [];
                        while (e = i[t++]) {
                            if (n.hasClass(e)) {
                                n.removeClass(e)
                            } else {
                                n.addClass(e)
                            }
                        }
                    } else if (r === undefined || o === "boolean") {
                        e = At(this);
                        if (e) {
                            T._data(this, "__className__", e)
                        }
                        T.attr(this, "class", e || r === false ? "" : T._data(this, "__className__") || "")
                    }
                })
            }, hasClass: function (e) {
                var t, n, i = 0;
                t = " " + e + " ";
                while (n = this[i++]) {
                    if (n.nodeType === 1 && (" " + At(n) + " ").replace(kt, " ").indexOf(t) > -1) {
                        return true
                    }
                }
                return false
            }
        }), T.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function (e, n) {
            T.fn[n] = function (e, t) {
                return arguments.length > 0 ? this.on(n, null, e, t) : this.trigger(n)
            }
        }), T.fn.extend({
            hover: function (e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        });
        var Dt = C.location, Nt = T.now(), Lt = /\?/,
            Mt = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
        T.parseJSON = function (e) {
            if (C.JSON && C.JSON.parse) {
                return C.JSON.parse(e + "")
            }
            var r, o = null, t = T.trim(e + "");
            return t && !T.trim(t.replace(Mt, function (e, t, n, i) {
                if (r && t) {
                    o = 0
                }
                if (o === 0) {
                    return e
                }
                r = n || t;
                o += !i - !n;
                return ""
            })) ? Function("return " + t)() : T.error("Invalid JSON: " + e)
        }, T.parseXML = function (e) {
            var t, n;
            if (!e || typeof e !== "string") {
                return null
            }
            try {
                if (C.DOMParser) {
                    n = new C.DOMParser;
                    t = n.parseFromString(e, "text/xml")
                } else {
                    t = new C.ActiveXObject("Microsoft.XMLDOM");
                    t.async = "false";
                    t.loadXML(e)
                }
            } catch (e) {
                t = undefined
            }
            if (!t || !t.documentElement || t.getElementsByTagName("parsererror").length) {
                T.error("Invalid XML: " + e)
            }
            return t
        };
        var qt = /#.*$/, Ot = /([?&])_=[^&]*/, jt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Rt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Bt = /^(?:GET|HEAD)$/, Pt = /^\/\//,
            Ht = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, It = {}, Ft = {}, $t = "*/".concat("*"),
            Wt = Dt.href, Jt = Ht.exec(Wt.toLowerCase()) || [];

        function Ut(o) {
            return function (e, t) {
                if (typeof e !== "string") {
                    t = e;
                    e = "*"
                }
                var n, i = 0, r = e.toLowerCase().match(M) || [];
                if (T.isFunction(t)) {
                    while (n = r[i++]) {
                        if (n.charAt(0) === "+") {
                            n = n.slice(1) || "*";
                            (o[n] = o[n] || []).unshift(t)
                        } else {
                            (o[n] = o[n] || []).push(t)
                        }
                    }
                }
            }
        }

        function zt(t, r, o, a) {
            var s = {}, u = t === Ft;

            function l(e) {
                var i;
                s[e] = true;
                T.each(t[e] || [], function (e, t) {
                    var n = t(r, o, a);
                    if (typeof n === "string" && !u && !s[n]) {
                        r.dataTypes.unshift(n);
                        l(n);
                        return false
                    } else if (u) {
                        return !(i = n)
                    }
                });
                return i
            }

            return l(r.dataTypes[0]) || !s["*"] && l("*")
        }

        function Xt(e, t) {
            var n, i, r = T.ajaxSettings.flatOptions || {};
            for (i in t) {
                if (t[i] !== undefined) {
                    (r[i] ? e : n || (n = {}))[i] = t[i]
                }
            }
            if (n) {
                T.extend(true, e, n)
            }
            return e
        }

        function Qt(e, t, n) {
            var i, r, o, a, s = e.contents, u = e.dataTypes;
            while (u[0] === "*") {
                u.shift();
                if (r === undefined) {
                    r = e.mimeType || t.getResponseHeader("Content-Type")
                }
            }
            if (r) {
                for (a in s) {
                    if (s[a] && s[a].test(r)) {
                        u.unshift(a);
                        break
                    }
                }
            }
            if (u[0] in n) {
                o = u[0]
            } else {
                for (a in n) {
                    if (!u[0] || e.converters[a + " " + u[0]]) {
                        o = a;
                        break
                    }
                    if (!i) {
                        i = a
                    }
                }
                o = o || i
            }
            if (o) {
                if (o !== u[0]) {
                    u.unshift(o)
                }
                return n[o]
            }
        }

        function Gt(e, t, n, i) {
            var r, o, a, s, u, l = {}, f = e.dataTypes.slice();
            if (f[1]) {
                for (a in e.converters) {
                    l[a.toLowerCase()] = e.converters[a]
                }
            }
            o = f.shift();
            while (o) {
                if (e.responseFields[o]) {
                    n[e.responseFields[o]] = t
                }
                if (!u && i && e.dataFilter) {
                    t = e.dataFilter(t, e.dataType)
                }
                u = o;
                o = f.shift();
                if (o) {
                    if (o === "*") {
                        o = u
                    } else if (u !== "*" && u !== o) {
                        a = l[u + " " + o] || l["* " + o];
                        if (!a) {
                            for (r in l) {
                                s = r.split(" ");
                                if (s[1] === o) {
                                    a = l[u + " " + s[0]] || l["* " + s[0]];
                                    if (a) {
                                        if (a === true) {
                                            a = l[r]
                                        } else if (l[r] !== true) {
                                            o = s[0];
                                            f.unshift(s[1])
                                        }
                                        break
                                    }
                                }
                            }
                        }
                        if (a !== true) {
                            if (a && e["throws"]) {
                                t = a(t)
                            } else {
                                try {
                                    t = a(t)
                                } catch (e) {
                                    return {state: "parsererror", error: a ? e : "No conversion from " + u + " to " + o}
                                }
                            }
                        }
                    }
                }
            }
            return {state: "success", data: t}
        }

        function Vt(e) {
            return e.style && e.style.display || T.css(e, "display")
        }

        function Yt(e) {
            if (!T.contains(e.ownerDocument || h, e)) {
                return true
            }
            while (e && e.nodeType === 1) {
                if (Vt(e) === "none" || e.type === "hidden") {
                    return true
                }
                e = e.parentNode
            }
            return false
        }

        T.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Wt,
                type: "GET",
                isLocal: Rt.test(Jt[1]),
                global: true,
                processData: true,
                async: true,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": $t,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/},
                responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
                converters: {"* text": String, "text html": true, "text json": T.parseJSON, "text xml": T.parseXML},
                flatOptions: {url: true, context: true}
            },
            ajaxSetup: function (e, t) {
                return t ? Xt(Xt(e, T.ajaxSettings), t) : Xt(T.ajaxSettings, e)
            },
            ajaxPrefilter: Ut(It),
            ajaxTransport: Ut(Ft),
            ajax: function (e, t) {
                if (typeof e === "object") {
                    t = e;
                    e = undefined
                }
                t = t || {};
                var n, i, f, c, d, p, h, r, g = T.ajaxSetup({}, t), m = g.context || g,
                    v = g.context && (m.nodeType || m.jquery) ? T(m) : T.event, y = T.Deferred(),
                    x = T.Callbacks("once memory"), b = g.statusCode || {}, o = {}, a = {}, w = 0, s = "canceled", E = {
                        readyState: 0, getResponseHeader: function (e) {
                            var t;
                            if (w === 2) {
                                if (!r) {
                                    r = {};
                                    while (t = jt.exec(c)) {
                                        r[t[1].toLowerCase()] = t[2]
                                    }
                                }
                                t = r[e.toLowerCase()]
                            }
                            return t == null ? null : t
                        }, getAllResponseHeaders: function () {
                            return w === 2 ? c : null
                        }, setRequestHeader: function (e, t) {
                            var n = e.toLowerCase();
                            if (!w) {
                                e = a[n] = a[n] || e;
                                o[e] = t
                            }
                            return this
                        }, overrideMimeType: function (e) {
                            if (!w) {
                                g.mimeType = e
                            }
                            return this
                        }, statusCode: function (e) {
                            var t;
                            if (e) {
                                if (w < 2) {
                                    for (t in e) {
                                        b[t] = [b[t], e[t]]
                                    }
                                } else {
                                    E.always(e[E.status])
                                }
                            }
                            return this
                        }, abort: function (e) {
                            var t = e || s;
                            if (h) {
                                h.abort(t)
                            }
                            u(0, t);
                            return this
                        }
                    };
                y.promise(E).complete = x.add;
                E.success = E.done;
                E.error = E.fail;
                g.url = ((e || g.url || Wt) + "").replace(qt, "").replace(Pt, Jt[1] + "//");
                g.type = t.method || t.type || g.method || g.type;
                g.dataTypes = T.trim(g.dataType || "*").toLowerCase().match(M) || [""];
                if (g.crossDomain == null) {
                    n = Ht.exec(g.url.toLowerCase());
                    g.crossDomain = !!(n && (n[1] !== Jt[1] || n[2] !== Jt[2] || (n[3] || (n[1] === "http:" ? "80" : "443")) !== (Jt[3] || (Jt[1] === "http:" ? "80" : "443"))))
                }
                if (g.data && g.processData && typeof g.data !== "string") {
                    g.data = T.param(g.data, g.traditional)
                }
                zt(It, g, t, E);
                if (w === 2) {
                    return E
                }
                p = T.event && g.global;
                if (p && T.active++ === 0) {
                    T.event.trigger("ajaxStart")
                }
                g.type = g.type.toUpperCase();
                g.hasContent = !Bt.test(g.type);
                f = g.url;
                if (!g.hasContent) {
                    if (g.data) {
                        f = g.url += (Lt.test(f) ? "&" : "?") + g.data;
                        delete g.data
                    }
                    if (g.cache === false) {
                        g.url = Ot.test(f) ? f.replace(Ot, "$1_=" + Nt++) : f + (Lt.test(f) ? "&" : "?") + "_=" + Nt++
                    }
                }
                if (g.ifModified) {
                    if (T.lastModified[f]) {
                        E.setRequestHeader("If-Modified-Since", T.lastModified[f])
                    }
                    if (T.etag[f]) {
                        E.setRequestHeader("If-None-Match", T.etag[f])
                    }
                }
                if (g.data && g.hasContent && g.contentType !== false || t.contentType) {
                    E.setRequestHeader("Content-Type", g.contentType)
                }
                E.setRequestHeader("Accept", g.dataTypes[0] && g.accepts[g.dataTypes[0]] ? g.accepts[g.dataTypes[0]] + (g.dataTypes[0] !== "*" ? ", " + $t + "; q=0.01" : "") : g.accepts["*"]);
                for (i in g.headers) {
                    E.setRequestHeader(i, g.headers[i])
                }
                if (g.beforeSend && (g.beforeSend.call(m, E, g) === false || w === 2)) {
                    return E.abort()
                }
                s = "abort";
                for (i in {success: 1, error: 1, complete: 1}) {
                    E[i](g[i])
                }
                h = zt(Ft, g, t, E);
                if (!h) {
                    u(-1, "No Transport")
                } else {
                    E.readyState = 1;
                    if (p) {
                        v.trigger("ajaxSend", [E, g])
                    }
                    if (w === 2) {
                        return E
                    }
                    if (g.async && g.timeout > 0) {
                        d = C.setTimeout(function () {
                            E.abort("timeout")
                        }, g.timeout)
                    }
                    try {
                        w = 1;
                        h.send(o, u)
                    } catch (e) {
                        if (w < 2) {
                            u(-1, e)
                        } else {
                            throw e
                        }
                    }
                }

                function u(e, t, n, i) {
                    var r, o, a, s, u, l = t;
                    if (w === 2) {
                        return
                    }
                    w = 2;
                    if (d) {
                        C.clearTimeout(d)
                    }
                    h = undefined;
                    c = i || "";
                    E.readyState = e > 0 ? 4 : 0;
                    r = e >= 200 && e < 300 || e === 304;
                    if (n) {
                        s = Qt(g, E, n)
                    }
                    s = Gt(g, s, E, r);
                    if (r) {
                        if (g.ifModified) {
                            u = E.getResponseHeader("Last-Modified");
                            if (u) {
                                T.lastModified[f] = u
                            }
                            u = E.getResponseHeader("etag");
                            if (u) {
                                T.etag[f] = u
                            }
                        }
                        if (e === 204 || g.type === "HEAD") {
                            l = "nocontent"
                        } else if (e === 304) {
                            l = "notmodified"
                        } else {
                            l = s.state;
                            o = s.data;
                            a = s.error;
                            r = !a
                        }
                    } else {
                        a = l;
                        if (e || !l) {
                            l = "error";
                            if (e < 0) {
                                e = 0
                            }
                        }
                    }
                    E.status = e;
                    E.statusText = (t || l) + "";
                    if (r) {
                        y.resolveWith(m, [o, l, E])
                    } else {
                        y.rejectWith(m, [E, l, a])
                    }
                    E.statusCode(b);
                    b = undefined;
                    if (p) {
                        v.trigger(r ? "ajaxSuccess" : "ajaxError", [E, g, r ? o : a])
                    }
                    x.fireWith(m, [E, l]);
                    if (p) {
                        v.trigger("ajaxComplete", [E, g]);
                        if (!--T.active) {
                            T.event.trigger("ajaxStop")
                        }
                    }
                }

                return E
            },
            getJSON: function (e, t, n) {
                return T.get(e, t, n, "json")
            },
            getScript: function (e, t) {
                return T.get(e, undefined, t, "script")
            }
        }), T.each(["get", "post"], function (e, r) {
            T[r] = function (e, t, n, i) {
                if (T.isFunction(t)) {
                    i = i || n;
                    n = t;
                    t = undefined
                }
                return T.ajax(T.extend({url: e, type: r, dataType: i, data: t, success: n}, T.isPlainObject(e) && e))
            }
        }), T._evalUrl = function (e) {
            return T.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: true,
                async: false,
                global: false,
                throws: true
            })
        }, T.fn.extend({
            wrapAll: function (t) {
                if (T.isFunction(t)) {
                    return this.each(function (e) {
                        T(this).wrapAll(t.call(this, e))
                    })
                }
                if (this[0]) {
                    var e = T(t, this[0].ownerDocument).eq(0).clone(true);
                    if (this[0].parentNode) {
                        e.insertBefore(this[0])
                    }
                    e.map(function () {
                        var e = this;
                        while (e.firstChild && e.firstChild.nodeType === 1) {
                            e = e.firstChild
                        }
                        return e
                    }).append(this)
                }
                return this
            }, wrapInner: function (n) {
                if (T.isFunction(n)) {
                    return this.each(function (e) {
                        T(this).wrapInner(n.call(this, e))
                    })
                }
                return this.each(function () {
                    var e = T(this), t = e.contents();
                    if (t.length) {
                        t.wrapAll(n)
                    } else {
                        e.append(n)
                    }
                })
            }, wrap: function (t) {
                var n = T.isFunction(t);
                return this.each(function (e) {
                    T(this).wrapAll(n ? t.call(this, e) : t)
                })
            }, unwrap: function () {
                return this.parent().each(function () {
                    if (!T.nodeName(this, "body")) {
                        T(this).replaceWith(this.childNodes)
                    }
                }).end()
            }
        }), T.expr.filters.hidden = function (e) {
            return v.reliableHiddenOffsets() ? e.offsetWidth <= 0 && e.offsetHeight <= 0 && !e.getClientRects().length : Yt(e)
        }, T.expr.filters.visible = function (e) {
            return !T.expr.filters.hidden(e)
        };
        var Kt = /%20/g, Zt = /\[\]$/, en = /\r?\n/g, tn = /^(?:submit|button|image|reset|file)$/i,
            nn = /^(?:input|select|textarea|keygen)/i;

        function rn(n, e, i, r) {
            var t;
            if (T.isArray(e)) {
                T.each(e, function (e, t) {
                    if (i || Zt.test(n)) {
                        r(n, t)
                    } else {
                        rn(n + "[" + (typeof t === "object" && t != null ? e : "") + "]", t, i, r)
                    }
                })
            } else if (!i && T.type(e) === "object") {
                for (t in e) {
                    rn(n + "[" + t + "]", e[t], i, r)
                }
            } else {
                r(n, e)
            }
        }

        T.param = function (e, t) {
            var n, i = [], r = function (e, t) {
                t = T.isFunction(t) ? t() : t == null ? "" : t;
                i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
            if (t === undefined) {
                t = T.ajaxSettings && T.ajaxSettings.traditional
            }
            if (T.isArray(e) || e.jquery && !T.isPlainObject(e)) {
                T.each(e, function () {
                    r(this.name, this.value)
                })
            } else {
                for (n in e) {
                    rn(n, e[n], t, r)
                }
            }
            return i.join("&").replace(Kt, "+")
        }, T.fn.extend({
            serialize: function () {
                return T.param(this.serializeArray())
            }, serializeArray: function () {
                return this.map(function () {
                    var e = T.prop(this, "elements");
                    return e ? T.makeArray(e) : this
                }).filter(function () {
                    var e = this.type;
                    return this.name && !T(this).is(":disabled") && nn.test(this.nodeName) && !tn.test(e) && (this.checked || !Y.test(e))
                }).map(function (e, t) {
                    var n = T(this).val();
                    return n == null ? null : T.isArray(n) ? T.map(n, function (e) {
                        return {name: t.name, value: e.replace(en, "\r\n")}
                    }) : {name: t.name, value: n.replace(en, "\r\n")}
                }).get()
            }
        }), T.ajaxSettings.xhr = C.ActiveXObject !== undefined ? function () {
            if (this.isLocal) {
                return ln()
            }
            if (h.documentMode > 8) {
                return un()
            }
            return /^(get|post|head|put|delete|options)$/i.test(this.type) && un() || ln()
        } : un;
        var on = 0, an = {}, sn = T.ajaxSettings.xhr();
        if (C.attachEvent) {
            C.attachEvent("onunload", function () {
                for (var e in an) {
                    an[e](undefined, true)
                }
            })
        }
        if (v.cors = !!sn && "withCredentials" in sn, sn = v.ajax = !!sn) {
            T.ajaxTransport(function (u) {
                if (!u.crossDomain || v.cors) {
                    var l;
                    return {
                        send: function (e, o) {
                            var t, a = u.xhr(), s = ++on;
                            a.open(u.type, u.url, u.async, u.username, u.password);
                            if (u.xhrFields) {
                                for (t in u.xhrFields) {
                                    a[t] = u.xhrFields[t]
                                }
                            }
                            if (u.mimeType && a.overrideMimeType) {
                                a.overrideMimeType(u.mimeType)
                            }
                            if (!u.crossDomain && !e["X-Requested-With"]) {
                                e["X-Requested-With"] = "XMLHttpRequest"
                            }
                            for (t in e) {
                                if (e[t] !== undefined) {
                                    a.setRequestHeader(t, e[t] + "")
                                }
                            }
                            a.send(u.hasContent && u.data || null);
                            l = function (e, t) {
                                var n, i, r;
                                if (l && (t || a.readyState === 4)) {
                                    delete an[s];
                                    l = undefined;
                                    a.onreadystatechange = T.noop;
                                    if (t) {
                                        if (a.readyState !== 4) {
                                            a.abort()
                                        }
                                    } else {
                                        r = {};
                                        n = a.status;
                                        if (typeof a.responseText === "string") {
                                            r.text = a.responseText
                                        }
                                        try {
                                            i = a.statusText
                                        } catch (e) {
                                            i = ""
                                        }
                                        if (!n && u.isLocal && !u.crossDomain) {
                                            n = r.text ? 200 : 404
                                        } else if (n === 1223) {
                                            n = 204
                                        }
                                    }
                                }
                                if (r) {
                                    o(n, i, r, a.getAllResponseHeaders())
                                }
                            };
                            if (!u.async) {
                                l()
                            } else if (a.readyState === 4) {
                                C.setTimeout(l)
                            } else {
                                a.onreadystatechange = an[s] = l
                            }
                        }, abort: function () {
                            if (l) {
                                l(undefined, true)
                            }
                        }
                    }
                }
            })
        }

        function un() {
            try {
                return new C.XMLHttpRequest
            } catch (e) {
            }
        }

        function ln() {
            try {
                return new C.ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {
            }
        }

        T.ajaxSetup({
            accepts: {script: "text/javascript, application/javascript, " + "application/ecmascript, application/x-ecmascript"},
            contents: {script: /\b(?:java|ecma)script\b/},
            converters: {
                "text script": function (e) {
                    T.globalEval(e);
                    return e
                }
            }
        }), T.ajaxPrefilter("script", function (e) {
            if (e.cache === undefined) {
                e.cache = false
            }
            if (e.crossDomain) {
                e.type = "GET";
                e.global = false
            }
        }), T.ajaxTransport("script", function (t) {
            if (t.crossDomain) {
                var i, r = h.head || T("head")[0] || h.documentElement;
                return {
                    send: function (e, n) {
                        i = h.createElement("script");
                        i.async = true;
                        if (t.scriptCharset) {
                            i.charset = t.scriptCharset
                        }
                        i.src = t.url;
                        i.onload = i.onreadystatechange = function (e, t) {
                            if (t || !i.readyState || /loaded|complete/.test(i.readyState)) {
                                i.onload = i.onreadystatechange = null;
                                if (i.parentNode) {
                                    i.parentNode.removeChild(i)
                                }
                                i = null;
                                if (!t) {
                                    n(200, "success")
                                }
                            }
                        };
                        r.insertBefore(i, r.firstChild)
                    }, abort: function () {
                        if (i) {
                            i.onload(undefined, true)
                        }
                    }
                }
            }
        });
        var fn = [], cn = /(=)\?(?=&|$)|\?\?/;
        T.ajaxSetup({
            jsonp: "callback", jsonpCallback: function () {
                var e = fn.pop() || T.expando + "_" + Nt++;
                this[e] = true;
                return e
            }
        }), T.ajaxPrefilter("json jsonp", function (e, t, n) {
            var i, r, o,
                a = e.jsonp !== false && (cn.test(e.url) ? "url" : typeof e.data === "string" && (e.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && cn.test(e.data) && "data");
            if (a || e.dataTypes[0] === "jsonp") {
                i = e.jsonpCallback = T.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback;
                if (a) {
                    e[a] = e[a].replace(cn, "$1" + i)
                } else if (e.jsonp !== false) {
                    e.url += (Lt.test(e.url) ? "&" : "?") + e.jsonp + "=" + i
                }
                e.converters["script json"] = function () {
                    if (!o) {
                        T.error(i + " was not called")
                    }
                    return o[0]
                };
                e.dataTypes[0] = "json";
                r = C[i];
                C[i] = function () {
                    o = arguments
                };
                n.always(function () {
                    if (r === undefined) {
                        T(C).removeProp(i)
                    } else {
                        C[i] = r
                    }
                    if (e[i]) {
                        e.jsonpCallback = t.jsonpCallback;
                        fn.push(i)
                    }
                    if (o && T.isFunction(r)) {
                        r(o[0])
                    }
                    o = r = undefined
                });
                return "script"
            }
        }), T.parseHTML = function (e, t, n) {
            if (!e || typeof e !== "string") {
                return null
            }
            if (typeof t === "boolean") {
                n = t;
                t = false
            }
            t = t || h;
            var i = w.exec(e), r = !n && [];
            if (i) {
                return [t.createElement(i[1])]
            }
            i = le([e], t, r);
            if (r && r.length) {
                T(r).remove()
            }
            return T.merge([], i.childNodes)
        };
        var dn = T.fn.load;

        function pn(e) {
            return T.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : false
        }

        if (T.fn.load = function (e, t, n) {
            if (typeof e !== "string" && dn) {
                return dn.apply(this, arguments)
            }
            var i, r, o, a = this, s = e.indexOf(" ");
            if (s > -1) {
                i = T.trim(e.slice(s, e.length));
                e = e.slice(0, s)
            }
            if (T.isFunction(t)) {
                n = t;
                t = undefined
            } else if (t && typeof t === "object") {
                r = "POST"
            }
            if (a.length > 0) {
                T.ajax({url: e, type: r || "GET", dataType: "html", data: t}).done(function (e) {
                    o = arguments;
                    a.html(i ? T("<div>").append(T.parseHTML(e)).find(i) : e)
                }).always(n && function (e, t) {
                    a.each(function () {
                        n.apply(this, o || [e.responseText, t, e])
                    })
                })
            }
            return this
        }, T.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
            T.fn[t] = function (e) {
                return this.on(t, e)
            }
        }), T.expr.filters.animated = function (t) {
            return T.grep(T.timers, function (e) {
                return t === e.elem
            }).length
        }, T.offset = {
            setOffset: function (e, t, n) {
                var i, r, o, a, s, u, l, f = T.css(e, "position"), c = T(e), d = {};
                if (f === "static") {
                    e.style.position = "relative"
                }
                s = c.offset();
                o = T.css(e, "top");
                u = T.css(e, "left");
                l = (f === "absolute" || f === "fixed") && T.inArray("auto", [o, u]) > -1;
                if (l) {
                    i = c.position();
                    a = i.top;
                    r = i.left
                } else {
                    a = parseFloat(o) || 0;
                    r = parseFloat(u) || 0
                }
                if (T.isFunction(t)) {
                    t = t.call(e, n, T.extend({}, s))
                }
                if (t.top != null) {
                    d.top = t.top - s.top + a
                }
                if (t.left != null) {
                    d.left = t.left - s.left + r
                }
                if ("using" in t) {
                    t.using.call(e, d)
                } else {
                    c.css(d)
                }
            }
        }, T.fn.extend({
            offset: function (t) {
                if (arguments.length) {
                    return t === undefined ? this : this.each(function (e) {
                        T.offset.setOffset(this, t, e)
                    })
                }
                var e, n, i = {top: 0, left: 0}, r = this[0], o = r && r.ownerDocument;
                if (!o) {
                    return
                }
                e = o.documentElement;
                if (!T.contains(e, r)) {
                    return i
                }
                if (typeof r.getBoundingClientRect !== "undefined") {
                    i = r.getBoundingClientRect()
                }
                n = pn(o);
                return {
                    top: i.top + (n.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                    left: i.left + (n.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
                }
            }, position: function () {
                if (!this[0]) {
                    return
                }
                var e, t, n = {top: 0, left: 0}, i = this[0];
                if (T.css(i, "position") === "fixed") {
                    t = i.getBoundingClientRect()
                } else {
                    e = this.offsetParent();
                    t = this.offset();
                    if (!T.nodeName(e[0], "html")) {
                        n = e.offset()
                    }
                    n.top += T.css(e[0], "borderTopWidth", true);
                    n.left += T.css(e[0], "borderLeftWidth", true)
                }
                return {
                    top: t.top - n.top - T.css(i, "marginTop", true),
                    left: t.left - n.left - T.css(i, "marginLeft", true)
                }
            }, offsetParent: function () {
                return this.map(function () {
                    var e = this.offsetParent;
                    while (e && (!T.nodeName(e, "html") && T.css(e, "position") === "static")) {
                        e = e.offsetParent
                    }
                    return e || $e
                })
            }
        }), T.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (t, r) {
            var o = /Y/.test(r);
            T.fn[t] = function (e) {
                return V(this, function (e, t, n) {
                    var i = pn(e);
                    if (n === undefined) {
                        return i ? r in i ? i[r] : i.document.documentElement[t] : e[t]
                    }
                    if (i) {
                        i.scrollTo(!o ? n : T(i).scrollLeft(), o ? n : T(i).scrollTop())
                    } else {
                        e[t] = n
                    }
                }, t, e, arguments.length, null)
            }
        }), T.each(["top", "left"], function (e, n) {
            T.cssHooks[n] = ze(v.pixelPosition, function (e, t) {
                if (t) {
                    t = Je(e, n);
                    return Ie.test(t) ? T(e).position()[n] + "px" : t
                }
            })
        }), T.each({Height: "height", Width: "width"}, function (o, a) {
            T.each({padding: "inner" + o, content: a, "": "outer" + o}, function (i, e) {
                T.fn[e] = function (e, t) {
                    var n = arguments.length && (i || typeof e !== "boolean"),
                        r = i || (e === true || t === true ? "margin" : "border");
                    return V(this, function (e, t, n) {
                        var i;
                        if (T.isWindow(e)) {
                            return e.document.documentElement["client" + o]
                        }
                        if (e.nodeType === 9) {
                            i = e.documentElement;
                            return Math.max(e.body["scroll" + o], i["scroll" + o], e.body["offset" + o], i["offset" + o], i["client" + o])
                        }
                        return n === undefined ? T.css(e, t, r) : T.style(e, t, n, r)
                    }, a, n ? e : undefined, n, null)
                }
            })
        }), T.fn.extend({
            bind: function (e, t, n) {
                return this.on(e, null, t, n)
            }, unbind: function (e, t) {
                return this.off(e, null, t)
            }, delegate: function (e, t, n, i) {
                return this.on(t, e, n, i)
            }, undelegate: function (e, t, n) {
                return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        }), T.fn.size = function () {
            return this.length
        }, T.fn.andSelf = T.fn.addBack, typeof define === "function" && define.amd) {
            define("jquery", [], function () {
                return T
            })
        }
        var hn = C.jQuery, gn = C.$;
        if (T.noConflict = function (e) {
            if (C.$ === T) {
                C.$ = gn
            }
            if (e && C.jQuery === T) {
                C.jQuery = hn
            }
            return T
        }, !e) {
            C.jQuery = C.$ = T
        }
    }(e)
}("undefined" != typeof window ? window : this), window.$ULOG || (window.$ULOG = {}, window.$ULOG.buffer = [], window.$ULOG.send = function (e, t) {
    window.$ULOG.buffer.push([e, t])
});
var getLoginUrl = function () {
    function n(e) {
        try {
            var t = window[e], n = "__storage_test__";
            return t.setItem(n, n), t.removeItem(n), !0
        } catch (e) {
            return e instanceof DOMException && (22 === e.code || 1014 === e.code || "QuotaExceededError" === e.name || "NS_ERROR_DOM_QUOTA_REACHED" === e.name) && 0 !== t.length
        }
    }

    function s(e, t) {
        return String.prototype.split.call(t, e)
    }

    var i = ["qz_gdt", "gdt_vid", "bd_vid"], r = "ad_loginurl", o = "";
    return function (e, t, n) {
        for (var i = s(e, t), r = {}, o = 0; o < i.length; o++) if ("" !== i[o]) {
            var a = s("=", i[o]);
            if (2 !== a.length) {
                r = null;
                break
            }
            r[a[0]] = a[1]
        }
        "function" == typeof n && n(r)
    }("&", window.location.search.substring(1), function (e) {
        for (var t = 0; t < i.length; t++) if (e && e[i[t]]) return o = window.location.href, void (n("sessionStorage") && window.sessionStorage.setItem(r, o));
        n("sessionStorage") && (o = window.sessionStorage.getItem(r) || "")
    }), o
};
getLoginUrl();
var sendExposureDig = function () {
    var e = $("[exposure-event_id]"), t = Array.prototype.slice.call(e), a = $(window).scrollTop(),
        s = document.documentElement.clientHeight;
    t.length && t.forEach(function (e) {
        var t = $(e);
        if (!t.attr("exposure-delay") && !t.attr("exposure") && t.attr("exposure-event_id")) {
            var n = e.getBoundingClientRect().height, i = t.offset().top;
            if (!(a + s < i || n + i <= a)) {
                var r = t.attr("exposure-event_id");
                if (t.attr("exposure-event_action")) {
                    var o = {};
                    t.attr("exposure-event_action").split("&").forEach(function (e) {
                        o[e.split("=")[0]] = e.split("=")[1]
                    }), window.$ULOG.send(r, {action: o})
                } else window.$ULOG.send(r);
                t.attr("exposure", "true")
            }
        }
    })
}, QRCode;
setTimeout(function () {
    $(document.body).on("click", function (e) {
        var t = $(e.target);
        if (t.closest("[data-event_id]").length) {
            var n = t.closest("[data-event_id]"), i = {};
            if (n.attr("data-event_action")) {
                n.attr("data-event_action").split("&").forEach(function (e, t) {
                    i[e.split("=")[0]] = e.split("=")[1]
                });
                var r = getLoginUrl();
                "" !== r && (i.ad_loginurl = r), $ULOG.send(n.attr("data-event_id"), {action: i})
            } else $ULOG.send(n.attr("data-event_id"))
        }
    }), sendExposureDig(), $(window).scroll(function (e) {
        sendExposureDig()
    })
}, 100), function () {
    function n(e) {
        this.mode = o.MODE_8BIT_BYTE, this.data = e, this.parsedData = [];
        for (var t = [], n = 0, i = this.data.length; n < i; n++) {
            var r = this.data.charCodeAt(n);
            65536 < r ? (t[0] = 240 | (1835008 & r) >>> 18, t[1] = 128 | (258048 & r) >>> 12, t[2] = 128 | (4032 & r) >>> 6, t[3] = 128 | 63 & r) : 2048 < r ? (t[0] = 224 | (61440 & r) >>> 12, t[1] = 128 | (4032 & r) >>> 6, t[2] = 128 | 63 & r) : 128 < r ? (t[0] = 192 | (1984 & r) >>> 6, t[1] = 128 | 63 & r) : t[0] = r, this.parsedData = this.parsedData.concat(t)
        }
        this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
    }

    function u(e, t) {
        this.typeNumber = e, this.errorCorrectLevel = t, this.modules = null, this.moduleCount = 0, this.dataCache = null, this.dataList = []
    }

    function v(e, t) {
        if (null == e.length) throw new Error(e.length + "/" + t);
        for (var n = 0; n < e.length && 0 == e[n];) n++;
        this.num = new Array(e.length - n + t);
        for (var i = 0; i < e.length - n; i++) this.num[i] = e[i + n]
    }

    function f(e, t) {
        this.totalCount = e, this.dataCount = t
    }

    function l() {
        this.buffer = [], this.length = 0
    }

    function i() {
        var e = !1, t = navigator.userAgent;
        return /android/i.test(t) && (e = !0, aMat = t.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (e = parseFloat(aMat[1]))), e
    }

    function t(e, t) {
        for (var n = 1, i = (s = e, (u = encodeURI(s).toString().replace(/\%[0-9a-fA-F]{2}/g, "a")).length + (u.length != s ? 3 : 0)), r = 0, o = b.length; r <= o; r++) {
            var a = 0;
            switch (t) {
                case c.L:
                    a = b[r][0];
                    break;
                case c.M:
                    a = b[r][1];
                    break;
                case c.Q:
                    a = b[r][2];
                    break;
                case c.H:
                    a = b[r][3]
            }
            if (i <= a) break;
            n++
        }
        var s, u;
        if (b.length < n) throw new Error("Too long data");
        return n
    }

    n.prototype = {
        getLength: function () {
            return this.parsedData.length
        }, write: function (e) {
            for (var t = 0, n = this.parsedData.length; t < n; t++) e.put(this.parsedData[t], 8)
        }
    }, u.prototype = {
        addData: function (e) {
            var t = new n(e);
            this.dataList.push(t), this.dataCache = null
        }, isDark: function (e, t) {
            if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t) throw new Error(e + "," + t);
            return this.modules[e][t]
        }, getModuleCount: function () {
            return this.moduleCount
        }, make: function () {
            this.makeImpl(!1, this.getBestMaskPattern())
        }, makeImpl: function (e, t) {
            this.moduleCount = 4 * this.typeNumber + 17, this.modules = new Array(this.moduleCount);
            for (var n = 0; n < this.moduleCount; n++) {
                this.modules[n] = new Array(this.moduleCount);
                for (var i = 0; i < this.moduleCount; i++) this.modules[n][i] = null
            }
            this.setupPositionProbePattern(0, 0), this.setupPositionProbePattern(this.moduleCount - 7, 0), this.setupPositionProbePattern(0, this.moduleCount - 7), this.setupPositionAdjustPattern(), this.setupTimingPattern(), this.setupTypeInfo(e, t), 7 <= this.typeNumber && this.setupTypeNumber(e), null == this.dataCache && (this.dataCache = u.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, t)
        }, setupPositionProbePattern: function (e, t) {
            for (var n = -1; n <= 7; n++) if (!(e + n <= -1 || this.moduleCount <= e + n)) for (var i = -1; i <= 7; i++) t + i <= -1 || this.moduleCount <= t + i || (this.modules[e + n][t + i] = 0 <= n && n <= 6 && (0 == i || 6 == i) || 0 <= i && i <= 6 && (0 == n || 6 == n) || 2 <= n && n <= 4 && 2 <= i && i <= 4)
        }, getBestMaskPattern: function () {
            for (var e = 0, t = 0, n = 0; n < 8; n++) {
                this.makeImpl(!0, n);
                var i = y.getLostPoint(this);
                (0 == n || i < e) && (e = i, t = n)
            }
            return t
        }, createMovieClip: function (e, t, n) {
            var i = e.createEmptyMovieClip(t, n);
            this.make();
            for (var r = 0; r < this.modules.length; r++) for (var o = 1 * r, a = 0; a < this.modules[r].length; a++) {
                var s = 1 * a;
                this.modules[r][a] && (i.beginFill(0, 100), i.moveTo(s, o), i.lineTo(1 + s, o), i.lineTo(1 + s, 1 + o), i.lineTo(s, 1 + o), i.endFill())
            }
            return i
        }, setupTimingPattern: function () {
            for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[e][6] && (this.modules[e][6] = 0 == e % 2);
            for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[6][t] && (this.modules[6][t] = 0 == t % 2)
        }, setupPositionAdjustPattern: function () {
            for (var e = y.getPatternPosition(this.typeNumber), t = 0; t < e.length; t++) for (var n = 0; n < e.length; n++) {
                var i = e[t], r = e[n];
                if (null == this.modules[i][r]) for (var o = -2; o <= 2; o++) for (var a = -2; a <= 2; a++) this.modules[i + o][r + a] = -2 == o || 2 == o || -2 == a || 2 == a || 0 == o && 0 == a
            }
        }, setupTypeNumber: function (e) {
            for (var t = y.getBCHTypeNumber(this.typeNumber), n = 0; n < 18; n++) {
                var i = !e && 1 == (1 & t >> n);
                this.modules[Math.floor(n / 3)][n % 3 + this.moduleCount - 8 - 3] = i
            }
            for (n = 0; n < 18; n++) {
                i = !e && 1 == (1 & t >> n);
                this.modules[n % 3 + this.moduleCount - 8 - 3][Math.floor(n / 3)] = i
            }
        }, setupTypeInfo: function (e, t) {
            for (var n = this.errorCorrectLevel << 3 | t, i = y.getBCHTypeInfo(n), r = 0; r < 15; r++) {
                var o = !e && 1 == (1 & i >> r);
                r < 6 ? this.modules[r][8] = o : r < 8 ? this.modules[r + 1][8] = o : this.modules[this.moduleCount - 15 + r][8] = o
            }
            for (r = 0; r < 15; r++) {
                o = !e && 1 == (1 & i >> r);
                r < 8 ? this.modules[8][this.moduleCount - r - 1] = o : r < 9 ? this.modules[8][15 - r - 1 + 1] = o : this.modules[8][15 - r - 1] = o
            }
            this.modules[this.moduleCount - 8][8] = !e
        }, mapData: function (e, t) {
            for (var n = -1, i = this.moduleCount - 1, r = 7, o = 0, a = this.moduleCount - 1; 0 < a; a -= 2) for (6 == a && a--; ;) {
                for (var s = 0; s < 2; s++) if (null == this.modules[i][a - s]) {
                    var u = !1;
                    o < e.length && (u = 1 == (1 & e[o] >>> r)), y.getMask(t, i, a - s) && (u = !u), this.modules[i][a - s] = u, -1 == --r && (o++, r = 7)
                }
                if ((i += n) < 0 || this.moduleCount <= i) {
                    i -= n, n = -n;
                    break
                }
            }
        }
    }, u.PAD0 = 236, u.PAD1 = 17, u.createData = function (e, t, n) {
        for (var i = f.getRSBlocks(e, t), r = new l, o = 0; o < n.length; o++) {
            var a = n[o];
            r.put(a.mode, 4), r.put(a.getLength(), y.getLengthInBits(a.mode, e)), a.write(r)
        }
        var s = 0;
        for (o = 0; o < i.length; o++) s += i[o].dataCount;
        if (r.getLengthInBits() > 8 * s) throw new Error("code length overflow. (" + r.getLengthInBits() + ">" + 8 * s + ")");
        for (r.getLengthInBits() + 4 <= 8 * s && r.put(0, 4); 0 != r.getLengthInBits() % 8;) r.putBit(!1);
        for (; !(r.getLengthInBits() >= 8 * s) && (r.put(u.PAD0, 8), !(r.getLengthInBits() >= 8 * s));) r.put(u.PAD1, 8);
        return u.createBytes(r, i)
    }, u.createBytes = function (e, t) {
        for (var n = 0, i = 0, r = 0, o = new Array(t.length), a = new Array(t.length), s = 0; s < t.length; s++) {
            var u = t[s].dataCount, l = t[s].totalCount - u;
            i = Math.max(i, u), r = Math.max(r, l), o[s] = new Array(u);
            for (var f = 0; f < o[s].length; f++) o[s][f] = 255 & e.buffer[f + n];
            n += u;
            var c = y.getErrorCorrectPolynomial(l), d = new v(o[s], c.getLength() - 1).mod(c);
            a[s] = new Array(c.getLength() - 1);
            for (f = 0; f < a[s].length; f++) {
                var p = f + d.getLength() - a[s].length;
                a[s][f] = 0 <= p ? d.get(p) : 0
            }
        }
        var h = 0;
        for (f = 0; f < t.length; f++) h += t[f].totalCount;
        var g = new Array(h), m = 0;
        for (f = 0; f < i; f++) for (s = 0; s < t.length; s++) f < o[s].length && (g[m++] = o[s][f]);
        for (f = 0; f < r; f++) for (s = 0; s < t.length; s++) f < a[s].length && (g[m++] = a[s][f]);
        return g
    };
    for (var o = {MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8}, c = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    }, r = 0, a = 1, s = 2, d = 3, p = 4, h = 5, g = 6, m = 7, y = {
        PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
        G15: 1335,
        G18: 7973,
        G15_MASK: 21522,
        getBCHTypeInfo: function (e) {
            for (var t = e << 10; 0 <= y.getBCHDigit(t) - y.getBCHDigit(y.G15);) t ^= y.G15 << y.getBCHDigit(t) - y.getBCHDigit(y.G15);
            return (e << 10 | t) ^ y.G15_MASK
        },
        getBCHTypeNumber: function (e) {
            for (var t = e << 12; 0 <= y.getBCHDigit(t) - y.getBCHDigit(y.G18);) t ^= y.G18 << y.getBCHDigit(t) - y.getBCHDigit(y.G18);
            return e << 12 | t
        },
        getBCHDigit: function (e) {
            for (var t = 0; 0 != e;) t++, e >>>= 1;
            return t
        },
        getPatternPosition: function (e) {
            return y.PATTERN_POSITION_TABLE[e - 1]
        },
        getMask: function (e, t, n) {
            switch (e) {
                case r:
                    return 0 == (t + n) % 2;
                case a:
                    return 0 == t % 2;
                case s:
                    return 0 == n % 3;
                case d:
                    return 0 == (t + n) % 3;
                case p:
                    return 0 == (Math.floor(t / 2) + Math.floor(n / 3)) % 2;
                case h:
                    return 0 == t * n % 2 + t * n % 3;
                case g:
                    return 0 == (t * n % 2 + t * n % 3) % 2;
                case m:
                    return 0 == (t * n % 3 + (t + n) % 2) % 2;
                default:
                    throw new Error("bad maskPattern:" + e)
            }
        },
        getErrorCorrectPolynomial: function (e) {
            for (var t = new v([1], 0), n = 0; n < e; n++) t = t.multiply(new v([1, x.gexp(n)], 0));
            return t
        },
        getLengthInBits: function (e, t) {
            if (1 <= t && t < 10) switch (e) {
                case o.MODE_NUMBER:
                    return 10;
                case o.MODE_ALPHA_NUM:
                    return 9;
                case o.MODE_8BIT_BYTE:
                case o.MODE_KANJI:
                    return 8;
                default:
                    throw new Error("mode:" + e)
            } else if (t < 27) switch (e) {
                case o.MODE_NUMBER:
                    return 12;
                case o.MODE_ALPHA_NUM:
                    return 11;
                case o.MODE_8BIT_BYTE:
                    return 16;
                case o.MODE_KANJI:
                    return 10;
                default:
                    throw new Error("mode:" + e)
            } else {
                if (!(t < 41)) throw new Error("type:" + t);
                switch (e) {
                    case o.MODE_NUMBER:
                        return 14;
                    case o.MODE_ALPHA_NUM:
                        return 13;
                    case o.MODE_8BIT_BYTE:
                        return 16;
                    case o.MODE_KANJI:
                        return 12;
                    default:
                        throw new Error("mode:" + e)
                }
            }
        },
        getLostPoint: function (e) {
            for (var t = e.getModuleCount(), n = 0, i = 0; i < t; i++) for (var r = 0; r < t; r++) {
                for (var o = 0, a = e.isDark(i, r), s = -1; s <= 1; s++) if (!(i + s < 0 || t <= i + s)) for (var u = -1; u <= 1; u++) r + u < 0 || t <= r + u || 0 == s && 0 == u || a != e.isDark(i + s, r + u) || o++;
                5 < o && (n += 3 + o - 5)
            }
            for (i = 0; i < t - 1; i++) for (r = 0; r < t - 1; r++) {
                var l = 0;
                e.isDark(i, r) && l++, e.isDark(i + 1, r) && l++, e.isDark(i, r + 1) && l++, e.isDark(i + 1, r + 1) && l++, 0 != l && 4 != l || (n += 3)
            }
            for (i = 0; i < t; i++) for (r = 0; r < t - 6; r++) e.isDark(i, r) && !e.isDark(i, r + 1) && e.isDark(i, r + 2) && e.isDark(i, r + 3) && e.isDark(i, r + 4) && !e.isDark(i, r + 5) && e.isDark(i, r + 6) && (n += 40);
            for (r = 0; r < t; r++) for (i = 0; i < t - 6; i++) e.isDark(i, r) && !e.isDark(i + 1, r) && e.isDark(i + 2, r) && e.isDark(i + 3, r) && e.isDark(i + 4, r) && !e.isDark(i + 5, r) && e.isDark(i + 6, r) && (n += 40);
            var f = 0;
            for (r = 0; r < t; r++) for (i = 0; i < t; i++) e.isDark(i, r) && f++;
            return n + 10 * (Math.abs(100 * f / t / t - 50) / 5)
        }
    }, x = {
        glog: function (e) {
            if (e < 1) throw new Error("glog(" + e + ")");
            return x.LOG_TABLE[e]
        }, gexp: function (e) {
            for (; e < 0;) e += 255;
            for (; 256 <= e;) e -= 255;
            return x.EXP_TABLE[e]
        }, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256)
    }, e = 0; e < 8; e++) x.EXP_TABLE[e] = 1 << e;
    for (e = 8; e < 256; e++) x.EXP_TABLE[e] = x.EXP_TABLE[e - 4] ^ x.EXP_TABLE[e - 5] ^ x.EXP_TABLE[e - 6] ^ x.EXP_TABLE[e - 8];
    for (e = 0; e < 255; e++) x.LOG_TABLE[x.EXP_TABLE[e]] = e;
    v.prototype = {
        get: function (e) {
            return this.num[e]
        }, getLength: function () {
            return this.num.length
        }, multiply: function (e) {
            for (var t = new Array(this.getLength() + e.getLength() - 1), n = 0; n < this.getLength(); n++) for (var i = 0; i < e.getLength(); i++) t[n + i] ^= x.gexp(x.glog(this.get(n)) + x.glog(e.get(i)));
            return new v(t, 0)
        }, mod: function (e) {
            if (this.getLength() - e.getLength() < 0) return this;
            for (var t = x.glog(this.get(0)) - x.glog(e.get(0)), n = new Array(this.getLength()), i = 0; i < this.getLength(); i++) n[i] = this.get(i);
            for (i = 0; i < e.getLength(); i++) n[i] ^= x.gexp(x.glog(e.get(i)) + t);
            return new v(n, 0).mod(e)
        }
    }, f.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]], f.getRSBlocks = function (e, t) {
        var n = f.getRsBlockTable(e, t);
        if (null == n) throw new Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t);
        for (var i = n.length / 3, r = [], o = 0; o < i; o++) for (var a = n[3 * o + 0], s = n[3 * o + 1], u = n[3 * o + 2], l = 0; l < a; l++) r.push(new f(s, u));
        return r
    }, f.getRsBlockTable = function (e, t) {
        switch (t) {
            case c.L:
                return f.RS_BLOCK_TABLE[4 * (e - 1) + 0];
            case c.M:
                return f.RS_BLOCK_TABLE[4 * (e - 1) + 1];
            case c.Q:
                return f.RS_BLOCK_TABLE[4 * (e - 1) + 2];
            case c.H:
                return f.RS_BLOCK_TABLE[4 * (e - 1) + 3];
            default:
                return
        }
    }, l.prototype = {
        get: function (e) {
            var t = Math.floor(e / 8);
            return 1 == (1 & this.buffer[t] >>> 7 - e % 8)
        }, put: function (e, t) {
            for (var n = 0; n < t; n++) this.putBit(1 == (1 & e >>> t - n - 1))
        }, getLengthInBits: function () {
            return this.length
        }, putBit: function (e) {
            var t = Math.floor(this.length / 8);
            this.buffer.length <= t && this.buffer.push(0), e && (this.buffer[t] |= 128 >>> this.length % 8), this.length++
        }
    };
    var b = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]],
        w = (T.prototype.draw = function (e) {
            function t(e, t) {
                var n = document.createElementNS("http://www.w3.org/2000/svg", e);
                for (var i in t) t.hasOwnProperty(i) && n.setAttribute(i, t[i]);
                return n
            }

            var n = this._htOption, i = this._el, r = e.getModuleCount();
            Math.floor(n.width / r), Math.floor(n.height / r), this.clear();
            var o = t("svg", {
                viewBox: "0 0 " + String(r) + " " + String(r),
                width: "100%",
                height: "100%",
                fill: n.colorLight
            });
            o.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"), i.appendChild(o), o.appendChild(t("rect", {
                fill: n.colorDark,
                width: "1",
                height: "1",
                id: "template"
            }));
            for (var a = 0; a < r; a++) for (var s = 0; s < r; s++) if (e.isDark(a, s)) {
                var u = t("use", {x: String(a), y: String(s)});
                u.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"), o.appendChild(u)
            }
        }, T.prototype.clear = function () {
            for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
        }, T),
        E = "svg" === document.documentElement.tagName.toLowerCase() ? w : "undefined" != typeof CanvasRenderingContext2D ? function () {
            function e() {
                this._elImage.src = this._elCanvas.toDataURL("image/png"), this._elImage.style.display = "block", this._elCanvas.style.display = "none"
            }

            if (this._android && this._android <= 2.1) {
                var l = 1 / window.devicePixelRatio, f = CanvasRenderingContext2D.prototype.drawImage;
                CanvasRenderingContext2D.prototype.drawImage = function (e, t, n, i, r, o, a, s) {
                    if ("nodeName" in e && /img/i.test(e.nodeName)) for (var u = arguments.length - 1; 1 <= u; u--) arguments[u] = arguments[u] * l; else void 0 === s && (t *= l, n *= l, i *= l, r *= l);
                    f.apply(this, arguments)
                }
            }

            function t(e, t) {
                this._bIsPainted = !1, this._android = i(), this._htOption = t, this._elCanvas = document.createElement("canvas"), this._elCanvas.width = t.width, this._elCanvas.height = t.height, e.appendChild(this._elCanvas), this._el = e, this._oContext = this._elCanvas.getContext("2d"), this._bIsPainted = !1, this._elImage = document.createElement("img"), this._elImage.style.display = "none", this._el.appendChild(this._elImage), this._bSupportDataURI = null
            }

            return t.prototype.draw = function (e) {
                var t = this._elImage, n = this._oContext, i = this._htOption, r = e.getModuleCount(), o = i.width / r,
                    a = i.height / r, s = Math.round(o), u = Math.round(a);
                t.style.display = "none", this.clear();
                for (var l = 0; l < r; l++) for (var f = 0; f < r; f++) {
                    var c = e.isDark(l, f), d = f * o, p = l * a;
                    n.strokeStyle = c ? i.colorDark : i.colorLight, n.lineWidth = 1, n.fillStyle = c ? i.colorDark : i.colorLight, n.fillRect(d, p, o, a), n.strokeRect(Math.floor(d) + .5, Math.floor(p) + .5, s, u), n.strokeRect(Math.ceil(d) - .5, Math.ceil(p) - .5, s, u)
                }
                this._bIsPainted = !0
            }, t.prototype.makeImage = function () {
                this._bIsPainted && function (e, t) {
                    var n = this;
                    if (n._fFail = t, n._fSuccess = e, null === n._bSupportDataURI) {
                        function i() {
                            n._bSupportDataURI = !1, n._fFail && _fFail.call(n)
                        }

                        var r = document.createElement("img");
                        return r.onabort = i, r.onerror = i, r.onload = function () {
                            n._bSupportDataURI = !0, n._fSuccess && n._fSuccess.call(n)
                        }, void (r.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")
                    }
                    !0 === n._bSupportDataURI && n._fSuccess ? n._fSuccess.call(n) : !1 === n._bSupportDataURI && n._fFail && n._fFail.call(n)
                }.call(this, e)
            }, t.prototype.isPainted = function () {
                return this._bIsPainted
            }, t.prototype.clear = function () {
                this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height), this._bIsPainted = !1
            }, t.prototype.round = function (e) {
                return e ? Math.floor(1e3 * e) / 1e3 : e
            }, t
        }() : (C.prototype.draw = function (e) {
            for (var t = this._htOption, n = this._el, i = e.getModuleCount(), r = Math.floor(t.width / i), o = Math.floor(t.height / i), a = ['<table style="border:0;border-collapse:collapse;">'], s = 0; s < i; s++) {
                a.push("<tr>");
                for (var u = 0; u < i; u++) a.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + r + "px;height:" + o + "px;background-color:" + (e.isDark(s, u) ? t.colorDark : t.colorLight) + ';"></td>');
                a.push("</tr>")
            }
            a.push("</table>"), n.innerHTML = a.join("");
            var l = n.childNodes[0], f = (t.width - l.offsetWidth) / 2, c = (t.height - l.offsetHeight) / 2;
            0 < f && 0 < c && (l.style.margin = c + "px " + f + "px")
        }, C.prototype.clear = function () {
            this._el.innerHTML = ""
        }, C);

    function C(e, t) {
        this._el = e, this._htOption = t
    }

    function T(e, t) {
        this._el = e, this._htOption = t
    }

    (QRCode = function (e, t) {
        if (this._htOption = {
            width: 256,
            height: 256,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: c.H
        }, "string" == typeof t && (t = {text: t}), t) for (var n in t) this._htOption[n] = t[n];
        "string" == typeof e && (e = document.getElementById(e)), this._android = i(), this._el = e, this._oQRCode = null, this._oDrawing = new E(this._el, this._htOption), this._htOption.text && this.makeCode(this._htOption.text)
    }).prototype.makeCode = function (e) {
        this._oQRCode = new u(t(e, this._htOption.correctLevel), this._htOption.correctLevel), this._oQRCode.addData(e), this._oQRCode.make(), this._el.title = e, this._oDrawing.draw(this._oQRCode), this.makeImage()
    }, QRCode.prototype.makeImage = function () {
        "function" == typeof this._oDrawing.makeImage && (!this._android || 3 <= this._android) && this._oDrawing.makeImage()
    }, QRCode.prototype.clear = function () {
        this._oDrawing.clear()
    }, QRCode.CorrectLevel = c
}(), $.tpl = function () {
    var rsplit = function (e, t) {
        for (var n, i = t.exec(e), r = new Array; null != i;) n = i.index, t.lastIndex, 0 != n && (e.substring(0, n), r.push(e.substring(0, n)), e = e.slice(n)), r.push(i[0]), e = e.slice(i[0].length), i = t.exec(e);
        return "" == !e && r.push(e), r
    }, chop = function (e) {
        return e.substr(0, e.length - 1)
    }, extend = function (e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
    };
    return EJS = function (e) {
        if (e = "string" == typeof e ? {view: e} : e, this.set_options(e), e.precompiled) return this.template = {}, this.template.process = e.precompiled, void EJS.update(this.name, this);
        if (e.element) {
            if ("string" == typeof e.element) {
                var t = e.element;
                if (e.element = document.getElementById(e.element), null == e.element) throw t + "does not exist!"
            }
            e.element.value ? this.text = e.element.value : this.text = e.element.innerHTML, this.name = e.element.id, this.type = "["
        } else if (e.url) {
            e.url = EJS.endExt(e.url, this.extMatch), this.name = this.name ? this.name : e.url;
            var n = e.url;
            if (i = EJS.get(this.name, this.cache)) return i;
            if (i == EJS.INVALID_PATH) return null;
            try {
                this.text = EJS.request(n + (this.cache ? "" : "?" + Math.random()))
            } catch (e) {
            }
            if (null == this.text) throw{type: "EJS", message: "There is no template at " + n}
        }
        var i;
        (i = new EJS.Compiler(this.text, this.type)).compile(e, this.name), EJS.update(this.name, this), this.template = i
    }, EJS.prototype = {
        render: function (e, t) {
            e = e || {}, this._extra_helpers = t;
            var n = new EJS.Helpers(e, t || {});
            return this.template.process.call(e, e, n)
        }, update: function (element, options) {
            if ("string" == typeof element && (element = document.getElementById(element)), null == options) return _template = this, function (e) {
                EJS.prototype.update.call(_template, element, e)
            };
            "string" == typeof options ? (params = {}, params.url = options, _template = this, params.onComplete = function (request) {
                var object = eval(request.responseText);
                EJS.prototype.update.call(_template, element, object)
            }, EJS.ajax_request(params)) : element.innerHTML = this.render(options)
        }, out: function () {
            return this.template.out
        }, set_options: function (e) {
            this.type = e.type || EJS.type, this.cache = null != e.cache ? e.cache : EJS.cache, this.text = e.text || null, this.name = e.name || null, this.ext = e.ext || EJS.ext, this.extMatch = new RegExp(this.ext.replace(/\./, "."))
        }
    }, EJS.endExt = function (e, t) {
        return e ? (t.lastIndex = 0, e + (t.test(e) ? "" : this.ext)) : null
    }, EJS.Scanner = function (e, t, n) {
        extend(this, {
            left_delimiter: t + "%",
            right_delimiter: "%" + n,
            double_left: t + "%%",
            double_right: "%%" + n,
            left_equal: t + "%=",
            left_comment: t + "%#"
        }), this.SplitRegexp = "[" == t ? /(\[%%)|(%%\])|(\[%=)|(\[%#)|(\[%)|(%\]\n)|(%\])|(\n)/ : new RegExp("(" + this.double_left + ")|(%%" + this.double_right + ")|(" + this.left_equal + ")|(" + this.left_comment + ")|(" + this.left_delimiter + ")|(" + this.right_delimiter + "\n)|(" + this.right_delimiter + ")|(\n)"), this.source = e, this.stag = null, this.lines = 0
    }, EJS.Scanner.to_text = function (e) {
        return null == e || void 0 === e ? "" : e instanceof Date ? e.toDateString() : e.toString ? e.toString() : ""
    }, EJS.Scanner.prototype = {
        scan: function (e) {
            if (scanline = this.scanline, regex = this.SplitRegexp, "" == !this.source) for (var t = rsplit(this.source, /\n/), n = 0; n < t.length; n++) {
                var i = t[n];
                this.scanline(i, regex, e)
            }
        }, scanline: function (e, t, n) {
            this.lines++;
            for (var i = rsplit(e, t), r = 0; r < i.length; r++) {
                var o = i[r];
                if (null != o) try {
                    n(o, this)
                } catch (e) {
                    throw{type: "EJS.Scanner", line: this.lines}
                }
            }
        }
    }, EJS.Buffer = function (e, t) {
        this.line = new Array, this.script = "", this.pre_cmd = e, this.post_cmd = t;
        for (var n = 0; n < this.pre_cmd.length; n++) this.push(e[n])
    }, EJS.Buffer.prototype = {
        push: function (e) {
            this.line.push(e)
        }, cr: function () {
            this.script = this.script + this.line.join("; "), this.line = new Array, this.script = this.script + "\n"
        }, close: function () {
            if (0 < this.line.length) {
                for (var e = 0; e < this.post_cmd.length; e++) this.push(pre_cmd[e]);
                this.script = this.script + this.line.join("; "), line = null
            }
        }
    }, EJS.Compiler = function (e, t) {
        this.pre_cmd = ["var ___ViewO = [];"], this.post_cmd = new Array, this.source = " ", null != e && ("string" == typeof e ? (e = (e = e.replace(/\r\n/g, "\n")).replace(/\r/g, "\n"), this.source = e) : e.innerHTML && (this.source = e.innerHTML), "string" != typeof this.source && (this.source = ""));
        var n = ">";
        switch (t = t || "<") {
            case"[":
                n = "]";
                break;
            case"<":
                break;
            default:
                throw t + " is not a supported deliminator"
        }
        this.scanner = new EJS.Scanner(this.source, t, n), this.out = ""
    }, EJS.Compiler.prototype = {
        compile: function (options, name) {
            options = options || {}, this.out = "";
            var put_cmd = "___ViewO.push(", insert_cmd = put_cmd, buff = new EJS.Buffer(this.pre_cmd, this.post_cmd),
                content = "", clean = function (e) {
                    return e = (e = (e = e.replace(/\\/g, "\\\\")).replace(/\n/g, "\\n")).replace(/"/g, '\\"')
                };
            this.scanner.scan(function (e, t) {
                if (null == t.stag) switch (e) {
                    case"\n":
                        content += "\n", buff.push(put_cmd + '"' + clean(content) + '");'), buff.cr(), content = "";
                        break;
                    case t.left_delimiter:
                    case t.left_equal:
                    case t.left_comment:
                        t.stag = e, 0 < content.length && buff.push(put_cmd + '"' + clean(content) + '")'), content = "";
                        break;
                    case t.double_left:
                        content += t.left_delimiter;
                        break;
                    default:
                        content += e
                } else switch (e) {
                    case t.right_delimiter:
                        switch (t.stag) {
                            case t.left_delimiter:
                                "\n" == content[content.length - 1] ? (content = chop(content), buff.push(content), buff.cr()) : buff.push(content);
                                break;
                            case t.left_equal:
                                buff.push(insert_cmd + "(EJS.Scanner.to_text(" + content + ")))")
                        }
                        t.stag = null, content = "";
                        break;
                    case t.double_right:
                        content += t.right_delimiter;
                        break;
                    default:
                        content += e
                }
            }), 0 < content.length && buff.push(put_cmd + '"' + clean(content) + '")'), buff.close(), this.out = buff.script + ";";
            var to_be_evaled = "/*" + name + "*/this.process = function(_CONTEXT,_VIEW) { try { with(_VIEW) { with (_CONTEXT) {" + this.out + " return ___ViewO.join('');}}}catch(e){e.lineNumber=null;throw e;}};";
            try {
                eval(to_be_evaled)
            } catch (e) {
                if ("undefined" == typeof JSLINT) throw e;
                JSLINT(this.out);
                for (var i = 0; i < JSLINT.errors.length; i++) {
                    var error = JSLINT.errors[i];
                    if ("Unnecessary semicolon." != error.reason) {
                        error.line++;
                        var e1 = new Error;
                        throw e1.lineNumber = error.line, e1.message = error.reason, options.view && (e1.fileName = options.view), e1
                    }
                }
            }
        }
    }, EJS.config = function (e) {
        EJS.cache = null != e.cache ? e.cache : EJS.cache, EJS.type = null != e.type ? e.type : EJS.type, EJS.ext = null != e.ext ? e.ext : EJS.ext;
        var n = EJS.templates_directory || {};
        EJS.templates_directory = n, EJS.get = function (e, t) {
            return 0 == t ? null : n[e] ? n[e] : null
        }, EJS.update = function (e, t) {
            null != e && (n[e] = t)
        }, EJS.INVALID_PATH = -1
    }, EJS.config({cache: !0, type: "<", ext: ".ejs"}), EJS.Helpers = function (e, t) {
        this._data = e, this._extras = t, extend(this, t)
    }, EJS.Helpers.prototype = {
        view: function (e, t, n) {
            return n = n || this._extras, t = t || this._data, new EJS(e).render(t, n)
        }, to_text: function (e, t) {
            return null == e || void 0 === e ? t || "" : e instanceof Date ? e.toDateString() : e.toString ? e.toString().replace(/\n/g, "<br />").replace(/''/g, "'") : ""
        }
    }, EJS.newRequest = function () {
        for (var e = [function () {
            return new ActiveXObject("Msxml2.XMLHTTP")
        }, function () {
            return new XMLHttpRequest
        }, function () {
            return new ActiveXObject("Microsoft.XMLHTTP")
        }], t = 0; t < e.length; t++) try {
            var n = e[t]();
            if (null != n) return n
        } catch (e) {
            continue
        }
    }, EJS.request = function (e) {
        var t = new EJS.newRequest;
        t.open("GET", e, !1);
        try {
            t.send(null)
        } catch (e) {
            return null
        }
        return 404 == t.status || 2 == t.status || 0 == t.status && "" == t.responseText ? null : t.responseText
    }, EJS.ajax_request = function (e) {
        e.method = e.method ? e.method : "GET";
        var t = new EJS.newRequest;
        t.onreadystatechange = function () {
            4 == t.readyState && (t.status, e.onComplete(t))
        }, t.open(e.method, e.url), t.send(null)
    }, function (e, t) {
        return new EJS({text: e, type: "<"}).render(t)
    }
}(), $.encodeHTML = function (e) {
    return e ? String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") : e
}, $.decodeHTML = function (e) {
    return e ? e.replace(/\n/g, "<br/>") : e
}, $.removeHTML = function (e) {
    return e ? e.replace(/<[^>]+>/g, "") : e
}, $.queryToJson = function (e, t) {
    if (!e) return {};
    for (var n = e.split("&"), i = {}, r = 0, o = n.length; r < o; r++) {
        var a = n[r].split("=");
        a[0] && (i[a[0]] = a[1] ? t ? decodeURIComponent(a[1]) : a[1] : "")
    }
    return i
}, $.jsonToQuery = function (e, t) {
    var n = [];
    if (e) for (var i in e) n.push(i + "=" + (t ? encodeURIComponent(e[i]) : e[i]));
    return n.join("&")
}, $.joinUrl = function (e, t) {
    e = e || location.href;
    var n = [];
    for (var i in t) i && n.push(i + "=" + encodeURIComponent(t[i]));
    return e.indexOf("?") < 0 && (e += "?"), e + (0 <= e.indexOf("&") ? e + "&" + n.join("&") : n.join("&"))
}, $.parseURL = function (e) {
    if (!e) return null;
    for (var t = ["url", "origin", "scheme", "slash", "host", "port", "path", "query", "hash"], n = /^((?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?)(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.exec(e), i = {}, r = 0, o = t.length; r < o; r += 1) i[t[r]] = n[r] || "";
    return i
}, $.buildDate = function (e) {
    if ("string" == typeof e) 0 <= (e = e.replace(/-/g, "/")).indexOf("/") ? e = new Date(e) : isNaN(parseInt(e)) || (e = new Date(parseInt(e))); else if ("number" == typeof e) (e + "").length <= 10 && (e *= 1e3), e = new Date(e); else if (!(e instanceof Date)) return !1;
    return e
}, $.formatDate = function (e, t) {
    var n = $.buildDate(e);
    if (!n) return e;
    var i = {
        "M+": n.getMonth() + 1,
        "d+": n.getDate(),
        "h+": n.getHours(),
        "m+": n.getMinutes(),
        "s+": n.getSeconds(),
        "q+": Math.floor((n.getMonth() + 3) / 3),
        S: n.getMilliseconds()
    };
    for (var r in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length))), i) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[r] : ("00" + i[r]).substr(("" + i[r]).length)));
    return t
}, $.getLimitString = function (e, t, n) {
    return e && (n = n || "..", e.length > t && (e = e.substring(0, t) + n)), e
}, $.bLength = function (e) {
    if (!e) return 0;
    var t = e.match(/[^\x00-\xff]/g);
    return e.length + (t ? t.length : 0)
};
/*-----------------------------------------------------------------------*/

var layer;
var loading;
layui.use("layer",function(){
    layer = layui.layer;
});
//带参ajax请求
function ajaxRequest(url,type,param,success){
    $.ajax({
       url:url,
       type:type,
       data:param,
       dataType:"json",
       headers:{"token":localStorage.token},
       success:success,
       error:function(xhr){
            layer.msg("请求错误："+xhr.status);
       }
    });
}
function ajaxForm(formId, url, success) {
    $("#" + formId).ajaxForm({
        url: url,
        type: "post",
        dataType: "json",
        headers:{"token":localStorage.token},
        success: success,
        error: function (xhr) {
            layer.msg("请求失败" + xhr.status);
            console.log("请求失败" + xhr.status);
        },
        beforeSend: function () {
            loading = layer.load();
        },
        complete: function () {
            layer.close(loading);
        }
    });
}