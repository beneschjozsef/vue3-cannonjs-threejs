// import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';
// import wasm from 'vite-plugin-wasm';

// export default defineConfig({
//   plugins: [vue(), wasm()],
//   build: {
//     lib: {
//       entry: './src/main.ts',
//       name: 'LotteryAnimation',
//       fileName: 'lottery-animation',
//       formats: ['es'],
//     },
//     rollupOptions: {
//       output: {
//         entryFileNames: 'assets/[name].js',
//         assetFileNames: 'assets/[name].[ext]',
//       },
//     },
//   },
// });

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [vue(), wasm()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        lotteryAnimation: 'src/LotteryAnimationWebComponent.js', // A webkomponens bemenet
      },
      output: {
        entryFileNames: '[name].js', // A kimeneti fájl neve
        format: 'esm',
      },
    },
  },
});
