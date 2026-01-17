import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";
import { fetchAll } from "./actions";
import { useAuthStore } from "./auth";
import { useErrorsStore } from "./errors";
import AccentorApi from "../api";

export const usePlaysStore = defineStore("plays", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const startLoading = ref(new Date(0));
  const plays = ref({});
  const playedTrackIds = computed(() => [
    ...new Set(Object.values(plays.value).map((play) => play.track_id)),
  ]);

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function setPlays(payload) {
    const newPlays = {};
    for (let id in plays.value) {
      newPlays[id] = plays.value[id];
    }
    const loaded = new Date();
    for (let play of payload) {
      play.loaded = loaded;
      newPlays[play.id] = play;
    }
    plays.value = markRaw(newPlays);
  }

  function removeOld() {
    const newPlays = {};
    for (let id in plays.value) {
      if (plays.value[id].loaded > startLoading.value) {
        newPlays[id] = plays.value[id];
      }
    }
    plays.value = markRaw(newPlays);
  }

  async function index() {
    const generator = AccentorApi.plays.index(authStore.apiToken);
    try {
      await fetchAll(generator, setPlays, setStartLoading, removeOld);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  return {
    plays,
    playedTrackIds,
    index,
  };
});
