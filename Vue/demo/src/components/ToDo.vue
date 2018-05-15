<template>
    <div class="todo">
        <li>{{ todo.text }}</li>
    </div>
</template>

<script>
export default {
    name: 'ToDo',
    props: ['todo']
}
</script>
