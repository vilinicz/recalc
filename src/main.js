import Vue from 'vue';
import vueSmoothScroll from 'vue2-smooth-scroll';
import App from './App.vue';
import '@/assets/main.scss';

Vue.use(vueSmoothScroll);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
