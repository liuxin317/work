<template>
    <div class="emit">
        <h1>自定义事件$on、$emit</h1>
        <button @click="incrementCounter">{{ counter }}</button>
    </div>
</template>

<script>
export default {
    name: 'Emit',
    data () {
        return {
            counter: 0
        }
    },
    methods: {
        incrementCounter () {
            this.counter += 1
            this.$emit('increment', 1)
        }
    }
}
</script>
