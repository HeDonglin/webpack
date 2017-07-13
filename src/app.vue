<template>
    <div class="message">
        {{msg}}
    </div>
</template>

<style>
    .message{
        background: #000;
        color: #fff;
        border: 10px solid #090;
    }
</style>

<script>
    export default {
      data () {
        return {
          msg: '1818'
        }
      }
    }
</script>

