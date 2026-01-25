import { computed, ref, watch, onBeforeUnmount } from "vue";
import baseURL from "../api/base_url";
import { useTracksStore } from "../store/tracks";
import { useCodecConversionsStore } from "../store/codec_conversions";
import { useAuthStore } from "../store/auth";

export function usePlayer() {
  const authStore = useAuthStore();
  const codecConversionsStore = useCodecConversionsStore();
  const tracksStore = useTracksStore();
  const audio = ref(new Audio());
  const seekTime = ref(0);
  const trackID = ref(null);
  const intervalHandle = ref(null);
  const codecConversion = computed(
    () => codecConversionsStore.sortedCodecConversions[0],
  );

  const currentTrackURL = computed(() => {
    const apiToken = authStore.apiToken;
    let params = `/audio?token=${apiToken}`;
    if (codecConversion.value) {
      params += `&codec_conversion_id=${codecConversion.value.id}`;
    }
    const tracks = `${baseURL}/tracks/`;
    return `${tracks}${trackID.value}${params}`;
  });

  watch(currentTrackURL, (newValue) => {
    if (intervalHandle.value) {
      clearInterval(intervalHandle);
    }
    audio.value.setAttribute("src", newValue);
    intervalHandle.value = setInterval(checkTime, 100);
  });

  // We want to start a track at 1/3 to make sure that the song has started
  const startTime = computed(() =>
    Math.floor(tracksStore.tracks[`${trackID.value}`].length / 3),
  );

  function play() {
    if (Number.isFinite(startTime.value)) {
      audio.value.currentTime = startTime.value;
      audio.value.play();
    }
  }

  function stop() {
    audio.value.pause();
  }

  // Convert currentTime back to countdown
  function checkTime() {
    const time = Math.floor(audio.value.currentTime) - startTime.value;
    if (time !== seekTime.value) {
      seekTime.value = time;
    }
  }

  onBeforeUnmount(() => {
    clearInterval(intervalHandle.value);
    stop();
  });

  return {
    trackID,
    play,
    seekTime,
    stop,
  };
}
