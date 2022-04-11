<template>
  <div class="wrap-relative">

    <AppPreloadResponse :send-process="sendProcess"/>
    <form action=""
          class="form-request"
          @submit.prevent="checkForm"
    >

      <div class="container">
        <h3 class="form-title">Не нашли то, что искали?</h3>
        <p class="form-subtitle">Оставьте, пожалуйста, свои контактные данные. Мы свяжемся с Вами в ближайшее время и
          поможем подобрыть нужное
          авто.</p>
        <div class="block-fields" :class="{'show-error': $v.fields.$error || this.errorPhone}">
          <div class="form-group">

            <input type="text"
                   placeholder="Имя и Фамилия*"
                   v-model.lazy.trim="fields.name"
            >

            <p v-if="!$v.fields.name.required" class="error-text"> *Обязательное поле </p>
            <p v-if="!$v.fields.name.cyrillic" class="error-text"> *Используйте русские буквы </p>
          </div>
          <div class="form-group">

            <v-select placeholder="Выберите дилерский центр*"
                      :options="dealers"
                      :searchable="false"
                      class="select-dealers"
                      v-model="fields.dealer"
            >

              <template #no-options>
                Ничего не найдено
              </template>
            </v-select>

            <p v-if="$v.fields.dealer.$error" class="error-text">*Обязательное поле</p>
          </div>
          <div class="form-group">

            <input type="tel"
                   placeholder="Телефон*"
                   v-model="fields.phone"
                   v-mask="{mask: '+7(999) 999-99-99', showMaskOnHover: false}"
                   @input="maskCheck"
                   inputmode="numeric"
            >

            <p v-if="$v.fields.phone.$error || this.errorPhone" class="error-text">*Обязательное поле</p>
          </div>
          <div class="form-group">

            <input type="text"
                   placeholder="Добавить комментарий"
                   v-model.lazy.trim="fields.comment"
            >

          </div>
          <div class="form-bottom-left">
            <div class="policy-agreement">
              <input type="checkbox"
                     name="agreement"
                     id="policy-agreement"
                     v-model="fields.agree"
              >

              <label for="policy-agreement"
                     :class="{'no-check': !fields.agree}">
                Я согласен на обработку данных
                <br><a href="/rules-privacy/">Смотреть правила</a>
              </label>

            </div>
            <div class="require-text">*Поля, обязательные для заполнения</div>
          </div>
          <input type="submit"
                 class="btn btn--dark"
                 value="Отправить заявку"
          >
        </div>
      </div>
    </form>
    <AppModalWindow v-if="modalShow" @close-modal="modalShow = false">
      <AppResponse :action-send="actionAfterSend"/>
    </AppModalWindow>
  </div>
</template>

<script>
import AppModalWindow from "./AppModalWindow";
import AppPreloadResponse from "./AppPreloadResponse";
import AppResponse from "./AppResponse";
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators';
import {mixinValidates} from "../mixins/AppMixins";

const cyrillic = value => !/[^а-яё\s]/i.test(value);

export default {
  name: "AppFormRequest",
  mixins: [validationMixin, mixinValidates],
  validations: {
    fields: {
      name: {required, cyrillic},
      phone: {required},
      dealer: {required},
      agree: {required}
    }
  },
  components: {
    AppModalWindow,
    AppResponse,
    AppPreloadResponse
  },
  data: () => ({
    dataDealers: {},
    modalShow: false,
    fields: {
      name: "",
      phone: "",
      comment: "",
      dealer: "",
      agree: ""
    }
  }),
  methods: {
    setFieldDealer(value) {
      this.fields.dealer = value;
    },
  },
  computed: {
    dealers() {
      let dealerNames = [];

      for (const i in this.dataDealers) {
        dealerNames.push(this.dataDealers[i]["UF_NAME"]);
      }
      if (dealerNames.length === 1) {
        this.setFieldDealer(dealerNames[0]);
      }
      return dealerNames;
    }
  },
  async fetch() {
    await fetch(this.$requestUrl + '?data=dealers', {method: "POST"})
      .then(res => res.json())
      .then(res => {
        if (res["dealers"]) {
          this.dataDealers = res["dealers"];
        }
      })
  }
}
</script>
<style scoped lang="scss">

.form-group {
  position: relative;
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

.select-dealers {
  background-color: #CFD0D0;
}

.policy-agreement {
  color: #ffffff;
  font-size: 14px;
}

.has-error #policy-agreement + label:before {
  border: 1px solid #ee0505;
}

.policy-agreement a {
  color: #ffffff;
  text-decoration: underline;
  font-size: 14px;
}

.require-text {
  color: #B7B7B7;
  margin-top: 10px;
  font-size: 14px;
}

.btn {
  padding: 17px 40px;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
  border: none;
  justify-self: end;
  align-self: start;
  border-radius: 0;
  font-size: 16px;
}

.form-request {
  margin-top: 56px;
  padding: 52px 0;
  background: url("/images/instock/bg-form.jpg") 0 0 no-repeat;
  background-size: cover;
}

#policy-agreement {
  display: none;
}

.form-title {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 24px;
  color: #fff;
}

.form-subtitle {
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 30px;
  color: #fff;
}

.block-fields {
  display: grid;
  grid-template: auto / 360px 360px;
  gap: 26px 32px;
}

.form-group {
  margin-bottom: 0;
}

.form-group input {
  width: 100%;
  background-color: #CFD0D0;
  height: 41px;
  border: none;
  font-size: 14px;
  padding-left: 16px;
  color: #666666;
}

.form-group input::placeholder {
  font-size: 14px;
}

@media (max-width: 1024px) {
  .block-fields {
    grid-template: auto / 1fr 1fr;
    gap: 26px 8px;
  }
}

@media (max-width: 767px) {
  .block-fields {
    grid-template: auto / 1fr;
    gap: 26px 0;
  }

  .form-title {
    font-size: 16px;
  }

  .form-request {
    margin-top: 30px;
    padding: 14px 0 27px;
    background-color: #000000;
  }

  .btn {
    width: 100%;
  }
}
</style>
