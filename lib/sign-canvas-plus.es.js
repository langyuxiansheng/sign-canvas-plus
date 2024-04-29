import { getCurrentInstance as Y, reactive as q, onMounted as J, onBeforeUnmount as N, watch as A, toRefs as Q, defineComponent as j, mergeModels as B, useModel as G, openBlock as K, createElementBlock as O, withModifiers as u, unref as r } from "vue";
const P = (c) => ({ x: c.offsetX || c.clientX, y: c.offsetY || c.clientY }), Z = () => {
  const { emit: c, props: x } = Y(), i = q({
    // domId: `sign-canvas-${Math.random().toString(36).substring(2)}`,
    canvasElement: null,
    context: null,
    dpr: 0,
    config: {
      isFullScreen: !1,
      // 是否全屏手写 [Boolean] 可选
      isFullCover: !1,
      // 是否全屏模式下覆盖所有的元素 [Boolean] 可选
      isDpr: !1,
      // 是否使用dpr兼容高分屏 [Boolean] 可选
      lastWriteSpeed: 1,
      // 书写速度 [Number] 可选
      lastWriteWidth: 2,
      // 下笔的宽度 [Number] 可选
      lineCap: "round",
      // 线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
      lineJoin: "round",
      // 线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
      canvasWidth: 600,
      // canvas宽高 [Number] 可选
      canvasHeight: 600,
      // 高度  [Number] 可选
      isShowBorder: !0,
      // 是否显示边框 [可选]
      bgColor: "#fcc",
      // 背景色 [String] 可选 注:这背景色仅仅只是canvas背景,保存的图片仍然是透明的
      borderWidth: 1,
      // 网格线宽度  [Number] 可选
      borderColor: "#ff787f",
      // 网格颜色  [String] 可选
      writeWidth: 5,
      // 基础轨迹宽度  [Number] 可选
      maxWriteWidth: 30,
      // 写字模式最大线宽  [Number] 可选
      minWriteWidth: 5,
      // 写字模式最小线宽  [Number] 可选
      writeColor: "#101010",
      // 轨迹颜色  [String] 可选
      isSign: !1,
      // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
      imgType: "png",
      //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
      quality: 1,
      //压缩比例  [Number] 可选
      lastWriteTime: 0,
      isWrite: !1,
      lastPoint: {
        x: 0,
        y: 0
      }
    },
    resizeTimer: null,
    canvasImage: null
  }), g = () => {
    console.log(i.canvasElement);
    const e = x.options;
    if (e)
      for (const o in e)
        e[o] != null && e[o] != null && (i.config[o] = e[o]);
    i.dpr = typeof window < "u" && i.config.isDpr && (window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio) || 1;
    const { canvasElement: t, config: n } = i;
    t && (i.context = t.getContext("2d"), n.isFullScreen && (n.canvasWidth = window.innerWidth || document.body.clientWidth, n.canvasHeight = window.innerHeight || document.body.clientHeight, n.isFullCover && (t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.margin = "0", t.style.zIndex = "20001")), n.canvasWidth && (t.width = n.canvasWidth), n.canvasHeight && (t.height = n.canvasHeight), I(), S());
  }, y = () => {
    const { config: e } = i, t = (/* @__PURE__ */ new Date()).getTime(), n = t - e.lastWriteTime;
    if (e.lastWriteTime = t, e.minWriteWidth != null && e.maxWriteWidth != null && i.context) {
      let o = e.minWriteWidth + (e.maxWriteWidth - e.minWriteWidth) * n / 30;
      if (o < e.minWriteWidth ? o = e.minWriteWidth : o > e.maxWriteWidth && (o = e.maxWriteWidth), o = +o.toFixed(2), e.isSign)
        i.context.lineWidth = (e.writeWidth ?? 0) * i.dpr;
      else {
        const a = e.lastWriteWidth = (e.lastWriteWidth ?? 0) / 4 * 3 + o / 4;
        i.context.lineWidth = a * i.dpr;
      }
    }
  }, p = (e) => {
    i.config.isWrite = !0, i.config.lastWriteTime = (/* @__PURE__ */ new Date()).getTime(), console.log(e), i.config.lastPoint = e, C();
  }, W = (e) => {
    const { context: t, config: n, dpr: o } = i;
    t && (t.beginPath(), t.moveTo(n.lastPoint.x * o, n.lastPoint.y * o), t.lineTo(e.x * o, e.y * o), y(), t.stroke(), n.lastPoint = e, t.closePath());
  }, T = (e) => {
    const { config: t } = i;
    t.isWrite = !1, t.lastPoint = e, k();
  }, C = () => {
    const { context: e, config: { writeColor: t, lineCap: n, lineJoin: o } } = i;
    e && (e.beginPath(), t && (e.strokeStyle = t), n && (e.lineCap = n), o && (e.lineJoin = o));
  }, S = () => {
    const { context: e, canvasElement: t, config: { writeColor: n, bgColor: o, borderWidth: a, borderColor: h, isShowBorder: m, isSign: d }, dpr: v } = i;
    if (e && t) {
      if (e.save(), n && (e.strokeStyle = n), e.clearRect(0, 0, t.width, t.height), o && o !== "none" && (e.fillStyle = o, e.fillRect(0, 0, t.width, t.height)), e.beginPath(), h && (e.strokeStyle = h), a != null && a != null) {
        e.lineWidth = a * v;
        const f = a / 2 * v;
        m && (e.moveTo(f, f), e.lineTo(t.width - f, f), e.lineTo(t.width - f, t.height - f), e.lineTo(f, t.height - f), e.closePath(), e.stroke(), m && !d && (e.moveTo(0, 0), e.lineTo(t.width, t.height), e.lineTo(t.width, t.height / 2), e.lineTo(0, t.height / 2), e.lineTo(0, t.height), e.lineTo(t.width, 0), e.lineTo(t.width / 2, 0), e.lineTo(t.width / 2, t.height), e.stroke()));
      }
      e.restore(), M(null);
    }
  }, M = (e) => {
    c("update:modelValue", e), c("change", e), console.log(e);
  }, I = () => {
    const { canvasElement: e, config: { canvasWidth: t, canvasHeight: n }, dpr: o } = i;
    e && (t != null && t != null && (e.width = t * o, e.style.width = `${t}px`), n != null && n != null && (e.height = n * o, e.style.height = `${n}px`));
  }, b = (e) => p(P(e)), D = (e) => {
    i.config.isWrite && W(P(e));
  }, l = (e) => {
    T(P(e));
  }, s = (e) => {
    i.config.isWrite = !1, i.config.lastPoint = P(e);
  }, F = () => {
    const { canvasElement: e } = i;
    if (e)
      return e.getBoundingClientRect();
  }, z = (e, t) => {
    const n = "offset" + t[0].toUpperCase() + t.substring(1);
    if (e) {
      let o = e[n], a = e.offsetParent;
      for (; a != null; )
        o += a[n], a = a.offsetParent;
      return o;
    }
    return 0;
  }, E = (e) => {
    const t = F();
    if (t) {
      const n = e.clientX ? e.clientX - t.left : e.pageX - z(e.target, "left"), o = e.clientY ? e.clientY - t.top : e.pageY - z(e.target, "top");
      return { x: n, y: o };
    }
    return { x: 0, y: 0 };
  }, $ = (e) => {
    const t = e.targetTouches[0];
    p(E(t));
  }, L = (e) => {
    const t = e.targetTouches[0];
    i.config.isWrite && W(E(t));
  }, U = (e) => {
    const t = e.targetTouches, n = e.changedTouches, o = t && t.length > 0 && t[0] || n && n.length > 0 && n[0];
    o && T(E(o));
  }, k = () => {
    i.canvasImage = new Image();
    const { canvasElement: e, config: { imgType: t, quality: n } } = i;
    return e && t && (i.canvasImage.src = e.toDataURL(`image/${t}`), M(i.canvasImage.src)), n !== 1 ? H() : i.canvasImage.src;
  }, V = (e) => {
    const t = k();
    X(t, e ? `${e}.${i.config.imgType}` : `${+/* @__PURE__ */ new Date()}.${i.config.imgType}`);
  }, X = (e, t) => {
    const n = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    n.href = e, n.download = t;
    const o = document.createEvent("MouseEvents");
    o.initMouseEvent("click", !0, !1, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), n.dispatchEvent(o);
  }, H = (e) => {
    const { config: { canvasWidth: t, canvasHeight: n, quality: o }, canvasImage: a } = i, h = e || o || 1, m = h < 0.1 || h > 1 ? 0.6 : h, d = document.createElement("canvas"), v = d.getContext("2d");
    return t != null && t != null && (d.width = Math.floor(t * m)), n != null && n != null && (d.height = Math.floor(n * m)), v && a && (v.clearRect(0, 0, d.width, d.height), v.drawImage(a, 0, 0, d.width, d.height)), d.toDataURL("image/png", m);
  };
  return J(() => {
    g(), window.onresize = () => {
      i.resizeTimer && clearTimeout(i.resizeTimer), i.resizeTimer = setTimeout(() => g(), 100);
    };
  }), N(() => {
    window.onresize = null, clearTimeout(i.resizeTimer);
  }), A(() => x.options, () => g(), { deep: !0 }), {
    ...Q(i),
    canvasClear: S,
    onMousedown: b,
    onMousemove: D,
    onMouseup: l,
    onMouseleave: s,
    onTouchstart: $,
    onTouchmove: L,
    onTouchend: U,
    saveAsImg: k,
    dealImage: H,
    downloadSignImg: V
  };
}, w = /* @__PURE__ */ j({
  name: "SignCanvas",
  __name: "SignCanvas",
  props: /* @__PURE__ */ B({
    modelValue: { default: null },
    options: { default: () => ({
      isFullScreen: !1,
      // 是否全屏手写
      isFullCover: !1,
      // 是否全屏模式下覆盖所有的元素
      isDpr: !1,
      // 是否使用dpr兼容高分屏
      lastWriteSpeed: 1,
      // 笔迹速度
      lastWriteWidth: 2,
      // 笔迹宽度
      lineCap: "round",
      // 笔迹端点样式
      lineJoin: "round",
      // 笔迹连接样式
      canvasWidth: 600,
      // canvas宽度
      canvasHeight: 600,
      // canvas高度
      isShowBorder: !0,
      // 是否显示边框 [可选]
      bgColor: "#fcc",
      // 背景色 [String] 可选 注:这背景色仅仅只是canvas背景,保存的图片仍然是透明的
      borderWidth: 1,
      // 网格线宽度  [Number] 可选
      borderColor: "#ff787f",
      // 网格颜色  [String] 可选
      writeWidth: 5,
      // 基础轨迹宽度  [Number] 可选
      maxWriteWidth: 30,
      // 写字模式最大线宽  [Number] 可选
      minWriteWidth: 5,
      // 写字模式最小线宽  [Number] 可选
      writeColor: "#101010",
      // 轨迹颜色  [String] 可选
      isSign: !1,
      // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
      imgType: "png",
      //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
      quality: 1
      //  图片压缩系数[0-1]之间 可以选 默认为1
    }) }
  }, {
    value: {},
    valueModifiers: {}
  }),
  emits: /* @__PURE__ */ B(["update:modelValue", "change"], ["update:value"]),
  setup(c, { expose: x }) {
    G(c, "value");
    const {
      canvasElement: R,
      onMousedown: i,
      onMousemove: g,
      onMouseup: y,
      onMouseleave: p,
      onTouchstart: W,
      onTouchmove: T,
      onTouchend: C,
      canvasClear: S,
      saveAsImg: M,
      downloadSignImg: I,
      dealImage: b
    } = Z();
    return x({
      canvasClear: S,
      saveAsImg: M,
      downloadSignImg: I,
      dealImage: b
    }), (D, l) => (K(), O("canvas", {
      ref: (s) => R.value = s,
      class: "app-sign-canvas",
      onMousedown: l[0] || (l[0] = u(
        //@ts-ignore
        (...s) => r(i) && r(i)(...s),
        ["prevent", "stop"]
      )),
      onMousemove: l[1] || (l[1] = u(
        //@ts-ignore
        (...s) => r(g) && r(g)(...s),
        ["prevent", "stop"]
      )),
      onMouseup: l[2] || (l[2] = u(
        //@ts-ignore
        (...s) => r(y) && r(y)(...s),
        ["prevent", "stop"]
      )),
      onMouseleave: l[3] || (l[3] = u(
        //@ts-ignore
        (...s) => r(p) && r(p)(...s),
        ["prevent", "stop"]
      )),
      onTouchstart: l[4] || (l[4] = u(
        //@ts-ignore
        (...s) => r(W) && r(W)(...s),
        ["prevent", "stop"]
      )),
      onTouchmove: l[5] || (l[5] = u(
        //@ts-ignore
        (...s) => r(T) && r(T)(...s),
        ["prevent", "stop"]
      )),
      onTouchend: l[6] || (l[6] = u(
        //@ts-ignore
        (...s) => r(C) && r(C)(...s),
        ["prevent", "stop"]
      ))
    }, " 您的浏览器不支持canvas技术,请升级浏览器! ", 544));
  }
});
w.install = function(c) {
  return c.component((w == null ? void 0 : w.name) ?? "SignCanvas", w), c;
};
typeof window < "u" && window.Vue && w.install(window.Vue);
export {
  w as default
};
