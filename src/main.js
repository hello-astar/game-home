import Vue from 'vue'
import App from './App.vue'
import VConsole from 'vconsole' //import vconsole
let vConsole = new VConsole() // 初始化
console.log(vConsole)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
