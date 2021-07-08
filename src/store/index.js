import { createStore } from "vuex";
import codec_conversions from "./modules/codec_conversions";
import tracks from "./modules/tracks";
import games from "./modules/games";
import auth from "./modules/auth";
import { createLogger } from "vuex";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ["auth", "games"],
});

const plugins = [vuexLocal.plugin];

if (import.meta.env.DEV) {
  plugins.push(createLogger());
}

// Create a new store instance.
const store = createStore({
  plugins,
  state: {
    errors: [],
  },
  mutations: {
    addError(state, error) {
      state.errors.push(error);
    },
  },
  modules: {
    auth,
    codec_conversions,
    games,
    tracks,
  },
});

export default store;
