<template>
  <section class="model-filter">
    <div class="model-filter__img" :style="{backgroundImage: `url('${modelImage}')`}"></div>
    <div class="mf__title">Выбрать автомобиль</div>
    <div class="mf-selects">
      <div class="select-wrap">
        <v-select placeholder="Не выбрана"
                  v-model.lazy="changedFilterList.configuration_name"
                  :options="filterList.configuration_name"
                  @input="sendFilter"
                  :selectable="option => getVisibleValues(option, 'configuration_name')"
        >
          <template #header>
            <div class="select-title">Комплектация</div>
          </template>
          <template #no-options>
            Ничего не найдено
          </template>
        </v-select>
      </div>

      <div class="select-wrap">
        <v-select placeholder="Не выбран"
                  v-model.lazy="changedFilterList.engine_volume"
                  :options="filterList.engine_volume"
                  :searchable="false"
                  @input="sendFilter"
                  :selectable="option => getVisibleValues(option, 'engine_volume')"
        >
          <template #header>
            <div class="select-title">Объем двигателя</div>
          </template>
          <template #no-options>
            Ничего не найдено
          </template>
        </v-select>
      </div>
      <div class="select-wrap" v-if="allCars.length > 1 && !hidePrice">
        <AppPriceRange :min-price="this.minPrice" :max-price="this.maxPrice" @up-price="getPrice"
                       :reset="reset"/>
      </div>
      <div class="select-wrap">
        <v-select placeholder="Не выбран"
                  v-model.lazy="changedFilterList.transmission"
                  :searchable="false"
                  :options="filterList.transmission"
                  @input="sendFilter"
                  :selectable="option => getVisibleValues(option, 'transmission')"
        >
          <template #header>
            <div class="select-title">Тип КПП</div>
          </template>
          <template #no-options>
            Ничего не найдено
          </template>
        </v-select>
      </div>
    </div>
    <AppFilterColors :colors="filterList.colors"
                     @reset-color="reset = false"
                     :reset="reset"
                     @send-color="getColors"
    />

    <div class="mf-bottom">
      <div class="block-left">
        <div class="extra-options__toggle"
             :class="{'open': extraOptions}"
             @click="extraOptions = !extraOptions"
        >
          Дополнительные параметры
        </div>

        <div class="extra-options-content">
          <div class="extra-options-fields">
            <div class="block-years">
              <div class="extra-options__title">Год выпуска</div>
              <div class="check-wrap">
                <div class="check-group"
                     v-for="(el, i) in filterList.year_of_manufacture"
                     :key="i"
                     :class="{'not-access': !el.visible}"
                >
                  <input type="checkbox"
                         name="year"
                         :id="'year-' + i"
                         v-model.lazy="changedFilterList['year_of_manufacture']"
                         :value="el.value"
                         @change="sendFilter">
                  <label :for="'year-' + i">{{ el.value }}</label>
                </div>
              </div>
            </div>
            <div class="select-wrap">
              <v-select placeholder="Не выбран"
                        :searchable="false"
                        v-model.lazy="changedFilterList.engine_power"
                        :options="filterList.engine_power"
                        @input="sendFilter"
                        :selectable="option => getVisibleValues(option, 'engine_power')"
              >
                <template #header>
                  <div class="select-title">Мощность двигателя</div>
                </template>
                <template #no-options>
                  Ничего не найдено
                </template>
              </v-select>
            </div>
            <div class="select-wrap">
              <v-select placeholder="Не выбран"
                        :searchable="false"
                        v-model.lazy="changedFilterList.gear_type"
                        :options="filterList.gear_type"
                        @input="sendFilter"
                        :selectable="option => getVisibleValues(option, 'gear_type')"
              >
                <template #header>
                  <div class="select-title">Тип привода</div>
                </template>
                <template #no-options>
                  Ничего не найдено
                </template>
              </v-select>
            </div>
          </div>
        </div>
      </div>
      <div class="block-right">
        <a href="#" class="btn btn--blue-dark" @click.prevent="scrollToCars">найдено {{ count }} авто</a>
        <div class="btn btn--blue-dark btn-icon btn-icon-reset" @click="resetFilter">сбросить фильтр</div>
      </div>
    </div>
  </section>
