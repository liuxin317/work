<template>
    <div class="v-for-on">
        <h1>v-for on</h1>
        <p v-for="(item, index) of items">{{ item.message + '-' + index }}</p>
        <hr>
        <h4>遍历对象</h4>
        <p v-for="(value, key, index) of object">{{ index + '-' + key + ':' + value }}</p>
    </div>
</template>

<script>
export default {
    name: 'VForOf',
    data () {
        return {
            items: [
                { message: 'Foo' },
                { message: 'Bar' }
            ],
            object: {
                firstName: 'John',
                lastName: 'Doe',
                age: 30
            }
        }
    }
}
</script>
