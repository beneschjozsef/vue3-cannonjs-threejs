import LotteryAnimation from './components/LotteryAnimation.vue';
import { defineCustomElement } from 'vue';
// Define Webcomponent
const LotteryAnimationElement = defineCustomElement({
  ...LotteryAnimation,
  props: {
    numbers: {
      type: Array,
      default: () => [],
    },
  },
});
customElements.define('lottery-animation', LotteryAnimationElement);
