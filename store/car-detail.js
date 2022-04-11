import Vue from "vue";

export const state = () => ({
  car: {}
})

export const actions = {
  async fetchData(ctx, carId) {
    let dataCars = {};

    try {
      const response = await fetch(Vue.prototype.$requestUrl + '?data=car-detail&id=' + carId)
        .catch(() => dataCars.error = true);

      dataCars = await response.json();

      if (!dataCars.status || dataCars.status !== "success") dataCars.error = true;

    } catch (e) {
      dataCars.error = true
    }

    ctx.commit('setData', dataCars);
  }
}

export const mutations = {
  setData(state, data) {
    state.car = data;
  }
}

