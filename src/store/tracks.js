import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { fetchAll } from "./actions";
import AccentorApi from "../api";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import { randomSort } from "../lib/comparators";
import { usePlaysStore } from "./plays";

const RANDOM_SEED_MAX = 10_000;

export const useTracksStore = defineStore("tracks", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const playsStore = usePlaysStore();

  const startLoading = ref(new Date(0));
  const tracks = ref({});
  const randomSeed = ref(Math.round(Math.random() * RANDOM_SEED_MAX));
  const allTracks = computed(() => Object.values(tracks.value));

  const tracksOver30s = computed(() =>
    allTracks.value.filter((track) => track.length > 30),
  );
  const randomTracks = computed(() =>
    randomSort(tracksOver30s.value, randomSeed.value),
  );
  const tracksPlayedOnce = computed(() =>
    randomTracks.value.filter((t) => playsStore.playedTrackIds.includes(t.id)),
  );
  const tracksWeightedForPlayCount = computed(() => {
    const trackIds = randomSort(
      Object.values(playsStore.plays),
      randomSeed.value,
    ).map((play) => play.track_id);
    const used = new Set();
    const result = [];
    for (let id of trackIds) {
      if (!used.has(id) && tracks.value[`${id}`]) {
        used.add(id);
        if (tracks.value[`${id}`].length > 30) {
          result.push(tracks.value[`${id}`]);
        }
      }
    }
    return result;
  });

  function refreshRandomSeed() {
    randomSeed.value = Math.round(Math.random() * RANDOM_SEED_MAX);
  }

  function setTracks(payload) {
    const newTracks = {};
    for (let id in tracks.value) {
      newTracks[id] = tracks.value[id];
    }
    const loaded = new Date();
    for (let track of payload) {
      track.loaded = loaded;
      newTracks[track.id] = track;
    }
    tracks.value = newTracks;
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeOld() {
    const newTracks = {};
    for (let id in tracks.value) {
      if (tracks.value[id].loaded > startLoading.value) {
        newTracks[id] = tracks.value[id];
      }
    }
    tracks.value = newTracks;
  }

  async function index() {
    const generator = AccentorApi.tracks.index(authStore.apiToken);
    try {
      await fetchAll(generator, setTracks, setStartLoading, removeOld);
      return true;
    } catch (error) {
      errorsStore.addError(error);
      return false;
    }
  }

  return {
    tracks,
    index,
    allTracks,
    randomTracks,
    tracksPlayedOnce,
    tracksWeightedForPlayCount,
    refreshRandomSeed,
  };
});
