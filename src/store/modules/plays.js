import AccentorApi from "../../api";
import { fetchAll } from "../actions";

export default {
  namespaced: true,
  state: {
    plays: {},
    startLoading: new Date(0),
  },
  mutations: {
    setPlays(state, payload) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        state.plays[id] = oldPlays[id];
      }
      for (let play of payload) {
        state.plays[play.id] = play;
      }
    },
    setPlay(state, { id, play }) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        state.plays[id] = oldPlays[id];
      }
      play.loaded = new Date();
      state.plays[id] = play;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeOld(state) {
      const oldPlays = state.plays;
      state.plays = {};
      for (let id in oldPlays) {
        if (oldPlays[id].loaded > state.startLoading) {
          state.plays[id] = oldPlays[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = AccentorApi.plays.index(rootState.auth);
      try {
        await this.playsRestored;
        await fetchAll(commit, generator, "setPlays");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    plays: (state) => Object.values(state.plays),
    playedTracks: (state, getters) => [
      ...new Set(getters.plays.map((t) => t.track_id)),
    ],
  },
};
