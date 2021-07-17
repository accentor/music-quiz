import AccentorApi from "../../api";
import { fetchAll } from "../actions";
import { randomSort } from "../../lib/comperators";

export default {
  namespaced: true,
  state: {
    tracks: {},
    startLoading: new Date(0),
  },
  mutations: {
    setTracks(state, payload) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let id in oldTracks) {
        state.tracks[id] = oldTracks[id];
      }
      for (let track of payload) {
        state.tracks[track.id] = track;
      }
    },
    setTrack(state, { id, track }) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let id in oldTracks) {
        state.tracks[id] = oldTracks[id];
      }
      track.loaded = new Date();
      state.tracks[id] = track;
    },
    setStartLoading(state) {
      state.startLoading = new Date();
    },
    removeTrack(state, id) {
      delete this.state.tracks[id];
    },
    removeOld(state) {
      const oldTracks = state.tracks;
      state.tracks = {};
      for (let id in oldTracks) {
        if (oldTracks[id].loaded > state.startLoading) {
          state.tracks[id] = oldTracks[id];
        }
      }
    },
  },
  actions: {
    async index({ commit, rootState }) {
      const generator = AccentorApi.tracks.indexGenerator(rootState.auth);
      try {
        await fetchAll(commit, generator, "setTracks");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async read({ commit, rootState }, id) {
      try {
        const track = await AccentorApi.tracks.read(rootState.auth, id);
        commit("setTrack", { id, track });
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    tracks: (state) =>
      Object.values(state.tracks).filter((t) => {
        return t.length > 30;
      }),
    randomTracks: (state, getters) => {
      return randomSort(getters.tracks);
    },
    tracksWithoutReviewComment: (state, getters) => {
      return getters.randomTracks.filter((t) => t.review_comment === null);
    },
    tracksPlayedOnce: (state, getters, rootState, rootGetters) => {
      return getters.tracksWithoutReviewComment.filter((t) =>
        rootGetters["plays/playedTracks"].includes(t.id)
      );
    },
  },
};
