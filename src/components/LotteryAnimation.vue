<template>
  <div ref="animationContainer"></div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import * as THREE from 'three';
  import textAnimation from './textAnimation';
  import mainAnimation from './mainAnimation';

  const props = defineProps<{ numbers: string | number[] }>();

  const numbers = typeof props.numbers === 'string' ? JSON.parse(props.numbers) : props.numbers;

  const animationContainer = ref<HTMLDivElement | null>(null);

  onMounted(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    animationContainer.value?.appendChild(renderer.domElement);

    textAnimation(renderer, () => {
      mainAnimation(renderer, numbers);
    });
  });
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
  }
</style>
