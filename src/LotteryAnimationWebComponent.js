import LotteryAnimation from './components/LotteryAnimation.vue';
import { defineCustomElement } from 'vue';
// Define Webcomponent
const LotteryAnimationElement = defineCustomElement(LotteryAnimation);
customElements.define('lottery-animation', LotteryAnimationElement);
