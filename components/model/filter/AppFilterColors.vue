<template>
  <div class="mf-colors">
    <div class="select-title">Цвет</div>
    <div class="colors-wrap">
      <div class="colors-item" v-for="(el, i) in colors"
           :key="i"
           :class="{'dark' : getShade(el.value), 'not-access': !el.visible}">
        <input type="checkbox" name="color" :id="'color-' + i" :value="el.name" v-model.lazy="colorsFilter" :checked="colorsFilter.includes(el.name)" @change="changeColor">
        <label :for="'color-' + i">
          <span class="colors-item__color" :style="{backgroundColor: el.value}"></span>
          <span class="colors-item__name">{{ el.name }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFilterColors",
  props: ["colors", "reset"],
  data() {
    return {
      colorsFilter: []
    }
  },
  methods: {
    convertColor(color) {
      let rgbColor = {};

      if (color.substring(0, 1) === '#') {
        color = color.substring(1);
      }

      rgbColor.r = parseInt(color.substring(0, 2), 16);
      rgbColor.g = parseInt(color.substring(2, 4), 16);
      rgbColor.b = parseInt(color.substring(4), 16);

      return rgbColor;
    },
    getShade(color) {
      let rgb = this.convertColor(color);
      let hsp = Math.sqrt(0.205 * (rgb.r * rgb.r) + 0.587 * (rgb.g * rgb.g) + 0.114 * (rgb.b * rgb.b))

      return hsp <= 127.5;
    },
    changeColor(){
      this.$emit('send-color', this.colorsFilter);
    }
  },
  watch: {
    reset(){
      if (this.reset){
        this.colorsFilter = [];
        this.$emit('reset-color', false);
        this.changeColor();
      }
    }
  }
}
</script>

<style scoped lang="scss">

.mf-colors {
  margin-top: 28px;
  max-width: 77%;
}

.colors {
  &-wrap {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  &-item {
    position: relative;
    border: 1px solid #B7B7B7;
    margin-bottom: 30px;

    &__color {
      display: inline-block;
      width: 19px;
      height: 19px;
      border-radius: 50%;
      margin-right: 7px;
      position: relative;
      font-size: 14px;
      color: #666666;
    }

    &__name {
      color: #666666;
      font-size: 14px;
    }

    &:not(:last-child) {
      margin-right: 30px;
    }

    input[name=color] {
      display: none;
    }

    input {
      & + label {
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        padding: 16px;
        margin: 0;
      }

      &:checked + label:before {
        content: '';
        position: absolute;
        left: 18px;
        top: calc(50% - 7px);
        width: 16px;
        height: 12px;
        z-index: 1;
        background: url("/images/instock/black-check.svg") 0 0 no-repeat;

      }
    }
    &.dark input:checked + label:before {
      background: url("/images/instock/white-check.svg") 0 0 no-repeat;
    }
    &.not-access{
      opacity: .3;
      pointer-events: none;
    }
  }
}

.select-title {
  font-size: 14px;
  margin-bottom: 14px;
  color: #000000;
}
</style>
