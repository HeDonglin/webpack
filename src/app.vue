<template>
    <div class="message">
        {{msg}}
    </div>
</template>

<style>
    .message{
        background: #000;
        color: #fff;
        border: 10px solid #455;
    }
</style>

<script>
    export default {
      data () {
        return {
          msg: '800'
        }
      }
    }
</script>

