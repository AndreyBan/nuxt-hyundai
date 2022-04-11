import Vue from 'vue';

Vue.use({
  install(Vue) {
    if (process.env.NODE_ENV === 'development'){
      Vue.prototype.$requestUrl = 'https://agat-hyundai.ru/ajax/api_instock.php';
    } else {
      Vue.prototype.$requestUrl  = '/ajax/api_instock.php';
    }
  },
});

