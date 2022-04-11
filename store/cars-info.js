import Vue from "vue";

export const state = () => ({
  cars: {}
})

export const actions = {
  async fetchData(ctx) {
    let dataCars = {};

    try {
      const response = await fetch(Vue.prototype.$requestUrl + '?data=model-list')
        .catch(() => {
          dataCars.error = true;
        })

      dataCars = await response.json();
      dataCars["data"][0]["models"].sort((a, b) => a["min_price"] - b["min_price"]);

      if (!dataCars.status || dataCars.status !== "success") dataCars.error = true;
    } catch (e) {
      dataCars.error = true
    }

    ctx.commit('setData', dataCars);
  }
}

export const mutations = {
  setData(state, data) {
    state.cars = data;
  }
}

