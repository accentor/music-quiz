import { computed, ref, watch, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import baseURL from "../api/base_url";

export function usePlayer() {
  const store = useStore();
  const audio = ref(new Audio());
  const seekTime = ref(0);
  const trackID = ref(null);
  const codecConversion = computed(
    () => store.getters["codec_conversions/codecConversions"][0]
  );

  const currentTrackURL = computed(() => {
    const secret = store.state.auth.secret;
    const device_id = store.state.auth.device_id;
    let params = `/audio?secret=${secret}&device_id=${device_id}`;
    if (codecConversion.value) {
      params += `&codec_conversion_id=${codecConversion.value.id}`;
    }
    const tracks = `${baseURL}/tracks/`;
    return `${tracks}${trackID.value}${params}`;
  });

  watch(currentTrackURL, (newValue) => {
    audio.value.setAttribute("src", newValue);
    audio.value.load();
  });

  // We want to start a track at 1/3 to make sure that the song has started
  const startTime = computed(() =>
    Math.floor(store.state.tracks.tracks[trackID.value].length / 3)
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

  const intervalHandle = setInterval(checkTime, 100);
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
