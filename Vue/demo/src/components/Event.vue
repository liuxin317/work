<template>
    <div class="event">
        <h1>内联处理器$event</h1>
        <input type="text" @change="keyValue" />
        <button type="button" @click="warn('hello world', $event)">获取DOM事件</button>
    </div>
</template>

<script>
export default {
    name: 'Event',
    methods: {
        warn (message, event) {
            // 现在我们可以访问原生事件对象
            if (event) {
                event.preventDefault()
            }
            alert(message);
        },
        keyValue (event) {
            console.log(event.target.value)
        }
    }
}
</script>