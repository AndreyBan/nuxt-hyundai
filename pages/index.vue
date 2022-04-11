<template>
  <div>
    <div class="container">
      <AppBreadcrumbs/>
      <div v-show="!showPreloadModels">
        <section class="section-filter">
          <AppTypeCar @type="getType"/>
        </section>
        <AppCarList :type="filterType"
                    v-if="!error"
        />
        <AppError v-else/>
      </div>
      <AppPreload v-if="showPreloadModels"/>
    </div>
    <client-only>
      <AppFormRequest/>
    </client-only>
  </div>
</template>

<script>
import AppTypeCar from "../components/main-page/AppTypeCar";
import AppCarList from "../components/main-page/AppCarList";
import AppBreadcrumbs from "../components/AppBreadcrumbs";
import AppFormRequest from "../components/AppFormRequest";
import AppPreload from "../components/model/AppPreload";
import AppError from "../components/AppError";

export default {
  layout: 'hyundai',
  name: "index",
  async asyncData({store}) {
    if (!store.state["cars-info"]["cars"]["status"]) {
      await store.dispatch('cars-info/fetchData');
    }
  },
  meta: {
    keepComponents: ['index', 'model']
  },
  data() {
    return {
      filterType: "",
      showPreloadModels: false,
      error: this.$store.state['cars-info'].cars.error ? this.$store.state['cars-info'].cars.error : false,
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => vm.showPreloadModels = false)
  },
  beforeRouteLeave(to, from, next) {
   if (to.name === 'model') {
     this.showPreloadModels = true;
     to.meta.refresh = true;
     to.meta.keepComponents = ['index', 'model'];
   }
    next();
  },
  components: {
    AppFormRequest,
    AppTypeCar,
    AppCarList,
    AppBreadcrumbs,
    AppPreload,
    AppError
  },
  methods: {
    getType(data) {
      this.filterType = data;
    }
  }
}
</script>

<style scoped lang="scss">
.section-filter {
  padding: 42px 130px 42px 100px;
  box-shadow: 0 0 10px rgba(0, 52, 105, 0.1);
  display: flex;
  justify-content: space-between;
}

@media (max-width: 1024px) {
  .section-filter {
    padding: 32px 50px 44px;
    flex-direction: column;
  }
}

@media (max-width: 767px) {
  .section-filter {
    padding: 16px 18px 28px;
    flex-direction: column;
  }
}
</style>
