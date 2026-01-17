<template>
  <RouterView v-if="enoughTracks"></RouterView>
  <LoadingScreen v-else />
</template>

<script>
import { computed } from "vue";
import LoadingScreen from "../components/LoadingScreen.vue";
import { useCodecConversionsStore } from "../store/codec_conversions";
import { usePlaysStore } from "../store/plays";
import { useTracksStore } from "../store/tracks";

export default {
  name: "App",
  components: {
    LoadingScreen,
  },
  setup() {
    const codecConversionsStore = useCodecConversionsStore();
    const playsStore = usePlaysStore();
    const tracksStore = useTracksStore();

    async function loadData() {
      const pendingPromises = [];
      pendingPromises.push(codecConversionsStore.index());
      pendingPromises.push(playsStore.index());
      pendingPromises.push(tracksStore.index());
      await Promise.all(pendingPromises);
    }

    loadData();

    const enoughTracks = computed(() => tracksStore.allTracks.length > 100);

    return {
      enoughTracks,
    };
  },
};
</script>
