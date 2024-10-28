<template>
  <div ref="animationContainer"></div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import * as THREE from 'three';
  import textAnimation from './textAnimation';
  import mainAnimation from './mainAnimation';

  export default defineComponent({
    name: 'LotteryAnimation',
    setup() {
      const animationContainer = ref<HTMLDivElement | null>(null);

      onMounted(() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        animationContainer.value?.appendChild(renderer.domElement);

        textAnimation(renderer, () => {
          mainAnimation(renderer);
        });
      });

      return { animationContainer };
    },
  });
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
  }
</style>
