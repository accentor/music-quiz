import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { fetchAll } from "./actions";
import AccentorApi from "../api";
import { useErrorsStore } from "./errors";
import { useAuthStore } from "./auth";
import { randomSort } from "../lib/comparators";
import { usePlaysStore } from "./plays";

export const useTracksStore = defineStore("tracks", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();
  const playsStore = usePlaysStore();

  const startLoading = ref(new Date(0));
  const tracks = ref({});
  const allTracks = computed(() => Object.values(tracks.value));

  const tracksOver30s = computed(() =>
    allTracks.value.filter((track) => track.length > 30)
  );
  const randomTracks = computed(() => randomSort(tracksOver30s.value));
  const tracksWithoutReviewComment = computed(() =>
    randomTracks.value.filter((t) => t.review_comment === null)
  );
  const tracksPlayedOnce = computed(() =>
    tracksWithoutReviewComment.value.filter((t) =>
      playsStore.playedTrackIds.includes(t.id)
    )
  );

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
    tracksWithoutReviewComment,
    tracksPlayedOnce,
  };
});
