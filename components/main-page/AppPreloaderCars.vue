<template>
  <div class="car-list">

    <div class="car-item" v-for="i in 8" :key="i">
      <div class="car-item__title c-preload"></div>
      <div class="car-item__price c-preload"></div>
      <div class="car-item__img c-preload--big"></div>
      <a class="btn-link c-preload--big" href="#" @click.prevent></a>
      <div class="wrap-credit c-preload">
        <span class="credit__text"></span>
        <span class="credit__price"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppPreloaderCars"
}
</script>

<style scoped lang="scss">
$bgColor: #E4DCD3;

@mixin block-preload($height, $width) {
  height: $height;
  width: $width;
  background-color: $bgColor;
}

.car-list {
  margin-top: 32px;
  display: grid;
  grid-template: auto / 1fr 1fr 1fr 1fr;
  grid-column-gap: 32px;

}
.car-item {
  padding: 28px 32px;
  border: 1px solid #E4DCD3;
  margin-bottom: 32px;

  &__title {
    @include block-preload(10px, 150px);
    margin-bottom: 5px;
  }

  &__price {
    @include block-preload(8px, 100px);
  }

  &__img {
    @include block-preload(164px, 100%);
    margin: 16px 0;
  }
}

.wrap-credit {
  @include block-preload(8px, 100px);

  margin-top: 12px;
}

.btn-link {
  display: block;
  @include block-preload(48px, 292px);
  background-color: #E4DCD3;
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
@media (max-width: 1280px) {
  .car-list {
    grid-template: auto / 1fr 1fr 1fr;
  }
}

@media (max-width: 991px) {
  .car-list {
    grid-template: auto / 1fr 1fr;
  }
}


@media (max-width: 767px) {
  .btn-link {
    @include block-preload(48px, 100%);
  }
  .car-list {
    grid-template: auto / 1fr;
  }
}
</style>
