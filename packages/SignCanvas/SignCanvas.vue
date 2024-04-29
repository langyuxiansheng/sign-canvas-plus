<script setup lang="ts">
import { useSignCanvas } from './hooks/useSignCanvas';
import { IOptions } from '../types';

defineOptions({ name: 'SignCanvas' });
defineEmits<{
    (e: 'update:modelValue', value: string | null): void;
    (e: 'change', value: string | null): void;
}>()
withDefaults(
    defineProps<{
        modelValue?: null,
        options?: IOptions;
    }>(),
    {
        options: () => ({
            isFullScreen: false, // 是否全屏手写
            isFullCover: false, // 是否全屏模式下覆盖所有的元素
            isDpr: false, // 是否使用dpr兼容高分屏
            lastWriteSpeed: 1, // 笔迹速度
            lastWriteWidth: 2, // 笔迹宽度
            lineCap: 'round', // 笔迹端点样式
            lineJoin: 'round', // 笔迹连接样式
            canvasWidth: 600, // canvas宽度
            canvasHeight: 600, // canvas高度
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
            quality: 1  //  图片压缩系数[0-1]之间 可以选 默认为1
        }),
        modelValue: null,
    }
);

defineModel('value')

const {
    canvasElement,
    onMousedown,
    onMousemove,
    onMouseup,
    onMouseleave,
    onTouchstart,
    onTouchmove,
    onTouchend,

    canvasClear,
    saveAsImg,
    downloadSignImg,
    dealImage
} = useSignCanvas();


defineExpose({
    canvasClear,
    saveAsImg,
    downloadSignImg,
    dealImage
});

</script>

<template>
    <canvas :ref="(el: any) => canvasElement = el" class="app-sign-canvas" @mousedown.prevent.stop="onMousedown"
            @mousemove.prevent.stop="onMousemove" @mouseup.prevent.stop="onMouseup"
            @mouseleave.prevent.stop="onMouseleave" @touchstart.prevent.stop="onTouchstart"
            @touchmove.prevent.stop="onTouchmove" @touchend.prevent.stop="onTouchend">
        您的浏览器不支持canvas技术,请升级浏览器!
    </canvas>
</template>
