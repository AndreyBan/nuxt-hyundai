<template>
  <div class="container" v-if="loaded && !error">
    <AppBreadcrumbs
      :prop-chain-item="[{name: $route.params.model, path:  '/' + $route.params.model}, {name: car['model_name'] + ' ' + car['configuration_name'], path: ''}]"/>
    <template v-if="!toBeginPage && !toModelPage">
      <AppInfoCar :car="car" :hide-price="hidePrice"/>
      <div class="bottom-block">
        <AppExtraOptions :car="car"/>
        <div>
          <div class="sticky-form">
            <AppForm :car="car" :hide-price="hidePrice"/>
          </div>
        </div>
      </div>
      <p class="bottom-text">Указанная цена достигается суммированием всех специальных условий, действующих на данную
        модель автомобиля, не
        включает стоимость установленного дополнительного оборудования и может отличаться от цен других дилеров. Ценовое
        предложение действует на ограниченную партию автомобилей, носит информационный характер и не является публичной
        офертой, определяемой положениями ст. 437 (2) ГК РФ. Окончательную стоимость а/м с учётом всех действующих акций
        и
        установленного дополнительного оборудования уточняйте в отделах продаж Hyundai АГАТ и по телефону +7 (831)
        266-47-08.</p>
    </template>
    <template v-else-if="toBeginPage">
      <AppPreloaderCars v-for="i in 8" :key="i"/>
    </template>
    <AppPreload v-else-if="toModelPage"/>
  </div>
  <AppError v-else-if="error">Произошла ошибка загрузки данных, пожалуйста повторите позже.</AppError>
</template>

<script>
import AppInfoCar from "/components/detail/AppInfoCar";
import AppExtraOptions from "/components/detail/AppExtraOptions";
import AppForm from "/components/AppForm";
import AppBreadcrumbs from "/components/AppBreadcrumbs";
import AppError from "/components/AppError";
import AppPreloaderCars from "/components/main-page/AppPreloaderCars";
import AppPreload from "../../components/model/AppPreload";

export default {
  layout: 'hyundai',
  name: "model-id",
  components: {
    AppInfoCar,
    AppExtraOptions,
    AppForm,
    AppError,
    AppBreadcrumbs,
    AppPreloaderCars,
    AppPreload
  },
  head() {
    return {
      title: this.metaData.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.metaData.description,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.metaData.title,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.metaData.description,
        },
      ],

    }
  },
  meta: {
    keepComponents: ['index', 'model']
  },
  async asyncData({error, store, params}) {
    await store.dispatch('car-detail/fetchData', params.id);

    if (store.state["car-detail"]['car']["status"] !== "success") {
      error({
        statusCode: 404,
        message: 'Unable to fetch event'
      })
    }

    let car = store.state["car-detail"]["car"]['data'];

    return {car}

  },
  data() {
    return {
      car: {},
      toBeginPage: false,
      toModelPage: false,
      modalShow: false,
      loaded: false,
      error: false,
      metaData: {
        title: 'Hyundai в наличии',
        description: 'Hyundai в наличии - характеристики, цена, скидки.',
      },
      hidePrice: false
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'model') {
      to.meta.refresh = false;
      this.toModelPage = true;
    } else if (to.name === 'index') {
      to.meta.keepComponents = ['index'];
      if (!this.$store.state["cars-info"]["cars"]["status"]) {
        this.toBeginPage = true;
      }
    }
    next();
  },
  created() {
    let cityIn = this.$store.state['car-detail']['car']["city"]["in"];

    this.metaData.title = `${this.car["name"]} ${this.car["color"]["name"]}  в наличии – купить в ${cityIn}`;
    this.metaData.description = `Купить новый ${this.car["name"]} ${this.car["engine_volume"]} ${this.car["color"]["name"]} ${this.car["transmission"]} по цене ${this.car["price"]}  руб. в ${cityIn}. Автокредит, лизинг, спецпредложения. ${this.car["name"]} в наличии у официального дилера АГАТ.`;
  },
  mounted() {
    if (matchMedia('(max-width:767px)').matches) {
      window.scrollTo(0, 0)
    }

    this.loaded = true;
  }
}
</script>

<style scoped>
.bottom-block {
  margin-top: 32px;
  display: grid;
  grid-template: auto / 1.4fr 1fr;
  column-gap: 32px;
}

.sticky-form {
  position: sticky;
  position: -webkit-sticky;
  top: 120px;
}

.bottom-text {
  margin: 50px 0;
  color: #666666;
  font-size: 14px;
}

@media (max-width: 1279px) {
  .bottom-block {
    grid-template: auto / 1fr;
  }
}
</style>
