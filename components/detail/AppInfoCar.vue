<template>
  <section class="car-info" >
    <div class="car-info-top-row">
      <div class="car-info-title-wrap">
        <div class="car-info__title">
          {{ carInfo["model_name"] }}
        </div>
        <div class="car-info__subtitle">
          {{ carInfo["name"] }}
        </div>
      </div>
      <div class="car-info-price" v-if="!hidePrice">
        <div class="car-info-price-row" >
          <span class="car-info-price__new">{{ formatPrice(carInfo["price"]) }} ₽*</span>
          <span class="car-info-price__old"  v-if="(carInfo['price_full4specials'] && carInfo['price_full4specials'] > 0)">от {{ formatPrice(carInfo['price_full4specials']) }} ₽</span>
        </div>
        <div class="car-info-price__credit" v-if="carInfo['credit']">В кредит от <span>{{ formatPrice(carInfo["credit"]) }} ₽/мес.</span></div>
      </div>
      <div class="car-info-price" v-else>
        <div class="car-info-price-row">
          <span class="car-info-price__new"> Цена по запросу </span>
        </div>
      </div>
    </div>
    <div class="car-info-grid">
      <div class="car-info__img">
        <img :src="carInfo['model_picture']" :alt="carInfo.name" :style="{backgroundColor: carInfo['color']['real_color']['value']}" v-if="carInfo['color']">
        <img :src="carInfo['model_picture']" :alt="carInfo.name"  v-else>
      </div>
      <div class="car-info-options-wrap">
        <div class="car-info-options">
          <div class="car-info-options__title">Технические характеристики</div>
          <div class="car-info-options__row">
            <div class="car-info-options__name car-info-options-icon car-info-options-icon--time">Год выпуска, г</div>
            <div class="car-info-options__value">{{ carInfo["year_of_manufacture"] }}</div>
            <div class="car-info-options__name car-info-options-icon ml-car-options-icon--volume">Объем двигателя, л
            </div>
            <div class="car-info-options__value">{{ carInfo["engine_volume"] }}</div>
            <div class="car-info-options__name car-info-options-icon ml-car-options-icon--power">Мощность двигателя,
              л.с.
            </div>
            <div class="car-info-options__value">{{ carInfo["engine_power"] }}</div>
            <div class="car-info-options__name car-info-options-icon ml-car-options-icon--transmission">Тип
              трансмиссии
            </div>
            <div class="car-info-options__value">{{ carInfo["transmission"] }}</div>
            <div class="car-info-options__name car-info-options-icon ml-car-options-icon--drive">Тип привода</div>
            <div class="car-info-options__value">{{ carInfo["gear_type"] }}</div>
          </div>
        </div>
      </div>
      <div class="car-info-address-wrap">
        <div class="car-info-address">
          <div>
            <div class="car-info-address__title">Автомобиль в наличии в ДЦ АГАТ</div>
            <div class="car-info-address__name">
              {{ carInfo["placement"] }}
              <br>
              +7 (831) 266-47-08
            </div>
          </div>
          <div class="btn btn--blue-dark" data-fancybox @click="modalShow = true">
            {{ hidePrice ? 'запросить цену' : 'забронировать авто' }}
          </div>
        </div>
      </div>
      <div class="car-info-buttons-wrap">
        <div class="car-info-buttons">
          <div class="btn btn--dark icon-btn icon-btn--calc" data-fancybox @click="modalShow = true">расчет кредита</div>
          <div class="btn btn--dark icon-btn icon-btn--test-drive" data-fancybox @click="modalShow = true">тест-драйв</div>
          <div class="btn btn--dark icon-btn icon-btn--refresh" data-fancybox @click="modalShow = true">трейд-ин</div>
        </div>
      </div>
      <AppModalWindow v-if="modalShow" @close-modal="modalShow = false">
        <AppForm :car="carInfo" :is-popup="true" :hide-price="hidePrice"/>
      </AppModalWindow>
    </div>
  </section>
</template>

<script>
import AppModalWindow from "../AppModalWindow";
import AppForm from "/components/AppForm";
import {mixinFormatPrice} from "/mixins/AppMixins";

