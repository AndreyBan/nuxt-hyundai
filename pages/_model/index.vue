<template>
  <section>
    <div class="container">
      <template v-if="loadPage && !error && !toBeginPage && !toDetailPage">
        <AppBreadcrumbs :prop-chain-item="[{name: $route.params.model, path: ''}]"/>
        <client-only>
          <AppFilter :cars="filterCarList"
                     :model-image="modelImage"
                     :hide-price="hidePrice"
                     :count="countCars"
                     @get-cars="filterCars"
          />
        </client-only>
        <AppModelCarList :cars="filterCarList" :dealers="dealers" :model="$route.params.model" :hide-price="hidePrice"/>
      </template>
      <template v-else-if="toBeginPage">
        <AppPreloaderCars v-for="i in 8" :key="i"/>
      </template>
      <div class="loader-wrap" v-else-if="toDetailPage">
        <div class="loader"></div>
      </div>
      <AppError v-else/>
    </div>
    <client-only>
      <AppFormRequest/>
    </client-only>
  </section>
</template>

<script>
import AppFilter from "/components/model/AppFilter";
import AppFormRequest from "/components/AppFormRequest";
import AppModelCarList from "/components/model/AppModelCarList";
import AppError from "/components/AppError";
import AppBreadcrumbs from "/components/AppBreadcrumbs";
import AppPreloaderCars from "/components/main-page/AppPreloaderCars";

import {mixinFilterProp} from "/mixins/AppMixins";
import Vue from "vue";

export default {
  layout: 'hyundai',
  name: "model",
  mixins: [mixinFilterProp],
  components: {
    AppFilter,
    AppFormRequest,
    AppModelCarList,
    AppError,
    AppBreadcrumbs,
    AppPreloaderCars
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
    keepComponents: ['index', 'model'],
    refresh: false
  },
  async asyncData({error, store, params, route}){
    let [meta] = route.meta;

    if (!store.state["model-info"]["models"]["status"] || meta.refresh) {
      await store.dispatch('model-info/fetchData', params.model);
    }

    if (store.state["model-info"]["models"]["status"] !== "success") {
      error({
        statusCode: 404,
        message: 'Unable to fetch event'
      })
    }

    let dataModels = store.state["model-info"]["models"];

    return { dataModels }

  },
  data() {
    return {
      countCars: 0,
      error: false,
      filterCarList: [],
      dealers: this.$store.state["model-info"]["models"]["city"]["dealers"] ? this.$store.state["model-info"]["models"]["city"]["dealers"] : false,
      loadPage: false,
      hidePrice: this.$store.state["model-info"]["models"]["hide_price"] ? this.$store.state["model-info"]["models"]["hide_price"] : false,
      modelImage: this.$store.state["model-info"]["models"]["model_image"] ? this.$store.state["model-info"]["models"]["model_image"] : "",
      toBeginPage: false,
      toDetailPage: false,
      metaData: {
        title: 'Hyundai в наличии',
        description: 'Hyundai в наличии - характеристики, цена, скидки.',
      },
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'index' ) {
      if (!this.$store.state["cars-info"]["cars"]["status"]){
        this.toBeginPage = true;
      }
      to.meta.keepComponents = ['index'];
    } else if (to.name === 'model-id'){
      this.toDetailPage = true;
    }
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.toBeginPage = false;
      vm.toDetailPage = false;
    })
  },
  methods: {
    filterCars(filter = undefined) {
      let cars = this.$store.state["model-info"]["models"]["data"];

      if (filter) {
        this.filterCarList = this.getUpdateFilterCars(cars, filter);
        this.countCars = this.filterCarList.length;

        return this.filterCarList;

      } else return cars;
    },

    getUpdateFilterCars(cars, filter) {
      let {colors, year_of_manufacture, price} = filter;

      return cars.filter(el => {

        for (let i in filter) {
          if (!["colors", "year_of_manufacture", "price"].includes(i)) {

            if (el[i]) {
              if (filter[i] && !filter[i].includes(el[i])) return false;
            } else return false;
          }
        }

        if (el["price"] > price.priceMax || el["price"] < price.priceMin) return false;

        return !(!this.filterProp(el["year_of_manufacture"], year_of_manufacture)
          || !this.filterProp(el["color"], colors));

      });
    }
  },

  created() {
    this.filterCarList = this.filterCars();
    this.countCars = this.filterCarList.length;

    if (this.$store.state["model-info"]["models"]["city"]["in"]) {
      let cityIn = this.$store.state["model-info"]["models"]["city"]["in"];

      this.metaData.title = `Hyundai ${this.$route.params.model} в наличии в ${cityIn}`;
      this.metaData.description = `Hyundai ${this.$route.params.model} в наличии в ${cityIn} - характеристики, цена, скидки.`;
    }
    if (this.countCars) this.loadPage = true;
  },
  mounted() {
    if (matchMedia('(max-width:767px)').matches) {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style scoped>
.loader-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader,
.loader:after {
  overflow: hidden;
  border-radius: 50%;
  width: 10em;
  height: 10em;
}

.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(101, 171, 248, 0.2);
  border-right: 1.1em solid rgba(101, 171, 248, 0.2);
  border-bottom: 1.1em solid rgba(101, 171, 248, 0.2);
  border-left: 1.1em solid #65abf8;
  transform: translateZ(0);
  animation: load8 1.1s infinite linear;
}

@-webkit-keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
