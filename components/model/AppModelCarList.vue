<template>
  <div>
    <div class="ml-car" v-if="filteredCars.length">
      <div class="ml-car__title">
        {{ filteredCars.length }} авто Hyundai {{ model }} в наличии в {{ instockText }}
      </div>
      <div class="ml-car-wrap">
        <div class="ml-car-item" itemscope itemtype="https://schema.org/Product" v-for="el in showCars" :key="el.id">
          <meta itemprop="brand" content="Hyundai">
          <meta itemprop="model" :content="el['name_en']">
          <meta itemprop="url" :content="urlHost + '/' + el.id + '/'">
          <div class="ml-car-item__title"
               @click="pushToDetail(el.id)"
               itemprop="name">
            {{ el["model_name"] }}
          </div>
          <div class="ml-car-item__subtitle"
               @click="pushToDetail(el.id)">{{ el["name"] }}
          </div>
          <div class="ml-car-item__img"
               @click="pushToDetail(el.id)">
            <img :src="el['model_picture']"
                 :alt="el['model_name']"
                 :style="{backgroundColor: el['color']['real_color']['value']}"
                 v-if="el['color']"
                 itemprop="image">

            <img :src="el['model_picture']"
                 :alt="el['model_name']"
                 itemprop="image"
                 v-else>
          </div>
          <div class="ml-car-price" v-if="!hidePrice" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <div class="ml-car-price__new"><span itemprop="price" :content="el['price']">
              {{ formatPrice(el["price"]) }}</span> <span itemprop="priceCurrency" content="RUB">₽*</span></div>
            <div class="ml-car-price__old" v-if="(el['price_full4specials'] && el['price_full4specials'] > 0)">от
              {{ formatPrice(el['price_full4specials']) }} ₽
            </div>
            <link itemprop="availability" href="https://schema.org/InStock"/>
          </div>
          <div class="ml-car-price" v-else>
            <div class="ml-car-price__request">Цена по запросу</div>
            <meta itemprop="price" :content="el['price']">
            <meta itemprop="priceCurrency" content="RUB">
            <link itemprop="availability" href="https://schema.org/InStock"/>
          </div>

          <hr class="ml-separate">
          <div class="ml-car-options">
            <div class="ml-car-options-row">
              <div class="ml-car-options__name ml-car-options-icon ml-car-options-icon--volume">
                Объем двигателя, л
              </div>
              <div class="ml-car-options__value">{{ el['engine_volume'] }}</div>

              <div class="ml-car-options__name ml-car-options-icon ml-car-options-icon--power">
                Мощность двигателя, л.с.
              </div>
              <div class="ml-car-options__value">{{ el['engine_power'] }}</div>

              <div class="ml-car-options__name ml-car-options-icon ml-car-options-icon--transmission">
                Тип трансмиссии
              </div>
              <div class="ml-car-options__value">{{ el['transmission'] }}</div>

              <div class="ml-car-options__name ml-car-options-icon ml-car-options-icon--drive">
                Тип привода
              </div>
              <div class="ml-car-options__value">{{ el['gear_type'] }}</div>
            </div>
          </div>
          <div class="btn btn--blue-dark" data-fancybox @click="getCarForModal(el)">
            {{ hidePrice ? 'запросить цену' : 'хочу скидку' }}
          </div>
          <div class="btn btn--dark" data-fancybox @click="getCarForModal(el)">обратный звонок</div>
        </div>
      </div>
      <div class="show-more" v-if="filteredCars.length > showCount && showMore" @click="showMoreCars">Показать еще</div>
      <v-paginate v-if="filteredCars.length > showCount * 2 && !showMore"
                :click-handler="clickCallback"
                :page-count="getCount"
                :page-range="3"
                :margin-pages="2"
                :prev-text="'<'"
                :next-text="'>'"
                :container-class="'pagination'"
                :page-class="'page-item'">
      </v-paginate>

      <AppModalWindow v-if="modalShow" @close-modal="modalShow = false">
        <AppForm :is-popup="true" :car="carsModal" :hide-price="hidePrice"/>
      </AppModalWindow>
    </div>
    <div class="not-find-cars" v-else>По заданным параметрам автомобилей в наличии нет</div>
  </div>
</template>

<script>
import AppModalWindow from "../AppModalWindow";
import AppForm from "../AppForm";
import {mixinFormatPrice, mixinScrollToCars} from "/mixins/AppMixins";

