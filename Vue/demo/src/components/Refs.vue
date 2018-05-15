<template>
    <div class="refs">
        <h1>ref 引用信息</h1>
    </div>
</template>

<script>
export default {
    name: 'Refs',
    data () {
        return {
            message: '通过ref访问子组件'
        }
    },
    methods: {
        refsTrigger (msg) {
            alert(msg)
        }
    }
}
</script>