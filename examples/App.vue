<template>
  <div class="app">
    <h3>Vue & Vue3 Sign Canvas 电子签名板</h3>
    <sign-canvas class="sign-canvas" ref="SignCanvasRef" :options="options" v-model="data" />
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
          <label>图片类型:
            <select name="imgType" v-model="options.imgType">
              <option value="png">png</option>
              <option value="jpeg">jpeg</option>
              <option value="webp">webp</option>
            </select>
          </label>
        </li>
        <li>
          <label>线条的边缘类型:
            <select name="lineCap" v-model="options.lineCap">
              <option value="butt">平直的边缘</option>
              <option value="round">圆形线帽</option>
              <option value="square">正方形线帽</option>
            </select>
          </label>
        </li>
        <li>
          <label>线条交汇时边角的类型:
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
import { reactive, ref } from 'vue';
import { IOptions } from '../packages/types';
import SignCanvas from '../packages/SignCanvas/SignCanvas.vue';
const data = ref<any>(null);
const options = reactive<IOptions>({
  isFullScreen: false, ////是否全屏手写 [Boolean] 可选
  isFullCover: false, //是否全屏模式下覆盖所有的元素 [Boolean]   可选
  isDpr: false, //是否使用dpr兼容高分屏 [Boolean] 可选
  lastWriteSpeed: 1, //书写速度 [Number] 可选
  lastWriteWidth: 2, //下笔的宽度 [Number] 可选
  lineCap: 'round', //线条的边缘类型 [butt]平直的边缘 [round]圆形线帽 [square]	正方形线帽
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
  imgType: 'png', //下载的图片格式  [String] 可选为 jpeg  canvas本是透明背景的
  enableResize: false  //是否启用窗口变化监听 [Boolean] 可选
})
const SignCanvasRef = ref()
/**
 * 清除画板
 */
const canvasClear = () => {
  SignCanvasRef.value?.canvasClear()
}

/**
 * 保存图片
 */
const saveAsImg = () => {
  const img = SignCanvasRef.value?.saveAsImg()
  alert(`image 的base64：${img}`)
}

/**
 * 下载图片
 */
const downloadSignImg = () => {
  SignCanvasRef.value?.ownloadSignImg()
}

/**
 * 下载dealImage图片
 */
const dealImage = () => {
  SignCanvasRef.value?.dealImage()
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
