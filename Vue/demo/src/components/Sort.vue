<template>
    <div class="sort">
        <h1>排序：sort; 去重：new Set()</h1>
        <p v-for="item in data">{{ item.name }}</p>
        <hr>
        <p>{{ arr }}</p>
    </div>
</template>

<script>
export default {
    name: 'Sort',
    data () {
        return {
            data: [{
                code: 12,
                name: 'lx'
            }, {
                code: 10,
                name: 'hy'
            }, {
                code: 23,
                name: 'll'
            }],
            arr: [1,11,12,2,3,3,4,3,3,3,2,56,8,89,0,45,43]
        }
    },
    created () {
        this.data = this.data.sort((a, b) => (a['code'] - b['code']));
        var set = new Set(this.arr);
        this.arr = [...set];
    }
}
</script>