<template>
    <div class="v-html">
        <h1>v-html</h1>
        <div v-html="message"></div>        
    </div>
</template>

<script>
export default {
    name: 'VHtml',
    data () {
        return {
            message: '<h1>胡杨你好</h1>'
        }
    }
}
</script>
