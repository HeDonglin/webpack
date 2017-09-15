<template>
    <div class="message">
        <div>{{vtext}}</div>
        <div v-text="vtext"></div>
        <div v-once>{{vonce}}</div>
        <div v-html="html"></div>
        <div v-bind:class="{active:isActive}"></div>
        <div :class="{active:isActive}"></div>
    </div>
</template>

<style lang="scss">
    .message{
        background: #000;
        color: #fff;
        border: 10px solid #090;
        div {
          height: 40px;
          line-height: 40px;
        }
    }
</style>

<script>
    export default {
      data () {
        return {
          vtext: 'v-text',
          vonce:'v-once',
          html:'<p style="background: #900;">v-html</p>',
          isActive: true,
        }
      }
    }
</script>

