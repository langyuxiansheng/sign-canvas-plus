# sign-canvas-plus 一个基于 canvas 开发,封装于 Vue3 组件的通用手写签名板(电子签名板),支持 pc 端和移动端

#### sign-canvas-plus 是 sign-canvas的vue3版本,使用了vue3+ts+vite 进行了重构,vue3中使用此包. 假如此轮子对你有帮助,请顺手 star 一下吧.o(_￣︶￣_)o

### 如果需要 vue2 版本的 签名板 请移步至 <https://github.com/langyuxiansheng/vue-sign-canvas>

#### 更多文章和技术推文，请关注微信公众号"笔优站长",有问题也可以及时反馈哦

## 开始使用! 下载安装 npm 包

```bash
npm i sign-canvas-plus --save
```

```javascript
//全局注册 main.js
import SignCanvasPlus from 'sign-canvas-plus'

// vue的main.ts里使用,
import App from './App.vue'
createApp(App).use(SignCanvasPlus).mount('#app')

//局部注册

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import SignCanvasPlus, { IOptions } from 'sign-canvas-plus';

// todo...
</script>
```

你可以这样使用:

### 组件模板使用

```html
<template>
  <div class="app">
    <h3>Vue & Vue3 Sign Canvas 电子签名板</h3>
    <SignCanvasPlus class="sign-canvas" ref="SignCanvasPlusRef" :options="options" v-model="data" />
    <template v-if="data">
      <div>预览输出:</div>
      <img v-show="data" class="preview-img" :src="data" width="150" height="150" alt="preview" />
    </template>
    <div class="control">
      <ul>
        <li>
          <label>
            书写速度:
            <select name="isSign" v-model="options.isSign">
              <option :value="true">签名</option>
              <option :value="false">写字</option>
            </select>
          </label>
        </li>
        <li>
          <label>
            显示边框/网格:
            <select name="isSign" v-model="options.isShowBorder">
              <option :value="true">显示</option>
              <option :value="false">不显示</option>
            </select>
          </label>
        </li>
        <li>
          <label>
            兼容高分屏高清绘制:
            <select name="isSign" v-model="options.isDpr">
              <option :value="true">启用</option>
              <option :value="false">关闭</option>
            </select>
          </label>
        </li>
        <li>
          <label>边框宽度: <input v-model="options.borderWidth" type="number" /></label>
        </li>
        <li>
          <label>下笔宽度: <input v-model="options.writeWidth" type="number" /></label>
        </li>
        <li>
          <label
            >图片类型:
            <select name="imgType" v-model="options.imgType">
              <option value="png">png</option>
              <option value="jpeg">jpeg</option>
              <option value="webp">webp</option>
            </select>
          </label>
        </li>
        <li>
          <label
            >线条的边缘类型:
            <select name="lineCap" v-model="options.lineCap">
              <option value="butt">平直的边缘</option>
              <option value="round">圆形线帽</option>
              <option value="square">正方形线帽</option>
            </select>
          </label>
        </li>
        <li>
          <label
            >线条交汇时边角的类型:
            <select name="lineCap" v-model="options.lineJoin">
              <option value="bevel">创建斜角</option>
              <option value="round">创建圆角</option>
              <option value="miter">创建尖角</option>
            </select>
          </label>
        </li>
        <li>
          <label>画笔颜色: <input type="color" v-model="options.writeColor" /></label>
        </li>
        <li>
          <label>背景色: <input type="color" v-model="options.bgColor" /></label>
        </li>
      </ul>
    </div>
    <div class="sign-btns">
      <span class="clear" @click="canvasClear">清空</span>
      <span class="save" @click="saveAsImg">保存</span>
      <span class="save" @click="downloadSignImg">下载</span>
      <span class="save" @click="dealImage">压缩</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import SignCanvasPlus, { IOptions } from 'sign-canvas-plus'
  const data = ref<string | null>(null)
  const options = reactive<IOptions>({
    isFullScreen: false, ////是否全屏手写 [Boolean] 可选
    isFullCover: false, //是否全屏模式下覆盖所有的元素 [Boolean]   可选
    isDpr: false, //是否使用dpr兼容高分屏 [Boolean] 可选
    lastWriteSpeed: 1, //书写速度 [Number] 可选
    lastWriteWidth: 2, //下笔的宽度 [Number] 可选
    lineCap: 'round', //线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square] 正方形线帽
    lineJoin: 'bevel', //线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
    canvasWidth: 350, //canvas宽高 [Number] 可选
    canvasHeight: 370, //高度  [Number] 可选
    isShowBorder: true, //是否显示边框 [可选]
    bgColor: '#fcc', //背景色 [String] 可选
    borderWidth: 1, // 网格线宽度  [Number] 可选
    borderColor: '#ff787f', //网格颜色  [String] 可选
    writeWidth: 5, //基础轨迹宽度  [Number] 可选
    maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
    minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
    writeColor: '#101010', // 轨迹颜色  [String] 可选
    isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
    imgType: 'png', //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的.
    quality: 1 //  图片压缩系数[0-1]之间 可以选 默认为1
  })
  const SignCanvasPlusRef = ref<InstanceType<typeof SignCanvasPlus | null>>(null)
  /**
   * 清除画板
   */
  const canvasClear = () => {
    SignCanvasPlusRef.value.canvasClear()
  }

  /**
   * 保存图片
   */
  const saveAsImg = () => {
    const img = SignCanvasPlusRef.value.saveAsImg()
    alert(`image 的base64：${img}`)
  }

  /**
   * 下载图片
   */
  const downloadSignImg = () => {
    SignCanvasPlusRef.value.downloadSignImg()
  }

  /**
   * 下载dealImage图片
   */
  const dealImage = () => {
    SignCanvasPlusRef.value.dealImage()
  }
</script>
<style>
  .app {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    font-weight: normal;
    text-align: center;
  }

  .preview-img {
    display: block;
    margin: 20px auto;
  }

  .control {
    width: 350px;
    margin: 20px auto;
    font-size: 14px;
  }

  ul {
    text-align: left;

    li {
      list-style: none;
      padding: 4px 10px;
    }
  }

  .sign-btns {
    display: flex;
    justify-content: space-between;
  }

  .clear,
  .save {
    width: 76px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #eee;
    background: #e1e1e1;
    border-radius: 10px;
    text-align: center;
    margin: 20px auto;
    cursor: pointer;
  }
</style>
```

