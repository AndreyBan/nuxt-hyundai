<template>
  <div class="form-response">
    <div class="response-success" v-if="actionSend.sendSuccess">
      <div class="form-response__text">
        Спасибо за обращение!
        <br>
        Наши специалисты свяжутся с Вами в ближайшее время.
      </div>
      <div class="form-response__img">
        <img src="/media/images/love-car.svg" alt="">
      </div>
    </div>
    <div class="response-no-success" v-else>
      <div class="form-response__text">
        Приносим извинения!
        <br>
        Произошла ошибка отправки данных.
        <br>
        Попробуйте отправить заявку позже.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppResponse",
  props: {
    actionSend: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.form-response__text {
  text-align: center;
  color: #003469;
  line-height: 24px;
}
.form-response {
  padding: 48px 32px 56px;
  border: 1px solid #B7B7B7;
}
.form-response__img{
  margin-top: 16px;
  text-align: center;
}
</style>