</template>

<script>
import AppFilterColors from "./filter/AppFilterColors";
import AppPriceRange from "./filter/AppPriceRange";
import {mixinFilterProp, mixinScrollToCars} from "/mixins/AppMixins";

export default {
  name: "AppFilter",
  props: {
    cars: {
      type: Array,
      required: true
    },
    count: {
      type: Number,
      default: 0,
      required: true
    },
    modelImage: {
      type: String,
      default: ""
    },
    hidePrice: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  mixins: [mixinFilterProp, mixinScrollToCars],
  components: {
    AppFilterColors,
    AppPriceRange
  },
  data() {
    return {
      allCars: this.cars,
      extraOptions: false,
      filterList: {},
      changedFilterList: this.getEmptyFilterList(),
      reset: false,
      excludeProperty: ""
    }
  },
  methods: {
    getProperty(filter, car, prop) {
      if (!filter[prop].includes(car[prop])) {
        filter[prop].push(car[prop]);
      }

      return filter;
    },

    // Получаем список видимых значений свойства
    getVisibleValues(option, property) {
      let updateList = this.updateFilterList[property];
      if (updateList.length === 1) {
        this.changedFilterList[property] = updateList[0];
      }

      return updateList ? updateList.includes(option) : true
    },

    // Сброс фильтра
    resetFilter() {
      this.changedFilterList = this.getEmptyFilterList();
      this.reset = true;
      this.setVisibility(this.filterList);
      this.sendFilter();
    },

    // Пустой список значений свойств
    getEmptyFilterList() {
      return {
        configuration_name: "",
        engine_volume: "",
        transmission: "",
        colors: [],
        year_of_manufacture: [],
        engine_power: "",
        gear_type: "",
        price: {
          priceMin: this.minPrice,
          priceMax: this.maxPrice
        }
      }
    },

    // Получение уникальных значений цвета автомобилей
    getUniqueColors(colors) {
      return colors.reduce((acc, elem) => {
        if (acc.values[elem.value]) return acc;

        acc.values[elem.value] = true;
        acc.colors.push(
            {
              name: elem.name,
              value: elem.value,
              visible: true
            }
        )

        return acc;
      }, {values: [], colors: []}).colors
    },

    // Получяем выбранные в фильтре цвета
    getColors(filterColors) {
      this.$set(this.changedFilterList, "colors", filterColors)
      this.sendFilter();
    },

    /**
     * Сортировка значений фильтра по возрастанию
     *
     * @param filter
     * @returns {*}
     */
    sortFilter(filter) {
      for (let j in filter) {
        if (["engine_volume", "year_of_manufacture", "engine_power"].includes(j)) {
          filter[j].sort((a, b) => a - b);
        }
      }

      return filter;
    },

    /**
     *  Получаем уникальные значения свойств для фильтра
     *
     * @param cars
     * @returns {{engine_power: *[], transmission: *[], engine_volume: *[], year_of_manufacture: *[], colors: *[], configuration_name: *[], gear_type: *[]}}
     */
    getUniqueProperties(cars) {
      let filter = this.fillProperties(cars);

      // Добавляем годам признак активности (видимости)
      for (let k in filter.year_of_manufacture) {
        filter.year_of_manufacture[k] = {
          value: filter.year_of_manufacture[k],
          visible: true
        }
      }

      return filter;
    },

    // Заполнение свойств значениями
    fillProperties(cars) {
      let filter = {
        configuration_name: [],
        engine_volume: [],
        transmission: [],
        year_of_manufacture: [],
        engine_power: [],
        gear_type: [],
        colors: []
      };

      for (let i in cars) {
        let car = cars[i];
        // Заполняем свойства кроме цвета
        for (let j in filter) {
          if (j !== 'colors') {
            filter = this.getProperty(filter, car, j);
          }
        }

        // Заполняем цвета
        if (car["color"]) {
          filter["colors"].push(
              {
                name: car["color"]["name"],
                value: car["color"]["value"],
              }
          );
        }
      }

      return filter;
    },

    // Отправка фильтра в родительский компонент
    sendFilter() {
      this.$emit('get-cars', this.changedFilterList);
      this.setVisibility(this.updateFilterList);
      this.excludeProperty = "";
    },

    // Установка видимости свойствам цвета и года
    setVisibility(filterList) {
      let colors = filterList.colors.map(el => el.name);
      let years = filterList.year_of_manufacture.map(el => el.value);

      this.filterList.colors.forEach(el => {
        el.visible = !(colors && !colors.includes(el.name));
      })

      this.filterList.year_of_manufacture.forEach(el => {
        el.visible = !(years && !years.includes(el.value));
      })
    },

    setExcludeProperty(value) {
      this.excludeProperty = value;
    },
    getPrice(price) {
      this.changedFilterList["price"]["priceMin"] = price.priceMin;
      this.changedFilterList["price"]["priceMax"] = price.priceMax;
      this.sendFilter();
    }
  },
  computed: {
    minPrice() {
      return this.cars[0]["price"]
    },
    maxPrice() {
      let cars = this.cars;

      return cars[cars.length - 1]["price"];
    },
    getFilterData() {
      let cars = this.carList;
      let filter = null;

      if (cars) {
        filter = this.getUniqueProperties(cars);

        if (filter) {
          filter["colors"] = this.getUniqueColors(filter["colors"]);
          filter = this.sortFilter(filter);
        }

        filter["price"] = {
          priceMin: this.minPrice,
          priceMax: this.maxPrice
        }
      }

      return filter;
    },

    // Получение обновленного списка значений свойтсв
    updateFilterList() {
      let updateFilterList = this.getFilterData;
      let filter = this.changedFilterList;

      for (let i in filter) {
        if (filter[i]) {
          this.setExcludeProperty(i);
          updateFilterList[i] = this.getFilterData[i];
        }
      }

      return updateFilterList;
    },

    carList() {
      let cars = this.allCars;
      let filter = this.changedFilterList;
      let excludeProp = this.excludeProperty;
      let {colors, year_of_manufacture, price} = filter;

      return cars.filter(el => {
        for (let i in filter) {
          if (!["colors", "year_of_manufacture", "price", excludeProp].includes(i)) {
            if (filter[i] && !filter[i].includes(el[i])) return false;
          }
        }

        if (excludeProp !== "price") {
          if (el["price"] > price.priceMax || el["price"] < price.priceMin) {
            return false;
          }
        }

        if (excludeProp === "colors") {
          return this.filterProp(el["year_of_manufacture"], year_of_manufacture);

        } else if (excludeProp === "year_of_manufacture") {
          return this.filterProp(el["color"], colors);

        } else {
          return !(!this.filterProp(el["year_of_manufacture"], year_of_manufacture)
              || !this.filterProp(el["color"], colors));
        }

      })
    },
  },

  mounted() {
    this.filterList = this.getFilterData;
  }
}
</script>


<style scoped lang="scss">

.btn.btn-icon {
  padding-left: 32px;
  position: relative;
}

.btn-icon-reset:before {
  content: '';
  position: absolute;
  background: url("/images/instock/reset-icon.svg") 0 0 no-repeat;
  left: 29px;
  top: 20px;
  width: 15px;
  height: 18px;
  background-size: 15px;
}

.extra-options-content {
  display: none;
}

.extra-options__toggle.open + .extra-options-content {
  display: block;
}

.model-filter {
  background-color: #EBEBEB;
  padding: 28px 100px 56px;
}

.mf__title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 24px;
}

