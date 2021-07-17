<template>
  <router-view v-if="enoughTracks"></router-view>
  <LoadingScreen v-else />
</template>

<script>
import { computed } from "@vue/runtime-core";
import { useStore } from "vuex";
import LoadingScreen from "../components/LoadingScreen.vue";
export default {
  name: "App",
  components: {
    LoadingScreen,
  },
  setup() {
    const store = useStore();

    async function loadData() {
      const pendingPromises = [];
      pendingPromises.push(store.dispatch("codec_conversions/index"));
      pendingPromises.push(store.dispatch("plays/index"));
      pendingPromises.push(store.dispatch("tracks/index"));
      await Promise.all(pendingPromises);
    }

    loadData();

    const enoughTracks = computed(
      () => store.getters["tracks/tracks"].length > 100
    );

    return {
      enoughTracks,
    };
  },
};
</script>

<style></style>
