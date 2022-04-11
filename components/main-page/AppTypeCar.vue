<template>
  <ul class="filter-tabs">
    <li v-for="(elem, i) in tabList" :key="i" class="filter-tabs__item" :class="{'active' : elem.active}" ref="tab"
        @click="setActive(elem)">
      {{ elem.name }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'AppTypeCar',
  data: () => ({
    tabList: {
      allModel: {
        name: "Все модели",
        value: "",
        active: true
      },
      cities: {
        name: "Городские",
        value: "седан",
        active: false
      },
      crossovers: {
        name: "Кроссоверы",
        value: "кроссовер",
        active: false
      },
      minibus: {
        name: "Микроавтобусы",
        value: "микроавтобус",
        active: false
      },
    }
  }),
  methods: {
    setActive(el) {
      let tabs = this.tabList;

      for (let i in tabs) {
        tabs[i].active = false;
      }

      el.active = true;

      this.$emit('type', el.value)
    },
  }
}
</script>

<style scoped>
.filter-tabs {
  padding: 0;
  margin: 0;
}

.filter-tabs__item {
  display: inline-block;
  padding: 14px 20px;
  color: #000;
  cursor: pointer;
}

.filter-tabs__item.active {
  color: #fff;
  background-color: #97847A;
}

@media (max-width: 1024px) {
  .filter-tabs {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
}

@media (max-width: 767px) {
  .filter-tabs {
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
  }

  .filter-tabs__item {
    padding: 14px 0;
    width: 50%;
    text-align: center;
  }
}
</style>
