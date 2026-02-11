window.__SUPASCRIBE_DATA = {
  userId: "m16egcE0zBUJa5thJ00Z2TUdSGh1",
  embeds: {
    716469371685: {
      id: 716469371685,
      type: "subscribe",
      settings: {
        theme: "custom",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
        substack: "mseelab.substack.com",
        layout: "row",
        colors: { primary: "rgba(255, 130, 0, 1)" },
      },
      theme: { primary: "rgba(255, 130, 0, 1)" },
      updatedAt: "2026-02-11T20:23:12.848Z",
    },
  },
  updatedAt: "2026-02-11T20:28:01.514Z",
};
var SupascribeWidget = (function () {
  "use strict";
  class I {
    constructor() {
      ((this.viewedEmbeds = new Set()),
        (this.VIEW_COOLDOWN_MS = 3e4),
        (this.SESSION_ID_KEY = "ss_sid"),
        (this.VIEWS_DAILY_KEY = "ss_vd"),
        (this.VIEWS_SESSION_KEY = "ss_vs"),
        (this.ADMIN_STATUS_KEY = "ss_adm"),
        (this.ADMIN_ATTEMPTS_KEY = "ss_att"),
        (this.ADMIN_THRESHOLD_VIEWS = 5),
        (this.ADMIN_THRESHOLD_WINDOW_MS = 36e5),
        (this.ADMIN_EXCLUSION_HOURS = 72),
        (this.sessionId = this.getOrCreateSessionId()));
    }
    getOrCreateSessionId() {
      try {
        const t = sessionStorage.getItem(this.SESSION_ID_KEY);
        if (t) return t;
        const e =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15) +
          Date.now().toString(36);
        return (sessionStorage.setItem(this.SESSION_ID_KEY, e), e);
      } catch {
        return (
          console.warn(
            "sessionStorage not available, using in-memory session ID",
          ),
          Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
      }
    }
    getTodayKey() {
      return new Date().toISOString().split("T")[0];
    }
    isAdminExcluded() {
      try {
        const t = localStorage.getItem(this.ADMIN_STATUS_KEY);
        if (!t) return !1;
        const e = JSON.parse(t),
          s = Date.now(),
          i = e.expiresAt || 0;
        return s >= i
          ? (localStorage.removeItem(this.ADMIN_STATUS_KEY),
            localStorage.removeItem(this.ADMIN_ATTEMPTS_KEY),
            !1)
          : !0;
      } catch {
        return !1;
      }
    }
    recordViewAttempt(t, e) {
      try {
        const s = Date.now(),
          i = `${t}_${e}`,
          r = localStorage.getItem(this.ADMIN_ATTEMPTS_KEY);
        let n = {};
        r && (n = JSON.parse(r));
        let a = n[i] || [];
        a.push({ timestamp: s });
        const o = s - this.ADMIN_THRESHOLD_WINDOW_MS;
        if (
          ((a = a.filter((S) => S.timestamp >= o)),
          a.length >= this.ADMIN_THRESHOLD_VIEWS)
        ) {
          const S = s + this.ADMIN_EXCLUSION_HOURS * 60 * 60 * 1e3;
          (localStorage.setItem(
            this.ADMIN_STATUS_KEY,
            JSON.stringify({
              detectedAt: s,
              expiresAt: S,
              viewCount: a.length,
              widgetPath: i,
            }),
          ),
            delete n[i],
            localStorage.setItem(this.ADMIN_ATTEMPTS_KEY, JSON.stringify(n)));
        } else
          ((n[i] = a),
            localStorage.setItem(this.ADMIN_ATTEMPTS_KEY, JSON.stringify(n)));
      } catch {}
    }
    async trackEvent(t, e, s) {
      var i;
      try {
        const n = {
          embed_type:
            (i = g.getInstance().getWidget(t)) == null ? void 0 : i.type,
          type: e,
          path: window.location.pathname,
          url: window.location.href,
          metadata: s || {},
          sid: this.sessionId,
        };
        typeof navigator < "u" &&
          navigator != null &&
          navigator.sendBeacon &&
          navigator.sendBeacon(
            `https://events.supascribe.com/collect/v1/embed/${t}`,
            JSON.stringify(n),
          );
      } catch (r) {
        console.warn("Error tracking event:", r);
      }
    }
    trackView(t) {
      if (this.isAdminExcluded()) return;
      const e = window.location.pathname,
        s = this.getTodayKey(),
        i = `${t}_${e}_${s}`,
        r = `${t}_${e}`,
        n = Date.now();
      try {
        if (
          (this.recordViewAttempt(t, e),
          this.isAdminExcluded() || this.viewedEmbeds.has(r))
        )
          return;
        const a = localStorage.getItem(this.VIEWS_DAILY_KEY);
        let o = {};
        a && (o = JSON.parse(a));
        const S = o[i];
        if (S) {
          if (S.viewed === !0) {
            this.viewedEmbeds.add(r);
            return;
          }
          const l = S.timestamp || 0;
          if (n - l < this.VIEW_COOLDOWN_MS) {
            ((o[i] = { viewed: !1, timestamp: n }),
              localStorage.setItem(this.VIEWS_DAILY_KEY, JSON.stringify(o)));
            return;
          }
        }
        const E = sessionStorage.getItem(this.VIEWS_SESSION_KEY);
        let d = {};
        E && (d = JSON.parse(E));
        const h = d[r];
        if (h) {
          const l = h.timestamp || 0,
            _ = n - l;
          if (h.viewed === !0) {
            this.viewedEmbeds.add(r);
            return;
          }
          if (_ < this.VIEW_COOLDOWN_MS) {
            ((d[r] = { viewed: !1, timestamp: n }),
              sessionStorage.setItem(
                this.VIEWS_SESSION_KEY,
                JSON.stringify(d),
              ));
            return;
          }
        }
        (this.viewedEmbeds.add(r),
          (o[i] = { viewed: !0, timestamp: n, date: s }),
          localStorage.setItem(this.VIEWS_DAILY_KEY, JSON.stringify(o)),
          (d[r] = { viewed: !0, timestamp: n }),
          sessionStorage.setItem(this.VIEWS_SESSION_KEY, JSON.stringify(d)),
          this.trackEvent(t, "view"));
      } catch {
        this.viewedEmbeds.has(r) ||
          (this.viewedEmbeds.add(r), this.trackEvent(t, "view"));
      }
    }
    trackClick(t, e) {
      var i;
      const s = e
        ? {
            postId: e.id,
            postTitle: e.title,
            postSlug:
              e.slug ||
              ((i = e.canonical_url) == null ? void 0 : i.split("/").pop()),
          }
        : {};
      this.trackEvent(t, "click", s);
    }
    trackSubmit(t, e, s) {
      const i = e ? { ...s, email: e } : s || {};
      this.trackEvent(t, "submit", i);
    }
  }
  const c = class c {
    constructor() {
      ((this.widgets = {}),
        (this.widgetFactories = new Map()),
        (this.version = "1.0.0"),
        (this.trackingManager = new I()));
    }
    static getInstance() {
      return (c.instance || (c.instance = new c()), c.instance);
    }
    register(t, e) {
      this.widgets[t] = e;
    }
    getWidget(t) {
      return this.widgets[t];
    }
    updateWidget(t, e) {
      this.widgets[t] && (this.widgets[t] = { ...this.widgets[t], ...e });
    }
    getUserId() {
      const t = window.__SUPASCRIBE_DATA;
      if (!(!t || !t.embeds)) return t.userId;
    }
    getWidgetData(t) {
      const e = window.__SUPASCRIBE_DATA;
      if (!(!e || !e.embeds)) return e.embeds[t];
    }
    refreshAll(t) {
      Object.values(this.widgets).forEach((e) => {
        e.refresh && typeof e.refresh == "function" && e.refresh(t);
      });
    }
    trackEvent(t, e, s) {
      this.trackingManager.trackEvent(t, e, s);
    }
    trackView(t) {
      this.trackingManager.trackView(t);
    }
    trackClick(t, e) {
      this.trackingManager.trackClick(t, e);
    }
    trackSubmit(t, e, s) {
      this.trackingManager.trackSubmit(t, e, s);
    }
    registerWidgetFactory(t, e) {
      this.widgetFactories.set(t, e);
    }
    createWidgetFromDOM(t, e, s) {
      const i = this.widgetFactories.get(s);
      if (!i) {
        console.error(`No factory registered for widget type: ${s}`);
        return;
      }
      const r = i(t, e);
      this.register(t, r);
    }
  };
  c.instance = null;
  let g = c;
  const m = g.getInstance();
  return ((window.Supascribe = m), m);
})();
(function () {
  "use strict";
  var A,
    g,
    re,
    S,
    ie,
    ne,
    oe,
    se,
    q,
    R,
    G,
    T = {},
    ae = [],
    Te = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
    F = Array.isArray;
  function N(e, t) {
    for (var r in t) e[r] = t[r];
    return e;
  }
  function Y(e) {
    e && e.parentNode && e.parentNode.removeChild(e);
  }
  function De(e, t, r) {
    var i,
      s,
      n,
      a = {};
    for (n in t)
      n == "key" ? (i = t[n]) : n == "ref" ? (s = t[n]) : (a[n] = t[n]);
    if (
      (arguments.length > 2 &&
        (a.children = arguments.length > 3 ? A.call(arguments, 2) : r),
      typeof e == "function" && e.defaultProps != null)
    )
      for (n in e.defaultProps) a[n] === void 0 && (a[n] = e.defaultProps[n]);
    return I(e, a, i, s, null);
  }
  function I(e, t, r, i, s) {
    var n = {
      type: e,
      props: t,
      key: r,
      ref: i,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __c: null,
      constructor: void 0,
      __v: s ?? ++re,
      __i: -1,
      __u: 0,
    };
    return (s == null && g.vnode != null && g.vnode(n), n);
  }
  function H(e) {
    return e.children;
  }
  function j(e, t) {
    ((this.props = e), (this.context = t));
  }
  function M(e, t) {
    if (t == null) return e.__ ? M(e.__, e.__i + 1) : null;
    for (var r; t < e.__k.length; t++)
      if ((r = e.__k[t]) != null && r.__e != null) return r.__e;
    return typeof e.type == "function" ? M(e) : null;
  }
  function _e(e) {
    var t, r;
    if ((e = e.__) != null && e.__c != null) {
      for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
        if ((r = e.__k[t]) != null && r.__e != null) {
          e.__e = e.__c.base = r.__e;
          break;
        }
      return _e(e);
    }
  }
  function ce(e) {
    ((!e.__d && (e.__d = !0) && S.push(e) && !W.__r++) ||
      ie != g.debounceRendering) &&
      ((ie = g.debounceRendering) || ne)(W);
  }
  function W() {
    for (var e, t, r, i, s, n, a, c = 1; S.length; )
      (S.length > c && S.sort(oe),
        (e = S.shift()),
        (c = S.length),
        e.__d &&
          ((r = void 0),
          (i = void 0),
          (s = (i = (t = e).__v).__e),
          (n = []),
          (a = []),
          t.__P &&
            (((r = N({}, i)).__v = i.__v + 1),
            g.vnode && g.vnode(r),
            Z(
              t.__P,
              r,
              i,
              t.__n,
              t.__P.namespaceURI,
              32 & i.__u ? [s] : null,
              n,
              s ?? M(i),
              !!(32 & i.__u),
              a,
            ),
            (r.__v = i.__v),
            (r.__.__k[r.__i] = r),
            fe(n, r, a),
            (i.__e = i.__ = null),
            r.__e != s && _e(r))));
    W.__r = 0;
  }
  function le(e, t, r, i, s, n, a, c, u, _, p) {
    var o,
      l,
      d,
      b,
      x,
      v,
      h,
      w = (i && i.__k) || ae,
      $ = t.length;
    for (u = Ue(r, t, w, u, $), o = 0; o < $; o++)
      (d = r.__k[o]) != null &&
        ((l = d.__i == -1 ? T : w[d.__i] || T),
        (d.__i = o),
        (v = Z(e, d, l, s, n, a, c, u, _, p)),
        (b = d.__e),
        d.ref &&
          l.ref != d.ref &&
          (l.ref && K(l.ref, null, d), p.push(d.ref, d.__c || b, d)),
        x == null && b != null && (x = b),
        (h = !!(4 & d.__u)) || l.__k === d.__k
          ? (u = de(d, u, e, h))
          : typeof d.type == "function" && v !== void 0
            ? (u = v)
            : b && (u = b.nextSibling),
        (d.__u &= -7));
    return ((r.__e = x), u);
  }
  function Ue(e, t, r, i, s) {
    var n,
      a,
      c,
      u,
      _,
      p = r.length,
      o = p,
      l = 0;
    for (e.__k = new Array(s), n = 0; n < s; n++)
      (a = t[n]) != null && typeof a != "boolean" && typeof a != "function"
        ? ((u = n + l),
          ((a = e.__k[n] =
            typeof a == "string" ||
            typeof a == "number" ||
            typeof a == "bigint" ||
            a.constructor == String
              ? I(null, a, null, null, null)
              : F(a)
                ? I(H, { children: a }, null, null, null)
                : a.constructor == null && a.__b > 0
                  ? I(a.type, a.props, a.key, a.ref ? a.ref : null, a.__v)
                  : a).__ = e),
          (a.__b = e.__b + 1),
          (c = null),
          (_ = a.__i = Pe(a, r, u, o)) != -1 &&
            (o--, (c = r[_]) && (c.__u |= 2)),
          c == null || c.__v == null
            ? (_ == -1 && (s > p ? l-- : s < p && l++),
              typeof a.type != "function" && (a.__u |= 4))
            : _ != u &&
              (_ == u - 1
                ? l--
                : _ == u + 1
                  ? l++
                  : (_ > u ? l-- : l++, (a.__u |= 4))))
        : (e.__k[n] = null);
    if (o)
      for (n = 0; n < p; n++)
        (c = r[n]) != null &&
          !(2 & c.__u) &&
          (c.__e == i && (i = M(c)), he(c, c));
    return i;
  }
  function de(e, t, r, i) {
    var s, n;
    if (typeof e.type == "function") {
      for (s = e.__k, n = 0; s && n < s.length; n++)
        s[n] && ((s[n].__ = e), (t = de(s[n], t, r, i)));
      return t;
    }
    e.__e != t &&
      (i &&
        (t && e.type && !t.parentNode && (t = M(e)),
        r.insertBefore(e.__e, t || null)),
      (t = e.__e));
    do t = t && t.nextSibling;
    while (t != null && t.nodeType == 8);
    return t;
  }
  function Pe(e, t, r, i) {
    var s,
      n,
      a,
      c = e.key,
      u = e.type,
      _ = t[r],
      p = _ != null && (2 & _.__u) == 0;
    if ((_ === null && e.key == null) || (p && c == _.key && u == _.type))
      return r;
    if (i > (p ? 1 : 0)) {
      for (s = r - 1, n = r + 1; s >= 0 || n < t.length; )
        if (
          (_ = t[(a = s >= 0 ? s-- : n++)]) != null &&
          !(2 & _.__u) &&
          c == _.key &&
          u == _.type
        )
          return a;
    }
    return -1;
  }
  function ue(e, t, r) {
    t[0] == "-"
      ? e.setProperty(t, r ?? "")
      : (e[t] =
          r == null ? "" : typeof r != "number" || Te.test(t) ? r : r + "px");
  }
  function L(e, t, r, i, s) {
    var n, a;
    e: if (t == "style")
      if (typeof r == "string") e.style.cssText = r;
      else {
        if ((typeof i == "string" && (e.style.cssText = i = ""), i))
          for (t in i) (r && t in r) || ue(e.style, t, "");
        if (r) for (t in r) (i && r[t] == i[t]) || ue(e.style, t, r[t]);
      }
    else if (t[0] == "o" && t[1] == "n")
      ((n = t != (t = t.replace(se, "$1"))),
        (a = t.toLowerCase()),
        (t =
          a in e || t == "onFocusOut" || t == "onFocusIn"
            ? a.slice(2)
            : t.slice(2)),
        e.l || (e.l = {}),
        (e.l[t + n] = r),
        r
          ? i
            ? (r.u = i.u)
            : ((r.u = q), e.addEventListener(t, n ? G : R, n))
          : e.removeEventListener(t, n ? G : R, n));
    else {
      if (s == "http://www.w3.org/2000/svg")
        t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (
        t != "width" &&
        t != "height" &&
        t != "href" &&
        t != "list" &&
        t != "form" &&
        t != "tabIndex" &&
        t != "download" &&
        t != "rowSpan" &&
        t != "colSpan" &&
        t != "role" &&
        t != "popover" &&
        t in e
      )
        try {
          e[t] = r ?? "";
          break e;
        } catch {}
      typeof r == "function" ||
        (r == null || (r === !1 && t[4] != "-")
          ? e.removeAttribute(t)
          : e.setAttribute(t, t == "popover" && r == 1 ? "" : r));
    }
  }
  function pe(e) {
    return function (t) {
      if (this.l) {
        var r = this.l[t.type + e];
        if (t.t == null) t.t = q++;
        else if (t.t < r.u) return;
        return r(g.event ? g.event(t) : t);
      }
    };
  }
  function Z(e, t, r, i, s, n, a, c, u, _) {
    var p,
      o,
      l,
      d,
      b,
      x,
      v,
      h,
      w,
      $,
      C,
      z,
      U,
      Ee,
      O,
      P,
      te,
      k = t.type;
    if (t.constructor != null) return null;
    (128 & r.__u && ((u = !!(32 & r.__u)), (n = [(c = t.__e = r.__e)])),
      (p = g.__b) && p(t));
    e: if (typeof k == "function")
      try {
        if (
          ((h = t.props),
          (w = "prototype" in k && k.prototype.render),
          ($ = (p = k.contextType) && i[p.__c]),
          (C = p ? ($ ? $.props.value : p.__) : i),
          r.__c
            ? (v = (o = t.__c = r.__c).__ = o.__E)
            : (w
                ? (t.__c = o = new k(h, C))
                : ((t.__c = o = new j(h, C)),
                  (o.constructor = k),
                  (o.render = Fe)),
              $ && $.sub(o),
              (o.props = h),
              o.state || (o.state = {}),
              (o.context = C),
              (o.__n = i),
              (l = o.__d = !0),
              (o.__h = []),
              (o._sb = [])),
          w && o.__s == null && (o.__s = o.state),
          w &&
            k.getDerivedStateFromProps != null &&
            (o.__s == o.state && (o.__s = N({}, o.__s)),
            N(o.__s, k.getDerivedStateFromProps(h, o.__s))),
          (d = o.props),
          (b = o.state),
          (o.__v = t),
          l)
        )
          (w &&
            k.getDerivedStateFromProps == null &&
            o.componentWillMount != null &&
            o.componentWillMount(),
            w &&
              o.componentDidMount != null &&
              o.__h.push(o.componentDidMount));
        else {
          if (
            (w &&
              k.getDerivedStateFromProps == null &&
              h !== d &&
              o.componentWillReceiveProps != null &&
              o.componentWillReceiveProps(h, C),
            (!o.__e &&
              o.shouldComponentUpdate != null &&
              o.shouldComponentUpdate(h, o.__s, C) === !1) ||
              t.__v == r.__v)
          ) {
            for (
              t.__v != r.__v &&
                ((o.props = h), (o.state = o.__s), (o.__d = !1)),
                t.__e = r.__e,
                t.__k = r.__k,
                t.__k.some(function (E) {
                  E && (E.__ = t);
                }),
                z = 0;
              z < o._sb.length;
              z++
            )
              o.__h.push(o._sb[z]);
            ((o._sb = []), o.__h.length && a.push(o));
            break e;
          }
          (o.componentWillUpdate != null && o.componentWillUpdate(h, o.__s, C),
            w &&
              o.componentDidUpdate != null &&
              o.__h.push(function () {
                o.componentDidUpdate(d, b, x);
              }));
        }
        if (
          ((o.context = C),
          (o.props = h),
          (o.__P = e),
          (o.__e = !1),
          (U = g.__r),
          (Ee = 0),
          w)
        ) {
          for (
            o.state = o.__s,
              o.__d = !1,
              U && U(t),
              p = o.render(o.props, o.state, o.context),
              O = 0;
            O < o._sb.length;
            O++
          )
            o.__h.push(o._sb[O]);
          o._sb = [];
        } else
          do
            ((o.__d = !1),
              U && U(t),
              (p = o.render(o.props, o.state, o.context)),
              (o.state = o.__s));
          while (o.__d && ++Ee < 25);
        ((o.state = o.__s),
          o.getChildContext != null && (i = N(N({}, i), o.getChildContext())),
          w &&
            !l &&
            o.getSnapshotBeforeUpdate != null &&
            (x = o.getSnapshotBeforeUpdate(d, b)),
          (P = p),
          p != null &&
            p.type === H &&
            p.key == null &&
            (P = ge(p.props.children)),
          (c = le(e, F(P) ? P : [P], t, r, i, s, n, a, c, u, _)),
          (o.base = t.__e),
          (t.__u &= -161),
          o.__h.length && a.push(o),
          v && (o.__E = o.__ = null));
      } catch (E) {
        if (((t.__v = null), u || n != null))
          if (E.then) {
            for (
              t.__u |= u ? 160 : 128;
              c && c.nodeType == 8 && c.nextSibling;

            )
              c = c.nextSibling;
            ((n[n.indexOf(c)] = null), (t.__e = c));
          } else {
            for (te = n.length; te--; ) Y(n[te]);
            J(t);
          }
        else ((t.__e = r.__e), (t.__k = r.__k), E.then || J(t));
        g.__e(E, t, r);
      }
    else
      n == null && t.__v == r.__v
        ? ((t.__k = r.__k), (t.__e = r.__e))
        : (c = t.__e = Ae(r.__e, t, r, i, s, n, a, u, _));
    return ((p = g.diffed) && p(t), 128 & t.__u ? void 0 : c);
  }
  function J(e) {
    (e && e.__c && (e.__c.__e = !0), e && e.__k && e.__k.forEach(J));
  }
  function fe(e, t, r) {
    for (var i = 0; i < r.length; i++) K(r[i], r[++i], r[++i]);
    (g.__c && g.__c(t, e),
      e.some(function (s) {
        try {
          ((e = s.__h),
            (s.__h = []),
            e.some(function (n) {
              n.call(s);
            }));
        } catch (n) {
          g.__e(n, s.__v);
        }
      }));
  }
  function ge(e) {
    return typeof e != "object" || e == null || (e.__b && e.__b > 0)
      ? e
      : F(e)
        ? e.map(ge)
        : N({}, e);
  }
  function Ae(e, t, r, i, s, n, a, c, u) {
    var _,
      p,
      o,
      l,
      d,
      b,
      x,
      v = r.props,
      h = t.props,
      w = t.type;
    if (
      (w == "svg"
        ? (s = "http://www.w3.org/2000/svg")
        : w == "math"
          ? (s = "http://www.w3.org/1998/Math/MathML")
          : s || (s = "http://www.w3.org/1999/xhtml"),
      n != null)
    ) {
      for (_ = 0; _ < n.length; _++)
        if (
          (d = n[_]) &&
          "setAttribute" in d == !!w &&
          (w ? d.localName == w : d.nodeType == 3)
        ) {
          ((e = d), (n[_] = null));
          break;
        }
    }
    if (e == null) {
      if (w == null) return document.createTextNode(h);
      ((e = document.createElementNS(s, w, h.is && h)),
        c && (g.__m && g.__m(t, n), (c = !1)),
        (n = null));
    }
    if (w == null) v === h || (c && e.data == h) || (e.data = h);
    else {
      if (
        ((n = n && A.call(e.childNodes)), (v = r.props || T), !c && n != null)
      )
        for (v = {}, _ = 0; _ < e.attributes.length; _++)
          v[(d = e.attributes[_]).name] = d.value;
      for (_ in v)
        if (((d = v[_]), _ != "children")) {
          if (_ == "dangerouslySetInnerHTML") o = d;
          else if (!(_ in h)) {
            if (
              (_ == "value" && "defaultValue" in h) ||
              (_ == "checked" && "defaultChecked" in h)
            )
              continue;
            L(e, _, null, d, s);
          }
        }
      for (_ in h)
        ((d = h[_]),
          _ == "children"
            ? (l = d)
            : _ == "dangerouslySetInnerHTML"
              ? (p = d)
              : _ == "value"
                ? (b = d)
                : _ == "checked"
                  ? (x = d)
                  : (c && typeof d != "function") ||
                    v[_] === d ||
                    L(e, _, d, v[_], s));
      if (p)
        (c ||
          (o && (p.__html == o.__html || p.__html == e.innerHTML)) ||
          (e.innerHTML = p.__html),
          (t.__k = []));
      else if (
        (o && (e.innerHTML = ""),
        le(
          t.type == "template" ? e.content : e,
          F(l) ? l : [l],
          t,
          r,
          i,
          w == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s,
          n,
          a,
          n ? n[0] : r.__k && M(r, 0),
          c,
          u,
        ),
        n != null)
      )
        for (_ = n.length; _--; ) Y(n[_]);
      c ||
        ((_ = "value"),
        w == "progress" && b == null
          ? e.removeAttribute("value")
          : b != null &&
            (b !== e[_] ||
              (w == "progress" && !b) ||
              (w == "option" && b != v[_])) &&
            L(e, _, b, v[_], s),
        (_ = "checked"),
        x != null && x != e[_] && L(e, _, x, v[_], s));
    }
    return e;
  }
  function K(e, t, r) {
    try {
      if (typeof e == "function") {
        var i = typeof e.__u == "function";
        (i && e.__u(), (i && t == null) || (e.__u = e(t)));
      } else e.current = t;
    } catch (s) {
      g.__e(s, r);
    }
  }
  function he(e, t, r) {
    var i, s;
    if (
      (g.unmount && g.unmount(e),
      (i = e.ref) && ((i.current && i.current != e.__e) || K(i, null, t)),
      (i = e.__c) != null)
    ) {
      if (i.componentWillUnmount)
        try {
          i.componentWillUnmount();
        } catch (n) {
          g.__e(n, t);
        }
      i.base = i.__P = null;
    }
    if ((i = e.__k))
      for (s = 0; s < i.length; s++)
        i[s] && he(i[s], t, r || typeof e.type != "function");
    (r || Y(e.__e), (e.__c = e.__ = e.__e = void 0));
  }
  function Fe(e, t, r) {
    return this.constructor(e, r);
  }
  function we(e, t, r) {
    var i, s, n, a;
    (t == document && (t = document.documentElement),
      g.__ && g.__(e, t),
      (s = (i = !1) ? null : t.__k),
      (n = []),
      (a = []),
      Z(
        t,
        (e = t.__k = De(H, null, [e])),
        s || T,
        T,
        t.namespaceURI,
        s ? null : t.firstChild ? A.call(t.childNodes) : null,
        n,
        s ? s.__e : t.firstChild,
        i,
        a,
      ),
      fe(n, e, a));
  }
  ((A = ae.slice),
    (g = {
      __e: function (e, t, r, i) {
        for (var s, n, a; (t = t.__); )
          if ((s = t.__c) && !s.__)
            try {
              if (
                ((n = s.constructor) &&
                  n.getDerivedStateFromError != null &&
                  (s.setState(n.getDerivedStateFromError(e)), (a = s.__d)),
                s.componentDidCatch != null &&
                  (s.componentDidCatch(e, i || {}), (a = s.__d)),
                a)
              )
                return (s.__E = s);
            } catch (c) {
              e = c;
            }
        throw e;
      },
    }),
    (re = 0),
    (j.prototype.setState = function (e, t) {
      var r;
      ((r =
        this.__s != null && this.__s != this.state
          ? this.__s
          : (this.__s = N({}, this.state))),
        typeof e == "function" && (e = e(N({}, r), this.props)),
        e && N(r, e),
        e != null && this.__v && (t && this._sb.push(t), ce(this)));
    }),
    (j.prototype.forceUpdate = function (e) {
      this.__v && ((this.__e = !0), e && this.__h.push(e), ce(this));
    }),
    (j.prototype.render = H),
    (S = []),
    (ne =
      typeof Promise == "function"
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout),
    (oe = function (e, t) {
      return e.__v.__b - t.__v.__b;
    }),
    (W.__r = 0),
    (se = /(PointerCapture)$|Capture$/i),
    (q = 0),
    (R = pe(!1)),
    (G = pe(!0)));
  var Ie = 0;
  function f(e, t, r, i, s, n) {
    t || (t = {});
    var a,
      c,
      u = t;
    if ("ref" in u)
      for (c in ((u = {}), t)) c == "ref" ? (a = t[c]) : (u[c] = t[c]);
    var _ = {
      type: e,
      props: u,
      key: r,
      ref: a,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __c: null,
      constructor: void 0,
      __v: --Ie,
      __i: -1,
      __u: 0,
      __source: s,
      __self: n,
    };
    if (typeof e == "function" && (a = e.defaultProps))
      for (c in a) u[c] === void 0 && (u[c] = a[c]);
    return (g.vnode && g.vnode(_), _);
  }
  var D,
    m,
    Q,
    be,
    B = 0,
    me = [],
    y = g,
    ve = y.__b,
    ye = y.__r,
    xe = y.diffed,
    ke = y.__c,
    Ne = y.unmount,
    $e = y.__;
  function X(e, t) {
    (y.__h && y.__h(m, e, B || t), (B = 0));
    var r = m.__H || (m.__H = { __: [], __h: [] });
    return (e >= r.__.length && r.__.push({}), r.__[e]);
  }
  function je(e) {
    return ((B = 1), We(He, e));
  }
  function We(e, t, r) {
    var i = X(D++, 2);
    if (
      ((i.t = e),
      !i.__c &&
        ((i.__ = [
          He(void 0, t),
          function (c) {
            var u = i.__N ? i.__N[0] : i.__[0],
              _ = i.t(u, c);
            u !== _ && ((i.__N = [_, i.__[1]]), i.__c.setState({}));
          },
        ]),
        (i.__c = m),
        !m.__f))
    ) {
      var s = function (c, u, _) {
        if (!i.__c.__H) return !0;
        var p = i.__c.__H.__.filter(function (l) {
          return !!l.__c;
        });
        if (
          p.every(function (l) {
            return !l.__N;
          })
        )
          return !n || n.call(this, c, u, _);
        var o = i.__c.props !== c;
        return (
          p.forEach(function (l) {
            if (l.__N) {
              var d = l.__[0];
              ((l.__ = l.__N), (l.__N = void 0), d !== l.__[0] && (o = !0));
            }
          }),
          (n && n.call(this, c, u, _)) || o
        );
      };
      m.__f = !0;
      var n = m.shouldComponentUpdate,
        a = m.componentWillUpdate;
      ((m.componentWillUpdate = function (c, u, _) {
        if (this.__e) {
          var p = n;
          ((n = void 0), s(c, u, _), (n = p));
        }
        a && a.call(this, c, u, _);
      }),
        (m.shouldComponentUpdate = s));
    }
    return i.__N || i.__;
  }
  function Le(e, t) {
    var r = X(D++, 3);
    !y.__s && Se(r.__H, t) && ((r.__ = e), (r.u = t), m.__H.__h.push(r));
  }
  function Be(e) {
    return (
      (B = 5),
      Ve(function () {
        return { current: e };
      }, [])
    );
  }
  function Ve(e, t) {
    var r = X(D++, 7);
    return (Se(r.__H, t) && ((r.__ = e()), (r.__H = t), (r.__h = e)), r.__);
  }
  function ze() {
    for (var e; (e = me.shift()); )
      if (e.__P && e.__H)
        try {
          (e.__H.__h.forEach(V), e.__H.__h.forEach(ee), (e.__H.__h = []));
        } catch (t) {
          ((e.__H.__h = []), y.__e(t, e.__v));
        }
  }
  ((y.__b = function (e) {
    ((m = null), ve && ve(e));
  }),
    (y.__ = function (e, t) {
      (e && t.__k && t.__k.__m && (e.__m = t.__k.__m), $e && $e(e, t));
    }),
    (y.__r = function (e) {
      (ye && ye(e), (D = 0));
      var t = (m = e.__c).__H;
      (t &&
        (Q === m
          ? ((t.__h = []),
            (m.__h = []),
            t.__.forEach(function (r) {
              (r.__N && (r.__ = r.__N), (r.u = r.__N = void 0));
            }))
          : (t.__h.forEach(V), t.__h.forEach(ee), (t.__h = []), (D = 0))),
        (Q = m));
    }),
    (y.diffed = function (e) {
      xe && xe(e);
      var t = e.__c;
      (t &&
        t.__H &&
        (t.__H.__h.length &&
          ((me.push(t) !== 1 && be === y.requestAnimationFrame) ||
            ((be = y.requestAnimationFrame) || Oe)(ze)),
        t.__H.__.forEach(function (r) {
          (r.u && (r.__H = r.u), (r.u = void 0));
        })),
        (Q = m = null));
    }),
    (y.__c = function (e, t) {
      (t.some(function (r) {
        try {
          (r.__h.forEach(V),
            (r.__h = r.__h.filter(function (i) {
              return !i.__ || ee(i);
            })));
        } catch (i) {
          (t.some(function (s) {
            s.__h && (s.__h = []);
          }),
            (t = []),
            y.__e(i, r.__v));
        }
      }),
        ke && ke(e, t));
    }),
    (y.unmount = function (e) {
      Ne && Ne(e);
      var t,
        r = e.__c;
      r &&
        r.__H &&
        (r.__H.__.forEach(function (i) {
          try {
            V(i);
          } catch (s) {
            t = s;
          }
        }),
        (r.__H = void 0),
        t && y.__e(t, r.__v));
    }));
  var Ce = typeof requestAnimationFrame == "function";
  function Oe(e) {
    var t,
      r = function () {
        (clearTimeout(i), Ce && cancelAnimationFrame(t), setTimeout(e));
      },
      i = setTimeout(r, 35);
    Ce && (t = requestAnimationFrame(r));
  }
  function V(e) {
    var t = m,
      r = e.__c;
    (typeof r == "function" && ((e.__c = void 0), r()), (m = t));
  }
  function ee(e) {
    var t = m;
    ((e.__c = e.__()), (m = t));
  }
  function Se(e, t) {
    return (
      !e ||
      e.length !== t.length ||
      t.some(function (r, i) {
        return r !== e[i];
      })
    );
  }
  function He(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  const qe =
      '.supascribe-feed-widget p{margin:0}.supascribe-feed-widget svg{display:block;vertical-align:middle}.supascribe-feed-widget .sfw-title svg{display:inline-block;transform:translateY(2px);vertical-align:initial}.supascribe-widget .visible{visibility:visible}.supascribe-widget .static{position:static}.supascribe-widget .relative{position:relative}.supascribe-widget .mx-auto{margin-left:auto;margin-right:auto}.supascribe-widget .mb-4{margin-bottom:16px}.supascribe-widget .mb-8{margin-bottom:32px}.supascribe-widget .mr-1{margin-right:4px}.supascribe-widget .mr-2{margin-right:8px}.supascribe-widget .mt-4{margin-top:16px}.supascribe-widget .box-border{box-sizing:border-box}.supascribe-widget .line-clamp-3{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:3}.supascribe-widget .block{display:block}.supascribe-widget .inline{display:inline}.supascribe-widget .flex{display:flex}.supascribe-widget .hidden{display:none}.supascribe-widget .h-20{height:80px}.supascribe-widget .h-5{height:20px}.supascribe-widget .h-6{height:24px}.supascribe-widget .w-20{width:80px}.supascribe-widget .w-5{width:20px}.supascribe-widget .w-full{width:100%}.supascribe-widget .flex-1{flex:1 1 0%}@keyframes spin{to{transform:rotate(1turn)}}.supascribe-widget .animate-spin{animation:spin 1s linear infinite}.supascribe-widget .select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.supascribe-widget .flex-row{flex-direction:row}.supascribe-widget .flex-row-reverse{flex-direction:row-reverse}.supascribe-widget .flex-col{flex-direction:column}.supascribe-widget .flex-wrap{flex-wrap:wrap}.supascribe-widget .flex-nowrap{flex-wrap:nowrap}.supascribe-widget .items-center{align-items:center}.supascribe-widget .gap-1{gap:4px}.supascribe-widget .gap-4{gap:16px}.supascribe-widget :is(.space-x-2>:not([hidden])~:not([hidden])){--tw-space-x-reverse:0;margin-left:calc(8px*(1 - var(--tw-space-x-reverse)));margin-right:calc(8px*var(--tw-space-x-reverse))}.supascribe-widget :is(.space-y-12>:not([hidden])~:not([hidden])){--tw-space-y-reverse:0;margin-bottom:calc(48px*var(--tw-space-y-reverse));margin-top:calc(48px*(1 - var(--tw-space-y-reverse)))}.supascribe-widget .text-ellipsis{text-overflow:ellipsis}.supascribe-widget .whitespace-nowrap{white-space:nowrap}.supascribe-widget .rounded{border-radius:4px}.supascribe-widget .rounded-lg{border-radius:8px}.supascribe-widget .border{border-width:1px}.supascribe-widget .bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-current{background-color:currentColor}.supascribe-widget .bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity,1))}.supascribe-widget .bg-green-600{--tw-bg-opacity:1;background-color:rgb(22 163 74/var(--tw-bg-opacity,1))}.supascribe-widget .bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.supascribe-widget .bg-cover{background-size:cover}.supascribe-widget .bg-center{background-position:50%}.supascribe-widget .bg-no-repeat{background-repeat:no-repeat}.supascribe-widget .p-1{padding:4px}.supascribe-widget .p-2{padding:8px}.supascribe-widget .p-6{padding:24px}.supascribe-widget .px-3{padding-left:12px;padding-right:12px}.supascribe-widget .px-4{padding-left:16px;padding-right:16px}.supascribe-widget .py-2{padding-bottom:8px;padding-top:8px}.supascribe-widget .py-3{padding-bottom:12px;padding-top:12px}.supascribe-widget .py-8{padding-bottom:32px;padding-top:32px}.supascribe-widget .pb-\\[56\\.25\\%\\]{padding-bottom:56.25%}.supascribe-widget .font-sans{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.supascribe-widget .text-2xl{font-size:24px;line-height:32px}.supascribe-widget .text-3xl{font-size:30px;line-height:36px}.supascribe-widget .text-lg{font-size:18px;line-height:28px}.supascribe-widget .text-xs{font-size:12px;line-height:16px}.supascribe-widget .font-bold{font-weight:700}.supascribe-widget .font-light{font-weight:300}.supascribe-widget .font-semibold{font-weight:600}.supascribe-widget .uppercase{text-transform:uppercase}.supascribe-widget .leading-6{line-height:24px}.supascribe-widget .tracking-wider{letter-spacing:.05em}.supascribe-widget .text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity,1))}.supascribe-widget .text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.supascribe-widget .opacity-25{opacity:.25}.supascribe-widget .shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.supascribe-widget .filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.sfw-theme-default{--sfw-primary-color:#404040;--sfw-secondary-color:#707070;--sfw-background-color:#fff}.sfw-theme-default>a:hover{background-color:#8080800d}.supascribe-feed-widget a,.supascribe-feed-widget a:hover{color:inherit;text-decoration:inherit}.sfw-layout-center{display:grid;gap:4px;grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr))}.supascribe-feed-widget{background-color:var(--sfw-background-color);border-radius:6px;color:var(--sfw-secondary-color);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;width:100%}.supascribe-feed-widget .sfw-title{color:var(--sfw-primary-color)}.supascribe-feed-widget .post-silhouette div{background-color:#fff;border-radius:4px;overflow:hidden;position:relative}.supascribe-feed-widget .post-silhouette>div:first-child:after,.supascribe-feed-widget .post-silhouette>div>div:after{animation:silhouette-scroll 1s linear infinite;background-image:linear-gradient(90deg,#eee,#fff,#eee);background-repeat:repeat-x;background-size:50% 100%;content:"";display:block;height:100%;left:0;position:absolute;top:0;width:200%}@keyframes silhouette-scroll{0%{transform:translate(-50%)}50%{transform:translate(-25%)}to{transform:translate(0)}}.supascribe-widget .hover\\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity,1))}.supascribe-widget .hover\\:bg-green-700:hover{--tw-bg-opacity:1;background-color:rgb(21 128 61/var(--tw-bg-opacity,1))}@media (min-width:640px){.supascribe-widget .sm\\:px-4{padding-left:16px;padding-right:16px}}@media (min-width:768px){.supascribe-widget .md\\:h-\\[100px\\]{height:100px}.supascribe-widget .md\\:w-\\[130px\\]{width:130px}}@media (min-width:1024px){.supascribe-widget .lg\\:h-\\[124px\\]{height:124px}.supascribe-widget .lg\\:w-\\[164px\\]{width:164px}}',
    Re = (e) => {
      if (e == null) return null;
      if (typeof e == "number" && Number.isFinite(e)) {
        const t = e < 1e12 ? e * 1e3 : e,
          r = new Date(t);
        return Number.isNaN(r.getTime()) ? null : r;
      }
      if (typeof e == "string") {
        const t = e.trim();
        if (!t) return null;
        const r = Number(t);
        if (Number.isFinite(r)) {
          const s = r < 1e12 ? r * 1e3 : r,
            n = new Date(s);
          return Number.isNaN(n.getTime()) ? null : n;
        }
        const i = new Date(t);
        return Number.isNaN(i.getTime()) ? null : i;
      }
      return null;
    },
    Ge = (e) => {
      const t = Re(e);
      if (!t) return "";
      const r = Date.now(),
        i = r - t.getTime();
      if (i < 0)
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year:
            t.getFullYear() === new Date(r).getFullYear() ? void 0 : "numeric",
        })
          .format(t)
          .toUpperCase();
      const s = Math.floor(i / 6e4),
        n = Math.floor(i / 36e5),
        a = Math.floor(i / 864e5);
      return s < 1
        ? "JUST NOW"
        : n < 1
          ? `${s} MIN AGO`
          : n < 24
            ? `${n} HR AGO`
            : new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: a >= 365 ? "numeric" : void 0,
              })
                .format(t)
                .toUpperCase();
    },
    Ye = (e) => {
      const t = e.posts || [],
        r = e.layout || "left",
        i = e.hidden || [],
        s = e.colors,
        n = e.theme || "default",
        a = e.embedId,
        [c, u] = je(!1),
        _ = Be(null),
        p = (l) =>
          typeof l == "string"
            ? i.indexOf(l) === -1
            : l.some((d) => i.indexOf(d) === -1),
        o = (l) => {
          a && window.Supascribe && window.Supascribe.trackClick(a, l);
        };
      return (
        Le(() => {
          if (!a || !window.Supascribe || c) return;
          const l = new IntersectionObserver(
            (d) => {
              d.forEach((b) => {
                b.isIntersecting &&
                  !c &&
                  (window.Supascribe.trackView(a), u(!0), l.disconnect());
              });
            },
            { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
          );
          return (
            _.current && l.observe(_.current),
            () => {
              l.disconnect();
            }
          );
        }, [a, c]),
        f(H, {
          children: [
            f("style", { children: qe }),
            n === "custom" &&
              f("style", {
                children: `[data-supascribe-embed-id="${a}"] .sfw-theme-custom{
            --sfw-background-color:${s.background};
            --sfw-primary-color:${s.primary};
            --sfw-secondary-color:${s.secondary};
          }`,
              }),
            f("div", {
              ref: _,
              className: `supascribe-widget supascribe-feed-widget sfw-theme-${n} sfw-layout-${r}`,
              children:
                t == null
                  ? void 0
                  : t.map((l) => {
                      var d, b, x, v;
                      return f(
                        "a",
                        {
                          href: l.canonical_url,
                          target: "_blank",
                          className: `flex ${r === "left" ? "flex-row-reverse" : ""} w-full flex-wrap gap-4 ${r === "center" ? "flex-col p-2 rounded" : "px-3 py-3 sm:px-4"} select-none box-border`,
                          rel: "noopener noreferrer",
                          onClick: () => o(l),
                          children: [
                            p("image") &&
                              l.cover_image &&
                              f("div", {
                                className: `${r === "center" ? "w-full pb-[56.25%]" : "w-20 h-20 md:w-[130px] md:h-[100px] lg:w-[164px] lg:h-[124px]"} bg-gray-200 bg-current bg-no-repeat rounded bg-center bg-cover`,
                                style: {
                                  backgroundImage: `url(${l.cover_image.includes("https://substackcdn.com/image/fetch") ? l.cover_image : "https://substackcdn.com/image/fetch/w_600,f_auto,q_auto:good,fl_progressive:steep/" + l.cover_image})`,
                                  display: "block",
                                },
                              }),
                            f("div", {
                              className:
                                "flex flex-col flex-1 gap-1 font-light",
                              children: [
                                f("div", {
                                  className: "flex flex-col gap-1 leading-6",
                                  children: [
                                    p("title") &&
                                      f("div", {
                                        className:
                                          "text-lg font-bold sfw-title",
                                        children: [
                                          l.type === "podcast"
                                            ? f(Ze, {})
                                            : l.type === "thread"
                                              ? f(Je, {})
                                              : f(H, {}),
                                          f("span", {
                                            dangerouslySetInnerHTML: {
                                              __html: l.title,
                                            },
                                          }),
                                        ],
                                      }),
                                    p("subtitle") &&
                                      f("p", {
                                        className: "line-clamp-3 text-ellipsis",
                                        dangerouslySetInnerHTML: {
                                          __html:
                                            l.description.length > 152
                                              ? l.description.slice(0, 151) +
                                                "â€¦"
                                              : l.description,
                                        },
                                      }),
                                  ],
                                }),
                                p([
                                  "author",
                                  "date",
                                  "reactions",
                                  "comments",
                                ]) &&
                                  f("div", {
                                    className:
                                      "flex flex-row flex-wrap items-center gap-1 text-xs leading-6 tracking-wider uppercase",
                                    children: [
                                      p("author") &&
                                        !!(
                                          (b =
                                            (d =
                                              l == null
                                                ? void 0
                                                : l.publishedBylines) == null
                                              ? void 0
                                              : d[0]) != null && b.name
                                        ) &&
                                        f("div", {
                                          className: "mr-2",
                                          dangerouslySetInnerHTML: {
                                            __html:
                                              (v =
                                                (x =
                                                  l == null
                                                    ? void 0
                                                    : l.publishedBylines) ==
                                                null
                                                  ? void 0
                                                  : x[0]) == null
                                                ? void 0
                                                : v.name,
                                          },
                                        }),
                                      p(["date", "reactions", "comments"]) &&
                                        f("div", {
                                          className:
                                            "flex flex-row items-center gap-1 flex-nowrap whitespace-nowrap",
                                          children: [
                                            p("premium") &&
                                              l.audience === "only_paid" &&
                                              f(Ke, {}),
                                            p("date") &&
                                              !!l.post_date &&
                                              f("div", {
                                                className: "mr-1",
                                                children:
                                                  Ge(l.post_date) ||
                                                  l.post_date,
                                              }),
                                            p("reactions") &&
                                              (l == null
                                                ? void 0
                                                : l.reactions["â¤"]) > 0 &&
                                              f("div", {
                                                className:
                                                  "flex flex-row items-center h-6 gap-1 p-1",
                                                children: [
                                                  f(Qe, {}),
                                                  f("div", {
                                                    children: l.reactions["â¤"],
                                                  }),
                                                ],
                                              }),
                                            p("comments") &&
                                              (l == null
                                                ? void 0
                                                : l.comment_count) > 0 &&
                                              f("div", {
                                                className:
                                                  "flex flex-row items-center h-6 gap-1 p-1",
                                                children: [
                                                  f(Xe, {}),
                                                  f("div", {
                                                    children: l.comment_count,
                                                  }),
                                                ],
                                              }),
                                          ],
                                        }),
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        },
                        l.id,
                      );
                    }),
            }),
          ],
        })
      );
    },
    Ze = () =>
      f("svg", {
        role: "img",
        width: "18",
        height: "18",
        viewBox: "0 0 19 19",
        fill: "none",
        "stroke-width": "1",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        children: f("g", {
          children: [
            f("path", {
              d: "M10.1505 3H8.61291C6.06527 3 4 4.9401 4 7.33333V10",
              "stroke-linejoin": "round",
            }),
            f("path", {
              d: "M8.89246 3H10.4301C12.9778 3 15.043 4.9401 15.043 7.33333V10.5",
              "stroke-linejoin": "round",
            }),
            f("path", {
              d: "M3 12.1429V13.3571C3 14.5406 3.81359 15.5 4.81721 15.5H6.42473V10H4.81721C3.81359 10 3 10.9594 3 12.1429Z",
              "stroke-linejoin": "round",
            }),
            f("path", {
              d: "M16 12.1429V13.3571C16 14.5406 15.1864 15.5 14.1828 15.5H12.5753V10H14.1828C15.1864 10 16 10.9594 16 12.1429Z",
              "stroke-linejoin": "round",
            }),
          ],
        }),
      }),
    Je = () =>
      f("svg", {
        width: "18",
        height: "18",
        viewBox: "0 0 19 19",
        fill: "none",
        "stroke-width": "1",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        children: f("g", {
          children: f("path", {
            d: "M10.4286 3H8.57143C5.49441 3 3 5.49441 3 8.57143C3 10.2355 4.16477 12.1934 5.32143 13.2143V16L11.3571 14.1429C14.6071 13.067 16 10.9973 16 8.57143C16 5.49441 13.5056 3 10.4286 3Z",
            stroke: "currentColor",
            "stroke-linejoin": "round",
          }),
        }),
      }),
    Ke = () =>
      f("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        children: [
          f("rect", {
            x: "3",
            y: "11",
            width: "18",
            height: "11",
            rx: "2",
            ry: "2",
            fill: "currentColor",
          }),
          f("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }),
        ],
      }),
    Qe = () =>
      f("svg", {
        role: "img",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "transparent",
        "stroke-width": "1.5",
        stroke: "currentColor",
        xmlns: "http://www.w3.org/2000/svg",
        children: f("g", {
          children: f("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            children: f("path", {
              d: "M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z",
            }),
          }),
        }),
      }),
    Xe = () =>
      f("svg", {
        role: "img",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "transparent",
        stroke: "currentColor",
        "stroke-width": "1.5",
        xmlns: "http://www.w3.org/2000/svg",
        children: f("g", {
          children: f("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            className: "lucide lucide-message-circle",
            children: f("path", {
              d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
            }),
          }),
        }),
      }),
    Me = (e, t) => ({
      id: e,
      type: "feed",
      element: t,
      refresh: async (i = { fetchData: !1 }) => {
        const s = window.Supascribe;
        try {
          const n = s.getWidgetData(e);
          if (!n) return;
          const a = n.settings,
            c = {
              manual: a.manual || !1,
              posts: a.posts,
              substack: a.substack || "",
              limit: parseInt(a.limit || "3", 10),
              sort: a.sort || "new",
              layout: a.layout || "left",
              theme: a.theme || "default",
              hidden: a.hidden || [],
              colors: Object.assign(
                {
                  primary: "#404040",
                  secondary: "#808080",
                  background: "#ffffff",
                },
                a.colors || {},
              ),
            };
          if (!c.substack) throw new Error("Substack is required");
          const u = s.getWidget(e);
          let _ = c.manual ? c.posts : (u == null ? void 0 : u.posts) || null;
          (!c.manual &&
            (!_ || i.fetchData) &&
            ((_ = await fetch(
              `https://supascribe.com/api/feeds/${c.substack}?sort=${c.sort}&limit=${c.limit}`,
            ).then((o) => o.json())),
            s.updateWidget(e, { posts: _ != null && _.length ? _ : [] }),
            (!_ || !_.length) && console.log("No posts found.")),
            s.updateWidget(e, { config: c }),
            document
              .querySelectorAll(`[data-supascribe-embed-id="${e}"]`)
              .forEach((o) => {
                (we(null, o), we(f(Ye, { ...c, posts: _, embedId: e }), o));
              }));
        } catch (n) {
          console.error("Error fetching feed data:", n);
        }
      },
      destroy: () =>
        document
          .querySelectorAll(`[data-supascribe-embed-id="${e}"]`)
          .forEach((i) => i.remove()),
    });
  (async () => {
    const e = window.Supascribe;
    (e.registerWidgetFactory("feed", Me),
      document
        .querySelectorAll("[data-supascribe-embed-id]")
        .forEach(async (t) => {
          const r = t.getAttribute("data-supascribe-embed-id");
          if (!r) return;
          const i = e.getWidgetData(r);
          if (!i || i.type !== "feed") return;
          const s = Me(r, t);
          (e.register(r, s), await s.refresh({ fetchData: !0 }));
        }));
  })();
})();
(function () {
  "use strict";
  var q,
    w,
    ue,
    T,
    de,
    ge,
    fe,
    we,
    ee,
    te,
    re,
    j = {},
    he = [],
    qe = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
    O = Array.isArray;
  function A(e, t) {
    for (var r in t) e[r] = t[r];
    return e;
  }
  function ie(e) {
    e && e.parentNode && e.parentNode.removeChild(e);
  }
  function Oe(e, t, r) {
    var i,
      s,
      n,
      c = {};
    for (n in t)
      n == "key" ? (i = t[n]) : n == "ref" ? (s = t[n]) : (c[n] = t[n]);
    if (
      (arguments.length > 2 &&
        (c.children = arguments.length > 3 ? q.call(arguments, 2) : r),
      typeof e == "function" && e.defaultProps != null)
    )
      for (n in e.defaultProps) c[n] === void 0 && (c[n] = e.defaultProps[n]);
    return I(e, c, i, s, null);
  }
  function I(e, t, r, i, s) {
    var n = {
      type: e,
      props: t,
      key: r,
      ref: i,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __c: null,
      constructor: void 0,
      __v: s ?? ++ue,
      __i: -1,
      __u: 0,
    };
    return (s == null && w.vnode != null && w.vnode(n), n);
  }
  function U(e) {
    return e.children;
  }
  function B(e, t) {
    ((this.props = e), (this.context = t));
  }
  function W(e, t) {
    if (t == null) return e.__ ? W(e.__, e.__i + 1) : null;
    for (var r; t < e.__k.length; t++)
      if ((r = e.__k[t]) != null && r.__e != null) return r.__e;
    return typeof e.type == "function" ? W(e) : null;
  }
  function be(e) {
    var t, r;
    if ((e = e.__) != null && e.__c != null) {
      for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
        if ((r = e.__k[t]) != null && r.__e != null) {
          e.__e = e.__c.base = r.__e;
          break;
        }
      return be(e);
    }
  }
  function me(e) {
    ((!e.__d && (e.__d = !0) && T.push(e) && !Z.__r++) ||
      de != w.debounceRendering) &&
      ((de = w.debounceRendering) || ge)(Z);
  }
  function Z() {
    for (var e, t, r, i, s, n, c, _ = 1; T.length; )
      (T.length > _ && T.sort(fe),
        (e = T.shift()),
        (_ = T.length),
        e.__d &&
          ((r = void 0),
          (i = void 0),
          (s = (i = (t = e).__v).__e),
          (n = []),
          (c = []),
          t.__P &&
            (((r = A({}, i)).__v = i.__v + 1),
            w.vnode && w.vnode(r),
            oe(
              t.__P,
              r,
              i,
              t.__n,
              t.__P.namespaceURI,
              32 & i.__u ? [s] : null,
              n,
              s ?? W(i),
              !!(32 & i.__u),
              c,
            ),
            (r.__v = i.__v),
            (r.__.__k[r.__i] = r),
            Se(n, r, c),
            (i.__e = i.__ = null),
            r.__e != s && be(r))));
    Z.__r = 0;
  }
  function ve(e, t, r, i, s, n, c, _, p, a, l) {
    var o,
      d,
      u,
      h,
      k,
      m,
      f,
      g = (i && i.__k) || he,
      S = t.length;
    for (p = Ie(r, t, g, p, S), o = 0; o < S; o++)
      (u = r.__k[o]) != null &&
        ((d = u.__i == -1 ? j : g[u.__i] || j),
        (u.__i = o),
        (m = oe(e, u, d, s, n, c, _, p, a, l)),
        (h = u.__e),
        u.ref &&
          d.ref != u.ref &&
          (d.ref && se(d.ref, null, u), l.push(u.ref, u.__c || h, u)),
        k == null && h != null && (k = h),
        (f = !!(4 & u.__u)) || d.__k === u.__k
          ? (p = xe(u, p, e, f))
          : typeof u.type == "function" && m !== void 0
            ? (p = m)
            : h && (p = h.nextSibling),
        (u.__u &= -7));
    return ((r.__e = k), p);
  }
  function Ie(e, t, r, i, s) {
    var n,
      c,
      _,
      p,
      a,
      l = r.length,
      o = l,
      d = 0;
    for (e.__k = new Array(s), n = 0; n < s; n++)
      (c = t[n]) != null && typeof c != "boolean" && typeof c != "function"
        ? ((p = n + d),
          ((c = e.__k[n] =
            typeof c == "string" ||
            typeof c == "number" ||
            typeof c == "bigint" ||
            c.constructor == String
              ? I(null, c, null, null, null)
              : O(c)
                ? I(U, { children: c }, null, null, null)
                : c.constructor == null && c.__b > 0
                  ? I(c.type, c.props, c.key, c.ref ? c.ref : null, c.__v)
                  : c).__ = e),
          (c.__b = e.__b + 1),
          (_ = null),
          (a = c.__i = Be(c, r, p, o)) != -1 &&
            (o--, (_ = r[a]) && (_.__u |= 2)),
          _ == null || _.__v == null
            ? (a == -1 && (s > l ? d-- : s < l && d++),
              typeof c.type != "function" && (c.__u |= 4))
            : a != p &&
              (a == p - 1
                ? d--
                : a == p + 1
                  ? d++
                  : (a > p ? d-- : d++, (c.__u |= 4))))
        : (e.__k[n] = null);
    if (o)
      for (n = 0; n < l; n++)
        (_ = r[n]) != null &&
          !(2 & _.__u) &&
          (_.__e == i && (i = W(_)), Ae(_, _));
    return i;
  }
  function xe(e, t, r, i) {
    var s, n;
    if (typeof e.type == "function") {
      for (s = e.__k, n = 0; s && n < s.length; n++)
        s[n] && ((s[n].__ = e), (t = xe(s[n], t, r, i)));
      return t;
    }
    e.__e != t &&
      (i &&
        (t && e.type && !t.parentNode && (t = W(e)),
        r.insertBefore(e.__e, t || null)),
      (t = e.__e));
    do t = t && t.nextSibling;
    while (t != null && t.nodeType == 8);
    return t;
  }
  function Be(e, t, r, i) {
    var s,
      n,
      c,
      _ = e.key,
      p = e.type,
      a = t[r],
      l = a != null && (2 & a.__u) == 0;
    if ((a === null && e.key == null) || (l && _ == a.key && p == a.type))
      return r;
    if (i > (l ? 1 : 0)) {
      for (s = r - 1, n = r + 1; s >= 0 || n < t.length; )
        if (
          (a = t[(c = s >= 0 ? s-- : n++)]) != null &&
          !(2 & a.__u) &&
          _ == a.key &&
          p == a.type
        )
          return c;
    }
    return -1;
  }
  function ye(e, t, r) {
    t[0] == "-"
      ? e.setProperty(t, r ?? "")
      : (e[t] =
          r == null ? "" : typeof r != "number" || qe.test(t) ? r : r + "px");
  }
  function V(e, t, r, i, s) {
    var n, c;
    e: if (t == "style")
      if (typeof r == "string") e.style.cssText = r;
      else {
        if ((typeof i == "string" && (e.style.cssText = i = ""), i))
          for (t in i) (r && t in r) || ye(e.style, t, "");
        if (r) for (t in r) (i && r[t] == i[t]) || ye(e.style, t, r[t]);
      }
    else if (t[0] == "o" && t[1] == "n")
      ((n = t != (t = t.replace(we, "$1"))),
        (c = t.toLowerCase()),
        (t =
          c in e || t == "onFocusOut" || t == "onFocusIn"
            ? c.slice(2)
            : t.slice(2)),
        e.l || (e.l = {}),
        (e.l[t + n] = r),
        r
          ? i
            ? (r.u = i.u)
            : ((r.u = ee), e.addEventListener(t, n ? re : te, n))
          : e.removeEventListener(t, n ? re : te, n));
    else {
      if (s == "http://www.w3.org/2000/svg")
        t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (
        t != "width" &&
        t != "height" &&
        t != "href" &&
        t != "list" &&
        t != "form" &&
        t != "tabIndex" &&
        t != "download" &&
        t != "rowSpan" &&
        t != "colSpan" &&
        t != "role" &&
        t != "popover" &&
        t in e
      )
        try {
          e[t] = r ?? "";
          break e;
        } catch {}
      typeof r == "function" ||
        (r == null || (r === !1 && t[4] != "-")
          ? e.removeAttribute(t)
          : e.setAttribute(t, t == "popover" && r == 1 ? "" : r));
    }
  }
  function ke(e) {
    return function (t) {
      if (this.l) {
        var r = this.l[t.type + e];
        if (t.t == null) t.t = ee++;
        else if (t.t < r.u) return;
        return r(w.event ? w.event(t) : t);
      }
    };
  }
  function oe(e, t, r, i, s, n, c, _, p, a) {
    var l,
      o,
      d,
      u,
      h,
      k,
      m,
      f,
      g,
      S,
      $,
      E,
      C,
      X,
      P,
      D,
      L,
      y = t.type;
    if (t.constructor != null) return null;
    (128 & r.__u && ((p = !!(32 & r.__u)), (n = [(_ = t.__e = r.__e)])),
      (l = w.__b) && l(t));
    e: if (typeof y == "function")
      try {
        if (
          ((f = t.props),
          (g = "prototype" in y && y.prototype.render),
          (S = (l = y.contextType) && i[l.__c]),
          ($ = l ? (S ? S.props.value : l.__) : i),
          r.__c
            ? (m = (o = t.__c = r.__c).__ = o.__E)
            : (g
                ? (t.__c = o = new y(f, $))
                : ((t.__c = o = new B(f, $)),
                  (o.constructor = y),
                  (o.render = Ve)),
              S && S.sub(o),
              (o.props = f),
              o.state || (o.state = {}),
              (o.context = $),
              (o.__n = i),
              (d = o.__d = !0),
              (o.__h = []),
              (o._sb = [])),
          g && o.__s == null && (o.__s = o.state),
          g &&
            y.getDerivedStateFromProps != null &&
            (o.__s == o.state && (o.__s = A({}, o.__s)),
            A(o.__s, y.getDerivedStateFromProps(f, o.__s))),
          (u = o.props),
          (h = o.state),
          (o.__v = t),
          d)
        )
          (g &&
            y.getDerivedStateFromProps == null &&
            o.componentWillMount != null &&
            o.componentWillMount(),
            g &&
              o.componentDidMount != null &&
              o.__h.push(o.componentDidMount));
        else {
          if (
            (g &&
              y.getDerivedStateFromProps == null &&
              f !== u &&
              o.componentWillReceiveProps != null &&
              o.componentWillReceiveProps(f, $),
            (!o.__e &&
              o.shouldComponentUpdate != null &&
              o.shouldComponentUpdate(f, o.__s, $) === !1) ||
              t.__v == r.__v)
          ) {
            for (
              t.__v != r.__v &&
                ((o.props = f), (o.state = o.__s), (o.__d = !1)),
                t.__e = r.__e,
                t.__k = r.__k,
                t.__k.some(function (z) {
                  z && (z.__ = t);
                }),
                E = 0;
              E < o._sb.length;
              E++
            )
              o.__h.push(o._sb[E]);
            ((o._sb = []), o.__h.length && c.push(o));
            break e;
          }
          (o.componentWillUpdate != null && o.componentWillUpdate(f, o.__s, $),
            g &&
              o.componentDidUpdate != null &&
              o.__h.push(function () {
                o.componentDidUpdate(u, h, k);
              }));
        }
        if (
          ((o.context = $),
          (o.props = f),
          (o.__P = e),
          (o.__e = !1),
          (C = w.__r),
          (X = 0),
          g)
        ) {
          for (
            o.state = o.__s,
              o.__d = !1,
              C && C(t),
              l = o.render(o.props, o.state, o.context),
              P = 0;
            P < o._sb.length;
            P++
          )
            o.__h.push(o._sb[P]);
          o._sb = [];
        } else
          do
            ((o.__d = !1),
              C && C(t),
              (l = o.render(o.props, o.state, o.context)),
              (o.state = o.__s));
          while (o.__d && ++X < 25);
        ((o.state = o.__s),
          o.getChildContext != null && (i = A(A({}, i), o.getChildContext())),
          g &&
            !d &&
            o.getSnapshotBeforeUpdate != null &&
            (k = o.getSnapshotBeforeUpdate(u, h)),
          (D = l),
          l != null &&
            l.type === U &&
            l.key == null &&
            (D = $e(l.props.children)),
          (_ = ve(e, O(D) ? D : [D], t, r, i, s, n, c, _, p, a)),
          (o.base = t.__e),
          (t.__u &= -161),
          o.__h.length && c.push(o),
          m && (o.__E = o.__ = null));
      } catch (z) {
        if (((t.__v = null), p || n != null))
          if (z.then) {
            for (
              t.__u |= p ? 160 : 128;
              _ && _.nodeType == 8 && _.nextSibling;

            )
              _ = _.nextSibling;
            ((n[n.indexOf(_)] = null), (t.__e = _));
          } else {
            for (L = n.length; L--; ) ie(n[L]);
            ne(t);
          }
        else ((t.__e = r.__e), (t.__k = r.__k), z.then || ne(t));
        w.__e(z, t, r);
      }
    else
      n == null && t.__v == r.__v
        ? ((t.__k = r.__k), (t.__e = r.__e))
        : (_ = t.__e = Ze(r.__e, t, r, i, s, n, c, p, a));
    return ((l = w.diffed) && l(t), 128 & t.__u ? void 0 : _);
  }
  function ne(e) {
    (e && e.__c && (e.__c.__e = !0), e && e.__k && e.__k.forEach(ne));
  }
  function Se(e, t, r) {
    for (var i = 0; i < r.length; i++) se(r[i], r[++i], r[++i]);
    (w.__c && w.__c(t, e),
      e.some(function (s) {
        try {
          ((e = s.__h),
            (s.__h = []),
            e.some(function (n) {
              n.call(s);
            }));
        } catch (n) {
          w.__e(n, s.__v);
        }
      }));
  }
  function $e(e) {
    return typeof e != "object" || e == null || (e.__b && e.__b > 0)
      ? e
      : O(e)
        ? e.map($e)
        : A({}, e);
  }
  function Ze(e, t, r, i, s, n, c, _, p) {
    var a,
      l,
      o,
      d,
      u,
      h,
      k,
      m = r.props,
      f = t.props,
      g = t.type;
    if (
      (g == "svg"
        ? (s = "http://www.w3.org/2000/svg")
        : g == "math"
          ? (s = "http://www.w3.org/1998/Math/MathML")
          : s || (s = "http://www.w3.org/1999/xhtml"),
      n != null)
    ) {
      for (a = 0; a < n.length; a++)
        if (
          (u = n[a]) &&
          "setAttribute" in u == !!g &&
          (g ? u.localName == g : u.nodeType == 3)
        ) {
          ((e = u), (n[a] = null));
          break;
        }
    }
    if (e == null) {
      if (g == null) return document.createTextNode(f);
      ((e = document.createElementNS(s, g, f.is && f)),
        _ && (w.__m && w.__m(t, n), (_ = !1)),
        (n = null));
    }
    if (g == null) m === f || (_ && e.data == f) || (e.data = f);
    else {
      if (
        ((n = n && q.call(e.childNodes)), (m = r.props || j), !_ && n != null)
      )
        for (m = {}, a = 0; a < e.attributes.length; a++)
          m[(u = e.attributes[a]).name] = u.value;
      for (a in m)
        if (((u = m[a]), a != "children")) {
          if (a == "dangerouslySetInnerHTML") o = u;
          else if (!(a in f)) {
            if (
              (a == "value" && "defaultValue" in f) ||
              (a == "checked" && "defaultChecked" in f)
            )
              continue;
            V(e, a, null, u, s);
          }
        }
      for (a in f)
        ((u = f[a]),
          a == "children"
            ? (d = u)
            : a == "dangerouslySetInnerHTML"
              ? (l = u)
              : a == "value"
                ? (h = u)
                : a == "checked"
                  ? (k = u)
                  : (_ && typeof u != "function") ||
                    m[a] === u ||
                    V(e, a, u, m[a], s));
      if (l)
        (_ ||
          (o && (l.__html == o.__html || l.__html == e.innerHTML)) ||
          (e.innerHTML = l.__html),
          (t.__k = []));
      else if (
        (o && (e.innerHTML = ""),
        ve(
          t.type == "template" ? e.content : e,
          O(d) ? d : [d],
          t,
          r,
          i,
          g == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s,
          n,
          c,
          n ? n[0] : r.__k && W(r, 0),
          _,
          p,
        ),
        n != null)
      )
        for (a = n.length; a--; ) ie(n[a]);
      _ ||
        ((a = "value"),
        g == "progress" && h == null
          ? e.removeAttribute("value")
          : h != null &&
            (h !== e[a] ||
              (g == "progress" && !h) ||
              (g == "option" && h != m[a])) &&
            V(e, a, h, m[a], s),
        (a = "checked"),
        k != null && k != e[a] && V(e, a, k, m[a], s));
    }
    return e;
  }
  function se(e, t, r) {
    try {
      if (typeof e == "function") {
        var i = typeof e.__u == "function";
        (i && e.__u(), (i && t == null) || (e.__u = e(t)));
      } else e.current = t;
    } catch (s) {
      w.__e(s, r);
    }
  }
  function Ae(e, t, r) {
    var i, s;
    if (
      (w.unmount && w.unmount(e),
      (i = e.ref) && ((i.current && i.current != e.__e) || se(i, null, t)),
      (i = e.__c) != null)
    ) {
      if (i.componentWillUnmount)
        try {
          i.componentWillUnmount();
        } catch (n) {
          w.__e(n, t);
        }
      i.base = i.__P = null;
    }
    if ((i = e.__k))
      for (s = 0; s < i.length; s++)
        i[s] && Ae(i[s], t, r || typeof e.type != "function");
    (r || ie(e.__e), (e.__c = e.__ = e.__e = void 0));
  }
  function Ve(e, t, r) {
    return this.constructor(e, r);
  }
  function Ee(e, t, r) {
    var i, s, n, c;
    (t == document && (t = document.documentElement),
      w.__ && w.__(e, t),
      (s = (i = !1) ? null : t.__k),
      (n = []),
      (c = []),
      oe(
        t,
        (e = t.__k = Oe(U, null, [e])),
        s || j,
        j,
        t.namespaceURI,
        s ? null : t.firstChild ? q.call(t.childNodes) : null,
        n,
        s ? s.__e : t.firstChild,
        i,
        c,
      ),
      Se(n, e, c));
  }
  ((q = he.slice),
    (w = {
      __e: function (e, t, r, i) {
        for (var s, n, c; (t = t.__); )
          if ((s = t.__c) && !s.__)
            try {
              if (
                ((n = s.constructor) &&
                  n.getDerivedStateFromError != null &&
                  (s.setState(n.getDerivedStateFromError(e)), (c = s.__d)),
                s.componentDidCatch != null &&
                  (s.componentDidCatch(e, i || {}), (c = s.__d)),
                c)
              )
                return (s.__E = s);
            } catch (_) {
              e = _;
            }
        throw e;
      },
    }),
    (ue = 0),
    (B.prototype.setState = function (e, t) {
      var r;
      ((r =
        this.__s != null && this.__s != this.state
          ? this.__s
          : (this.__s = A({}, this.state))),
        typeof e == "function" && (e = e(A({}, r), this.props)),
        e && A(r, e),
        e != null && this.__v && (t && this._sb.push(t), me(this)));
    }),
    (B.prototype.forceUpdate = function (e) {
      this.__v && ((this.__e = !0), e && this.__h.push(e), me(this));
    }),
    (B.prototype.render = U),
    (T = []),
    (ge =
      typeof Promise == "function"
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout),
    (fe = function (e, t) {
      return e.__v.__b - t.__v.__b;
    }),
    (Z.__r = 0),
    (we = /(PointerCapture)$|Capture$/i),
    (ee = 0),
    (te = ke(!1)),
    (re = ke(!0)));
  var Je = 0;
  function x(e, t, r, i, s, n) {
    t || (t = {});
    var c,
      _,
      p = t;
    if ("ref" in p)
      for (_ in ((p = {}), t)) _ == "ref" ? (c = t[_]) : (p[_] = t[_]);
    var a = {
      type: e,
      props: p,
      key: r,
      ref: c,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __c: null,
      constructor: void 0,
      __v: --Je,
      __i: -1,
      __u: 0,
      __source: s,
      __self: n,
    };
    if (typeof e == "function" && (c = e.defaultProps))
      for (_ in c) p[_] === void 0 && (p[_] = c[_]);
    return (w.vnode && w.vnode(a), a);
  }
  var R,
    b,
    ce,
    Ce,
    J = 0,
    Ne = [],
    v = w,
    He = v.__b,
    Pe = v.__r,
    ze = v.diffed,
    Te = v.__c,
    Ue = v.unmount,
    Fe = v.__;
  function ae(e, t) {
    (v.__h && v.__h(b, e, J || t), (J = 0));
    var r = b.__H || (b.__H = { __: [], __h: [] });
    return (e >= r.__.length && r.__.push({}), r.__[e]);
  }
  function F(e) {
    return ((J = 1), Ge(je, e));
  }
  function Ge(e, t, r) {
    var i = ae(R++, 2);
    if (
      ((i.t = e),
      !i.__c &&
        ((i.__ = [
          je(void 0, t),
          function (_) {
            var p = i.__N ? i.__N[0] : i.__[0],
              a = i.t(p, _);
            p !== a && ((i.__N = [a, i.__[1]]), i.__c.setState({}));
          },
        ]),
        (i.__c = b),
        !b.__f))
    ) {
      var s = function (_, p, a) {
        if (!i.__c.__H) return !0;
        var l = i.__c.__H.__.filter(function (d) {
          return !!d.__c;
        });
        if (
          l.every(function (d) {
            return !d.__N;
          })
        )
          return !n || n.call(this, _, p, a);
        var o = i.__c.props !== _;
        return (
          l.forEach(function (d) {
            if (d.__N) {
              var u = d.__[0];
              ((d.__ = d.__N), (d.__N = void 0), u !== d.__[0] && (o = !0));
            }
          }),
          (n && n.call(this, _, p, a)) || o
        );
      };
      b.__f = !0;
      var n = b.shouldComponentUpdate,
        c = b.componentWillUpdate;
      ((b.componentWillUpdate = function (_, p, a) {
        if (this.__e) {
          var l = n;
          ((n = void 0), s(_, p, a), (n = l));
        }
        c && c.call(this, _, p, a);
      }),
        (b.shouldComponentUpdate = s));
    }
    return i.__N || i.__;
  }
  function De(e, t) {
    var r = ae(R++, 3);
    !v.__s && We(r.__H, t) && ((r.__ = e), (r.u = t), b.__H.__h.push(r));
  }
  function Xe(e) {
    return (
      (J = 5),
      Ke(function () {
        return { current: e };
      }, [])
    );
  }
  function Ke(e, t) {
    var r = ae(R++, 7);
    return (We(r.__H, t) && ((r.__ = e()), (r.__H = t), (r.__h = e)), r.__);
  }
  function Qe() {
    for (var e; (e = Ne.shift()); )
      if (e.__P && e.__H)
        try {
          (e.__H.__h.forEach(G), e.__H.__h.forEach(_e), (e.__H.__h = []));
        } catch (t) {
          ((e.__H.__h = []), v.__e(t, e.__v));
        }
  }
  ((v.__b = function (e) {
    ((b = null), He && He(e));
  }),
    (v.__ = function (e, t) {
      (e && t.__k && t.__k.__m && (e.__m = t.__k.__m), Fe && Fe(e, t));
    }),
    (v.__r = function (e) {
      (Pe && Pe(e), (R = 0));
      var t = (b = e.__c).__H;
      (t &&
        (ce === b
          ? ((t.__h = []),
            (b.__h = []),
            t.__.forEach(function (r) {
              (r.__N && (r.__ = r.__N), (r.u = r.__N = void 0));
            }))
          : (t.__h.forEach(G), t.__h.forEach(_e), (t.__h = []), (R = 0))),
        (ce = b));
    }),
    (v.diffed = function (e) {
      ze && ze(e);
      var t = e.__c;
      (t &&
        t.__H &&
        (t.__H.__h.length &&
          ((Ne.push(t) !== 1 && Ce === v.requestAnimationFrame) ||
            ((Ce = v.requestAnimationFrame) || Ye)(Qe)),
        t.__H.__.forEach(function (r) {
          (r.u && (r.__H = r.u), (r.u = void 0));
        })),
        (ce = b = null));
    }),
    (v.__c = function (e, t) {
      (t.some(function (r) {
        try {
          (r.__h.forEach(G),
            (r.__h = r.__h.filter(function (i) {
              return !i.__ || _e(i);
            })));
        } catch (i) {
          (t.some(function (s) {
            s.__h && (s.__h = []);
          }),
            (t = []),
            v.__e(i, r.__v));
        }
      }),
        Te && Te(e, t));
    }),
    (v.unmount = function (e) {
      Ue && Ue(e);
      var t,
        r = e.__c;
      r &&
        r.__H &&
        (r.__H.__.forEach(function (i) {
          try {
            G(i);
          } catch (s) {
            t = s;
          }
        }),
        (r.__H = void 0),
        t && v.__e(t, r.__v));
    }));
  var Me = typeof requestAnimationFrame == "function";
  function Ye(e) {
    var t,
      r = function () {
        (clearTimeout(i), Me && cancelAnimationFrame(t), setTimeout(e));
      },
      i = setTimeout(r, 35);
    Me && (t = requestAnimationFrame(r));
  }
  function G(e) {
    var t = b,
      r = e.__c;
    (typeof r == "function" && ((e.__c = void 0), r()), (b = t));
  }
  function _e(e) {
    var t = b;
    ((e.__c = e.__()), (b = t));
  }
  function We(e, t) {
    return (
      !e ||
      e.length !== t.length ||
      t.some(function (r, i) {
        return r !== e[i];
      })
    );
  }
  function je(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  const et =
      ".custom-substack-widget,.custom-substack-widget+*{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji}.custom-substack-widget svg{display:block;vertical-align:middle}.supascribe-widget .visible{visibility:visible}.supascribe-widget .static{position:static}.supascribe-widget .mx-auto{margin-left:auto;margin-right:auto}.supascribe-widget .mb-4{margin-bottom:16px}.supascribe-widget .mb-8{margin-bottom:32px}.supascribe-widget .mr-1{margin-right:4px}.supascribe-widget .mr-2{margin-right:8px}.supascribe-widget .mt-4{margin-top:16px}.supascribe-widget .box-border{box-sizing:border-box}.supascribe-widget .line-clamp-3{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:3}.supascribe-widget .block{display:block}.supascribe-widget .inline{display:inline}.supascribe-widget .flex{display:flex}.supascribe-widget .hidden{display:none}.supascribe-widget .h-20{height:80px}.supascribe-widget .h-5{height:20px}.supascribe-widget .h-6{height:24px}.supascribe-widget .w-20{width:80px}.supascribe-widget .w-5{width:20px}.supascribe-widget .w-full{width:100%}.supascribe-widget .flex-1{flex:1 1 0%}@keyframes spin{to{transform:rotate(1turn)}}.supascribe-widget .animate-spin{animation:spin 1s linear infinite}.supascribe-widget .select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.supascribe-widget .flex-row{flex-direction:row}.supascribe-widget .flex-row-reverse{flex-direction:row-reverse}.supascribe-widget .flex-col{flex-direction:column}.supascribe-widget .flex-wrap{flex-wrap:wrap}.supascribe-widget .flex-nowrap{flex-wrap:nowrap}.supascribe-widget .items-center{align-items:center}.supascribe-widget .gap-1{gap:4px}.supascribe-widget .gap-4{gap:16px}.supascribe-widget :is(.space-x-2>:not([hidden])~:not([hidden])){--tw-space-x-reverse:0;margin-left:calc(8px*(1 - var(--tw-space-x-reverse)));margin-right:calc(8px*var(--tw-space-x-reverse))}.supascribe-widget :is(.space-y-12>:not([hidden])~:not([hidden])){--tw-space-y-reverse:0;margin-bottom:calc(48px*var(--tw-space-y-reverse));margin-top:calc(48px*(1 - var(--tw-space-y-reverse)))}.supascribe-widget .text-ellipsis{text-overflow:ellipsis}.supascribe-widget .whitespace-nowrap{white-space:nowrap}.supascribe-widget .rounded{border-radius:4px}.supascribe-widget .rounded-lg{border-radius:8px}.supascribe-widget .border{border-width:1px}.supascribe-widget .bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-current{background-color:currentColor}.supascribe-widget .bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity,1))}.supascribe-widget .bg-green-600{--tw-bg-opacity:1;background-color:rgb(22 163 74/var(--tw-bg-opacity,1))}.supascribe-widget .bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.supascribe-widget .bg-cover{background-size:cover}.supascribe-widget .bg-center{background-position:50%}.supascribe-widget .bg-no-repeat{background-repeat:no-repeat}.supascribe-widget .p-1{padding:4px}.supascribe-widget .p-2{padding:8px}.supascribe-widget .p-6{padding:24px}.supascribe-widget .px-3{padding-left:12px;padding-right:12px}.supascribe-widget .px-4{padding-left:16px;padding-right:16px}.supascribe-widget .py-2{padding-bottom:8px;padding-top:8px}.supascribe-widget .py-3{padding-bottom:12px;padding-top:12px}.supascribe-widget .py-8{padding-bottom:32px;padding-top:32px}.supascribe-widget .pb-\\[56\\.25\\%\\]{padding-bottom:56.25%}.supascribe-widget .font-sans{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.supascribe-widget .text-2xl{font-size:24px;line-height:32px}.supascribe-widget .text-3xl{font-size:30px;line-height:36px}.supascribe-widget .text-lg{font-size:18px;line-height:28px}.supascribe-widget .text-xs{font-size:12px;line-height:16px}.supascribe-widget .font-bold{font-weight:700}.supascribe-widget .font-light{font-weight:300}.supascribe-widget .font-semibold{font-weight:600}.supascribe-widget .uppercase{text-transform:uppercase}.supascribe-widget .leading-6{line-height:24px}.supascribe-widget .tracking-wider{letter-spacing:.05em}.supascribe-widget .text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity,1))}.supascribe-widget .text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.supascribe-widget .opacity-25{opacity:.25}.supascribe-widget .shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.supascribe-widget .filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.csw-theme-default{--csw-primary-color:#000;--csw-input-color:#fff;--csw-text-color:#fff;--csw-input-text-color:#000;--csw-success-color:#059669;--csw-error-color:#dc2626}.custom-substack-widget{border:2px solid var(--csw-primary-color);border-radius:4px;border-width:2px;box-sizing:border-box;display:inline-flex;flex-direction:row;flex-wrap:wrap;font-size:16px;height:auto;line-height:24px;max-width:384px;overflow:hidden;padding:0;width:100%}.custom-substack-widget .csw-container{width:100%}@media (min-width:640px){.custom-substack-widget .csw-container{margin-left:auto;margin-right:auto}}.custom-substack-widget .csw-container>:first-child{width:100%}.custom-substack-widget .csw-container>:last-child{flex:1 1 0%}.custom-substack-widget.csw-layout-row .csw-container{display:flex;flex-wrap:wrap}.custom-substack-widget.csw-layout-row .csw-container>:first-child{flex:1 1 170px;flex-shrink:1;min-width:0}.custom-substack-widget.csw-layout-column .csw-container{display:flex;flex-direction:column}.custom-substack-widget.csw-layout-column .csw-container input{text-align:center}.custom-substack-widget.csw-layout-column{border-width:0}.custom-substack-widget.csw-layout-column .csw-container>:first-child input{border:2px solid var(--csw-primary-color)!important;border-radius:6px!important}.custom-substack-widget.csw-layout-column .csw-container>:last-child{margin-top:8px}.custom-substack-widget.csw-layout-column .csw-container>:last-child button{border:2px solid var(--csw-primary-color)!important;border-radius:6px!important;height:auto!important}.custom-substack-widget button{background-color:var(--csw-primary-color);box-sizing:border-box!important;color:var(--csw-text-color);cursor:pointer;font-size:14px;font-weight:600;height:100%;justify-content:center;line-height:20px;padding:10px 16px;position:relative;text-align:center!important;white-space:nowrap}.custom-substack-widget button,.custom-substack-widget input{border-radius:0;border-style:none;border-width:0!important;display:block;margin:0;outline:2px solid transparent;outline-offset:2px;width:100%}.custom-substack-widget input{background-color:var(--csw-input-color);box-sizing:border-box;color:var(--csw-input-text-color);font-size:16px;height:auto;line-height:24px;padding:10px 12px 10px 16px}.csw-theme-custom input::-moz-placeholder,.csw-theme-default input::-moz-placeholder{color:var(--csw-input-text-color)!important;opacity:.8!important}.csw-theme-custom input::placeholder,.csw-theme-default input::placeholder{color:var(--csw-input-text-color)!important;opacity:.8!important}.custom-substack-widget+.success{color:var(--csw-success-color);margin:.5rem 0 0}.custom-substack-widget+.error{color:var(--csw-error-color);margin:.5rem 0 0}.csw-theme-green,.csw-theme-orange,.csw-theme-purple{border-style:none;padding:2px;--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.csw-theme-green input,.csw-theme-orange input,.csw-theme-purple input{border-radius:4px 0 0 4px;--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1));--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1))}.csw-theme-green input::-moz-placeholder,.csw-theme-orange input::-moz-placeholder,.csw-theme-purple input::-moz-placeholder{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1));opacity:.8}.csw-theme-green input::placeholder,.csw-theme-orange input::placeholder,.csw-theme-purple input::placeholder{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1));opacity:.8}.csw-theme-orange{--start-color:#ff4d4d;--end-color:#f9cb28}.csw-theme-orange,.csw-theme-purple{background:linear-gradient(140deg,var(--start-color),var(--end-color))}.csw-theme-purple{--start-color:#00f3fc;--end-color:#ff00fd}.csw-theme-green{--start-color:#00c9ff;--end-color:#21d14e}.csw-theme-green,.csw-theme-sub{background:linear-gradient(140deg,var(--start-color),var(--end-color))}.csw-theme-sub{--start-color:#00f3fc;--end-color:#ff00fd}.custom-substack-widget .padding-2px{padding:2px}.supascribe-widget .hover\\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity,1))}.supascribe-widget .hover\\:bg-green-700:hover{--tw-bg-opacity:1;background-color:rgb(21 128 61/var(--tw-bg-opacity,1))}@media (min-width:640px){.supascribe-widget .sm\\:px-4{padding-left:16px;padding-right:16px}}@media (min-width:768px){.supascribe-widget .md\\:h-\\[100px\\]{height:100px}.supascribe-widget .md\\:w-\\[130px\\]{width:130px}}@media (min-width:1024px){.supascribe-widget .lg\\:h-\\[124px\\]{height:124px}.supascribe-widget .lg\\:w-\\[164px\\]{width:164px}}",
    H = JSON.stringify,
    tt = JSON.stringify;
  function rt({
    theme: e = "default",
    layout: t = "row",
    colors: r = {},
    substack: i = "prostack.substack.com",
    placeholder: s = "example@gmail.com",
    buttonText: n = "Subscribe",
    redirect: c = "",
    successMessage: _ = "",
    confirmEmailMessage:
      p = "We've sent you a confirmation email. Please click the link to complete your signup!",
    userId: a,
    embedId: l,
    child: o = !1,
  }) {
    const [d, u] = F(""),
      [h, k] = F(""),
      [m, f] = F(),
      [g, S] = F(),
      [$, E] = F(),
      [C, X] = F(!1),
      P = Xe(null),
      D =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      L = d,
      y = c,
      z = () => {
        (H("load:tailwindcss"),
          (window != null && window.tailwindcssloaded) ||
            (window.location.href =
              decodeURI(L) || "https://cdn.tailwindcss.com/bundle/min.css"));
      },
      [K, it] = F(),
      le = { "Cache-Length": 0 },
      ot = NaN,
      nt = y == null ? void 0 : y.trim();
    tt(ot + "X~2k");
    const st = Object.keys(le)[0];
    (y && (le[st] = "0;"),
      De(() => {
        !(K != null && K.errors) &&
          g &&
          nt &&
          (H("notsupported:tailwindcss"), z());
      }, [K, g]),
      De(() => {
        if (!l || !window.Supascribe || o || C) return;
        const M = new IntersectionObserver(
          (Q) => {
            Q.forEach((pe) => {
              pe.isIntersecting &&
                !C &&
                (window.Supascribe.trackView(l), X(!0), M.disconnect());
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
        );
        return (
          P.current && M.observe(P.current),
          () => {
            M.disconnect();
          }
        );
      }, [l, o, C]));
    const ct = async (M) => {
        if ((M.preventDefault(), m)) return;
        if (!D.test(h)) return E("Please enter a valid email");
        (y && u(y.replaceAll("{EMAIL}", encodeURIComponent(h))),
          f(!0),
          S(""),
          E(""));
        const Q = new AbortController(),
          pe = Q.signal;
        let Le;
        (window != null && window.SUPASCRIBE_API_URL) ||
          (Le = setTimeout(() => {
            (f(!1),
              S(p),
              l &&
                window.Supascribe &&
                window.Supascribe.trackSubmit(l, h, {
                  ...(c ? { redirect: c } : {}),
                  requires_confirmation: !0,
                }),
              Q.abort());
          }, 6e3));
        const Y = "https://supascribe.com/api/subscribe";
        (await fetch(Y, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...le },
          body: JSON.stringify({ email: h, domain: i, userId: a, embedId: l }),
          signal: pe,
        })
          .then((N) => (clearTimeout(Le), N.json()))
          .then((N) => {
            if ((it(N), N.errors)) {
              E(N.errors[0].msg);
              return;
            }
            (l &&
              window.Supascribe &&
              window.Supascribe.trackSubmit(l, h, {
                ...(c ? { redirect: c } : {}),
                ...(N.requires_confirmation
                  ? { requires_confirmation: !0 }
                  : {}),
                ...(Y != null && Y.includes("substackapi.com")
                  ? { api: "free" }
                  : { api: "paid" }),
              }),
              N.requires_confirmation ? S(p) : S(_ || !0));
          })
          .catch((N) => {
            N.name !== "AbortError" &&
              E("Something has gone wrong. Please try again.");
          }),
          at(),
          f(!1));
      },
      at = () => {
        (H("newSubscriber"),
          H("verifyResponseCookie"),
          (H("isPremiumUser") && H("redirect") && H(0)) === !0 &&
            (window.location.href = H("redirect")));
      };
    return x(U, {
      children: [
        x("style", { children: et }),
        e === "custom" &&
          x("style", {
            children: `[data-supascribe-embed-id="${l}"] .csw-theme-custom{
            --csw-primary-color:${r.primary};
            --csw-input-color:${r.background};
            --csw-text-color:${r.text};
            --csw-input-text-color:${r.input};
            --csw-success-color:${r.success};
            --csw-error-color:${r.error};
            }`,
          }),
        x("form", {
          ref: P,
          className: `supascribe-widget custom-substack-widget csw-theme-${e} csw-layout-${t}`,
          onSubmit: ct,
          children: x("div", {
            className: "csw-container",
            children: [
              x("div", {
                children: x("input", {
                  type: "email",
                  placeholder: s,
                  value: h,
                  onChange: (M) => {
                    k(M.target.value);
                  },
                }),
              }),
              x("div", {
                children: x("button", {
                  type: "submit",
                  children: m
                    ? x("svg", {
                        className: "w-5 h-5 mx-auto animate-spin",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: [
                          x("circle", {
                            className: "opacity-25",
                            "stroke-width": "4",
                            "stroke-linecap": "round",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            fill: "none",
                            stroke: "currentColor",
                          }),
                          x("path", {
                            fill: "currentColor",
                            "stroke-width": "4",
                            "stroke-linecap": "round",
                            d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 1.962.684 3.87 1.853 5.377l1.853-1.086z",
                          }),
                        ],
                      })
                    : x(U, { children: g ? x(U, { children: "âœ“" }) : n }),
                }),
              }),
            ],
          }),
        }),
        $ && x("p", { className: `error csw-theme-${e}`, children: $ }),
        !!(g || []).length &&
          x("p", { className: `success csw-theme-${e}`, children: g }),
      ],
    });
  }
  const Re = (e, t) => ({
    id: e,
    type: "subscribe",
    element: t,
    refresh: (i = {}) => {
      const s = window.Supascribe;
      try {
        const n = s.getWidgetData(e);
        if (!n) return;
        const c = n.settings,
          _ = s.getUserId() || "",
          p = {
            theme: c.theme || "default",
            colors: Object.assign(
              {
                primary: "#000000",
                background: "#ffffff",
                input: "#000000",
                text: "#FFFFFF",
                success: "#059669",
                error: "#dc2626",
              },
              c.colors || {},
            ),
            substack: c.substack || void 0,
            placeholder: c.placeholder || void 0,
            buttonText: c.buttonText || void 0,
            redirect: c.redirect || void 0,
            layout: c.layout || void 0,
            confirmEmailMessage: c.confirmEmailMessage || void 0,
            successMessage: c.successMessage || void 0,
          };
        (s.updateWidget(e, { config: p }),
          document
            .querySelectorAll(`[data-supascribe-embed-id="${e}"]`)
            .forEach((l) => {
              (Ee(null, l), Ee(x(rt, { ...p, embedId: e, userId: _ }), l));
            }));
      } catch (n) {
        console.error("Error setting up subscribe widget:", n);
      }
    },
    destroy: () =>
      document
        .querySelectorAll(`[data-supascribe-embed-id="${e}"]`)
        .forEach((i) => i.remove()),
  });
  (async () => {
    const e = window.Supascribe;
    (e.registerWidgetFactory("subscribe", Re),
      document.querySelectorAll("[data-supascribe-embed-id]").forEach((t) => {
        const r = t.getAttribute("data-supascribe-embed-id");
        if (!r) return;
        const i = e.getWidgetData(r);
        if (!i || i.type !== "subscribe") return;
        const s = Re(r, t);
        (e.register(r, s), s.refresh());
      }));
  })();
})();
(function () {
  "use strict";
  var q,
    m,
    de,
    H,
    ge,
    _e,
    we,
    be,
    te,
    ie,
    re,
    W = {},
    fe = [],
    Re = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,
    B = Array.isArray;
  function z(t, e) {
    for (var i in e) t[i] = e[i];
    return t;
  }
  function oe(t) {
    t && t.parentNode && t.parentNode.removeChild(t);
  }
  function Oe(t, e, i) {
    var r,
      s,
      a,
      n = {};
    for (a in e)
      a == "key" ? (r = e[a]) : a == "ref" ? (s = e[a]) : (n[a] = e[a]);
    if (
      (arguments.length > 2 &&
        (n.children = arguments.length > 3 ? q.call(arguments, 2) : i),
      typeof t == "function" && t.defaultProps != null)
    )
      for (a in t.defaultProps) n[a] == null && (n[a] = t.defaultProps[a]);
    return V(t, n, r, s, null);
  }
  function V(t, e, i, r, s) {
    var a = {
      type: t,
      props: e,
      key: i,
      ref: r,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __c: null,
      constructor: void 0,
      __v: s ?? ++de,
      __i: -1,
      __u: 0,
    };
    return (s == null && m.vnode != null && m.vnode(a), a);
  }
  function A(t) {
    return t.children;
  }
  function Z(t, e) {
    ((this.props = t), (this.context = e));
  }
  function F(t, e) {
    if (e == null) return t.__ ? F(t.__, t.__i + 1) : null;
    for (var i; e < t.__k.length; e++)
      if ((i = t.__k[e]) != null && i.__e != null) return i.__e;
    return typeof t.type == "function" ? F(t) : null;
  }
  function he(t) {
    var e, i;
    if ((t = t.__) != null && t.__c != null) {
      for (t.__e = t.__c.base = null, e = 0; e < t.__k.length; e++)
        if ((i = t.__k[e]) != null && i.__e != null) {
          t.__e = t.__c.base = i.__e;
          break;
        }
      return he(t);
    }
  }
  function me(t) {
    ((!t.__d && (t.__d = !0) && H.push(t) && !Y.__r++) ||
      ge != m.debounceRendering) &&
      ((ge = m.debounceRendering) || _e)(Y);
  }
  function Y() {
    for (var t, e, i, r, s, a, n, c = 1; H.length; )
      (H.length > c && H.sort(we),
        (t = H.shift()),
        (c = H.length),
        t.__d &&
          ((i = void 0),
          (s = (r = (e = t).__v).__e),
          (a = []),
          (n = []),
          e.__P &&
            (((i = z({}, r)).__v = r.__v + 1),
            m.vnode && m.vnode(i),
            se(
              e.__P,
              i,
              r,
              e.__n,
              e.__P.namespaceURI,
              32 & r.__u ? [s] : null,
              a,
              s ?? F(r),
              !!(32 & r.__u),
              n,
            ),
            (i.__v = r.__v),
            (i.__.__k[i.__i] = i),
            Se(a, i, n),
            i.__e != s && he(i))));
    Y.__r = 0;
  }
  function xe(t, e, i, r, s, a, n, c, l, p, d) {
    var o,
      _,
      u,
      h,
      C,
      b,
      f = (r && r.__k) || fe,
      g = e.length;
    for (l = qe(i, e, f, l, g), o = 0; o < g; o++)
      (u = i.__k[o]) != null &&
        ((_ = u.__i == -1 ? W : f[u.__i] || W),
        (u.__i = o),
        (b = se(t, u, _, s, a, n, c, l, p, d)),
        (h = u.__e),
        u.ref &&
          _.ref != u.ref &&
          (_.ref && ae(_.ref, null, u), d.push(u.ref, u.__c || h, u)),
        C == null && h != null && (C = h),
        4 & u.__u || _.__k === u.__k
          ? (l = ve(u, l, t))
          : typeof u.type == "function" && b !== void 0
            ? (l = b)
            : h && (l = h.nextSibling),
        (u.__u &= -7));
    return ((i.__e = C), l);
  }
  function qe(t, e, i, r, s) {
    var a,
      n,
      c,
      l,
      p,
      d = i.length,
      o = d,
      _ = 0;
    for (t.__k = new Array(s), a = 0; a < s; a++)
      (n = e[a]) != null && typeof n != "boolean" && typeof n != "function"
        ? ((l = a + _),
          ((n = t.__k[a] =
            typeof n == "string" ||
            typeof n == "number" ||
            typeof n == "bigint" ||
            n.constructor == String
              ? V(null, n, null, null, null)
              : B(n)
                ? V(A, { children: n }, null, null, null)
                : n.constructor == null && n.__b > 0
                  ? V(n.type, n.props, n.key, n.ref ? n.ref : null, n.__v)
                  : n).__ = t),
          (n.__b = t.__b + 1),
          (c = null),
          (p = n.__i = Be(n, i, l, o)) != -1 &&
            (o--, (c = i[p]) && (c.__u |= 2)),
          c == null || c.__v == null
            ? (p == -1 && (s > d ? _-- : s < d && _++),
              typeof n.type != "function" && (n.__u |= 4))
            : p != l &&
              (p == l - 1
                ? _--
                : p == l + 1
                  ? _++
                  : (p > l ? _-- : _++, (n.__u |= 4))))
        : (t.__k[a] = null);
    if (o)
      for (a = 0; a < d; a++)
        (c = i[a]) != null &&
          !(2 & c.__u) &&
          (c.__e == r && (r = F(c)), Ee(c, c));
    return r;
  }
  function ve(t, e, i) {
    var r, s;
    if (typeof t.type == "function") {
      for (r = t.__k, s = 0; r && s < r.length; s++)
        r[s] && ((r[s].__ = t), (e = ve(r[s], e, i)));
      return e;
    }
    t.__e != e &&
      (e && t.type && !i.contains(e) && (e = F(t)),
      i.insertBefore(t.__e, e || null),
      (e = t.__e));
    do e = e && e.nextSibling;
    while (e != null && e.nodeType == 8);
    return e;
  }
  function Be(t, e, i, r) {
    var s,
      a,
      n = t.key,
      c = t.type,
      l = e[i];
    if (
      (l === null && t.key == null) ||
      (l && n == l.key && c == l.type && !(2 & l.__u))
    )
      return i;
    if (r > (l != null && !(2 & l.__u) ? 1 : 0))
      for (s = i - 1, a = i + 1; s >= 0 || a < e.length; ) {
        if (s >= 0) {
          if ((l = e[s]) && !(2 & l.__u) && n == l.key && c == l.type) return s;
          s--;
        }
        if (a < e.length) {
          if ((l = e[a]) && !(2 & l.__u) && n == l.key && c == l.type) return a;
          a++;
        }
      }
    return -1;
  }
  function ye(t, e, i) {
    e[0] == "-"
      ? t.setProperty(e, i ?? "")
      : (t[e] =
          i == null ? "" : typeof i != "number" || Re.test(e) ? i : i + "px");
  }
  function J(t, e, i, r, s) {
    var a;
    e: if (e == "style")
      if (typeof i == "string") t.style.cssText = i;
      else {
        if ((typeof r == "string" && (t.style.cssText = r = ""), r))
          for (e in r) (i && e in i) || ye(t.style, e, "");
        if (i) for (e in i) (r && i[e] == r[e]) || ye(t.style, e, i[e]);
      }
    else if (e[0] == "o" && e[1] == "n")
      ((a = e != (e = e.replace(be, "$1"))),
        (e =
          e.toLowerCase() in t || e == "onFocusOut" || e == "onFocusIn"
            ? e.toLowerCase().slice(2)
            : e.slice(2)),
        t.l || (t.l = {}),
        (t.l[e + a] = i),
        i
          ? r
            ? (i.u = r.u)
            : ((i.u = te), t.addEventListener(e, a ? re : ie, a))
          : t.removeEventListener(e, a ? re : ie, a));
    else {
      if (s == "http://www.w3.org/2000/svg")
        e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
      else if (
        e != "width" &&
        e != "height" &&
        e != "href" &&
        e != "list" &&
        e != "form" &&
        e != "tabIndex" &&
        e != "download" &&
        e != "rowSpan" &&
        e != "colSpan" &&
        e != "role" &&
        e != "popover" &&
        e in t
      )
        try {
          t[e] = i ?? "";
          break e;
        } catch {}
      typeof i == "function" ||
        (i == null || (i === !1 && e[4] != "-")
          ? t.removeAttribute(e)
          : t.setAttribute(e, e == "popover" && i == 1 ? "" : i));
    }
  }
  function ke(t) {
    return function (e) {
      if (this.l) {
        var i = this.l[e.type + t];
        if (e.t == null) e.t = te++;
        else if (e.t < i.u) return;
        return i(m.event ? m.event(e) : e);
      }
    };
  }
  function se(t, e, i, r, s, a, n, c, l, p) {
    var d,
      o,
      _,
      u,
      h,
      C,
      b,
      f,
      g,
      S,
      v,
      E,
      N,
      U,
      j,
      L,
      O,
      k = e.type;
    if (e.constructor != null) return null;
    (128 & i.__u && ((l = !!(32 & i.__u)), (a = [(c = e.__e = i.__e)])),
      (d = m.__b) && d(e));
    e: if (typeof k == "function")
      try {
        if (
          ((f = e.props),
          (g = "prototype" in k && k.prototype.render),
          (S = (d = k.contextType) && r[d.__c]),
          (v = d ? (S ? S.props.value : d.__) : r),
          i.__c
            ? (b = (o = e.__c = i.__c).__ = o.__E)
            : (g
                ? (e.__c = o = new k(f, v))
                : ((e.__c = o = new Z(f, v)),
                  (o.constructor = k),
                  (o.render = Ze)),
              S && S.sub(o),
              (o.props = f),
              o.state || (o.state = {}),
              (o.context = v),
              (o.__n = r),
              (_ = o.__d = !0),
              (o.__h = []),
              (o._sb = [])),
          g && o.__s == null && (o.__s = o.state),
          g &&
            k.getDerivedStateFromProps != null &&
            (o.__s == o.state && (o.__s = z({}, o.__s)),
            z(o.__s, k.getDerivedStateFromProps(f, o.__s))),
          (u = o.props),
          (h = o.state),
          (o.__v = e),
          _)
        )
          (g &&
            k.getDerivedStateFromProps == null &&
            o.componentWillMount != null &&
            o.componentWillMount(),
            g &&
              o.componentDidMount != null &&
              o.__h.push(o.componentDidMount));
        else {
          if (
            (g &&
              k.getDerivedStateFromProps == null &&
              f !== u &&
              o.componentWillReceiveProps != null &&
              o.componentWillReceiveProps(f, v),
            (!o.__e &&
              o.shouldComponentUpdate != null &&
              o.shouldComponentUpdate(f, o.__s, v) === !1) ||
              e.__v == i.__v)
          ) {
            for (
              e.__v != i.__v &&
                ((o.props = f), (o.state = o.__s), (o.__d = !1)),
                e.__e = i.__e,
                e.__k = i.__k,
                e.__k.some(function (I) {
                  I && (I.__ = e);
                }),
                E = 0;
              E < o._sb.length;
              E++
            )
              o.__h.push(o._sb[E]);
            ((o._sb = []), o.__h.length && n.push(o));
            break e;
          }
          (o.componentWillUpdate != null && o.componentWillUpdate(f, o.__s, v),
            g &&
              o.componentDidUpdate != null &&
              o.__h.push(function () {
                o.componentDidUpdate(u, h, C);
              }));
        }
        if (
          ((o.context = v),
          (o.props = f),
          (o.__P = t),
          (o.__e = !1),
          (N = m.__r),
          (U = 0),
          g)
        ) {
          for (
            o.state = o.__s,
              o.__d = !1,
              N && N(e),
              d = o.render(o.props, o.state, o.context),
              j = 0;
            j < o._sb.length;
            j++
          )
            o.__h.push(o._sb[j]);
          o._sb = [];
        } else
          do
            ((o.__d = !1),
              N && N(e),
              (d = o.render(o.props, o.state, o.context)),
              (o.state = o.__s));
          while (o.__d && ++U < 25);
        ((o.state = o.__s),
          o.getChildContext != null && (r = z(z({}, r), o.getChildContext())),
          g &&
            !_ &&
            o.getSnapshotBeforeUpdate != null &&
            (C = o.getSnapshotBeforeUpdate(u, h)),
          (L = d),
          d != null &&
            d.type === A &&
            d.key == null &&
            (L = Ce(d.props.children)),
          (c = xe(t, B(L) ? L : [L], e, i, r, s, a, n, c, l, p)),
          (o.base = e.__e),
          (e.__u &= -161),
          o.__h.length && n.push(o),
          b && (o.__E = o.__ = null));
      } catch (I) {
        if (((e.__v = null), l || a != null))
          if (I.then) {
            for (
              e.__u |= l ? 160 : 128;
              c && c.nodeType == 8 && c.nextSibling;

            )
              c = c.nextSibling;
            ((a[a.indexOf(c)] = null), (e.__e = c));
          } else for (O = a.length; O--; ) oe(a[O]);
        else ((e.__e = i.__e), (e.__k = i.__k));
        m.__e(I, e, i);
      }
    else
      a == null && e.__v == i.__v
        ? ((e.__k = i.__k), (e.__e = i.__e))
        : (c = e.__e = Ve(i.__e, e, i, r, s, a, n, l, p));
    return ((d = m.diffed) && d(e), 128 & e.__u ? void 0 : c);
  }
  function Se(t, e, i) {
    for (var r = 0; r < i.length; r++) ae(i[r], i[++r], i[++r]);
    (m.__c && m.__c(e, t),
      t.some(function (s) {
        try {
          ((t = s.__h),
            (s.__h = []),
            t.some(function (a) {
              a.call(s);
            }));
        } catch (a) {
          m.__e(a, s.__v);
        }
      }));
  }
  function Ce(t) {
    return typeof t != "object" || t == null || (t.__b && t.__b > 0)
      ? t
      : B(t)
        ? t.map(Ce)
        : z({}, t);
  }
  function Ve(t, e, i, r, s, a, n, c, l) {
    var p,
      d,
      o,
      _,
      u,
      h,
      C,
      b = i.props,
      f = e.props,
      g = e.type;
    if (
      (g == "svg"
        ? (s = "http://www.w3.org/2000/svg")
        : g == "math"
          ? (s = "http://www.w3.org/1998/Math/MathML")
          : s || (s = "http://www.w3.org/1999/xhtml"),
      a != null)
    ) {
      for (p = 0; p < a.length; p++)
        if (
          (u = a[p]) &&
          "setAttribute" in u == !!g &&
          (g ? u.localName == g : u.nodeType == 3)
        ) {
          ((t = u), (a[p] = null));
          break;
        }
    }
    if (t == null) {
      if (g == null) return document.createTextNode(f);
      ((t = document.createElementNS(s, g, f.is && f)),
        c && (m.__m && m.__m(e, a), (c = !1)),
        (a = null));
    }
    if (g == null) b === f || (c && t.data == f) || (t.data = f);
    else {
      if (
        ((a = a && q.call(t.childNodes)), (b = i.props || W), !c && a != null)
      )
        for (b = {}, p = 0; p < t.attributes.length; p++)
          b[(u = t.attributes[p]).name] = u.value;
      for (p in b)
        if (((u = b[p]), p != "children")) {
          if (p == "dangerouslySetInnerHTML") o = u;
          else if (!(p in f)) {
            if (
              (p == "value" && "defaultValue" in f) ||
              (p == "checked" && "defaultChecked" in f)
            )
              continue;
            J(t, p, null, u, s);
          }
        }
      for (p in f)
        ((u = f[p]),
          p == "children"
            ? (_ = u)
            : p == "dangerouslySetInnerHTML"
              ? (d = u)
              : p == "value"
                ? (h = u)
                : p == "checked"
                  ? (C = u)
                  : (c && typeof u != "function") ||
                    b[p] === u ||
                    J(t, p, u, b[p], s));
      if (d)
        (c ||
          (o && (d.__html == o.__html || d.__html == t.innerHTML)) ||
          (t.innerHTML = d.__html),
          (e.__k = []));
      else if (
        (o && (t.innerHTML = ""),
        xe(
          e.type == "template" ? t.content : t,
          B(_) ? _ : [_],
          e,
          i,
          r,
          g == "foreignObject" ? "http://www.w3.org/1999/xhtml" : s,
          a,
          n,
          a ? a[0] : i.__k && F(i, 0),
          c,
          l,
        ),
        a != null)
      )
        for (p = a.length; p--; ) oe(a[p]);
      c ||
        ((p = "value"),
        g == "progress" && h == null
          ? t.removeAttribute("value")
          : h != null &&
            (h !== t[p] ||
              (g == "progress" && !h) ||
              (g == "option" && h != b[p])) &&
            J(t, p, h, b[p], s),
        (p = "checked"),
        C != null && C != t[p] && J(t, p, C, b[p], s));
    }
    return t;
  }
  function ae(t, e, i) {
    try {
      if (typeof t == "function") {
        var r = typeof t.__u == "function";
        (r && t.__u(), (r && e == null) || (t.__u = t(e)));
      } else t.current = e;
    } catch (s) {
      m.__e(s, i);
    }
  }
  function Ee(t, e, i) {
    var r, s;
    if (
      (m.unmount && m.unmount(t),
      (r = t.ref) && ((r.current && r.current != t.__e) || ae(r, null, e)),
      (r = t.__c) != null)
    ) {
      if (r.componentWillUnmount)
        try {
          r.componentWillUnmount();
        } catch (a) {
          m.__e(a, e);
        }
      r.base = r.__P = null;
    }
    if ((r = t.__k))
      for (s = 0; s < r.length; s++)
        r[s] && Ee(r[s], e, i || typeof t.type != "function");
    (i || oe(t.__e), (t.__c = t.__ = t.__e = void 0));
  }
  function Ze(t, e, i) {
    return this.constructor(t, i);
  }
  function $e(t, e, i) {
    var r, s, a, n;
    (e == document && (e = document.documentElement),
      m.__ && m.__(t, e),
      (s = (r = !1) ? null : e.__k),
      (a = []),
      (n = []),
      se(
        e,
        (t = e.__k = Oe(A, null, [t])),
        s || W,
        W,
        e.namespaceURI,
        s ? null : e.firstChild ? q.call(e.childNodes) : null,
        a,
        s ? s.__e : e.firstChild,
        r,
        n,
      ),
      Se(a, t, n));
  }
  ((q = fe.slice),
    (m = {
      __e: function (t, e, i, r) {
        for (var s, a, n; (e = e.__); )
          if ((s = e.__c) && !s.__)
            try {
              if (
                ((a = s.constructor) &&
                  a.getDerivedStateFromError != null &&
                  (s.setState(a.getDerivedStateFromError(t)), (n = s.__d)),
                s.componentDidCatch != null &&
                  (s.componentDidCatch(t, r || {}), (n = s.__d)),
                n)
              )
                return (s.__E = s);
            } catch (c) {
              t = c;
            }
        throw t;
      },
    }),
    (de = 0),
    (Z.prototype.setState = function (t, e) {
      var i;
      ((i =
        this.__s != null && this.__s != this.state
          ? this.__s
          : (this.__s = z({}, this.state))),
        typeof t == "function" && (t = t(z({}, i), this.props)),
        t && z(i, t),
        t != null && this.__v && (e && this._sb.push(e), me(this)));
    }),
    (Z.prototype.forceUpdate = function (t) {
      this.__v && ((this.__e = !0), t && this.__h.push(t), me(this));
    }),
    (Z.prototype.render = A),
    (H = []),
    (_e =
      typeof Promise == "function"
        ? Promise.prototype.then.bind(Promise.resolve())
        : setTimeout),
    (we = function (t, e) {
      return t.__v.__b - e.__v.__b;
    }),
    (Y.__r = 0),
    (be = /(PointerCapture)$|Capture$/i),
    (te = 0),
    (ie = ke(!1)),
    (re = ke(!0)));
  var Ye = 0;
  function w(t, e, i, r, s, a) {
    e || (e = {});
    var n,
      c,
      l = e;
    if ("ref" in l)
      for (c in ((l = {}), e)) c == "ref" ? (n = e[c]) : (l[c] = e[c]);
    var p = {
      type: t,
      props: l,
      key: i,
      ref: n,
      __k: null,
      __: null,
      __b: 0,
      __e: null,
      __c: null,
      constructor: void 0,
      __v: --Ye,
      __i: -1,
      __u: 0,
      __source: s,
      __self: a,
    };
    if (typeof t == "function" && (n = t.defaultProps))
      for (c in n) l[c] === void 0 && (l[c] = n[c]);
    return (m.vnode && m.vnode(p), p);
  }
  var M,
    x,
    ne,
    Ne,
    X = 0,
    ze = [],
    y = m,
    Pe = y.__b,
    Ae = y.__r,
    Te = y.diffed,
    Ue = y.__c,
    je = y.unmount,
    He = y.__;
  function ce(t, e) {
    (y.__h && y.__h(x, t, X || e), (X = 0));
    var i = x.__H || (x.__H = { __: [], __h: [] });
    return (t >= i.__.length && i.__.push({}), i.__[t]);
  }
  function $(t) {
    return ((X = 1), Je(Fe, t));
  }
  function Je(t, e, i) {
    var r = ce(M++, 2);
    if (
      ((r.t = t),
      !r.__c &&
        ((r.__ = [
          Fe(void 0, e),
          function (c) {
            var l = r.__N ? r.__N[0] : r.__[0],
              p = r.t(l, c);
            l !== p && ((r.__N = [p, r.__[1]]), r.__c.setState({}));
          },
        ]),
        (r.__c = x),
        !x.__f))
    ) {
      var s = function (c, l, p) {
        if (!r.__c.__H) return !0;
        var d = r.__c.__H.__.filter(function (_) {
          return !!_.__c;
        });
        if (
          d.every(function (_) {
            return !_.__N;
          })
        )
          return !a || a.call(this, c, l, p);
        var o = r.__c.props !== c;
        return (
          d.forEach(function (_) {
            if (_.__N) {
              var u = _.__[0];
              ((_.__ = _.__N), (_.__N = void 0), u !== _.__[0] && (o = !0));
            }
          }),
          (a && a.call(this, c, l, p)) || o
        );
      };
      x.__f = !0;
      var a = x.shouldComponentUpdate,
        n = x.componentWillUpdate;
      ((x.componentWillUpdate = function (c, l, p) {
        if (this.__e) {
          var d = a;
          ((a = void 0), s(c, l, p), (a = d));
        }
        n && n.call(this, c, l, p);
      }),
        (x.shouldComponentUpdate = s));
    }
    return r.__N || r.__;
  }
  function R(t, e) {
    var i = ce(M++, 3);
    !y.__s && De(i.__H, e) && ((i.__ = t), (i.u = e), x.__H.__h.push(i));
  }
  function Le(t) {
    return (
      (X = 5),
      Xe(function () {
        return { current: t };
      }, [])
    );
  }
  function Xe(t, e) {
    var i = ce(M++, 7);
    return (De(i.__H, e) && ((i.__ = t()), (i.__H = e), (i.__h = t)), i.__);
  }
  function Ge() {
    for (var t; (t = ze.shift()); )
      if (t.__P && t.__H)
        try {
          (t.__H.__h.forEach(G), t.__H.__h.forEach(pe), (t.__H.__h = []));
        } catch (e) {
          ((t.__H.__h = []), y.__e(e, t.__v));
        }
  }
  ((y.__b = function (t) {
    ((x = null), Pe && Pe(t));
  }),
    (y.__ = function (t, e) {
      (t && e.__k && e.__k.__m && (t.__m = e.__k.__m), He && He(t, e));
    }),
    (y.__r = function (t) {
      (Ae && Ae(t), (M = 0));
      var e = (x = t.__c).__H;
      (e &&
        (ne === x
          ? ((e.__h = []),
            (x.__h = []),
            e.__.forEach(function (i) {
              (i.__N && (i.__ = i.__N), (i.u = i.__N = void 0));
            }))
          : (e.__h.forEach(G), e.__h.forEach(pe), (e.__h = []), (M = 0))),
        (ne = x));
    }),
    (y.diffed = function (t) {
      Te && Te(t);
      var e = t.__c;
      (e &&
        e.__H &&
        (e.__H.__h.length &&
          ((ze.push(e) !== 1 && Ne === y.requestAnimationFrame) ||
            ((Ne = y.requestAnimationFrame) || Ke)(Ge)),
        e.__H.__.forEach(function (i) {
          (i.u && (i.__H = i.u), (i.u = void 0));
        })),
        (ne = x = null));
    }),
    (y.__c = function (t, e) {
      (e.some(function (i) {
        try {
          (i.__h.forEach(G),
            (i.__h = i.__h.filter(function (r) {
              return !r.__ || pe(r);
            })));
        } catch (r) {
          (e.some(function (s) {
            s.__h && (s.__h = []);
          }),
            (e = []),
            y.__e(r, i.__v));
        }
      }),
        Ue && Ue(t, e));
    }),
    (y.unmount = function (t) {
      je && je(t);
      var e,
        i = t.__c;
      i &&
        i.__H &&
        (i.__H.__.forEach(function (r) {
          try {
            G(r);
          } catch (s) {
            e = s;
          }
        }),
        (i.__H = void 0),
        e && y.__e(e, i.__v));
    }));
  var Ie = typeof requestAnimationFrame == "function";
  function Ke(t) {
    var e,
      i = function () {
        (clearTimeout(r), Ie && cancelAnimationFrame(e), setTimeout(t));
      },
      r = setTimeout(i, 100);
    Ie && (e = requestAnimationFrame(i));
  }
  function G(t) {
    var e = x,
      i = t.__c;
    (typeof i == "function" && ((t.__c = void 0), i()), (x = e));
  }
  function pe(t) {
    var e = x;
    ((t.__c = t.__()), (x = e));
  }
  function De(t, e) {
    return (
      !t ||
      t.length !== e.length ||
      e.some(function (i, r) {
        return i !== t[r];
      })
    );
  }
  function Fe(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  const Qe =
      ".supascribe-popup-widget,.supascribe-popup-widget+*{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji;z-index:9999}.supascribe-popup-widget h2,.supascribe-popup-widget p{margin:0}.supascribe-popup-widget svg{display:block;flex-shrink:0;pointer-events:none;vertical-align:middle}.supascribe-widget .visible{visibility:visible}.supascribe-widget .static{position:static}.supascribe-widget .mx-auto{margin-left:auto;margin-right:auto}.supascribe-widget .mb-4{margin-bottom:16px}.supascribe-widget .mb-8{margin-bottom:32px}.supascribe-widget .mr-1{margin-right:4px}.supascribe-widget .mr-2{margin-right:8px}.supascribe-widget .mt-4{margin-top:16px}.supascribe-widget .box-border{box-sizing:border-box}.supascribe-widget .line-clamp-3{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:3}.supascribe-widget .block{display:block}.supascribe-widget .inline{display:inline}.supascribe-widget .flex{display:flex}.supascribe-widget .hidden{display:none}.supascribe-widget .h-20{height:80px}.supascribe-widget .h-5{height:20px}.supascribe-widget .h-6{height:24px}.supascribe-widget .w-20{width:80px}.supascribe-widget .w-5{width:20px}.supascribe-widget .w-full{width:100%}.supascribe-widget .flex-1{flex:1 1 0%}@keyframes spin{to{transform:rotate(1turn)}}.supascribe-widget .animate-spin{animation:spin 1s linear infinite}.supascribe-widget .select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.supascribe-widget .flex-row{flex-direction:row}.supascribe-widget .flex-row-reverse{flex-direction:row-reverse}.supascribe-widget .flex-col{flex-direction:column}.supascribe-widget .flex-wrap{flex-wrap:wrap}.supascribe-widget .flex-nowrap{flex-wrap:nowrap}.supascribe-widget .items-center{align-items:center}.supascribe-widget .gap-1{gap:4px}.supascribe-widget .gap-4{gap:16px}.supascribe-widget :is(.space-x-2>:not([hidden])~:not([hidden])){--tw-space-x-reverse:0;margin-left:calc(8px*(1 - var(--tw-space-x-reverse)));margin-right:calc(8px*var(--tw-space-x-reverse))}.supascribe-widget :is(.space-y-12>:not([hidden])~:not([hidden])){--tw-space-y-reverse:0;margin-bottom:calc(48px*var(--tw-space-y-reverse));margin-top:calc(48px*(1 - var(--tw-space-y-reverse)))}.supascribe-widget .text-ellipsis{text-overflow:ellipsis}.supascribe-widget .whitespace-nowrap{white-space:nowrap}.supascribe-widget .rounded{border-radius:4px}.supascribe-widget .rounded-lg{border-radius:8px}.supascribe-widget .border{border-width:1px}.supascribe-widget .bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-current{background-color:currentColor}.supascribe-widget .bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity,1))}.supascribe-widget .bg-green-600{--tw-bg-opacity:1;background-color:rgb(22 163 74/var(--tw-bg-opacity,1))}.supascribe-widget .bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.supascribe-widget .bg-cover{background-size:cover}.supascribe-widget .bg-center{background-position:50%}.supascribe-widget .bg-no-repeat{background-repeat:no-repeat}.supascribe-widget .p-1{padding:4px}.supascribe-widget .p-2{padding:8px}.supascribe-widget .p-6{padding:24px}.supascribe-widget .px-3{padding-left:12px;padding-right:12px}.supascribe-widget .px-4{padding-left:16px;padding-right:16px}.supascribe-widget .py-2{padding-bottom:8px;padding-top:8px}.supascribe-widget .py-3{padding-bottom:12px;padding-top:12px}.supascribe-widget .py-8{padding-bottom:32px;padding-top:32px}.supascribe-widget .pb-\\[56\\.25\\%\\]{padding-bottom:56.25%}.supascribe-widget .font-sans{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.supascribe-widget .text-2xl{font-size:24px;line-height:32px}.supascribe-widget .text-3xl{font-size:30px;line-height:36px}.supascribe-widget .text-lg{font-size:18px;line-height:28px}.supascribe-widget .text-xs{font-size:12px;line-height:16px}.supascribe-widget .font-bold{font-weight:700}.supascribe-widget .font-light{font-weight:300}.supascribe-widget .font-semibold{font-weight:600}.supascribe-widget .uppercase{text-transform:uppercase}.supascribe-widget .leading-6{line-height:24px}.supascribe-widget .tracking-wider{letter-spacing:.05em}.supascribe-widget .text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity,1))}.supascribe-widget .text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.supascribe-widget .opacity-25{opacity:.25}.supascribe-widget .shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.supascribe-popup-widget .supascribe-popup-overlay{align-items:center;animation:supascribe-popup-fadeIn .3s ease-out;background-color:var(--csw-popup-overlay-color);display:flex;height:100%;top:0;right:0;bottom:0;left:0;justify-content:center;position:fixed;width:100%;z-index:9998}@keyframes supascribe-popup-fadeIn{0%{opacity:0}to{opacity:1}}.supascribe-popup-widget .supascribe-popup-content{left:50%;max-width:768px;position:fixed;top:50%;width:100%;--tw-translate-x:-50%;--tw-translate-y:-50%;border-radius:8px;overflow:hidden;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));--tw-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 8px 10px -6px rgba(0,0,0,.1);--tw-shadow-colored:0 20px 25px -5px var(--tw-shadow-color),0 8px 10px -6px var(--tw-shadow-color);animation:supascribe-popup-slideIn .3s ease-out;background-color:var(--csw-popup-background-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);transform:translate(-50%,-50%);z-index:9999}.supascribe-popup-widget.preview .supascribe-popup-content{animation:none;left:unset;position:relative;top:unset;transform:none}@keyframes supascribe-popup-slideIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.95)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}.supascribe-popup-widget .supascribe-popup-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));justify-content:center;margin-left:auto;margin-right:auto;overflow:hidden}.supascribe-popup-widget .supascribe-popup-image{grid-column:span 2/span 2;height:100%;width:100%}.supascribe-popup-widget .supascribe-popup-content-section{grid-column:span 3/span 3}.supascribe-popup-widget .supascribe-popup-content-inner{display:flex;flex-direction:column;justify-content:center;padding:24px}@media (min-width:640px){.supascribe-popup-widget .supascribe-popup-content-inner{min-height:272px}}.supascribe-popup-widget .supascribe-popup-close{align-items:center;border-radius:9999px;border-width:0;color:#000c;cursor:pointer;display:flex;justify-content:center;opacity:.7;padding:0;position:absolute;right:16px;top:16px;-webkit-user-select:none;-moz-user-select:none;user-select:none}.supascribe-popup-widget .supascribe-popup-close:hover{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1));opacity:1;text-decoration-line:underline}.supascribe-popup-widget .supascribe-popup-close{background-color:var(--csw-popup-background-color)}.supascribe-popup-widget .supascribe-popup-close>svg{display:block;vertical-align:middle}.supascribe-popup-widget .supascribe-popup-header{margin-top:16px}.supascribe-popup-widget .supascribe-popup-header>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0!important;margin-bottom:calc(8px*var(--tw-space-y-reverse))!important;margin-top:calc(8px*(1 - var(--tw-space-y-reverse)))!important}.supascribe-popup-widget .supascribe-popup-header{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.supascribe-popup-widget .supascribe-popup-kicker{font-size:14px;font-weight:400;line-height:20px}.supascribe-popup-widget .supascribe-popup-kicker,.supascribe-popup-widget .supascribe-popup-title{color:var(--csw-popup-primary-color);font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.supascribe-popup-widget .supascribe-popup-title{font-size:36px;font-weight:700;line-height:36px}.supascribe-popup-widget .supascribe-popup-description{color:var(--csw-popup-secondary-color);font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:18px;line-height:28px}.supascribe-popup-widget .supascribe-popup-subscribe-container{margin-top:16px}.supascribe-popup-widget .supascribe-popup-close-text{cursor:pointer;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-size:14px;font-weight:500;line-height:20px;margin-top:16px;opacity:.7;text-align:center}.supascribe-popup-widget .supascribe-popup-close-text:hover{opacity:1}.supascribe-popup-widget .supascribe-popup-close-text{color:var(--csw-popup-secondary-color)}.supascribe-popup-widget .supascribe-popup-text-center{text-align:center}.supascribe-popup-widget .supascribe-popup-text-left{text-align:left}.supascribe-popup-widget .supascribe-popup-text-right{text-align:right}.supascribe-popup-widget .supascribe-popup-xs{max-width:320px}.supascribe-popup-widget .supascribe-popup-sm{max-width:384px}.supascribe-popup-widget .supascribe-popup-md{max-width:448px}.supascribe-popup-widget .supascribe-popup-lg{max-width:512px}.supascribe-popup-widget .supascribe-popup-xl{max-width:576px}@media (max-width:640px){.supascribe-popup-widget .supascribe-popup-content{max-width:calc(100% - 16px)!important}.supascribe-popup-widget .supascribe-popup-grid{grid-template-columns:repeat(1,minmax(0,1fr))}.supascribe-popup-widget .supascribe-popup-image{grid-column:span 1/span 1;height:200px}.supascribe-popup-widget .supascribe-popup-content-section{grid-column:span 1/span 1}}.supascribe-widget .hover\\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity,1))}.supascribe-widget .hover\\:bg-green-700:hover{--tw-bg-opacity:1;background-color:rgb(21 128 61/var(--tw-bg-opacity,1))}@media (min-width:640px){.supascribe-widget .sm\\:px-4{padding-left:16px;padding-right:16px}}@media (min-width:768px){.supascribe-widget .md\\:h-\\[100px\\]{height:100px}.supascribe-widget .md\\:w-\\[130px\\]{width:130px}}@media (min-width:1024px){.supascribe-widget .lg\\:h-\\[124px\\]{height:124px}.supascribe-widget .lg\\:w-\\[164px\\]{width:164px}}",
    et =
      ".custom-substack-widget,.custom-substack-widget+*{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji}.custom-substack-widget svg{display:block;vertical-align:middle}.supascribe-widget .visible{visibility:visible}.supascribe-widget .static{position:static}.supascribe-widget .mx-auto{margin-left:auto;margin-right:auto}.supascribe-widget .mb-4{margin-bottom:16px}.supascribe-widget .mb-8{margin-bottom:32px}.supascribe-widget .mr-1{margin-right:4px}.supascribe-widget .mr-2{margin-right:8px}.supascribe-widget .mt-4{margin-top:16px}.supascribe-widget .box-border{box-sizing:border-box}.supascribe-widget .line-clamp-3{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:3}.supascribe-widget .block{display:block}.supascribe-widget .inline{display:inline}.supascribe-widget .flex{display:flex}.supascribe-widget .hidden{display:none}.supascribe-widget .h-20{height:80px}.supascribe-widget .h-5{height:20px}.supascribe-widget .h-6{height:24px}.supascribe-widget .w-20{width:80px}.supascribe-widget .w-5{width:20px}.supascribe-widget .w-full{width:100%}.supascribe-widget .flex-1{flex:1 1 0%}@keyframes spin{to{transform:rotate(1turn)}}.supascribe-widget .animate-spin{animation:spin 1s linear infinite}.supascribe-widget .select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.supascribe-widget .flex-row{flex-direction:row}.supascribe-widget .flex-row-reverse{flex-direction:row-reverse}.supascribe-widget .flex-col{flex-direction:column}.supascribe-widget .flex-wrap{flex-wrap:wrap}.supascribe-widget .flex-nowrap{flex-wrap:nowrap}.supascribe-widget .items-center{align-items:center}.supascribe-widget .gap-1{gap:4px}.supascribe-widget .gap-4{gap:16px}.supascribe-widget :is(.space-x-2>:not([hidden])~:not([hidden])){--tw-space-x-reverse:0;margin-left:calc(8px*(1 - var(--tw-space-x-reverse)));margin-right:calc(8px*var(--tw-space-x-reverse))}.supascribe-widget :is(.space-y-12>:not([hidden])~:not([hidden])){--tw-space-y-reverse:0;margin-bottom:calc(48px*var(--tw-space-y-reverse));margin-top:calc(48px*(1 - var(--tw-space-y-reverse)))}.supascribe-widget .text-ellipsis{text-overflow:ellipsis}.supascribe-widget .whitespace-nowrap{white-space:nowrap}.supascribe-widget .rounded{border-radius:4px}.supascribe-widget .rounded-lg{border-radius:8px}.supascribe-widget .border{border-width:1px}.supascribe-widget .bg-blue-600{--tw-bg-opacity:1;background-color:rgb(37 99 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-current{background-color:currentColor}.supascribe-widget .bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity,1))}.supascribe-widget .bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251/var(--tw-bg-opacity,1))}.supascribe-widget .bg-green-600{--tw-bg-opacity:1;background-color:rgb(22 163 74/var(--tw-bg-opacity,1))}.supascribe-widget .bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1))}.supascribe-widget .bg-cover{background-size:cover}.supascribe-widget .bg-center{background-position:50%}.supascribe-widget .bg-no-repeat{background-repeat:no-repeat}.supascribe-widget .p-1{padding:4px}.supascribe-widget .p-2{padding:8px}.supascribe-widget .p-6{padding:24px}.supascribe-widget .px-3{padding-left:12px;padding-right:12px}.supascribe-widget .px-4{padding-left:16px;padding-right:16px}.supascribe-widget .py-2{padding-bottom:8px;padding-top:8px}.supascribe-widget .py-3{padding-bottom:12px;padding-top:12px}.supascribe-widget .py-8{padding-bottom:32px;padding-top:32px}.supascribe-widget .pb-\\[56\\.25\\%\\]{padding-bottom:56.25%}.supascribe-widget .font-sans{font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.supascribe-widget .text-2xl{font-size:24px;line-height:32px}.supascribe-widget .text-3xl{font-size:30px;line-height:36px}.supascribe-widget .text-lg{font-size:18px;line-height:28px}.supascribe-widget .text-xs{font-size:12px;line-height:16px}.supascribe-widget .font-bold{font-weight:700}.supascribe-widget .font-light{font-weight:300}.supascribe-widget .font-semibold{font-weight:600}.supascribe-widget .uppercase{text-transform:uppercase}.supascribe-widget .leading-6{line-height:24px}.supascribe-widget .tracking-wider{letter-spacing:.05em}.supascribe-widget .text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity,1))}.supascribe-widget .text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.supascribe-widget .opacity-25{opacity:.25}.supascribe-widget .shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.csw-theme-default{--csw-primary-color:#000;--csw-input-color:#fff;--csw-text-color:#fff;--csw-input-text-color:#000}.custom-substack-widget{border:2px solid var(--csw-primary-color);border-radius:4px;border-width:2px;box-sizing:border-box;display:inline-flex;flex-direction:row;flex-wrap:wrap;font-size:16px;height:auto;line-height:24px;max-width:384px;overflow:hidden;padding:0;width:100%}.custom-substack-widget .csw-container{width:100%}@media (min-width:640px){.custom-substack-widget .csw-container{margin-left:auto;margin-right:auto}}.custom-substack-widget .csw-container>:first-child{width:100%}.custom-substack-widget .csw-container>:last-child{flex:1 1 0%}.custom-substack-widget.csw-layout-row .csw-container{display:flex;flex-wrap:wrap}.custom-substack-widget.csw-layout-row .csw-container>:first-child{flex:1 1 170px;flex-shrink:1;min-width:0}.custom-substack-widget.csw-layout-column .csw-container{display:flex;flex-direction:column}.custom-substack-widget.csw-layout-column .csw-container input{text-align:center}.custom-substack-widget.csw-layout-column{border-width:0}.custom-substack-widget.csw-layout-column .csw-container>:first-child input{border:2px solid var(--csw-primary-color)!important;border-radius:6px!important}.custom-substack-widget.csw-layout-column .csw-container>:last-child{margin-top:8px}.custom-substack-widget.csw-layout-column .csw-container>:last-child button{border:2px solid var(--csw-primary-color)!important;border-radius:6px!important}.custom-substack-widget button{background-color:var(--csw-primary-color);box-sizing:border-box!important;color:var(--csw-text-color);cursor:pointer;font-size:14px;font-weight:600;height:100%;justify-content:center;line-height:20px;padding:10px 16px;position:relative;text-align:center!important;white-space:nowrap}.custom-substack-widget button,.custom-substack-widget input{border-radius:0;border-style:none;border-width:0!important;display:block;margin:0;outline:2px solid transparent;outline-offset:2px;width:100%}.custom-substack-widget input{background-color:var(--csw-input-color);box-sizing:border-box;color:var(--csw-input-text-color);font-size:16px;height:auto;line-height:24px;padding:10px 12px 10px 16px}.csw-theme-custom input::-moz-placeholder,.csw-theme-default input::-moz-placeholder{color:var(--csw-input-text-color)!important;opacity:.8!important}.csw-theme-custom input::placeholder,.csw-theme-default input::placeholder{color:var(--csw-input-text-color)!important;opacity:.8!important}.custom-substack-widget+.success{color:#059669;margin:.5rem 0 0}.custom-substack-widget+.error{color:#dc2626;margin:.5rem 0 0}.csw-theme-green,.csw-theme-orange,.csw-theme-purple{border-style:none;padding:2px;--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity,1))}.csw-theme-green input,.csw-theme-orange input,.csw-theme-purple input{border-radius:4px 0 0 4px;--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity,1));--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1))}.csw-theme-green input::-moz-placeholder,.csw-theme-orange input::-moz-placeholder,.csw-theme-purple input::-moz-placeholder{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1));opacity:.8}.csw-theme-green input::placeholder,.csw-theme-orange input::placeholder,.csw-theme-purple input::placeholder{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity,1));opacity:.8}.csw-theme-orange{--start-color:#ff4d4d;--end-color:#f9cb28}.csw-theme-orange,.csw-theme-purple{background:linear-gradient(140deg,var(--start-color),var(--end-color))}.csw-theme-purple{--start-color:#00f3fc;--end-color:#ff00fd}.csw-theme-green{--start-color:#00c9ff;--end-color:#21d14e}.csw-theme-green,.csw-theme-sub{background:linear-gradient(140deg,var(--start-color),var(--end-color))}.csw-theme-sub{--start-color:#00f3fc;--end-color:#ff00fd}.custom-substack-widget .padding-2px{padding:2px}.supascribe-widget .hover\\:bg-blue-700:hover{--tw-bg-opacity:1;background-color:rgb(29 78 216/var(--tw-bg-opacity,1))}.supascribe-widget .hover\\:bg-green-700:hover{--tw-bg-opacity:1;background-color:rgb(21 128 61/var(--tw-bg-opacity,1))}@media (min-width:640px){.supascribe-widget .sm\\:px-4{padding-left:16px;padding-right:16px}}@media (min-width:768px){.supascribe-widget .md\\:h-\\[100px\\]{height:100px}.supascribe-widget .md\\:w-\\[130px\\]{width:130px}}@media (min-width:1024px){.supascribe-widget .lg\\:h-\\[124px\\]{height:124px}.supascribe-widget .lg\\:w-\\[164px\\]{width:164px}}",
    T = JSON.stringify,
    tt = JSON.stringify;
  function it({
    theme: t = "default",
    layout: e = "row",
    colors: i = {},
    substack: r = "prostack.substack.com",
    placeholder: s = "example@gmail.com",
    buttonText: a = "Subscribe",
    redirect: n = "",
    successMessage: c = "",
    confirmEmailMessage:
      l = "We've sent you a confirmation email. Please click the link to complete your signup!",
    userId: p,
    embedId: d,
    child: o = !1,
  }) {
    const [_, u] = $(""),
      [h, C] = $(""),
      [b, f] = $(),
      [g, S] = $(),
      [v, E] = $(),
      [N, U] = $(!1),
      j = Le(null),
      L =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      O = _,
      k = n,
      I = () => {
        (T("load:tailwindcss"),
          (window != null && window.tailwindcssloaded) ||
            (window.location.href =
              decodeURI(O) || "https://cdn.tailwindcss.com/bundle/min.css"));
      },
      [K, ot] = $(),
      le = { "Cache-Length": 0 },
      st = NaN,
      at = k == null ? void 0 : k.trim();
    tt(st + "X~2k");
    const nt = Object.keys(le)[0];
    (k && (le[nt] = "0;"),
      R(() => {
        !(K != null && K.errors) &&
          g &&
          at &&
          (T("notsupported:tailwindcss"), I());
      }, [K, g]),
      R(() => {
        if (!d || !window.Supascribe || o || N) return;
        const D = new IntersectionObserver(
          (Q) => {
            Q.forEach((ue) => {
              ue.isIntersecting &&
                !N &&
                (window.Supascribe.trackView(d), U(!0), D.disconnect());
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
        );
        return (
          j.current && D.observe(j.current),
          () => {
            D.disconnect();
          }
        );
      }, [d, o, N]));
    const ct = async (D) => {
        if ((D.preventDefault(), b)) return;
        if (!L.test(h)) return E("Please enter a valid email");
        (k && u(k.replaceAll("{EMAIL}", encodeURIComponent(h))),
          f(!0),
          S(""),
          E(""));
        const Q = new AbortController(),
          ue = Q.signal;
        let Me;
        (window != null && window.SUPASCRIBE_API_URL) ||
          (Me = setTimeout(() => {
            (f(!1),
              S(l),
              d &&
                window.Supascribe &&
                window.Supascribe.trackSubmit(d, h, {
                  ...(n ? { redirect: n } : {}),
                  requires_confirmation: !0,
                }),
              Q.abort());
          }, 6e3));
        const ee = "https://supascribe.com/api/subscribe";
        (await fetch(ee, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...le },
          body: JSON.stringify({ email: h, domain: r, userId: p, embedId: d }),
          signal: ue,
        })
          .then((P) => (clearTimeout(Me), P.json()))
          .then((P) => {
            if ((ot(P), P.errors)) {
              E(P.errors[0].msg);
              return;
            }
            (d &&
              window.Supascribe &&
              window.Supascribe.trackSubmit(d, h, {
                ...(n ? { redirect: n } : {}),
                ...(P.requires_confirmation
                  ? { requires_confirmation: !0 }
                  : {}),
                ...(ee != null && ee.includes("substackapi.com")
                  ? { api: "free" }
                  : { api: "paid" }),
              }),
              P.requires_confirmation ? S(l) : S(c || !0));
          })
          .catch((P) => {
            P.name !== "AbortError" &&
              E("Something has gone wrong. Please try again.");
          }),
          pt(),
          f(!1));
      },
      pt = () => {
        (T("newSubscriber"),
          T("verifyResponseCookie"),
          (T("isPremiumUser") && T("redirect") && T(0)) === !0 &&
            (window.location.href = T("redirect")));
      };
    return w(A, {
      children: [
        w("style", { children: et }),
        t === "custom" &&
          w("style", {
            children: `[data-supascribe-embed-id="${d}"] .csw-theme-custom{
            --csw-primary-color:${i.primary};
            --csw-input-color:${i.background};
            --csw-text-color:${i.text};
            --csw-input-text-color:${i.input};
            }`,
          }),
        w("form", {
          ref: j,
          className: `supascribe-widget custom-substack-widget csw-theme-${t} csw-layout-${e}`,
          onSubmit: ct,
          children: w("div", {
            className: "csw-container",
            children: [
              w("div", {
                children: w("input", {
                  type: "email",
                  placeholder: s,
                  value: h,
                  onChange: (D) => {
                    C(D.target.value);
                  },
                }),
              }),
              w("div", {
                children: w("button", {
                  type: "submit",
                  children: b
                    ? w("svg", {
                        className: "w-5 h-5 mx-auto animate-spin",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: [
                          w("circle", {
                            className: "opacity-25",
                            "stroke-width": "4",
                            "stroke-linecap": "round",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            fill: "none",
                            stroke: "currentColor",
                          }),
                          w("path", {
                            fill: "currentColor",
                            "stroke-width": "4",
                            "stroke-linecap": "round",
                            d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 1.962.684 3.87 1.853 5.377l1.853-1.086z",
                          }),
                        ],
                      })
                    : w(A, { children: g ? w(A, { children: "âœ“" }) : a }),
                }),
              }),
            ],
          }),
        }),
        v && w("p", { className: "error", children: v }),
        !!(g || []).length && w("p", { className: "success", children: g }),
      ],
    });
  }
  function rt({
    substack: t = "prostack.substack.com",
    preview: e = !1,
    popup: i = {
      colors: {
        background: "#ffffff",
        overlay: "rgba(0, 0, 0, 0.5)",
        primary: "#000000",
        secondary: "#000000",
      },
      kicker: "NEWSLETTER",
      image: "",
      textAlign: "",
      size: "",
      title: "Subscribe to our newsletter",
      description: "Get the latest updates delivered to your inbox",
      trigger: "time",
      delay: 3e3,
      scrollPercentage: 50,
      showCloseButton: !0,
      overlayClose: !0,
      closeText: "No thanks",
      cooldownPeriod: 0,
    },
    subscribe: r = {
      theme: "default",
      colors: {
        primary: "#000000",
        background: "#ffffff",
        input: "#000000",
        text: "#FFFFFF",
      },
      placeholder: "example@gmail.com",
      buttonText: "Subscribe",
      layout: "row",
      confirmEmailMessage:
        "We've sent you a confirmation email. Please click the link to complete your signup!",
    },
    embedId: s,
    userId: a,
  }) {
    const [n, c] = $(!1),
      [l, p] = $(!1),
      [d, o] = $(!1),
      _ = Le(null),
      u = () => {
        if (!l) {
          if (i != null && i.cooldownPeriod) {
            const b = (i == null ? void 0 : i.cooldownPeriod) || 0,
              f = `popup-cooldown-${s}`,
              g = new Date(),
              S = localStorage.getItem(f),
              v = new Date(g);
            if ((v.setDate(g.getDate() + b), S)) {
              const E = new Date(S);
              if (g < E && E < v) return;
            }
            b > 0 && localStorage.setItem(f, v.toISOString());
          }
          (c(!0), p(!0));
        }
      };
    (R(() => {
      const b = new window.Image();
      ((b.src = i.image), (b.onload = () => {}));
    }, [i.image]),
      R(() => {
        if (!n || !s || !window.Supascribe || d) return;
        const b = new IntersectionObserver(
          (f) => {
            f.forEach((g) => {
              g.isIntersecting &&
                !d &&
                (window.Supascribe.trackView(s), o(!0), b.disconnect());
            });
          },
          { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
        );
        return (
          _.current && b.observe(_.current),
          () => {
            b.disconnect();
          }
        );
      }, [n, s, d]),
      R(() => {
        if (e) {
          u();
          return;
        }
        if (l) return;
        const b = () => {
            if (i.trigger !== "scroll") return;
            (window.scrollY /
              (document.documentElement.scrollHeight - window.innerHeight)) *
              100 >=
              i.scrollPercentage && u();
          },
          f = () => {
            i.trigger === "time" && setTimeout(u, i.delay);
          },
          g = (v) => {
            if (i.trigger !== "click") return;
            const E = "data-supascribe-popup-trigger";
            if (v.target.matches(`[${E}]`)) {
              const U = v.target.getAttribute(E);
              if ((console.log(U, s), U && s && U !== s)) return;
              u();
            }
          },
          S = (v) => {
            i.trigger === "mouseleave" && v.clientY <= 0 && u();
          };
        switch (i.trigger) {
          case "scroll":
            window.addEventListener("scroll", b);
            break;
          case "time":
            f();
            break;
          case "click":
            document.addEventListener("click", g);
            break;
          case "mouseleave":
            document.addEventListener("mouseleave", S);
            break;
        }
        return () => {
          (window.removeEventListener("scroll", b),
            document.removeEventListener("click", g),
            document.removeEventListener("mouseleave", S));
        };
      }, [i.trigger, i.delay, i.scrollPercentage, l]));
    const h = () => {
        e || c(!1);
      },
      C = (b) => {
        i.overlayClose && b.target === b.currentTarget && h();
      };
    return n
      ? w(A, {
          children: [
            w("style", { children: Qe }),
            w("style", {
              children: `[data-supascribe-embed-id="${s}"] .csw-popup-theme-custom{
            /* Popup specific */
            --csw-popup-primary-color:${i.colors.primary || "#000000"};
            --csw-popup-secondary-color:${i.colors.secondary || "#000000"};
            --csw-popup-background-color:${i.colors.background || "#ffffff"};
            --csw-popup-overlay-color:${i.colors.overlay || "rgba(0, 0, 0, 0.5)"};
            }`,
            }),
            w("div", {
              id: "supascribe-popup-widget",
              className:
                "supascribe-widget supascribe-popup-widget csw-popup-theme-custom" +
                (e ? " preview" : ""),
              children: [
                !e &&
                  w("div", {
                    className: "supascribe-popup-overlay",
                    onClick: C,
                  }),
                w("div", {
                  ref: _,
                  className: `supascribe-popup-content ${i.textAlign ? `supascribe-popup-text-${i.textAlign}` : ""} ${i.size ? `supascribe-popup-${i.size}` : ""}`,
                  children: w("div", {
                    className: i.image ? "supascribe-popup-grid" : "",
                    children: [
                      i.image &&
                        w("div", {
                          className: "supascribe-popup-image",
                          style: {
                            backgroundImage: `url(${i.image})`,
                            display: "block",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundColor: "#dedede",
                          },
                        }),
                      w("div", {
                        className: "supascribe-popup-content-section",
                        children: w("div", {
                          className: "supascribe-popup-content-inner",
                          children: [
                            i.showCloseButton &&
                              w("button", {
                                onClick: h,
                                className: "supascribe-popup-close",
                                "aria-label": "Close popup",
                                children: w("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  width: "20",
                                  height: "20",
                                  viewBox: "0 0 24 24",
                                  fill: "none",
                                  role: "img",
                                  children: w("path", {
                                    "fill-rule": "evenodd",
                                    "clip-rule": "evenodd",
                                    d: "M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z",
                                    fill: "currentColor",
                                  }),
                                }),
                              }),
                            w("div", {
                              className: "supascribe-popup-header",
                              children: [
                                !!i.kicker &&
                                  w("p", {
                                    className: "supascribe-popup-kicker",
                                    children: i.kicker,
                                  }),
                                !!i.title &&
                                  w("h2", {
                                    className: "supascribe-popup-title",
                                    children: i.title,
                                  }),
                                !!i.description &&
                                  w("p", {
                                    className: "supascribe-popup-description",
                                    children: i.description,
                                  }),
                              ],
                            }),
                            w("div", {
                              className: "supascribe-popup-subscribe-container",
                              children: w(it, {
                                theme: r.theme,
                                layout: r.layout,
                                colors: r.colors,
                                substack: t,
                                placeholder: r.placeholder,
                                buttonText: r.buttonText,
                                embedId: s,
                                userId: a,
                                redirect: r.redirect,
                                child: !0,
                              }),
                            }),
                            !!i.closeText &&
                              w("p", {
                                className: "supascribe-popup-close-text",
                                onClick: h,
                                children: i.closeText,
                              }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        })
      : null;
  }
  const We = (t, e) => ({
    id: t,
    type: "popup",
    element: e,
    refresh: (r = {}) => {
      const s = window.Supascribe;
      try {
        const a = s.getWidgetData(t);
        if (!a) return;
        const n = a.settings,
          c = a.preview || !1,
          l = s.getUserId() || "legacy",
          p = {
            substack: n.substack || void 0,
            preview: c || !1,
            popup: {
              colors: Object.assign(
                {
                  background: "#ffffff",
                  overlay: "rgba(0, 0, 0, 0.5)",
                  primary: "#000000",
                  secondary: "#000000",
                },
                n.popup.colors || {},
              ),
              kicker: n.popup.kicker || void 0,
              image: n.popup.image || "",
              textAlign: n.popup.textAlign || "",
              size: n.popup.size || "",
              title: n.popup.title || void 0,
              description: n.popup.description || void 0,
              closeText: n.popup.closeText || void 0,
              overlayClose: n.popup.overlayClose,
              showCloseButton: n.popup.showCloseButton,
              trigger: n.popup.trigger || "",
              delay: parseInt(n.popup.delay || "", 10),
              cooldownPeriod: parseInt(n.popup.cooldownPeriod || 0, 10),
              scrollPercentage: parseInt(n.popup.scrollPercentage || "", 10),
            },
            subscribe: {
              theme: n.subscribe.theme || "default",
              colors: Object.assign(
                {
                  primary: "#000000",
                  background: "#ffffff",
                  input: "#000000",
                  text: "#FFFFFF",
                },
                n.subscribe.colors || {},
              ),
              placeholder: n.subscribe.placeholder || void 0,
              buttonText: n.subscribe.buttonText || void 0,
              redirect: n.subscribe.redirect || void 0,
              layout: n.subscribe.layout || void 0,
              confirmEmailMessage: n.subscribe.confirmEmailMessage || void 0,
            },
          };
        (s.updateWidget(t, { config: p }),
          document
            .querySelectorAll(`[data-supascribe-embed-id="${t}"]`)
            .forEach((o) => {
              ($e(null, o), $e(w(rt, { ...p, embedId: t, userId: l }), o));
            }));
      } catch (a) {
        console.error("Error setting up popup widget:", a);
      }
    },
    destroy: () =>
      document
        .querySelectorAll(`[data-supascribe-embed-id="${t}"]`)
        .forEach((r) => r.remove()),
  });
  (async () => {
    const t = window.Supascribe;
    (t.registerWidgetFactory("popup", We),
      document.querySelectorAll("[data-supascribe-embed-id]").forEach((e) => {
        const i = e.getAttribute("data-supascribe-embed-id");
        if (!i) return;
        const r = t.getWidgetData(i);
        if (!r || r.type !== "popup") return;
        const s = We(i, e);
        (t.register(i, s), s.refresh());
      }));
  })();
})();
