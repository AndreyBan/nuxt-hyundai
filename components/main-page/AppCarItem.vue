<template>
    <div class="car-item" itemscope itemtype="https://schema.org/Product" v-if="element['body_type'].toLowerCase() === type || !type" @click="routeToModel(element['name_en'])">
      <meta itemprop="brand" content="Hyundai">
      <meta itemprop="model" :content="element['name_en']">
      <meta itemprop="url" :content="$route.fullPath + encodeURI(element['name_en']) + '/'">
      <div class="car-item__title"  itemprop="name">
        {{ element["name_ru"] + " / " + element["name_en"] }}
      </div>
      <div class="car-item__price" itemprop="offers" itemscope itemtype="https://schema.org/Offer" v-if="!hidePrice">
        от <span itemprop="price" :content="element['min_price']">{{ formatPrice(element["min_price"]) }}</span> <span itemprop="priceCurrency" content="RUB">₽</span>
        <link itemprop="availability" href="https://schema.org/InStock" />
      </div>
      <div class="car-item__img">
        <img :src="element['img']" :alt="element['name_en']" itemprop="image" >
      </div>
      <div class="btn-link" > {{ element["instock_count"] }} авто в наличии</div>
      <div class="wrap-credit" v-if="element['credit']">
        <span class="credit__text">В кредит от</span>
        <span class="credit__price">{{ formatPrice(element["credit"]) }} ₽/мес.</span>
      </div>
    </div>
</template>

<script>
import {mixinFormatPrice} from "../../mixins/AppMixins";

export default {
  name: "AppCarItem",
  props: {
    element: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      default: "",
      required: true
    },
    hidePrice: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    routeToModel(modelName){
      this.$router.push({ name: 'model', params: { model: modelName}})
      this.$emit('emit-preload');
    }
  },
  mounted() {
    this.urlHost = location.hostname;
  },
  mixins: [mixinFormatPrice]
}
</script>

<style scoped lang="scss">
.car-item {
  padding: 28px 32px;
  border: 1px solid #E4DCD3;
  margin-bottom: 32px;
  cursor: pointer;

  &__title {
    font-size: 18px;
    text-transform: uppercase;
    font-weight: 500;
    margin-bottom: 5px;
  }

  &__price {
    font-weight: 500;
  }

  &__img {
    width: 100%;
    text-align: center;
    margin: 16px 0;

    img {
      max-width: 100%;
    }
  }
}

.btn-link {
  text-decoration: none;
  display: block;
  text-align: center;
  color: #ffffff;
  background-color: #003469;
  padding: 12px 0;
  transition-duration: .15s;

  &:hover {
    background-color: #0C4F94;
  }
}

.credit__price {
  font-weight: 500;
  color: #003469;
  margin-left: 16px;
}

.wrap-credit {
  margin-top: 12px;
}
</style>
