<template>
    <div class="class-style">
        <p :class="{active: isActive, 'has-error': hasError}">class绑定</p>
        <button @click="changeClass">变化状态</button>
        <h4>数组语法</h4>
        <p :class="[activeClass, errorClass]">数组添加</p>
        <h4>style绑定内联样式</h4>
        <p :style="{ color: activeColor }">我是红色</p>
        <p :style="[styleColor]">数组语法</p>
    </div>
</template>

<script>
export default {
    name: 'ClassStyle',
    data () {
        return {
            isActive: true,
            hasError: false,
            activeClass: 'active',
            errorClass: 'text-danger',
            activeColor: 'red',
            styleColor: {
                color: 'blue',
                fontSize: '20px',
                transform: 'rotate(90deg)'
            }
        }
    },
    methods: {
        changeClass () {
            this.hasError = true;
        }
    }
}
</script>