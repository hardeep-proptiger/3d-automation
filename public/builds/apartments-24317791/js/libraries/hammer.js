(function(a, b, c, d) {
    function e(a, b, c) {
        return setTimeout(A(a, c), b)
    }

    function g(a, b, c) {
        return Array.isArray(a) ? (f(a, c[b], c), !0) : !1
    }

    function f(a, b, c) {
        var v;
        if (a)
            if (a.forEach) a.forEach(b, c);
            else if (a.length !== d)
                for (v = 0; v < a.length;) b.call(c, a[v], v, a), v++;
            else
                for (v in a) a.hasOwnProperty(v) && b.call(c, a[v], v, a)
    }

    function k(a, b, c) {
        for (var v = Object.keys(b), e = 0; e < v.length;) {
            if (!c || c && a[v[e]] === d) a[v[e]] = b[v[e]];
            e++
        }
        return a
    }

    function r(a, b) {
        return k(a, b, !0)
    }

    function p(a, b, c) {
        b = b.prototype;
        var d;
        d = a.prototype = Object.create(b);
        d.constructor = a;
        d._super = b;
        c && k(d, c)
    }

    function A(a, b) {
        return function() {
            return a.apply(b, arguments)
        }
    }

    function B(a, b) {
        return "function" == typeof a ? a.apply(b ? b[0] || d : d, b) : a
    }

    function u(a, b, c) {
        f(y(b), function(b) {
            a.addEventListener(b, c, !1)
        })
    }

    function x(a, b, c) {
        f(y(b), function(b) {
            a.removeEventListener(b, c, !1)
        })
    }

    function C(a, b) {
        for (; a;) {
            if (a == b) return !0;
            a = a.parentNode
        }
        return !1
    }

    function y(a) {
        return a.trim().split(/\s+/g)
    }

    function h(a, b, c) {
        if (a.indexOf && !c) return a.indexOf(b);
        for (var d = 0; d < a.length;) {
            if (c && a[d][c] ==
                b || !c && a[d] === b) return d;
            d++
        }
        return -1
    }

    function l(a) {
        return Array.prototype.slice.call(a, 0)
    }

    function t(a, b, c) {
        for (var d = [], e = [], f = 0; f < a.length;) {
            var g = b ? a[f][b] : a[f];
            0 > h(e, g) && d.push(a[f]);
            e[f] = g;
            f++
        }
        c && (d = b ? d.sort(function(a, Q) {
            return a[b] > Q[b]
        }) : d.sort());
        return d
    }

    function z(a, b) {
        for (var c, v = b[0].toUpperCase() + b.slice(1), e = 0; e < ba.length;) {
            c = (c = ba[e]) ? c + v : b;
            if (c in a) return c;
            e++
        }
        return d
    }

    function n(a) {
        a = a.ownerDocument;
        return a.defaultView || a.parentWindow
    }

    function w(a, b) {
        var c = this;
        this.manager =
            a;
        this.callback = b;
        this.element = a.element;
        this.target = a.options.inputTarget;
        this.domHandler = function(b) {
            B(a.options.enable, [a]) && c.handler(b)
        };
        this.init()
    }

    function H(a) {
        var b = a.options.inputClass;
        return new(b ? b : na ? R : oa ? J : ca ? S : K)(a, m)
    }

    function m(a, b, c) {
        var e = c.pointers.length,
            f = c.changedPointers.length,
            g = b & 1 && 0 === e - f;
        c.isFirst = !!g;
        c.isFinal = !!(b & 12 && 0 === e - f);
        g && (a.session = {});
        c.eventType = b;
        b = a.session;
        e = c.pointers;
        f = e.length;
        b.firstInput || (b.firstInput = q(c));
        1 < f && !b.firstMultiple ? b.firstMultiple = q(c) :
        1 === f && (b.firstMultiple = !1);
        var g = b.firstInput,
            h = (f = b.firstMultiple) ? f.center : g.center,
            k = c.center = da(e);
        c.timeStamp = T();
        c.deltaTime = c.timeStamp - g.timeStamp;
        c.angle = U(h, k);
        c.distance = L(h, k);
        var g = c.center,
            h = b.offsetDelta || {},
            k = b.prevDelta || {},
            l = b.prevInput || {};
        if (1 === c.eventType || 4 === l.eventType) k = b.prevDelta = {
            x: l.deltaX || 0,
            y: l.deltaY || 0
        }, h = b.offsetDelta = {
            x: g.x,
            y: g.y
        };
        c.deltaX = k.x + (g.x - h.x);
        c.deltaY = k.y + (g.y - h.y);
        c.offsetDirection = ea(c.deltaX, c.deltaY);
        f ? (g = f.pointers, g = L(e[0], e[1], M) / L(g[0], g[1],
                M)) : g = 1;
        c.scale = g;
        f ? (f = f.pointers, e = U(e[1], e[0], M) - U(f[1], f[0], M)) : e = 0;
        c.rotation = e;
        h = b.lastInterval || c;
        e = c.timeStamp - h.timeStamp;
        8 != c.eventType && (25 < e || h.velocity === d) ? (g = h.deltaX - c.deltaX, h = h.deltaY - c.deltaY, k = g / e || 0, l = h / e || 0, e = k, f = l, k = I(k) > I(l) ? k : l, g = ea(g, h), b.lastInterval = c) : (k = h.velocity, e = h.velocityX, f = h.velocityY, g = h.direction);
        c.velocity = k;
        c.velocityX = e;
        c.velocityY = f;
        c.direction = g;
        b = a.element;
        C(c.srcEvent.target, b) && (b = c.srcEvent.target);
        c.target = b;
        a.emit("hammer.input", c);
        a.recognize(c);
        a.session.prevInput = c
    }

    function q(a) {
        for (var b = [], c = 0; c < a.pointers.length;) b[c] = {
            clientX: G(a.pointers[c].clientX),
            clientY: G(a.pointers[c].clientY)
        }, c++;
        return {
            timeStamp: T(),
            pointers: b,
            center: da(b),
            deltaX: a.deltaX,
            deltaY: a.deltaY
        }
    }

    function da(a) {
        var b = a.length;
        if (1 === b) return {
            x: G(a[0].clientX),
            y: G(a[0].clientY)
        };
        for (var c = 0, d = 0, e = 0; e < b;) c += a[e].clientX, d += a[e].clientY, e++;
        return {
            x: G(c / b),
            y: G(d / b)
        }
    }

    function ea(a, b) {
        return a === b ? 1 : I(a) >= I(b) ? 0 < a ? 2 : 4 : 0 < b ? 8 : 16
    }

    function L(a, b, c) {
        c || (c = fa);
        var d = b[c[0]] -
            a[c[0]];
        a = b[c[1]] - a[c[1]];
        return Math.sqrt(d * d + a * a)
    }

    function U(a, b, c) {
        c || (c = fa);
        return 180 * Math.atan2(b[c[1]] - a[c[1]], b[c[0]] - a[c[0]]) / Math.PI
    }

    function K() {
        this.evEl = pa;
        this.evWin = qa;
        this.allow = !0;
        this.pressed = !1;
        w.apply(this, arguments)
    }

    function R() {
        this.evEl = ga;
        this.evWin = ha;
        w.apply(this, arguments);
        this.store = this.manager.session.pointerEvents = []
    }

    function ia() {
        this.evTarget = "touchstart";
        this.evWin = "touchstart touchmove touchend touchcancel";
        this.started = !1;
        w.apply(this, arguments)
    }

    function J() {
        this.evTarget =
            ra;
        this.targetIds = {};
        w.apply(this, arguments)
    }

    function sa(a, b) {
        var c = l(a.touches),
            d = this.targetIds;
        if (b & 3 && 1 === c.length) return d[c[0].identifier] = !0, [c, c];
        var e, f = l(a.changedTouches),
            g = [],
            h = this.target;
        e = c.filter(function(a) {
            return C(a.target, h)
        });
        if (1 === b)
            for (c = 0; c < e.length;) d[e[c].identifier] = !0, c++;
        for (c = 0; c < f.length;) d[f[c].identifier] && g.push(f[c]), b & 12 && delete d[f[c].identifier], c++;
        if (g.length) return [t(e.concat(g), "identifier", !0), g]
    }

    function S() {
        w.apply(this, arguments);
        var a = A(this.handler,
            this);
        this.touch = new J(this.manager, a);
        this.mouse = new K(this.manager, a)
    }

    function V(a, b) {
        this.manager = a;
        this.set(b)
    }

    function ta(a) {
        if (-1 < a.indexOf("none")) return "none";
        var b = -1 < a.indexOf("pan-x"),
            c = -1 < a.indexOf("pan-y");
        return b && c ? "pan-x pan-y" : b || c ? b ? "pan-x" : "pan-y" : -1 < a.indexOf("manipulation") ? "manipulation" : "auto"
    }

    function E(a) {
        this.id = ua++;
        this.manager = null;
        this.options = r(a || {}, this.defaults);
        a = this.options.enable;
        this.options.enable = a === d ? !0 : a;
        this.state = 1;
        this.simultaneous = {};
        this.requireFail = []
    }

    function ja(a) {
        return 16 == a ? "down" : 8 == a ? "up" : 2 == a ? "left" : 4 == a ? "right" : ""
    }

    function N(a, b) {
        var c = b.manager;
        return c ? c.get(a) : a
    }

    function D() {
        E.apply(this, arguments)
    }

    function O() {
        D.apply(this, arguments);
        this.pY = this.pX = null
    }

    function W() {
        D.apply(this, arguments)
    }

    function X() {
        E.apply(this, arguments);
        this._input = this._timer = null
    }

    function Y() {
        D.apply(this, arguments)
    }

    function Z() {
        D.apply(this, arguments)
    }

    function P() {
        E.apply(this, arguments);
        this.pCenter = this.pTime = !1;
        this._input = this._timer = null;
        this.count =
            0
    }

    function F(a, b) {
        b = b || {};
        var c = b.recognizers;
        b.recognizers = c === d ? F.defaults.preset : c;
        return new aa(a, b)
    }

    function aa(a, b) {
        b = b || {};
        this.options = r(b, F.defaults);
        this.options.inputTarget = this.options.inputTarget || a;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.element = a;
        this.input = H(this);
        this.touchAction = new V(this, this.options.touchAction);
        ka(this, !0);
        f(b.recognizers, function(a) {
            var b = this.add(new a[0](a[1]));
            a[2] && b.recognizeWith(a[2]);
            a[3] && b.requireFailure(a[3])
        }, this)
    }

    function ka(a,
                b) {
        var c = a.element;
        f(a.options.cssProps, function(a, Q) {
            c.style[z(c.style, Q)] = b ? a : ""
        })
    }

    function va(a, c) {
        var d = b.createEvent("Event");
        d.initEvent(a, !0, !0);
        d.gesture = c;
        c.target.dispatchEvent(d)
    }
    var ba = " webkit moz MS ms o".split(" "),
        wa = b.createElement("div"),
        G = Math.round,
        I = Math.abs,
        T = Date.now,
        ua = 1,
        xa = /mobile|tablet|ip(ad|hone|od)|android/i,
        ca = "ontouchstart" in a,
        na = z(a, "PointerEvent") !== d,
        oa = ca && xa.test(navigator.userAgent),
        fa = ["x", "y"],
        M = ["clientX", "clientY"];
    w.prototype = {
        handler: function() {},
        init: function() {
            this.evEl &&
            u(this.element, this.evEl, this.domHandler);
            this.evTarget && u(this.target, this.evTarget, this.domHandler);
            this.evWin && u(n(this.element), this.evWin, this.domHandler)
        },
        destroy: function() {
            this.evEl && x(this.element, this.evEl, this.domHandler);
            this.evTarget && x(this.target, this.evTarget, this.domHandler);
            this.evWin && x(n(this.element), this.evWin, this.domHandler)
        }
    };
    var ya = {
            mousedown: 1,
            mousemove: 2,
            mouseup: 4
        },
        pa = "mousedown",
        qa = "mousemove mouseup";
    p(K, w, {
        handler: function(a) {
            var b = ya[a.type];
            b & 1 && 0 === a.button && (this.pressed = !0);
            b & 2 && 1 !== a.which && (b = 4);
            this.pressed && this.allow && (b & 4 && (this.pressed = !1), this.callback(this.manager, b, {
                pointers: [a],
                changedPointers: [a],
                pointerType: "mouse",
                srcEvent: a
            }))
        }
    });
    var za = {
            pointerdown: 1,
            pointermove: 2,
            pointerup: 4,
            pointercancel: 8,
            pointerout: 8
        },
        Aa = {
            2: "touch",
            3: "pen",
            4: "mouse",
            5: "kinect"
        },
        ga = "pointerdown",
        ha = "pointermove pointerup pointercancel";
    a.MSPointerEvent && (ga = "MSPointerDown", ha = "MSPointerMove MSPointerUp MSPointerCancel");
    p(R, w, {
        handler: function(a) {
            var b = this.store,
                c = !1,
                d = a.type.toLowerCase().replace("ms",
                    ""),
                d = za[d],
                e = Aa[a.pointerType] || a.pointerType,
                f = "touch" == e,
                g = h(b, a.pointerId, "pointerId");
            d & 1 && (0 === a.button || f) ? 0 > g && (b.push(a), g = b.length - 1) : d & 12 && (c = !0);
            0 > g || (b[g] = a, this.callback(this.manager, d, {
                pointers: b,
                changedPointers: [a],
                pointerType: e,
                srcEvent: a
            }), c && b.splice(g, 1))
        }
    });
    var Ba = {
        touchstart: 1,
        touchmove: 2,
        touchend: 4,
        touchcancel: 8
    };
    p(ia, w, {
        handler: function(a) {
            var b = Ba[a.type];
            1 === b && (this.started = !0);
            if (this.started) {
                var c;
                c = l(a.touches);
                var d = l(a.changedTouches);
                b & 12 && (c = t(c.concat(d), "identifier", !0));
                c = [c, d];
                b & 12 && 0 === c[0].length - c[1].length && (this.started = !1);
                this.callback(this.manager, b, {
                    pointers: c[0],
                    changedPointers: c[1],
                    pointerType: "touch",
                    srcEvent: a
                })
            }
        }
    });
    var Ca = {
            touchstart: 1,
            touchmove: 2,
            touchend: 4,
            touchcancel: 8
        },
        ra = "touchstart touchmove touchend touchcancel";
    p(J, w, {
        handler: function(a) {
            var b = Ca[a.type],
                c = sa.call(this, a, b);
            c && this.callback(this.manager, b, {
                pointers: c[0],
                changedPointers: c[1],
                pointerType: "touch",
                srcEvent: a
            })
        }
    });
    p(S, w, {
        handler: function(a, b, c) {
            var d = "mouse" == c.pointerType;
            if ("touch" == c.pointerType) this.mouse.allow = !1;
            else if (d && !this.mouse.allow) return;
            b & 12 && (this.mouse.allow = !0);
            this.callback(a, b, c)
        },
        destroy: function() {
            this.touch.destroy();
            this.mouse.destroy()
        }
    });
    var la = z(wa.style, "touchAction"),
        ma = la !== d;
    V.prototype = {
        set: function(a) {
            "compute" == a && (a = this.compute());
            ma && (this.manager.element.style[la] = a);
            this.actions = a.toLowerCase().trim()
        },
        update: function() {
            this.set(this.manager.options.touchAction)
        },
        compute: function() {
            var a = [];
            f(this.manager.recognizers, function(b) {
                B(b.options.enable, [b]) && (a = a.concat(b.getTouchAction()))
            });
            return ta(a.join(" "))
        },
        preventDefaults: function(a) {
            if (!ma) {
                var b = a.srcEvent;
                a = a.offsetDirection;
                if (this.manager.session.prevented) b.preventDefault();
                else {
                    var c = this.actions,
                        d = -1 < c.indexOf("none"),
                        e = -1 < c.indexOf("pan-y"),
                        c = -1 < c.indexOf("pan-x");
                    if (d || e && a & 6 || c && a & 24) return this.preventSrc(b)
                }
            }
        },
        preventSrc: function(a) {
            this.manager.session.prevented = !0;
            a.preventDefault()
        }
    };
    E.prototype = {
        defaults: {},
        set: function(a) {
            k(this.options, a);
            this.manager && this.manager.touchAction.update();
            return this
        },
        recognizeWith: function(a) {
            if (g(a, "recognizeWith", this)) return this;
            var b = this.simultaneous;
            a = N(a, this);
            b[a.id] || (b[a.id] = a, a.recognizeWith(this));
            return this
        },
        dropRecognizeWith: function(a) {
            if (g(a, "dropRecognizeWith", this)) return this;
            a = N(a, this);
            delete this.simultaneous[a.id];
            return this
        },
        requireFailure: function(a) {
            if (g(a, "requireFailure", this)) return this;
            var b = this.requireFail;
            a = N(a, this); - 1 === h(b, a) && (b.push(a), a.requireFailure(this));
            return this
        },
        dropRequireFailure: function(a) {
            if (g(a,
                    "dropRequireFailure", this)) return this;
            a = N(a, this);
            a = h(this.requireFail, a); - 1 < a && this.requireFail.splice(a, 1);
            return this
        },
        hasRequireFailures: function() {
            return 0 < this.requireFail.length
        },
        canRecognizeWith: function(a) {
            return !!this.simultaneous[a.id]
        },
        emit: function(a) {
            function b(e) {
                c.manager.emit(c.options.event + (e ? d & 16 ? "cancel" : d & 8 ? "end" : d & 4 ? "move" : d & 2 ? "start" : "" : ""), a)
            }
            var c = this,
                d = this.state;
            8 > d && b(!0);
            b();
            8 <= d && b(!0)
        },
        tryEmit: function(a) {
            if (this.canEmit()) return this.emit(a);
            this.state = 32
        },
        canEmit: function() {
            for (var a =
                0; a < this.requireFail.length;) {
                if (!(this.requireFail[a].state & 33)) return !1;
                a++
            }
            return !0
        },
        recognize: function(a) {
            a = k({}, a);
            B(this.options.enable, [this, a]) ? (this.state & 56 && (this.state = 1), this.state = this.process(a), this.state & 30 && this.tryEmit(a)) : (this.reset(), this.state = 32)
        },
        process: function(a) {},
        getTouchAction: function() {},
        reset: function() {}
    };
    p(D, E, {
        defaults: {
            pointers: 1
        },
        attrTest: function(a) {
            var b = this.options.pointers;
            return 0 === b || a.pointers.length === b
        },
        process: function(a) {
            var b = this.state,
                c = a.eventType,
                d = b & 6;
            a = this.attrTest(a);
            return d && (c & 8 || !a) ? b | 16 : d || a ? c & 4 ? b | 8 : b & 2 ? b | 4 : 2 : 32
        }
    });
    p(O, D, {
        defaults: {
            event: "pan",
            threshold: 10,
            pointers: 1,
            direction: 30
        },
        getTouchAction: function() {
            var a = this.options.direction,
                b = [];
            a & 6 && b.push("pan-y");
            a & 24 && b.push("pan-x");
            return b
        },
        directionTest: function(a) {
            var b = this.options,
                c = !0,
                d = a.distance,
                e = a.direction,
                f = a.deltaX,
                g = a.deltaY;
            e & b.direction || (b.direction & 6 ? (e = 0 === f ? 1 : 0 > f ? 2 : 4, c = f != this.pX, d = Math.abs(a.deltaX)) : (e = 0 === g ? 1 : 0 > g ? 8 : 16, c = g != this.pY, d = Math.abs(a.deltaY)));
            a.direction =
                e;
            return c && d > b.threshold && e & b.direction
        },
        attrTest: function(a) {
            return D.prototype.attrTest.call(this, a) && (this.state & 2 || !(this.state & 2) && this.directionTest(a))
        },
        emit: function(a) {
            this.pX = a.deltaX;
            this.pY = a.deltaY;
            var b = ja(a.direction);
            b && this.manager.emit(this.options.event + b, a);
            this._super.emit.call(this, a)
        }
    });
    p(W, D, {
        defaults: {
            event: "pinch",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return ["none"]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.scale - 1) > this.options.threshold ||
                this.state & 2)
        },
        emit: function(a) {
            this._super.emit.call(this, a);
            1 !== a.scale && this.manager.emit(this.options.event + (1 > a.scale ? "in" : "out"), a)
        }
    });
    p(X, E, {
        defaults: {
            event: "press",
            pointers: 1,
            time: 500,
            threshold: 5
        },
        getTouchAction: function() {
            return ["auto"]
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime > b.time;
            this._input = a;
            if (!d || !c || a.eventType & 12 && !f) this.reset();
            else if (a.eventType & 1) this.reset(), this._timer = e(function() {
                    this.state = 8;
                    this.tryEmit()
                },
                b.time, this);
            else if (a.eventType & 4) return 8;
            return 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function(a) {
            8 === this.state && (a && a.eventType & 4 ? this.manager.emit(this.options.event + "up", a) : (this._input.timeStamp = T(), this.manager.emit(this.options.event, this._input)))
        }
    });
    p(Y, D, {
        defaults: {
            event: "rotate",
            threshold: 0,
            pointers: 2
        },
        getTouchAction: function() {
            return ["none"]
        },
        attrTest: function(a) {
            return this._super.attrTest.call(this, a) && (Math.abs(a.rotation) > this.options.threshold || this.state & 2)
        }
    });
    p(Z, D, {
        defaults: {
            event: "swipe",
            threshold: 10,
            velocity: .65,
            direction: 30,
            pointers: 1
        },
        getTouchAction: function() {
            return O.prototype.getTouchAction.call(this)
        },
        attrTest: function(a) {
            var b = this.options.direction,
                c;
            b & 30 ? c = a.velocity : b & 6 ? c = a.velocityX : b & 24 && (c = a.velocityY);
            return this._super.attrTest.call(this, a) && b & a.direction && a.distance > this.options.threshold && I(c) > this.options.velocity && a.eventType & 4
        },
        emit: function(a) {
            var b = ja(a.direction);
            b && this.manager.emit(this.options.event + b, a);
            this.manager.emit(this.options.event,
                a)
        }
    });
    p(P, E, {
        defaults: {
            event: "tap",
            pointers: 1,
            taps: 1,
            interval: 300,
            time: 250,
            threshold: 2,
            posThreshold: 10
        },
        getTouchAction: function() {
            return ["manipulation"]
        },
        process: function(a) {
            var b = this.options,
                c = a.pointers.length === b.pointers,
                d = a.distance < b.threshold,
                f = a.deltaTime < b.time;
            this.reset();
            if (a.eventType & 1 && 0 === this.count) return this.failTimeout();
            if (d && f && c) {
                if (4 != a.eventType) return this.failTimeout();
                c = this.pTime ? a.timeStamp - this.pTime < b.interval : !0;
                d = !this.pCenter || L(this.pCenter, a.center) < b.posThreshold;
                this.pTime = a.timeStamp;
                this.pCenter = a.center;
                this.count = d && c ? this.count + 1 : 1;
                this._input = a;
                if (0 === this.count % b.taps) return this.hasRequireFailures() ? (this._timer = e(function() {
                    this.state = 8;
                    this.tryEmit()
                }, b.interval, this), 2) : 8
            }
            return 32
        },
        failTimeout: function() {
            this._timer = e(function() {
                this.state = 32
            }, this.options.interval, this);
            return 32
        },
        reset: function() {
            clearTimeout(this._timer)
        },
        emit: function() {
            8 == this.state && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
        }
    });
    F.VERSION =
        "2.0.4";
    F.defaults = {
        domEvents: !1,
        touchAction: "compute",
        enable: !0,
        inputTarget: null,
        inputClass: null,
        preset: [
            [Y, {
                enable: !1
            }],
            [W, {
                enable: !1
            },
                ["rotate"]
            ],
            [Z, {
                direction: 6
            }],
            [O, {
                direction: 6
            },
                ["swipe"]
            ],
            [P],
            [P, {
                event: "doubletap",
                taps: 2
            },
                ["tap"]
            ],
            [X]
        ],
        cssProps: {
            userSelect: "none",
            touchSelect: "none",
            touchCallout: "none",
            contentZooming: "none",
            userDrag: "none",
            tapHighlightColor: "rgba(0,0,0,0)"
        }
    };
    aa.prototype = {
        set: function(a) {
            k(this.options, a);
            a.touchAction && this.touchAction.update();
            a.inputTarget && (this.input.destroy(),
                this.input.target = a.inputTarget, this.input.init());
            return this
        },
        stop: function(a) {
            this.session.stopped = a ? 2 : 1
        },
        recognize: function(a) {
            var b = this.session;
            if (!b.stopped) {
                this.touchAction.preventDefaults(a);
                var c, d = this.recognizers,
                    e = b.curRecognizer;
                if (!e || e && e.state & 8) e = b.curRecognizer = null;
                for (var f = 0; f < d.length;) c = d[f], 2 === b.stopped || e && c != e && !c.canRecognizeWith(e) ? c.reset() : c.recognize(a), !e && c.state & 14 && (e = b.curRecognizer = c), f++
            }
        },
        get: function(a) {
            if (a instanceof E) return a;
            for (var b = this.recognizers,
                     c = 0; c < b.length; c++)
                if (b[c].options.event == a) return b[c];
            return null
        },
        add: function(a) {
            if (g(a, "add", this)) return this;
            var b = this.get(a.options.event);
            b && this.remove(b);
            this.recognizers.push(a);
            a.manager = this;
            this.touchAction.update();
            return a
        },
        remove: function(a) {
            if (g(a, "remove", this)) return this;
            var b = this.recognizers;
            a = this.get(a);
            b.splice(h(b, a), 1);
            this.touchAction.update();
            return this
        },
        on: function(a, b) {
            var c = this.handlers;
            f(y(a), function(a) {
                c[a] = c[a] || [];
                c[a].push(b)
            });
            return this
        },
        off: function(a,
                      b) {
            var c = this.handlers;
            f(y(a), function(a) {
                b ? c[a].splice(h(c[a], b), 1) : delete c[a]
            });
            return this
        },
        emit: function(a, b) {
            this.options.domEvents && va(a, b);
            var c = this.handlers[a] && this.handlers[a].slice();
            if (c && c.length) {
                b.type = a;
                b.preventDefault = function() {
                    b.srcEvent.preventDefault()
                };
                for (var d = 0; d < c.length;) c[d](b), d++
            }
        },
        destroy: function() {
            this.element && ka(this, !1);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null
        }
    };
    k(F, {
        INPUT_START: 1,
        INPUT_MOVE: 2,
        INPUT_END: 4,
        INPUT_CANCEL: 8,
        STATE_POSSIBLE: 1,
        STATE_BEGAN: 2,
        STATE_CHANGED: 4,
        STATE_ENDED: 8,
        STATE_RECOGNIZED: 8,
        STATE_CANCELLED: 16,
        STATE_FAILED: 32,
        DIRECTION_NONE: 1,
        DIRECTION_LEFT: 2,
        DIRECTION_RIGHT: 4,
        DIRECTION_UP: 8,
        DIRECTION_DOWN: 16,
        DIRECTION_HORIZONTAL: 6,
        DIRECTION_VERTICAL: 24,
        DIRECTION_ALL: 30,
        Manager: aa,
        Input: w,
        TouchAction: V,
        TouchInput: J,
        MouseInput: K,
        PointerEventInput: R,
        TouchMouseInput: S,
        SingleTouchInput: ia,
        Recognizer: E,
        AttrRecognizer: D,
        Tap: P,
        Pan: O,
        Swipe: Z,
        Pinch: W,
        Rotate: Y,
        Press: X,
        on: u,
        off: x,
        each: f,
        merge: r,
        extend: k,
        inherit: p,
        bindFn: A,
        prefixed: z
    });
    "function" == typeof define && define.amd ? define(function() {
        return F
    }) : "undefined" != typeof module && module.exports ? module.exports = F : a[c] = F
})(window, document, "Hammer");