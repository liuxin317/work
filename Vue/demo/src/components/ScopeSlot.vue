<template scope="props">
    <div class="scope-slot">
        <span>hello from parent</span>
        <span>{{ props.text }}</span>
    </div>
</template>

<script>
export default {
    name: 'ScopeSlot'
}
</script>