export default {
  name: "AppModelCarList",
  props: {
    cars: {
      type: Array,
      required: true
    },
    model: {
      // type: String,
      required: true
    },
    dealers: {
      type: Array,
      required: true
    },
    hidePrice: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  mixins: [mixinFormatPrice, mixinScrollToCars],
  components: {
    AppModalWindow,
    AppForm
  },
  data() {
    return {
      loading: false,
      showCars: [],
      showCount: 12,
      filteredCars: this.cars,
      selfDealers: this.dealers,
      page: 1,
      showMore: true,
      modalShow: false,
      carsModal: {},
      urlHost: this.$route.fullPath
    }
  },
  methods: {
    pushToDetail(elId){
      this.$router.push({ name: 'model-id', params: {model: this.model, id: elId} })
    },
    getShowCars(start = 0, end = this.showCount) {
      this.showCars = [];

      for (let i in this.filteredCars) {
        if (i >= start && i < end) {
          this.showCars.push(this.filteredCars[i]);
        }
      }
    },
    getCarForModal(cars) {
      this.modalShow = true;
      this.carsModal = cars;

    },
    showMoreCars() {
      this.showMore = false;
      this.showCount = this.showCount * 2;
      this.getShowCars();
    },
    clickCallback: function (pageNum) {
      let start = 0;
      let end = this.showCount * pageNum;

      if (pageNum > 1) {
        start = this.showCount * (pageNum - 1);
      }
      this.getShowCars(start, end);
      this.scrollToCars();
    }
  },
  computed: {
    getCount() {
      return Math.ceil(this.filteredCars.length / this.showCount);
    },
    instockText() {
      let text = 'Hyundai АГАТ';

      if (this.selfDealers && this.selfDealers.length === 1) {
        text = this.selfDealers[0]["UF_NAME"];
      }

      return text;
    }
  },
  watch: {
    cars() {
      this.filteredCars = this.cars;
      this.getShowCars();
    }
  },
  fetch(){
    this.getShowCars();
  },
  mounted() {
    this.getShowCars();
  }
}
</script>

<style>
.pagination {
  display: flex;
  list-style: none;
  padding-left: 0;
  margin-top: 48px;
  justify-content: center;
}

.pagination li a {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid #00AAD2;
}

.pagination li.active a {
  color: #fff;
  background-color: #00AAD2;
}

.pagination li:not(:last-child) a {
  border-right: none;
}

.pagination li.disabled a {
  cursor: not-allowed;
}

.pagination li.disabled {
  opacity: .5;
}

</style>

<style scoped>
.show-more {
  max-width: 200px;
  padding: 12px 32px;
  border: 1px solid #00AAD2;
  margin: 48px auto 0;
  text-align: center;
  transition-duration: .2s;
  cursor: pointer;
}

.not-find-cars {
  margin: 80px 0 40px;
  font-size: 24px;
  text-align: center;
}

.show-more:hover {
  transition-duration: .2s;
  color: #FFFFFF;
  background-color: #00AAD2;
}

.clicker {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.ml-car-options-icon {
  position: relative;
}

.ml-car-options-icon:before {
  content: '';
  position: absolute;
  left: 0;
}

.ml-car-options-row:not(:last-child) {
  margin-bottom: 26px;
}

.ml-car__title {
  margin: 30px 0;
  font-size: 18px;
  font-weight: 500;
}

.ml-car-wrap {
  display: grid;
  grid-template: auto / 1fr 1fr 1fr 1fr;
  gap: 32px;
}

.ml-separate {
  margin: 20px 0 16px;
}

.ml-car-item {
  background: #FFFFFF;
  box-shadow: 0 0 10px rgba(0, 52, 105, 0.1);
  padding: 32px;
  transition-duration: .2s;
}

.ml-car-item:hover {
  box-shadow: 0 0 14px rgba(0, 52, 105, 0.2);
}

.ml-car-options {
  font-size: 14px;
}

.btn {
  display: block;
  padding: 14px 0;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
  border: none;
  border-radius: 0;
  font-size: 16px;
  text-align: center;
  margin-top: 32px;
  z-index: 1;
}

.ml-car-options-row {
  display: -ms-grid;
  display: grid;
  grid-template: 1fr / 70% 30%;
  column-gap: 8px;
  row-gap: 32px;
  line-height: 16px;
}

.ml-car-options__name {
  padding-left: 32px;
}

.ml-car-price {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
}

.ml-car-price__new {
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 500;
  color: #003469;
}

.ml-car-price__request {
  font-size: 18px;
  font-weight: 500;
  color: #003469;
}

.ml-car-price__old {
  text-decoration: line-through;
  font-weight: 400;
  font-size: 18px;
}

.ml-car-item__title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 4px;
  cursor: pointer;
}

.ml-car-item__subtitle {
  font-size: 14px;
  color: #003469;
  height: 46px;
}

.ml-car-item__img {
  width: 100%;
  margin-bottom: 10px;
  cursor: pointer;
}

.ml-car-item__img img {
  width: 100%;
}

@media (max-width: 1440px) {
  .ml-car-wrap {
    column-gap: 1%;
  }
}

@media (max-width: 1365px) {
  .ml-car-wrap {
    grid-template: auto / 1fr 1fr 1fr;
    column-gap: 32px;
  }
}

@media (max-width: 1200px) {
  .ml-car-wrap {
    column-gap: 1%;
  }

  .ml-car-options-row {
    row-gap: 20px;
  }

}

@media (max-width: 1090px) {
  .ml-car-wrap {
    grid-template: auto / 1fr 1fr;
  }

  .ml-car-options-row {
    grid-template: 1fr / 75% 15%;
  }

  .ml-car-options__value {
    text-align: right;
  }
}

@media (max-width: 767px) {
  .ml-car-wrap {
    grid-template: auto / 1fr;
    row-gap: 20px;
  }

  .ml-car-item {
    padding: 16px 18px 20px;
  }

  .ml-car-price__old {
    font-size: 14px;
  }

  .ml-car-item__title,
  .ml-car-price__new {
    font-size: 16px;
  }

  .ml-car__title {
    margin: 26px 0 15px;
  }
}
</style>
