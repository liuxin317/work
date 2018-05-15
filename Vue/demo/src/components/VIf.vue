<template>
    <section>
        <div class="v-if" v-if="login">
            <h1>v-if</h1>
            <span v-if="seen">看A</span>
            <span v-else>还是看B</span>
            <br>
            <button @click="switchLogin">切换</button>
        </div>

        <div class="v-if" v-else>
            <h1>v-if</h1>
            我是false <br>
            <button @click="switchLogin">切换</button>
        </div>
    </section>
</template>

<script>
export default {
    name: 'VIf',
    data () {
        return {
            seen: false,
            login: false
        }
    },
    methods: {
        switchLogin () {
            this.login = !this.login
        }
    }
}
</script>