.mf-selects {
  display: flex;
  max-width: 751px;
  justify-content: space-between;
  flex-wrap: wrap;
}

.select-title {
  font-size: 14px;
  margin-bottom: 14px;
  color: #000000;
}

.extra-options {
  &__title {
    font-size: 14px;
    margin-bottom: 16px;
    color: #666666;
  }

  &-fields {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__toggle {
    color: #003469;
    margin-bottom: 30px;
    position: relative;
    font-weight: 500;
    padding-right: 16px;
    line-height: 1.17;
    display: inline-block;
    cursor: pointer;

    &:before {
      content: '';
      position: absolute;
      background: url("/images/instock/arrow-down.svg") 0 0 no-repeat;
      width: 9px;
      height: 5px;
      background-size: 9px;
      right: 0;
      top: 7px;
      transition-duration: .2s;
    }

    .open:before {
      transform: rotate(180deg);
    }
  }
}

.check-wrap {
  display: flex;
  flex-wrap: wrap;
}

.block-years {
  width: 229px;
}

.mf-bottom {
  display: flex;
}

.check-group {
  &.not-access {
    opacity: .3;
    pointer-events: none;
  }

  input {
    display: none;

    & + label {
      display: inline;
      position: relative;
      padding-left: 28px;
      padding-top: 2px;
      cursor: pointer;

      &:before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid #B7B4B4;
        left: 0;
        top: 0;
      }
    }

    &:checked + label:after {
      content: '';
      position: absolute;
      width: 16px;
      height: 12px;
      background: url("/images/instock/blue-check.svg") 0 0 no-repeat;
      left: 3px;
      top: 4px;
    }
  }

  &:not(:last-child) {
    margin-right: 20px;
  }
}

