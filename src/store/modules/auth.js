import AccentorApi from "../../api";

export default {
  namespaced: true,
  state: {
    device_id: null,
    secret: null,
    user_id: null,
    id: null,
  },
  mutations: {
    login(state, payload) {
      state.device_id = payload.device_id;
      state.secret = payload.secret;
      state.user_id = payload.user_id;
      state.id = payload.id;
    },
    logout(state) {
      state.device_id = null;
      state.secret = null;
      state.user_id = null;
      state.id = null;
    },
    removeAuthToken(state, id) {
      delete state.authTokens[id];
    },
  },
  actions: {
    async login({ commit }, data) {
      try {
        const result = await AccentorApi.authTokens.create(data);
        commit("login", result);
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
    async logout({ commit, state }) {
      try {
        await AccentorApi.authTokens.destroy(state, state.id);
        commit("logout");
        return true;
      } catch (error) {
        commit("addError", error, { root: true });
        return false;
      }
    },
  },
  getters: {
    loggedIn: (state) => {
      return state.secret !== null && state.device_id !== null;
    },
    currentSession: (state) => {
      return state.id;
    },
    currentUser: (state, getters, rootState) => {
      return rootState.users.users[state.user_id];
    },
  },
};
