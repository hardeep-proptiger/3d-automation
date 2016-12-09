void 0 === Date.now && (Date.now = function() {
    return (new Date).valueOf()
});
var TWEEN = TWEEN || function() {
        var a = [];
        return {
            REVISION: "14",
            getAll: function() {
                return a
            },
            removeAll: function() {
                a = []
            },
            add: function(b) {
                a.push(b)
            },
            remove: function(b) {
                b = a.indexOf(b); - 1 !== b && a.splice(b, 1)
            },
            update: function(b) {
                if (0 === a.length) return !1;
                var c = 0;
                for (b = void 0 !== b ? b : "undefined" !== typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now(); c < a.length;) a[c].update(b) ? c++ : a.splice(c, 1);
                return !0
            }
        }
    }();
TWEEN.Tween = function(a) {
    var b = {},
        c = {},
        d = {},
        e = 1E3,
        g = 0,
        f = !1,
        k = !1,
        r = 0,
        p = null,
        A = TWEEN.Easing.Linear.None,
        B = TWEEN.Interpolation.Linear,
        u = [],
        x = null,
        C = !1,
        y = null,
        h = null,
        l = null,
        t;
    for (t in a) b[t] = parseFloat(a[t], 10);
    this.to = function(a, b) {
        void 0 !== b && (e = b);
        c = a;
        return this
    };
    this.start = function(e) {
        TWEEN.add(this);
        k = !0;
        C = !1;
        p = void 0 !== e ? e : "undefined" !== typeof window && void 0 !== window.performance && void 0 !== window.performance.now ? window.performance.now() : Date.now();
        p += r;
        for (var f in c) {
            if (c[f] instanceof Array) {
                if (0 ===
                    c[f].length) continue;
                c[f] = [a[f]].concat(c[f])
            }
            b[f] = a[f];
            !1 === b[f] instanceof Array && (b[f] *= 1);
            d[f] = b[f] || 0
        }
        return this
    };
    this.stop = function() {
        if (!k) return this;
        TWEEN.remove(this);
        k = !1;
        null !== l && l.call(a);
        this.stopChainedTweens();
        return this
    };
    this.stopChainedTweens = function() {
        for (var a = 0, b = u.length; a < b; a++) u[a].stop()
    };
    this.delay = function(a) {
        r = a;
        return this
    };
    this.repeat = function(a) {
        g = a;
        return this
    };
    this.yoyo = function(a) {
        f = a;
        return this
    };
    this.easing = function(a) {
        A = a;
        return this
    };
    this.interpolation = function(a) {
        B =
            a;
        return this
    };
    this.chain = function() {
        u = arguments;
        return this
    };
    this.onStart = function(a) {
        x = a;
        return this
    };
    this.onUpdate = function(a) {
        y = a;
        return this
    };
    this.onComplete = function(a) {
        h = a;
        return this
    };
    this.onStop = function(a) {
        l = a;
        return this
    };
    this.update = function(k) {
        var n;
        if (k < p) return !0;
        !1 === C && (null !== x && x.call(a), C = !0);
        var l = (k - p) / e,
            l = 1 < l ? 1 : l,
            t = A(l);
        for (n in c) {
            var m = b[n] || 0,
                q = c[n];
            q instanceof Array ? a[n] = B(q, t) : ("string" === typeof q && (q = m + parseFloat(q, 10)), "number" === typeof q && (a[n] = m + (q - m) * t))
        }
        null !== y &&
        y.call(a, t);
        if (1 == l)
            if (0 < g) {
                isFinite(g) && g--;
                for (n in d) "string" === typeof c[n] && (d[n] += parseFloat(c[n], 10)), f && (l = d[n], d[n] = c[n], c[n] = l), b[n] = d[n];
                p = k + r
            } else {
                null !== h && h.call(a);
                n = 0;
                for (l = u.length; n < l; n++) u[n].start(k);
                return !1
            }
        return !0
    }
};
TWEEN.Easing = {
    Linear: {
        None: function(a) {
            return a
        }
    },
    Quadratic: {
        In: function(a) {
            return a * a
        },
        Out: function(a) {
            return a * (2 - a)
        },
        InOut: function(a) {
            return 1 > (a *= 2) ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
        }
    },
    Cubic: {
        In: function(a) {
            return a * a * a
        },
        Out: function(a) {
            return --a * a * a + 1
        },
        InOut: function(a) {
            return 1 > (a *= 2) ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
        }
    },
    Quartic: {
        In: function(a) {
            return a * a * a * a
        },
        Out: function(a) {
            return 1 - --a * a * a * a
        },
        InOut: function(a) {
            return 1 > (a *= 2) ? .5 * a * a * a * a : -.5 * ((a -= 2) * a * a * a - 2)
        }
    },
    Quintic: {
        In: function(a) {
            return a * a * a * a * a
        },
        Out: function(a) {
            return --a *
                a * a * a * a + 1
        },
        InOut: function(a) {
            return 1 > (a *= 2) ? .5 * a * a * a * a * a : .5 * ((a -= 2) * a * a * a * a + 2)
        }
    },
    Sinusoidal: {
        In: function(a) {
            return 1 - Math.cos(a * Math.PI / 2)
        },
        Out: function(a) {
            return Math.sin(a * Math.PI / 2)
        },
        InOut: function(a) {
            return .5 * (1 - Math.cos(Math.PI * a))
        }
    },
    Exponential: {
        In: function(a) {
            return 0 === a ? 0 : Math.pow(1024, a - 1)
        },
        Out: function(a) {
            return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
        },
        InOut: function(a) {
            return 0 === a ? 0 : 1 === a ? 1 : 1 > (a *= 2) ? .5 * Math.pow(1024, a - 1) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)
        }
    },
    Circular: {
        In: function(a) {
            return 1 - Math.sqrt(1 -
                    a * a)
        },
        Out: function(a) {
            return Math.sqrt(1 - --a * a)
        },
        InOut: function(a) {
            return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
        }
    },
    Elastic: {
        In: function(a) {
            var b, c = .1;
            if (0 === a) return 0;
            if (1 === a) return 1;
            !c || 1 > c ? (c = 1, b = .1) : b = .4 * Math.asin(1 / c) / (2 * Math.PI);
            return -(c * Math.pow(2, 10 * --a) * Math.sin(2 * (a - b) * Math.PI / .4))
        },
        Out: function(a) {
            var b, c = .1;
            if (0 === a) return 0;
            if (1 === a) return 1;
            !c || 1 > c ? (c = 1, b = .1) : b = .4 * Math.asin(1 / c) / (2 * Math.PI);
            return c * Math.pow(2, -10 * a) * Math.sin(2 * (a - b) * Math.PI / .4) + 1
        },
        InOut: function(a) {
            var b,
                c = .1;
            if (0 === a) return 0;
            if (1 === a) return 1;
            !c || 1 > c ? (c = 1, b = .1) : b = .4 * Math.asin(1 / c) / (2 * Math.PI);
            return 1 > (a *= 2) ? -.5 * c * Math.pow(2, 10 * --a) * Math.sin(2 * (a - b) * Math.PI / .4) : c * Math.pow(2, -10 * --a) * Math.sin(2 * (a - b) * Math.PI / .4) * .5 + 1
        }
    },
    Back: {
        In: function(a) {
            return a * a * (2.70158 * a - 1.70158)
        },
        Out: function(a) {
            return --a * a * (2.70158 * a + 1.70158) + 1
        },
        InOut: function(a) {
            return 1 > (a *= 2) ? .5 * a * a * (3.5949095 * a - 2.5949095) : .5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
        }
    },
    Bounce: {
        In: function(a) {
            return 1 - TWEEN.Easing.Bounce.Out(1 - a)
        },
        Out: function(a) {
            return a <
            1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
        },
        InOut: function(a) {
            return .5 > a ? .5 * TWEEN.Easing.Bounce.In(2 * a) : .5 * TWEEN.Easing.Bounce.Out(2 * a - 1) + .5
        }
    }
};
TWEEN.Interpolation = {
    Linear: function(a, b) {
        var c = a.length - 1,
            d = c * b,
            e = Math.floor(d),
            g = TWEEN.Interpolation.Utils.Linear;
        return 0 > b ? g(a[0], a[1], d) : 1 < b ? g(a[c], a[c - 1], c - d) : g(a[e], a[e + 1 > c ? c : e + 1], d - e)
    },
    Bezier: function(a, b) {
        var c = 0,
            d = a.length - 1,
            e = Math.pow,
            g = TWEEN.Interpolation.Utils.Bernstein,
            f;
        for (f = 0; f <= d; f++) c += e(1 - b, d - f) * e(b, f) * a[f] * g(d, f);
        return c
    },
    CatmullRom: function(a, b) {
        var c = a.length - 1,
            d = c * b,
            e = Math.floor(d),
            g = TWEEN.Interpolation.Utils.CatmullRom;
        return a[0] === a[c] ? (0 > b && (e = Math.floor(d = c * (1 + b))), g(a[(e -
        1 + c) % c], a[e], a[(e + 1) % c], a[(e + 2) % c], d - e)) : 0 > b ? a[0] - (g(a[0], a[0], a[1], a[1], -d) - a[0]) : 1 < b ? a[c] - (g(a[c], a[c], a[c - 1], a[c - 1], d - c) - a[c]) : g(a[e ? e - 1 : 0], a[e], a[c < e + 1 ? c : e + 1], a[c < e + 2 ? c : e + 2], d - e)
    },
    Utils: {
        Linear: function(a, b, c) {
            return (b - a) * c + a
        },
        Bernstein: function(a, b) {
            var c = TWEEN.Interpolation.Utils.Factorial;
            return c(a) / c(b) / c(a - b)
        },
        Factorial: function() {
            var a = [1];
            return function(b) {
                var c = 1,
                    d;
                if (a[b]) return a[b];
                for (d = b; 1 < d; d--) c *= d;
                return a[b] = c
            }
        }(),
        CatmullRom: function(a, b, c, d, e) {
            a = .5 * (c - a);
            d = .5 * (d - b);
            var g = e *
                e;
            return (2 * b - 2 * c + a + d) * e * g + (-3 * b + 3 * c - 2 * a - d) * g + a * e + b
        }
    }
};