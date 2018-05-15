<template>
  <div class="v-for">
      <h1>v-for</h1>
      <ul>
        <li v-for="todo in todos">
            {{ todo.text }}
        </li>
      </ul>
  </div>
</template>

<script>
export default {
    name: 'VFor',
    data () {
        return {
            todos: [
                { text: '学习 JavaScript' },
                { text: '学习 Vue' },
                { text: '整个牛项目' }
            ]
        }
    }
}
</script>
