import { getCurrentInstance as Y, reactive as q, onMounted as J, onBeforeUnmount as N, watch as A, toRefs as Q, defineComponent as j, mergeModels as B, useModel as G, openBlock as K, createElementBlock as O, withModifiers as g, unref as r } from "vue";
const P = (c) => ({ x: c.offsetX || c.clientX, y: c.offsetY || c.clientY }), Z = () => {
  const { emit: c, props: x } = Y(), n = q({
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
      enableResize: !0,
      //是否启用窗口变化监听 [Boolean] 可选,
      lastWriteTime: 0,
      isWrite: !1,
      lastPoint: {
        x: 0,
        y: 0
      }
    },
    resizeTimer: null,
    canvasImage: null
  }), u = () => {
    console.log(n.canvasElement);
    const e = x.options;
    if (e)
      for (const o in e)
        e[o] != null && e[o] != null && (n.config[o] = e[o]);
    n.dpr = typeof window < "u" && n.config.isDpr && (window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio) || 1;
    const { canvasElement: t, config: i } = n;
    t && (n.context = t.getContext("2d"), i.isFullScreen && (i.canvasWidth = window.innerWidth || document.body.clientWidth, i.canvasHeight = window.innerHeight || document.body.clientHeight, i.isFullCover && (t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.margin = "0", t.style.zIndex = "20001")), i.canvasWidth && (t.width = i.canvasWidth), i.canvasHeight && (t.height = i.canvasHeight), b(), S());
  }, y = () => {
    const { config: e } = n, t = (/* @__PURE__ */ new Date()).getTime(), i = t - e.lastWriteTime;
    if (e.lastWriteTime = t, e.minWriteWidth != null && e.maxWriteWidth != null && n.context) {
      let o = e.minWriteWidth + (e.maxWriteWidth - e.minWriteWidth) * i / 30;
      if (o < e.minWriteWidth ? o = e.minWriteWidth : o > e.maxWriteWidth && (o = e.maxWriteWidth), o = +o.toFixed(2), e.isSign)
        n.context.lineWidth = (e.writeWidth ?? 0) * n.dpr;
      else {
        const a = e.lastWriteWidth = (e.lastWriteWidth ?? 0) / 4 * 3 + o / 4;
        n.context.lineWidth = a * n.dpr;
      }
    }
  }, p = (e) => {
    n.config.isWrite = !0, n.config.lastWriteTime = (/* @__PURE__ */ new Date()).getTime(), console.log(e), n.config.lastPoint = e, C();
  }, W = (e) => {
    const { context: t, config: i, dpr: o } = n;
    t && (t.beginPath(), t.moveTo(i.lastPoint.x * o, i.lastPoint.y * o), t.lineTo(e.x * o, e.y * o), y(), t.stroke(), i.lastPoint = e, t.closePath());
  }, T = (e) => {
    const { config: t } = n;
    t.isWrite = !1, t.lastPoint = e, R();
  }, C = () => {
    const { context: e, config: { writeColor: t, lineCap: i, lineJoin: o } } = n;
    e && (e.beginPath(), t && (e.strokeStyle = t), i && (e.lineCap = i), o && (e.lineJoin = o));
  }, S = () => {
    const { context: e, canvasElement: t, config: { writeColor: i, bgColor: o, borderWidth: a, borderColor: h, isShowBorder: m, isSign: d }, dpr: v } = n;
    if (e && t) {
      if (e.save(), i && (e.strokeStyle = i), e.clearRect(0, 0, t.width, t.height), o && o !== "none" && (e.fillStyle = o, e.fillRect(0, 0, t.width, t.height)), e.beginPath(), h && (e.strokeStyle = h), a != null && a != null) {
        e.lineWidth = a * v;
        const f = a / 2 * v;
        m && (e.moveTo(f, f), e.lineTo(t.width - f, f), e.lineTo(t.width - f, t.height - f), e.lineTo(f, t.height - f), e.closePath(), e.stroke(), m && !d && (e.moveTo(0, 0), e.lineTo(t.width, t.height), e.lineTo(t.width, t.height / 2), e.lineTo(0, t.height / 2), e.lineTo(0, t.height), e.lineTo(t.width, 0), e.lineTo(t.width / 2, 0), e.lineTo(t.width / 2, t.height), e.stroke()));
      }
      e.restore(), M(null);
    }
  }, M = (e) => {
    c("update:modelValue", e), c("change", e), console.log(e);
  }, b = () => {
    const { canvasElement: e, config: { canvasWidth: t, canvasHeight: i }, dpr: o } = n;
    e && (t != null && t != null && (e.width = t * o, e.style.width = `${t}px`), i != null && i != null && (e.height = i * o, e.style.height = `${i}px`));
  }, I = (e) => p(P(e)), k = (e) => {
    n.config.isWrite && W(P(e));
  }, l = (e) => {
    T(P(e));
  }, s = (e) => {
    n.config.isWrite = !1, n.config.lastPoint = P(e);
  }, F = () => {
    const { canvasElement: e } = n;
    if (e)
      return e.getBoundingClientRect();
  }, D = (e, t) => {
    const i = "offset" + t[0].toUpperCase() + t.substring(1);
    if (e) {
      let o = e[i], a = e.offsetParent;
      for (; a != null; )
        o += a[i], a = a.offsetParent;
      return o;
    }
    return 0;
  }, E = (e) => {
    const t = F();
    if (t) {
      const i = e.clientX ? e.clientX - t.left : e.pageX - D(e.target, "left"), o = e.clientY ? e.clientY - t.top : e.pageY - D(e.target, "top");
      return { x: i, y: o };
    }
    return { x: 0, y: 0 };
  }, $ = (e) => {
    const t = e.targetTouches[0];
    p(E(t));
  }, L = (e) => {
    const t = e.targetTouches[0];
    n.config.isWrite && W(E(t));
  }, U = (e) => {
    const t = e.targetTouches, i = e.changedTouches, o = t && t.length > 0 && t[0] || i && i.length > 0 && i[0];
    o && T(E(o));
  }, R = () => {
    n.canvasImage = new Image();
    const { canvasElement: e, config: { imgType: t, quality: i } } = n;
    return e && t && (n.canvasImage.src = e.toDataURL(`image/${t}`), M(n.canvasImage.src)), i !== 1 ? H() : n.canvasImage.src;
  }, V = (e) => {
    const t = R();
    X(t, e ? `${e}.${n.config.imgType}` : `${+/* @__PURE__ */ new Date()}.${n.config.imgType}`);
  }, X = (e, t) => {
    const i = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    i.href = e, i.download = t;
    const o = document.createEvent("MouseEvents");
    o.initMouseEvent("click", !0, !1, window, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), i.dispatchEvent(o);
  }, H = (e) => {
    const { config: { canvasWidth: t, canvasHeight: i, quality: o }, canvasImage: a } = n, h = e || o || 1, m = h < 0.1 || h > 1 ? 0.6 : h, d = document.createElement("canvas"), v = d.getContext("2d");
    return t != null && t != null && (d.width = Math.floor(t * m)), i != null && i != null && (d.height = Math.floor(i * m)), v && a && (v.clearRect(0, 0, d.width, d.height), v.drawImage(a, 0, 0, d.width, d.height)), d.toDataURL("image/png", m);
  };
  return J(() => {
    u(), n.config.enableResize && (window.onresize = () => {
      n.resizeTimer && clearTimeout(n.resizeTimer), n.resizeTimer = setTimeout(() => u(), 100);
    });
  }), N(() => {
    n.config.enableResize && (window.onresize = null, clearTimeout(n.resizeTimer));
  }), A(() => x.options, () => u(), { deep: !0 }), {
    ...Q(n),
    canvasClear: S,
    onMousedown: I,
    onMousemove: k,
    onMouseup: l,
    onMouseleave: s,
    onTouchstart: $,
    onTouchmove: L,
    onTouchend: U,
    saveAsImg: R,
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
      canvasElement: z,
      onMousedown: n,
      onMousemove: u,
      onMouseup: y,
      onMouseleave: p,
      onTouchstart: W,
      onTouchmove: T,
      onTouchend: C,
      canvasClear: S,
      saveAsImg: M,
      downloadSignImg: b,
      dealImage: I
    } = Z();
    return x({
      canvasClear: S,
      saveAsImg: M,
      downloadSignImg: b,
      dealImage: I
    }), (k, l) => (K(), O("canvas", {
      ref: (s) => z.value = s,
      class: "app-sign-canvas",
      onMousedown: l[0] || (l[0] = g(
        //@ts-ignore
        (...s) => r(n) && r(n)(...s),
        ["prevent", "stop"]
      )),
      onMousemove: l[1] || (l[1] = g(
        //@ts-ignore
        (...s) => r(u) && r(u)(...s),
        ["prevent", "stop"]
      )),
      onMouseup: l[2] || (l[2] = g(
        //@ts-ignore
        (...s) => r(y) && r(y)(...s),
        ["prevent", "stop"]
      )),
      onMouseleave: l[3] || (l[3] = g(
        //@ts-ignore
        (...s) => r(p) && r(p)(...s),
        ["prevent", "stop"]
      )),
      onTouchstart: l[4] || (l[4] = g(
        //@ts-ignore
        (...s) => r(W) && r(W)(...s),
        ["prevent", "stop"]
      )),
      onTouchmove: l[5] || (l[5] = g(
        //@ts-ignore
        (...s) => r(T) && r(T)(...s),
        ["prevent", "stop"]
      )),
      onTouchend: l[6] || (l[6] = g(
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
