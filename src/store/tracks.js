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
    // Assuming that the random sort distributes the plays evenly, track ids
    // that occur more often will have a higher chance of ending up early in the
    // randomized list. At the end we make the tracks unique again, preserving
    // the property of tracks that are played more often ending up early in the
    // list.
    const trackIds = randomSort(
      Object.values(playsStore.plays).filter(
        (p) => (tracks.value[`${p.track_id}`].length ?? 0) > 30,
      ),
      randomSeed.value,
    ).map((play) => play.track_id);
    const used = new Set();
    const result = [];
    let index = 0;
    while (index < trackIds.length && used.size < 100) {
      const id = trackIds[index];
      if (!used.has(id)) {
        used.add(id);
        result.push(tracks.value[`${id}`]);
      }
      index++;
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
