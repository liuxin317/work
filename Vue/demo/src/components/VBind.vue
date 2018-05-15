<template>
  <div class="v-bind">
      <h1>v-bind</h1>
      <span :title="message">
            鼠标悬停几秒钟查看此处动态绑定的提示信息！
            你看那不是山的尽头，海的港湾吗？
      </span>
      <a :href="url" target="_blank">bind</a>
  </div>
</template>

<script>
export default {
    name: 'VBind',
    data () {
        return {
            message: `查看时间${ new Date().toLocaleString() }`,
            url: 'http://www.baidu.com'
        }
    }
}
</script>
