<template>
  <div v-if="!actionAfterSend.sendSuccess && !actionAfterSend.sendError">
    <AppPreloadResponse :send-process="sendProcess" />
    <div class="detail-form-page"
         v-if="thisCar"
         :class="{'form-popup': isPopup}"
    >

      <div class="detail-form__main-title" v-if="isPopup">{{ hidePrice ? 'запросить цену' : 'забронировать автомобиль'}}</div>
      <div class="detail-form__title">{{ thisCar["model_name"] }}</div>
      <div class="detail-form__subtitle">{{ thisCar["name"] }}</div>
      <div class="detail-form-price-image">
        <div class="detail-form__price" v-if="!hidePrice">
          Стоимость: <span>{{ formatPrice(thisCar["price"]) }} ₽*</span>
          <div class="detail-form__price-old"
               v-if="isPopup && (thisCar['price_full4specials'] && thisCar['price_full4specials'] > 0)">от
            {{ formatPrice(thisCar['price_full4specials']) }} ₽
          </div>
        </div>
        <div class="detail-form__price" v-else>
       <span>Цена по запросу</span>
        </div>
        <div class="detail-form__image">
          <img :src="thisCar['model_picture']"
               :alt="thisCar.name"
               :style="{backgroundColor: thisCar['color']['real_color']['value']}"
               v-if="thisCar['color']"
          >
          <img :src="thisCar['model_picture']"
               :alt="thisCar.name"
               v-else
          >
        </div>
      </div>

      <form action=""
            class="detail-form"
            @submit.prevent="checkForm"
            :class="{'show-error': $v.fields.$error || this.errorPhone}"
      >

        <div class="form-group">
          <input type="text"
                 placeholder="Имя и Фамилия*"
                 v-model.lazy.trim="fields.name"
          >

          <p v-if="!$v.fields.name.required" class="error-text"> *Обязательное поле </p>
          <p v-if="!$v.fields.name.cyrillic" class="error-text"> *Используйте русские буквы </p>
        </div>
        <div class="form-group">
          <input type="text"
                 placeholder="Телефон*"
                 v-model="fields.phone"
                 v-mask="{mask: '+7(999) 999-99-99', showMaskOnHover: false}"
                 @change="maskCheck"
                 inputmode="numeric"
          >

          <p v-if="$v.fields.phone.$error || this.errorPhone" class="error-text">*Обязательное поле</p>
        </div>
        <div class="policy-agreement">
          <input type="checkbox"
                 name="agreement"
                 id="policy-agreement"
                 v-model="fields.agree">
          <label for="policy-agreement" :class="{'no-check': !fields.agree}">
            Я согласен на обработку данных
            <br><a href="/rules-privacy/">Смотреть правила</a>
          </label>
        </div>
        <button type="submit" class="btn btn--blue-dark">{{ hidePrice ? 'запросить цену' : 'забронировать авто'}}</button>
      </form>

    </div>
    <AppError v-else>
      Ошибка загрузки формы!
    </AppError>
  </div>
  <AppResponse :action-send="actionAfterSend" v-else-if="actionAfterSend.sendSuccess || actionAfterSend.sendError"/>
</template>

<script>
import {validationMixin} from 'vuelidate'
import AppError from './AppError';
import AppResponse from "./AppResponse";
import AppPreloadResponse from "./AppPreloadResponse";
import {required} from 'vuelidate/lib/validators';
import {mixinFormatPrice, mixinValidates} from "../mixins/AppMixins";

const cyrillic = value => !/[^а-яё\s]/i.test(value);

export default {
  name: "AppForm",
  components: {
    AppError,
    AppResponse,
    AppPreloadResponse
  },
  props: {
    isPopup: {
      type: Boolean
    },
    car: {
      type: Object,
      required: true
    },
    hidePrice: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      fields: {
        name: "",
        phone: "",
        comment: "",
        dealer: this.car['dealer_center'],
        adv: `Модель: ${this.car['model_name']}
               Комплектация: ${this.car['configuration_name']}
               Цвет: ${this.car['color']['real_color']['name']}
               Цена со скидкой: ${this.car['price']}
               Объем двигателя: ${this.car['engine_volume']}
               Мощность двигателя: ${this.car['engine_power']}
               Трансмиссия: ${this.car['transmission']}
               Привод: ${this.car['gear_type']}
               `,
        agree: "",
      },
      thisCar: this.car
    }
  },
  mixins: [validationMixin, mixinFormatPrice, mixinValidates],
  validations: {
    fields: {
      name: {required, cyrillic},
      phone: {required},
      agree: {required}
    }
  },
}
</script>

