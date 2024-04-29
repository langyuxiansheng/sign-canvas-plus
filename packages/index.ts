import type { App } from 'vue';
// 导入单个组件
import SignCanvas from './SignCanvas/SignCanvas.vue';
import { IOptions, IPoint, SDirection, SImgType } from './types';
// import type { Data } from './SignCanvas/interface'
// 导出的对象必须具备一个 install 方法
SignCanvas.install = function (app: App) {
    app.component(SignCanvas?.name ?? 'SignCanvas', SignCanvas);
    return app;
}
if (typeof window !== 'undefined' && window.Vue) {
    SignCanvas.install(window.Vue);
}

export default SignCanvas;

export type {
    IOptions,
    SImgType,
    SDirection,
    IPoint
}