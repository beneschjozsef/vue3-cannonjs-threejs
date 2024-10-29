<template>
  <LotteryAnimation :numbers="[1, 12, 33, 44, 60]" />
</template>

<script setup lang="ts">
  import LotteryAnimation from './components/LotteryAnimation.vue';
</script>

<style>
  body,
  html {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
