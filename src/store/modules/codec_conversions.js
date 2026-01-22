import AccentorApi from "../../api";
import { fetchAll } from "../actions";

export default {
  namespaced: true,
  state: {
    codecConversions: {},
    startLoading: new Date(0),
  },
  mutations: {
    setCodecConversions(state, payload) {
      const oldCodecConversions = state.codecConversions;
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        state.codecConversions[id] = oldCodecConversions[id];
      }
      const loaded = new Date();
      for (let obj of payload) {
        obj.loaded = loaded;
        state.codecConversions[obj.id] = obj;
      }
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeOld(state) {
      const oldCodecConversions = state.codecConversions;
      state.codecConversions = {};
      for (let id in oldCodecConversions) {
        if (oldCodecConversions[id].loaded > state.startLoading) {
          state.codecConversions[id] = oldCodecConversions[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = AccentorApi.codecConversions.index(
        rootState.auth.apiToken
      );
      try {
        await fetchAll(commit, generator, "setCodecConversions");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    codecConversions: (state) =>
      Object.values(state.codecConversions).sort((cc1, cc2) => cc1.id - cc2.id),
  },
};
