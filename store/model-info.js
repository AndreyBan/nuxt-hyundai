import Vue from "vue";

export const state = () => ({
  models: {}
})

export const actions = {
  async fetchData(ctx, modelId) {
    let res = {};

    try {
      const response = await fetch(Vue.prototype.$requestUrl + '?data=model-cars&model=' + modelId)
        .catch(() => res.error = true);

       res = await response.json();

    } catch (e) {
      res.error = true
    }

    ctx.commit('getModels', res);
  }
}

export const mutations = {
  getModels(state, dataModels) {
    state.models = dataModels;
  }
}
