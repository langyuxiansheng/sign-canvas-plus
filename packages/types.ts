/**
 * 配置项
 */
export interface IOptions {
    isFullScreen?: boolean; // 是否全屏手写 [Boolean] 可选
    isFullCover?: boolean; // 是否全屏模式下覆盖所有的元素 [Boolean] 可选
    isDpr?: boolean;       // 是否使用dpr兼容高分屏 [Boolean] 可选
    lastWriteSpeed?: number;  // 书写速度 [Number] 可选
    lastWriteWidth?: number;  // 下笔的宽度 [Number] 可选
    lineCap: CanvasRenderingContext2D['lineCap'];   // 线条的边缘类型 [butt] 平直的边缘 [round] 圆形线帽 [square] 正方形线帽
    lineJoin: CanvasRenderingContext2D['lineJoin'];  // 线条交汇时边角的类型  [bevel] 创建斜角 [round] 创建圆角 [miter] 创建尖角。
    canvasWidth?: number; // canvas宽度 [Number] 可选
    canvasHeight?: number;  // 高度  [Number] 可选
    isShowBorder?: boolean; // 是否显示边框 [可选]
    bgColor?: string; // 背景色 [String] 可选 直接渲染到图片 [移除:这背景色仅仅只是canvas背景,保存的图片仍然是透明的]
    borderWidth?: number; // 网格线宽度  [Number] 可选
    borderColor?: string; // 网格颜色  [String] 可选
    writeWidth?: number; // 基础轨迹宽度  [Number] 可选
    maxWriteWidth?: number; // 写字模式最大线宽  [Number] 可选
    minWriteWidth?: number; // 写字模式最小线宽  [Number] 可选
    writeColor?: string; // 轨迹颜色  [String] 可选
    isSign?: boolean; // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
    imgType?: SImgType;   // 下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
    quality?: number;   //  压缩质量 [Number] 可选范围为[0-1]之间, 0.1 表示以10%的质量进行压缩; 
    enableResize?: boolean, //是否启用窗口变化监听 [Boolean] 可选, 此操作在pc端用于监听窗口变化,动态调整画板大小, 自动调整大小的时候会清空画板内容, 移动端使用的时候建议设置为false
}

/**
 * 图片格式
 */
export type SImgType = 'png' | 'jpeg' | 'webp';

export type SDirection = 'left' | 'right' | 'top' | 'bottom';

export interface IPoint {
    x: number
    y: number
}
