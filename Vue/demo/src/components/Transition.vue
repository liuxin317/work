<template>
    <div class="transition">
        <button v-on:click="show = !show">
            Toggle
        </button>
        <transition name="move">
            <p v-if="show">hello</p>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'Transition',
    data () {
        return {
            show: true
        }
    }
}
</script>