.block-left {
  max-width: 751px;
  width: 100%;
  padding-bottom: 5px;
}

.btn {
  display: block;
  padding: 17px 0;
  width: 229px;
  text-align: center;
  text-transform: uppercase;
  color: #ffffff;
  cursor: pointer;
  border: none;
  justify-self: end;
  border-radius: 0;
  font-size: 16px;
  text-decoration: none;

  &:not(:last-child) {
    margin-right: 32px;
  }
}

.block-right {
  display: flex;
  align-self: end;
  margin-left: 65px;
}

.model-filter {
  position: relative;
  background: url("/images/instock/filter-bg.jpg") 0 0 no-repeat;
  background-size: cover;
}

.model-filter__img {
  position: absolute;
  right: 0;
  top: 0;
  background-size: cover;
  background-position: 0 50%;
  background-repeat: no-repeat;
  width: 604px;
  height: 260px;
}

@media (max-width: 1560px) {


  .mf-bottom {
    flex-direction: column;
  }

  .block-right {
    align-self: start;
    margin-left: 0;
  }

  .extra-options-fields .select-wrap {
    margin-bottom: 32px;
  }

}

@media (max-width: 1388px) {
  .model-filter__img {
    top: 100px;
    width: 40%;
  }
}

@media (max-width: 1024px) {
  .block-left {
    padding-bottom: 0;
  }

  .model-filter {
    padding: 28px 50px;

    .select-wrap {
      width: 100%;
      max-width: 233px;
      margin-right: 8px;
      margin-bottom: 32px;
    }
  }
  .mf-selects {
    justify-content: start;
    max-width: 75%;
  }

  .extra-options-fields {
    justify-content: start;
  }

  .block-years {
    width: auto;
    margin-right: 28px;
  }
}

@media (max-width: 991px) {
  .range-slider-wrap {
    margin-top: 0;
  }
  .mf-selects {
    justify-content: start;
    max-width: 82%;
  }

  .mf-colors {
    margin-top: 0;
  }

  .extra-options-fields .select-wrap {
    max-width: 166px;
  }

  .model-filter .extra-options-fields .select-wrap {
    margin-right: 20px;
  }
}

@media (max-width: 767px) {
  .model-filter__img {
    display: none;
  }
  .model-filter .select-wrap {
    margin-right: 0;
  }
  .colors-wrap {
    margin-left: -10px;
    margin-right: -10px;
  }

  .model-filter {
    padding: 26px 10px;
    margin-left: -16px;
    margin-right: -16px;

    background: url("/images/instock/filter-bg-mobile.jpg") 0 0 no-repeat;
    background-size: cover;
  }

  .mf-selects,
  .mf-colors,
  .model-filter .select-wrap {
    max-width: 100%;
  }

  .model-filter .select-wrap {
    margin-bottom: 24px;
  }

  .colors-item:not(:last-child) {
    margin-right: 10px;
  }

  .colors-item {
    margin: 0 10px 26px;
  }

  .block-right {
    flex-direction: column;
    width: 100%;
  }

  .btn--blue-dark {
    width: 100%;
    text-align: center;

    &:not(:last-child) {
      margin-bottom: 26px;
    }
  }

  .extra-options-fields {
    flex-direction: column;
  }

  .block-years {
    margin-right: 0;
    margin-bottom: 24px;
  }
}
</style>
