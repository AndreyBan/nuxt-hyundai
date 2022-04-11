<template>
  <section class="preload">
    <div class="preload-filter">
      <div class="mf__title c-preload"></div>
      <div class="mf-selects">
        <div class="select-wrap" v-for="i in 3" :key="i">
          <div class="mf-selects-label c-preload"></div>
          <div class="mf-select c-preload"></div>
        </div>
      </div>
      <div class="mf-color-title c-preload"></div>
      <div class="mf-colors">
        <div class="color-wrap" v-for="i in 3" :key="i">
          <div class="mf-color c-preload"></div>
        </div>
      </div>
      <div class="mf-bottom">
        <div class="mf-bottom-extend-text c-preload"></div>
        <div class="btn-group">
          <div class="filter-btn c-preload"></div>
          <div class="filter-btn c-preload"></div>
        </div>
      </div>
    </div>
    <div class="preload-cars">
      <div class="ml-car">
        <div class="ml-car__title c-preload"></div>

        <div class="ml-car-wrap">
          <div class="ml-car-item" v-for="i in 8" :key="i">
            <div class="ml-car-item__title c-preload"></div>
            <div class="ml-car-item__subtitle c-preload"></div>
            <div class="ml-car-item__img c-preload--big"></div>
            <div class="ml-car-price">
              <div class="ml-car-price__new c-preload"></div>
              <div class="ml-car-price__old c-preload"></div>
            </div>
            <hr class="ml-separate">
            <div class="ml-car-options">
              <div class="ml-car-options-row" v-for="i in 4" :key="i">
                <div class="ml-car-options__circle c-preload"></div>
                <div class="ml-car-options__name c-preload"></div>
                <div class="ml-car-options__value c-preload"></div>
              </div>
            </div>
            <div class="btn c-preload"></div>
            <div class="btn c-preload"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AppPreload"
}
</script>

<style scoped lang="scss">
$bgColor: #E4DCD3;
$bgColorDark: #d9d2c8;

@mixin block-preload($height, $width) {
  height: $height;
  width: $width;
  background-color: $bgColor;
}

@mixin block-preload-dark($height, $width) {
  height: $height;
  width: $width;
  background-color: $bgColorDark;
}

.ml-car {
  &-wrap {
    display: grid;
    grid-template: auto / 1fr 1fr 1fr 1fr;
    gap: 32px;
  }

  &-item {
    background: #FFFFFF;
    box-shadow: 0 0 10px rgba(0, 52, 105, 0.1);
    padding: 32px;

    &__title {
      @include block-preload(16px, 150px);
      margin-bottom: 4px;
    }

    &__subtitle {
      @include block-preload(12px, 90px);
      margin-bottom: 14px;
    }

    &__img {
      @include block-preload(183px, 100%);
    }
  }

  &-price {
    display: flex;
    justify-content: space-between;

    &__new,
    &__old {
      margin-top: 16px;
      @include block-preload(14px, 100px);
    }
  }

  &-options-row {
    display: grid;
    grid-template: 1fr / 5% 65% 30%;
    column-gap: 8px;

    &:not(:last-child) {
      margin-bottom: 32px;
    }
  }

  &-options {
    &__name {
      @include block-preload(10px, 150px);
      margin-left: 16px;
      position: relative;
    }

    &__circle {
      @include block-preload(16px, 16px);
      border-radius: 50%;
      margin-top: -3px;
    }

    &__value {
      @include block-preload(10px, 80px);
    }
  }

  &__title {
    @include block-preload(18px, 300px);
    margin: 30px 0;
  }
}

.ml-separate {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 20px 0 16px;
}


.preload-filter {
  @include block-preload(auto, 100%);
  padding: 28px 100px 56px;
}

.mf__title {
  @include block-preload-dark(14px, 250px);
  margin-bottom: 24px;
}

.mf-selects-label {
  @include block-preload-dark(10px, 150px);
  margin-bottom: 16px;
}

.mf-select {
  @include block-preload-dark(42px, 230px);
}

.mf-color {
  @include block-preload-dark(60px, 100%);
}

.mf-color-title {
  @include block-preload-dark(10px, 100px);
  margin-top: 48px;
  margin-bottom: 24px;
}

.mf-bottom-extend-text {
  @include block-preload-dark(14px, 250px);
}

.mf-selects {
  display: grid;
  grid-template: 1fr / 1fr 1fr 1fr;
  max-width: 750px;
  column-gap: 24px;
}

.mf-colors {
  display: grid;
  grid-template: auto / repeat(10, 150px);
  column-gap: 24px;
}

.mf-bottom {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.btn-group {
  width: 100%;
  max-width: 490px;
  display: flex;
  justify-content: space-between;
}

.filter-btn {
  @include block-preload-dark(58px, 229px);
}

.btn {
  @include block-preload(52px, 100%);
  margin-top: 32px;
}

.c-preload,
.c-preload--big {
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: -250px;
    top: 0;
    height: 100%;
    background: linear-gradient(to right, transparent 0%, #f5eee7 50%, transparent 100%);
    animation: load 1s ease-in-out infinite;
    opacity: .7;
  }
}

.c-preload:before {
  width: 60px;
}

.c-preload--big:before {
  width: 80%;
}

@keyframes load {
  from {
    left: -250px;
  }
  to {
    left: 100%;
  }
}

@media (max-width: 1440px) {
  .ml-car-wrap {
    grid-template: auto/1fr 1fr 1fr;
    column-gap: 1%;
  }
}
@media (max-width: 1120px) {
  .ml-car-wrap {
    grid-template: auto/1fr 1fr;
  }
}
@media (max-width: 1024px) {
  .ml-car-wrap[data-v-57dafa14] {
    grid-template: auto/1fr 1fr;
  }
  .mf-bottom {
    display: block;
  }
  .mf-bottom-extend-text {
    margin-bottom: 30px;
  }

  .mf-colors {
    grid-template: auto/repeat(3, 150px);
  }
  .mf-selects {
    grid-template: 1fr/1fr 1fr;
  }
  .select-wrap {
    margin-bottom: 24px;
  }
}

@media (max-width: 767px) {
  .preload-filter{
    padding: 26px 10px;
  }
  .ml-car-wrap,
  .mf-selects,
  .btn-group {
    display: block;
  }
  .mf-colors{
    grid-template: auto/repeat(3, 25%);
  }
  .color-wrap{
    margin-bottom: 16px;
  }
  .filter-btn {
    width: 100%;
  }
  .ml-car-options {
    &__value {
      @include block-preload(10px, 100%);
    }

    &__name {
      @include block-preload(10px, 70%);
    }

    &-row {
      grid-template: auto / 5% 65% auto;
    }
  }
  .filter-btn {
    margin-bottom: 24px;
  }
}
</style>
