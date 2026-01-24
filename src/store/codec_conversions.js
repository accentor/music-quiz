import { defineStore } from "pinia";
import { computed, markRaw, ref } from "vue";
import { useAuthStore } from "./auth";
import AccentorApi from "../api";
import { fetchAll } from "./actions";
import { useErrorsStore } from "./errors";

export const useCodecConversionsStore = defineStore("codecConversions", () => {
  const authStore = useAuthStore();
  const errorsStore = useErrorsStore();

  const codecConversions = ref({});
  const startLoading = ref(new Date(0));

  function setCodecConversions(payload) {
    const newCodecConversions = {};
    for (let id in codecConversions.value) {
      newCodecConversions[id] = codecConversions.value[id];
    }
    const loaded = new Date();
    for (let obj of payload) {
      obj.loaded = loaded;
      newCodecConversions[obj.id] = obj;
    }
    codecConversions.value = markRaw(newCodecConversions);
  }

  function setStartLoading() {
    startLoading.value = new Date();
  }

  function removeOld() {
    const newCodecConversions = {};
    for (let id in codecConversions.value) {
      if (codecConversions.value[id].loaded > startLoading.value) {
        newCodecConversions[id] = codecConversions.value[id];
      }
    }
    codecConversions.value = markRaw(newCodecConversions);
  }

  const sortedCodecConversions = computed(() => {
    return Object.values(codecConversions.value).sort(
      (cc1, cc2) => cc1.id - cc2.id,
    );
  });

  async function index() {
    const generator = AccentorApi.codecConversions.index(authStore.apiToken);
    try {
      await fetchAll(
        generator,
        setCodecConversions,
        setStartLoading,
        removeOld,
      );
      return true;
    } catch (error) {
      errorsStore.addError(error);
    }
  }

  return {
    codecConversions,
    sortedCodecConversions,
    setStartLoading,
    index,
  };
});
