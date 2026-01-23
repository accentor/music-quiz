<template>
  <div class="max-w-4xl w-full mx-auto">
    <div>
      <h2 class="font-bold text-center text-3xl tex-gray-800">
        <span v-if="score === null"> Which track is this? </span>
        <span v-else-if="score > 0"> Correct! </span>
        <span v-else> Wrong! </span>
      </h2>
      <div class="options grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <button
          v-for="option in options"
          :key="option.id"
          class="bg-secundary rounded-xl font-medium text-white px-8 py-4 truncate hover:bg-primary"
          :class="{
            'correct-answer': score !== null && option.id === correctOption.id,
            'wrong-answer': score === 0 && option.id === selected,
          }"
          @click="selected = option.id"
        >
          {{ option.title }}
        </button>
      </div>
      <div class="space-y-2 text-center w-1/2 mx-auto">
        <p>{{ 15 - seekTime }} seconds remaining</p>
        <span
          class="bg-accent h-4 block"
          :style="{ width: `${100 - (100 / 15) * seekTime}%` }"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { usePlayer } from "../lib/player";
import { useTracksStore } from "../store/tracks";

export default {
  name: "Question",
  props: {
    usedTracks: {
      type: Array,
      default: () => [],
    },
    difficulty: {
      type: String,
      required: true,
    },
  },
  emits: ["answered"],
  setup(props, context) {
    const trackStore = useTracksStore();
    const score = ref(null);
    const options = ref([]);
    const correctOption = ref();
    const selected = ref();

    const tracks = computed(() => {
      let t;
      switch (props.difficulty) {
        case "hard":
          t = trackStore.randomTracks;
          break;
        case "medium":
          t = trackStore.tracksWithoutReviewComment;
          break;
        case "easy":
          t = trackStore.tracksPlayedOnce;
          break;
      }
      return t.filter((t) => !props.usedTracks.includes(t.id));
    });

    options.value = tracks.value.slice(-4);

    correctOption.value = options.value[Math.floor(Math.random() * 4)];

    const { trackID, play, seekTime, stop } = usePlayer();
    trackID.value = correctOption.value.id;
    onMounted(play);

    watch(seekTime, (newValue) => {
      if (newValue >= 15) {
        selected.value = -1;
      }
    });

    watch(selected, (newValue) => {
      stop();
      const currentScore =
        correctOption.value.id === newValue ? 15 - seekTime.value : 0;
      score.value = currentScore;
      context.emit("answered", {
        score: score.value,
        usedTracks: options.value.map((t) => t.id),
      });
    });

    return { options, correctOption, score, selected, seekTime };
  },
};
</script>

<style scoped>
.correct-answer {
  @apply ring-4 ring-offset-4 ring-offset-white ring-green-600;
}

.wrong-answer {
  @apply ring-4 ring-offset-4 ring-offset-white ring-accent;
}
</style>
