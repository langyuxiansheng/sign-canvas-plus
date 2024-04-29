import { getCurrentInstance, onBeforeUnmount, onMounted, reactive, toRefs, watch } from 'vue';
import { IOptions, IPoint, SDirection } from '../../types';
interface IState {
    canvasElement: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null;
    dpr: number;
    config: IOptions & {
        lastWriteTime: number;
        isWrite: boolean;
        lastPoint: IPoint
    };
    resizeTimer: any; //监听窗口变化
    canvasImage: HTMLImageElement | null,   //canvas转换的图片
}

/**
 * 获取鼠标的坐标点
 * @param e 
 * @returns 
 */
const getPoint = (e: MouseEvent) => ({ x: e.offsetX || e.clientX, y: e.offsetY || e.clientY });

/**
 *  useSignCanvas 
 */
export const useSignCanvas = () => {

    const { emit, props }: any = getCurrentInstance();

    const initState = (): IState => ({
        // domId: `sign-canvas-${Math.random().toString(36).substring(2)}`,
        canvasElement: null,
        context: null,
        dpr: 0,
        config: {
            isFullScreen: false, // 是否全屏手写 [Boolean] 可选
            isFullCover: false, // 是否全屏模式下覆盖所有的元素 [Boolean] 可选
            isDpr: false, // 是否使用dpr兼容高分屏 [Boolean] 可选
            lastWriteSpeed: 1, // 书写速度 [Number] 可选
            lastWriteWidth: 2, // 下笔的宽度 [Number] 可选
            lineCap: 'round', // 线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
            lineJoin: 'round', // 线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
            canvasWidth: 600, // canvas宽高 [Number] 可选
            canvasHeight: 600, // 高度  [Number] 可选
            isShowBorder: true, // 是否显示边框 [可选]
            bgColor: '#fcc', // 背景色 [String] 可选 注:这背景色仅仅只是canvas背景,保存的图片仍然是透明的
            borderWidth: 1, // 网格线宽度  [Number] 可选
            borderColor: '#ff787f', // 网格颜色  [String] 可选
            writeWidth: 5, // 基础轨迹宽度  [Number] 可选
            maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
            minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
            writeColor: '#101010', // 轨迹颜色  [String] 可选
            isSign: false, // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
            imgType: 'png', //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
            quality: 1, //压缩比例  [Number] 可选

            lastWriteTime: 0,
            isWrite: false,
            lastPoint: {
                x: 0,
                y: 0
            },
        },
        resizeTimer: null,
        canvasImage: null
    });

    const state = reactive<IState>(initState());

    const init = () => {
        console.log(state.canvasElement);
        const options = props.options;
        if (options) {
            for (const key in options) {
                if (options[key] != undefined && options[key] != null) {
                    state.config[key] = options[key];
                }
            }
        }
        state.dpr = typeof window !== 'undefined' && state.config.isDpr ? window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1 : 1;
        const { canvasElement, config } = state;
        if (canvasElement) {
            state.context = canvasElement.getContext("2d");
            if (config.isFullScreen) {
                config.canvasWidth = window.innerWidth || document.body.clientWidth;
                config.canvasHeight = window.innerHeight || document.body.clientHeight;
                if (config.isFullCover) {//开启全屏覆盖
                    canvasElement.style.position = 'fixed';
                    canvasElement.style.top = '0';
                    canvasElement.style.left = '0';
                    canvasElement.style.margin = '0';
                    canvasElement.style.zIndex = '20001';
                }
            }

            if (config.canvasWidth) {
                canvasElement.width = config.canvasWidth;
            }

            if (config.canvasHeight) {
                canvasElement.height = config.canvasHeight;
            }
            canvasInit();
            canvasClear();
        }
    }

    /**
     * 轨迹宽度
     */
    const setLineWidth = () => {
        const { config } = state;
        const nowTime = new Date().getTime();
        const diffTime = nowTime - config.lastWriteTime;
        config.lastWriteTime = nowTime;
        if (config.minWriteWidth != undefined && config.maxWriteWidth != undefined && state.context) {
            let returnNum = config.minWriteWidth + (config.maxWriteWidth - config.minWriteWidth) * diffTime / 30;
            if (returnNum < config.minWriteWidth) {
                returnNum = config.minWriteWidth;
            } else if (returnNum > config.maxWriteWidth) {
                returnNum = config.maxWriteWidth;
            }
            returnNum = +returnNum.toFixed(2);
            //写字模式和签名模式
            if (config.isSign) {
                state.context.lineWidth = (config.writeWidth ?? 0) * state.dpr;
            } else {
                const lineWidth = config.lastWriteWidth = (config.lastWriteWidth ?? 0) / 4 * 3 + returnNum / 4;
                state.context.lineWidth = lineWidth * state.dpr;
            }
        }
    }

    /**
     * 写开始
     */
    const writeBegin = (point: IPoint) => {
        state.config.isWrite = true;
        state.config.lastWriteTime = new Date().getTime();
        console.log(point);
        state.config.lastPoint = point;
        writeContextStyle();
    }

    /**
     * 绘制轨迹
     */
    const writing = (point: IPoint) => {
        const { context, config, dpr } = state;
        if (context) {
            context.beginPath();
            context.moveTo(config.lastPoint.x * dpr, config.lastPoint.y * dpr);
            context.lineTo(point.x * dpr, point.y * dpr);
            setLineWidth();
            context.stroke();
            config.lastPoint = point;
            context.closePath();
        }
    }

    /**
     * 写结束
     */
    const writeEnd = (point: IPoint) => {
        const { config } = state;
        config.isWrite = false;
        config.lastPoint = point;
        saveAsImg();
    }


    /**
     * 轨迹样式
     */
    const writeContextStyle = () => {
        const { context, config: { writeColor, lineCap, lineJoin } } = state;
        if (context) {
            context.beginPath();
            if (writeColor) {
                context.strokeStyle = writeColor;
            }

            if (lineCap) {
                context.lineCap = lineCap;
            }

            if (lineJoin) {
                context.lineJoin = lineJoin;
            }
        }
    }

    /**
     * 清空画板
     */
    const canvasClear = () => {
        const { context, canvasElement, config: { writeColor, bgColor, borderWidth, borderColor, isShowBorder, isSign }, dpr } = state;
        if (context && canvasElement) {
            context.save();
            if (writeColor) {
                context.strokeStyle = writeColor;
            }

            context.clearRect(0, 0, canvasElement.width, canvasElement.height);

            //设置背景色
            if (bgColor && bgColor !== 'none') {
                context.fillStyle = bgColor;
                context.fillRect(0, 0, canvasElement.width, canvasElement.height);
            }

            //绘制线框
            context.beginPath();

            if (borderColor) {
                context.strokeStyle = borderColor;
            }

            if (borderWidth != undefined && borderWidth != null) {
                context.lineWidth = borderWidth * dpr;
                const size = borderWidth / 2 * dpr;
                if (isShowBorder) {
                    //画外面的框
                    context.moveTo(size, size);
                    context.lineTo(canvasElement.width - size, size);
                    context.lineTo(canvasElement.width - size, canvasElement.height - size);
                    context.lineTo(size, canvasElement.height - size);
                    context.closePath();
                    context.stroke();

                    if (isShowBorder && !isSign) {
                        //画里面的框
                        context.moveTo(0, 0);
                        context.lineTo(canvasElement.width, canvasElement.height);
                        context.lineTo(canvasElement.width, canvasElement.height / 2);
                        context.lineTo(0, canvasElement.height / 2);
                        context.lineTo(0, canvasElement.height);
                        context.lineTo(canvasElement.width, 0);
                        context.lineTo(canvasElement.width / 2, 0);
                        context.lineTo(canvasElement.width / 2, canvasElement.height);
                        context.stroke();
                    }

                }
            }
            context.restore();
            onChange(null);
        }
    }

    const onChange = (data: any) => {
        emit('update:modelValue', data);
        emit('change', data);
        console.log(data);
    }

    /**
     * 初始化画板
     */
    const canvasInit = () => {
        const { canvasElement, config: { canvasWidth, canvasHeight }, dpr } = state;
        if (canvasElement) {
            if (canvasWidth != undefined && canvasWidth != null) {
                canvasElement.width = canvasWidth * dpr;
                canvasElement.style.width = `${canvasWidth}px`;
            }
            if (canvasHeight != undefined && canvasHeight != null) {
                canvasElement.height = canvasHeight * dpr;
                canvasElement.style.height = `${canvasHeight}px`;
            }
        }
    }

    /**
     * 鼠标按下 => 下笔
     */
    const onMousedown = (e: MouseEvent) => writeBegin(getPoint(e));

    /**
     * 书写过程 => 下笔书写
     */
    const onMousemove = (e: MouseEvent) => {
        if (state.config.isWrite) writing(getPoint(e));
    }

    /**
     * 鼠标松开 => 提笔
     */
    const onMouseup = (e: MouseEvent) => {
        writeEnd(getPoint(e));
    }

    /**
     * 离开书写区域 => 提笔离开
     */
    const onMouseleave = (e: MouseEvent) => {
        state.config.isWrite = false;
        state.config.lastPoint = getPoint(e);
    }

    /* ==========================移动端兼容=Start================================ */

    /**
     * 获取画布的元素的大小及其相对于视口的位置
     * @return {}
     */
    const getRect = (): DOMRect | undefined => {
        const { canvasElement } = state;
        if (canvasElement) {
            return canvasElement.getBoundingClientRect();
        }
    }

    /**
     * 获取dom对象的偏移量 可以获取解决position定位的问题
     * @returns number
     */
    const offset = (target: any, direction: SDirection): number => {
        //将top,left首字母大写,并拼接成offsetTop,offsetLeft
        const offsetDir = 'offset' + direction[0].toUpperCase() + direction.substring(1);
        if (target) {
            let realNum = target[offsetDir];
            let positionParent = target.offsetParent;  //获取上一级定位元素对象
            while (positionParent != null) {
                realNum += positionParent[offsetDir];
                positionParent = positionParent.offsetParent;
            }
            return realNum;
        }
        return 0;
    }

    /**
     * 获取移动端的触控点坐标
     * @param e 
     * @returns 
     */
    const getTouchPoint = (e: Touch) => {
        const rect: DOMRect | undefined = getRect();
        if (rect) {
            const x = e.clientX ? e.clientX - rect.left : e.pageX - offset(e.target, 'left');
            const y = e.clientY ? e.clientY - rect.top : e.pageY - offset(e.target, 'top');
            return { x, y };
        }
        return { x: 0, y: 0 };
    };

    /**
     * 手指按下 => 下笔
     */
    const onTouchstart = (e: TouchEvent) => {
        const touch = e.targetTouches[0];
        writeBegin(getTouchPoint(touch));
    }

    /**
     * 手指移动 => 下笔书写
     */
    const onTouchmove = (e: TouchEvent) => {
        const touch = e.targetTouches[0];
        if (state.config.isWrite) {
            writing(getTouchPoint(touch));
        }
    }

    /**
     * 手指移动结束 => 提笔离开
     */
    const onTouchend = (e: TouchEvent) => {
        const tcs = e.targetTouches;
        const ccs = e.changedTouches;
        const touch = tcs && tcs.length > 0 && tcs[0] || ccs && ccs.length > 0 && ccs[0];
        if (touch) {
            writeEnd(getTouchPoint(touch));
        }
    }

    /* ==========================移动端兼容=End================================== */


    /**
     *  保存图片 格式base64
     */
    const saveAsImg = () => {
        state.canvasImage = new Image();
        const { canvasElement, config: { imgType, quality } } = state;
        if (canvasElement && imgType) {
            state.canvasImage.src = canvasElement.toDataURL(`image/${imgType}`);
            onChange(state.canvasImage.src);
        }

        return quality !== 1 ? dealImage() : state.canvasImage.src;
    }

    /**
     * 下载二维码到本地
     * @param name 文件名
     * @param isQual 是否下载压缩后的图片
     */
    const downloadSignImg = (name?: string) => {
        const dataURL = saveAsImg();
        saveFile(dataURL, name ? `${name}.${state.config.imgType}` : `${+new Date()}.${state.config.imgType}`);
    }

    /**
     * 保存文件
     */
    const saveFile = (data: string, filename?: string) => {
        const saveLink: any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        saveLink.href = data;
        saveLink.download = filename;
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveLink.dispatchEvent(event);
    }

    /**
     * 图片压缩
     * @param quality 压缩系数
     * @returns
     * 说明: 此方法返回压缩后的base64,系数[0.1-1]之间
     */
    const dealImage = (q?: number) => {
        const { config: { canvasWidth, canvasHeight, quality }, canvasImage } = state;
        const cur = q || quality || 1;
        const curQuality = cur < 0.1 || cur > 1 ? 0.6 : cur;

        //压缩系数0-1之间
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        //目标尺寸
        if (canvasWidth != null && canvasWidth != undefined) {
            canvas.width = Math.floor(canvasWidth * curQuality);
        }

        if (canvasHeight != null && canvasHeight != undefined) {
            canvas.height = Math.floor(canvasHeight * curQuality);
        }

        if (ctx && canvasImage) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);

        }

        const drgImg = canvas.toDataURL('image/png', curQuality);
        return drgImg;
    }

    onMounted(() => {
        init();
        //监听窗口变化
        window.onresize = () => {
            if (state.resizeTimer) clearTimeout(state.resizeTimer);
            state.resizeTimer = setTimeout(() => init(), 100);
        }
    });

    onBeforeUnmount(() => {
        window.onresize = null;
        clearTimeout(state.resizeTimer);
    });

    watch(() => props.options, () => init(), { deep: true });

    return {
        ...toRefs(state),
        canvasClear,
        onMousedown,
        onMousemove,
        onMouseup,
        onMouseleave,
        onTouchstart,
        onTouchmove,
        onTouchend,
        saveAsImg,
        dealImage,
        downloadSignImg
    };
};
