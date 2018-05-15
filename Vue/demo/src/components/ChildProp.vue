<template>
    <div class="child">
        <span>我接受的时父级的数据：{{ myMessage }}</span>
        <br>
        <span>我是通过prop传递过的对象: {{ text }}</span>
        <br>
        <button @click="parentFun('我调用父级方法成功了')">子调父</button>
    </div>
</template>

<script>
export default {
    name: 'ChildProp',
    props: {
        myMessage: String,
        text: {
            type: String,
            required: true
        },
        isComplete: Boolean,
        parentFun: null
    }
}
</script>