<style scoped>

.detail-form__main-title {
  text-align: center;
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 500;
  position: relative;
  margin-bottom: 44px;
  z-index: 1;
}

.error-text {
  position: absolute;
  bottom: -18px;
  color: #ee0505;
  margin: 0;
  font-size: 12px;
  display: none;
}

.show-error .error-text {
  display: block;
}

.detail-form {
  display: grid;
  grid-template: auto / 1fr 1fr;
  gap: 26px 29px;
}

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
  width: 100%;
  grid-column: 2/3;
  justify-self: end;
}

.form-group input {
  border: 1px solid #B7B7B7;
  font-size: 14px;
  height: 41px;
  padding-left: 14px;
  width: 100%;
}

.form-group input::placeholder {
  font-size: 14px;
}


.detail-form-page {
  padding: 48px 32px 56px;
}

.detail-form-page:not(.form-popup) {
  border: 1px solid #B7B7B7;
}

.form-popup .detail-form__title {
  font-size: 16px;
}

.detail-form__title {
  font-size: 36px;
  font-weight: 500;
}

.detail-form__subtitle {
  position: relative;
  font-size: 14px;
  color: #003469;
  max-width: 260px;
  z-index: 1;
}

.detail-form__price {
  margin-top: 22px;
  white-space: nowrap;
}

.detail-form__price span {
  font-size: 24px;
  color: #003469;
  font-weight: 500;
}

.form-popup .detail-form__price {
  font-size: 14px;
}

.form-popup .detail-form__price span {
  font-size: 16px;
}

.detail-form-price-image {
  display: flex;
  justify-content: space-between;
}

.form-popup .detail-form__image {
  max-width: 348px;
  width: 100%;
  position: relative;
  height: 217px;
  margin-top: -70px;
  z-index: 0;
}

.form-popup .detail-form__image img {
  width: 100%;
  position: absolute;
}

.detail-form__image {
  max-width: 348px;
  width: 100%;
}

.detail-form__image img {
  width: 100%;
}
</style>
<style scoped>
.policy-agreement input {
  display: none;
}

#policy-agreement + label {
  position: relative;
  cursor: pointer;
  padding-left: 32px;
  display: inline-block;
  line-height: 20px;
}

#policy-agreement + label:before {
  content: '';
  position: absolute;
  border: 1px solid #000000;
  width: 16px;
  height: 16px;
  left: 0;
  top: 3px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

#policy-agreement:checked + label:after {
  content: '';
  background: url("/images/instock/black-check.svg") 50% 50% no-repeat;
  width: 10px;
  height: 10px;
  background-size: 10px;
  position: absolute;
  left: 3px;
  top: 6px;
}

.policy-agreement label {
  position: relative;
  font-size: 14px;
}
.policy-agreement a{
  color: #103A71;
  text-decoration: underline;
}
.detail-form__price-old {
  font-size: 14px;
  text-decoration: line-through;
}

.detail-form-page.form-popup {
  margin: 0;
  padding-top: 54px;
}

@media (max-width: 1279px) {
  .detail-form__image {
    max-width: 600px;
  }
}

@media (max-width: 767px) {
  .detail-form-page.form-popup {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .detail-form-page {
    padding: 18px;
  }

  .detail-form-page:not(.form-popup) {
    margin-top: 30px;
  }

  .detail-form-price-image {
    flex-direction: column;
  }

  .detail-form {
    display: block;
  }

  .form-group,
  .policy-agreement {
    margin-bottom: 26px;
  }

  .form-popup .detail-form__image {
    margin-top: 0;
  }

  .detail-form-page.form-popup {
    overflow: auto;
    height: 100vh;
  }
}
</style>
