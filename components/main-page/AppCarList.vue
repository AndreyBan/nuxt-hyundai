<template>
  <section class="car-list">
    <template v-if="dataLoad && dataModels && dataModels.length">
      <AppCarItem v-for="(el, i) in dataModels"
                  :key="i"
                  :element="el"
                  :type="type"
                  :hide-price="hidePrice"
      />
    </template>
    <div class="not-find-cars" v-else-if="dataLoad && !dataModels.length">
      По заданным параметрам автомобилей в наличии нет
    </div>
  </section>
</template>

<script>
import AppCarItem from "./AppCarItem";
import AppPreloaderCars from "./AppPreloaderCars";

export default {
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
  name: "AppCarList",
  components: {
    AppCarItem,
    AppPreloaderCars,
  },
  props: {
    type: {
      type: String,
      required: true,
      default: ""
    }
  },

  data() {
    return {
      dataCars: this.$store.state["cars-info"]["cars"],
      dataModels: this.$store.state["cars-info"]["cars"]["data"][0]["models"],
      metaData: {
        title: 'Hyundai в наличии',
        description: 'Hyundai в наличии - характеристики, цена, скидки.',
      },
      dataLoad: false,
      hidePrice: false,
      res: []
    }
  },
  created() {
    if (this.dataCars["city"]["in"]) {
      let cityIn = this.dataCars["city"]["in"];

      this.metaData.title = `Hyundai в наличии в ${cityIn}`;
      this.metaData.description = `Hyundai в наличии в ${cityIn} - характеристики, цена, скидки.`;
    }

    this.hidePrice = this.dataCars["hide_price"];
    this.dataLoad = true;
  }
}

</script>

<style scoped>
.car-list {
  margin-top: 32px;
  display: -ms-grid;
  display: grid;
  -ms-grid-rows: auto;
  -ms-grid-columns: 1fr 32px 1fr 32px 1fr 32px 1fr;
  grid-template: auto / 1fr 1fr 1fr 1fr;
  grid-column-gap: 32px;

}

@media (max-width: 1280px) {
  .car-list {
    -ms-grid-rows: auto;
    -ms-grid-columns: 1fr 1fr 1fr;
    grid-template: auto / 1fr 1fr 1fr;
  }
}

@media (max-width: 991px) {
  .car-list {
    -ms-grid-rows: auto;
    -ms-grid-columns: 1fr 1fr;
    grid-template: auto / 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .car-list {
    -ms-grid-rows: auto;
    -ms-grid-columns: 1fr;
    grid-template: auto / 1fr;
  }
}
</style>
