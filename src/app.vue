<template>
    <div id="app">{{ message }}</div>
</template>

<script>
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
</script>

<style>
    #app {
        color: #090;
    }
</style>