### 功能与配置

```javascript
props:{
    options: {  //配置项
        required: false,
        type: [Object],
        default: () => null
    }
}

// 1. options [Object] 可选,非必传

// 2. v-model [String] 可选,非必传

```

1. 配置项 IOptions 属性 , ts 中有 IOptions 的接口约束,可以直接导入类型提示, 以下参数的默认值, 使用的时候自行选装即可

```javascript
{
    isFullScreen: false, ////是否全屏手写 [Boolean] 可选
    isFullCover: false, //是否全屏模式下覆盖所有的元素 [Boolean]   可选
    isDpr: false, //是否使用dpr兼容高分屏 [Boolean] 可选
    lastWriteSpeed: 1, //书写速度 [Number] 可选
    lastWriteWidth: 2, //下笔的宽度 [Number] 可选
    lineCap: 'round', //线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square] 正方形线帽
    lineJoin: 'bevel', //线条交汇时边角的类型  [bevel]创建斜角 [round]创建圆角 [miter]创建尖角。
    canvasWidth: 350, //canvas宽高 [Number] 可选
    canvasHeight: 370, //高度  [Number] 可选
    isShowBorder: true, //是否显示边框 [可选]
    bgColor: '#fcc', //背景色 [String] 可选
    borderWidth: 1, // 网格线宽度  [Number] 可选
    borderColor: '#ff787f', //网格颜色  [String] 可选
    writeWidth: 5, //基础轨迹宽度  [Number] 可选
    maxWriteWidth: 30, // 写字模式最大线宽  [Number] 可选
    minWriteWidth: 5, // 写字模式最小线宽  [Number] 可选
    writeColor: '#101010', // 轨迹颜色  [String] 可选
    isSign: true, //签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
    imgType: 'png', //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的.
    quality: 1, //  图片压缩系数[0-1]之间 可以选 默认为1
    enableResize: true, //是否启用窗口变化监听 [Boolean] 可选, 此操作在pc端用于监听窗口变化,动态调整画板大小 调整大小的时候会清空画板内容, 移动端使用的时候建议设置为false
}
```

2. 内置方法

```javascript
import { ref } from 'vue'
const SignCanvasRef = ref()

//清除画布 无返回值 [Void]
SignCanvasRef.value?.canvasClear()

//获取base图片 返回图片的base64编码 [String]
SignCanvasRef.value?.saveAsImg()

//下载图片到本地, 调用内置的下载图片方法,默认将图片保存为png格式(经测试在部分微信内置浏览器中无效)
SignCanvasRef.value?.downloadSignImg()

// 获取压缩图片,此方法返回压缩后的base64图片
SignCanvasRef.value?.dealImage()
```

## [在线演示](https://langyuxiansheng.github.io/sign-canvas-plus/)

### 图片展示

---

初始化展示
![初始化展示](https://github.com/langyuxiansheng/sign-canvas-plus/blob/master/images/s1.png)

非签名模式书写展示
![非签名模式书写展示](https://github.com/langyuxiansheng/sign-canvas-plus/blob/master/images/s2.png)

保存展示
![保存展示](https://github.com/langyuxiansheng/sign-canvas-plus/blob/master/images/s3.png)

---

## 更多功能正在完善中

## 如果您有什么好的建议请留言

## 二次开发 下载项目

```bash
git clone https://github.com/langyuxiansheng/sign-canvas-plus.git
```

# sign-canvas-plus

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 缺陷 & 后期计划

> 目前还没有撤销回到上一步的操作,一旦输入错了就只有清除重写了(这个是之前去银行的时候,那个签名板是这样设计的);
> 如果有需要还是可以考虑加上回到上一步的方法.

## 更新日志

> v2.0.1 修复bug,功能属性更新.增加enableResize 属性，可以通过 options.enableResize 来控制窗口变化的时候,是否自动调整画板大小,自动调整大小的时候会清空画板内容, 移动端使用的时候建议设置为false

> v2.0.1 修复bug

> v2.0.0 使用了vue3 + vite进行重写了,支持类型提示和vue3的setup直接使用了.增加了压缩图导出.修复bug等

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## 横屏全屏模式下签名要怎么显示?

### 显示的时候需要将图片进行旋转一下就可以了

```html
<div class="user-sign">
  <template v-if="sign">
    <img class="sign-image" :src="sign" alt="" srcset="" />
  </template>
</div>

<script lang="ts" setup>
  import { ref } from 'vue'
  const sign = ref<string | null>(null)
</script>
<style lang="scss" scoped>
  .user-sign {
    background: #e7e7e7;
    height: 9.375rem;
    position: relative;

    .sign-image {
      margin: 0 auto;
      z-index: 9;
      height: 100%;
      transform: rotate(-90deg) scale(1.5);
      display: block;
    }
  }
</style>
```