export default {
  name: "AppInfoCar",
  props: {
    car: {
      type: Object
    },
    hidePrice: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  mixins: [mixinFormatPrice],
  components: {
    AppModalWindow,
    AppForm
  },
  data() {
    return {
      carInfo: this.car,
      modalShow: false
    }
  }
}
</script>

<style scoped>
.btn {
  display: block;
  position: relative;
  padding: 14px 0;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
  border: none;
  border-radius: 0;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  z-index: 1;
  width: 229px;
}

.btn.icon-btn {
  padding-left: 32px;
}

.car-info-address {
  grid-area: 2 / 2 / 3 / 3;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.car-info-address-wrap {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.car-info-address__title {
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
}

.car-info-address__name {
  font-size: 14px;
  padding-left: 32px;
  position: relative;
}

.car-info-address__name:before {
  content: '';
  position: absolute;
  left: 0;
  background: url("/images/instock/icon-loacation.svg") 0 0 no-repeat;
  width: 20px;
  height: 27px;
}

.car-info-buttons-wrap {
  grid-row: 3 / 4;
  align-self: center;
}

.icon-btn:before {
  content: '';
  position: absolute;
  left: auto;
  margin-left: -36px;
}

.icon-btn--calc:before {
  background: url("/images/instock/icon-calc.svg") 0 0 no-repeat;
  top: 9px;
  width: 23px;
  height: 28px;
}

.icon-btn--test-drive:before {
  background: url("/images/instock/icon-test-drive.svg") 0 0 no-repeat;
  top: 9px;
  width: 27px;
  height: 27px;
}

.icon-btn--refresh:before {
  background: url("/images/instock/icon-refresh.svg") 0 0 no-repeat;
  top: 10px;
  width: 30px;
  height: 25px;
}

.car-info-buttons {
  display: flex;
  justify-content: space-between;
}

.car-info-options__name {
  padding-left: 32px;
  position: relative;
}

.car-info-options__value,
.car-info-options__name {
  font-size: 14px;
  line-height: 16px;
}

.car-info-options-icon:before {
  content: '';
  position: absolute;
  left: 0;
}

.car-info-options-icon--time:before {
  background: url("/images/instock/icon-time.svg") 0 0 no-repeat;
  background-size: 16px;
  width: 16px;
  height: 16px;
  top: 0;
}

.car-info-options__row {
  margin-top: 26px;
  display: -ms-grid;
  display: grid;
  grid-template: 1fr / 1fr 1fr;
  row-gap: 26px;
}

.car-info-options__title {
  font-size: 18px;
  font-weight: 500;
  line-height: 21px;
}

.car-info-options,
.car-info-address {
  padding: 32px;
  background-color: #EFEFED;
}

.car-info-options {
  margin-top: 32px;
}

.car-info-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.car-info__title {
  font-size: 36px;
  font-weight: 500;
  margin-bottom: 4px;
}

.car-info__subtitle {
  font-size: 14px;
  color: #003469;
}

.car-info-price__new {
  font-size: 36px;
  font-weight: 500;
  color: #003469;
  margin-right: 25px;
}

.car-info-price__old {
  font-size: 20px;
  text-decoration: line-through;
}

.car-info-price__credit {
  font-size: 16px;
  text-align: right;
}

.car-info-price__credit span {
  color: #003469;
  margin-left: 16px;
  font-weight: 500;
}

.car-info-grid {
  display: grid;
  grid-template: 328px 32px 124px/ 1.4fr 1fr;
  column-gap: 32px;
}

.car-info__img {
  text-align: center;
  grid-area: 1 / 1 / 2 / 2;
}

.car-info__img img {
  max-width: 643px;
}

@media (max-width: 1279px) {
  .car-info-grid {
    grid-template: auto/ 60% auto;
  }

  .car-info__img {
    grid-column: 1/3;
  }

  .car-info-options-wrap {
    grid-column: 1 / 2;
  }

  .car-info-options {
    margin-top: 0;
  }

  .car-info-address-wrap {
    grid-column: 2 / 3;
    grid-row: auto;
  }

  .car-info-buttons-wrap {
    grid-column: 1 / 3;
    margin-top: 32px;
  }

  .car-info-address {
    flex-direction: column;
    height: 100%;
  }
}

@media (max-width: 991px) {
  .car-info__title,
  .car-info-price__new {
    font-size: 24px;
  }

  .car-info-price__old {
    font-size: 16px;
  }

  .car-info-options__row {
    grid-template: 1fr / 70% auto;
  }
  .car-info-grid {
    grid-template: auto/ 55% auto;
    column-gap: 8px;
  }
}

@media (max-width: 768px) {


  .car-info-address .btn {
    display: block;
    width: 100%;
  }

  .btn {
    width: 224px;
  }
}

@media (max-width: 767px) {
  .car-info-grid {
    grid-template: auto / 1fr;
  }

  .car-info__img {
    grid-area: unset;
  }

  .car-info__img img {
    max-width: 100%;
  }

  .car-info-options-wrap,
  .car-info-address-wrap,
  .car-info-buttons-wrap {

    grid-column: unset;
  }

  .car-info-buttons {
    display: block;
    margin-bottom: 30px;
  }

  .btn {
    width: 100%;
  }

  .car-info-options,
  .car-info-address {
    padding: 20px;
  }

  .car-info-buttons .btn:not(:last-child) {
    margin-bottom: 26px;
  }

  .car-info__title,
  .car-info-price__new {
    font-size: 18px;
  }

  .car-info__subtitle {
    margin-bottom: 16px;
  }

  .car-info-price-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .car-info-price__old,
  .car-info-price__credit {
    font-size: 14px;
  }

  .car-info-top-row {
    display: block;
  }

  .car-info-price__credit {
    text-align: left;
  }

  .car-info-address__name {
    margin-bottom: 18px;
  }
}
</style>
