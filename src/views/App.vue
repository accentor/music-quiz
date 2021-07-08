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
      await store.dispatch("codec_conversions/index");
      await store.dispatch("tracks/index");
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
