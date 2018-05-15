<template>
    <div class="v-show">
        <h1>v-show</h1>
        <p v-show="ok">v-show始终渲染保存在DOM中</p>
    </div>
</template>

<script>
export default {
    name: 'VShow',
    data () {
        return {
            ok: true
        }
    }
}
</script>